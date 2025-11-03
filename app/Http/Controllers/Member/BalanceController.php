<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\{Transaction, User};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, DB};
use Inertia\Inertia;

class BalanceController extends Controller
{
    public function index()
    {
        /** @var User $user */
        $user = Auth::user();
        
        return Inertia::render('Members/Saldo', [
            'balance' => $user->balance,
        ]);
    }

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

            sleep(2);

            $user->increment('balance', $validated['amount']);

            DB::commit();

            return redirect()->route('member.saldo')
                ->with('success', 'Top-up berhasil! Saldo Anda telah bertambah.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Top-up gagal: ' . $e->getMessage());
        }
    }

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

        return Inertia::render('Members/Balance', [
            'transactions' => $transactions,
            'balance' => Auth::user()->balance,
        ]);
    }
}