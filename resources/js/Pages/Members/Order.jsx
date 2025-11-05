import { usePage, router, Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { useState } from "react";
import MemberLayout from "@/Layouts/MemberLayout";
import { StatusBadge } from "@/utils/statusTranslator";
import { formatCurrency } from "@/utils/formatCurrency";
import OrderDetailModal from "@/Components/OrderDetailModal";

export default function Order({ transactions }) {
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleViewDetail = (transaction) => {
        setSelectedTransaction(transaction);
        setShowModal(true);
    };

    return (
        <>
            <Head title="Riwayat Pesanan" />
            <MemberLayout>
                <div className="min-h-screen px-6 py-10 text-white">
                    <h1 className="text-3xl font-bold text-[#00D8C8] mb-6 text-center">
                        Riwayat Pesanan
                    </h1>

                    <motion.div
                        className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#00D8C8]/10 text-[#00D8C8]">
                                    <tr>
                                        <th className="py-3 px-4">Kode</th>
                                        <th className="py-3 px-4">Tanggal</th>
                                        <th className="py-3 px-4">Unit</th>
                                        <th className="py-3 px-4">Durasi</th>
                                        <th className="py-3 px-4">Total</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions?.data?.map((t, i) => (
                                        <motion.tr
                                            key={t.id}
                                            className="border-b border-gray-800 hover:bg-[#00D8C8]/5 transition-all"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.06 }}
                                        >
                                            <td className="py-3 px-4 font-mono text-sm">
                                                {t.booking_code}
                                            </td>
                                            <td className="py-3 px-4">
                                                {new Date(
                                                    t.created_at
                                                ).toLocaleDateString("id-ID")}
                                            </td>
                                            <td className="py-3 px-4">
                                                {t.unit_name}
                                            </td>
                                            <td className="py-3 px-4">
                                                {t.duration} menit
                                            </td>
                                            <td className="py-3 px-4 font-semibold">
                                                Rp{" "}
                                                {formatCurrency(t.total_price)}
                                            </td>
                                            <td className="py-3 px-4">
                                                <StatusBadge
                                                    status={t.status}
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                <button
                                                    onClick={() =>
                                                        handleViewDetail(t)
                                                    }
                                                    className="flex items-center gap-1 text-[#00D8C8] hover:text-[#00b4a0] transition"
                                                >
                                                    <Eye size={16} />
                                                    Detail
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {(!transactions?.data ||
                            transactions.data.length === 0) && (
                            <p className="text-gray-500 text-center py-8">
                                Belum ada riwayat pesanan.
                            </p>
                        )}

                        {transactions?.links &&
                            transactions.data?.length > 0 && (
                                <div className="flex justify-center gap-2 p-4 border-t border-gray-800">
                                    {transactions.links.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                link.url &&
                                                router.visit(link.url)
                                            }
                                            disabled={!link.url}
                                            className={`px-3 py-1 rounded transition ${
                                                link.active
                                                    ? "bg-[#00D8C8] text-black font-semibold"
                                                    : link.url
                                                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                                    : "bg-gray-800/50 text-gray-600 cursor-not-allowed"
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                    </motion.div>
                </div>

                <OrderDetailModal
                    show={showModal}
                    transaction={selectedTransaction}
                    onClose={() => setShowModal(false)}
                />
            </MemberLayout>
        </>
    );
}
