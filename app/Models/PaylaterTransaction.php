<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaylaterTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'paylater_invoice_id',
        'transaction_id',
        'amount',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
        ];
    }

    // Relationships
    public function paylaterInvoice()
    {
        return $this->belongsTo(PaylaterInvoice::class);
    }

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}