import { usePage, router, Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Wallet, CreditCard } from "lucide-react";
import { useState } from "react";
import MemberLayout from "@/Layouts/MemberLayout";
import { translateStatus } from "@/utils/statusTranslator";
import { formatCurrency } from "@/utils/formatCurrency";

export default function Index({ units, stats, activeBookings }) {
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [duration, setDuration] = useState(60);
    const [showModal, setShowModal] = useState(false);

    const statusStyles = {
        available: {
            bg: "bg-green-900/20",
            text: "text-green-400",
            border: "#00ff99",
        },
        booked: {
            bg: "bg-yellow-900/20",
            text: "text-yellow-400",
            border: "#ffcc00",
        },
        in_use: {
            bg: "bg-blue-900/20",
            text: "text-blue-400",
            border: "#00ccff",
        },
        maintenance: {
            bg: "bg-red-900/30",
            text: "text-red-400",
            border: "#ff4444",
        },
    };

    const handleSelectUnit = (unit) => {
        if (unit.status !== "available") {
            alert("Unit ini sedang tidak tersedia untuk disewa.");
            return;
        }
        setSelectedUnit(unit);
        setShowModal(true);
    };

    const handleOrder = () => {
        router.post(route("member.order.store"), {
            unit_id: selectedUnit.id,
            duration: duration,
            start_time: new Date().toISOString(),
        });
    };

    return (
        <>
            <Head title="Dashboard" />
            <MemberLayout>
                <div className="min-h-screen">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-8 py-6 gap-4">
                        <div
                            onClick={() => router.visit(route("member.saldo"))}
                            className="flex items-center gap-2 bg-gray-900/50 border border-[#00D8C8]/30 rounded-xl px-4 py-2 shadow-inner cursor-pointer hover:bg-[#00D8C8]/10 transition-all"
                        >
                            <Wallet className="text-[#00D8C8]" size={22} />
                            <span className="text-lg font-semibold text-[#00D8C8]">
                                Rp {formatCurrency(stats.balance)}
                            </span>
                        </div>

                        <div
                            onClick={() =>
                                router.visit(route("member.paylater"))
                            }
                            className="flex items-center gap-2 bg-gray-900/50 border border-fuchsia-500/40 rounded-xl px-4 py-2 shadow-inner cursor-pointer hover:bg-fuchsia-500/10 transition-all"
                        >
                            <CreditCard
                                className="text-fuchsia-400"
                                size={20}
                            />
                            <div className="flex flex-col text-left">
                                <span className="text-xs text-gray-400 leading-tight">
                                    Sisa Paylater
                                </span>
                                <span className="text-sm font-semibold text-fuchsia-400">
                                    Rp{" "}
                                    {formatCurrency(stats.paylater_available)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {activeBookings?.length > 0 && (
                        <div className="px-8 mb-8">
                            <h3 className="text-xl font-semibold mb-4 text-[#00D8C8]">
                                Booking Aktif
                            </h3>
                            <div className="bg-gray-900/50 border border-[#00D8C8]/30 rounded-xl p-4">
                                {activeBookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="flex justify-between items-center mb-2 last:mb-0"
                                    >
                                        <div>
                                            <p className="font-semibold">
                                                {booking.unit_name}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                {translateStatus(
                                                    booking.status
                                                )}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-[#00D8C8]">
                                                {booking.booking_code}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(
                                                    booking.start_time
                                                ).toLocaleTimeString("id-ID", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="px-8 pb-16">
                        <h2 className="text-2xl font-semibold mb-6 text-center text-[#00D8C8]/90">
                            Daftar Unit PlayStation
                        </h2>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-center">
                            {units?.map((unit) => {
                                const style =
                                    statusStyles[unit.status] ||
                                    statusStyles.available;
                                return (
                                    <motion.div
                                        key={unit.id}
                                        onClick={() => handleSelectUnit(unit)}
                                        className={`relative p-6 rounded-2xl text-center transition-all duration-300 transform backdrop-blur-sm overflow-hidden card-border ${
                                            style.bg
                                        } ${
                                            unit.status === "available"
                                                ? "cursor-pointer hover:scale-105 hover:shadow-2xl"
                                                : "cursor-not-allowed opacity-50"
                                        }`}
                                        style={{
                                            "--border-color": style.border,
                                        }}
                                        whileHover={
                                            unit.status === "available"
                                                ? { y: -5 }
                                                : {}
                                        }
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#00D8C8]/10 via-transparent to-transparent rounded-2xl pointer-events-none" />
                                        <h2 className="text-xl font-semibold mb-2">
                                            {unit.name}
                                        </h2>
                                        <p className="text-sm text-gray-400 mb-1">
                                            {unit.type}
                                        </p>
                                        <p
                                            className={`${style.text} font-medium mb-2`}
                                        >
                                            {translateStatus(unit.status)}
                                        </p>
                                        <p className="text-[#00D8C8] font-bold">
                                            Rp{" "}
                                            {formatCurrency(unit.hourly_rate)}
                                            /jam
                                        </p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {showModal && selectedUnit && (
                        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
                            <div className="bg-[#10141f] p-8 rounded-2xl border border-[#00D8C8]/40 shadow-2xl w-[90%] sm:w-[400px] text-center">
                                <h3 className="text-2xl font-semibold text-[#00D8C8] mb-4">
                                    Pesan {selectedUnit.name}
                                </h3>
                                <p className="text-gray-400 mb-2">
                                    {selectedUnit.type}
                                </p>
                                <p className="text-white font-bold mb-4">
                                    Rp{" "}
                                    {formatCurrency(selectedUnit.hourly_rate)}
                                    /jam
                                </p>

                                <div className="mb-6">
                                    <label className="block text-gray-400 mb-2">
                                        Durasi (menit)
                                    </label>
                                    <select
                                        value={duration}
                                        onChange={(e) =>
                                            setDuration(Number(e.target.value))
                                        }
                                        className="bg-gray-900 text-white border border-[#00D8C8]/40 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#00D8C8]"
                                    >
                                        <option value={60}>1 Jam</option>
                                        <option value={120}>2 Jam</option>
                                        <option value={180}>3 Jam</option>
                                        <option value={240}>4 Jam</option>
                                        <option value={300}>5 Jam</option>
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
                                        onClick={handleOrder}
                                        className="px-4 py-2 bg-[#00D8C8] text-black font-semibold rounded-lg hover:opacity-80 transition"
                                    >
                                        Lanjut Bayar
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
                        animation: borderGlow 5s linear infinite;
                        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                        -webkit-mask-composite: xor;
                        mask-composite: exclude;
                        z-index: -1;
                    }
                    @keyframes borderGlow {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                `}</style>
                </div>
            </MemberLayout>
        </>
    );
}
