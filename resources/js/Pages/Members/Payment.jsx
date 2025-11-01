import React, { useState } from "react";
import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { router } from "@inertiajs/react";

export default function Payment() {
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [success, setSuccess] = useState(false);

    const order = {
        id: "ORD-20251031",
        item: "Sewa PS5",
        price: 50000,
        date: "31 Oktober 2025, 15:00 - 17:00",
    };

    const qrValue = `PAYMENT|${order.id}|${order.price}|${selectedMethod}|Rentalin`;

    const handleConfirmPayment = () => {
        const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
        const newOrder = {
            id: order.id,
            tanggal: new Date().toISOString().split("T")[0],
            unit: order.item,
            status: "Berlangsung",
        };
        localStorage.setItem(
            "orders",
            JSON.stringify([...existingOrders, newOrder])
        );
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            router.visit("/member/orders");
        }, 1500);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white overflow-hidden">
            <img
                src="https://res.cloudinary.com/dr2cuy2gx/image/upload/v1761821347/Rentalin_Wordmark_zmblbi.png"
                alt="Rentalin Logo"
                className="h-10 mb-10 drop-shadow-lg"
            />

            <motion.div
                className="bg-white/10 p-8 rounded-2xl shadow-lg border border-[#00D8C8]/30 max-w-5xl w-11/12 backdrop-blur-lg grid md:grid-cols-2 gap-8 relative z-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div>
                    <h3 className="text-2xl font-bold text-[#00D8C8] mb-6 text-center md:text-left">
                        Pilih Metode Pembayaran
                    </h3>

                    {!selectedMethod && (
                        <motion.div
                            key="methodList"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {[
                                    { name: "QRIS", color: "#00D8C8" },
                                    { name: "Paylater", color: "#f472b6" },
                                    { name: "Saldo", color: "#38bdf8" },
                                    { name: "Transfer Bank", color: "#8b5cf6" },
                                ].map((m) => (
                                    <button
                                        key={m.name}
                                        onClick={() =>
                                            setSelectedMethod(m.name)
                                        }
                                        className="py-3 rounded-lg font-semibold border border-[#00D8C8]/40 bg-gray-900/70 hover:bg-[#00D8C8]/20 transition-all"
                                        style={{ color: m.color }}
                                    >
                                        {m.name}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {selectedMethod && (
                        <motion.div
                            key="paymentAction"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h4 className="text-xl font-semibold mb-4 text-[#00D8C8] text-center md:text-left">
                                {selectedMethod === "QRIS"
                                    ? "Scan QRIS untuk Membayar"
                                    : `Pembayaran via ${selectedMethod}`}
                            </h4>

                            {selectedMethod === "QRIS" ? (
                                <div className="flex justify-center my-6">
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
                                        Nomor Virtual Account:
                                    </p>
                                    <p className="font-semibold text-[#00D8C8] text-lg mb-3">
                                        880123456789
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        Lakukan pembayaran sesuai total, sistem
                                        akan otomatis memverifikasi setelah
                                        berhasil.
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
                </div>

                <motion.div
                    key="orderDetails"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-900/60 border border-[#00D8C8]/30 rounded-xl p-6 shadow-inner"
                >
                    <h3 className="text-2xl font-bold text-[#00D8C8] mb-6 text-center md:text-left">
                        Detail Pesanan
                    </h3>
                    <div className="space-y-4 text-gray-300 text-sm">
                        <div className="flex justify-between">
                            <span>ID Pesanan:</span>
                            <span className="font-semibold text-[#00D8C8]">
                                {order.id}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Item:</span>
                            <span>{order.item}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Waktu Main:</span>
                            <span>{order.date}</span>
                        </div>
                        <div className="border-t border-gray-700 my-4" />
                        <div className="flex justify-between text-lg font-bold text-[#00D8C8]">
                            <span>Total Bayar:</span>
                            <span>
                                Rp {order.price.toLocaleString("id-ID")}
                            </span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {success && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 text-green-400 font-semibold"
                >
                    Pembayaran berhasil. Pesanan kamu telah dikonfirmasi.
                </motion.p>
            )}
        </div>
    );
}
