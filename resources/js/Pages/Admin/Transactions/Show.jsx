import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, Link } from "@inertiajs/react";
import { ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react";

export default function Show({ transaction }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDateTime = (date) => {
        return date ? new Date(date).toLocaleString("id-ID") : "-";
    };

    const handleCheckIn = () => {
        if (confirm("Confirm member check-in?")) {
            router.post(route("admin.transactions.check-in", transaction.id));
        }
    };

    const handleComplete = () => {
        if (confirm("Mark this transaction as completed?")) {
            router.post(route("admin.transactions.complete", transaction.id));
        }
    };

    const handleValidatePayment = () => {
        if (confirm("Validate this payment manually?")) {
            router.post(
                route("admin.transactions.validate-payment", transaction.id)
            );
        }
    };

    return (
        <AuthenticatedLayout header={`Transaction #${transaction.id}`}>
            <Head title={`Transaction #${transaction.id}`} />

            <div className="max-w-4xl space-y-6">
                <Link
                    href={route("admin.transactions.index")}
                    className="inline-flex items-center gap-2 text-[#0066CC] hover:text-[#0052A3]"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Transactions
                </Link>

                {/* Transaction Info */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        Transaction Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-gray-600">
                                Transaction ID:
                            </span>{" "}
                            <span className="font-semibold">
                                #{transaction.id}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-600">QR Code:</span>{" "}
                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                {transaction.qr_code}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-600">Status:</span>{" "}
                            <span className="font-semibold">
                                {transaction.status.replace(/_/g, " ")}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-600">
                                Payment Method:
                            </span>{" "}
                            <span className="font-semibold">
                                {transaction.payment_method}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-600">Start Time:</span>{" "}
                            <span>
                                {formatDateTime(transaction.start_time)}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-600">Duration:</span>{" "}
                            <span>{transaction.duration} minutes</span>
                        </div>
                        <div>
                            <span className="text-gray-600">Total Price:</span>{" "}
                            <span className="font-bold text-[#0066CC]">
                                {formatCurrency(transaction.total_price)}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-600">Checked In:</span>{" "}
                            <span>
                                {formatDateTime(transaction.checked_in_at)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Member Info */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        Member Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-gray-600">Name:</span>{" "}
                            <span className="font-semibold">
                                {transaction.member.name}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-600">Email:</span>{" "}
                            <span>{transaction.member.email}</span>
                        </div>
                        <div>
                            <span className="text-gray-600">Phone:</span>{" "}
                            <span>{transaction.member.phone}</span>
                        </div>
                        <div>
                            <span className="text-gray-600">Balance:</span>{" "}
                            <span className="font-semibold">
                                {formatCurrency(transaction.member.balance)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Unit Info */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        Unit Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-gray-600">Unit Name:</span>{" "}
                            <span className="font-semibold">
                                {transaction.unit.name}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-600">Type:</span>{" "}
                            <span>{transaction.unit.type}</span>
                        </div>
                        <div>
                            <span className="text-gray-600">Hourly Rate:</span>{" "}
                            <span className="font-semibold">
                                {formatCurrency(transaction.unit.hourly_rate)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Actions</h3>
                    <div className="flex gap-3">
                        {(transaction.status === "grace_period_active" ||
                            transaction.status === "confirmed") && (
                            <button
                                onClick={handleCheckIn}
                                className="px-4 py-2 bg-[#B4E4CE] text-[#0066CC] rounded-lg hover:opacity-80 font-semibold"
                            >
                                <CheckCircle className="w-4 h-4 inline mr-2" />{" "}
                                Check-In Member
                            </button>
                        )}
                        {transaction.status === "checked_in" && (
                            <button
                                onClick={handleComplete}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                            >
                                <CheckCircle className="w-4 h-4 inline mr-2" />{" "}
                                Complete Transaction
                            </button>
                        )}
                        {transaction.payment &&
                            transaction.payment.payment_status ===
                                "waiting" && (
                                <button
                                    onClick={handleValidatePayment}
                                    className="px-4 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0052A3] font-semibold"
                                >
                                    <CheckCircle className="w-4 h-4 inline mr-2" />{" "}
                                    Validate Payment
                                </button>
                            )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
