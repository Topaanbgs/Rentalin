<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\RentalUnit;
use App\Models\User;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = now()->startOfDay();
        $thisMonth = now()->startOfMonth();

        $stats = [
            'total_units' => RentalUnit::count(),
            'available_units' => RentalUnit::where('status', 'available')->count(),
            'active_bookings' => Transaction::whereIn('status', ['grace_period_active', 'checked_in', 'in_progress'])->count(),
            'total_members' => User::where('role', 'member')->count(),
            'today_revenue' => Payment::where('payment_status', 'success')
                ->whereDate('paid_at', $today)
                ->sum('amount'),
            'month_revenue' => Payment::where('payment_status', 'success')
                ->whereDate('paid_at', '>=', $thisMonth)
                ->sum('amount'),
            'pending_payments' => Payment::where('payment_status', 'waiting')->count(),
        ];

        $activeBookings = Transaction::with(['user', 'rentalUnit'])
            ->whereIn('status', ['grace_period_active', 'checked_in', 'in_progress'])
            ->orderBy('start_time', 'desc')
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'qr_code' => $transaction->qr_code,
                    'member_name' => $transaction->user->name,
                    'member_phone' => $transaction->user->phone_number,
                    'unit_name' => $transaction->rentalUnit->name,
                    'status' => $transaction->status,
                    'start_time' => $transaction->start_time,
                    'duration' => $transaction->duration,
                    'grace_period_expires_at' => $transaction->grace_period_expires_at,
                    'checked_in_at' => $transaction->checked_in_at,
                ];
            });

        $recentTransactions = Transaction::with(['user', 'rentalUnit', 'payment'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'member_name' => $transaction->user->name,
                    'unit_name' => $transaction->rentalUnit->name,
                    'total_price' => $transaction->total_price,
                    'payment_method' => $transaction->payment_method,
                    'status' => $transaction->status,
                    'payment_status' => $transaction->payment->payment_status ?? 'N/A',
                    'created_at' => $transaction->created_at,
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'activeBookings' => $activeBookings,
            'recentTransactions' => $recentTransactions,
        ]);
    }
}
