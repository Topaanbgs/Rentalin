import React from "react";
import { Wallet, PlusCircle, ArrowLeftRight } from "lucide-react";
import { router } from "@inertiajs/react";

export default function Saldo() {
    const saldoSekarang = 250000;
    const riwayat = [
        {
            id: 1,
            tanggal: "2025-10-20",
            deskripsi: "Top Up DANA",
            nominal: 100000,
            tipe: "masuk",
        },
        {
            id: 2,
            tanggal: "2025-10-22",
            deskripsi: "Sewa PS5 Digital",
            nominal: 50000,
            tipe: "keluar",
        },
        {
            id: 3,
            tanggal: "2025-10-28",
            deskripsi: "Top Up GoPay",
            nominal: 200000,
            tipe: "masuk",
        },
        {
            id: 4,
            tanggal: "2025-10-29",
            deskripsi: "Sewa PS4 Pro",
            nominal: 75000,
            tipe: "keluar",
        },
    ];

    return (
        <div className="min-h-screen text-white px-6 py-10">
            <div className="bg-gray-900/60 border border-cyan-400/30 rounded-2xl p-6 text-center shadow-lg mb-10">
                <Wallet className="mx-auto text-cyan-400 mb-3" size={40} />
                <p className="text-gray-400">Current Balance</p>
                <h2 className="text-4xl font-bold text-cyan-300 mt-2">
                    Rp {saldoSekarang.toLocaleString("id-ID")}
                </h2>
                <button
                    onClick={() => router.visit("/member/balance")}
                    className="mt-6 inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/40 px-5 py-2 rounded-xl font-semibold text-cyan-300 hover:bg-cyan-500/30 transition-all"
                >
                    <PlusCircle size={18} /> Top Up
                </button>
            </div>

            <div className="p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center gap-2">
                    <ArrowLeftRight size={20} /> Balance History
                </h2>

                <div className="space-y-3">
                    {riwayat.map((r) => (
                        <div
                            key={r.id}
                            className="flex justify-between items-center bg-[#111827]/60 border border-[#00D8C8]/20 rounded-xl px-4 py-3 hover:border-fuchsia-500/30 transition"
                        >
                            <div>
                                <p className="text-gray-300 font-medium">
                                    {r.deskripsi}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {r.tanggal}
                                </p>
                            </div>
                            <p
                                className={`font-semibold ${
                                    r.tipe === "masuk"
                                        ? "text-green-400"
                                        : "text-fuchsia-400"
                                }`}
                            >
                                {r.tipe === "masuk" ? "+" : "-"} Rp{" "}
                                {r.nominal.toLocaleString("id-ID")}
                            </p>
                        </div>
                    ))}
                </div>

                {riwayat.length === 0 && (
                    <p className="text-gray-500 text-center mt-6">
                        No transaction history yet.
                    </p>
                )}
            </div>
        </div>
    );
}
