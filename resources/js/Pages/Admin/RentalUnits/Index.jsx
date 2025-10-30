import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { Power, Wrench, Clock, CheckCircle, X } from "lucide-react";

export default function Index({ units }) {
    const [selectedUnit, setSelectedUnit] = useState(null);

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);

    const getCardStyle = (status) => {
        const styles = {
            available: "bg-green-600 text-white",
            booked: "bg-yellow-600 text-white",
            in_use: "bg-blue-600 text-white",
            maintenance: "bg-red-600 text-white",
        };
        return styles[status] || styles.available;
    };

    const handleStatusChange = (unitId, newStatus) => {
        router.patch(route("admin.units.update-status", unitId), {
            status: newStatus,
        });
    };

    const buttonStyle =
        "flex items-center justify-center gap-1 px-3 py-2 bg-white/40 text-inherit border border-white/50 rounded-lg hover:bg-white/70 transition disabled:bg-white disabled:text-gray-900 disabled:font-semibold disabled:shadow-md disabled:opacity-100 disabled:cursor-not-allowed";

    const translateStatus = (status) => {
        const map = {
            available: "Tersedia",
            booked: "Dipesan",
            in_use: "Digunakan",
            maintenance: "Perawatan",
        };
        return map[status] || status;
    };

    const unitStats = units.reduce((acc, unit) => {
        const type = unit.type || "Lainnya";
        if (!acc[type]) {
            acc[type] = { total: 0, available: 0 };
        }
        acc[type].total++;
        if (unit.status === "available") {
            acc[type].available++;
        }
        return acc;
    }, {});

    const maintenanceUnits = units.filter((u) => u.status === "maintenance");

    const activeUnitsCount = units.filter((u) => u.status === "in_use").length;

    const availableUnitsCount = units.filter(
        (u) => u.status === "available"
    ).length;

    return (
        <AuthenticatedLayout header="Manajemen Unit Rental">
            <Head title="Unit Rental" />

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-md text-gray-600">Total Unit</div>
                        <div className="text-3xl font-bold text-black">
                            {units.length}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-md text-gray-600">
                            Unit Tersedia
                        </div>
                        <div className="text-3xl font-bold text-black">
                            {availableUnitsCount}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-md text-gray-600">Unit Aktif</div>
                        <div className="text-3xl font-bold text-black">
                            {activeUnitsCount}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-md text-gray-600">
                            Unit Nonaktif
                        </div>
                        <div className="text-3xl font-bold text-black">
                            {maintenanceUnits.length}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
                        <h3 className="text-md font-semibold text-gray-700 mb-4">
                            Status Unit
                        </h3>
                        <div className="space-y-2">
                            {Object.keys(unitStats).length > 0 ? (
                                Object.entries(unitStats).map(
                                    ([type, stats]) => (
                                        <div
                                            key={type}
                                            className="flex justify-between items-center py-2 border-b last:border-b-0"
                                        >
                                            <span className="text-gray-800 font-medium">
                                                {type}
                                            </span>
                                            <span className="text-black font-bold text-lg">
                                                {stats.available}
                                                <span className="text-sm font-normal text-gray-500 ml-1">
                                                    Tersedia
                                                </span>
                                            </span>
                                        </div>
                                    )
                                )
                            ) : (
                                <p className="text-gray-500">
                                    Belum ada data unit.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col h-full gap-4">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-md font-semibold text-gray-700 mb-3">
                                Unit Dalam Perawatan
                            </h3>
                            {maintenanceUnits.length > 0 ? (
                                <ul className="space-y-2 overflow-y-auto max-h-48 pr-2">
                                    {maintenanceUnits.map((unit) => (
                                        <li
                                            key={unit.id}
                                            className="text-gray-800 font-medium bg-red-100 p-2 rounded"
                                        >
                                            {unit.name}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">
                                    Semua unit beroperasi.
                                </p>
                            )}
                        </div>
                        <div className="flex-grow"></div>
                        <Link
                            href={route("admin.units.create")}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0066CC] to-[#0052A3] text-white rounded-lg hover:opacity-90 transition shadow-lg whitespace-nowrap"
                        >
                            + Tambah Unit Baru
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {units.map((unit) => (
                        <div
                            key={unit.id}
                            className={`${getCardStyle(
                                unit.status
                            )} rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}
                        >
                            <div className="p-6 flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div
                                            onClick={() =>
                                                setSelectedUnit(unit)
                                            }
                                            className="cursor-pointer group"
                                        >
                                            <h3 className="text-2xl font-bold group-hover:opacity-80 transition-opacity">
                                                {unit.name}
                                            </h3>
                                            <p className="text-sm opacity-75 font-medium">
                                                {unit.type}
                                            </p>
                                        </div>
                                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-white text-gray-700 shadow-md uppercase tracking-wide">
                                            {translateStatus(unit.status)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() =>
                                                handleStatusChange(
                                                    unit.id,
                                                    "available"
                                                )
                                            }
                                            disabled={
                                                unit.status === "available"
                                            }
                                            className={buttonStyle}
                                        >
                                            <Power className="w-4 h-4" />{" "}
                                            Tersedia
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleStatusChange(
                                                    unit.id,
                                                    "booked"
                                                )
                                            }
                                            disabled={unit.status === "booked"}
                                            className={buttonStyle}
                                        >
                                            <Clock className="w-4 h-4" />{" "}
                                            Dipesan
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleStatusChange(
                                                    unit.id,
                                                    "in_use"
                                                )
                                            }
                                            disabled={unit.status === "in_use"}
                                            className={buttonStyle}
                                        >
                                            <CheckCircle className="w-4 h-4" />{" "}
                                            Digunakan
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleStatusChange(
                                                    unit.id,
                                                    "maintenance"
                                                )
                                            }
                                            disabled={
                                                unit.status === "maintenance"
                                            }
                                            className={buttonStyle}
                                        >
                                            <Wrench className="w-4 h-4" />{" "}
                                            Perawatan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {units.length === 0 && (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <p className="text-gray-500 text-lg">
                            Tidak ada unit rental yang ditemukan. Tambah unit
                            pertama Anda.
                        </p>
                    </div>
                )}
            </div>

            {selectedUnit && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedUnit(null)}
                >
                    <div
                        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-gradient-to-r from-[#0066CC] to-[#0052A3] text-white p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Detail Unit</h2>
                            <button
                                onClick={() => setSelectedUnit(null)}
                                className="text-white hover:bg-white/20 p-2 rounded-lg transition"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-sm text-gray-600 mb-1">
                                        Nama Unit
                                    </div>
                                    <div className="text-xl font-bold text-gray-900">
                                        {selectedUnit.name}
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-sm text-gray-600 mb-1">
                                        Tipe
                                    </div>
                                    <div className="text-xl font-bold text-gray-900">
                                        {selectedUnit.type}
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-sm text-gray-600 mb-1">
                                        Tarif Per Jam
                                    </div>
                                    <div className="text-xl font-bold text-[#0066CC]">
                                        {formatCurrency(
                                            selectedUnit.hourly_rate
                                        )}
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-sm text-gray-600 mb-1">
                                        Status
                                    </div>
                                    <div className="text-xl font-bold text-gray-900 capitalize">
                                        {translateStatus(selectedUnit.status)}
                                    </div>
                                </div>
                            </div>

                            {selectedUnit.description && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-sm text-gray-600 mb-2">
                                        Deskripsi
                                    </div>
                                    <div className="text-gray-900">
                                        {selectedUnit.description}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4 border-t">
                                <Link
                                    href={route(
                                        "admin.units.edit",
                                        selectedUnit.id
                                    )}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0066CC] to-[#0052A3] text-white rounded-lg hover:opacity-90 transition font-semibold shadow-lg"
                                >
                                    Edit Unit
                                </Link>
                                <button
                                    onClick={() =>
                                        router.delete(
                                            route(
                                                "admin.units.destroy",
                                                selectedUnit.id
                                            ),
                                            {
                                                onSuccess: () =>
                                                    setSelectedUnit(null),
                                            }
                                        )
                                    }
                                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold shadow-lg"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
