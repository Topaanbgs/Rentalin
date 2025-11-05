<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\{BalanceTransaction, Transaction, User};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, DB};
use Inertia\Inertia;

class BalanceController extends Controller
{
    // Display user's balance and latest transactions
    public function index()
    {
        /** @var User $user */
        $user = Auth::user();
        
        // Fetch latest 10 balance transactions
        $balanceTransactions = BalanceTransaction::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'type' => $t->type,
                'amount' => $t->amount,
                'description' => $t->description,
                'created_at' => $t->created_at,
            ]);
        
        // Render Saldo page
        return Inertia::render('Members/Saldo', [
            'balance' => $user->balance,
            'transactions' => $balanceTransactions,
        ]);
    }

    // Handle top-up process
    public function topup(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:10000|max:10000000',
            'payment_method' => 'required|in:qris',
        ]);

        /** @var User $user */
        $user = Auth::user();

        try {
            DB::beginTransaction();

            // Simulate payment delay
            sleep(2);

            // Increase user balance
            $user->increment('balance', $validated['amount']);

            // Log transaction
            BalanceTransaction::create([
                'user_id' => $user->id,
                'type' => 'credit',
                'amount' => $validated['amount'],
                'description' => 'Top Up via QRIS',
                'reference' => 'TOPUP-' . strtoupper(uniqid()),
                'metadata' => [
                    'payment_method' => $validated['payment_method'],
                ],
            ]);

            DB::commit();

            return redirect()->route('member.saldo')
                ->with('success', 'Top-up berhasil! Saldo Anda telah bertambah.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Top-up gagal: ' . $e->getMessage());
        }
    }

    // Display transaction history
    public function history()
    {
        $transactions = Transaction::where('user_id', Auth::id())
            ->with(['rentalUnit', 'payment'])
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(fn($t) => [
                'id' => $t->id,
                'unit_name' => $t->rentalUnit->name,
                'total_price' => $t->total_price,
                'payment_method' => $t->payment_method,
                'status' => $t->status,
                'created_at' => $t->created_at,
            ]);

        // Render Balance history page
        return Inertia::render('Members/Balance', [
            'transactions' => $transactions,
            'balance' => Auth::user()->balance,
        ]);
    }
}