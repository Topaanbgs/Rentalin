import { router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, CreditCard, Package } from "lucide-react";
import { formatCurrency } from "@/Utils/formatCurrency";
import { translateStatus } from "@/Utils/statusTranslator";

export default function OrderDetailModal({ show, transaction, onClose }) {
    if (!show || !transaction) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="bg-[#10141f] border border-[#00D8C8]/40 rounded-2xl p-6 shadow-2xl max-w-2xl w-full"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-2xl font-bold text-[#00D8C8]">
                                Detail Pesanan
                            </h3>
                            <p className="text-gray-400 text-sm mt-1">
                                {transaction.booking_code}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Package className="text-[#00D8C8]" size={20} />
                                <h4 className="font-semibold text-white">
                                    Informasi Unit
                                </h4>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-gray-400">Unit</p>
                                    <p className="text-white font-semibold">
                                        {transaction.unit_name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Durasi</p>
                                    <p className="text-white font-semibold">
                                        {transaction.duration} menit
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <CreditCard
                                    className="text-[#00D8C8]"
                                    size={20}
                                />
                                <h4 className="font-semibold text-white">
                                    Pembayaran
                                </h4>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-gray-400">
                                        Metode Pembayaran
                                    </p>
                                    <p className="text-white font-semibold uppercase">
                                        {transaction.payment_method}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Total Bayar</p>
                                    <p className="text-[#00D8C8] font-bold text-lg">
                                        Rp{" "}
                                        {formatCurrency(
                                            transaction.total_price
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Calendar
                                    className="text-[#00D8C8]"
                                    size={20}
                                />
                                <h4 className="font-semibold text-white">
                                    Waktu
                                </h4>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-gray-400">
                                        Tanggal Booking
                                    </p>
                                    <p className="text-white font-semibold">
                                        {new Date(
                                            transaction.created_at
                                        ).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Waktu Mulai</p>
                                    <p className="text-white font-semibold">
                                        {new Date(
                                            transaction.start_time
                                        ).toLocaleTimeString("id-ID", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Clock className="text-[#00D8C8]" size={20} />
                                <h4 className="font-semibold text-white">
                                    Status
                                </h4>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">
                                    Status Pesanan
                                </span>
                                <span
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                                        transaction.status === "completed"
                                            ? "bg-green-500/20 text-green-400"
                                            : transaction.status === "cancelled"
                                            ? "bg-red-500/20 text-red-400"
                                            : transaction.status ===
                                              "checked_in"
                                            ? "bg-blue-500/20 text-blue-400"
                                            : "bg-yellow-500/20 text-yellow-400"
                                    }`}
                                >
                                    {translateStatus(transaction.status)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                        {transaction.status === "grace_period_active" && (
                            <button
                                onClick={() => {
                                    router.post(
                                        route(
                                            "member.order.cancel",
                                            transaction.id
                                        )
                                    );
                                    onClose();
                                }}
                                className="flex-1 py-2 bg-red-500/20 border border-red-500/40 text-red-400 rounded-lg hover:bg-red-500/30 transition font-semibold"
                            >
                                Batalkan Pesanan
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="flex-1 py-2 bg-[#00D8C8] text-black rounded-lg hover:opacity-80 transition font-semibold"
                        >
                            Tutup
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
