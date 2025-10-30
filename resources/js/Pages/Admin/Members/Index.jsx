import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, Link } from "@inertiajs/react";
import { useState } from "react";
import {
    Search,
    Eye,
    CheckCircle,
    XCircle,
    Filter,
    X as ResetIcon,
} from "lucide-react";

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

    const handleFilterSubmit = () => {
        router.get(
            route("admin.members.index"),
            { search, verified },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            handleFilterSubmit();
        }
    };

    const resetFilters = () => {
        setSearch("");
        setVerified("all");
        router.get(
            route("admin.members.index"),
            {},
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const getTrustScoreBadge = (score) => {
        if (score >= 120)
            return {
                bg: "bg-green-100",
                text: "text-green-800",
                label: "Luar Biasa",
            };
        if (score >= 100)
            return {
                bg: "bg-blue-100", // Konsisten
                text: "text-blue-800", // Konsisten
                label: "Baik",
            };
        if (score >= 80)
            return {
                bg: "bg-yellow-100",
                text: "text-yellow-800",
                label: "Cukup",
            };
        return { bg: "bg-red-100", text: "text-red-800", label: "Buruk" };
    };

    return (
        <AuthenticatedLayout header="Manajemen Anggota">
            <Head title="Anggota" />

            <div className="space-y-6">
                {/* Search & Filter */}
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cari Anggota
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
                                    placeholder="Cari berdasarkan nama atau email..."
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-[#0066CC]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status Verifikasi
                            </label>
                            <select
                                value={verified}
                                onChange={(e) => setVerified(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-[#0066CC]"
                            >
                                <option value="all">Semua Anggota</option>
                                <option value="true">Terverifikasi</option>
                                <option value="false">Belum Verifikasi</option>
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

                {/* Members Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Anggota
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kontak
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Saldo
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Paylater
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Skor Kepercayaan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {members.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-12 text-center text-gray-500"
                                        >
                                            Tidak ada anggota yang cocok dengan
                                            filter.
                                        </td>
                                    </tr>
                                )}
                                {members.data.map((member) => {
                                    const scoreBadge = getTrustScoreBadge(
                                        member.paylater?.trust_score || 0
                                    );
                                    return (
                                        <tr
                                            key={member.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#0066CC] to-[#0052A3] flex items-center justify-center text-white font-bold flex-shrink-0">
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
                                                    {member.phone}
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
                                                            Terpakai:{" "}
                                                            {formatCurrency(
                                                                member.paylater
                                                                    .used_limit
                                                            )}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-gray-500">
                                                        -
                                                    </span>
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
                                                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${scoreBadge.bg} ${scoreBadge.text}`}
                                                        >
                                                            {scoreBadge.label}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-500">
                                                        -
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {member.is_verified ? (
                                                    <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Terverifikasi
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-700">
                                                        <XCircle className="w-3 h-3 mr-1" />
                                                        Belum Verifikasi
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <Link
                                                    href={route(
                                                        "admin.members.show",
                                                        member.id
                                                    )}
                                                    className="text-[#0066CC] hover:text-[#0052A3] inline-flex items-center gap-1 font-medium"
                                                >
                                                    <Eye className="w-4 h-4" />{" "}
                                                    Lihat
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {members.links && members.links.length > 3 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-3">
                            <div className="text-sm text-gray-700 mb-2 md:mb-0">
                                Menampilkan {members.from} sampai {members.to}{" "}
                                dari {members.total} hasil
                            </div>
                            <div className="inline-flex rounded-md shadow-sm -space-x-px">
                                {members.links.map((link, idx) => (
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
                                                idx === members.links.length - 1
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
