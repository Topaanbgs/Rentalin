<?php

namespace Database\Seeders;

use App\Models\{
    Transaction,
    Payment,
    PaylaterInvoice,
    PaylaterTransaction,
    User,
    RentalUnit
};
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        $staff = User::where('role', 'staff')->first();
        $john  = User::where('email', 'john@mail.com')->first();
        $bob   = User::where('email', 'bob@mail.com')->first();

        $ps5A = RentalUnit::where('name', 'PS5-A')->first();
        $ps4A = RentalUnit::where('name', 'PS4-A')->first();
        $ps3A = RentalUnit::where('name', 'PS3-A')->first();
        $ps2A = RentalUnit::where('name', 'PS2-A')->first();

        // 1. COMPLETED – QRIS
        $t1 = Transaction::create([
            'user_id' => $john->id,
            'rental_unit_id' => $ps5A->id,
            'created_by_staff_id' => $staff->id,
            'duration' => 120,
            'total_price' => 30000,
            'payment_method' => 'qris',
            'status' => 'completed',
            'start_time' => now()->subDays(3)->setTime(14, 0),
            'grace_period_expires_at' => now()->subDays(3)->setTime(14, 15),
            'checked_in_at' => now()->subDays(3)->setTime(14, 5),
            'completed_at' => now()->subDays(3)->setTime(16, 0),
            'booking_code' => 'BOOKING-' . strtoupper(substr(md5(uniqid()), 0, 8)),
        ]);
        Payment::create([
            'transaction_id' => $t1->id,
            'amount' => 30000,
            'payment_type' => 'qris',
            'payment_status' => 'success',
            'reference' => 'QRIS-' . time() . rand(1000, 9999),
            'paid_at' => now()->subDays(3)->setTime(13, 50),
        ]);

        // 2. COMPLETED – BALANCE
        $t2 = Transaction::create([
            'user_id' => $bob->id,
            'rental_unit_id' => $ps4A->id,
            'created_by_staff_id' => $staff->id,
            'duration' => 180,
            'total_price' => 30000,
            'payment_method' => 'balance',
            'status' => 'completed',
            'start_time' => now()->subDays(2)->setTime(10, 0),
            'grace_period_expires_at' => now()->subDays(2)->setTime(10, 15),
            'checked_in_at' => now()->subDays(2)->setTime(10, 8),
            'completed_at' => now()->subDays(2)->setTime(13, 0),
            'booking_code' => 'BOOKING-' . strtoupper(substr(md5(uniqid()), 0, 8)),
        ]);
        Payment::create([
            'transaction_id' => $t2->id,
            'amount' => 30000,
            'payment_type' => 'balance',
            'payment_status' => 'success',
            'paid_at' => now()->subDays(2)->setTime(9, 55),
        ]);
        $bob->decrement('balance', 30000);

        // 3. CHECKED_IN – QRIS
        $t3 = Transaction::create([
            'user_id' => $john->id,
            'rental_unit_id' => $ps3A->id,
            'created_by_staff_id' => $staff->id,
            'duration' => 120,
            'total_price' => 16000,
            'payment_method' => 'qris',
            'status' => 'checked_in',
            'start_time' => now()->subMinutes(30),
            'grace_period_expires_at' => now()->subMinutes(15),
            'checked_in_at' => now()->subMinutes(20),
            'booking_code' => 'BOOKING-' . strtoupper(substr(md5(uniqid()), 0, 8)),
        ]);
        Payment::create([
            'transaction_id' => $t3->id,
            'amount' => 16000,
            'payment_type' => 'qris',
            'payment_status' => 'success',
            'reference' => 'QRIS-' . time() . rand(1000, 9999),
            'paid_at' => now()->subMinutes(35),
        ]);
        $ps3A->update(['status' => 'in_use']);

        // 4. GRACE_PERIOD_ACTIVE – BALANCE
        $t4 = Transaction::create([
            'user_id' => $bob->id,
            'rental_unit_id' => $ps2A->id,
            'created_by_staff_id' => $staff->id,
            'duration' => 60,
            'total_price' => 6000,
            'payment_method' => 'balance',
            'status' => 'grace_period_active',
            'start_time' => now()->addMinutes(5),
            'grace_period_expires_at' => now()->addMinutes(20),
            'booking_code' => 'BOOKING-' . strtoupper(substr(md5(uniqid()), 0, 8)),
        ]);
        Payment::create([
            'transaction_id' => $t4->id,
            'amount' => 6000,
            'payment_type' => 'balance',
            'payment_status' => 'success',
            'paid_at' => now(),
        ]);
        $bob->decrement('balance', 6000);
        $ps2A->update(['status' => 'booked']);

        // 5. CANCELLED_EXPIRED – BALANCE
        $t5 = Transaction::create([
            'user_id' => $bob->id,
            'rental_unit_id' => $ps5A->id,
            'created_by_staff_id' => $staff->id,
            'duration' => 60,
            'total_price' => 15000,
            'payment_method' => 'balance',
            'status' => 'cancelled_expired',
            'start_time' => now()->subDays(1)->setTime(18, 0),
            'grace_period_expires_at' => now()->subDays(1)->setTime(18, 15),
            'booking_code' => 'BOOKING-' . strtoupper(substr(md5(uniqid()), 0, 8)),
        ]);
        Payment::create([
            'transaction_id' => $t5->id,
            'amount' => 15000,
            'payment_type' => 'balance',
            'payment_status' => 'refunded',
            'paid_at' => now()->subDays(1)->setTime(17, 55),
        ]);
        $bob->increment('balance', 11250);
        $bob->paylaterAccount->decrement('trust_score', 10);

        // 6. CANCELLED – BALANCE
        $t6 = Transaction::create([
            'user_id' => $john->id,
            'rental_unit_id' => $ps4A->id,
            'created_by_staff_id' => $staff->id,
            'duration' => 120,
            'total_price' => 20000,
            'payment_method' => 'balance',
            'status' => 'cancelled',
            'start_time' => now()->subDays(1)->setTime(15, 0),
            'grace_period_expires_at' => now()->subDays(1)->setTime(15, 15),
            'booking_code' => 'BOOKING-' . strtoupper(substr(md5(uniqid()), 0, 8)),
        ]);
        Payment::create([
            'transaction_id' => $t6->id,
            'amount' => 20000,
            'payment_type' => 'balance',
            'payment_status' => 'refunded',
            'paid_at' => now()->subDays(1)->setTime(14, 50),
        ]);
        $john->increment('balance', 20000);

        // 7. PENDING_PAYMENT – QRIS
        $t7 = Transaction::create([
            'user_id' => $bob->id,
            'rental_unit_id' => $ps4A->id,
            'created_by_staff_id' => $staff->id,
            'duration' => 120,
            'total_price' => 20000,
            'payment_method' => 'qris',
            'status' => 'pending_payment',
            'start_time' => now()->addHours(2),
            'booking_code' => 'BOOKING-' . strtoupper(substr(md5(uniqid()), 0, 8)),
        ]);
        Payment::create([
            'transaction_id' => $t7->id,
            'amount' => 20000,
            'payment_type' => 'qris',
            'payment_status' => 'waiting',
            'reference' => 'QRIS-' . time() . rand(1000, 9999),
        ]);

        // 8–10. PAYLATER TRANSACTIONS (Unpaid Invoice)
        $invoice = PaylaterInvoice::create([
            'user_id' => $john->id,
            'invoice_number' => 'INV-' . now()->format('Ymd') . '-001',
            'total_amount' => 54000,
            'paid_amount' => 0,
            'status' => 'unpaid',
            'due_date' => now()->addDays(7),
        ]);

        foreach ([
            ['unit' => $ps5A, 'duration' => 60, 'price' => 15000, 'days_ago' => 5],
            ['unit' => $ps4A, 'duration' => 120, 'price' => 20000, 'days_ago' => 4],
            ['unit' => $ps3A, 'duration' => 120, 'price' => 16000, 'days_ago' => 3],
        ] as $data) {
            $t = Transaction::create([
                'user_id' => $john->id,
                'rental_unit_id' => $data['unit']->id,
                'created_by_staff_id' => $staff->id,
                'duration' => $data['duration'],
                'total_price' => $data['price'],
                'payment_method' => 'paylater',
                'status' => 'completed',
                'start_time' => now()->subDays($data['days_ago'])->setTime(16, 0),
                'grace_period_expires_at' => now()->subDays($data['days_ago'])->setTime(16, 15),
                'checked_in_at' => now()->subDays($data['days_ago'])->setTime(16, 10),
                'completed_at' => now()->subDays($data['days_ago'])->setTime(16 + ($data['duration'] / 60), 0),
                'booking_code' => 'BOOKING-' . strtoupper(substr(md5(uniqid()), 0, 8)),
            ]);
            Payment::create([
                'transaction_id' => $t->id,
                'amount' => $data['price'],
                'payment_type' => 'paylater',
                'payment_status' => 'success',
                'paid_at' => now()->subDays($data['days_ago'])->setTime(15, 55),
            ]);
            PaylaterTransaction::create([
                'paylater_invoice_id' => $invoice->id,
                'transaction_id' => $t->id,
                'amount' => $data['price'],
            ]);
        }
        $john->paylaterAccount->increment('used_limit', 54000);

        // 11. COMPLETED – CASH (Manual Transaction)
        $t11 = Transaction::create([
            'user_id' => $bob->id,
            'rental_unit_id' => $ps5A->id,
            'created_by_staff_id' => $staff->id,
            'duration' => 120,
            'total_price' => 30000,
            'payment_method' => 'cash',
            'status' => 'completed',
            'start_time' => now()->subDays(4)->setTime(19, 0),
            'grace_period_expires_at' => now()->subDays(4)->setTime(19, 15),
            'checked_in_at' => now()->subDays(4)->setTime(19, 10),
            'completed_at' => now()->subDays(4)->setTime(21, 0),
            'booking_code' => 'BOOKING-' . strtoupper(substr(md5(uniqid()), 0, 8)),
        ]);
        Payment::create([
            'transaction_id' => $t11->id,
            'amount' => 30000,
            'payment_type' => 'cash',
            'payment_status' => 'success',
            'reference' => 'CASH-' . time() . rand(1000, 9999),
            'paid_at' => now()->subDays(4)->setTime(18, 55),
        ]);

        $this->command->info('11 Transactions seeded successfully with all statuses and payment methods.');
    }
}
