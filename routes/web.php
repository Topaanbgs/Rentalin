<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\{DashboardController, RentalUnitController, TransactionController, MemberController, ReportController};
use App\Http\Controllers\Member\{DashboardController as MemberDashboard, BookingController, BalanceController, PaylaterController};

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
        return $user->role === 'staff' 
            ? redirect()->route('admin.dashboard') 
            : redirect()->route('member.Index');
    })->name('dashboard');

    // Member Routes
    Route::prefix('member')->name('member.')->middleware('role:member')->group(function () {
        Route::get('/dashboard', [MemberDashboard::class, 'index'])->name('dashboard');
        
        Route::get('/order', [BookingController::class, 'index'])->name('order');
        Route::post('/order', [BookingController::class, 'store'])->name('order.store');
        Route::get('/order/{transaction}', [BookingController::class, 'show'])->name('order.show');
        Route::post('/order/{transaction}/cancel', [BookingController::class, 'cancel'])->name('order.cancel');
        
        Route::get('/payment', [BookingController::class, 'payment'])->name('payment');
        Route::post('/payment/process', [BookingController::class, 'processPayment'])->name('payment.process');
        
        Route::get('/saldo', [BalanceController::class, 'index'])->name('saldo');
        Route::post('/saldo/topup', [BalanceController::class, 'topup'])->name('saldo.topup');
        Route::get('/balance', [BalanceController::class, 'history'])->name('balance');
        
        Route::get('/paylater', [PaylaterController::class, 'index'])->name('paylater');
        Route::post('/paylater/{invoice}/pay', [PaylaterController::class, 'pay'])->name('paylater.pay');
        
        Route::get('/verification', function() {
            /** @var \App\Models\User $user */
                $user = Auth::user();
            return Inertia::render('Members/Verification', [
                'user' => $user->load('paylaterAccount')
            ]);
        })->name('verification');
        
        Route::get('/setting', fn() => Inertia::render('Members/Setting', [
            'user' => Auth::user()
        ]))->name('setting');
    });

    // Profile Management (Shared)
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
    });
});

// =======================
// Admin Panel
// =======================
Route::prefix('admin')->name('admin.')->middleware(['auth', 'role:staff'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('units', RentalUnitController::class);
    Route::patch('units/{unit}/status', [RentalUnitController::class, 'updateStatus'])->name('units.update-status');

    Route::get('transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::get('transactions/{transaction}', [TransactionController::class, 'show'])->name('transactions.show');
    Route::post('transactions/{transaction}/check-in', [TransactionController::class, 'checkIn'])->name('transactions.check-in');
    Route::post('transactions/{transaction}/complete', [TransactionController::class, 'complete'])->name('transactions.complete');
    Route::post('transactions/{transaction}/validate-payment', [TransactionController::class, 'validatePayment'])->name('transactions.validate-payment');

    Route::get('members', [MemberController::class, 'index'])->name('members.index');
    Route::get('members/{member}', [MemberController::class, 'show'])->name('members.show');
    Route::patch('members/{member}/verification', [MemberController::class, 'updateVerification'])->name('members.update-verification');

    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('reports/export', [ReportController::class, 'export'])->name('reports.export');
});

require __DIR__ . '/auth.php';