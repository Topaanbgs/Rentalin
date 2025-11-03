import SignLayout from "@/Layouts/SignLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route("verification.send"));
    };

    return (
        <>
            <Head title="Verifikasi Email" />
            <div className="min-h-screen flex flex-col lg:flex-row">
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-black/80">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-white mb-2">
                                Verifikasi Email Anda
                            </h2>
                        </div>

                        <div className="mb-4 text-sm text-gray-200">
                            Terima kasih telah mendaftar! Sebelum memulai,
                            dapatkah Anda memverifikasi alamat email Anda dengan
                            mengeklik tautan yang baru saja kami kirimkan
                            melalui email? Jika Anda tidak menerima email
                            tersebut, kami dengan senang hati akan mengirimkan
                            email baru.
                        </div>

                        {status === "verification-link-sent" && (
                            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                                Tautan verifikasi baru telah dikirim ke alamat
                                email yang Anda berikan saat pendaftaran.
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full sm:w-auto flex-1 py-3 bg-gradient-to-r from-[#0066CC] to-[#0052A3] text-white rounded-lg font-bold text-base uppercase tracking-wider hover:shadow-lg hover:shadow-[#0066CC]/30 transition-all duration-300 disabled:opacity-50"
                                >
                                    Kirim Ulang Email
                                </button>

                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="w-full sm:w-auto px-6 py-3 border border-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold"
                                >
                                    Keluar
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center text-white text-center p-12">
                    <div className="absolute inset-0 bg-black/50 z-10" />
                    <div className="relative z-20">
                        <h1 className="text-4xl font-bold mb-4">
                            Satu Langkah Lagi
                        </h1>
                        <p className="text-lg text-gray-200 mb-8 max-w-sm mx-auto">
                            Kami telah mengirimkan tautan ke email Anda. Silakan
                            periksa kotak masuk untuk menyelesaikan pendaftaran.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

VerifyEmail.layout = (page) => <SignLayout children={page} />;
