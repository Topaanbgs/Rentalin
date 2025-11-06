<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\{
    DashboardController, 
    RentalUnitController, 
    TransactionController, 
    MemberController, 
    ReportController
};
use App\Http\Controllers\Member\{
    DashboardController as MemberDashboard, 
    BookingController, 
    BalanceController, 
    PaylaterController
};

// Guest Routes
Route::get('/', function () {
    if (Auth::check()) {
        $user = Auth::user();
        return $user->role === 'staff'
            ? redirect()->route('admin.dashboard')
            : redirect()->route('member.dashboard');
    }
    return Inertia::render('Guest/Index');
})->name('guest.index');

Route::get('/games', fn() => Inertia::render('Guest/Games'))->name('guest.games');
Route::get('/consoles', fn() => Inertia::render('Guest/Consoles'))->name('guest.consoles');

// Authenticated Routes
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Dashboard redirect based on role
    Route::get('/dashboard', function () {
        $user = Auth::user();
        return $user->role === 'staff' 
            ? redirect()->route('admin.dashboard') 
            : redirect()->route('member.dashboard');
    })->name('dashboard');

    // Profile Management
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
    });

    // Member Routes
    Route::prefix('member')->name('member.')->middleware('role:member')->group(function () {
        
        // Dashboard
        Route::get('/dashboard', [MemberDashboard::class, 'index'])->name('dashboard');
        
        // Booking & Orders
        Route::get('/order', [BookingController::class, 'index'])->name('order');
        Route::post('/order', [BookingController::class, 'store'])->name('order.store');
        Route::get('/order/{transaction}', [BookingController::class, 'show'])->name('order.show');
        Route::post('/order/{transaction}/cancel', [BookingController::class, 'cancel'])->name('order.cancel');
        
        // Payment
        Route::get('/payment', [BookingController::class, 'payment'])->name('payment');
        Route::post('/payment/process', [BookingController::class, 'processPayment'])->name('payment.process');
        
        // Balance Management
        Route::get('/saldo', [BalanceController::class, 'index'])->name('saldo');
        Route::post('/saldo/topup', [BalanceController::class, 'topup'])->name('saldo.topup');
        Route::get('/balance', [BalanceController::class, 'history'])->name('balance');
        
        // Paylater
        Route::get('/paylater', [PaylaterController::class, 'index'])->name('paylater');
        Route::post('/paylater/{invoice}/pay', [PaylaterController::class, 'pay'])->name('paylater.pay');
        
        // User Pages
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

    // Admin Routes
    Route::prefix('admin')->name('admin.')->middleware('role:staff')->group(function () {
        
        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Rental Units Management
        Route::resource('units', RentalUnitController::class);
        Route::patch('units/{unit}/status', [RentalUnitController::class, 'updateStatus'])->name('units.update-status');

        // Transaction Management
        Route::get('transactions', [TransactionController::class, 'index'])->name('transactions.index');
        Route::post('transactions/cash', [TransactionController::class, 'storeCash'])->name('transactions.store-cash');
        Route::get('transactions/{transaction}', [TransactionController::class, 'show'])->name('transactions.show');
        Route::post('transactions/{transaction}/check-in', [TransactionController::class, 'checkIn'])->name('transactions.check-in');
        Route::post('transactions/{transaction}/complete', [TransactionController::class, 'complete'])->name('transactions.complete');
        Route::post('transactions/{transaction}/validate-payment', [TransactionController::class, 'validatePayment'])->name('transactions.validate-payment');

        // Member Management
        Route::get('members', [MemberController::class, 'index'])->name('members.index');
        Route::get('members/{member}', [MemberController::class, 'show'])->name('members.show');
        Route::patch('members/{member}/verification', [MemberController::class, 'updateVerification'])->name('members.update-verification');

        // Financial Reports
        Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('reports/export', [ReportController::class, 'export'])->name('reports.export');
    });
});

require __DIR__ . '/auth.php';