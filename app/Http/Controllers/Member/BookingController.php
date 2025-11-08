<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\{RentalUnit, Transaction, Payment, User, BalanceTransaction};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, DB};
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Display all booking transactions for the authenticated user.
     */
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
                'total_price' => (float) $t->total_price,
                'payment_method' => $t->payment_method,
                'status' => $t->status,
                'created_at' => $t->created_at,
                'start_time' => $t->start_time,
            ]);

        return Inertia::render('Members/Order', [
            'transactions' => $transactions,
        ]);
    }

    /**
     * Create a new booking transaction.
     */
    public function store(Request $request)
    {
        // Validate user input
        $validated = $request->validate([
            'unit_id' => 'required|exists:rental_units,id',
            'duration' => 'required|integer|min:60|max:480',
            'start_time' => 'required|date',
        ]);

        $unit = RentalUnit::findOrFail($validated['unit_id']);
        /** @var User $user */
        $user = Auth::user();

        // Calculate total price based on duration
        $hours = ceil($validated['duration'] / 60);
        $totalPrice = (float) ($unit->hourly_rate * $hours);

        try {
            DB::beginTransaction();

            // Create booking transaction
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

            // Initialize payment record
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

    /**
     * Display payment page for a specific transaction.
     */
    public function payment(Request $request)
    {
        $transactionId = $request->input('transaction');
        $transaction = Transaction::with(['rentalUnit', 'payment'])->findOrFail($transactionId);

        // Restrict access to the transaction owner
        if ($transaction->user_id !== Auth::id()) {
            abort(403);
        }

        /** @var User $user */
        $user = Auth::user();

        return Inertia::render('Members/Payment', [
            'transaction' => [
                'id' => $transaction->id,
                'booking_code' => $transaction->booking_code,
                'duration' => $transaction->duration,
                'total_price' => (float) $transaction->total_price,
                'payment_method' => $transaction->payment_method,
                'status' => $transaction->status,
                'rental_unit' => [
                    'id' => $transaction->rentalUnit->id,
                    'name' => $transaction->rentalUnit->name,
                    'type' => $transaction->rentalUnit->type,
                ],
                'payment' => $transaction->payment,
            ],
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'balance' => (float) $user->balance,
                'paylater_account' => $user->paylaterAccount ? [
                    'total_limit' => (float) $user->paylaterAccount->total_limit,
                    'used_limit' => (float) $user->paylaterAccount->used_limit,
                    'available_limit' => (float) $user->paylaterAccount->available_limit,
                    'trust_score' => $user->paylaterAccount->trust_score,
                    'status' => $user->paylaterAccount->status,
                ] : null,
            ],
        ]);
    }

    /**
     * Process user payment based on selected method.
     */
    public function processPayment(Request $request)
    {
        // Validate payment request
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

        // Prevent reprocessing if payment already succeeded
        if ($transaction->payment->payment_status === 'success') {
            return redirect()->route('member.dashboard')
                ->with('info', 'Pembayaran sudah berhasil sebelumnya');
        }

        $totalPrice = (float) $transaction->total_price;
        $userBalance = (float) $user->balance;

        try {
            DB::beginTransaction();

            // Update payment method
            $transaction->update(['payment_method' => $validated['payment_method']]);
            $transaction->payment->update(['payment_type' => $validated['payment_method']]);

            switch ($validated['payment_method']) {
                case 'balance':
                    // Process payment using account balance
                    if ($userBalance < $totalPrice) {
                        DB::rollBack();
                        return back()->with('error', 'Saldo tidak mencukupi');
                    }

                    sleep(2);
                    $user->decrement('balance', $totalPrice);
                    
                    BalanceTransaction::create([
                        'user_id' => $user->id,
                        'type' => 'debit',
                        'amount' => $totalPrice,
                        'description' => 'Sewa ' . $transaction->rentalUnit->name,
                        'reference' => $transaction->booking_code,
                        'metadata' => [
                            'transaction_id' => $transaction->id,
                            'unit_name' => $transaction->rentalUnit->name,
                        ],
                    ]);
                    break;

                case 'paylater':
                    // Handle Paylater payment
                    $paylaterAccount = $user->paylaterAccount;
                    if (!$paylaterAccount) {
                        DB::rollBack();
                        return back()->with('error', 'Akun paylater belum aktif');
                    }

                    $available = (float) ($paylaterAccount->total_limit - $paylaterAccount->used_limit);
                    if ($available < $totalPrice) {
                        DB::rollBack();
                        return back()->with('error', 'Limit paylater tidak mencukupi');
                    }

                    sleep(2);
                    $paylaterAccount->increment('used_limit', $totalPrice);

                    // Attach transaction to Paylater invoice
                    $invoice = \App\Models\PaylaterInvoice::firstOrCreate(
                        [
                            'user_id' => $user->id,
                            'status' => 'unpaid',
                            'due_date' => now()->endOfMonth(),
                        ],
                        [
                            'total_amount' => 0,
                            'paid_amount' => 0,
                        ]
                    );

                    \App\Models\PaylaterTransaction::create([
                        'paylater_invoice_id' => $invoice->id,
                        'transaction_id' => $transaction->id,
                        'amount' => $totalPrice,
                    ]);

                    $invoice->increment('total_amount', $totalPrice);
                    break;

                case 'qris':
                    // Simulate QRIS payment
                    sleep(2);
                    break;
            }

            // Finalize payment and update statuses
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

    /**
     * Show details for a specific transaction.
     */
    public function show(Transaction $transaction)
    {
        // Restrict access to the transaction owner
        if ($transaction->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Members/OrderDetail', [
            'transaction' => [
                'id' => $transaction->id,
                'booking_code' => $transaction->booking_code,
                'unit_name' => $transaction->rentalUnit->name,
                'status' => $transaction->status,
                'total_price' => (float) $transaction->total_price,
                'duration' => $transaction->duration,
                'payment_method' => $transaction->payment_method,
                'start_time' => $transaction->start_time,
                'grace_period_expires_at' => $transaction->grace_period_expires_at,
                'created_at' => $transaction->created_at,
            ],
        ]);
    }

    /**
     * Cancel an active or pending booking.
     */
    public function cancel(Transaction $transaction)
    {
        if ($transaction->user_id !== Auth::id()) {
            abort(403);
        }

        // Allow cancellation only for specific statuses
        if (!in_array($transaction->status, ['pending_payment', 'grace_period_active'])) {
            return back()->with('error', 'Transaksi tidak dapat dibatalkan');
        }

        $totalPrice = (float) $transaction->total_price;

        try {
            DB::beginTransaction();

            $transaction->update(['status' => 'cancelled']);
            $transaction->rentalUnit->update(['status' => 'available']);

            // Handle refund if payment was successful
            if ($transaction->payment->payment_status === 'success') {
                if ($transaction->payment_method === 'balance') {
                    $transaction->user->increment('balance', $totalPrice);
                    
                    BalanceTransaction::create([
                        'user_id' => $transaction->user_id,
                        'type' => 'credit',
                        'amount' => $totalPrice,
                        'description' => 'Refund ' . $transaction->rentalUnit->name,
                        'reference' => $transaction->booking_code,
                        'metadata' => [
                            'transaction_id' => $transaction->id,
                            'reason' => 'cancelled',
                        ],
                    ]);
                } elseif ($transaction->payment_method === 'paylater') {
                    $transaction->user->paylaterAccount->decrement('used_limit', $totalPrice);
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
