import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    DollarSign,
    Users,
    ListChecks,
    Calendar,
    ArrowRight,
} from "lucide-react";
import { translateStatus, StatusBadge } from "@/Utils/statusTranslator";

export default function Dashboard({
    stats,
    activeBookings,
    recentTransactions,
}) {
    const formatCurrency = (a) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(a || 0);

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
            <div className="text-xs text-[#0066CC] flex items-center group">
                Lihat Detail
                <ArrowRight className="w-3 h-3 ml-1 text-[#0066CC] group-hover:translate-x-1 transition-transform" />
            </div>
        </Link>
    );

    const changePage = (table, url) => {
        if (url)
            router.get(url, {}, { preserveScroll: true, preserveState: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800">
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
                        />
                        <StatCard
                            icon={Calendar}
                            title="Pendapatan Bulan Ini"
                            value={formatCurrency(stats.month_revenue)}
                        />
                        <StatCard
                            icon={ListChecks}
                            title="Sesi Aktif"
                            value={stats.active_bookings}
                        />
                        <StatCard
                            icon={Users}
                            title="Total Members"
                            value={stats.total_members}
                        />
                    </div>

                    <div className="space-y-8">
                        {/* Active Sessions */}
                        <div className="bg-white overflow-hidden shadow-lg rounded-xl flex flex-col">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Sesi Aktif Saat Ini
                                </h3>
                            </div>
                            <div className="overflow-x-auto flex-grow">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Members
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Unit
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Mulai
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
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
                                            activeBookings.data.map((b) => (
                                                <tr
                                                    key={b.id}
                                                    className="hover:bg-gray-50 transition"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {b.member_name}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {b.member_phone}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800">
                                                        {b.unit_name}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <StatusBadge
                                                            status={b.status}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {formatDateTime(
                                                            b.start_time
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium">
                                                        <Link
                                                            href={route(
                                                                "admin.transactions.show",
                                                                b.id
                                                            )}
                                                            className="text-[#0066CC] hover:text-[#0052A3] flex items-center gap-1"
                                                        >
                                                            Lihat Detail
                                                            <ArrowRight className="w-4 h-4" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="bg-white overflow-hidden shadow-lg rounded-xl">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Transaksi Terbaru
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Members
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Jumlah
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Waktu Transaksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
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
                                            recentTransactions.data.map((t) => (
                                                <tr
                                                    key={t.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 text-sm text-gray-800">
                                                        {t.member_name}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                        {formatCurrency(
                                                            t.total_price
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <StatusBadge
                                                            status={t.status}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {formatDateTime(
                                                            t.created_at
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
