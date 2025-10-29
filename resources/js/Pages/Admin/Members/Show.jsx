import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, Link } from "@inertiajs/react";
import { ArrowLeft, CheckCircle, XCircle, TrendingUp } from "lucide-react";

export default function Show({ member }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (date) => {
        return date ? new Date(date).toLocaleDateString("id-ID") : "-";
    };

    const handleVerification = (verified) => {
        if (confirm(`${verified ? "Verify" : "Unverify"} this member?`)) {
            router.patch(
                route("admin.members.update-verification", member.id),
                { is_verified: verified }
            );
        }
    };

    return (
        <AuthenticatedLayout header={`Member: ${member.name}`}>
            <Head title={member.name} />

            <div className="max-w-6xl space-y-6">
                <Link
                    href={route("admin.members.index")}
                    className="inline-flex items-center gap-2 text-[#0066CC] hover:text-[#0052A3]"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Members
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Member Profile */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex flex-col items-center">
                            <div className="h-24 w-24 rounded-full bg-gradient-to-r from-[#0066CC] to-[#0052A3] flex items-center justify-center text-white text-3xl font-bold mb-4">
                                {member.name.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {member.name}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {member.email}
                            </p>
                            <p className="text-sm text-gray-500">
                                {member.phone_number}
                            </p>

                            <div className="mt-4">
                                {member.is_verified ? (
                                    <span className="px-4 py-2 text-sm font-semibold rounded-full bg-[#B4E4CE] text-[#0066CC]">
                                        <CheckCircle className="w-4 h-4 inline" />{" "}
                                        Verified
                                    </span>
                                ) : (
                                    <span className="px-4 py-2 text-sm font-semibold rounded-full bg-gray-100 text-gray-600">
                                        <XCircle className="w-4 h-4 inline" />{" "}
                                        Not Verified
                                    </span>
                                )}
                            </div>

                            <div className="mt-6 w-full">
                                <button
                                    onClick={() =>
                                        handleVerification(!member.is_verified)
                                    }
                                    className="w-full px-4 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0052A3] transition"
                                >
                                    {member.is_verified
                                        ? "Unverify Member"
                                        : "Verify Member"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Account Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Balance & Paylater */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="text-sm text-gray-600 mb-2">
                                    Balance
                                </div>
                                <div className="text-2xl font-bold text-[#0066CC]">
                                    {formatCurrency(member.balance)}
                                </div>
                            </div>
                            {member.paylater && (
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <div className="text-sm text-gray-600 mb-2">
                                        Trust Score
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-2xl font-bold text-gray-900">
                                            {member.paylater.trust_score}
                                        </div>
                                        <TrendingUp
                                            className={`w-5 h-5 ${
                                                member.paylater.trust_score >=
                                                100
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Paylater Details */}
                        {member.paylater && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    Paylater Account
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-gray-600">
                                            Total Limit:
                                        </span>
                                        <div className="font-bold text-[#0066CC]">
                                            {formatCurrency(
                                                member.paylater.total_limit
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">
                                            Used Limit:
                                        </span>
                                        <div className="font-bold text-red-600">
                                            {formatCurrency(
                                                member.paylater.used_limit
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">
                                            Available Limit:
                                        </span>
                                        <div className="font-bold text-green-600">
                                            {formatCurrency(
                                                member.paylater.available_limit
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">
                                            Status:
                                        </span>
                                        <div className="font-bold">
                                            {member.paylater.status}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Recent Transactions */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                Recent Transactions
                            </h3>
                            {member.transactions &&
                            member.transactions.length > 0 ? (
                                <div className="space-y-3">
                                    {member.transactions
                                        .slice(0, 5)
                                        .map((t) => (
                                            <div
                                                key={t.id}
                                                className="flex justify-between items-center border-b pb-2"
                                            >
                                                <div>
                                                    <div className="font-medium">
                                                        {t.unit_name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {formatDate(
                                                            t.start_time
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold text-[#0066CC]">
                                                        {formatCurrency(
                                                            t.total_price
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {t.status}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">
                                    No transactions yet
                                </p>
                            )}
                        </div>

                        {/* Paylater Invoices */}
                        {member.paylater_invoices &&
                            member.paylater_invoices.length > 0 && (
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h3 className="text-lg font-semibold mb-4">
                                        Paylater Invoices
                                    </h3>
                                    <div className="space-y-3">
                                        {member.paylater_invoices.map(
                                            (invoice) => (
                                                <div
                                                    key={invoice.invoice_number}
                                                    className="flex justify-between items-center border-b pb-2"
                                                >
                                                    <div>
                                                        <div className="font-medium">
                                                            {
                                                                invoice.invoice_number
                                                            }
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Due:{" "}
                                                            {formatDate(
                                                                invoice.due_date
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-semibold">
                                                            {formatCurrency(
                                                                invoice.total_amount
                                                            )}
                                                        </div>
                                                        <span
                                                            className={`text-xs px-2 py-0.5 rounded ${
                                                                invoice.status ===
                                                                "paid"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-red-100 text-red-800"
                                                            }`}
                                                        >
                                                            {invoice.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
