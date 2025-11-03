import React from "react";
import GuestLayout from "@/Layouts/GuestLayout";

const consoles = [
    {
        id: 1,
        name: "PlayStation 5",
        price: "Rp 15.000 / jam",
        bgImage:
            "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762188312/UNIT5_glkijj.png",
    },
    {
        id: 2,
        name: "PlayStation 4",
        price: "Rp 10.000 / jam",
        bgImage:
            "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762188312/UNIT4_cnhijs.png",
    },
    {
        id: 3,
        name: "PlayStation 3",
        price: "Rp 8.000 / jam",
        bgImage:
            "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762188312/UNIT3_e4szcj.png",
    },
    {
        id: 4,
        name: "PlayStation 2",
        price: "Rp 6.000 / jam",
        bgImage:
            "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762188313/UNIT2_dxkbwk.png",
    },
    {
        id: 5,
        name: "PlayStation 1",
        price: "Rp 4.000 / jam",
        bgImage:
            "https://res.cloudinary.com/dr2cuy2gx/image/upload/v1762188331/UNIT1_mryznk.png",
    },
];

export default function Consoles() {
    return (
        <GuestLayout>
            <div className="min-h-screen pb-20 relative overflow-hidden">
                <div className="container mx-auto px-6 text-center mb-12">
                </div>

                <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 justify-items-center">
                    {consoles.map((item, index) => (
                        <article
                            key={item.id}
                            style={{
                                animationDelay: `${index * 0.15}s`,
                                backgroundImage: `url(${item.bgImage})`,
                            }}
                            className="relative bg-center bg-cover rounded-2xl shadow-lg overflow-hidden w-[380px] h-[520px]
                       flex flex-col justify-end items-center p-5 border border-gray-700 group
                       transform transition duration-300 ease-out hover:-translate-y-2
                       hover:shadow-[0_0_25px_rgba(0,255,255,0.4)] animate-fadeInUp"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-70" />

                            <div className="relative z-10 text-center text-white mb-4">
                                <h2 className="text-xl font-bold tracking-wide drop-shadow-md">
                                    {item.name}
                                </h2>
                                <p className="text-sm text-cyan-100 font-medium mt-1">
                                    {item.price}
                                </p>
                            </div>
                            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#00D8C8] transition-all duration-500 shadow-[inset_0_0_25px_#00D8C8] opacity-0 group-hover:opacity-100" />
                        </article>
                    ))}
                </div>

                <style>{`
         @keyframes fadeInUp {
           from { opacity: 0; transform: translateY(20px); }
           to { opacity: 1; transform: translateY(0); }
         }
         .animate-fadeInUp {
           animation: fadeInUp 0.6s ease-out forwards;
         }
        `}</style>
            </div>
        </GuestLayout>
    );
}
