<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\RentalUnit;
use App\Models\User;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Display a paginated list of transactions with filters.
     */
    public function index(Request $request)
    {
        $query = Transaction::with(['user', 'rentalUnit', 'payment']);

        // Apply filters based on query parameters
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

        // Paginate and transform data for front-end
        $transactions = $query->orderByDesc('created_at')
            ->paginate(20)
            ->through(fn($t) => [
                'id' => $t->id,
                'booking_code' => $t->booking_code,
                'customer_name' => $t->customer_name ?: $t->user->name,
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

        // Retrieve available rental units for manual cash bookings
        $availableUnits = RentalUnit::where('status', 'available')
            ->orderBy('name')
            ->get(['id', 'name', 'type', 'hourly_rate']);

        return Inertia::render('Admin/Transactions/Index', [
            'transactions' => $transactions,
            'availableUnits' => $availableUnits,
            'filters' => $request->only(['status', 'date_from', 'date_to', 'payment_method']),
        ]);
    }

    /**
     * Create a new transaction with cash payment.
     */
    public function storeCash(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'rental_unit_id' => 'required|exists:rental_units,id',
            'duration_hours' => 'required|integer|min:1|max:5',
            'amount_paid' => 'required|numeric|min:0',
        ]);

        $unit = RentalUnit::findOrFail($validated['rental_unit_id']);
        
        // Check unit availability
        if ($unit->status !== 'available') {
            return back()->with('error', 'Unit not available');
        }

        $durationMinutes = $validated['duration_hours'] * 60;
        $totalPrice = $unit->hourly_rate * $validated['duration_hours'];

        // Validate payment amount
        if ($validated['amount_paid'] < $totalPrice) {
            return back()->with('error', 'Insufficient payment amount');
        }

        $change = $validated['amount_paid'] - $totalPrice;

        // Ensure guest user exists
        $guestUser = User::firstOrCreate(
            ['email' => 'guest@rentalin.system'],
            [
                'name' => 'Walk-in Guest',
                'password' => bcrypt('guest-system'),
                'phone_number' => '000000000000',
                'role' => 'member',
            ]
        );

        // Process transaction and payment atomically
        try {
            DB::transaction(function () use ($validated, $unit, $totalPrice, $durationMinutes, $guestUser) {
                $transaction = Transaction::create([
                    'user_id' => $guestUser->id,
                    'rental_unit_id' => $validated['rental_unit_id'],
                    'booking_code' => 'CASH-' . strtoupper(uniqid()),
                    'customer_name' => trim($validated['customer_name']),
                    'duration' => $durationMinutes,
                    'total_price' => $totalPrice,
                    'payment_method' => 'cash',
                    'status' => 'checked_in',
                    'start_time' => now(),
                    'checked_in_at' => now(),
                    'created_by_staff_id' => Auth::id(),
                ]);

                Payment::create([
                    'transaction_id' => $transaction->id,
                    'amount' => $totalPrice,
                    'payment_type' => 'cash',
                    'payment_status' => 'success',
                    'reference' => 'CASH-' . $transaction->id,
                    'paid_at' => now(),
                ]);

                $unit->update(['status' => 'in_use']);
            });

            return back()->with('success', "Transaction created. Change: Rp " . number_format($change, 0, ',', '.'));
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to create transaction: ' . $e->getMessage());
        }
    }

    /**
     * Display detailed information for a specific transaction.
     */
    public function show(Transaction $transaction)
    {
        $transaction->load(['user', 'rentalUnit', 'payment', 'paylaterTransaction.paylaterInvoice']);

        return Inertia::render('Admin/Transactions/Show', [
            'transaction' => [
                'id' => $transaction->id,
                'booking_code' => $transaction->booking_code,
                'customer_name' => $transaction->customer_name,
                'member' => [
                    'name' => $transaction->customer_name ?: $transaction->user->name,
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

    /**
     * Check-in a member and update transaction status.
     */
    public function checkIn(Transaction $transaction)
    {
        if ($transaction->status !== 'grace_period_active') {
            return back()->with('error', 'Transaction not eligible for check-in');
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

    /**
     * Complete a transaction and release the rental unit.
     */
    public function complete(Transaction $transaction)
    {
        if ($transaction->status !== 'checked_in') {
            return back()->with('error', 'Transaction not checked in');
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

        return back()->with('success', 'Transaction completed');
    }
}
