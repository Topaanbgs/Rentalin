<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class PaylaterInvoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'invoice_number',
        'total_amount',
        'paid_amount',
        'status',
        'due_date',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'total_amount' => 'decimal:2',
            'paid_amount' => 'decimal:2',
            'due_date' => 'datetime',
            'paid_at' => 'datetime',
        ];
    }

    // Boot method for auto-generating invoice number
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($invoice) {
            if (empty($invoice->invoice_number)) {
                $date = now()->format('Ymd');
                $count = static::whereDate('created_at', now())->count() + 1;
                $invoice->invoice_number = 'INV-' . $date . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);
            }

            if (empty($invoice->due_date)) {
                $invoice->due_date = now()->addDays(7);
            }
        });
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function paylaterTransactions()
    {
        return $this->hasMany(PaylaterTransaction::class);
    }

    public function transactions()
    {
        return $this->hasManyThrough(
            Transaction::class,
            PaylaterTransaction::class,
            'paylater_invoice_id',
            'id',
            'id',
            'transaction_id'
        );
    }

    // Scopes
    public function scopeUnpaid($query)
    {
        return $query->where('status', 'unpaid');
    }

    public function scopeOverdue($query)
    {
        return $query->where('status', 'overdue');
    }

    // Calculated attributes
    public function getRemainingAmountAttribute()
    {
        return max(0, $this->total_amount - $this->paid_amount);
    }

    public function getIsOverdueAttribute()
    {
        return $this->due_date->isPast() && $this->status !== 'paid';
    }
}