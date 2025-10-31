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
    public function scopeSuccess($query) { return $query->where('payment_status', 'success'); }
    public function scopeWaiting($query) { return $query->where('payment_status', 'waiting'); }
    public function scopeFailed($query) { return $query->where('payment_status', 'failed'); }
    public function scopeExpired($query) { return $query->where('payment_status', 'expired'); }
    public function scopeRefunded($query) { return $query->where('payment_status', 'refunded'); }

    // Status Checkers
    public function isWaiting() { return $this->payment_status === 'waiting'; }
    public function isSuccess() { return $this->payment_status === 'success'; }
    public function isFailed() { return $this->payment_status === 'failed'; }
    public function isExpired() { return $this->payment_status === 'expired'; }
    public function isRefunded() { return $this->payment_status === 'refunded'; }
}
