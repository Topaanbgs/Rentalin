<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\{RentalUnit, Transaction, Payment, User};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, DB};
use Inertia\Inertia;

class BookingController extends Controller
{
    public function index()
    {
        $units = RentalUnit::where('status', 'available')->get();
        
        /** @var User $user */
        $user = Auth::user();
        
        return Inertia::render('Members/Order', [
            'units' => $units,
            'user' => $user->load('paylaterAccount'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'unit_id' => 'required|exists:rental_units,id',
            'duration' => 'required|integer|min:60|max:480',
            'start_time' => 'required|date|after:now',
            'payment_method' => 'required|in:direct,balance,paylater',
        ]);

        $unit = RentalUnit::findOrFail($validated['unit_id']);
        
        /** @var User $user */
        $user = Auth::user();
        
        $hours = ceil($validated['duration'] / 60);
        $totalPrice = $unit->hourly_rate * $hours;

        if ($validated['payment_method'] === 'balance' && $user->balance < $totalPrice) {
            return back()->with('error', 'Insufficient balance');
        }

        if ($validated['payment_method'] === 'paylater') {
            $available = $user->paylaterAccount->total_limit - $user->paylaterAccount->used_limit;
            if ($available < $totalPrice) {
                return back()->with('error', 'Insufficient paylater limit');
            }
        }

        try {
            DB::beginTransaction();

            $transaction = Transaction::create([
                'user_id' => $user->id,
                'rental_unit_id' => $unit->id,
                'duration' => $validated['duration'],
                'total_price' => $totalPrice,
                'payment_method' => $validated['payment_method'],
                'status' => 'pending_payment',
                'start_time' => $validated['start_time'],
            ]);

            Payment::create([
                'transaction_id' => $transaction->id,
                'amount' => $totalPrice,
                'payment_type' => $validated['payment_method'],
                'payment_status' => 'waiting',
            ]);

            DB::commit();

            return redirect()->route('member.payment', ['transaction' => $transaction->id])
                ->with('success', 'Booking created. Please complete payment.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Booking failed: ' . $e->getMessage());
        }
    }

    public function payment(Request $request)
    {
        $transactionId = $request->input('transaction');
        $transaction = Transaction::with('payment')->findOrFail($transactionId);

        if ($transaction->user_id !== Auth::id()) {
            abort(403);
        }

        /** @var User $user */
        $user = Auth::user();

        return Inertia::render('Members/Payment', [
            'transaction' => $transaction,
            'user' => $user->load('paylaterAccount'),
        ]);
    }

    public function processPayment(Request $request)
    {
        $validated = $request->validate([
            'transaction_id' => 'required|exists:transactions,id',
            'payment_method' => 'required|in:direct,balance,paylater',
        ]);

        $transaction = Transaction::with('payment')->findOrFail($validated['transaction_id']);
        
        /** @var User $user */
        $user = Auth::user();

        if ($transaction->user_id !== $user->id) {
            abort(403);
        }

        try {
            DB::beginTransaction();

            if ($validated['payment_method'] === 'balance') {
                $user->decrement('balance', (float)$transaction->total_price);
                
                $transaction->payment->update([
                    'payment_status' => 'success',
                    'paid_at' => now(),
                ]);

                $transaction->update([
                    'status' => 'grace_period_active',
                    'grace_period_expires_at' => $transaction->start_time->addMinutes(15),
                ]);

                $transaction->rentalUnit->update(['status' => 'booked']);
            }

            DB::commit();

            return redirect()->route('member.order.show', $transaction->id)
                ->with('success', 'Payment successful! Please arrive on time.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Payment failed: ' . $e->getMessage());
        }
    }

    public function show(Transaction $transaction)
    {
        if ($transaction->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Members/Order', [
            'transaction' => [
                'id' => $transaction->id,
                'qr_code' => $transaction->qr_code,
                'unit_name' => $transaction->rentalUnit->name,
                'status' => $transaction->status,
                'total_price' => $transaction->total_price,
                'start_time' => $transaction->start_time,
                'grace_period_expires_at' => $transaction->grace_period_expires_at,
            ],
        ]);
    }

    public function cancel(Transaction $transaction)
    {
        // TODO: Implement cancel logic
        return back()->with('error', 'Cancel not yet implemented');
    }
}