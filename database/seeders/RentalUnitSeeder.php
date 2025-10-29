<?php

namespace Database\Seeders;

use App\Models\RentalUnit;
use Illuminate\Database\Seeder;

class RentalUnitSeeder extends Seeder
{
    public function run(): void
    {
        $units = [
            [
                'name' => 'PS5-A',
                'type' => 'PS5',
                'hourly_rate' => 15000,
                'status' => 'available',
                'description' => 'PlayStation 5 Standard Edition with DualSense controller',
            ],
            [
                'name' => 'PS5-B',
                'type' => 'PS5',
                'hourly_rate' => 15000,
                'status' => 'available',
                'description' => 'PlayStation 5 Standard Edition with DualSense controller',
            ],
            [
                'name' => 'PS5-C',
                'type' => 'PS5_DIGITAL',
                'hourly_rate' => 14000,
                'status' => 'available',
                'description' => 'PlayStation 5 Digital Edition',
            ],
            [
                'name' => 'PS4-A',
                'type' => 'PS4',
                'hourly_rate' => 10000,
                'status' => 'available',
                'description' => 'PlayStation 4 Slim with controller',
            ],
            [
                'name' => 'PS4-B',
                'type' => 'PS4',
                'hourly_rate' => 10000,
                'status' => 'available',
                'description' => 'PlayStation 4 Slim with controller',
            ],
            [
                'name' => 'PS4-C',
                'type' => 'PS4_PRO',
                'hourly_rate' => 12000,
                'status' => 'maintenance',
                'description' => 'PlayStation 4 Pro - Currently under maintenance',
            ],
        ];

        foreach ($units as $unit) {
            RentalUnit::create($unit);
        }

        $this->command->info('Rental units seeded successfully!');
    }
}