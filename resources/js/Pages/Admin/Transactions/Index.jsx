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

    const formatCurrency = (amount) => {
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
            checked_in: { bg: "bg-cyan-100", text: "text-cyan-800" }, // Konsisten
            in_progress: { bg: "bg-green-100", text: "text-green-800" },
            completed: { bg: "bg-gray-200", text: "text-gray-800" }, // Dibedakan
            cancelled: { bg: "bg-red-100", text: "text-red-800" },
            cancelled_no_show: { bg: "bg-red-200", text: "text-red-900" },
        };
        const badge = badges[status] || badges.pending_payment;
        return (
            <span
                className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${badge.bg} ${badge.text}`}
            >
                {translateStatus(status)}
            </span>
        );
    };

    const handleFilterSubmit = () => {
        router.get(
            route("admin.transactions.index"),
            {
                search: search,
                status: status,
                payment_method: paymentMethod,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            handleFilterSubmit();
        }
    };

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
            cash: "Tunai", // Asumsi
        };
        return map[method] || method;
    };

    return (
        <AuthenticatedLayout header="Manajemen Transaksi">
            <Head title="Transaksi" />

            <div className="space-y-6">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cari (ID / Anggota)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={handleSearchKeyDown}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-[#0066CC]"
                                    placeholder="Ketik lalu Enter..."
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
                                className="w-full flex-1 justify-center inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0066CC] to-[#0052A3] text-white rounded-lg hover:opacity-90 transition shadow"
                            >
                                <Filter className="w-4 h-4" />
                                Terapkan
                            </button>
                            <button
                                onClick={resetFilters}
                                title="Reset Filter"
                                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                            >
                                <ResetIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID Transaksi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Anggota
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Unit
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Jumlah
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pembayaran
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
                                {transactions.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-6 py-12 text-center text-gray-500"
                                        >
                                            Tidak ada transaksi yang cocok
                                            dengan filter.
                                        </td>
                                    </tr>
                                )}
                                {transactions.data.map((t) => (
                                    <tr
                                        key={t.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{t.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {t.member.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {t.member.phone}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                            {t.unit.name}
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
                                            {getStatusBadge(t.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {formatDateTime(t.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <Link
                                                href={route(
                                                    "admin.transactions.show",
                                                    t.id
                                                )}
                                                className="text-[#0066CC] hover:text-[#0052A3] inline-flex items-center gap-1 font-medium"
                                            >
                                                <Eye className="w-4 h-4" />{" "}
                                                Lihat
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {transactions.links && transactions.links.length > 3 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-3">
                            <div className="text-sm text-gray-700 mb-2 md:mb-0">
                                Menampilkan {transactions.from} sampai{" "}
                                {transactions.to} dari {transactions.total}{" "}
                                hasil
                            </div>
                            <div className="inline-flex rounded-md shadow-sm -space-x-px">
                                {transactions.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || "#"}
                                        disabled={!link.url}
                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border
                                            ${
                                                link.active
                                                    ? "bg-gradient-to-r from-[#0066CC] to-[#0052A3] text-white border-[#0052A3] z-10"
                                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                            }
                                            ${idx === 0 ? "rounded-l-md" : ""}
                                            ${
                                                idx ===
                                                transactions.links.length - 1
                                                    ? "rounded-r-md"
                                                    : ""
                                            }
                                            ${
                                                !link.url
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    : ""
                                            }
                                        `}
                                    >
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
