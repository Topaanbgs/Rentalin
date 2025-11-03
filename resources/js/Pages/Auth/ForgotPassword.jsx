import InputError from "@/Components/InputError";
import SignLayout from "@/Layouts/SignLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <>
            <Head title="Lupa Kata Sandi" />
            <div className="min-h-screen flex flex-col lg:flex-row">
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-black/80">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-white mb-2">
                                Lupa Kata Sandi?
                            </h2>
                            <p className="text-gray-400 mt-4">
                                Cukup beri tahu kami alamat email Anda dan kami
                                akan mengirimkan tautan untuk mengatur ulang
                                kata sandi.
                            </p>
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
                                <InputError
                                    message={errors.email}
                                    className="mt-2 text-red-400"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-gradient-to-r from-[#0066CC] to-[#0052A3] text-white rounded-lg font-bold text-base uppercase tracking-wider hover:shadow-lg hover:shadow-[#0066CC]/30 transition-all duration-300 disabled:opacity-50"
                            >
                                {processing
                                    ? "Mengirim..."
                                    : "Kirim Tautan Reset"}
                            </button>
                            <div className="text-center pt-4 border-t border-gray-700/50">
                                <Link
                                    href={route("login")}
                                    className="text-sm font-semibold text-white hover:text-[#0066CC] transition inline-flex items-center gap-1"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Kembali ke Halaman Masuk
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center text-white text-center p-12">
                    <div className="absolute inset-0 bg-black/50 z-10" />
                    <div className="relative z-20">
                        <h1 className="text-4xl font-bold mb-4">
                            Butuh Bantuan?
                        </h1>
                        <p className="text-lg text-gray-200 mb-8 max-w-sm mx-auto">
                            Kami akan membantu Anda kembali ke akun Anda dalam
                            waktu singkat.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

ForgotPassword.layout = (page) => <SignLayout children={page} />;
