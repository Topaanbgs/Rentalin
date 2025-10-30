import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    TrendingUp,
    ShieldCheck,
    ShieldOff,
} from "lucide-react";

export default function Show({ member }) {
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
            paid: "Dibayar",
            unpaid: "Belum Dibayar",
            overdue: "Jatuh Tempo",
        };
        return map[status] || status.replace(/_/g, " ");
    };

    const handleVerification = (verified) => {
        const actionText = verified ? "Verifikasi" : "Batalkan verifikasi";
        if (confirm(`Apakah Anda yakin ingin ${actionText} anggota ini?`)) {
            router.patch(
                route("admin.members.update-verification", member.id),
                { is_verified: verified },
                { preserveScroll: true }
            );
        }
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
                bg: "bg-blue-100",
                text: "text-blue-800",
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

    const InfoItem = ({ label, value, children, className = "" }) => (
        <div className={className}>
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="mt-1 text-sm text-gray-900 font-semibold">
                {value || children || "-"}
            </dd>
        </div>
    );

    const scoreBadge = getTrustScoreBadge(member.paylater?.trust_score || 0);

    return (
        <AuthenticatedLayout header={`Anggota: ${member.name}`}>
            <Head title={member.name} />

            <div className="max-w-7xl mx-auto space-y-6">
                <Link
                    href={route("admin.members.index")}
                    className="inline-flex items-center gap-2 text-[#0066CC] hover:text-[#0052A3] font-medium"
                >
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Anggota
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Kolom Profil & Aksi (Sticky) */}
                    <div className="lg:col-span-1 lg:sticky lg:top-24 h-fit space-y-6">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex flex-col items-center">
                                <div className="h-24 w-24 rounded-full bg-gradient-to-r from-[#0066CC] to-[#0052A3] flex items-center justify-center text-white text-3xl font-bold mb-4 flex-shrink-0">
                                    {member.name.charAt(0).toUpperCase()}
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 text-center">
                                    {member.name}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {member.email}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {member.phone}
                                </p>

                                <div className="mt-4">
                                    {member.is_verified ? (
                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            <ShieldCheck className="w-4 h-4 mr-1" />
                                            Terverifikasi
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-700">
                                            <ShieldOff className="w-4 h-4 mr-1" />
                                            Belum Verifikasi
                                        </span>
                                    )}
                                </div>

                                <div className="mt-6 w-full border-t pt-6">
                                    {member.is_verified ? (
                                        <button
                                            onClick={() =>
                                                handleVerification(false)
                                            }
                                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow font-semibold"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Batalkan Verifikasi
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                handleVerification(true)
                                            }
                                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0066CC] to-[#0052A3] text-white rounded-lg hover:opacity-90 transition shadow font-semibold"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Verifikasi Anggota
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kolom Informasi */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Detail Finansial */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                                    Informasi Finansial
                                </h3>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                    <InfoItem label="Saldo">
                                        <span className="text-2xl font-bold text-[#0066CC]">
                                            {formatCurrency(member.balance)}
                                        </span>
                                    </InfoItem>

                                    {member.paylater && (
                                        <>
                                            <InfoItem label="Skor Kepercayaan">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl font-bold text-gray-900">
                                                        {
                                                            member.paylater
                                                                .trust_score
                                                        }
                                                    </span>
                                                    <span
                                                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${scoreBadge.bg} ${scoreBadge.text}`}
                                                    >
                                                        {scoreBadge.label}
                                                    </span>
                                                </div>
                                            </InfoItem>
                                            <InfoItem label="Limit Paylater">
                                                <span className="text-lg font-bold text-gray-800">
                                                    {formatCurrency(
                                                        member.paylater
                                                            .total_limit
                                                    )}
                                                </span>
                                            </InfoItem>
                                            <InfoItem label="Limit Tersedia">
                                                <span className="text-lg font-bold text-green-600">
                                                    {formatCurrency(
                                                        member.paylater
                                                            .available_limit
                                                    )}
                                                </span>
                                            </InfoItem>
                                            <InfoItem label="Limit Terpakai">
                                                <span className="text-lg font-bold text-red-600">
                                                    {formatCurrency(
                                                        member.paylater
                                                            .used_limit
                                                    )}
                                                </span>
                                            </InfoItem>
                                            <InfoItem label="Status Paylater">
                                                <span className="text-sm font-bold text-gray-800 capitalize">
                                                    {translateStatus(
                                                        member.paylater.status
                                                    )}
                                                </span>
                                            </InfoItem>
                                        </>
                                    )}
                                </dl>
                            </div>
                        </div>

                        {/* Transaksi Terakhir */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Transaksi Terakhir
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
                                                Unit
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tanggal
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {member.transactions &&
                                        member.transactions.length > 0 ? (
                                            member.transactions
                                                .slice(0, 5)
                                                .map((t) => (
                                                    <tr
                                                        key={t.id}
                                                        className="hover:bg-gray-50"
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
                                                            {t.unit_name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                            {formatDateTime(
                                                                t.start_time
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                            {formatCurrency(
                                                                t.total_price
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                                                            {translateStatus(
                                                                t.status
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="px-6 py-10 text-center text-gray-500"
                                                >
                                                    Belum ada transaksi.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Tagihan Paylater */}
                        {member.paylater_invoices &&
                            member.paylater_invoices.length > 0 && (
                                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                    <div className="p-6 border-b border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Tagihan Paylater
                                        </h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        No. Tagihan
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Jatuh Tempo
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Jumlah
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {member.paylater_invoices.map(
                                                    (invoice) => (
                                                        <tr
                                                            key={
                                                                invoice.invoice_number
                                                            }
                                                            className="hover:bg-gray-50"
                                                        >
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                {
                                                                    invoice.invoice_number
                                                                }
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                                {formatDateTime(
                                                                    invoice.due_date
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                                {formatCurrency(
                                                                    invoice.total_amount
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span
                                                                    className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                        invoice.status ===
                                                                        "paid"
                                                                            ? "bg-green-100 text-green-800"
                                                                            : "bg-red-100 text-red-800"
                                                                    }`}
                                                                >
                                                                    {translateStatus(
                                                                        invoice.status
                                                                    )}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
