<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaylaterAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total_limit',
        'used_limit',
        'trust_score',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'total_limit' => 'decimal:2',
            'used_limit' => 'decimal:2',
            'trust_score' => 'integer',
        ];
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Calculated attributes
    public function getAvailableLimitAttribute()
    {
        return max(0, $this->total_limit - $this->used_limit);
    }

    // Calculate limit based on trust score
    public function calculateLimit()
    {
        $baseLimit = 30000; // Rp 30k
        $multiplier = 500;  // Rp 500 per trust score point
        $verificationBonus = $this->user->is_verified ? 20000 : 0;

        return $baseLimit + ($this->trust_score * $multiplier) + $verificationBonus;
    }

    // Update limit based on trust score
    public function updateLimit()
    {
        $this->update(['total_limit' => $this->calculateLimit()]);
    }

    // Check if can use paylater
    public function canUsePaylater($amount = 0)
    {
        if ($this->status === 'blocked') {
            return false;
        }

        if (!$this->user->is_verified) {
            return false;
        }

        if ($this->trust_score < 50) {
            return false;
        }

        if ($this->available_limit < $amount) {
            return false;
        }

        return true;
    }
}