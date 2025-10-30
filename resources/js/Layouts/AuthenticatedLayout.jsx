import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import {
    LayoutDashboard,
    Gamepad2,
    Receipt,
    Users,
    Menu,
    X,
    FileText,
} from "lucide-react";

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation =
        user.role === "staff"
            ? [
                  {
                      name: "Dashboard",
                      href: "admin.dashboard",
                      icon: LayoutDashboard,
                  },
                  {
                      name: "Unit Rental",
                      href: "admin.units.index",
                      icon: Gamepad2,
                      match: "admin.units.*",
                  },
                  {
                      name: "Transaksi",
                      href: "admin.transactions.index",
                      icon: Receipt,
                      match: "admin.transactions.*",
                  },
                  {
                      name: "Members",
                      href: "admin.members.index",
                      icon: Users,
                      match: "admin.members.*",
                  },
                  {
                      name: "Laporan Keuangan",
                      href: "admin.reports.index",
                      icon: FileText,
                      match: "admin.reports.*",
                  },
              ]
            : [{ name: "Dasbor", href: "dashboard", icon: LayoutDashboard }];

    const isActive = (item) => {
        return route().current(item.match || item.href);
    };

    const translateRole = (role) => {
        if (role === "staff") return "Staf";
        if (role === "admin") return "Admin";
        return "Anggota";
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar Desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-r from-[#0066CC] to-[#0052A3] px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                        <Link href="/">
                            <ApplicationLogo className="h-auto w-auto fill-white" />
                        </Link>
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <ul
                            role="list"
                            className="flex flex-1 flex-col gap-y-7"
                        >
                            <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {navigation.map((item) => {
                                        const Icon = item.icon;
                                        const active = isActive(item);
                                        return (
                                            <li key={item.name}>
                                                <Link
                                                    href={route(item.href)}
                                                    className={`
                                                        group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold
                                                        transition-all duration-200
                                                        ${
                                                            active
                                                                ? "bg-white text-blue-600 shadow-lg"
                                                                : "text-white hover:bg-white/20"
                                                        }
                                                    `}
                                                >
                                                    <Icon
                                                        className={`h-5 w-5 shrink-0 ${
                                                            active
                                                                ? "text-blue-600"
                                                                : "text-white"
                                                        }`}
                                                    />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Mobile Sidebar */}
            {sidebarOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-gray-900/80 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-r from-[#0066CC] to-[#0052A3] lg:hidden">
                        <div className="flex h-16 items-center justify-between px-6">
                            <Link href="/">
                                <ApplicationLogo className="h-8 w-auto fill-white" />
                            </Link>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="text-white"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <nav className="mt-5 px-4">
                            <ul role="list" className="space-y-1">
                                {navigation.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item);
                                    return (
                                        <li key={item.name}>
                                            <Link
                                                href={route(item.href)}
                                                className={`
                                                    group flex gap-x-3 rounded-md p-3 text-sm font-semibold
                                                    ${
                                                        active
                                                            ? "bg-white text-blue-600"
                                                            : "text-white hover:bg-white/20"
                                                    }
                                                `}
                                                onClick={() =>
                                                    setSidebarOpen(false)
                                                }
                                            >
                                                <Icon className="h-5 w-5" />
                                                {item.name}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>
                    </div>
                </>
            )}

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Top Navbar */}
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="h-6 w-px bg-gray-200 lg:hidden" />

                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                        <div className="flex flex-1 items-center">
                            {header && (
                                <h1 className="text-xl font-semibold text-gray-900">
                                    {header}
                                </h1>
                            )}
                        </div>
                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

                            {/* Profile Dropdown */}
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-x-3 rounded-full bg-gradient-to-r from-[#0066CC] to-[#0052A3] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition shadow-sm">
                                        <span className="hidden lg:inline">
                                            {user.name}
                                        </span>
                                        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-[#0066CC] font-bold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {user.email}
                                        </p>
                                        <span className="mt-1 inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700 capitalize">
                                            {translateRole(user.role)}
                                        </span>
                                    </div>
                                    <Dropdown.Link href={route("profile.edit")}>
                                        Pengaturan Profil
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="text-red-600"
                                    >
                                        Keluar
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <main className="py-8">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
