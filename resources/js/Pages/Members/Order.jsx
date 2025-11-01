import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Order() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
        const defaultOrders = [
            {
                id: "T001",
                tanggal: "2025-10-29",
                unit: "PS5 #7",
                status: "Selesai",
                jam: "15:00 - 17:00",
            },
            {
                id: "T002",
                tanggal: "2025-10-30",
                unit: "PS4 #3",
                status: "Berlangsung",
                jam: "12:00 - 14:00",
            },
        ];
        setOrders([...defaultOrders, ...savedOrders]);
    }, []);

    return (
        <div className="min-h-screen px-6 py-10 text-white">
            <h1 className="text-3xl font-bold text-[#00D8C8] mb-6 text-center">
                Riwayat Pesanan
            </h1>

            <motion.table
                className="w-full text-left border-collapse bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <thead className="bg-[#00D8C8]/10 text-[#00D8C8]">
                    <tr>
                        <th className="py-3 px-4">ID Transaksi</th>
                        <th className="py-3 px-4">Tanggal</th>
                        <th className="py-3 px-4">Unit</th>
                        <th className="py-3 px-4">Jam Main</th>
                        <th className="py-3 px-4">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((o, i) => (
                        <motion.tr
                            key={`${o.id}-${i}`}
                            className="border-b border-gray-800 hover:bg-[#00D8C8]/5 transition-all"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 }}
                        >
                            <td className="py-3 px-4">{o.id}</td>
                            <td className="py-3 px-4">{o.tanggal}</td>
                            <td className="py-3 px-4">{o.unit}</td>
                            <td className="py-3 px-4">{o.jam || "-"}</td>
                            <td
                                className={`py-3 px-4 font-semibold ${
                                    o.status === "Selesai"
                                        ? "text-green-400"
                                        : "text-yellow-400"
                                }`}
                            >
                                {o.status}
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </motion.table>

            {orders.length === 0 && (
                <p className="text-gray-500 text-center mt-6">
                    Belum ada riwayat pesanan.
                </p>
            )}
        </div>
    );
}
