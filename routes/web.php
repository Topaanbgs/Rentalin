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
    PaylaterController,
    VerificationController
};

/*
|--------------------------------------------------------------------------
| Guest Routes
|--------------------------------------------------------------------------
| Routes for unauthenticated visitors, including landing page and catalog.
*/
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

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
| Protected routes for verified users, separated by role.
*/
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Redirect user to respective dashboard based on role
    Route::get('/dashboard', function () {
        $user = Auth::user();
        return $user->role === 'staff' 
            ? redirect()->route('admin.dashboard') 
            : redirect()->route('member.dashboard');
    })->name('dashboard');

    /*
    |--------------------------------------------------------------------------
    | Profile Routes
    |--------------------------------------------------------------------------
    | Manage profile information, update, and delete account.
    */
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
    });

    /*
    |--------------------------------------------------------------------------
    | Member Routes
    |--------------------------------------------------------------------------
    | Features and actions accessible by members only.
    */
    Route::prefix('member')->name('member.')->middleware('role:member')->group(function () {
        
        // Dashboard overview
        Route::get('/dashboard', [MemberDashboard::class, 'index'])->name('dashboard');
        
        // Booking and order handling
        Route::get('/order', [BookingController::class, 'index'])->name('order');
        Route::post('/order', [BookingController::class, 'store'])->name('order.store');
        Route::get('/order/{transaction}', [BookingController::class, 'show'])->name('order.show');
        Route::post('/order/{transaction}/cancel', [BookingController::class, 'cancel'])->name('order.cancel');
        
        // Payment process
        Route::get('/payment', [BookingController::class, 'payment'])->name('payment');
        Route::post('/payment/process', [BookingController::class, 'processPayment'])->name('payment.process');
        
        // Balance and top-up management
        Route::get('/saldo', [BalanceController::class, 'index'])->name('saldo');
        Route::post('/saldo/topup', [BalanceController::class, 'topup'])->name('saldo.topup');
        Route::get('/balance', [BalanceController::class, 'history'])->name('balance');
        
        // Paylater system
        Route::get('/paylater', [PaylaterController::class, 'index'])->name('paylater');
        Route::post('/paylater/{invoice}/pay', [PaylaterController::class, 'pay'])->name('paylater.pay');
        
        // Identity verification
        Route::get('/verification', [VerificationController::class, 'index'])->name('verification');
        Route::post('/verification/upload', [VerificationController::class, 'submit'])->name('verification.upload');
        
        // User setting page
        Route::get('/setting', fn() => Inertia::render('Members/Setting', [
            'user' => Auth::user()
        ]))->name('setting');
    });

    /*
    |--------------------------------------------------------------------------
    | Admin Routes
    |--------------------------------------------------------------------------
    | Management features accessible by staff users only.
    */
    Route::prefix('admin')->name('admin.')->middleware('role:staff')->group(function () {
        
        // Dashboard overview
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Rental unit management
        Route::resource('units', RentalUnitController::class);
        Route::patch('units/{unit}/status', [RentalUnitController::class, 'updateStatus'])->name('units.update-status');

        // Transaction management
        Route::get('transactions', [TransactionController::class, 'index'])->name('transactions.index');
        Route::post('transactions/cash', [TransactionController::class, 'storeCash'])->name('transactions.store-cash');
        Route::get('transactions/{transaction}', [TransactionController::class, 'show'])->name('transactions.show');
        Route::post('transactions/{transaction}/check-in', [TransactionController::class, 'checkIn'])->name('transactions.check-in');
        Route::post('transactions/{transaction}/complete', [TransactionController::class, 'complete'])->name('transactions.complete');
        Route::post('transactions/{transaction}/validate-payment', [TransactionController::class, 'validatePayment'])->name('transactions.validate-payment');

        // Member management
        Route::get('members', [MemberController::class, 'index'])->name('members.index');
        Route::get('members/{member}', [MemberController::class, 'show'])->name('members.show');
        Route::patch('members/{member}/verification', [MemberController::class, 'updateVerification'])->name('members.update-verification');

        // Report generation
        Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('reports/export', [ReportController::class, 'export'])->name('reports.export');
    });
});

require __DIR__ . '/auth.php';
