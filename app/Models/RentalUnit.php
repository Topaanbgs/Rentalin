<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RentalUnit extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'hourly_rate',
        'status',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'hourly_rate' => 'decimal:2',
        ];
    }

    // Relationships
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    // Scopes
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    public function scopeBooked($query)
    {
        return $query->where('status', 'booked');
    }

    public function scopeInUse($query)
    {
        return $query->where('status', 'in_use');
    }

    // Helper methods
    public function isAvailable()
    {
        return $this->status === 'available';
    }

    public function calculatePrice($durationInMinutes)
    {
        $hours = ceil($durationInMinutes / 60);
        return $this->hourly_rate * $hours;
    }
}