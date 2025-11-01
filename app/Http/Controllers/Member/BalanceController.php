<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BalanceController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        return Inertia::render('Members/Saldo', [
            'balance' => $user->balance,
        ]);
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