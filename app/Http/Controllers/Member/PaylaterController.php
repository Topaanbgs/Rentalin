<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\{PaylaterInvoice, User};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, DB};
use Inertia\Inertia;

class PaylaterController extends Controller
{
    public function index()
    {
        /** @var User $user */
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

        return Inertia::render('Members/Paylater', [
            'invoices' => $invoices,
            'paylater_account' => $user->paylaterAccount,
        ]);
    }

    public function pay(Request $request, PaylaterInvoice $invoice)
    {
        /** @var User $user */
        $user = Auth::user();

        if ($invoice->user_id !== $user->id) {
            abort(403);
        }

        if ($invoice->status === 'paid') {
            return back()->with('info', 'Invoice sudah dibayar');
        }

        if ($user->balance < $invoice->remaining_amount) {
            return back()->with('error', 'Saldo tidak mencukupi untuk membayar invoice ini');
        }

        try {
            DB::beginTransaction();

            $user->decrement('balance', (float)$invoice->remaining_amount);
            $user->paylaterAccount->decrement('used_limit', (float)$invoice->remaining_amount);

            $invoice->update([
                'paid_amount' => $invoice->total_amount,
                'remaining_amount' => 0,
                'status' => 'paid',
                'paid_at' => now(),
            ]);

            DB::commit();

            return redirect()->route('member.paylater')
                ->with('success', 'Pembayaran invoice berhasil!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Pembayaran gagal: ' . $e->getMessage());
        }
    }
}