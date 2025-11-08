import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { StatusBadge } from "@/Utils/statusTranslator";
import { Head, router, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Search, Filter, Eye, X, PlusCircle, DollarSign } from "lucide-react";

export default function Index({ transactions, availableUnits, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "all");
    const [paymentMethod, setPaymentMethod] = useState(
        filters.payment_method || "all"
    );
    const [showCashModal, setShowCashModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        customer_name: "",
        rental_unit_id: "",
        duration_hours: 1,
        amount_paid: "",
    });

    const formatCurrency = (a) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(a);

    const formatDateTime = (d) =>
        d
            ? new Date(d).toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "Asia/Makassar",
              })
            : "-";

    const handleFilterSubmit = () =>
        router.get(
            route("admin.transactions.index"),
            { search, status, payment_method: paymentMethod },
            { preserveState: true, preserveScroll: true, replace: true }
        );

    const resetFilters = () => {
        setSearch("");
        setStatus("all");
        setPaymentMethod("all");
        router.get(
            route("admin.transactions.index"),
            {},
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const translatePaymentMethod = (m) => {
        const map = {
            va: "Virtual Account",
            qris: "QRIS",
            balance: "Saldo",
            paylater: "Paylater",
            cash: "Tunai",
        };
        return map[m] || m;
    };

    const selectedUnit = availableUnits?.find(
        (u) => u.id === parseInt(data.rental_unit_id)
    );
    const calculatedTotal = selectedUnit
        ? selectedUnit.hourly_rate * data.duration_hours
        : 0;
    const calculatedChange = data.amount_paid - calculatedTotal;

    const handleSubmitCash = (e) => {
        e.preventDefault();
        post(route("admin.transactions.store-cash"), {
            onSuccess: () => {
                reset();
                setShowCashModal(false);
            },
        });
    };

    return (
        <AuthenticatedLayout header="Manajemen Transaksi">
            <Head title="Transaksi" />
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-800">
                            Filter Transaksi
                        </h3>
                        <button
                            onClick={() => setShowCashModal(true)}
                            disabled={
                                !availableUnits || availableUnits.length === 0
                            }
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Transaksi Langsung
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cari
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) =>
                                        e.key === "Enter" &&
                                        handleFilterSubmit()
                                    }
                                    className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0066CC]"
                                    placeholder="Cari berdasarkan ID..."
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0066CC]"
                            >
                                <option value="all">Semua Status</option>
                                <option value="pending_payment">
                                    Menunggu Pembayaran
                                </option>
                                <option value="grace_period_active">
                                    Menunggu Kedatangan
                                </option>
                                <option value="checked_in">Bermain</option>
                                <option value="completed">Selesai</option>
                                <option value="cancelled">Dibatalkan</option>
                                <option value="cancelled_expired">
                                    Tidak Datang
                                </option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Metode Pembayaran
                            </label>
                            <select
                                value={paymentMethod}
                                onChange={(e) =>
                                    setPaymentMethod(e.target.value)
                                }
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0066CC]"
                            >
                                <option value="all">Semua Metode</option>
                                <option value="qris">QRIS</option>
                                <option value="balance">Saldo</option>
                                <option value="paylater">Paylater</option>
                                <option value="cash">Tunai</option>
                            </select>
                        </div>
                        <div className="flex items-end gap-2">
                            <button
                                onClick={handleFilterSubmit}
                                className="w-full flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0066CC] to-[#0052A3] text-white rounded-lg hover:opacity-90 shadow"
                            >
                                <Filter className="w-4 h-4" /> Terapkan
                            </button>
                            <button
                                onClick={resetFilters}
                                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">
                                    ID
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">
                                    Customer
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">
                                    Unit
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">
                                    Jumlah
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">
                                    Metode Bayar
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">
                                    Waktu Transaksi
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {transactions.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="px-6 py-10 text-center text-gray-500"
                                    >
                                        Tidak ada transaksi yang cocok dengan
                                        filter.
                                    </td>
                                </tr>
                            ) : (
                                transactions.data.map((t) => (
                                    <tr key={t.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-semibold text-gray-900">
                                            #{t.id}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-gray-900">
                                                {t.customer_name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {t.member.phone}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">
                                            {t.unit.name}
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-gray-900">
                                            {formatCurrency(t.total_price)}
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">
                                            {translatePaymentMethod(
                                                t.payment_method
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={t.status} />
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {formatDateTime(t.created_at)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={route(
                                                    "admin.transactions.show",
                                                    t.id
                                                )}
                                                className="text-[#0066CC] hover:text-[#0052A3] inline-flex items-center gap-1"
                                            >
                                                <Eye className="w-4 h-4" />{" "}
                                                Lihat
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showCashModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Transaksi Langsung
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Customer{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.customer_name}
                                    onChange={(e) =>
                                        setData("customer_name", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0066CC]"
                                    placeholder="Masukkan nama customer"
                                />
                                {errors.customer_name && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.customer_name}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Pilih Unit{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.rental_unit_id}
                                    onChange={(e) =>
                                        setData(
                                            "rental_unit_id",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0066CC]"
                                >
                                    <option value="">-- Pilih Unit --</option>
                                    {availableUnits?.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.name} ({u.type}) -{" "}
                                            {formatCurrency(u.hourly_rate)}/jam
                                        </option>
                                    ))}
                                </select>
                                {errors.rental_unit_id && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.rental_unit_id}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Durasi{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.duration_hours}
                                    onChange={(e) =>
                                        setData(
                                            "duration_hours",
                                            parseInt(e.target.value)
                                        )
                                    }
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0066CC]"
                                >
                                    <option value={1}>1 Jam</option>
                                    <option value={2}>2 Jam</option>
                                    <option value={3}>3 Jam</option>
                                    <option value={4}>4 Jam</option>
                                    <option value={5}>5 Jam</option>
                                </select>
                                {errors.duration_hours && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.duration_hours}
                                    </p>
                                )}
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-gray-700">
                                        Total Tagihan:
                                    </span>
                                    <span className="font-bold text-[#0066CC]">
                                        {formatCurrency(calculatedTotal)}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Uang Dibayarkan{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={data.amount_paid}
                                    onChange={(e) =>
                                        setData(
                                            "amount_paid",
                                            e.target.value === ""
                                                ? ""
                                                : parseFloat(e.target.value)
                                        )
                                    }
                                    min="0"
                                    step="1000"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0066CC]"
                                    placeholder="Masukkan nominal"
                                />
                                {errors.amount_paid && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.amount_paid}
                                    </p>
                                )}
                            </div>
                            {data.amount_paid > 0 && calculatedTotal > 0 && (
                                <div
                                    className={`rounded-lg p-3 ${
                                        calculatedChange >= 0
                                            ? "bg-green-50 border border-green-200"
                                            : "bg-red-50 border border-red-200"
                                    }`}
                                >
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-gray-700">
                                            Kembalian:
                                        </span>
                                        <span
                                            className={`font-bold ${
                                                calculatedChange >= 0
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {formatCurrency(
                                                Math.abs(calculatedChange)
                                            )}
                                            {calculatedChange < 0 &&
                                                " (Kurang)"}
                                        </span>
                                    </div>
                                </div>
                            )}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCashModal(false);
                                        reset();
                                    }}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmitCash}
                                    disabled={
                                        processing ||
                                        calculatedChange < 0 ||
                                        !data.customer_name ||
                                        !data.rental_unit_id
                                    }
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <DollarSign className="w-4 h-4" />
                                    {processing
                                        ? "Memproses..."
                                        : "Buat Transaksi"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
