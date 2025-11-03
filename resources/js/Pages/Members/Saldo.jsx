import { usePage, router } from "@inertiajs/react";
import { Wallet, PlusCircle, ArrowLeftRight } from "lucide-react";
import MemberLayout from "@/Layouts/MemberLayout";
import { formatCurrency } from "@/utils/formatCurrency";

export default function Saldo({ balance, transactions = [] }) {
    const { auth } = usePage().props;
    const currentBalance = balance || auth.user?.balance || 0;

    return (
        <MemberLayout>
            <div className="min-h-screen text-white px-6 py-10">
                <div className="bg-gray-900/60 border border-cyan-400/30 rounded-2xl p-6 text-center shadow-lg mb-10">
                    <Wallet className="mx-auto text-cyan-400 mb-3" size={40} />
                    <p className="text-gray-400">Saldo Saat Ini</p>
                    <h2 className="text-4xl font-bold text-cyan-300 mt-2">
                        Rp {formatCurrency(currentBalance)}
                    </h2>
                    <button
                        onClick={() => router.visit(route("member.balance"))}
                        className="mt-6 inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/40 px-5 py-2 rounded-xl font-semibold text-cyan-300 hover:bg-cyan-500/30 transition-all"
                    >
                        <PlusCircle size={18} /> Top Up Saldo
                    </button>
                </div>

                <div className="p-6 shadow-lg">
                    <h2 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center gap-2">
                        <ArrowLeftRight size={20} /> Riwayat Saldo
                    </h2>

                    {transactions.length > 0 ? (
                        <div className="space-y-3">
                            {transactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="flex justify-between items-center bg-[#111827]/60 border border-[#00D8C8]/20 rounded-xl px-4 py-3 hover:border-fuchsia-500/30 transition"
                                >
                                    <div>
                                        <p className="text-gray-300 font-medium">
                                            {transaction.description}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(
                                                transaction.created_at
                                            ).toLocaleDateString("id-ID", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <p
                                        className={`font-semibold ${
                                            transaction.type === "credit"
                                                ? "text-green-400"
                                                : "text-fuchsia-400"
                                        }`}
                                    >
                                        {transaction.type === "credit"
                                            ? "+"
                                            : "-"}{" "}
                                        Rp {formatCurrency(transaction.amount)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <ArrowLeftRight
                                className="mx-auto text-gray-600 mb-3"
                                size={48}
                            />
                            <p className="text-gray-500">
                                Belum ada riwayat transaksi saldo.
                            </p>
                            <p className="text-gray-600 text-sm mt-2">
                                Lakukan top-up atau transaksi untuk melihat
                                riwayat.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </MemberLayout>
    );
}
