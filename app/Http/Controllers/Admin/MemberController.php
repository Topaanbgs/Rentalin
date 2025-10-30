<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\PaylaterAccount;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('paylaterAccount')
            ->where('role', 'member');

        // Search by name or email
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone_number', 'like', "%{$search}%");
            });
        }

        // Filter by verification status
        if ($request->has('verified') && $request->verified !== 'all') {
            $query->where('is_verified', $request->verified === 'true');
        }

        $members = $query->orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(function ($member) {
                return [
                    'id' => $member->id,
                    'name' => $member->name,
                    'email' => $member->email,
                    'phone_number' => $member->phone_number,
                    'balance' => $member->balance,
                    'is_verified' => $member->is_verified,
                    'paylater' => $member->paylaterAccount ? [
                        'total_limit' => $member->paylaterAccount->total_limit,
                        'used_limit' => $member->paylaterAccount->used_limit,
                        'available_limit' => $member->paylaterAccount->available_limit,
                        'trust_score' => $member->paylaterAccount->trust_score,
                        'status' => $member->paylaterAccount->status,
                    ] : null,
                    'created_at' => $member->created_at,
                ];
            });

        return Inertia::render('Admin/Members/Index', [
            'members' => $members,
            'filters' => $request->only(['search', 'verified']),
        ]);
    }

    public function show(User $member)
    {
        $member->load(['paylaterAccount', 'transactions.rentalUnit', 'transactions.payment', 'paylaterInvoices']);

        $data = [
            'id' => $member->id,
            'name' => $member->name,
            'email' => $member->email,
            'phone_number' => $member->phone_number,
            'balance' => $member->balance,
            'is_verified' => $member->is_verified,
            'verified_id_path' => $member->verified_id_path,
            'paylater' => $member->paylaterAccount ? [
                'total_limit' => $member->paylaterAccount->total_limit,
                'used_limit' => $member->paylaterAccount->used_limit,
                'available_limit' => $member->paylaterAccount->available_limit,
                'trust_score' => $member->paylaterAccount->trust_score,
                'status' => $member->paylaterAccount->status,
            ] : null,
            'transactions' => $member->transactions->map(function ($t) {
                return [
                    'id' => $t->id,
                    'unit_name' => $t->rentalUnit->name,
                    'total_price' => $t->total_price,
                    'payment_method' => $t->payment_method,
                    'status' => $t->status,
                    'start_time' => $t->start_time,
                ];
            }),
            'paylater_invoices' => $member->paylaterInvoices->map(function ($i) {
                return [
                    'invoice_number' => $i->invoice_number,
                    'total_amount' => $i->total_amount,
                    'paid_amount' => $i->paid_amount,
                    'status' => $i->status,
                    'due_date' => $i->due_date,
                ];
            }),
        ];

        return Inertia::render('Admin/Members/Show', [
            'member' => $data,
        ]);
    }

    public function updateVerification(Request $request, User $member)
    {
        $validated = $request->validate([
            'is_verified' => 'required|boolean',
        ]);

        $member->update(['is_verified' => $validated['is_verified']]);

        // Activate/block paylater based on verification
        if ($member->paylaterAccount) {
            $member->paylaterAccount->update([
                'status' => $validated['is_verified'] ? 'active' : 'blocked'
            ]);
            $member->paylaterAccount->updateLimit();
        }

        return back()->with('success', 'Member verification updated successfully');
    }
}