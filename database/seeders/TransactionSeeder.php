<?php

namespace Database\Seeders;

use App\Models\Transaction;
use App\Models\Payment;
use App\Models\PaylaterInvoice;
use App\Models\PaylaterTransaction;
use App\Models\User;
use App\Models\RentalUnit;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        $staff = User::where('role', 'staff')->first();
        $john = User::where('email', 'john@mail.com')->first();
        $bob = User::where('email', 'bob@mail.com')->first();
        
        $ps5A = RentalUnit::where('name', 'PS5-A')->first();
        $ps4A = RentalUnit::where('name', 'PS4-A')->first();
        $ps3A = RentalUnit::where('name', 'PS3-A')->first();
        $ps2A = RentalUnit::where('name', 'PS2-A')->first();

        // Transaction 1: Completed - Direct Payment (VA)
        $t1 = Transaction::create([
            'user_id' => $john->id,
            'rental_unit_id' => $ps5A->id,
            'created_by_staff_id' => $staff->id,
            'duration' => 120,
            'total_price' => 30000,
            'payment_method' => 'direct',
            'status' => 'completed',
            'start_time' => Carbon::now()->subDays(2)->setTime(14, 0),
            'grace_period_expires_at' => Carbon::now()->subDays(2)->setTime(14, 15),
            'checked_in_at' => Carbon::now()->subDays(2)->setTime(14, 5),
            'completed_at' => Carbon::now()->subDays(2)->setTime(16, 0),
            'qr_code' => 'BOOKING-' . strtoupper(substr(md5(uniqid()), 0, 8)),
        ]);
        Payment::create([
            'transaction_id' => $t1->id,
            'amount' => 30000,
            'payment_type' => 'va',
            'payment_status' => 'success',
            'reference' => 'VA-' . time() . rand(1000, 9999),
            'paid_at' => Carbon::now()->subDays(2)->setTime(13, 50),
        ]);

        // Transaction 2: Completed - Balance
        $t2 = Transaction::create([
            'user_id' => $bob->id,
            'rental_unit_id' => $ps4A->id,
            'created_by_staff_id' => $staff->id,
            'duration' => 180,
            'total_price' => 30000,
            'payment_method' => 'balance',
            'status' => 'completed',
            'start_time' => Carbon::now()->subDays(1)->setTime(10, 0),
            'grace_period_expires_at' => Carbon::now()->subDays(1)->setTime(10, 15),
            'checked_in_at' => Carbon::now()->subDays(1)->setTime(10, 8),
            'completed_at' => Carbon::now()->subDays(1)->setTime(13, 0),
            'qr_code' => 'BOOKING-' . strtoupper(substr(md5(uniqid()), 0, 8)),
        ]);
        Payment::create([
            'transaction_id' => $t2->id,
            'amount' => 30000,
            'payment_type' => 'balance',
            'payment_status' => 'success',
            'paid_at' => Carbon::now()->subDays(1)->setTime(9, 55),
        ]);
        $bob->decrement('balance', 30000);

        // Transaction 3: In Progress - QRIS
        $t3 = Transaction::create([
            'user_id' => $john->id,
            'rental_unit_id' => $ps3A->id,
            'created_by_staff_id' => $staff->id,
            'duration' => 60,
            'total_price' => 8000,
            'payment_method' => 'direct',
            'status' => 'in_progress',
            'start_time' => Carbon::now()->subHours(1),
            'grace_period_expires_at' => Carbon::now()->subMinutes(45),
            'checked_in_at' => Carbon::now()->subMinutes(50),
            'qr_code' => 'BOOKING-' . strtoupper(substr(md5(uniqid()), 0, 8)),
        ]);
        Payment::create([
            'transaction_id' => $t3->id,
            'amount' => 8000,
            'payment_type' => 'qris',
            'payment_status' => 'success',
            'reference' => 'QRIS-' . time() . rand(1000, 9999),
            'paid_at' => Carbon::now()->subHours(1)->subMinutes(10),
        ]);
        $ps3A->update(['status' => 'in_use']);

        // Transaction 4: Grace Period Active - Balance
        $t4 = Transaction::create([
            'user_id' => $bob->id,
            'rental_unit_id' => $ps2A->id,
            'created_by_staff_id' => $staff->id,
            'duration' => 120,
            'total_price' => 12000,
            'payment_method' => 'balance',
            'status' => 'grace_period_active',
            'start_time' => Carbon::now()->addMinutes(5),
            'grace_period_expires_at' => Carbon::now()->addMinutes(20),
            'qr_code' => 'BOOKING-' . strtoupper(substr(md5(uniqid()), 0, 8)),
        ]);
        Payment::create([
            'transaction_id' => $t4->id,
            'amount' => 12000,
            'payment_type' => 'balance',
            'payment_status' => 'success',
            'paid_at' => Carbon::now(),
        ]);
        $bob->decrement('balance', 12000);
        $ps2A->update(['status' => 'booked']);

        // Transaction 5-7: Paylater (Unpaid Invoice)
        $invoice = PaylaterInvoice::create([
            'user_id' => $john->id,
            'invoice_number' => 'INV-' . now()->format('Ymd') . '-001',
            'total_amount' => 58000,
            'paid_amount' => 0,
            'status' => 'unpaid',
            'due_date' => now()->addDays(7),
        ]);

        foreach ([
            ['unit' => $ps5A, 'duration' => 120, 'price' => 30000, 'days_ago' => 3],
            ['unit' => $ps4A, 'duration' => 120, 'price' => 20000, 'days_ago' => 2],
            ['unit' => $ps3A, 'duration' => 60, 'price' => 8000, 'days_ago' => 1],
        ] as $data) {
            $t = Transaction::create([
                'user_id' => $john->id,
                'rental_unit_id' => $data['unit']->id,
                'created_by_staff_id' => $staff->id,
                'duration' => $data['duration'],
                'total_price' => $data['price'],
                'payment_method' => 'paylater',
                'status' => 'completed',
                'start_time' => Carbon::now()->subDays($data['days_ago'])->setTime(15, 0),
                'grace_period_expires_at' => Carbon::now()->subDays($data['days_ago'])->setTime(15, 15),
                'checked_in_at' => Carbon::now()->subDays($data['days_ago'])->setTime(15, 10),
                'completed_at' => Carbon::now()->subDays($data['days_ago'])->setTime(15 + ($data['duration']/60), 0),
                'qr_code' => 'BOOKING-' . strtoupper(substr(md5(uniqid()), 0, 8)),
            ]);
            Payment::create([
                'transaction_id' => $t->id,
                'amount' => $data['price'],
                'payment_type' => 'paylater',
                'payment_status' => 'success',
                'paid_at' => Carbon::now()->subDays($data['days_ago'])->setTime(14, 55),
            ]);
            PaylaterTransaction::create([
                'paylater_invoice_id' => $invoice->id,
                'transaction_id' => $t->id,
                'amount' => $data['price'],
            ]);
        }

        // Update paylater account
        $john->paylaterAccount->increment('used_limit', 58000);

        // Transaction 8: Cancelled No Show
        $t8 = Transaction::create([
            'user_id' => $bob->id,
            'rental_unit_id' => $ps5A->id,
            'created_by_staff_id' => $staff->id,
            'duration' => 60,
            'total_price' => 15000,
            'payment_method' => 'balance',
            'status' => 'cancelled',
            'start_time' => Carbon::now()->subDays(3)->setTime(18, 0),
            'grace_period_expires_at' => Carbon::now()->subDays(3)->setTime(18, 15),
            'qr_code' => 'BOOKING-' . strtoupper(substr(md5(uniqid()), 0, 8)),
        ]);
        Payment::create([
            'transaction_id' => $t8->id,
            'amount' => 15000,
            'payment_type' => 'balance',
            'payment_status' => 'refunded',
            'paid_at' => Carbon::now()->subDays(3)->setTime(17, 50),
        ]);
        $bob->increment('balance', 11250); // 75% refund
        $bob->paylaterAccount->decrement('trust_score', 10);

        // Transaction 9: Pending Payment
        $t9 = Transaction::create([
            'user_id' => $bob->id,
            'rental_unit_id' => $ps4A->id,
            'created_by_staff_id' => $staff->id,
            'duration' => 120,
            'total_price' => 20000,
            'payment_method' => 'direct',
            'status' => 'pending_payment',
            'start_time' => Carbon::now()->addHours(2),
            'qr_code' => 'BOOKING-' . strtoupper(substr(md5(uniqid()), 0, 8)),
        ]);
        Payment::create([
            'transaction_id' => $t9->id,
            'amount' => 20000,
            'payment_type' => 'va',
            'payment_status' => 'waiting',
            'reference' => 'VA-' . time() . rand(1000, 9999),
        ]);

        $this->command->info('Transactions seeded successfully!');
    }
}