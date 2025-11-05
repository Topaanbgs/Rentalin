<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\{PaylaterInvoice, User, BalanceTransaction};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, DB};
use Inertia\Inertia;

class PaylaterController extends Controller
{
    /**
     * Display user's Paylater invoices and account details.
     */
    public function index()
    {
        /** @var User $user */
        $user = Auth::user();
        
        // Retrieve all invoices with related transactions
        $invoices = PaylaterInvoice::where('user_id', $user->id)
            ->with('paylaterTransactions.transaction.rentalUnit')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($inv) => [
                'id' => $inv->id,
                'invoice_number' => $inv->invoice_number,
                'total_amount' => $inv->total_amount,
                'paid_amount' => $inv->paid_amount,
                'remaining_amount' => $inv->remaining_amount,
                'status' => $inv->status,
                'due_date' => $inv->due_date,
                'transactions' => $inv->paylaterTransactions->map(fn($pt) => [
                    'unit_name' => $pt->transaction->rentalUnit->name,
                    'amount' => $pt->amount,
                    'date' => $pt->created_at,
                ]),
            ]);

        // Render paylater dashboard
        return Inertia::render('Members/Paylater', [
            'invoices' => $invoices,
            'paylater_account' => $user->paylaterAccount,
            'user' => [
                'balance' => $user->balance,
            ],
        ]);
    }

    /**
     * Handle Paylater invoice payment process.
     */
    public function pay(Request $request, PaylaterInvoice $invoice)
    {
        // Validate payment method input
        $validated = $request->validate([
            'payment_method' => 'required|in:qris,balance',
        ]);

        /** @var User $user */
        $user = Auth::user();

        // Prevent unauthorized access
        if ($invoice->user_id !== $user->id) {
            abort(403);
        }

        // Check payment status
        if ($invoice->status === 'paid') {
            return back()->with('info', 'Invoice sudah dibayar');
        }

        // Validate sufficient balance if using balance
        if ($validated['payment_method'] === 'balance' && $user->balance < $invoice->remaining_amount) {
            return back()->with('error', 'Saldo tidak mencukupi untuk membayar invoice ini');
        }

        try {
            DB::beginTransaction();

            // Simulate short payment process delay
            sleep(2);

            // Process balance payment
            if ($validated['payment_method'] === 'balance') {
                $user->decrement('balance', (float)$invoice->remaining_amount);
                
                BalanceTransaction::create([
                    'user_id' => $user->id,
                    'type' => 'debit',
                    'amount' => $invoice->remaining_amount,
                    'description' => 'Pembayaran Invoice ' . $invoice->invoice_number,
                    'reference' => $invoice->invoice_number,
                    'metadata' => [
                        'invoice_id' => $invoice->id,
                        'payment_method' => 'balance',
                    ],
                ]);
            }

            // Update paylater usage and invoice status
            $user->paylaterAccount->decrement('used_limit', (float)$invoice->remaining_amount);

            $invoice->update([
                'paid_amount' => $invoice->total_amount,
                'remaining_amount' => 0,
                'status' => 'paid',
                'paid_at' => now(),
            ]);

            DB::commit();

            // Redirect with success message
            return redirect()->route('member.paylater')
                ->with('success', 'Pembayaran invoice berhasil!');

        } catch (\Exception $e) {
            DB::rollBack();
            // Return error if payment fails
            return back()->with('error', 'Pembayaran gagal: ' . $e->getMessage());
        }
    }
}
