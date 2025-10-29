<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Payment;
use App\Models\RentalUnit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::with(['user', 'rentalUnit', 'payment']);

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->has('date_from') && $request->date_from) {
            $query->whereDate('start_time', '>=', $request->date_from);
        }
        if ($request->has('date_to') && $request->date_to) {
            $query->whereDate('start_time', '<=', $request->date_to);
        }

        // Filter by payment method
        if ($request->has('payment_method') && $request->payment_method !== 'all') {
            $query->where('payment_method', $request->payment_method);
        }

        $transactions = $query->orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'qr_code' => $transaction->qr_code,
                    'member' => [
                        'id' => $transaction->user->id,
                        'name' => $transaction->user->name,
                        'phone' => $transaction->user->phone_number,
                    ],
                    'unit' => [
                        'id' => $transaction->rentalUnit->id,
                        'name' => $transaction->rentalUnit->name,
                        'type' => $transaction->rentalUnit->type,
                    ],
                    'duration' => $transaction->duration,
                    'total_price' => $transaction->total_price,
                    'payment_method' => $transaction->payment_method,
                    'status' => $transaction->status,
                    'payment_status' => $transaction->payment->payment_status ?? 'N/A',
                    'start_time' => $transaction->start_time,
                    'checked_in_at' => $transaction->checked_in_at,
                    'completed_at' => $transaction->completed_at,
                    'created_at' => $transaction->created_at,
                ];
            });

        return Inertia::render('Admin/Transactions/Index', [
            'transactions' => $transactions,
            'filters' => $request->only(['status', 'date_from', 'date_to', 'payment_method']),
        ]);
    }

    public function show(Transaction $transaction)
    {
        $transaction->load(['user', 'rentalUnit', 'payment', 'paylaterTransaction.paylaterInvoice']);

        $data = [
            'id' => $transaction->id,
            'qr_code' => $transaction->qr_code,
            'member' => [
                'id' => $transaction->user->id,
                'name' => $transaction->user->name,
                'email' => $transaction->user->email,
                'phone' => $transaction->user->phone_number,
                'balance' => $transaction->user->balance,
            ],
            'unit' => [
                'id' => $transaction->rentalUnit->id,
                'name' => $transaction->rentalUnit->name,
                'type' => $transaction->rentalUnit->type,
                'hourly_rate' => $transaction->rentalUnit->hourly_rate,
            ],
            'duration' => $transaction->duration,
            'total_price' => $transaction->total_price,
            'payment_method' => $transaction->payment_method,
            'status' => $transaction->status,
            'start_time' => $transaction->start_time,
            'grace_period_expires_at' => $transaction->grace_period_expires_at,
            'checked_in_at' => $transaction->checked_in_at,
            'completed_at' => $transaction->completed_at,
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
        ];

        return Inertia::render('Admin/Transactions/Show', [
            'transaction' => $data,
        ]);
    }

    public function checkIn(Request $request, Transaction $transaction)
    {
        if (!$transaction->isGracePeriodActive() && !$transaction->isConfirmed()) {
            return back()->with('error', 'Transaction is not eligible for check-in');
        }

        DB::transaction(function () use ($transaction) {
            $transaction->update([
                'status' => 'checked_in',
                'checked_in_at' => now(),
            ]);

            $transaction->rentalUnit->update(['status' => 'in_use']);
        });

        return back()->with('success', 'Member checked in successfully');
    }

    public function complete(Transaction $transaction)
    {
        if (!$transaction->isCheckedIn()) {
            return back()->with('error', 'Transaction is not checked in');
        }

        DB::transaction(function () use ($transaction) {
            $transaction->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            $transaction->rentalUnit->update(['status' => 'available']);
        });

        return back()->with('success', 'Transaction completed successfully');
    }

    public function validatePayment(Request $request, Transaction $transaction)
    {
        $payment = $transaction->payment;

        if (!$payment || $payment->isSuccess()) {
            return back()->with('error', 'Payment already validated or not found');
        }

        DB::transaction(function () use ($transaction, $payment) {
            $payment->update([
                'payment_status' => 'success',
                'paid_at' => now(),
            ]);

            $transaction->update([
                'status' => 'grace_period_active',
                'grace_period_expires_at' => $transaction->start_time->addMinutes(15),
            ]);

            if ($transaction->payment_method !== 'paylater') {
                $transaction->rentalUnit->update(['status' => 'booked']);
            }
        });

        return back()->with('success', 'Payment validated successfully');
    }
}