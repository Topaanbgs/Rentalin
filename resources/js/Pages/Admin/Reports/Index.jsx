import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { StatusBadge } from "@/Utils/statusTranslator";
import { Head, router, Link } from "@inertiajs/react";
import { useState } from "react";
import {
    Download,
    Calendar,
    TrendingUp,
    DollarSign,
    FileText,
    AlertCircle,
    Filter,
    X as ResetIcon,
    ArrowRight,
    CreditCard,
    Wallet,
    CalendarClock,
    Gamepad2,
} from "lucide-react";

export default function Index({
    stats,
    payment_breakdown,
    revenue_per_unit_type,
    recent_transactions,
    filters,
    staff_name,
}) {
    const [dateFrom, setDateFrom] = useState(filters.date_from || "");
    const [dateTo, setDateTo] = useState(filters.date_to || "");

    const formatCurrency = (amount) => {
        if (amount === null || typeof amount === "undefined") {
            amount = 0;
        }
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDateTime = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Makassar",
        });
    };

    const translatePaymentMethod = (method) => {
        const map = {
            direct: "Langsung (VA/QRIS)",
            balance: "Saldo",
            paylater: "Paylater",
            cash: "Tunai",
        };
        return map[method] || method;
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        router.get(
            route("admin.reports.index"),
            { date_from: dateFrom, date_to: dateTo },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const resetFilters = () => {
        setDateFrom("");
        setDateTo("");
        router.get(
            route("admin.reports.index"),
            {},
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const handleExport = () => {
        // Manually build query string for export
        const params = new URLSearchParams();
        if (dateFrom) params.append("date_from", dateFrom);
        if (dateTo) params.append("date_to", dateTo);
        const queryString = params.toString();

        window.location.href =
            route("admin.reports.export") +
            (queryString ? `?${queryString}` : "");
    };

    // Safely access stats, providing defaults
    const safeStats = {
        total_revenue: stats?.total_revenue ?? 0,
        total_transactions: stats?.total_transactions ?? 0,
        completed_transactions: stats?.completed_transactions ?? 0,
        average_transaction_value: stats?.average_transaction_value ?? 0,
        outstanding_paylater: stats?.outstanding_paylater ?? 0,
    };
    const safePaymentBreakdown = {
        direct: payment_breakdown?.direct ?? 0,
        balance: payment_breakdown?.balance ?? 0,
        paylater: payment_breakdown?.paylater ?? 0,
        cash: payment_breakdown?.cash ?? 0,
    };
    const safeRevenuePerUnitType = revenue_per_unit_type || [];
    const safeRecentTransactions = recent_transactions || [];

    return (
        <AuthenticatedLayout header="Laporan Keuangan">
            <Head title="Laporan Keuangan" />

            <div className="space-y-6">
                {/* Staff Info Banner */}
                <div className="bg-gradient-to-r from-[#0066CC] to-[#0052A3] rounded-lg shadow-lg p-6 text-white">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">
                                Laporan Keuangan
                            </h2>
                            <p className="text-blue-100">Staf: {staff_name}</p>
                        </div>
                        <button
                            onClick={handleExport}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#0066CC] rounded-lg hover:bg-gray-100 transition font-semibold shadow"
                        >
                            <Download className="w-4 h-4" />
                            Ekspor Excel
                        </button>
                    </div>
                </div>

                {/* Date Filter */}
                <div className="bg-white rounded-lg shadow p-4">
                    <form
                        onSubmit={handleFilterSubmit}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
                    >
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Calendar className="w-4 h-4 inline mr-1 text-gray-500" />
                                Dari Tanggal
                            </label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-[#0066CC]"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Calendar className="w-4 h-4 inline mr-1 text-gray-500" />
                                Sampai Tanggal
                            </label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-[#0066CC]"
                            />
                        </div>
                        <div className="md:col-span-2 flex items-end gap-2">
                            <button
                                type="submit"
                                className="w-full flex-1 justify-center inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0066CC] to-[#0052A3] text-white rounded-lg hover:opacity-90 transition shadow font-semibold"
                            >
                                <Filter className="w-4 h-4" />
                                Terapkan Filter
                            </button>
                            <button
                                type="button"
                                onClick={resetFilters}
                                title="Reset Filter"
                                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                            >
                                <ResetIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm text-gray-600 font-medium">
                                Total Pendapatan
                            </div>
                            <DollarSign className="w-6 h-6 text-green-500" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">
                            {formatCurrency(safeStats.total_revenue)}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm text-gray-600 font-medium">
                                Total Transaksi
                            </div>
                            <FileText className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">
                            {safeStats.total_transactions}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            {safeStats.completed_transactions} selesai
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm text-gray-600 font-medium">
                                Rata-rata / Transaksi
                            </div>
                            <TrendingUp className="w-6 h-6 text-indigo-500" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">
                            {formatCurrency(
                                safeStats.average_transaction_value
                            )}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm text-gray-600 font-medium">
                                Tagihan Paylater
                            </div>
                            <AlertCircle className="w-6 h-6 text-orange-500" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">
                            {formatCurrency(safeStats.outstanding_paylater)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            Belum Dibayar
                        </div>
                    </div>
                </div>

                {/* Breakdown & Revenue per Type */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Payment Breakdown */}
                    <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900">
                            Breakdown Metode Pembayaran
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-center justify-between py-2 border-b">
                                <span className="flex items-center text-sm font-medium text-gray-700">
                                    <CreditCard className="w-4 h-4 mr-2 text-blue-500" />{" "}
                                    Langsung (VA/QRIS)
                                </span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {formatCurrency(
                                        safePaymentBreakdown.direct
                                    )}
                                </span>
                            </li>
                            <li className="flex items-center justify-between py-2 border-b">
                                <span className="flex items-center text-sm font-medium text-gray-700">
                                    <Wallet className="w-4 h-4 mr-2 text-green-500" />{" "}
                                    Saldo
                                </span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {formatCurrency(
                                        safePaymentBreakdown.balance
                                    )}
                                </span>
                            </li>
                            <li className="flex items-center justify-between py-2 border-b">
                                <span className="flex items-center text-sm font-medium text-gray-700">
                                    <CalendarClock className="w-4 h-4 mr-2 text-purple-500" />{" "}
                                    Paylater
                                </span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {formatCurrency(
                                        safePaymentBreakdown.paylater
                                    )}
                                </span>
                            </li>
                            <li className="flex items-center justify-between py-2">
                                <span className="flex items-center text-sm font-medium text-gray-700">
                                    <DollarSign className="w-4 h-4 mr-2 text-gray-500" />{" "}
                                    Tunai
                                </span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {formatCurrency(safePaymentBreakdown.cash)}
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Revenue per Unit Type */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900">
                            Pendapatan per Tipe Unit
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tipe Unit
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Jumlah Transaksi
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Pendapatan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {safeRevenuePerUnitType.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="3"
                                                className="px-4 py-6 text-center text-gray-500"
                                            >
                                                Tidak ada data pendapatan per
                                                tipe unit.
                                            </td>
                                        </tr>
                                    ) : (
                                        safeRevenuePerUnitType.map(
                                            (unitType, idx) => (
                                                <tr
                                                    key={idx}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                                                        <Gamepad2 className="w-4 h-4 mr-2 text-gray-400" />{" "}
                                                        {unitType.unit_type}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                        {
                                                            unitType.total_bookings
                                                        }
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-[#0066CC]">
                                                        {formatCurrency(
                                                            unitType.total_revenue
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Recent Transactions Table */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Transaksi Terbaru
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Members
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Unit
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Metode
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {safeRecentTransactions.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-6 py-10 text-center text-gray-500"
                                        >
                                            Tidak ada transaksi pada rentang
                                            tanggal ini.
                                        </td>
                                    </tr>
                                ) : (
                                    safeRecentTransactions.map((t, index) => (
                                        <tr
                                            key={t.id}
                                            className={
                                                index % 2 === 0
                                                    ? "bg-white"
                                                    : "bg-gray-50 hover:bg-gray-100"
                                            }
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                <Link
                                                    href={route(
                                                        "admin.transactions.show",
                                                        t.id
                                                    )}
                                                    className="text-[#0066CC] hover:underline"
                                                >
                                                    #{t.id}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                {t.member_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                {t.unit_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                {formatCurrency(t.total_price)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                                                {translatePaymentMethod(
                                                    t.payment_method
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge
                                                    status={t.status}
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {formatDateTime(t.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <Link
                                                    href={route(
                                                        "admin.transactions.show",
                                                        t.id
                                                    )}
                                                    className="text-[#0066CC] hover:text-[#0052A3] inline-flex items-center gap-1"
                                                >
                                                    <ArrowRight className="w-3 h-3" />{" "}
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
            </div>
        </AuthenticatedLayout>
    );
}
