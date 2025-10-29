<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount', 15, 2);
            $table->enum('payment_type', ['va', 'qris', 'balance', 'paylater']);
            $table->enum('payment_status', ['waiting', 'success', 'failed', 'refunded'])->default('waiting');
            $table->string('reference')->unique()->nullable(); // payment gateway reference
            $table->text('gateway_response')->nullable(); // JSON response
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
            
            $table->index('reference');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};