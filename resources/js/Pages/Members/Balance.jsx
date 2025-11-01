import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { router } from "@inertiajs/react";

export default function Balance() {
    const [saldo, setSaldo] = useState(250000);
    const [selectedNominal, setSelectedNominal] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleNominalSelect = (nominal) => setSelectedNominal(nominal);
    const handleMethodSelect = (method) => setSelectedMethod(method);

    const handleConfirmPayment = () => {
        setSaldo(saldo + selectedNominal);
        setSelectedNominal(null);
        setSelectedMethod(null);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2500);
    };

    const qrValue = `TOPUP|USER123|${selectedNominal}|${selectedMethod}|Rentalin`;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white relative overflow-hidden">
            <img
                src="https://res.cloudinary.com/dr2cuy2gx/image/upload/v1761821347/Rentalin_Wordmark_zmblbi.png"
                alt="Rentalin Logo"
                className="h-10 mb-10 drop-shadow-lg"
            />

            <motion.div
                className="bg-white/10 p-8 rounded-2xl shadow-lg border border-[#00D8C8]/30 max-w-md w-11/12 text-center backdrop-blur-lg relative z-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {!selectedNominal && (
                    <>
                        <p className="text-gray-300 mb-2 text-sm">
                            Saldo kamu saat ini:
                        </p>
                        <h2 className="text-5xl font-bold text-[#00D8C8] mb-8 drop-shadow-[0_0_10px_#00D8C8]">
                            Rp {saldo.toLocaleString("id-ID")}
                        </h2>
                        <p className="text-gray-400 mb-3">
                            Pilih nominal Top Up:
                        </p>
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {[10000, 25000, 50000, 100000, 200000, 500000].map(
                                (nom) => (
                                    <button
                                        key={nom}
                                        onClick={() => handleNominalSelect(nom)}
                                        className="bg-gray-900/70 border border-[#00D8C8]/40 hover:bg-[#00D8C8]/20 rounded-lg py-3 font-semibold text-[#00D8C8] transition-all"
                                    >
                                        Rp {nom.toLocaleString("id-ID")}
                                    </button>
                                )
                            )}
                        </div>
                    </>
                )}

                {selectedNominal && !selectedMethod && (
                    <motion.div
                        key="paymentMethods"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h3 className="text-xl font-semibold text-[#00D8C8] mb-4">
                            Pilih Metode Pembayaran
                        </h3>
                        <p className="text-gray-400 mb-6">
                            Nominal top up:{" "}
                            <span className="text-[#00D8C8] font-semibold">
                                Rp {selectedNominal.toLocaleString("id-ID")}
                            </span>
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { name: "QRIS", color: "#00D8C8" },
                                { name: "Bank Transfer", color: "#0088ff" },
                                { name: "DANA", color: "#00aaff" },
                                { name: "OVO", color: "#8b5cf6" },
                                { name: "GoPay", color: "#00c9a7" },
                                { name: "ShopeePay", color: "#ff5722" },
                            ].map((m) => (
                                <button
                                    key={m.name}
                                    onClick={() => handleMethodSelect(m.name)}
                                    className="py-3 rounded-lg font-semibold border border-[#00D8C8]/40 bg-gray-900/70 hover:bg-[#00D8C8]/20 transition-all"
                                >
                                    <span style={{ color: m.color }}>
                                        {m.name}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setSelectedNominal(null)}
                            className="mt-6 text-sm text-gray-400 hover:text-[#00D8C8] underline"
                        >
                            ← Back
                        </button>
                    </motion.div>
                )}

                {selectedNominal && selectedMethod && (
                    <motion.div
                        key="paymentConfirm"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h3 className="text-xl font-semibold text-[#00D8C8] mb-4">
                            {selectedMethod === "QRIS"
                                ? "Scan QRIS to Pay"
                                : `Payment via ${selectedMethod}`}
                        </h3>

                        <h2 className="text-3xl font-bold text-[#00D8C8] mb-6">
                            Rp {selectedNominal.toLocaleString("id-ID")}
                        </h2>

                        {selectedMethod === "QRIS" ? (
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
                        ) : (
                            <div className="bg-gray-900/60 border border-gray-700 p-4 rounded-lg text-left mb-6">
                                <p className="text-gray-300 text-sm mb-1">
                                    Virtual Account:
                                </p>
                                <p className="font-semibold text-[#00D8C8] text-lg mb-3">
                                    880123456789
                                </p>
                                <p className="text-gray-400 text-sm">
                                    Transfer the exact amount. Balance will
                                    update automatically after verification.
                                </p>
                            </div>
                        )}

                        <button
                            onClick={handleConfirmPayment}
                            className="bg-[#00D8C8] text-black font-bold py-2 px-6 rounded-lg hover:bg-[#00b4a0] transition-all"
                        >
                            Confirm Payment
                        </button>

                        <button
                            onClick={() => setSelectedMethod(null)}
                            className="mt-4 text-sm text-gray-400 hover:text-[#00D8C8] underline block mx-auto"
                        >
                            ← Change Method
                        </button>
                    </motion.div>
                )}

                {success && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-5 text-green-400 font-semibold"
                    >
                        Top-up successful and added to balance
                    </motion.p>
                )}
            </motion.div>

            <button
                onClick={() => router.visit("/member/dashboard")}
                className="flex items-center gap-2 mt-8 text-[#00D8C8] hover:text-[#00b4a0] transition-all font-semibold"
            >
                <ArrowLeft size={20} /> Back to Dashboard
            </button>
        </div>
    );
}
