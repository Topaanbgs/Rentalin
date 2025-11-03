<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\RentalUnit;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        $units = RentalUnit::orderBy('name')
            ->get()
            ->map(fn($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'type' => $u->type,
                'hourly_rate' => $u->hourly_rate,
                'description' => $u->description,
                'status' => $u->status,
            ]);

        $stats = [
            'balance' => $user->balance,
            'paylater_limit' => $user->paylaterAccount->total_limit ?? 0,
            'paylater_used' => $user->paylaterAccount->used_limit ?? 0,
            'paylater_available' => ($user->paylaterAccount->total_limit ?? 0) - ($user->paylaterAccount->used_limit ?? 0),
            'trust_score' => $user->paylaterAccount->trust_score ?? 100,
            'is_verified' => $user->is_verified,
        ];

        $activeBookings = Transaction::where('user_id', $user->id)
            ->whereIn('status', ['grace_period_active', 'checked_in'])
            ->with('rentalUnit')
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'booking_code' => $t->booking_code,
                'unit_name' => $t->rentalUnit->name,
                'status' => $t->status,
                'start_time' => $t->start_time,
                'grace_period_expires_at' => $t->grace_period_expires_at,
            ]);

        return Inertia::render('Members/Index', [
            'units' => $units,
            'stats' => $stats,
            'activeBookings' => $activeBookings,
        ]);
    }
}