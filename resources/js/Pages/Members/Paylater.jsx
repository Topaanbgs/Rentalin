import { router, Head } from "@inertiajs/react";
import { Info, ArrowLeft, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";
import MemberLayout from "@/Layouts/MemberLayout";
import { formatCurrency } from "@/utils/formatCurrency";

export default function Paylater({ paylater_account, invoices, user }) {
    const [showPopup, setShowPopup] = useState(false);
    const [paymentModal, setPaymentModal] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const totalLimit = paylater_account?.total_limit || 0;
    const usedLimit = paylater_account?.used_limit || 0;
    const availableLimit = totalLimit - usedLimit;
    const trustScore = paylater_account?.trust_score || 0;
    const isEligible = trustScore >= 85;

    const handlePayInvoice = (invoice) => {
        setPaymentModal(invoice);
        setSelectedMethod(null);
        setIsProcessing(false);
    };

    const confirmPayment = () => {
        if (isProcessing) return;

        setIsProcessing(true);

        router.post(
            route("member.paylater.pay", paymentModal.id),
            { payment_method: selectedMethod },
            {
                onFinish: () => {
                    setIsProcessing(false);
                    setPaymentModal(null);
                    setSelectedMethod(null);
                },
            }
        );
    };

    const canPayWithBalance =
        (user?.balance || 0) >= (paymentModal?.total_amount || 0);

    return (
        <>
            <Head title="Paylater" />
            <MemberLayout>
                <div className="min-h-screen text-white px-6 py-10">
                    <button
                        onClick={() => router.visit(route("member.dashboard"))}
                        className="flex items-center gap-2 mb-6 text-[#00D8C8] hover:text-[#00b4a0] transition-all font-semibold"
                    >
                        <ArrowLeft size={20} /> Kembali ke Dashboard
                    </button>

                    <div className="flex items-center justify-between mb-10">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-fuchsia-500 bg-clip-text text-transparent">
                            Paylater Member
                        </h1>

                        <div
                            onClick={() => setShowPopup(true)}
                            className="flex items-center gap-2 bg-gray-900/50 border border-cyan-500/40 rounded-xl px-4 py-2 cursor-pointer hover:bg-cyan-500/10 transition-all shadow-inner"
                        >
                            <Info size={20} className="text-cyan-400" />
                            <div className="text-right">
                                <p className="text-xs text-gray-400 leading-tight">
                                    Trust Score
                                </p>
                                <p
                                    className={`text-lg font-bold ${
                                        isEligible
                                            ? "text-green-400"
                                            : "text-red-400"
                                    }`}
                                >
                                    {trustScore}%
                                </p>
                            </div>
                        </div>
                    </div>

                    {!isEligible && (
                        <div className="bg-red-900/20 border border-red-500/40 rounded-xl p-4 mb-6">
                            <p className="text-red-400 text-sm">
                                <strong>Perhatian:</strong> Trust Score Anda di
                                bawah 85%. Fitur Paylater tidak dapat digunakan
                                hingga skor meningkat.
                            </p>
                        </div>
                    )}

                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-gray-900/60 border border-cyan-500/40 rounded-2xl p-6 text-center shadow-lg">
                            <p className="text-sm text-gray-400">Total Limit</p>
                            <h3 className="text-2xl font-bold text-cyan-300 mt-1">
                                Rp {formatCurrency(totalLimit)}
                            </h3>
                        </div>

                        <div className="bg-gray-900/60 border border-fuchsia-500/40 rounded-2xl p-6 text-center shadow-lg">
                            <p className="text-sm text-gray-400">
                                Limit Terpakai
                            </p>
                            <h3 className="text-2xl font-bold text-fuchsia-300 mt-1">
                                Rp {formatCurrency(usedLimit)}
                            </h3>
                        </div>

                        <div className="bg-gray-900/60 border border-green-400/40 rounded-2xl p-6 text-center shadow-lg">
                            <p className="text-sm text-gray-400">Sisa Limit</p>
                            <h3 className="text-2xl font-bold text-green-300 mt-1">
                                Rp {formatCurrency(availableLimit)}
                            </h3>
                        </div>
                    </div>

                    <div className="bg-gray-900/60 border border-[#00D8C8]/20 rounded-2xl p-6 shadow-lg">
                        <h2 className="text-xl font-semibold text-cyan-300 mb-4">
                            Riwayat Penggunaan Paylater
                        </h2>

                        {invoices && invoices.length > 0 ? (
                            <div className="space-y-4">
                                {invoices.map((invoice) => (
                                    <div
                                        key={invoice.id}
                                        className="bg-[#111827]/60 border border-[#00D8C8]/20 rounded-xl p-4 hover:border-fuchsia-500/30 transition"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <p className="text-gray-300 font-semibold">
                                                    {invoice.invoice_number}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Jatuh Tempo:{" "}
                                                    {new Date(
                                                        invoice.due_date
                                                    ).toLocaleDateString(
                                                        "id-ID"
                                                    )}
                                                </p>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                                                    invoice.status === "paid"
                                                        ? "bg-green-500/20 text-green-400"
                                                        : invoice.status ===
                                                          "overdue"
                                                        ? "bg-red-500/20 text-red-400"
                                                        : "bg-yellow-500/20 text-yellow-400"
                                                }`}
                                            >
                                                {invoice.status === "paid"
                                                    ? "Lunas"
                                                    : invoice.status ===
                                                      "overdue"
                                                    ? "Terlambat"
                                                    : "Belum Lunas"}
                                            </span>
                                        </div>

                                        {invoice.transactions &&
                                            invoice.transactions.length > 0 && (
                                                <div className="space-y-2 mb-3 pl-4 border-l-2 border-gray-700">
                                                    {invoice.transactions.map(
                                                        (trans, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="text-sm"
                                                            >
                                                                <p className="text-gray-400">
                                                                    {
                                                                        trans.unit_name
                                                                    }{" "}
                                                                    - Rp{" "}
                                                                    {formatCurrency(
                                                                        trans.amount
                                                                    )}
                                                                </p>
                                                                <p className="text-gray-600 text-xs">
                                                                    {new Date(
                                                                        trans.date
                                                                    ).toLocaleDateString(
                                                                        "id-ID"
                                                                    )}
                                                                </p>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}

                                        <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Total Tagihan
                                                </p>
                                                <p className="text-lg font-bold text-fuchsia-400">
                                                    Rp{" "}
                                                    {formatCurrency(
                                                        invoice.total_amount
                                                    )}
                                                </p>
                                            </div>
                                            {invoice.status !== "paid" && (
                                                <button
                                                    onClick={() =>
                                                        handlePayInvoice(
                                                            invoice
                                                        )
                                                    }
                                                    className="px-4 py-2 bg-[#00D8C8] text-black font-semibold rounded-lg hover:opacity-80 transition"
                                                >
                                                    Bayar Sekarang
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500">
                                    Belum ada riwayat penggunaan Paylater.
                                </p>
                                <p className="text-gray-600 text-sm mt-2">
                                    Gunakan Paylater untuk transaksi pertama
                                    Anda.
                                </p>
                            </div>
                        )}
                    </div>

                    <AnimatePresence>
                        {showPopup && (
                            <motion.div
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowPopup(false)}
                            >
                                <motion.div
                                    className="bg-[#10141f] border border-cyan-500/40 rounded-2xl p-8 shadow-2xl max-w-md w-[90%] text-center"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <h3 className="text-2xl font-bold text-cyan-400 mb-4">
                                        Tentang Trust Score
                                    </h3>
                                    <p className="text-gray-300 mb-6 leading-relaxed">
                                        Trust Score adalah penilaian kelayakan
                                        penggunaan Paylater kamu. Jika nilai di
                                        bawah{" "}
                                        <span className="text-red-400 font-semibold">
                                            85%
                                        </span>
                                        , kamu tidak dapat menggunakan fitur
                                        Paylater hingga skor kamu meningkat
                                        melalui riwayat pembayaran yang baik.
                                    </p>
                                    <button
                                        onClick={() => setShowPopup(false)}
                                        className="bg-cyan-500 text-black font-semibold px-6 py-2 rounded-lg hover:bg-cyan-400 transition-all"
                                    >
                                        Mengerti
                                    </button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {paymentModal && (
                            <motion.div
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.div
                                    className="bg-[#10141f] border border-[#00D8C8]/40 rounded-2xl p-6 shadow-2xl max-w-md w-full"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                >
                                    <h3 className="text-2xl font-bold text-[#00D8C8] mb-4">
                                        Bayar Tagihan
                                    </h3>
                                    <p className="text-gray-400 mb-2 text-sm">
                                        {paymentModal.invoice_number}
                                    </p>
                                    <p className="text-white font-bold text-2xl mb-6">
                                        Rp{" "}
                                        {formatCurrency(
                                            paymentModal.total_amount
                                        )}
                                    </p>

                                    {!selectedMethod && !isProcessing && (
                                        <div className="space-y-3 mb-6">
                                            <button
                                                onClick={() =>
                                                    setSelectedMethod("qris")
                                                }
                                                className="w-full py-3 rounded-lg font-semibold border border-[#00D8C8]/40 bg-gray-900/70 hover:bg-[#00D8C8]/20 transition-all text-[#00D8C8]"
                                            >
                                                QRIS
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setSelectedMethod("balance")
                                                }
                                                disabled={!canPayWithBalance}
                                                className={`w-full py-3 rounded-lg font-semibold border transition-all ${
                                                    canPayWithBalance
                                                        ? "border-[#00D8C8]/40 bg-gray-900/70 hover:bg-[#00D8C8]/20 text-[#00D8C8]"
                                                        : "border-gray-600 bg-gray-800/50 text-gray-500 cursor-not-allowed"
                                                }`}
                                            >
                                                Saldo
                                                {!canPayWithBalance && (
                                                    <span className="block text-xs mt-1">
                                                        Saldo tidak cukup
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    )}

                                    {selectedMethod && !isProcessing && (
                                        <div className="mb-6">
                                            {selectedMethod === "qris" ? (
                                                <div className="flex flex-col items-center">
                                                    <QRCodeCanvas
                                                        value={`PAYLATER|${paymentModal.id}|${paymentModal.total_amount}|QRIS`}
                                                        size={180}
                                                        bgColor="#ffffff"
                                                        fgColor="#00D8C8"
                                                        level="H"
                                                        includeMargin
                                                    />
                                                    <p className="text-gray-400 text-sm mt-3">
                                                        Scan untuk membayar
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="bg-gray-900/60 border border-gray-700 p-4 rounded-lg">
                                                    <p className="text-gray-300 text-sm mb-1">
                                                        Saldo Anda:
                                                    </p>
                                                    <p className="font-semibold text-[#00D8C8] text-lg">
                                                        Rp{" "}
                                                        {formatCurrency(
                                                            user?.balance
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {isProcessing && (
                                        <div className="flex flex-col items-center py-8">
                                            <Loader2
                                                className="animate-spin text-[#00D8C8] mb-3"
                                                size={40}
                                            />
                                            <p className="text-[#00D8C8] font-semibold">
                                                Memproses Pembayaran...
                                            </p>
                                        </div>
                                    )}
                                    {!isProcessing && (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => {
                                                    setPaymentModal(null);
                                                    setSelectedMethod(null);
                                                }}
                                                className="flex-1 py-2 bg-gray-700 rounded-lg text-gray-300 hover:bg-gray-600 transition font-semibold"
                                            >
                                                {selectedMethod
                                                    ? "← Kembali"
                                                    : "Batal"}
                                            </button>
                                            {selectedMethod && (
                                                <button
                                                    onClick={confirmPayment}
                                                    className="flex-1 py-2 bg-[#00D8C8] text-black rounded-lg hover:opacity-80 transition font-semibold"
                                                >
                                                    Konfirmasi
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </MemberLayout>
        </>
    );
}
