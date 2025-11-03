import React from "react";
import GuestLayout from "@/Layouts/GuestLayout";

const games = [
    {
        id: 1,
        platform: "PS5",
        image: "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762154796/fc25_rq3dlu.jpg",
    },
    {
        id: 2,
        platform: "PS4",
        image: "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762154802/batman_ngrskp.jpg",
    },
    {
        id: 3,
        platform: "PS4",
        image: "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762154800/spidey_yeip2u.webp",
    },
    {
        id: 4,
        platform: "PS3",
        image: "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762154792/pes19_pmsvrb.jpg",
    },
    {
        id: 5,
        platform: "PS3",
        image: "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762154790/rdr_hvwssw.jpg",
    },
    {
        id: 6,
        platform: "PS3",
        image: "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762154789/gtav_ozpl37.jpg",
    },
    {
        id: 7,
        platform: "PS2",
        image: "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762154794/gtasa_pfspht.webp",
    },
    {
        id: 8,
        platform: "PS2",
        image: "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762154794/gow_xkdnh7.jpg",
    },
    {
        id: 9,
        platform: "PS1",
        image: "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762154803/proskate_kjwt7o.jpg",
    },
    {
        id: 10,
        platform: "PS1",
        image: "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762154795/tekken_detoy4.jpg",
    },
    {
        id: 11,
        platform: "PS1",
        image: "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762154793/playstation-ps1-resident-evil-2_c50u7b.webp",
    },
    {
        id: 12,
        platform: "PS1",
        image: "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762154788/grandturismo_zrptao.jpg",
    },
];

const logos = {
    ps5: "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762169502/PS5_logo_ypnqig.png",
    ps4: "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762169485/PS4-Logo_spusvc.png",
    ps3: "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762169494/PS3_vo7qfs.png",
    ps2: "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762169496/PS2_kuqhkc.png",
    ps1: "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762169483/PS_f86sfs.png",
};

export default function Games() {
    return (
        <GuestLayout>
            <div className="min-h-screen bg-black text-white">
                <div className="text-center mb-10 pt-6"></div>

                <section className="relative text-center min-h-[70vh] flex justify-center items-center overflow-hidden rounded-2xl mx-auto w-full max-w-7xl">
                    <img
                        src="https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762157032/1_wxzdxp.jpg"
                        alt="Hero Background"
                        className="absolute inset-0 w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                </section>

                <div className="container mx-auto px-6 mt-16 text-black mb-12">
                    <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
                        {games.map((game, index) => {
                            const platformKey = game.platform
                                ?.trim()
                                .toLowerCase();
                            const platformLogo = logos[platformKey] || null;

                            return (
                                <article
                                    key={game.id}
                                    style={{
                                        animationDelay: `${index * 0.15}s`,
                                    }}
                                    className="rounded-xl shadow-lg overflow-hidden transition w-[400px] h-[550px] flex flex-col justify-between transform duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(0,255,255,0.4)] animate-fadeInUp"
                                >
                                    <div className="flex-1 overflow-hidden">
                                        <img
                                            src={game.image}
                                            alt={game.platform}
                                            className="w-full h-[550px] object-cover"
                                        />
                                    </div>
                                    <div className="bg-[#007BE5] flex justify-center items-center gap-2 py-2">
                                        {platformLogo ? (
                                            <img
                                                src={platformLogo}
                                                alt={game.platform}
                                                className="h-5 md:h-6 object-contain"
                                            />
                                        ) : (
                                            <span className="text-sm font-medium text-white">
                                                Platform Tidak Dikenali
                                            </span>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>

                <style>{`
                    @keyframes fadeInUp {
                        0% { opacity: 0; transform: translateY(30px); }
                        100% { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fadeInUp {
                        animation: fadeInUp 0.8s ease-out forwards;
                    }
                `}</style>
            </div>
        </GuestLayout>
    );
}
