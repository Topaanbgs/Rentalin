import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, Link } from "@inertiajs/react";
import { useState } from "react";
import { Search, Filter, Eye, X as ResetIcon } from "lucide-react";
import { StatusBadge, translateStatus } from "@/Utils/statusTranslator";

export default function Index({ transactions, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "all");
    const [paymentMethod, setPaymentMethod] = useState(
        filters.payment_method || "all"
    );

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
                                <ResetIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs w-16">
                                    ID
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs w-40">
                                    Members
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs w-32">
                                    Unit
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs w-28">
                                    Jumlah
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs w-32">
                                    Metode Bayar
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs w-32">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs w-36">
                                    Waktu Transaksi
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs w-20">
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
        </AuthenticatedLayout>
    );
}
