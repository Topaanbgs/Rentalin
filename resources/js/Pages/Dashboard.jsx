import Dropdown from "@/Components/Dropdown";
import { Head, Link, usePage } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <div className="min-h-screen bg-black text-gray-200">
            <Head title="Dasbor" />

            <nav className="bg-black border-b border-gray-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <Link
                                href={route("dashboard")}
                                className="flex-shrink-0"
                            >
                                <ApplicationLogo className="h-8 w-auto fill-current text-yellow-400" />
                            </Link>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    <Link
                                        href={route("dashboard")}
                                        className="text-yellow-400 font-bold px-3 py-2 rounded-md text-sm uppercase tracking-wider"
                                    >
                                        Dasbor
                                    </Link>
                                    <Link
                                        href="#"
                                        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wider"
                                    >
                                        Pemesanan Saya
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-x-2 rounded-full bg-gray-900 border border-gray-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800 transition">
                                        <span>{user.name}</span>
                                        <div className="h-6 w-6 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-xs">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content
                                    align="right"
                                    width="48"
                                    contentClasses="bg-gray-900 border border-gray-700 shadow-lg"
                                >
                                    <div className="px-4 py-3 border-b border-gray-700">
                                        <p className="text-sm font-medium text-white">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {user.email}
                                        </p>
                                    </div>
                                    <Dropdown.Link
                                        href={route("profile.edit")}
                                        className="text-gray-300 hover:bg-gray-800 hover:text-white"
                                    >
                                        Profil
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="text-red-400 hover:bg-red-500 hover:text-white w-full text-left"
                                    >
                                        Keluar
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </nav>

            <header className="bg-gray-900 shadow-lg shadow-black/20">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-white uppercase">
                        Dasbor
                    </h1>
                </div>
            </header>

            <main>
                <div className="mx-auto max-w-7xl py-12 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-black border border-gray-800 shadow-lg shadow-black/20">
                        <div className="p-6 md:p-10 text-white">
                            <h2 className="text-2xl font-bold text-yellow-400 mb-2 uppercase tracking-wide">
                                Selamat Datang, {user.name}!
                            </h2>
                            <p className="text-gray-300 mb-8 max-w-2xl">
                                Siap untuk bermain? Lihat unit yang tersedia dan
                                mulai sesi Anda berikutnya.
                            </p>
                            <Link
                                href="#"
                                className="inline-block bg-yellow-400 text-black px-10 py-3 text-sm font-bold uppercase tracking-wider hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-400/10"
                            >
                                Pesan Sekarang
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
