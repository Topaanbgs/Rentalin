<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\RentalUnitController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\Admin\MemberController;
use App\Http\Controllers\Admin\ReportController;
use Illuminate\Foundation\Application;

// =======================
// Guest Public Routes
// =======================
Route::get('/', fn() => Inertia::render('Guest/Index'))->name('guest.index');
Route::get('/games', fn() => Inertia::render('Guest/Games'))->name('guest.games');
Route::get('/consoles', fn() => Inertia::render('Guest/Consoles'))->name('guest.consoles');

// =======================
// Authenticated Users
// =======================
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        $user = Auth::user();
        if ($user && $user->role === 'staff') {
            return redirect()->route('admin.dashboard');
        }
        return Inertia::render('Member/Dashboard');
    })->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// =======================
// Admin Panel
// =======================
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'role:staff'])
    ->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Rental Units
        Route::resource('units', RentalUnitController::class);
        Route::patch('units/{unit}/status', [RentalUnitController::class, 'updateStatus'])->name('units.update-status');

        // Transactions
        Route::get('transactions', [TransactionController::class, 'index'])->name('transactions.index');
        Route::get('transactions/{transaction}', [TransactionController::class, 'show'])->name('transactions.show');
        Route::post('transactions/{transaction}/check-in', [TransactionController::class, 'checkIn'])->name('transactions.check-in');
        Route::post('transactions/{transaction}/complete', [TransactionController::class, 'complete'])->name('transactions.complete');
        Route::post('transactions/{transaction}/validate-payment', [TransactionController::class, 'validatePayment'])->name('transactions.validate-payment');

        // Members
        Route::get('members', [MemberController::class, 'index'])->name('members.index');
        Route::get('members/{member}', [MemberController::class, 'show'])->name('members.show');
        Route::patch('members/{member}/verification', [MemberController::class, 'updateVerification'])->name('members.update-verification');

        // Reports
        Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('reports/export', [ReportController::class, 'export'])->name('reports.export');
    });

require __DIR__ . '/auth.php';
