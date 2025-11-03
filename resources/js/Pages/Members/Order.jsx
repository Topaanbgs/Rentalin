import { usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import MemberLayout from "@/Layouts/MemberLayout";
import { StatusBadge, translateStatus } from "@/utils/statusTranslator";

export default function Order({ transactions }) {
    return (
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
                                    <th className="py-3 px-4">ID</th>
                                    <th className="py-3 px-4">Tanggal</th>
                                    <th className="py-3 px-4">Unit</th>
                                    <th className="py-3 px-4">Durasi</th>
                                    <th className="py-3 px-4">Total</th>
                                    <th className="py-3 px-4">Status</th>
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
                                        <td className="py-3 px-4">#{t.id}</td>
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
                                            {t.total_price?.toLocaleString(
                                                "id-ID"
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            <StatusBadge status={t.status} />
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
                </motion.div>
            </div>
        </MemberLayout>
    );
}
