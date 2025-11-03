import InputError from "@/Components/InputError";
import SignLayout from "@/Layouts/SignLayout";
import { Head, useForm } from "@inertiajs/react";
import { Lock } from "lucide-react";

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.confirm"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Konfirmasi Kata Sandi" />
            <div className="min-h-screen flex flex-col lg:flex-row">
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-black/80">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-white mb-2">
                                Konfirmasi Kata Sandi
                            </h2>
                        </div>

                        <div className="mb-4 text-sm text-gray-200">
                            Ini adalah area aman aplikasi. Harap konfirmasi kata
                            sandi Anda sebelum melanjutkan.
                        </div>

                        <form onSubmit={submit} className="space-y-6">
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
                                        autoFocus
                                    />
                                </div>
                                <InputError
                                    message={errors.password}
                                    className="mt-2 text-red-400"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-gradient-to-r from-[#0066CC] to-[#0052A3] text-white rounded-lg font-bold text-base uppercase tracking-wider hover:shadow-lg hover:shadow-[#0066CC]/30 transition-all duration-300 disabled:opacity-50"
                            >
                                {processing ? "Mengonfirmasi..." : "Konfirmasi"}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center text-white text-center p-12">
                    <div className="absolute inset-0 bg-black/50 z-10" />
                    <div className="relative z-20">
                        <h1 className="text-4xl font-bold mb-4">Area Aman</h1>
                        <p className="text-lg text-gray-200 mb-8 max-w-sm mx-auto">
                            Hanya satu langkah cepat untuk memastikan ini
                            benar-benar Anda.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

ConfirmPassword.layout = (page) => <SignLayout children={page} />;
