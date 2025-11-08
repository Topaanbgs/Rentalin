import { usePage, router, Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";
import MemberLayout from "@/Layouts/MemberLayout";
import { formatCurrency } from "@/Utils/formatCurrency";

export default function Balance({ balance }) {
    const { auth } = usePage().props;
    const currentBalance = balance || auth.user?.balance || 0;
    const [selectedNominal, setSelectedNominal] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const qrValue = `TOPUP|${auth.user?.id}|${selectedNominal}|QRIS|Rentalin`;

    const handleConfirmPayment = () => {
        if (isProcessing) return;

        setIsProcessing(true);

        router.post(
            route("member.saldo.topup"),
            {
                amount: selectedNominal,
                payment_method: "qris",
            },
            {
                onFinish: () => setIsProcessing(false),
            }
        );
    };

    return (
        <>
            <Head title="Top Up Saldo" />
            <MemberLayout>
                <button
                    onClick={() => router.visit(route("member.dashboard"))}
                    className="flex items-center gap-2 mt-8 text-[#00D8C8] hover:text-[#00b4a0] transition-all font-semibold"
                >
                    <ArrowLeft size={20} /> Kembali ke Dashboard
                </button>
                <div className="min-h-screen flex flex-col items-center justify-center text-white px-4">
                    <h1 className="text-3xl font-black text-[#00D8C8] mb-10">
                        RENTALIN
                    </h1>

                    <motion.div
                        className="bg-white/10 p-8 rounded-2xl shadow-lg border border-[#00D8C8]/30 max-w-md w-full text-center backdrop-blur-lg"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {!selectedNominal && (
                            <>
                                <p className="text-gray-300 mb-2 text-sm">
                                    Saldo kamu saat ini:
                                </p>
                                <h2 className="text-5xl font-bold text-[#00D8C8] mb-8 drop-shadow-[0_0_10px_#00D8C8]">
                                    Rp {formatCurrency(currentBalance)}
                                </h2>
                                <p className="text-gray-400 mb-3">
                                    Pilih nominal Top Up:
                                </p>
                                <div className="grid grid-cols-3 gap-3 mb-6">
                                    {[
                                        10000, 25000, 50000, 100000, 200000,
                                        500000,
                                    ].map((nom) => (
                                        <button
                                            key={nom}
                                            onClick={() =>
                                                setSelectedNominal(nom)
                                            }
                                            className="bg-gray-900/70 border border-[#00D8C8]/40 hover:bg-[#00D8C8]/20 rounded-lg py-3 font-semibold text-[#00D8C8] transition-all"
                                        >
                                            {nom >= 1000000
                                                ? `${nom / 1000000}jt`
                                                : `${nom / 1000}k`}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}

                        {selectedNominal && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <h3 className="text-xl font-semibold text-[#00D8C8] mb-4">
                                    Scan QRIS untuk Membayar
                                </h3>

                                <h2 className="text-3xl font-bold text-[#00D8C8] mb-6">
                                    Rp {formatCurrency(selectedNominal)}
                                </h2>

                                <div className="flex justify-center mb-6">
                                    <QRCodeCanvas
                                        value={qrValue}
                                        size={180}
                                        bgColor="#ffffff"
                                        fgColor="#00D8C8"
                                        level="H"
                                        includeMargin
                                    />
                                </div>

                                <p className="text-gray-400 text-sm mb-6">
                                    Scan kode QR dengan aplikasi pembayaran Anda
                                </p>

                                <button
                                    onClick={handleConfirmPayment}
                                    disabled={isProcessing}
                                    className={`w-full text-black font-bold py-2 px-6 rounded-lg transition-all flex items-center justify-center gap-2 ${
                                        isProcessing
                                            ? "bg-gray-500 cursor-not-allowed"
                                            : "bg-[#00D8C8] hover:bg-[#00b4a0]"
                                    }`}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2
                                                className="animate-spin"
                                                size={20}
                                            />
                                            Memproses...
                                        </>
                                    ) : (
                                        "Konfirmasi Pembayaran"
                                    )}
                                </button>

                                <button
                                    onClick={() => setSelectedNominal(null)}
                                    disabled={isProcessing}
                                    className="mt-4 text-sm text-gray-400 hover:text-[#00D8C8] underline block mx-auto"
                                >
                                    ← Kembali
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </MemberLayout>
        </>
    );
}
