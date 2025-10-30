<?php

namespace Database\Seeders;

use App\Models\RentalUnit;
use Illuminate\Database\Seeder;

class RentalUnitSeeder extends Seeder
{
    public function run(): void
    {
        $units = [
            // PlayStation 1
            [
                'name' => 'PS1-A',
                'type' => 'PlayStation 1',
                'hourly_rate' => 4000,
                'status' => 'available',
                'description' => 'Classic PlayStation 1 console with original controller and retro game collection.',
            ],
            [
                'name' => 'PS1-B',
                'type' => 'PlayStation 1',
                'hourly_rate' => 4000,
                'status' => 'available',
                'description' => 'Classic PlayStation 1 console, ideal for nostalgic gaming sessions.',
            ],
            [
                'name' => 'PS1-C',
                'type' => 'PlayStation 1',
                'hourly_rate' => 4000,
                'status' => 'available',
                'description' => 'PlayStation 1 unit with memory card and classic controller.',
            ],

            // PlayStation 2
            [
                'name' => 'PS2-A',
                'type' => 'PlayStation 2',
                'hourly_rate' => 6000,
                'status' => 'available',
                'description' => 'PlayStation 2 console with DualShock 2 controller and memory card.',
            ],
            [
                'name' => 'PS2-B',
                'type' => 'PlayStation 2',
                'hourly_rate' => 6000,
                'status' => 'available',
                'description' => 'PlayStation 2 console suitable for classic and adventure titles.',
            ],
            [
                'name' => 'PS2-C',
                'type' => 'PlayStation 2',
                'hourly_rate' => 6000,
                'status' => 'available',
                'description' => 'PlayStation 2 unit ready for multiplayer gaming.',
            ],

            // PlayStation 3
            [
                'name' => 'PS3-A',
                'type' => 'PlayStation 3',
                'hourly_rate' => 8000,
                'status' => 'available',
                'description' => 'PlayStation 3 console with wireless controller and HD output.',
            ],
            [
                'name' => 'PS3-B',
                'type' => 'PlayStation 3',
                'hourly_rate' => 8000,
                'status' => 'available',
                'description' => 'PlayStation 3 unit with popular titles and smooth gameplay.',
            ],
            [
                'name' => 'PS3-C',
                'type' => 'PlayStation 3',
                'hourly_rate' => 8000,
                'status' => 'available',
                'description' => 'PlayStation 3 console for full HD gaming experience.',
            ],

            // PlayStation 4
            [
                'name' => 'PS4-A',
                'type' => 'PlayStation 4',
                'hourly_rate' => 10000,
                'status' => 'available',
                'description' => 'PlayStation 4 console with DualShock 4 and immersive graphics.',
            ],
            [
                'name' => 'PS4-B',
                'type' => 'PlayStation 4',
                'hourly_rate' => 10000,
                'status' => 'available',
                'description' => 'PlayStation 4 ready for competitive gaming and local multiplayer.',
            ],
            [
                'name' => 'PS4-C',
                'type' => 'PlayStation 4',
                'hourly_rate' => 10000,
                'status' => 'available',
                'description' => 'PlayStation 4 console, stable and optimized for long sessions.',
            ],

            // PlayStation 5
            [
                'name' => 'PS5-A',
                'type' => 'PlayStation 5',
                'hourly_rate' => 15000,
                'status' => 'available',
                'description' => 'Next-gen PlayStation 5 console with DualSense controller and ultra-fast loading.',
            ],
            [
                'name' => 'PS5-B',
                'type' => 'PlayStation 5',
                'hourly_rate' => 15000,
                'status' => 'available',
                'description' => 'PlayStation 5 console delivering 4K performance and immersive gameplay.',
            ],
            [
                'name' => 'PS5-C',
                'type' => 'PlayStation 5',
                'hourly_rate' => 15000,
                'status' => 'maintenance',
                'description' => 'PlayStation 5 currently under maintenance for system update.',
            ],
        ];

        foreach ($units as $unit) {
            RentalUnit::create($unit);
        }

        $this->command->info('Rental units (PS1–PS5) seeded successfully!');
    }
}
