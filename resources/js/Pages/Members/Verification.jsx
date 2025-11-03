import { usePage, router } from "@inertiajs/react";
import { Camera, CheckCircle } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import MemberLayout from "@/Layouts/MemberLayout";

export default function Verification({ user }) {
    const { auth, flash } = usePage().props;
    const userData = user || auth.user;
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [captured, setCaptured] = useState(false);
    const [photo, setPhoto] = useState(null);

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

        router.post(route("member.verification.upload"), {
            photo: photo,
        });
    };

    if (userData?.is_verified) {
        return (
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
                        semua fitur Rentalin.
                    </p>
                </div>
            </MemberLayout>
        );
    }

    return (
        <MemberLayout>
            <div className="max-w-xl mx-auto bg-gray-900/60 border border-[#00D8C8]/30 p-8 rounded-2xl shadow-lg backdrop-blur-md text-center animate-fade-in">
                <Camera className="mx-auto text-[#00D8C8]" size={60} />
                <h2 className="text-3xl font-bold text-[#00D8C8] mt-4 mb-4">
                    Verifikasi Identitas
                </h2>
                <p className="text-gray-400 mb-6">
                    Posisikan KTP kamu di dalam kotak yang ditandai dan ambil
                    foto untuk verifikasi.
                </p>

                <div className="relative bg-black rounded-lg overflow-hidden">
                    {!captured ? (
                        <>
                            <video
                                ref={videoRef}
                                autoPlay
                                className="w-full h-64 object-cover border border-gray-700 rounded-lg"
                            />
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-32 border-2 border-[#00D8C8] rounded-md opacity-80 shadow-lg">
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
                            className="py-3 px-6 rounded-lg bg-[#00D8C8]/20 border border-[#00D8C8]/50 text-[#00D8C8] font-semibold hover:bg-[#00D8C8]/30 transition-all"
                        >
                            Ambil Foto
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => setCaptured(false)}
                                className="py-3 px-6 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-300 font-semibold hover:bg-gray-600/50 transition-all"
                            >
                                Foto Ulang
                            </button>
                            <button
                                onClick={handleVerify}
                                className="py-3 px-6 rounded-lg bg-[#00D8C8]/20 border border-[#00D8C8]/50 text-[#00D8C8] font-semibold hover:bg-[#00D8C8]/30 transition-all"
                            >
                                Verifikasi
                            </button>
                        </>
                    )}
                </div>
            </div>
        </MemberLayout>
    );
}
