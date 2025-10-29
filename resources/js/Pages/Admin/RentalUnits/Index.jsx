import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Plus, Edit, Trash2, Power, Wrench } from "lucide-react";

export default function Index({ units }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusBadge = (status) => {
        const badges = {
            available: {
                bg: "bg-[#B4E4CE]",
                text: "text-[#0066CC]",
                label: "Available",
            },
            booked: {
                bg: "bg-yellow-100",
                text: "text-yellow-800",
                label: "Booked",
            },
            in_use: {
                bg: "bg-blue-100",
                text: "text-blue-800",
                label: "In Use",
            },
            maintenance: {
                bg: "bg-red-100",
                text: "text-red-800",
                label: "Maintenance",
            },
        };
        const badge = badges[status] || badges.available;
        return (
            <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${badge.bg} ${badge.text}`}
            >
                {badge.label}
            </span>
        );
    };

    const handleStatusChange = (unitId, newStatus) => {
        if (confirm(`Change unit status to ${newStatus}?`)) {
            router.patch(route("admin.units.update-status", unitId), {
                status: newStatus,
            });
        }
    };

    const handleDelete = (unitId, unitName) => {
        if (confirm(`Delete ${unitName}? This action cannot be undone.`)) {
            router.delete(route("admin.units.destroy", unitId));
        }
    };

    return (
        <AuthenticatedLayout header="Rental Units Management">
            <Head title="Rental Units" />

            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-gray-600">
                            Manage PlayStation rental units
                        </p>
                    </div>
                    <Link
                        href={route("admin.units.create")}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0066CC] to-[#0052A3] text-white rounded-lg hover:opacity-90 transition"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Unit
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#0066CC]">
                        <div className="text-sm text-gray-600">Total Units</div>
                        <div className="text-3xl font-bold text-gray-900">
                            {units.length}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#B4E4CE]">
                        <div className="text-sm text-gray-600">Available</div>
                        <div className="text-3xl font-bold text-green-600">
                            {
                                units.filter((u) => u.status === "available")
                                    .length
                            }
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-400">
                        <div className="text-sm text-gray-600">In Use</div>
                        <div className="text-3xl font-bold text-blue-600">
                            {
                                units.filter(
                                    (u) =>
                                        u.status === "in_use" ||
                                        u.status === "booked"
                                ).length
                            }
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-400">
                        <div className="text-sm text-gray-600">Maintenance</div>
                        <div className="text-3xl font-bold text-red-600">
                            {
                                units.filter((u) => u.status === "maintenance")
                                    .length
                            }
                        </div>
                    </div>
                </div>

                {/* Units Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {units.map((unit) => (
                        <div
                            key={unit.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
                        >
                            <div
                                className={`h-2 ${
                                    unit.status === "available"
                                        ? "bg-[#B4E4CE]"
                                        : "bg-gray-300"
                                }`}
                            />
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {unit.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {unit.type}
                                        </p>
                                    </div>
                                    {getStatusBadge(unit.status)}
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Hourly Rate:
                                        </span>
                                        <span className="font-semibold text-[#0066CC]">
                                            {formatCurrency(unit.hourly_rate)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Total Bookings:
                                        </span>
                                        <span className="font-semibold">
                                            {unit.total_bookings}
                                        </span>
                                    </div>
                                </div>

                                {/* Quick Status Actions */}
                                <div className="flex gap-2 mb-4">
                                    <button
                                        onClick={() =>
                                            handleStatusChange(
                                                unit.id,
                                                "available"
                                            )
                                        }
                                        disabled={unit.status === "available"}
                                        className="flex-1 px-2 py-1 text-xs bg-[#B4E4CE] text-[#0066CC] rounded hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Power className="w-3 h-3 inline mr-1" />
                                        Available
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleStatusChange(
                                                unit.id,
                                                "maintenance"
                                            )
                                        }
                                        disabled={unit.status === "maintenance"}
                                        className="flex-1 px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Wrench className="w-3 h-3 inline mr-1" />
                                        Maintenance
                                    </button>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <Link
                                        href={route(
                                            "admin.units.edit",
                                            unit.id
                                        )}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0052A3] transition"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() =>
                                            handleDelete(unit.id, unit.name)
                                        }
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {units.length === 0 && (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <p className="text-gray-500 text-lg">
                            No rental units found. Add your first unit to get
                            started.
                        </p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
