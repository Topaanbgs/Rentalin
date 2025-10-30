import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

export default function Edit({ unit }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: unit.name,
        type: unit.type,
        hourly_rate: unit.hourly_rate,
        description: unit.description || "",
        status: unit.status,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route("admin.units.update", unit.id));
    };

    return (
        <AuthenticatedLayout header={`Edit Unit Rental: ${unit.name}`}>
            <Head title="Edit Unit Rental" />

            <div className="max-w-3xl mx-auto">
                <Link
                    href={route("admin.units.index")}
                    className="inline-flex items-center gap-2 text-[#0066CC] hover:text-[#0052A3] mb-6 font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Unit
                </Link>

                <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Unit *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-[#0066CC] focus:border-transparent"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipe Konsol *
                                </label>
                                <select
                                    value={data.type}
                                    onChange={(e) =>
                                        setData("type", e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-[#0066CC] focus:border-transparent"
                                >
                                    <option value="PS5">PlayStation 5</option>
                                    <option value="PS5_DIGITAL">
                                        PlayStation 5 Digital
                                    </option>
                                    <option value="PS4">PlayStation 4</option>
                                    <option value="PS4_PRO">
                                        PlayStation 4 Pro
                                    </option>
                                </select>
                                {errors.type && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.type}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tarif Per Jam (IDR) *
                                </label>
                                <input
                                    type="number"
                                    value={data.hourly_rate}
                                    onChange={(e) =>
                                        setData("hourly_rate", e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-[#0066CC] focus:border-transparent"
                                />
                                {errors.hourly_rate && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.hourly_rate}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status *
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-[#0066CC] focus:border-transparent"
                                >
                                    <option value="available">Tersedia</option>
                                    <option value="booked">Dipesan</option>
                                    <option value="in_use">Digunakan</option>
                                    <option value="maintenance">
                                        Perawatan
                                    </option>
                                </select>
                                {errors.status && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.status}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Deskripsi
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-[#0066CC] focus:border-transparent"
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 inline-flex justify-center px-6 py-3 bg-gradient-to-r from-[#0066CC] to-[#0052A3] text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 font-semibold shadow-md"
                            >
                                {processing
                                    ? "Memperbarui..."
                                    : "Perbarui Unit"}
                            </button>
                            <Link
                                href={route("admin.units.index")}
                                className="inline-flex justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                            >
                                Batal
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
