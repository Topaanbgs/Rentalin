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
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone_number')->unique()->after('email');
            $table->enum('role', ['member', 'staff'])->default('member')->after('password');
            $table->string('verified_id_path')->nullable()->after('role');
            $table->decimal('balance', 15, 2)->default(0)->after('verified_id_path');
            $table->boolean('is_verified')->default(false)->after('balance');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone_number', 'role', 'verified_id_path', 'balance', 'is_verified']);
        });
    }
};