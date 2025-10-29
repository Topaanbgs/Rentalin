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
        Schema::create('rental_units', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->enum('type', ['PS4', 'PS5', 'PS4_PRO', 'PS5_DIGITAL']);
            $table->decimal('hourly_rate', 10, 2);
            $table->enum('status', ['available', 'booked', 'in_use', 'maintenance'])->default('available');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rental_units');
    }
};
