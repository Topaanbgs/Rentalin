import { usePage, useForm } from "@inertiajs/react";
import { Save } from "lucide-react";
import MemberLayout from "@/Layouts/MemberLayout";

export default function Setting({ user }) {
    const { auth, flash } = usePage().props;
    const userData = user || auth.user;

    const { data, setData, patch, processing, errors } = useForm({
        name: userData?.name || "",
        email: userData?.email || "",
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route("profile.update"));
    };

    return (
        <MemberLayout>
            <div className="max-w-3xl mx-auto bg-gray-900/60 border border-[#00D8C8]/30 p-10 rounded-2xl shadow-lg backdrop-blur-md animate-fade-in">
                <h2 className="text-3xl font-bold text-[#00D8C8] mb-6 text-center">
                    Pengaturan Akun
                </h2>

                {flash?.success && (
                    <div className="mb-4 p-3 bg-green-500/20 border border-green-500/40 rounded-lg text-green-400 text-sm">
                        {flash.success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-300 mb-2">
                            Nama Lengkap
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="w-full p-3 rounded-lg bg-black/40 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00D8C8]"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className="w-full p-3 rounded-lg bg-black/40 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00D8C8]"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">
                            Password Baru (Opsional)
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className="w-full p-3 rounded-lg bg-black/40 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00D8C8]"
                            placeholder="Kosongkan jika tidak ingin mengubah"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">
                            Konfirmasi Password
                        </label>
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            className="w-full p-3 rounded-lg bg-black/40 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00D8C8]"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#00D8C8]/20 border border-[#00D8C8]/50 text-[#00D8C8] font-semibold hover:bg-[#00D8C8]/30 transition-all disabled:opacity-50"
                    >
                        <Save size={18} />{" "}
                        {processing ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                </form>
            </div>
        </MemberLayout>
    );
}
