<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_id',
        'amount',
        'payment_type',
        'payment_status',
        'reference',
        'gateway_response',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'gateway_response' => 'array',
            'paid_at' => 'datetime',
        ];
    }

    // Relationships
    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    // Scopes
    public function scopeSuccess($query)
    {
        return $query->where('payment_status', 'success');
    }

    public function scopeWaiting($query)
    {
        return $query->where('payment_status', 'waiting');
    }

    // Status check
    public function isSuccess()
    {
        return $this->payment_status === 'success';
    }

    public function isWaiting()
    {
        return $this->payment_status === 'waiting';
    }
}