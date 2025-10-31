import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, Link } from "@inertiajs/react";
import { useState } from "react";
import { Search, Filter, Eye, X as ResetIcon } from "lucide-react";

export default function Index({ transactions, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "all");
    const [paymentMethod, setPaymentMethod] = useState(
        filters.payment_method || "all"
    );

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);

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

    const translateStatus = (status) => {
        const map = {
            pending_payment: "Menunggu Pembayaran",
            confirmed: "Terkonfirmasi",
            grace_period_active: "Masa Tenggang",
            checked_in: "Sudah Masuk",
            in_progress: "Sedang Berlangsung",
            completed: "Selesai",
            cancelled: "Dibatalkan",
            cancelled_no_show: "Batal (Tidak Hadir)",
        };
        return map[status] || status.replace(/_/g, " ");
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending_payment: { bg: "bg-yellow-100", text: "text-yellow-800" },
            confirmed: { bg: "bg-blue-100", text: "text-blue-800" },
            grace_period_active: {
                bg: "bg-orange-100",
                text: "text-orange-800",
            },
            checked_in: { bg: "bg-cyan-100", text: "text-cyan-800" },
            in_progress: { bg: "bg-green-100", text: "text-green-800" },
            completed: { bg: "bg-gray-200", text: "text-gray-800" },
            cancelled: { bg: "bg-red-100", text: "text-red-800" },
            cancelled_no_show: { bg: "bg-red-200", text: "text-red-900" },
        };
        const badge = badges[status] || badges.pending_payment;
        return (
            <span
                className={`px-2 py-0.5 inline-flex text-xs font-semibold rounded-full ${badge.bg} ${badge.text}`}
            >
                {translateStatus(status)}
            </span>
        );
    };

    const handleFilterSubmit = () => {
        router.get(
            route("admin.transactions.index"),
            { search, status, payment_method: paymentMethod },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const handleSearchKeyDown = (e) =>
        e.key === "Enter" && handleFilterSubmit();

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

    const translatePaymentMethod = (method) => {
        const map = {
            direct: "Langsung (VA/QRIS)",
            balance: "Saldo",
            paylater: "Paylater",
            cash: "Tunai",
        };
        return map[method] || method;
    };

    return (
        <AuthenticatedLayout header="Manajemen Transaksi">
            <Head title="Transaksi" />

            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-4">
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
                                    onKeyDown={handleSearchKeyDown}
                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-[#0066CC]"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-[#0066CC]"
                            >
                                <option value="all">Semua Status</option>
                                <option value="pending_payment">
                                    Menunggu Pembayaran
                                </option>
                                <option value="grace_period_active">
                                    Masa Tenggang
                                </option>
                                <option value="checked_in">Sudah Masuk</option>
                                <option value="in_progress">Berlangsung</option>
                                <option value="completed">Selesai</option>
                                <option value="cancelled">Dibatalkan</option>
                                <option value="cancelled_no_show">
                                    Batal (Tidak Hadir)
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-[#0066CC]"
                            >
                                <option value="all">Semua Metode</option>
                                <option value="direct">
                                    Langsung (VA/QRIS)
                                </option>
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
                                <Filter className="w-4 h-4" />
                                Terapkan
                            </button>
                            <button
                                onClick={resetFilters}
                                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                                <ResetIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full table-fixed divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="w-16 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="w-40 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Anggota
                                </th>
                                <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Unit
                                </th>
                                <th className="w-28 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Jumlah
                                </th>
                                <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Bayar
                                </th>
                                <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="w-36 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tanggal
                                </th>
                                <th className="w-20 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {transactions.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="px-6 py-10 text-center text-gray-500"
                                    >
                                        Tidak ada transaksi yang cocok dengan
                                        filter.
                                    </td>
                                </tr>
                            )}
                            {transactions.data.map((t) => (
                                <tr key={t.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-900 font-semibold">
                                        #{t.id}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-gray-900 truncate">
                                            {t.member.name}
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
                                        {getStatusBadge(t.status)}
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
                                            <Eye className="w-4 h-4" />
                                            Lihat
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {transactions.links && transactions.links.length > 3 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-3">
                            <div className="text-sm text-gray-700">
                                Menampilkan {transactions.from} sampai{" "}
                                {transactions.to} dari {transactions.total}{" "}
                                hasil
                            </div>
                            <div className="inline-flex rounded-md shadow-sm -space-x-px">
                                {transactions.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || "#"}
                                        className={`relative inline-flex items-center px-3 py-2 text-sm font-medium border ${
                                            link.active
                                                ? "bg-gradient-to-r from-[#0066CC] to-[#0052A3] text-white border-[#0052A3]"
                                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                        } ${
                                            !link.url
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : ""
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
