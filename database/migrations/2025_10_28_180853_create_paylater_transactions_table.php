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
        Schema::create('paylater_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paylater_invoice_id')->constrained()->cascadeOnDelete();
            $table->foreignId('transaction_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount', 15, 2);
            $table->timestamps();
            
            $table->index('paylater_invoice_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paylater_transactions');
    }
};