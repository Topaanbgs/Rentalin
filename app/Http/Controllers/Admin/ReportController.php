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
     * Display report dashboard with summarized statistics.
     */
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = Auth::user();
        $staffName = $user->name;

        // Define report date range
        $dateFrom = $request->input('date_from', now()->startOfMonth()->toDateString());
        $dateTo = $request->input('date_to', now()->endOfDay()->toDateString());

        // Fetch transactions within the date range
        $transactions = Transaction::with(['user', 'rentalUnit', 'payment'])
            ->whereBetween('created_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59'])
            ->get();

        // Extract transaction IDs
        $transactionIds = $transactions->pluck('id');

        // Calculate total revenue from successful payments
        $totalRevenue = Payment::whereIn('transaction_id', $transactionIds)
            ->where('payment_status', 'success')
            ->sum('amount');

        // Calculate key transaction metrics
        $totalTransactions = $transactions->count();
        $completedTransactions = $transactions->where('status', 'completed')->count();

        $averageTransactionValue = $totalTransactions > 0 
            ? round($totalRevenue / $totalTransactions, 0) 
            : 0;

        // Calculate revenue breakdown per payment method
        $paymentBreakdown = [
            'direct' => Payment::whereIn('transaction_id', 
                $transactions->where('payment_method', 'direct')->pluck('id'))
                ->where('payment_status', 'success')
                ->sum('amount'),
            'balance' => Payment::whereIn('transaction_id', 
                $transactions->where('payment_method', 'balance')->pluck('id'))
                ->where('payment_status', 'success')
                ->sum('amount'),
            'paylater' => Payment::whereIn('transaction_id', 
                $transactions->where('payment_method', 'paylater')->pluck('id'))
                ->where('payment_status', 'success')
                ->sum('amount'),
            'cash' => Payment::whereIn('transaction_id', 
                $transactions->where('payment_method', 'cash')->pluck('id'))
                ->where('payment_status', 'success')
                ->sum('amount'),
        ];

        // Sum all outstanding paylater invoices
        $outstandingPaylater = PaylaterInvoice::whereIn('status', ['unpaid', 'overdue'])
            ->sum('total_amount');

        // Aggregate revenue by rental unit type
        $revenuePerUnitType = $transactions->groupBy(function($t) {
            return $t->rentalUnit->type ?? 'Unknown';
        })->map(function ($items, $type) {
            $successPayments = Payment::whereIn('transaction_id', $items->pluck('id'))
                ->where('payment_status', 'success')
                ->sum('amount');
            
            return [
                'unit_type' => $type,
                'total_bookings' => $items->count(),
                'total_revenue' => $successPayments,
            ];
        })->sortByDesc('total_revenue')->values();

        // Retrieve 20 most recent transactions
        $recentTransactions = $transactions->sortByDesc('created_at')->take(20)->map(function ($t) {
            return [
                'id' => $t->id,
                'member_name' => $t->customer_name ?: $t->user->name,
                'unit_name' => $t->rentalUnit->name,
                'duration' => $t->duration,
                'total_price' => $t->total_price,
                'payment_method' => $t->payment_method,
                'status' => $t->status,
                'payment_status' => $t->payment->payment_status ?? 'N/A',
                'created_at' => $t->created_at,
            ];
        })->values();

        // Render report view
        return Inertia::render('Admin/Reports/Index', [
            'stats' => [
                'total_revenue' => $totalRevenue,
                'total_transactions' => $totalTransactions,
                'completed_transactions' => $completedTransactions,
                'average_transaction_value' => $averageTransactionValue,
                'outstanding_paylater' => $outstandingPaylater,
            ],
            'payment_breakdown' => $paymentBreakdown,
            'revenue_per_unit_type' => $revenuePerUnitType,
            'recent_transactions' => $recentTransactions,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
            'staff_name' => $staffName,
        ]);
    }

    /**
     * Export financial report as Excel file.
     */
    public function export(Request $request): void
    {
        /** @var User $user */
        $user = Auth::user();
        $staffName = $user->name;

        // Define date range for export
        $dateFrom = $request->input('date_from', now()->startOfMonth()->toDateString());
        $dateTo = $request->input('date_to', now()->endOfDay()->toDateString());

        // Fetch transactions data for export
        $transactions = Transaction::with(['user', 'rentalUnit', 'payment'])
            ->whereBetween('created_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Initialize spreadsheet
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Header title
        $sheet->setCellValue('A1', 'LAPORAN KEUANGAN RENTALIN');
        $sheet->mergeCells('A1:I1');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(16);
        $sheet->getStyle('A1')->getAlignment()->setHorizontal('center');

        // Report metadata
        $sheet->setCellValue('A2', 'Staff: ' . $staffName);
        $sheet->setCellValue('A3', 'Periode: ' . Carbon::parse($dateFrom)->format('d M Y') . ' - ' . Carbon::parse($dateTo)->format('d M Y'));
        $sheet->setCellValue('A4', 'Dicetak: ' . now()->format('d M Y H:i:s') . ' WITA');

        // Calculate total revenue
        $totalRevenue = Payment::whereIn('transaction_id', $transactions->pluck('id'))
            ->where('payment_status', 'success')
            ->sum('amount');

        $sheet->setCellValue('A6', 'Total Pendapatan:');
        $sheet->setCellValue('B6', 'Rp ' . number_format((float)$totalRevenue, 0, ',', '.'));
        $sheet->getStyle('B6')->getFont()->setBold(true);

        // Define table headers
        $headerRow = 8;
        $headers = ['No', 'Tanggal', 'ID Transaksi', 'Customer', 'Unit', 'Durasi (mnt)', 'Total', 'Metode Bayar', 'Status'];
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

        // Insert transaction rows
        $row = $headerRow + 1;
        $no = 1;
        foreach ($transactions as $transaction) {
            $customerName = $transaction->customer_name ?: $transaction->user->name;
            
            $sheet->setCellValue('A' . $row, $no++);
            $sheet->setCellValue('B' . $row, $transaction->created_at->format('d/m/Y H:i'));
            $sheet->setCellValue('C' . $row, $transaction->id);
            $sheet->setCellValue('D' . $row, $customerName);
            $sheet->setCellValue('E' . $row, $transaction->rentalUnit->name);
            $sheet->setCellValue('F' . $row, $transaction->duration);
            $sheet->setCellValue('G' . $row, 'Rp ' . number_format((float)$transaction->total_price, 0, ',', '.'));
            $sheet->setCellValue('H' . $row, ucfirst($transaction->payment_method));
            $sheet->setCellValue('I' . $row, ucfirst(str_replace('_', ' ', $transaction->status)));
            $row++;
        }

        // Auto-size columns
        foreach (range('A', 'I') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        // Apply table borders
        $sheet->getStyle('A' . $headerRow . ':I' . ($row - 1))
            ->getBorders()
            ->getAllBorders()
            ->setBorderStyle(Border::BORDER_THIN);

        // Prepare file for download
        $fileName = 'Laporan_Keuangan_' . $staffName . '_' . date('d_M_Y') . '.xlsx';
        $writer = new Xlsx($spreadsheet);
        
        // Send Excel headers
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="' . $fileName . '"');
        header('Cache-Control: max-age=0');
        
        // Output Excel file
        $writer->save('php://output');
        exit;
    }
}
