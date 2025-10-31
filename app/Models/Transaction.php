<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'rental_unit_id',
        'duration',
        'total_price',
        'payment_method',
        'status',
        'start_time',
        'grace_period_expires_at',
        'checked_in_at',
        'completed_at',
        'booking_code',
        'created_by_staff_id',
    ];

    protected function casts(): array
    {
        return [
            'total_price' => 'decimal:2',
            'start_time' => 'datetime',
            'grace_period_expires_at' => 'datetime',
            'checked_in_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($transaction) {
            if (empty($transaction->booking_code)) {
                $transaction->booking_code = 'BOOKING-' . strtoupper(Str::random(8));
            }
        });
    }

    // Relationships
    public function user() { return $this->belongsTo(User::class); }
    public function rentalUnit() { return $this->belongsTo(RentalUnit::class); }
    public function payment() { return $this->hasOne(Payment::class); }
    public function paylaterTransaction() { return $this->hasOne(PaylaterTransaction::class); }
    public function createdByStaff() { return $this->belongsTo(User::class, 'created_by_staff_id'); }

    // Scopes
    public function scopeActive($query) { return $query->whereIn('status', ['grace_period_active', 'checked_in']); }
    public function scopePending($query) { return $query->where('status', 'pending_payment'); }
    public function scopeCompleted($query) { return $query->where('status', 'completed'); }

    // Status Checkers
    public function isPending() { return $this->status === 'pending_payment'; }
    public function isGracePeriodActive() { return $this->status === 'grace_period_active'; }
    public function isCheckedIn() { return $this->status === 'checked_in'; }
    public function isCompleted() { return $this->status === 'completed'; }
    public function isCancelled() { return $this->status === 'cancelled'; }
    public function isCancelledExpired() { return $this->status === 'cancelled_expired'; }
}
