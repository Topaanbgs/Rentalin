<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\{RentalUnit, Transaction, Payment, User, BalanceTransaction};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, DB};
use Inertia\Inertia;

class BookingController extends Controller
{
    public function index()
    {
        $transactions = Transaction::where('user_id', Auth::id())
            ->with(['rentalUnit', 'payment'])
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->through(fn($t) => [
                'id' => $t->id,
                'booking_code' => $t->booking_code,
                'unit_name' => $t->rentalUnit->name,
                'duration' => $t->duration,
                'total_price' => $t->total_price,
                'payment_method' => $t->payment_method,
                'status' => $t->status,
                'created_at' => $t->created_at,
                'start_time' => $t->start_time,
            ]);

        return Inertia::render('Members/Order', [
            'transactions' => $transactions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'unit_id' => 'required|exists:rental_units,id',
            'duration' => 'required|integer|min:60|max:480',
            'start_time' => 'required|date',
        ]);

        $unit = RentalUnit::findOrFail($validated['unit_id']);
        
        /** @var User $user */
        $user = Auth::user();
        
        $hours = ceil($validated['duration'] / 60);
        $totalPrice = $unit->hourly_rate * $hours;

        try {
            DB::beginTransaction();

            $transaction = Transaction::create([
                'user_id' => $user->id,
                'rental_unit_id' => $unit->id,
                'duration' => $validated['duration'],
                'total_price' => $totalPrice,
                'payment_method' => 'qris',
                'status' => 'pending_payment',
                'start_time' => $validated['start_time'],
                'booking_code' => 'BK' . strtoupper(uniqid()),
            ]);

            Payment::create([
                'transaction_id' => $transaction->id,
                'amount' => $totalPrice,
                'payment_type' => 'qris',
                'payment_status' => 'waiting',
                'reference' => 'REF' . strtoupper(uniqid()),
            ]);

            DB::commit();

            return redirect()->route('member.payment', ['transaction' => $transaction->id])
                ->with('success', 'Booking berhasil. Silakan pilih metode pembayaran.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Booking gagal: ' . $e->getMessage());
        }
    }

    public function payment(Request $request)
    {
        $transactionId = $request->input('transaction');
        $transaction = Transaction::with(['rentalUnit', 'payment'])->findOrFail($transactionId);

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
            'payment_method' => 'required|in:qris,balance,paylater',
        ]);

        $transaction = Transaction::with(['payment', 'rentalUnit'])->findOrFail($validated['transaction_id']);
        
        /** @var User $user */
        $user = Auth::user();

        if ($transaction->user_id !== $user->id) {
            abort(403);
        }

        if ($transaction->payment->payment_status === 'success') {
            return redirect()->route('member.dashboard')
                ->with('info', 'Pembayaran sudah berhasil sebelumnya');
        }

        try {
            DB::beginTransaction();

            $transaction->update(['payment_method' => $validated['payment_method']]);
            $transaction->payment->update(['payment_type' => $validated['payment_method']]);

            switch ($validated['payment_method']) {
                case 'balance':
                    if ($user->balance < $transaction->total_price) {
                        DB::rollBack();
                        return back()->with('error', 'Saldo tidak mencukupi');
                    }

                    sleep(2);

                    $user->decrement('balance', (float)$transaction->total_price);
                    
                    BalanceTransaction::create([
                        'user_id' => $user->id,
                        'type' => 'debit',
                        'amount' => $transaction->total_price,
                        'description' => 'Sewa ' . $transaction->rentalUnit->name,
                        'reference' => $transaction->booking_code,
                        'metadata' => [
                            'transaction_id' => $transaction->id,
                            'unit_name' => $transaction->rentalUnit->name,
                        ],
                    ]);
                    break;

                case 'paylater':
                    $paylaterAccount = $user->paylaterAccount;
                    if (!$paylaterAccount) {
                        DB::rollBack();
                        return back()->with('error', 'Akun paylater belum aktif');
                    }

                    $available = $paylaterAccount->total_limit - $paylaterAccount->used_limit;
                    if ($available < $transaction->total_price) {
                        DB::rollBack();
                        return back()->with('error', 'Limit paylater tidak mencukupi');
                    }

                    sleep(2);

                    $paylaterAccount->increment('used_limit', (float)$transaction->total_price);
                    break;

                case 'qris':
                    sleep(2);
                    break;
            }

            $transaction->payment->update([
                'payment_status' => 'success',
                'paid_at' => now(),
            ]);

            $transaction->update([
                'status' => 'grace_period_active',
                'grace_period_expires_at' => now()->addMinutes(15),
            ]);

            $transaction->rentalUnit->update(['status' => 'booked']);

            DB::commit();

            return redirect()->route('member.dashboard')
                ->with('success', 'Pembayaran berhasil! Silakan datang tepat waktu.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Pembayaran gagal: ' . $e->getMessage());
        }
    }

    public function show(Transaction $transaction)
    {
        if ($transaction->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Members/OrderDetail', [
            'transaction' => [
                'id' => $transaction->id,
                'booking_code' => $transaction->booking_code,
                'unit_name' => $transaction->rentalUnit->name,
                'status' => $transaction->status,
                'total_price' => $transaction->total_price,
                'duration' => $transaction->duration,
                'payment_method' => $transaction->payment_method,
                'start_time' => $transaction->start_time,
                'grace_period_expires_at' => $transaction->grace_period_expires_at,
                'created_at' => $transaction->created_at,
            ],
        ]);
    }

    public function cancel(Transaction $transaction)
    {
        if ($transaction->user_id !== Auth::id()) {
            abort(403);
        }

        if (!in_array($transaction->status, ['pending_payment', 'grace_period_active'])) {
            return back()->with('error', 'Transaksi tidak dapat dibatalkan');
        }

        try {
            DB::beginTransaction();

            $transaction->update(['status' => 'cancelled']);
            $transaction->rentalUnit->update(['status' => 'available']);

            if ($transaction->payment->payment_status === 'success') {
                if ($transaction->payment_method === 'balance') {
                    $transaction->user->increment('balance', (float)$transaction->total_price);
                    
                    BalanceTransaction::create([
                        'user_id' => $transaction->user_id,
                        'type' => 'credit',
                        'amount' => $transaction->total_price,
                        'description' => 'Refund ' . $transaction->rentalUnit->name,
                        'reference' => $transaction->booking_code,
                        'metadata' => [
                            'transaction_id' => $transaction->id,
                            'reason' => 'cancelled',
                        ],
                    ]);
                } elseif ($transaction->payment_method === 'paylater') {
                    $transaction->user->paylaterAccount->decrement('used_limit', (float)$transaction->total_price);
                }
                
                $transaction->payment->update(['payment_status' => 'refunded']);
            }

            DB::commit();

            return redirect()->route('member.order')
                ->with('success', 'Booking berhasil dibatalkan');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal membatalkan booking: ' . $e->getMessage());
        }
    }
}