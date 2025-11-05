<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Payment;
use App\Models\PaylaterInvoice;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Display the financial report dashboard
     */
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = Auth::user();
        $staffId = $user->id;
        $staffName = $user->name;

        // Define date range filter
        $dateFrom = $request->input('date_from', now()->startOfDay()->toDateString());
        $dateTo = $request->input('date_to', now()->endOfDay()->toDateString());

        // Build base query for transactions
        $query = Transaction::with(['user', 'rentalUnit', 'payment'])
            ->whereBetween('created_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59']);

        // Filter transactions by staff if applicable
        if (Transaction::whereNotNull('created_by_staff_id')->exists()) {
            $query->where('created_by_staff_id', $staffId);
        }

        $transactions = $query->get();

        // Calculate general statistics
        $totalRevenue = Payment::whereIn('transaction_id', $transactions->pluck('id'))
            ->where('payment_status', 'success')
            ->sum('amount');

        $totalTransactions = $transactions->count();
        $completedTransactions = $transactions->where('status', 'completed')->count();

        // Compute success rate
        $successRate = $totalTransactions > 0 
            ? round(($completedTransactions / $totalTransactions) * 100, 2) 
            : 0;

        // Breakdown by payment method
        $paymentBreakdown = [
            'direct' => Payment::whereIn('transaction_id', $transactions->where('payment_method', 'direct')->pluck('id'))
                ->where('payment_status', 'success')
                ->sum('amount'),
            'balance' => Payment::whereIn('transaction_id', $transactions->where('payment_method', 'balance')->pluck('id'))
                ->where('payment_status', 'success')
                ->sum('amount'),
            'paylater' => Payment::whereIn('transaction_id', $transactions->where('payment_method', 'paylater')->pluck('id'))
                ->where('payment_status', 'success')
                ->sum('amount'),
        ];

        // Outstanding paylater invoices
        $outstandingPaylater = PaylaterInvoice::whereIn('status', ['unpaid', 'overdue'])
            ->sum('total_amount');

        // Aggregate revenue by rental unit
        $revenuePerUnit = $transactions->groupBy('rental_unit_id')->map(function ($items) {
            return [
                'unit_name' => $items->first()->rentalUnit->name,
                'total_bookings' => $items->count(),
                'total_revenue' => $items->sum('total_price'),
            ];
        })->sortByDesc('total_revenue')->values();

        // Prepare recent transactions summary
        $recentTransactions = $transactions->sortByDesc('created_at')->take(20)->map(function ($t) {
            return [
                'id' => $t->id,
                'member_name' => $t->user->name,
                'unit_name' => $t->rentalUnit->name,
                'duration' => $t->duration,
                'total_price' => $t->total_price,
                'payment_method' => $t->payment_method,
                'status' => $t->status,
                'payment_status' => $t->payment->payment_status ?? 'N/A',
                'created_at' => $t->created_at,
            ];
        })->values();

        // Render data to frontend
        return Inertia::render('Admin/Reports/Index', [
            'stats' => [
                'total_revenue' => $totalRevenue,
                'total_transactions' => $totalTransactions,
                'completed_transactions' => $completedTransactions,
                'success_rate' => $successRate,
                'outstanding_paylater' => $outstandingPaylater,
            ],
            'payment_breakdown' => $paymentBreakdown,
            'revenue_per_unit' => $revenuePerUnit,
            'recent_transactions' => $recentTransactions,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
            'staff_name' => $staffName,
        ]);
    }

    /**
     * Export the financial report as Excel file
     */
    public function export(Request $request): void
    {
        /** @var User $user */
        $user = Auth::user();
        $staffId = $user->id;
        $staffName = $user->name;

        // Define date range filter
        $dateFrom = $request->input('date_from', now()->startOfDay()->toDateString());
        $dateTo = $request->input('date_to', now()->endOfDay()->toDateString());

        // Fetch transactions for export
        $query = Transaction::with(['user', 'rentalUnit', 'payment'])
            ->whereBetween('created_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59']);

        if (Transaction::whereNotNull('created_by_staff_id')->exists()) {
            $query->where('created_by_staff_id', $staffId);
        }

        $transactions = $query->orderBy('created_at', 'desc')->get();

        // Initialize spreadsheet
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Report header section
        $sheet->setCellValue('A1', 'LAPORAN KEUANGAN RENTALIN');
        $sheet->mergeCells('A1:H1');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(16);
        $sheet->getStyle('A1')->getAlignment()->setHorizontal('center');

        // Meta information
        $sheet->setCellValue('A2', 'Staff: ' . $staffName);
        $sheet->setCellValue('A3', 'Periode: ' . Carbon::parse($dateFrom)->format('d M Y') . ' - ' . Carbon::parse($dateTo)->format('d M Y'));
        $sheet->setCellValue('A4', 'Dicetak: ' . now()->format('d M Y H:i:s').' WITA');

        // Display total revenue
        $totalRevenue = $transactions->sum('total_price');
        $sheet->setCellValue('A6', 'Total Pendapatan:');
        $sheet->setCellValue('B6', 'Rp ' . number_format((float)$totalRevenue, 0, ',', '.'));
        $sheet->getStyle('B6')->getFont()->setBold(true);

        // Table headers
        $headerRow = 8;
        $headers = ['No', 'Tanggal', 'ID Transaksi', 'Member', 'Unit', 'Durasi (mnt)', 'Total', 'Metode Bayar', 'Status'];
        $column = 'A';

        foreach ($headers as $header) {
            $sheet->setCellValue($column . $headerRow, $header);
            $sheet->getStyle($column . $headerRow)->getFont()->setBold(true);
            $sheet->getStyle($column . $headerRow)->getFill()
                ->setFillType(Fill::FILL_SOLID)
                ->getStartColor()->setRGB('0066CC');
            $sheet->getStyle($column . $headerRow)->getFont()->getColor()->setRGB('FFFFFF');
            $column++;
        }

        // Fill data rows
        $row = $headerRow + 1;
        $no = 1;
        foreach ($transactions as $transaction) {
            $sheet->setCellValue('A' . $row, $no++);
            $sheet->setCellValue('B' . $row, $transaction->created_at->format('d/m/Y H:i'));
            $sheet->setCellValue('C' . $row, $transaction->id);
            $sheet->setCellValue('D' . $row, $transaction->user->name);
            $sheet->setCellValue('E' . $row, $transaction->rentalUnit->name);
            $sheet->setCellValue('F' . $row, $transaction->duration);
            $sheet->setCellValue('G' . $row, 'Rp ' . number_format((float)$transaction->total_price, 0, ',', '.'));
            $sheet->setCellValue('H' . $row, ucfirst($transaction->payment_method));
            $sheet->setCellValue('I' . $row, ucfirst(str_replace('_', ' ', $transaction->status)));
            $row++;
        }

        // Adjust column width automatically
        foreach (range('A', 'I') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        // Apply border style to all cells
        $sheet->getStyle('A' . $headerRow . ':I' . ($row - 1))
            ->getBorders()
            ->getAllBorders()
            ->setBorderStyle(Border::BORDER_THIN);

        // Output as downloadable Excel file
        $fileName = 'Laporan_Keuangan_Rentalin_' . $staffName . '_' . date('d_M_Y') . '.xlsx';
        $writer = new Xlsx($spreadsheet);
        
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="' . $fileName . '"');
        header('Cache-Control: max-age=0');
        
        $writer->save('php://output');
        exit;
    }
}
