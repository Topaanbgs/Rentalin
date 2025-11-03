import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function GuestLayout({ children }) {
    const { auth } = usePage().props;
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: route("guest.games"), label: "Koleksi Game" },
        { href: route("guest.consoles"), label: "Daftar Konsol" },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-black text-gray-200">
            <nav
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                    scrolled
                        ? "bg-black/90 backdrop-blur-md shadow-lg"
                        : "bg-transparent"
                }`}
            >
                <div className="container mx-auto flex items-center justify-between px-6 py-4">
                    <Link
                        href={route("guest.index")}
                        className="group flex items-center"
                    >
                        <img
                            src="https://res.cloudinary.com/dr2cuy2gx/image/upload/v1761821347/Rentalin_Wordmark_zmblbi.png"
                            alt="Rentalin"
                            className="block h-7 w-auto group-hover:hidden"
                        />
                        <img
                            src="https://res.cloudinary.com/dr2cuy2gx/image/upload/v1761821348/Rentalin-Wordmark-White_nrgnwo.png"
                            alt="Rentalin"
                            className="hidden h-6 w-auto group-hover:block"
                        />
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="font-semibold tracking-wide text-white hover:text-[#00D8C8] transition"
                            >
                                {link.label}
                            </Link>
                        ))}

                        {auth.user ? (
                            <Link
                                href={route("dashboard")}
                                className="px-6 py-2 bg-gradient-to-r from-[#00D8C8] to-[#00B4E6] text-black font-bold rounded-lg hover:shadow-lg transition"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route("login")}
                                    className="px-6 py-2 bg-gradient-to-r from-[#00D8C8] to-[#00B4E6] text-black font-bold rounded-lg hover:shadow-lg transition"
                                >
                                    Masuk
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2 rounded-lg text-white hover:text-[#00D8C8] transition"
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {menuOpen && (
                    <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-gray-800">
                        <div className="flex flex-col items-center py-4 space-y-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    className="text-[#00D8C8] font-medium hover:text-white transition"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {auth.user ? (
                                <Link
                                    href={route("dashboard")}
                                    onClick={() => setMenuOpen(false)}
                                    className="px-6 py-2 bg-gradient-to-r from-[#00D8C8] to-[#00B4E6] text-black font-bold rounded-lg"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route("login")}
                                        onClick={() => setMenuOpen(false)}
                                        className="text-white font-medium hover:text-[#00D8C8] transition"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route("register")}
                                        onClick={() => setMenuOpen(false)}
                                        className="px-6 py-2 bg-gradient-to-r from-[#00D8C8] to-[#00B4E6] text-black font-bold rounded-lg"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            <main className="flex-1 pt-16">{children}</main>

            <footer className="bg-black text-gray-200 text-center py-4 border-t border-gray-800">
                <p>© 2025 RENTALIN - Solusi Rental PlayStation Digital</p>
            </footer>
        </div>
    );
}
