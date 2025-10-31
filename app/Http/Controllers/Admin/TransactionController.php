<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::with(['user', 'rentalUnit', 'payment']);

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('start_time', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('start_time', '<=', $request->date_to);
        }

        if ($request->filled('payment_method') && $request->payment_method !== 'all') {
            $query->where('payment_method', $request->payment_method);
        }

        $transactions = $query->orderByDesc('created_at')
            ->paginate(20)
            ->through(fn($t) => [
                'id' => $t->id,
                'booking_code' => $t->booking_code,
                'member' => [
                    'id' => $t->user->id,
                    'name' => $t->user->name,
                    'phone' => $t->user->phone_number,
                ],
                'unit' => [
                    'id' => $t->rentalUnit->id,
                    'name' => $t->rentalUnit->name,
                    'type' => $t->rentalUnit->type,
                ],
                'duration' => $t->duration,
                'total_price' => $t->total_price,
                'payment_method' => $t->payment_method,
                'status' => $t->status,
                'payment_status' => $t->payment->payment_status ?? 'N/A',
                'start_time' => $t->start_time,
                'checked_in_at' => $t->checked_in_at,
                'completed_at' => $t->completed_at,
                'created_at' => $t->created_at,
            ]);

        return Inertia::render('Admin/Transactions/Index', [
            'transactions' => $transactions,
            'filters' => $request->only(['status', 'date_from', 'date_to', 'payment_method']),
        ]);
    }

    public function show(Transaction $transaction)
    {
        $transaction->load(['user', 'rentalUnit', 'payment', 'paylaterTransaction.paylaterInvoice']);

        return Inertia::render('Admin/Transactions/Show', [
            'transaction' => [
                'id' => $transaction->id,
                'booking_code' => $transaction->booking_code,
                'member' => [
                    'name' => $transaction->user->name,
                    'email' => $transaction->user->email,
                    'phone' => $transaction->user->phone_number,
                    'balance' => $transaction->user->balance,
                ],
                'unit' => [
                    'name' => $transaction->rentalUnit->name,
                    'type' => $transaction->rentalUnit->type,
                    'hourly_rate' => $transaction->rentalUnit->hourly_rate,
                ],
                'duration' => $transaction->duration,
                'total_price' => $transaction->total_price,
                'payment_method' => $transaction->payment_method,
                'status' => $transaction->status,
                'start_time' => $transaction->start_time,
                'checked_in_at' => $transaction->checked_in_at,
                'completed_at' => $transaction->completed_at,
                'created_at' => $transaction->created_at,
                'payment' => $transaction->payment ? [
                    'amount' => $transaction->payment->amount,
                    'payment_type' => $transaction->payment->payment_type,
                    'payment_status' => $transaction->payment->payment_status,
                    'reference' => $transaction->payment->reference,
                    'paid_at' => $transaction->payment->paid_at,
                ] : null,
                'paylater_info' => $transaction->paylaterTransaction ? [
                    'invoice_number' => $transaction->paylaterTransaction->paylaterInvoice->invoice_number,
                    'invoice_status' => $transaction->paylaterTransaction->paylaterInvoice->status,
                    'due_date' => $transaction->paylaterTransaction->paylaterInvoice->due_date,
                ] : null,
            ],
        ]);
    }

    public function checkIn(Transaction $transaction)
    {
        if (!$transaction->isGracePeriodActive()) {
            return back()->with('error', 'Transaction not eligible for check-in.');
        }

        DB::transaction(function () use ($transaction) {
            $transaction->update([
                'status' => 'checked_in',
                'checked_in_at' => now(),
            ]);
            $transaction->rentalUnit->update(['status' => 'in_use']);
        });

        return back()->with('success', 'Member checked in successfully.');
    }

    public function complete(Transaction $transaction)
    {
        if (!$transaction->isCheckedIn()) {
            return back()->with('error', 'Transaction not checked in.');
        }

        DB::transaction(function () use ($transaction) {
            $completedAt = $transaction->checked_in_at
                ? $transaction->checked_in_at->copy()->addMinutes($transaction->duration)
                : now();

            $transaction->update([
                'status' => 'completed',
                'completed_at' => $completedAt,
            ]);

            $transaction->rentalUnit->update(['status' => 'available']);
        });

        return back()->with('success', 'Transaction completed.');
    }

    public function validatePayment(Transaction $transaction)
    {
        $payment = $transaction->payment;

        if (!$payment || $payment->payment_status === 'success') {
            return back()->with('error', 'Payment already validated or not found.');
        }

        DB::transaction(function () use ($transaction, $payment) {
            $payment->update([
                'payment_status' => 'success',
                'paid_at' => now(),
            ]);

            $transaction->update([
                'status' => 'grace_period_active',
                'start_time' => now(),
                'grace_period_expires_at' => now()->addMinutes(15),
            ]);

            if (!in_array($transaction->payment_method, ['paylater', 'cash'])) {
                $transaction->rentalUnit->update(['status' => 'booked']);
            }
        });

        return back()->with('success', 'Payment validated successfully.');
    }
}
