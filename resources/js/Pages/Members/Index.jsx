import React, { useState } from "react";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";
import { useNavigate } from "@inertiajs/react";
import { useAuth } from "../../utils/AuthContext";

export default function MemberDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [units] = useState(
        Array.from({ length: 15 }, (_, i) => {
            const statuses = ["available", "booked", "in_use", "maintenance"];
            return { id: i + 1, status: statuses[i % statuses.length] };
        })
    );

    const [selectedUnit, setSelectedUnit] = useState(null);
    const [duration, setDuration] = useState(1);
    const [showModal, setShowModal] = useState(false);

    const saldo = 125000;
    const sisaPaylater = 2000000;

    const statusStyles = {
        available: {
            bg: "bg-green-900/20",
            text: "text-green-400",
            label: "Tersedia",
            border: "#00ff99",
        },
        booked: {
            bg: "bg-yellow-900/20",
            text: "text-yellow-400",
            label: "Dipesan",
            border: "#ffcc00",
        },
        in_use: {
            bg: "bg-blue-900/20",
            text: "text-blue-400",
            label: "Dipakai",
            border: "#00ccff",
        },
        maintenance: {
            bg: "bg-red-900/30",
            text: "text-red-400",
            label: "Perawatan",
            border: "#ff4444",
        },
    };

    const handleSelectUnit = (unit) => {
        if (unit.status !== "available")
            return alert("Unit ini tidak tersedia untuk disewa saat ini.");
        setSelectedUnit(unit);
        setShowModal(true);
    };

    return (
        <div className="min-h-screen">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-8 py-6 gap-4">
                <div
                    onClick={() => navigate("/member/saldo")}
                    className="flex items-center gap-2 bg-gray-900/50 border border-[#00D8C8]/30 rounded-xl px-4 py-2 shadow-inner cursor-pointer hover:bg-[#00D8C8]/10 transition-all"
                >
                    <Wallet className="text-[#00D8C8]" size={22} />
                    <span className="text-lg font-semibold text-[#00D8C8]">
                        Rp {saldo.toLocaleString("id-ID")}
                    </span>
                </div>

                <div
                    onClick={() => navigate("/member/paylater")}
                    className="flex items-center gap-2 bg-gray-900/50 border border-fuchsia-500/40 rounded-xl px-4 py-2 shadow-inner cursor-pointer hover:bg-fuchsia-500/10 transition-all"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-fuchsia-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zM12 14c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4z"
                        />
                    </svg>
                    <div className="flex flex-col text-left">
                        <span className="text-xs text-gray-400 leading-tight">
                            Sisa Paylater
                        </span>
                        <span className="text-sm font-semibold text-fuchsia-400">
                            Rp {sisaPaylater.toLocaleString("id-ID")}
                        </span>
                    </div>
                </div>
            </div>

            <div className="px-8 pb-16">
                <h2 className="text-2xl font-semibold mb-6 text-center text-[#00D8C8]/90">
                    Daftar PS
                </h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-center">
                    {units.map((ps) => {
                        const style = statusStyles[ps.status];
                        return (
                            <motion.div
                                key={ps.id}
                                onClick={() => handleSelectUnit(ps)}
                                className={`relative p-6 rounded-2xl text-center cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#00D8C8]/30 backdrop-blur-sm overflow-hidden card-border ${style.bg}`}
                                style={{ "--border-color": style.border }}
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-[#00D8C8]/10 via-transparent to-transparent rounded-2xl pointer-events-none" />
                                <h2 className="text-xl font-semibold mb-2">
                                    PS Unit #{ps.id}
                                </h2>
                                <p className={`${style.text} font-medium`}>
                                    {style.label}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-[#10141f] p-8 rounded-2xl border border-[#00D8C8]/40 shadow-2xl w-[90%] sm:w-[400px] text-center">
                        <h3 className="text-2xl font-semibold text-[#00D8C8] mb-4">
                            Pesan PS Unit #{selectedUnit.id}
                        </h3>
                        <p className="text-gray-400 mb-4">
                            Pemesan:{" "}
                            <span className="text-white">{user?.name}</span>
                        </p>

                        <div className="mb-6">
                            <label className="block text-gray-400 mb-2">
                                Durasi (jam)
                            </label>
                            <select
                                value={duration}
                                onChange={(e) =>
                                    setDuration(Number(e.target.value))
                                }
                                className="bg-gray-900 text-white border border-[#00D8C8]/40 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#00D8C8]"
                            >
                                {[1, 2, 3, 4, 5].map((h) => (
                                    <option key={h} value={h}>
                                        {h} Jam
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-700 rounded-lg text-gray-300 hover:bg-gray-600 transition"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => navigate("/member/payment")}
                                className="px-4 py-2 bg-[#00D8C8] text-black font-semibold rounded-lg hover:opacity-80 transition"
                            >
                                Pesan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        .card-border {
          position: relative;
          border: 2px solid transparent;
          border-radius: 1rem;
          background-clip: padding-box;
          z-index: 0;
        }
        .card-border::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(120deg, transparent 0%, var(--border-color) 25%, transparent 50%, var(--border-color) 75%, transparent 100%);
          background-size: 300% 300%;
          animation: rockstarBorder 5s linear infinite;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          z-index: -1;
        }
        @keyframes rockstarBorder {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
        </div>
    );
}
