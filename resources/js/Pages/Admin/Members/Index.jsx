import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import { Search, Eye, CheckCircle, XCircle } from "lucide-react";

export default function Index({ members, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [verified, setVerified] = useState(filters.verified || "all");

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("admin.members.index"),
            { search, verified },
            { preserveState: true }
        );
    };

    const getTrustScoreBadge = (score) => {
        if (score >= 120)
            return {
                bg: "bg-green-100",
                text: "text-green-800",
                label: "Excellent",
            };
        if (score >= 100)
            return {
                bg: "bg-[#B4E4CE]",
                text: "text-[#0066CC]",
                label: "Good",
            };
        if (score >= 80)
            return {
                bg: "bg-yellow-100",
                text: "text-yellow-800",
                label: "Fair",
            };
        return { bg: "bg-red-100", text: "text-red-800", label: "Poor" };
    };

    return (
        <AuthenticatedLayout header="Members Management">
            <Head title="Members" />

            <div className="space-y-6">
                {/* Search & Filter */}
                <div className="bg-white rounded-lg shadow p-4">
                    <form
                        onSubmit={handleSearch}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, email, or phone..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC]"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={verified}
                                onChange={(e) => setVerified(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC]"
                            >
                                <option value="all">All Members</option>
                                <option value="true">Verified</option>
                                <option value="false">Unverified</option>
                            </select>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0052A3] transition"
                            >
                                <Search className="w-4 h-4 inline" />
                            </button>
                        </div>
                    </form>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#0066CC]">
                        <div className="text-sm text-gray-600">
                            Total Members
                        </div>
                        <div className="text-3xl font-bold text-gray-900">
                            {members.total}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#B4E4CE]">
                        <div className="text-sm text-gray-600">Verified</div>
                        <div className="text-3xl font-bold text-green-600">
                            {members.data.filter((m) => m.is_verified).length}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-400">
                        <div className="text-sm text-gray-600">Unverified</div>
                        <div className="text-3xl font-bold text-yellow-600">
                            {members.data.filter((m) => !m.is_verified).length}
                        </div>
                    </div>
                </div>

                {/* Members Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Member
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Balance
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Paylater
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Trust Score
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Verified
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {members.data.map((member) => {
                                    const scoreBadge = getTrustScoreBadge(
                                        member.paylater?.trust_score || 0
                                    );
                                    return (
                                        <tr
                                            key={member.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#0066CC] to-[#0052A3] flex items-center justify-center text-white font-bold">
                                                        {member.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {member.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            ID: {member.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {member.email}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {member.phone_number}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#0066CC]">
                                                {formatCurrency(member.balance)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {member.paylater ? (
                                                    <>
                                                        <div className="text-sm text-gray-900">
                                                            Limit:{" "}
                                                            {formatCurrency(
                                                                member.paylater
                                                                    .total_limit
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Used:{" "}
                                                            {formatCurrency(
                                                                member.paylater
                                                                    .used_limit
                                                            )}
                                                        </div>
                                                    </>
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {member.paylater ? (
                                                    <div>
                                                        <div className="text-sm font-bold text-gray-900">
                                                            {
                                                                member.paylater
                                                                    .trust_score
                                                            }
                                                        </div>
                                                        <span
                                                            className={`text-xs px-2 py-0.5 rounded ${scoreBadge.bg} ${scoreBadge.text}`}
                                                        >
                                                            {scoreBadge.label}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {member.is_verified ? (
                                                    <span className="px-2 py-1 text-xs font-semibold rounded bg-[#B4E4CE] text-[#0066CC]">
                                                        <CheckCircle className="w-3 h-3 inline" />{" "}
                                                        Verified
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-600">
                                                        <XCircle className="w-3 h-3 inline" />{" "}
                                                        Not Verified
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <a
                                                    href={route(
                                                        "admin.members.show",
                                                        member.id
                                                    )}
                                                    className="text-[#0066CC] hover:text-[#0052A3] inline-flex items-center gap-1"
                                                >
                                                    <Eye className="w-4 h-4" />{" "}
                                                    View
                                                </a>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {members.links && (
                        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-between">
                            <div className="text-sm text-gray-700">
                                Showing {members.from} to {members.to} of{" "}
                                {members.total} results
                            </div>
                            <div className="flex gap-2">
                                {members.links.map((link, idx) => (
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
