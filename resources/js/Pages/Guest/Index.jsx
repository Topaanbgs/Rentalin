import React, { useState, useEffect } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Gamepad2, CreditCard, Award } from "lucide-react";

const heroImages = [
    "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762157029/2_eg12k5.jpg",
    "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762157034/3_rhv6hm.jpg",
    "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762192671/4_b07ayn.jpg",
    "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762192672/8_hoxiie.jpg",
    "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762192677/10_we0r9x.jpg",
    "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762192687/9_aksueu.jpg",
    "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762192678/5_cj0cah.jpg",
    "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762192679/7_j8glik.jpg",
    "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762192680/6_krgmtc.jpg",
];

export default function Index() {
    const gameImages = [
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162451/Screenshot_164_ihjymc.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162446/Screenshot_165_yllkpv.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162438/Screenshot_157_ttb51x.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162438/Screenshot_163_zumqto.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162436/Screenshot_162_ujhozm.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162434/Screenshot_161_fvc0ur.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162430/Screenshot_160_g4vvgp.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162427/Screenshot_159_qmmrsl.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162423/Screenshot_158_dd2u9x.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162422/Screenshot_156_xpe6db.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162411/Screenshot_151_wgprtw.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162411/Screenshot_154_sjynuu.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162411/Screenshot_152_zzdq1v.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162409/Screenshot_153_y9iolh.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162407/Screenshot_187_om3995.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162401/Screenshot_186_ydjwjl.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162399/Screenshot_185_wjr2b5.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162396/Screenshot_184_ybvsvq.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162395/Screenshot_183_tyix47.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162393/Screenshot_182_cstmw6.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162390/Screenshot_181_u4ssuo.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162388/Screenshot_180_qlobvr.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162387/Screenshot_179_hixghs.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162384/Screenshot_178_rdsfgu.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162383/Screenshot_177_heqf9i.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162381/Screenshot_176_okzeq0.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162379/Screenshot_175_nkwpie.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162377/Screenshot_174_w7l9an.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162376/Screenshot_173_v0l9c4.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162374/Screenshot_172_j9yiqh.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162373/Screenshot_171_oeopg3.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162371/Screenshot_170_nl33li.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162371/Screenshot_169_nasjve.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162370/Screenshot_167_nkoofi.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162370/Screenshot_168_yuiywd.png",
        "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762162369/Screenshot_166_lwq7kk.png",
    ];

    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(
            () => setCurrent((prev) => (prev + 1) % heroImages.length),
            3000
        );
        return () => clearInterval(timer);
    }, []);

    return (
        <GuestLayout>
            <div className="min-h-screen overflow-hidden bg-[#0a0f1e]">
                <section className="h-[100vh] w-full overflow-hidden flex items-center justify-center">
                    {heroImages.map((src, index) => (
                        <img
                            key={index}
                            src={src}
                            alt={`hero-${index}`}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ${
                                index === current ? "opacity-100" : "opacity-0"
                            }`}
                        />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </section>

                <section className="py-24 text-white">
                    <h2 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,255,0.3)]">
                        KENAPA RENTALIN ?
                    </h2>

                    <div className="container mx-auto px-6 grid md:grid-cols-2 gap-6">
                        <div className="relative rounded-2xl overflow-hidden group h-[500px] shadow-[0_0_40px_rgba(0,255,255,0.2)]">
                            <img
                                src="https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762159900/1_heskpq.jpg"
                                alt="Sistem Self-Service"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#000]/80 via-[#0a0f1e]/40 to-transparent" />
                            <div className="absolute bottom-10 left-10 max-w-sm">
                                <Gamepad2
                                    className="text-cyan-400 drop-shadow-[0_0_12px_#00ffff] mb-4"
                                    size={48}
                                />
                                <h3 className="text-3xl font-bold mb-3 drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                                    Layanan Self-Service
                                </h3>
                                <p className="text-gray-300 text-base leading-relaxed">
                                    Akses langsung, atur penyewaan sendiri, dan
                                    mulai main tanpa menunggu konfirmasi.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="relative rounded-2xl overflow-hidden group h-[240px] shadow-[0_0_25px_rgba(255,0,255,0.2)]">
                                <img
                                    src="https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762159900/2_rayfy5.jpg"
                                    alt="Pembayaran Fleksibel"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#000]/80 via-[#1a0b2e]/50 to-transparent" />
                                <div className="absolute bottom-6 left-6">
                                    <CreditCard
                                        className="text-fuchsia-400 drop-shadow-[0_0_10px_#ff00ff]"
                                        size={40}
                                    />
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        Bayar Sesuai Gaya Kamu
                                    </h3>
                                    <p className="text-gray-300 text-sm">
                                        Pilih saldo, QRIS, atau Paylater dan
                                        langsung lanjut main.
                                    </p>
                                </div>
                            </div>

                            <div className="relative rounded-2xl overflow-hidden group h-[240px] shadow-[0_0_25px_rgba(0,255,255,0.2)]">
                                <img
                                    src="https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762159899/3_vw3kx1.jpg"
                                    alt="Reward & Riwayat"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#000]/80 via-[#0a0f1e]/50 to-transparent" />
                                <div className="absolute bottom-6 left-6">
                                    <Award
                                        className="text-blue-400 drop-shadow-[0_0_10px_#00b4e6]"
                                        size={40}
                                    />
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        Dapatkan Reward Setiap Main
                                    </h3>
                                    <p className="text-gray-300 text-sm">
                                        Kumpulkan poin, pantau riwayat, dan
                                        tukarkan jadi keuntungan baru.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="relative py-24 bg-transparent">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent mb-3 drop-shadow-md">
                            KOLEKSI GAME KAMI
                        </h2>
                        <p className="text-gray-300">
                            Jelajahi deretan game terbaik dari berbagai
                            platform. Semua terus diperbarui setiap bulan.
                        </p>
                    </div>

                    <div className="relative mb-12 overflow-hidden">
                        <div className="flex animate-scroll-x gap-6">
                            {[...Array(2)].map((_, i) => (
                                <React.Fragment key={i}>
                                    {gameImages
                                        .slice(0, 18)
                                        .map((img, index) => (
                                            <img
                                                key={index}
                                                src={img}
                                                alt={`game-${index}`}
                                                className="w-64 h-96 object-cover rounded-xl shadow-[0_0_20px_#00B4E6]/40"
                                            />
                                        ))}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className="relative overflow-hidden">
                        <div className="flex animate-scroll-x-reverse gap-6">
                            {[...Array(2)].map((_, i) => (
                                <React.Fragment key={i}>
                                    {gameImages.slice(18).map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt={`game-rev-${index}`}
                                            className="w-64 h-96 object-cover rounded-xl shadow-[0_0_20px_#9333EA]/40"
                                        />
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-24 text-white">
                    <div className="container mx-auto px-6 text-center mb-12">
                        <h2 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,255,0.3)]">
                            EVENT RENTALIN
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Gabung di berbagai event seru, dari turnamen, promo
                            spesial, sampai kolaborasi bareng brand game
                            favoritmu.
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
                                    backgroundImage: `url(${
                                        i === 0
                                            ? "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762161065/1C_fglofx.jpg"
                                            : i === 1
                                            ? "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762161068/1B_vvlsun.jpg"
                                            : "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762161065/1A_sutgsh.jpg"
                                    })`,
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
                                />
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
                                                ? "Ikuti turnamen bulanan RENTALIN dan rebut hadiah eksklusif untuk pemain terbaik."
                                                : i === 1
                                                ? "Nikmati promo akhir tahun dengan diskon besar dan bonus game favorit."
                                                : "Bergabung dalam kolaborasi spesial RENTALIN bersama brand game ternama."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section
                    className="relative py-48 text-white flex items-center justify-center text-center"
                    style={{
                        backgroundImage: `url('https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762160334/4_lrht8s.jpg')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="absolute inset-0 bg-black/80"></div>
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-lg">
                            PUSAT BANTUAN RENTALIN
                        </h2>
                        <p className="text-gray-200 text-lg leading-relaxed">
                            Tim kami siap membantu kamu setiap saat agar
                            pengalaman bermain tetap lancar dan menyenangkan.
                        </p>
                    </div>
                </section>

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
                        width: calc(16rem * 36 + 1.5rem * 36);
                        animation: scroll-x 120s linear infinite;
                    }
                    .animate-scroll-x-reverse {
                        width: calc(16rem * 36 + 1.5rem * 36);
                        animation: scroll-x-reverse 120s linear infinite;
                    }
                `}</style>
            </div>
        </GuestLayout>
    );
}
