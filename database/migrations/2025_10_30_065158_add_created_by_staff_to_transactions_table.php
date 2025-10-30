<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->foreignId('created_by_staff_id')->nullable()->after('user_id')->constrained('users')->nullOnDelete();
            $table->index('created_by_staff_id');
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['created_by_staff_id']);
            $table->dropColumn('created_by_staff_id');
        });
    }
};