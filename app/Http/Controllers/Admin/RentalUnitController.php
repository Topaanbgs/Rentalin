<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RentalUnit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RentalUnitController extends Controller
{
    public function index()
    {
        // Retrieve all units with total booking count
        $units = RentalUnit::withCount(['transactions as total_bookings'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($unit) {
                return [
                    'id' => $unit->id,
                    'name' => $unit->name,
                    'type' => $unit->type,
                    'hourly_rate' => $unit->hourly_rate,
                    'status' => $unit->status,
                    'description' => $unit->description,
                    'total_bookings' => $unit->total_bookings,
                ];
            });

        // Render unit list
        return Inertia::render('Admin/RentalUnits/Index', [
            'units' => $units,
        ]);
    }

    public function create()
    {
        // Render unit creation form
        return Inertia::render('Admin/RentalUnits/Create');
    }

    public function store(Request $request)
    {
        // Validate request input
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:rental_units',
            'type' => 'required|in:PS4,PS5,PS4_PRO,PS5_DIGITAL',
            'hourly_rate' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        // Store new unit
        RentalUnit::create($validated);

        return redirect()->route('admin.units.index')
            ->with('success', 'Rental unit created successfully');
    }

    public function edit(RentalUnit $unit)
    {
        // Render edit form with current unit data
        return Inertia::render('Admin/RentalUnits/Edit', [
            'unit' => [
                'id' => $unit->id,
                'name' => $unit->name,
                'type' => $unit->type,
                'hourly_rate' => $unit->hourly_rate,
                'status' => $unit->status,
                'description' => $unit->description,
            ],
        ]);
    }

    public function update(Request $request, RentalUnit $unit)
    {
        // Validate request for update
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:rental_units,name,' . $unit->id,
            'type' => 'required|in:PS4,PS5,PS4_PRO,PS5_DIGITAL',
            'hourly_rate' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'status' => 'required|in:available,booked,in_use,maintenance',
        ]);

        // Update record
        $unit->update($validated);

        return redirect()->route('admin.units.index')
            ->with('success', 'Rental unit updated successfully');
    }

    public function destroy(RentalUnit $unit)
    {
        // Check for active bookings before deletion
        $hasActiveBookings = $unit->transactions()
            ->whereIn('status', ['grace_period_active', 'checked_in', 'in_progress'])
            ->exists();

        if ($hasActiveBookings) {
            return back()->with('error', 'Cannot delete unit with active bookings');
        }

        // Delete record
        $unit->delete();

        return redirect()->route('admin.units.index')
            ->with('success', 'Rental unit deleted successfully');
    }

    public function updateStatus(Request $request, RentalUnit $unit)
    {
        // Validate and update status
        $validated = $request->validate([
            'status' => 'required|in:available,booked,in_use,maintenance',
        ]);

        $unit->update(['status' => $validated['status']]);

        return back()->with('success', 'Unit status updated successfully');
    }
}