<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\RentalUnitController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\Admin\MemberController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

// Member Dashboard (default authenticated route)
Route::get('/dashboard', function () {
    if (Auth::user()->role === 'staff') {
        return redirect()->route('admin.dashboard');
    }
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin Routes
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'role:staff'])
    ->group(function () {
        
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        
        // Rental Units Management
        Route::resource('units', RentalUnitController::class);
        Route::patch('units/{unit}/status', [RentalUnitController::class, 'updateStatus'])->name('units.update-status');
        
        // Transactions Management
        Route::get('transactions', [TransactionController::class, 'index'])->name('transactions.index');
        Route::get('transactions/{transaction}', [TransactionController::class, 'show'])->name('transactions.show');
        Route::post('transactions/{transaction}/check-in', [TransactionController::class, 'checkIn'])->name('transactions.check-in');
        Route::post('transactions/{transaction}/complete', [TransactionController::class, 'complete'])->name('transactions.complete');
        Route::post('transactions/{transaction}/validate-payment', [TransactionController::class, 'validatePayment'])->name('transactions.validate-payment');
        
        // Members Management
        Route::get('members', [MemberController::class, 'index'])->name('members.index');
        Route::get('members/{member}', [MemberController::class, 'show'])->name('members.show');
        Route::patch('members/{member}/verification', [MemberController::class, 'updateVerification'])->name('members.update-verification');

        Route::get('reports', [App\Http\Controllers\Admin\ReportController::class, 'index'])->name('reports.index');
Route::get('reports/export', [App\Http\Controllers\Admin\ReportController::class, 'export'])->name('reports.export');
    });

require __DIR__.'/auth.php';