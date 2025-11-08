import { usePage, router, Head } from "@inertiajs/react";
import { Camera, CheckCircle, Loader2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import MemberLayout from "@/Layouts/MemberLayout";

export default function Verification({ user }) {
    const { auth, flash } = usePage().props;
    const userData = user || auth.user;
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [captured, setCaptured] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!userData?.is_verified) {
            startCamera();
        }
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            alert("Gagal mengakses kamera. Mohon izinkan akses kamera.");
        }
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject
                .getTracks()
                .forEach((track) => track.stop());
        }
    };

    const handleCapture = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL("image/png");
        setPhoto(imageData);
        setCaptured(true);
    };

    const handleVerify = () => {
        if (!photo) {
            alert("Silakan ambil foto KTP terlebih dahulu.");
            return;
        }

        setIsSubmitting(true);
        router.post(
            route("member.verification.upload"),
            {
                photo: photo,
            },
            {
                onFinish: () => {
                    setIsSubmitting(false);
                    setCaptured(false);
                    setPhoto(null);
                },
            }
        );
    };

    if (userData?.is_verified) {
        return (
            <>
                <Head title="Akun Terverifikasi" />
                <MemberLayout>
                    <div className="max-w-xl mx-auto bg-gray-900/60 border border-green-400/30 p-8 rounded-2xl shadow-lg backdrop-blur-md text-center">
                        <CheckCircle
                            className="mx-auto text-green-400 mb-4"
                            size={60}
                        />
                        <h2 className="text-3xl font-bold text-green-400 mb-4">
                            Akun Terverifikasi
                        </h2>
                        <p className="text-gray-400">
                            Akun kamu sudah diverifikasi. Kamu dapat menggunakan
                            semua fitur Rentalin termasuk Paylater.
                        </p>
                    </div>
                </MemberLayout>
            </>
        );
    }

    return (
        <>
            <Head title="Verifikasi Akun" />
            <MemberLayout>
                <div className="max-w-xl mx-auto bg-gray-900/60 border border-[#00D8C8]/30 p-8 rounded-2xl shadow-lg backdrop-blur-md text-center animate-fade-in">
                    <Camera className="mx-auto text-[#00D8C8]" size={60} />
                    <h2 className="text-3xl font-bold text-[#00D8C8] mt-4 mb-4">
                        Verifikasi Identitas
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Posisikan KTP kamu di dalam kotak yang ditandai dan
                        ambil foto untuk verifikasi.
                    </p>

                    {flash?.success && (
                        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/40 rounded-lg text-green-400 text-sm text-left">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold mb-1">
                                        Berhasil!
                                    </p>
                                    <p>{flash.success}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {flash?.error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-lg text-red-400 text-sm">
                            {flash.error}
                        </div>
                    )}

                    <div className="relative bg-black rounded-lg overflow-hidden">
                        {!captured ? (
                            <>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    className="w-full h-64 object-cover border border-gray-700 rounded-lg"
                                />
                                <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/3 w-48 h-32 border-2 border-[#00D8C8] rounded-md opacity-80 shadow-lg">
                                    <div className="absolute top-0 left-0 w-4 h-1 bg-[#00D8C8]" />
                                    <div className="absolute top-0 left-0 w-1 h-4 bg-[#00D8C8]" />
                                    <div className="absolute top-0 right-0 w-4 h-1 bg-[#00D8C8]" />
                                    <div className="absolute top-0 right-0 w-1 h-4 bg-[#00D8C8]" />
                                    <div className="absolute bottom-0 left-0 w-4 h-1 bg-[#00D8C8]" />
                                    <div className="absolute bottom-0 left-0 w-1 h-4 bg-[#00D8C8]" />
                                    <div className="absolute bottom-0 right-0 w-4 h-1 bg-[#00D8C8]" />
                                    <div className="absolute bottom-0 right-0 w-1 h-4 bg-[#00D8C8]" />
                                </div>
                            </>
                        ) : (
                            <img
                                src={photo}
                                alt="Captured ID"
                                className="w-full h-64 object-cover border border-gray-700 rounded-lg"
                            />
                        )}
                    </div>

                    <canvas ref={canvasRef} className="hidden" />

                    <div className="mt-6 flex justify-center gap-4">
                        {!captured ? (
                            <button
                                onClick={handleCapture}
                                disabled={isSubmitting}
                                className="py-3 px-6 rounded-lg bg-[#00D8C8]/20 border border-[#00D8C8]/50 text-[#00D8C8] font-semibold hover:bg-[#00D8C8]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Ambil Foto
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        setCaptured(false);
                                        setPhoto(null);
                                    }}
                                    disabled={isSubmitting}
                                    className="py-3 px-6 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-300 font-semibold hover:bg-gray-600/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Foto Ulang
                                </button>
                                <button
                                    onClick={handleVerify}
                                    disabled={isSubmitting}
                                    className="py-3 px-6 rounded-lg bg-[#00D8C8]/20 border border-[#00D8C8]/50 text-[#00D8C8] font-semibold hover:bg-[#00D8C8]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                                >
                                    {isSubmitting && (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    )}
                                    {isSubmitting
                                        ? "Memproses..."
                                        : "Verifikasi"}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </MemberLayout>
        </>
    );
}
