import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import { Search, Filter, Eye, CheckCircle } from "lucide-react";

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
        return new Date(date).toLocaleString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending_payment: { bg: "bg-yellow-100", text: "text-yellow-800" },
            confirmed: { bg: "bg-blue-100", text: "text-blue-800" },
            grace_period_active: {
                bg: "bg-orange-100",
                text: "text-orange-800",
            },
            checked_in: { bg: "bg-[#B4E4CE]", text: "text-[#0066CC]" },
            in_progress: { bg: "bg-green-100", text: "text-green-800" },
            completed: { bg: "bg-gray-100", text: "text-gray-800" },
            cancelled: { bg: "bg-red-100", text: "text-red-800" },
            cancelled_no_show: { bg: "bg-red-200", text: "text-red-900" },
        };
        const badge = badges[status] || badges.pending_payment;
        return (
            <span
                className={`px-2 py-1 text-xs font-semibold rounded ${badge.bg} ${badge.text}`}
            >
                {status.replace(/_/g, " ")}
            </span>
        );
    };

    const handleFilter = () => {
        router.get(
            route("admin.transactions.index"),
            { status, payment_method: paymentMethod },
            { preserveState: true }
        );
    };

    return (
        <AuthenticatedLayout header="Transactions Management">
            <Head title="Transactions" />

            <div className="space-y-6">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC]"
                            >
                                <option value="all">All Status</option>
                                <option value="pending_payment">
                                    Pending Payment
                                </option>
                                <option value="grace_period_active">
                                    Grace Period
                                </option>
                                <option value="checked_in">Checked In</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Payment Method
                            </label>
                            <select
                                value={paymentMethod}
                                onChange={(e) =>
                                    setPaymentMethod(e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC]"
                            >
                                <option value="all">All Methods</option>
                                <option value="direct">Direct (VA/QRIS)</option>
                                <option value="balance">Balance</option>
                                <option value="paylater">Paylater</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 flex items-end gap-2">
                            <button
                                onClick={handleFilter}
                                className="px-6 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0052A3] transition"
                            >
                                <Filter className="w-4 h-4 inline mr-2" />
                                Apply Filter
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Member
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Unit
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Payment
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {transactions.data.map((t) => (
                                    <tr key={t.id} className="hover:bg-gray-50">
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {t.unit.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#0066CC]">
                                            {formatCurrency(t.total_price)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {t.payment_method}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(t.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDateTime(t.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <a
                                                href={route(
                                                    "admin.transactions.show",
                                                    t.id
                                                )}
                                                className="text-[#0066CC] hover:text-[#0052A3] inline-flex items-center gap-1"
                                            >
                                                <Eye className="w-4 h-4" /> View
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {transactions.links && (
                        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-between">
                            <div className="text-sm text-gray-700">
                                Showing {transactions.from} to {transactions.to}{" "}
                                of {transactions.total} results
                            </div>
                            <div className="flex gap-2">
                                {transactions.links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() =>
                                            link.url && router.get(link.url)
                                        }
                                        disabled={!link.url}
                                        className={`px-3 py-1 rounded ${
                                            link.active
                                                ? "bg-[#0066CC] text-white"
                                                : "bg-white text-gray-700 hover:bg-gray-100"
                                        } disabled:opacity-50`}
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
