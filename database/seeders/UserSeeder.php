<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\PaylaterAccount;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create Staff User
        $staff = User::create([
            'name' => 'Admin Rentalin',
            'email' => 'admin@staff-rentalin.com',
            'phone_number' => '081234567890',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'is_verified' => true,
        ]);

        // Create Member Users
        $member1 = User::create([
            'name' => 'John Doe',
            'email' => 'john@mail.com',
            'phone_number' => '081234567891',
            'password' => Hash::make('password'),
            'role' => 'member',
            'balance' => 100000,
            'is_verified' => true,
        ]);

        $member2 = User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@mail.com',
            'phone_number' => '081234567892',
            'password' => Hash::make('password'),
            'role' => 'member',
            'balance' => 50000,
            'is_verified' => false,
        ]);

        $member3 = User::create([
            'name' => 'Bob Wilson',
            'email' => 'bob@mail.com',
            'phone_number' => '081234567893',
            'password' => Hash::make('password'),
            'role' => 'member',
            'balance' => 75000,
            'is_verified' => true,
        ]);

        // Create Paylater Accounts for Members
        foreach ([$member1, $member2, $member3] as $member) {
            $account = PaylaterAccount::create([
                'user_id' => $member->id,
                'total_limit' => 0,
                'used_limit' => 0,
                'trust_score' => 100,
                'status' => 'active',
            ]);
            
            // Calculate and update limit
            $account->updateLimit();
        }

        $this->command->info('Users seeded successfully!');
    }
}