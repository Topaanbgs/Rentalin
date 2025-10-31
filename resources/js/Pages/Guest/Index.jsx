import React, { useState, useEffect } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Gamepad2, CreditCard, Award } from "lucide-react";

const placeholderHero =
    "https://res.cloudinary.com/dutkpfai9/image/upload/v1761897448/unnamed_syyhw5.jpg";

export default function Index() {
    const slides = [placeholderHero, placeholderHero, placeholderHero];
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(
            () => setCurrent((prev) => (prev + 1) % slides.length),
            5000
        );
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <GuestLayout>
            <div className="min-h-screen relative overflow-hidden">
                {/* Hero */}
                <section className="h-[75vh] w-full overflow-hidden flex items-center justify-center">
                    {slides.map((src, index) => (
                        <img
                            key={index}
                            src={src}
                            alt={`hero-${index}`}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ${
                                index === current ? "opacity-100" : "opacity-0"
                            }`}
                        />
                    ))}
                </section>

                {/* Intro */}
                <section className="py-24 text-white">
                    <h2 className="text-4xl font-extrabold text-center mb-16 bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,255,0.3)]">
                        KENAPA HARUS KE RENTALIN?
                    </h2>

                    <div className="container mx-auto px-6 grid md:grid-cols-2 gap-6">
                        {/* Left feature */}
                        <div className="relative rounded-2xl overflow-hidden group h-[500px] shadow-[0_0_40px_rgba(0,255,255,0.2)]">
                            <img
                                src={placeholderHero}
                                alt="Sistem Self-Service"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#000]/80 via-[#0a0f1e]/40 to-transparent"></div>
                            <div className="absolute bottom-10 left-10 max-w-sm">
                                <div className="mb-4">
                                    <Gamepad2
                                        className="text-cyan-400 drop-shadow-[0_0_12px_#00ffff]"
                                        size={48}
                                    />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-3 drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                                    Sistem Self-Service
                                </h3>
                                <p className="text-gray-300 text-base leading-relaxed">
                                    Pesan & kelola penyewaan tanpa menunggu
                                    admin.
                                </p>
                            </div>
                        </div>

                        {/* Right feature cards */}
                        <div className="flex flex-col gap-6">
                            <div className="relative rounded-2xl overflow-hidden group h-[240px] shadow-[0_0_25px_rgba(255,0,255,0.2)]">
                                <img
                                    src={placeholderHero}
                                    alt="Pembayaran Fleksibel"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#000]/80 via-[#1a0b2e]/50 to-transparent"></div>
                                <div className="absolute bottom-6 left-6">
                                    <CreditCard
                                        className="text-fuchsia-400 drop-shadow-[0_0_10px_#ff00ff]"
                                        size={40}
                                    />
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        Pembayaran Fleksibel
                                    </h3>
                                    <p className="text-gray-300 text-sm">
                                        Saldo, QRIS, Paylater — main kapan saja.
                                    </p>
                                </div>
                            </div>

                            <div className="relative rounded-2xl overflow-hidden group h-[240px] shadow-[0_0_25px_rgba(0,255,255,0.2)]">
                                <img
                                    src={placeholderHero}
                                    alt="Reward & Riwayat"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#000]/80 via-[#0a0f1e]/50 to-transparent"></div>
                                <div className="absolute bottom-6 left-6">
                                    <Award
                                        className="text-blue-400 drop-shadow-[0_0_10px_#00b4e6]"
                                        size={40}
                                    />
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        Reward & Riwayat
                                    </h3>
                                    <p className="text-gray-300 text-sm">
                                        Pantau transaksi & kumpulkan poin
                                        loyalti.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Game Library */}
                <section className="relative py-24">
                    <div className="relative mb-12 overflow-hidden">
                        <div className="flex animate-scroll-x gap-6">
                            {[...Array(2)].map((_, i) => (
                                <React.Fragment key={i}>
                                    {[...Array(5)].map((_, j) => (
                                        <img
                                            key={j}
                                            src={placeholderHero}
                                            alt={`game-${i}-${j}`}
                                            className="w-64 h-96 object-cover rounded-xl shadow-[0_0_20px_#00B4E6]/40"
                                        />
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent mb-3 drop-shadow-md">
                            Game Library
                        </h2>
                        <p className="text-gray-400">
                            Semua judul game terbaik dari berbagai platform,
                            terus diperbarui setiap bulan.
                        </p>
                    </div>

                    <div className="relative overflow-hidden">
                        <div className="flex animate-scroll-x-reverse gap-6">
                            {[...Array(2)].map((_, i) => (
                                <React.Fragment key={i}>
                                    {[...Array(5)].map((_, j) => (
                                        <img
                                            key={j}
                                            src={placeholderHero}
                                            alt={`game-rev-${i}-${j}`}
                                            className="w-64 h-96 object-cover rounded-xl shadow-[0_0_20px_#9333EA]/40"
                                        />
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <style>{`
            @keyframes scroll-x {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @keyframes scroll-x-reverse {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0); }
            }
            .animate-scroll-x {
              width: 200%;
              animation: scroll-x 40s linear infinite;
            }
            .animate-scroll-x-reverse {
              width: 200%;
              animation: scroll-x-reverse 40s linear infinite;
            }
          `}</style>
                </section>

                {/* Events */}
                <section className="py-24 text-white">
                    <div className="container mx-auto px-6 text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4 text-cyan-400">
                            RENTALIN EVENT
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Ikuti event terbaru dari RENTALIN — turnamen, promo
                            spesial, dan kolaborasi eksklusif!
                        </p>
                    </div>

                    <div className="space-y-16 container mx-auto px-6">
                        {[
                            "Turnamen Bulanan",
                            "Promo Akhir Tahun",
                            "Kolaborasi Eksklusif",
                        ].map((title, i) => (
                            <div
                                key={i}
                                className={`relative rounded-2xl overflow-hidden h-[450px] shadow-[0_0_30px_${
                                    i === 1 ? "#9333EA" : "#00B4E6"
                                }]/40`}
                                style={{
                                    backgroundImage: `url(${placeholderHero})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                <div
                                    className={`absolute inset-0 ${
                                        i === 1
                                            ? "bg-gradient-to-l"
                                            : "bg-gradient-to-r"
                                    } from-black/80 via-black/50 to-transparent`}
                                ></div>
                                <div
                                    className={`absolute inset-0 flex items-center ${
                                        i === 1 ? "justify-end" : ""
                                    }`}
                                >
                                    <div
                                        className={`max-w-lg ${
                                            i === 1
                                                ? "mr-10 md:mr-20 text-right"
                                                : "ml-10 md:ml-20"
                                        }`}
                                    >
                                        <h3
                                            className={`text-4xl font-bold mb-4 ${
                                                i === 1
                                                    ? "text-fuchsia-300"
                                                    : "text-cyan-300"
                                            }`}
                                        >
                                            {title}
                                        </h3>
                                        <p className="text-gray-200 leading-relaxed">
                                            {i === 0
                                                ? "Ayo ikut turnamen bulanan RENTALIN dan menangkan hadiah eksklusif!"
                                                : i === 1
                                                ? "Dapatkan diskon besar-besaran dan bonus game selama promo akhir tahun!"
                                                : "Nikmati kolaborasi spesial RENTALIN dengan brand ternama di dunia game!"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Support */}
                <section
                    className="relative py-48 text-white flex items-center justify-center text-center"
                    style={{
                        backgroundImage: `url('${placeholderHero}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="absolute inset-0"></div>
                    <div className="relative z-10 max-w-2xl px-6">
                        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-lg">
                            RENTALIN SUPPORT
                        </h2>
                        <p className="text-gray-200 text-lg leading-relaxed">
                            Kami selalu siap membantu kamu — kapan pun dan di
                            mana pun.
                        </p>
                    </div>
                </section>

                <style>{`
          .animate-fade-in {
            animation: fadeIn 1.8s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(25px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
            </div>
        </GuestLayout>
    );
}
