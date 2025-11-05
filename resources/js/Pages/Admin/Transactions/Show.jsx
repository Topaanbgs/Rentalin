import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, Link } from "@inertiajs/react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { StatusBadge } from "@/Utils/statusTranslator";

const InfoItem = ({ label, value, children }) => (
    <div className="py-3 sm:py-4 px-4">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 font-semibold">
            {value || children || "-"}
        </dd>
    </div>
);

export default function Show({ transaction }) {
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

    const handleAction = (routeName, message) =>
        confirm(message) &&
        router.post(route(routeName, transaction.id), { preserveScroll: true });

    const canCheckIn = transaction.status === "grace_period_active";
    const canComplete = transaction.status === "checked_in";
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
                        <div className="bg-white rounded-lg shadow overflow-hidden p-6">
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
                                <InfoItem label="Kode Booking">
                                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                        {transaction.booking_code || "-"}
                                    </span>
                                </InfoItem>

                                <InfoItem label="Total Harga">
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
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 mt-4 border-t pt-4">
                                <InfoItem
                                    label="Waktu Pemesanan"
                                    value={formatDateTime(
                                        transaction.start_time
                                    )}
                                />
                                <InfoItem
                                    label="Waktu Mulai"
                                    value={formatDateTime(
                                        transaction.checked_in_at
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                                    Informasi Anggota
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                                    <InfoItem
                                        label="Nama"
                                        value={transaction.member.name}
                                    />
                                    <InfoItem
                                        label="Saldo"
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

                            <div className="bg-white rounded-lg shadow p-6">
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
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:sticky lg:top-24 h-fit lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-900">
                                Status Transaksi
                            </h3>
                            <div className="mb-6">
                                <StatusBadge status={transaction.status} />
                            </div>

                            <div className="flex flex-col gap-3">
                                {canValidatePayment && (
                                    <button
                                        onClick={() =>
                                            handleAction(
                                                "admin.transactions.validate-payment",
                                                "Validasi pembayaran ini?"
                                            )
                                        }
                                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0066CC] to-[#0052A3] text-white rounded-lg hover:opacity-90 shadow font-semibold"
                                    >
                                        <CheckCircle className="w-4 h-4" />{" "}
                                        Validasi Pembayaran
                                    </button>
                                )}
                                {canCheckIn && (
                                    <button
                                        onClick={() =>
                                            handleAction(
                                                "admin.transactions.check-in",
                                                "Konfirmasi check-in anggota?"
                                            )
                                        }
                                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0066CC] to-[#0052A3] text-white rounded-lg hover:opacity-90 shadow font-semibold"
                                    >
                                        <CheckCircle className="w-4 h-4" />{" "}
                                        Check-In
                                    </button>
                                )}
                                {canComplete && (
                                    <button
                                        onClick={() =>
                                            handleAction(
                                                "admin.transactions.complete",
                                                "Tandai transaksi ini sebagai selesai?"
                                            )
                                        }
                                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow font-semibold"
                                    >
                                        <CheckCircle className="w-4 h-4" />{" "}
                                        Selesaikan Sesi
                                    </button>
                                )}
                                {!canCheckIn &&
                                    !canComplete &&
                                    !canValidatePayment && (
                                        <p className="text-sm text-gray-500 text-center">
                                            Tidak ada aksi yang tersedia.
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
