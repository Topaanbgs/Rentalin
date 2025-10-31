<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('rental_unit_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by_staff_id')->nullable()->constrained('users')->nullOnDelete();
            $table->integer('duration');
            $table->decimal('total_price', 15, 2);
            $table->enum('payment_method', ['qris', 'balance', 'paylater', 'cash']);
            $table->enum('status', [
                'pending_payment',
                'grace_period_active',
                'checked_in',         
                'completed',          
                'cancelled',          
                'cancelled_expired'   
            ])->default('pending_payment');

            $table->timestamp('start_time')->nullable();              
            $table->timestamp('grace_period_expires_at')->nullable(); 
            $table->timestamp('checked_in_at')->nullable();           
            $table->timestamp('completed_at')->nullable();            
            $table->string('booking_code')->unique()->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index('start_time');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
