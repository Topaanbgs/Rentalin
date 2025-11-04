import { usePage, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import MemberLayout from "@/Layouts/MemberLayout";
import { formatCurrency } from "@/utils/formatCurrency";

export default function Payment({ transaction, user }) {
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const methodMapping = {
        QRIS: "qris",
        Paylater: "paylater",
        Saldo: "balance",
    };

    const qrValue = `PAYMENT|${transaction?.id}|${transaction?.total_price}|${selectedMethod}|Rentalin`;

    const handleConfirmPayment = () => {
        if (isProcessing) return;

        const paymentMethod =
            methodMapping[selectedMethod] || selectedMethod.toLowerCase();

        setIsProcessing(true);

        router.post(
            route("member.payment.process"),
            {
                transaction_id: transaction?.id,
                payment_method: paymentMethod,
            },
            {
                onFinish: () => setIsProcessing(false),
            }
        );
    };

    const paylaterAvailable =
        (user?.paylater_account?.total_limit || 0) -
        (user?.paylater_account?.used_limit || 0);
    const canPayWithBalance =
        (user?.balance || 0) >= (transaction?.total_price || 0);
    const canPayWithPaylater =
        paylaterAvailable >= (transaction?.total_price || 0);

    return (
        <MemberLayout>
            <div className="min-h-screen flex flex-col items-center justify-center text-white overflow-hidden px-4">
                <h1 className="text-3xl font-black text-[#00D8C8] mb-10">
                    RENTALIN
                </h1>

                <motion.div
                    className="bg-white/10 p-8 rounded-2xl shadow-lg border border-[#00D8C8]/30 max-w-5xl w-full backdrop-blur-lg grid md:grid-cols-2 gap-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div>
                        <h3 className="text-2xl font-bold text-[#00D8C8] mb-6">
                            Pilih Metode Pembayaran
                        </h3>

                        {!selectedMethod && !isProcessing && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <button
                                        onClick={() =>
                                            setSelectedMethod("QRIS")
                                        }
                                        className="py-3 rounded-lg font-semibold border border-[#00D8C8]/40 bg-gray-900/70 hover:bg-[#00D8C8]/20 transition-all text-[#00D8C8]"
                                    >
                                        QRIS
                                    </button>
                                    <button
                                        onClick={() =>
                                            setSelectedMethod("Paylater")
                                        }
                                        disabled={!canPayWithPaylater}
                                        className={`py-3 rounded-lg font-semibold border transition-all ${
                                            canPayWithPaylater
                                                ? "border-[#00D8C8]/40 bg-gray-900/70 hover:bg-[#00D8C8]/20 text-[#00D8C8]"
                                                : "border-gray-600 bg-gray-800/50 text-gray-500 cursor-not-allowed"
                                        }`}
                                    >
                                        Paylater
                                        {!canPayWithPaylater && (
                                            <span className="block text-xs mt-1">
                                                Limit tidak cukup
                                            </span>
                                        )}
                                    </button>
                                    <button
                                        onClick={() =>
                                            setSelectedMethod("Saldo")
                                        }
                                        disabled={!canPayWithBalance}
                                        className={`py-3 rounded-lg font-semibold border transition-all ${
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
                            </motion.div>
                        )}

                        {selectedMethod && !isProcessing && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <h4 className="text-xl font-semibold mb-4 text-[#00D8C8]">
                                    {selectedMethod === "QRIS"
                                        ? "Scan QRIS untuk Membayar"
                                        : `Pembayaran via ${selectedMethod}`}
                                </h4>

                                {selectedMethod === "QRIS" ? (
                                    <div className="flex flex-col items-center my-6">
                                        <QRCodeCanvas
                                            value={qrValue}
                                            size={180}
                                            bgColor="#ffffff"
                                            fgColor="#00D8C8"
                                            level="H"
                                            includeMargin
                                        />
                                        <p className="text-gray-400 text-sm mt-4 text-center">
                                            Scan QR code dengan aplikasi
                                            pembayaran Anda
                                        </p>
                                    </div>
                                ) : selectedMethod === "Saldo" ? (
                                    <div className="bg-gray-900/60 border border-gray-700 p-4 rounded-lg mb-6">
                                        <p className="text-gray-300 text-sm mb-1">
                                            Saldo Anda:
                                        </p>
                                        <p className="font-semibold text-[#00D8C8] text-lg mb-3">
                                            Rp {formatCurrency(user?.balance)}
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            Saldo akan dikurangi otomatis
                                            setelah konfirmasi.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-gray-900/60 border border-gray-700 p-4 rounded-lg mb-6">
                                        <p className="text-gray-300 text-sm mb-1">
                                            Limit Tersedia:
                                        </p>
                                        <p className="font-semibold text-[#00D8C8] text-lg mb-3">
                                            Rp{" "}
                                            {formatCurrency(paylaterAvailable)}
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            Pembayaran akan menggunakan limit
                                            paylater Anda.
                                        </p>
                                    </div>
                                )}

                                <button
                                    onClick={handleConfirmPayment}
                                    className="bg-[#00D8C8] text-black font-bold py-2 px-6 rounded-lg hover:bg-[#00b4a0] transition-all w-full"
                                >
                                    Konfirmasi Pembayaran
                                </button>

                                <button
                                    onClick={() => setSelectedMethod(null)}
                                    className="mt-4 text-sm text-gray-400 hover:text-[#00D8C8] underline block mx-auto"
                                >
                                    ← Ganti Metode
                                </button>
                            </motion.div>
                        )}

                        {isProcessing && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-12"
                            >
                                <Loader2
                                    className="animate-spin text-[#00D8C8] mb-4"
                                    size={48}
                                />
                                <p className="text-[#00D8C8] font-semibold text-lg">
                                    Memproses Pembayaran...
                                </p>
                                <p className="text-gray-400 text-sm mt-2">
                                    Mohon tunggu sebentar
                                </p>
                            </motion.div>
                        )}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-900/60 border border-[#00D8C8]/30 rounded-xl p-6 shadow-inner"
                    >
                        <h3 className="text-2xl font-bold text-[#00D8C8] mb-6">
                            Detail Pesanan
                        </h3>
                        <div className="space-y-4 text-gray-300 text-sm">
                            <div className="flex justify-between">
                                <span>ID Transaksi:</span>
                                <span className="font-semibold text-[#00D8C8]">
                                    #{transaction?.id}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Kode Booking:</span>
                                <span className="font-semibold text-[#00D8C8]">
                                    {transaction?.booking_code}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Unit:</span>
                                <span>{transaction?.rental_unit?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Durasi:</span>
                                <span>{transaction?.duration} menit</span>
                            </div>
                            <div className="border-t border-gray-700 my-4" />
                            <div className="flex justify-between text-lg font-bold text-[#00D8C8]">
                                <span>Total Bayar:</span>
                                <span>
                                    Rp{" "}
                                    {formatCurrency(transaction?.total_price)}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </MemberLayout>
    );
}
