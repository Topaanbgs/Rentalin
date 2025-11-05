import { Head, Link, useForm } from "@inertiajs/react";
import { Lock, Mail, ArrowRight, User, Phone } from "lucide-react";
import InputError from "@/Components/InputError";
import SignLayout from "@/Layouts/SignLayout";
import { useEffect } from "react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        phone_number: "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        return () => reset("password", "password_confirmation");
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("register"));
    };

    return (
        <>
            <Head title="Daftar" />
            <div className="min-h-screen flex flex-col lg:flex-row">
                <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center text-white text-center p-12">
                    <div className="absolute inset-0 bg-black/50 z-10" />
                    <div className="relative z-20">
                        <h1 className="text-4xl font-bold mb-4">
                            Selamat Datang!
                        </h1>
                        <p className="text-lg text-gray-200 mb-8 max-w-sm mx-auto">
                            Sudah punya akun? Masuk untuk melanjutkan sesi
                            bermainmu.
                        </p>
                        <Link
                            href={route("login")}
                            className="px-10 py-3 rounded-full border-2 border-white text-white font-bold uppercase tracking-wider text-sm hover:bg-white/10 transition-all active:scale-95"
                        >
                            Masuk
                        </Link>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-black/80">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-white mb-2">
                                Buat Akun
                            </h2>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">
                                    Nama Lengkap
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="w-full pl-12 pr-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-lg focus:border-[#0066CC] focus:ring-4 focus:ring-[#B4E4CE]/50 outline-none text-gray-900"
                                        placeholder="Nama lengkap Anda"
                                        autoComplete="name"
                                        autoFocus
                                    />
                                </div>
                                <InputError
                                    message={errors.name}
                                    className="mt-2 text-red-400"
                                />
                            </div>

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
                                        className="w-full pl-12 pr-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-lg focus:border-[#0066CC] focus:ring-4 focus:ring-[#B4E4CE]/50 outline-none text-gray-900"
                                        placeholder="email@anda.com"
                                        autoComplete="username"
                                    />
                                </div>
                                <InputError
                                    message={errors.email}
                                    className="mt-2 text-red-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">
                                    Nomor Telepon
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        value={data.phone_number}
                                        onChange={(e) =>
                                            setData(
                                                "phone_number",
                                                e.target.value
                                            )
                                        }
                                        className="w-full pl-12 pr-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-lg focus:border-[#0066CC] focus:ring-4 focus:ring-[#B4E4CE]/50 outline-none text-gray-900"
                                        placeholder="08xxxxxxxxxx"
                                        autoComplete="tel"
                                    />
                                </div>
                                <InputError
                                    message={errors.phone_number}
                                    className="mt-2 text-red-400"
                                />
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
                                        className="w-full pl-12 pr-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-lg focus:border-[#0066CC] focus:ring-4 focus:ring-[#B4E4CE]/50 outline-none text-gray-900"
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                    />
                                </div>
                                <InputError
                                    message={errors.password}
                                    className="mt-2 text-red-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">
                                    Konfirmasi Kata Sandi
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        className="w-full pl-12 pr-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-lg focus:border-[#0066CC] focus:ring-4 focus:ring-[#B4E4CE]/50 outline-none text-gray-900"
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                    />
                                </div>
                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-2 text-red-400"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 mt-4 bg-gradient-to-r from-[#0066CC] to-[#0052A3] text-white rounded-lg font-bold text-base uppercase tracking-wider hover:shadow-lg hover:shadow-[#0066CC]/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 group"
                            >
                                {processing ? "Mendaftar..." : "Daftar"}
                                {!processing && (
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

Register.layout = (page) => <SignLayout children={page} />;
