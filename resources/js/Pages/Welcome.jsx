import { Head, Link } from "@inertiajs/react";

export default function Welcome({ auth }) {
    const games = [
        {
            id: 1,
            title: "PlayStation 1",
            image: "/images/ps1.jpg",
            description: "Classic PS1 console with nostalgic retro games.",
        },
        {
            id: 2,
            title: "PlayStation 2",
            image: "/images/ps2.jpg",
            description: "Legendary PS2 with multiplayer favorites.",
        },
        {
            id: 3,
            title: "PlayStation 3",
            image: "/images/ps3.jpg",
            description: "HD experience with timeless PlayStation hits.",
        },
        {
            id: 4,
            title: "PlayStation 4",
            image: "/images/ps4.jpg",
            description: "Modern console for high-quality gaming rental.",
        },
        {
            id: 5,
            title: "Nintendo Switch",
            image: "/images/switch.jpg",
            description: "Portable console for fun on-the-go sessions.",
        },
        {
            id: 6,
            title: "Xbox 360",
            image: "/images/xbox.jpg",
            description: "Classic Xbox titles for adrenaline-filled gameplay.",
        },
    ];

    return (
        <>
            <Head title="Rentalin" />
            <div className="min-h-screen bg-black text-white">
                {/* HEADER */}
                <header className="flex items-center justify-between px-10 py-6 bg-black/60 backdrop-blur-md border-b border-neutral-800">
                    <div className="flex items-center space-x-3">
                        <img
                            src="/logo.png"
                            alt="Rentalin"
                            className="w-8 h-8"
                        />
                        <h1 className="text-xl font-bold tracking-widest uppercase">
                            Rental<span className="text-red-500">in</span>
                        </h1>
                    </div>

                    <nav className="flex space-x-8 text-sm uppercase tracking-wider">
                        <a
                            href="#"
                            className="hover:text-red-500 transition-colors"
                        >
                            Games
                        </a>
                        <a
                            href="#"
                            className="hover:text-red-500 transition-colors"
                        >
                            News
                        </a>
                        <a
                            href="#"
                            className="hover:text-red-500 transition-colors"
                        >
                            Store
                        </a>
                        <a
                            href="#"
                            className="hover:text-red-500 transition-colors"
                        >
                            Support
                        </a>
                    </nav>

                    <div>
                        {auth.user ? (
                            <Link
                                href={route("dashboard")}
                                className="bg-red-600 px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={route("login")}
                                className="bg-red-600 px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition"
                            >
                                Get Started
                            </Link>
                        )}
                    </div>
                </header>

                {/* HERO SECTION */}
                <section
                    className="relative flex flex-col items-center justify-center text-center h-[80vh] bg-cover bg-center"
                    style={{
                        backgroundImage: "url('/images/hero-bg.jpg')",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                    <div className="relative z-10">
                        <h2 className="text-5xl md:text-7xl font-extrabold mb-4">
                            Discover. Play.{" "}
                            <span className="text-red-500">Rent.</span>
                        </h2>
                        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                            Experience legendary consoles and classic games —
                            all in one place.
                        </p>
                        <div className="mt-8">
                            <Link
                                href={route("register")}
                                className="bg-red-600 px-6 py-3 text-lg rounded-md font-semibold hover:bg-red-700 transition"
                            >
                                Explore Library
                            </Link>
                        </div>
                    </div>
                </section>

                {/* GAME LIBRARY */}
                <section className="px-10 py-20 bg-gradient-to-b from-black to-neutral-900">
                    <h3 className="text-3xl font-bold mb-10 tracking-wide uppercase">
                        Game Library
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {games.map((game) => (
                            <div
                                key={game.id}
                                className="group relative rounded-xl overflow-hidden bg-neutral-900 hover:scale-105 transition-transform duration-300"
                            >
                                <img
                                    src={game.image}
                                    alt={game.title}
                                    className="w-full h-64 object-cover opacity-80 group-hover:opacity-100 transition"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h4 className="text-xl font-bold">
                                        {game.title}
                                    </h4>
                                    <p className="text-gray-400 text-sm mt-1">
                                        {game.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="border-t border-neutral-800 py-6 text-center text-gray-500 text-sm bg-black/80">
                    <p>
                        © {new Date().getFullYear()} Rentalin — All rights
                        reserved. Inspired by Rockstar Games.
                    </p>
                </footer>
            </div>
        </>
    );
}
