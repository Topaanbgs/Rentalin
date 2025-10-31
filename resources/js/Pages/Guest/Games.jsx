import React from "react";
import GuestLayout from "@/Layouts/GuestLayout";

const games = [
    {
        id: 1,
        platform: "PS5",
        image: "https://res.cloudinary.com/dutkpfai9/image/upload/v1761897448/unnamed_syyhw5.jpg",
    },
    {
        id: 2,
        platform: "PS4",
        image: "https://res.cloudinary.com/dutkpfai9/image/upload/v1761897448/unnamed_syyhw5.jpg",
    },
    {
        id: 3,
        platform: "PS5",
        image: "https://res.cloudinary.com/dutkpfai9/image/upload/v1761897448/unnamed_syyhw5.jpg",
    },
    {
        id: 4,
        platform: "PS5 / PS1",
        image: "https://res.cloudinary.com/dutkpfai9/image/upload/v1761897448/unnamed_syyhw5.jpg",
    },
    {
        id: 5,
        platform: "PS3 / PS2",
        image: "https://res.cloudinary.com/dutkpfai9/image/upload/v1761897448/unnamed_syyhw5.jpg",
    },
    {
        id: 6,
        platform: "PS5 / PS4",
        image: "https://res.cloudinary.com/dutkpfai9/image/upload/v1761897448/unnamed_syyhw5.jpg",
    },
    {
        id: 7,
        platform: "PS5",
        image: "https://res.cloudinary.com/dutkpfai9/image/upload/v1761897448/unnamed_syyhw5.jpg",
    },
    {
        id: 8,
        platform: "PS4",
        image: "https://res.cloudinary.com/dutkpfai9/image/upload/v1761897448/unnamed_syyhw5.jpg",
    },
    {
        id: 9,
        platform: "PS5",
        image: "https://res.cloudinary.com/dutkpfai9/image/upload/v1761897448/unnamed_syyhw5.jpg",
    },
    {
        id: 10,
        platform: "PS5 / PS1",
        image: "https://res.cloudinary.com/dutkpfai9/image/upload/v1761897448/unnamed_syyhw5.jpg",
    },
    {
        id: 11,
        platform: "PS3 / PS2",
        image: "https://res.cloudinary.com/dutkpfai9/image/upload/v1761897448/unnamed_syyhw5.jpg",
    },
    {
        id: 12,
        platform: "PS5 / PS4",
        image: "https://res.cloudinary.com/dutkpfai9/image/upload/v1761897448/unnamed_syyhw5.jpg",
    },
];

const logos = {
    ps5: "https://upload.wikimedia.org/wikipedia/commons/7/7a/PS5_logo.png",
    ps4: "https://upload.wikimedia.org/wikipedia/commons/8/87/PlayStation_4_logo_and_wordmark.svg",
    ps3: "https://upload.wikimedia.org/wikipedia/commons/0/05/PlayStation_3_logo_%282009%29.svg",
    ps2: "https://upload.wikimedia.org/wikipedia/commons/7/76/PlayStation_2_logo.svg",
    ps1: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Playstation_logo_colour.svg",
};

export default function Games() {
    return (
        <GuestLayout>
            <div className="min-h-screen bg-black text-white">
                <div className="text-center mb-10 pt-6">
                    <img
                        src="https://res.cloudinary.com/dr2cuy2gx/image/upload/v1761821347/Rentalin_Wordmark_zmblbi.png"
                        alt="Rentalin"
                        className="mx-auto w-64 md:w-80 drop-shadow-2xl"
                    />
                </div>

                <section className="relative text-center min-h-[70vh] flex justify-center items-center overflow-hidden rounded-2xl mx-auto w-full max-w-7xl">
                    <img
                        src="https://res.cloudinary.com/dutkpfai9/image/upload/v1761897448/unnamed_syyhw5.jpg"
                        alt="Hero Background"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                </section>

                <div className="container mx-auto px-6 mt-16 text-black">
                    <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
                        {games.map((game, index) => (
                            <article
                                key={game.id}
                                style={{ animationDelay: `${index * 0.15}s` }}
                                className="bg-white rounded-xl shadow-lg overflow-hidden transition w-[400px] h-[550px]
                                flex flex-col justify-between transform duration-300 ease-out hover:-translate-y-2
                                hover:shadow-[0_0_25px_rgba(0,255,255,0.4)] animate-fadeInUp"
                            >
                                <img
                                    src={game.image}
                                    alt={game.platform}
                                    className="w-full h-full object-cover"
                                />
                                <div className="bg-[#007BE5] flex justify-center items-center gap-2 py-2">
                                    {game.platform.includes("PS5") && (
                                        <img
                                            src={logos.ps5}
                                            alt="PS5"
                                            className="h-5 md:h-6 object-contain"
                                        />
                                    )}
                                    {game.platform.includes("PS4") && (
                                        <img
                                            src={logos.ps4}
                                            alt="PS4"
                                            className="h-5 md:h-6 object-contain"
                                        />
                                    )}
                                    {game.platform.includes("PS3") && (
                                        <img
                                            src={logos.ps3}
                                            alt="PS3"
                                            className="h-5 md:h-6 object-contain"
                                        />
                                    )}
                                    {game.platform.includes("PS2") && (
                                        <img
                                            src={logos.ps2}
                                            alt="PS2"
                                            className="h-5 md:h-6 object-contain"
                                        />
                                    )}
                                    {game.platform.includes("PS1") && (
                                        <img
                                            src={logos.ps1}
                                            alt="PS1"
                                            className="h-5 md:h-6 object-contain"
                                        />
                                    )}
                                </div>
                            </article>
                        ))}
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
