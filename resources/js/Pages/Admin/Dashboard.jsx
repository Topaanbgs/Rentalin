import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    DollarSign,
    Users,
    ListChecks,
    Calendar,
    ArrowRight,
} from "lucide-react";

export default function Dashboard({
    stats,
    activeBookings,
    recentTransactions,
}) {
    const formatCurrency = (amount) => {
        if (amount === null || typeof amount === "undefined") amount = 0;
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDateTime = (date) => {
        if (!date) return "-";
        try {
            return new Date(date).toLocaleString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Makassar",
            });
        } catch {
            return "Invalid Date";
        }
    };

    const translateStatus = (status) => {
        const map = {
            grace_period_active: "Tenggang Aktif",
            checked_in: "Sudah Masuk",
            in_progress: "Berlangsung",
            completed: "Selesai",
            cancelled: "Dibatalkan",
            pending: "Menunggu",
            paid: "Dibayar",
            failed: "Gagal",
            expired: "Kedaluwarsa",
            refunded: "Dikembalikan",
        };
        return (
            map[status] ||
            (status ? status.replace(/_/g, " ") : "Tidak Diketahui")
        );
    };

    const getStatusBadge = (status) => {
        const badges = {
            grace_period_active:
                "bg-yellow-100 text-yellow-800 border border-yellow-300",
            checked_in: "bg-cyan-100 text-cyan-800 border border-cyan-300",
            in_progress: "bg-blue-100 text-blue-800 border border-blue-300",
            completed: "bg-green-100 text-green-800 border border-green-300",
            paid: "bg-green-100 text-green-800 border border-green-300",
            cancelled: "bg-red-100 text-red-800 border border-red-300",
            failed: "bg-red-100 text-red-800 border border-red-300",
            expired: "bg-gray-200 text-gray-800 border border-gray-400",
            refunded: "bg-purple-100 text-purple-800 border border-purple-300",
            pending: "bg-orange-100 text-orange-800 border border-orange-300",
        };
        return (
            badges[status] || "bg-gray-100 text-gray-800 border border-gray-300"
        );
    };

    const StatCard = ({ icon: Icon, title, value, link }) => (
        <Link
            href={link || "#"}
            className="block p-6 rounded-xl shadow-lg bg-white hover:shadow-xl transition"
        >
            <div className="flex justify-between items-start mb-2">
                <div className="p-3 rounded-full bg-gray-100">
                    <Icon className="w-6 h-6 text-gray-700" />
                </div>
            </div>
            <div className="text-sm text-gray-600 mb-1">{title}</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
            <div className="text-xs text-gray-500 flex items-center group">
                Lihat Detail{" "}
                <ArrowRight className="w-3 h-3 ml-1 text-[#0066CC] group-hover:translate-x-1 transition-transform" />
            </div>
        </Link>
    );

    const changePage = (table, url) => {
        if (!url) return;
        router.get(url, {}, { preserveScroll: true, preserveState: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard Admin
                </h2>
            }
        >
            <Head title="Dashboard Admin" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            icon={DollarSign}
                            title="Pendapatan Hari Ini"
                            value={formatCurrency(stats.today_revenue)}
                            link="#"
                        />
                        <StatCard
                            icon={Calendar}
                            title="Pendapatan Bulan Ini"
                            value={formatCurrency(stats.month_revenue)}
                            link="#"
                        />
                        <StatCard
                            icon={ListChecks}
                            title="Sesi Aktif"
                            value={stats.active_bookings}
                            link="#"
                        />
                        <StatCard
                            icon={Users}
                            title="Total Anggota"
                            value={stats.total_members}
                            link="#"
                        />
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white overflow-hidden shadow-lg rounded-xl flex flex-col">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Sesi Aktif Saat Ini
                                </h3>
                            </div>
                            <div className="overflow-x-auto flex-grow">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Anggota
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Unit
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Mulai
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {activeBookings.data.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="px-6 py-10 text-center text-gray-500"
                                                >
                                                    Tidak ada sesi aktif.
                                                </td>
                                            </tr>
                                        ) : (
                                            activeBookings.data.map(
                                                (booking) => (
                                                    <tr
                                                        key={booking.id}
                                                        className="hover:bg-gray-50 transition-colors"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {
                                                                    booking.member_name
                                                                }
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {
                                                                    booking.member_phone
                                                                }
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                            {booking.unit_name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span
                                                                className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                                                                    booking.status
                                                                )}`}
                                                            >
                                                                {translateStatus(
                                                                    booking.status
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                            {formatDateTime(
                                                                booking.start_time
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <Link
                                                                href={route(
                                                                    "admin.transactions.show",
                                                                    booking.id
                                                                )}
                                                                className="text-[#0066CC] hover:text-[#0052A3] transition flex items-center gap-1"
                                                            >
                                                                Lihat Detail
                                                                <ArrowRight className="w-4 h-4" />
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {activeBookings.links &&
                                activeBookings.links.length > 3 && (
                                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                                        <div className="text-sm text-gray-700">
                                            Menampilkan {activeBookings.from}{" "}
                                            sampai {activeBookings.to} dari{" "}
                                            {activeBookings.total} hasil
                                        </div>
                                        <div className="inline-flex rounded-md shadow-sm">
                                            {activeBookings.links.map(
                                                (link, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() =>
                                                            changePage(
                                                                "activeBookings",
                                                                link.url
                                                            )
                                                        }
                                                        disabled={!link.url}
                                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border transition
                                                    ${
                                                        link.active
                                                            ? "bg-gradient-to-r from-[#0066CC] to-[#0052A3] text-white border-[#0052A3]"
                                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                    }
                                                    ${
                                                        !link.url
                                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                            : ""
                                                    }`}
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                        </div>

                        <div className="bg-white overflow-hidden shadow-lg rounded-xl flex flex-col">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Transaksi Terbaru
                                </h3>
                            </div>
                            <div className="overflow-x-auto flex-grow">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Anggota
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Jumlah
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tanggal
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {recentTransactions.data.length ===
                                        0 ? (
                                            <tr>
                                                <td
                                                    colSpan="4"
                                                    className="px-6 py-10 text-center text-gray-500"
                                                >
                                                    Tidak ada transaksi terbaru.
                                                </td>
                                            </tr>
                                        ) : (
                                            recentTransactions.data.map(
                                                (transaction) => (
                                                    <tr
                                                        key={transaction.id}
                                                        className="hover:bg-gray-50 transition-colors"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                            {
                                                                transaction.member_name
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {formatCurrency(
                                                                transaction.total_price
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span
                                                                className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                                                                    transaction.status
                                                                )}`}
                                                            >
                                                                {translateStatus(
                                                                    transaction.status
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                            {formatDateTime(
                                                                transaction.created_at
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {recentTransactions.links &&
                                recentTransactions.links.length > 3 && (
                                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                                        <div className="text-sm text-gray-700">
                                            Menampilkan{" "}
                                            {recentTransactions.from} sampai{" "}
                                            {recentTransactions.to} dari{" "}
                                            {recentTransactions.total} hasil
                                        </div>
                                        <div className="inline-flex rounded-md shadow-sm">
                                            {recentTransactions.links.map(
                                                (link, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() =>
                                                            changePage(
                                                                "recentTransactions",
                                                                link.url
                                                            )
                                                        }
                                                        disabled={!link.url}
                                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border transition
                                                    ${
                                                        link.active
                                                            ? "bg-gradient-to-r from-[#0066CC] to-[#0052A3] text-white border-[#0052A3]"
                                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                    }
                                                    ${
                                                        !link.url
                                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                            : ""
                                                    }`}
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
