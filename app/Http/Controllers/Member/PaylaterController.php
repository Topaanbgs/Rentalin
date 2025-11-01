<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\PaylaterInvoice;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaylaterController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
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

        return Inertia::render('Members/Payment', [
            'invoices' => $invoices,
            'paylater_account' => $user->paylaterAccount,
        ]);
    }
}