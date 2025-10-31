import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, Link } from "@inertiajs/react";
import { ArrowLeft, CheckCircle, Clock, XCircle } from "lucide-react";

const InfoItem = ({ label, value, children, className = "" }) => (
    <div className={`py-3 sm:py-4 px-4 ${className}`}>
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 font-semibold">
            {value || children || "-"}
        </dd>
    </div>
);

export default function Show({ transaction }) {
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
            checked_in: { bg: "bg-cyan-100", text: "text-cyan-800" },
            in_progress: { bg: "bg-green-100", text: "text-green-800" },
            completed: { bg: "bg-gray-200", text: "text-gray-800" },
            cancelled: { bg: "bg-red-100", text: "text-red-800" },
            cancelled_no_show: { bg: "bg-red-200", text: "text-red-900" },
        };
        const badge = badges[status] || badges.pending_payment;
        return (
            <span
                className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${badge.bg} ${badge.text}`}
            >
                {translateStatus(status)}
            </span>
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

    const handleCheckIn = () => {
        if (confirm("Konfirmasi check-in anggota?")) {
            router.post(route("admin.transactions.check-in", transaction.id), {
                preserveScroll: true,
            });
        }
    };

    const handleComplete = () => {
        if (confirm("Tandai transaksi ini sebagai selesai?")) {
            router.post(route("admin.transactions.complete", transaction.id), {
                preserveScroll: true,
            });
        }
    };

    const handleValidatePayment = () => {
        if (confirm("Validasi pembayaran ini secara manual?")) {
            router.post(
                route("admin.transactions.validate-payment", transaction.id),
                {
                    preserveScroll: true,
                }
            );
        }
    };

    const canCheckIn =
        transaction.status === "grace_period_active" ||
        transaction.status === "confirmed";

    const canComplete =
        transaction.status === "checked_in" ||
        transaction.status === "in_progress";

    const canValidatePayment =
        transaction.payment?.payment_status === "waiting" ||
        transaction.status === "pending_payment";

    return (
        <AuthenticatedLayout header={`Detail Transaksi #${transaction.id}`}>
            <Head title={`Transaksi #${transaction.id}`} />

            <div className="max-w-7xl mx-auto space-y-6">
                <Link
                    href={route("admin.transactions.index")}
                    className="inline-flex items-center gap-2 text-[#0066CC] hover:text-[#0052A3] font-medium"
                >
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Transaksi
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <dl>
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-900">
                                        Ringkasan Transaksi
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
                                        <InfoItem
                                            label="ID Transaksi"
                                            value={`#${transaction.id}`}
                                        />
                                        <InfoItem
                                            label="Metode Pembayaran"
                                            value={translatePaymentMethod(
                                                transaction.payment_method
                                            )}
                                        />
                                        <InfoItem label="Kode QR (untuk Check-In)">
                                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                                {transaction.qr_code}
                                            </span>
                                        </InfoItem>

                                        <InfoItem
                                            label="Total Harga"
                                            className="sm:col-span-2"
                                        >
                                            <span className="font-bold text-2xl text-[#0066CC]">
                                                {formatCurrency(
                                                    transaction.total_price
                                                )}
                                            </span>
                                        </InfoItem>

                                        <InfoItem
                                            label="Durasi"
                                            value={`${transaction.duration} menit`}
                                        />
                                        <InfoItem
                                            label="Waktu Check-In"
                                            value={formatDateTime(
                                                transaction.checked_in_at
                                            )}
                                        />
                                        <InfoItem
                                            label="Waktu Mulai"
                                            value={formatDateTime(
                                                transaction.start_time
                                            )}
                                        />
                                        <InfoItem
                                            label="Waktu Selesai"
                                            value={formatDateTime(
                                                transaction.completed_at
                                            )}
                                        />
                                    </div>
                                </div>
                            </dl>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <dl>
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold mb-4 text-gray-900">
                                            Informasi Anggota
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                                            <InfoItem
                                                label="Nama"
                                                value={transaction.member.name}
                                            />
                                            <InfoItem
                                                label="Saldo Saat Ini"
                                                value={formatCurrency(
                                                    transaction.member.balance
                                                )}
                                            />
                                            <InfoItem
                                                label="Email"
                                                value={transaction.member.email}
                                            />
                                            <InfoItem
                                                label="Telepon"
                                                value={transaction.member.phone}
                                            />
                                        </div>
                                    </div>
                                </dl>
                            </div>

                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <dl>
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold mb-4 text-gray-900">
                                            Informasi Unit
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                                            <InfoItem
                                                label="Nama Unit"
                                                value={transaction.unit.name}
                                            />
                                            <InfoItem
                                                label="Tipe"
                                                value={transaction.unit.type}
                                            />
                                            <InfoItem
                                                label="Tarif Per Jam"
                                                value={formatCurrency(
                                                    transaction.unit.hourly_rate
                                                )}
                                                className="sm:col-span-2"
                                            />
                                        </div>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>

                    <div className="lg:sticky lg:top-24 h-fit lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-900">
                                Status Transaksi
                            </h3>

                            <div className="mb-6">
                                {getStatusBadge(transaction.status)}
                            </div>

                            <div className="flex flex-col gap-3">
                                {canValidatePayment && (
                                    <button
                                        onClick={handleValidatePayment}
                                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0066CC] to-[#0052A3] text-white rounded-lg hover:opacity-90 transition shadow font-semibold"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Validasi Pembayaran
                                    </button>
                                )}

                                {canCheckIn && (
                                    <button
                                        onClick={handleCheckIn}
                                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0066CC] to-[#0052A3] text-white rounded-lg hover:opacity-90 transition shadow font-semibold"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Check-In Anggota
                                    </button>
                                )}

                                {canComplete && (
                                    <button
                                        onClick={handleComplete}
                                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow font-semibold"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Selesaikan Sesi
                                    </button>
                                )}

                                {!canCheckIn &&
                                    !canComplete &&
                                    !canValidatePayment && (
                                        <p className="text-sm text-gray-500 text-center">
                                            Tidak ada aksi yang tersedia untuk
                                            status ini.
                                        </p>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
