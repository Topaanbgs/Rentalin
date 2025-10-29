<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone_number',
        'password',
        'role',
        'verified_id_path',
        'balance',
        'is_verified',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'balance' => 'decimal:2',
            'is_verified' => 'boolean',
        ];
    }

    // Relationships
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function paylaterAccount()
    {
        return $this->hasOne(PaylaterAccount::class);
    }

    public function paylaterInvoices()
    {
        return $this->hasMany(PaylaterInvoice::class);
    }

    // Scopes
    public function scopeMembers($query)
    {
        return $query->where('role', 'member');
    }

    public function scopeStaff($query)
    {
        return $query->where('role', 'staff');
    }

    // Accessors
    public function getIsStaffAttribute()
    {
        return $this->role === 'staff';
    }

    public function getIsMemberAttribute()
    {
        return $this->role === 'member';
    }
}