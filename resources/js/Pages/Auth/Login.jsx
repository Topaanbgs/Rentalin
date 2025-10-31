import { Head, Link, useForm } from "@inertiajs/react";
import { Lock, Mail, ArrowRight } from "lucide-react";
import InputError from "@/Components/InputError";
import SignLayout from "@/Layouts/SignLayout";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Masuk - Rentalin" />
            {/* Left Section */}
            <div className="min-h-screen flex flex-col lg:flex-row">
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-black/80">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-white mb-2">
                                Masuk
                            </h2>
                        </div>

                        {status && (
                            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">
                                    Alamat Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className="w-full pl-12 pr-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-lg focus:border-[#0066CC] focus:ring-4 focus:ring-[#B4E4CE]/50 transition outline-none text-gray-900"
                                        placeholder="email@anda.com"
                                        autoComplete="username"
                                        autoFocus
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">
                                    Kata Sandi
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className="w-full pl-12 pr-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-lg focus:border-[#0066CC] focus:ring-4 focus:ring-[#B4E4CE]/50 transition outline-none text-gray-900"
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                    />
                                </div>
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                "remember",
                                                e.target.checked
                                            )
                                        }
                                        className="w-4 h-4 text-[#0066CC] border-gray-300 rounded focus:ring-[#0066CC] cursor-pointer"
                                    />
                                    <span className="ml-2 text-sm text-white">
                                        Ingat saya
                                    </span>
                                </label>
                                {canResetPassword && (
                                    <Link
                                        href={route("password.request")}
                                        className="text-sm font-semibold text-white hover:text-[#0066CC] transition"
                                    >
                                        Lupa kata sandi?
                                    </Link>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-gradient-to-r from-[#0066CC] to-[#0052A3] text-white rounded-lg font-bold text-base uppercase tracking-wider hover:shadow-lg hover:shadow-[#0066CC]/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 group"
                            >
                                {processing ? "Masuk..." : "Masuk"}
                                {!processing && (
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Section */}
                <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center text-white text-center p-12">
                    <div className="absolute inset-0 bg-black/50 z-10" />

                    <div className="relative z-20">
                        <h1 className="text-4xl font-bold mb-4">
                            Mulai Perjalananmu
                        </h1>
                        <p className="text-lg text-gray-200 mb-8 max-w-sm mx-auto">
                            Belum punya akun? Daftar dan mulai petualangan
                            bermainmu sekarang!
                        </p>
                        <Link
                            href={route("register")}
                            className="px-10 py-3 rounded-full border-2 border-white text-white font-bold uppercase tracking-wider text-sm hover:bg-white/10 transition-all active:scale-95"
                        >
                            Daftar
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

Login.layout = (page) => <SignLayout children={page} />;
