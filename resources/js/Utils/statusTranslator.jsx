import React from "react";

/**
 * Centralized Status Translator & Badge Utility
 * Acts as the single source of truth for status mapping (DB-aligned)
 */

export const translateStatus = (status) => {
    if (!status) return "-";

    const map = {
        // TRANSACTION STATUS
        pending_payment: "Menunggu Pembayaran",
        grace_period_active: "Menunggu Kedatangan",
        checked_in: "Bermain",
        completed: "Selesai",
        cancelled: "Dibatalkan",
        cancelled_expired: "Tidak Datang",

        // PAYMENT STATUS
        waiting: "Menunggu Pembayaran",
        success: "Pembayaran Berhasil",
        failed: "Gagal Pembayaran",
        refunded: "Dana Dikembalikan",

        // PAYLATER INVOICE STATUS
        unpaid: "Belum Dibayar",
        paid: "Sudah Dibayar",
        overdue: "Sudah Jatuh Tempo",

        // RENTAL UNIT STATUS
        available: "Tersedia",
        booked: "Dipesan",
        in_use: "Sedang Digunakan",
        maintenance: "Perawatan",

        // GENERIC / FALLBACK
        active: "Aktif",
        inactive: "Tidak Aktif",
    };

    return map[status] || status.replace(/_/g, " ");
};

export const getStatusBadge = (status) => {
    const colors = {
        // POSITIVE
        success: "bg-green-100 text-green-800",
        completed: "bg-green-100 text-green-800",
        paid: "bg-green-100 text-green-800",
        active: "bg-green-100 text-green-800",
        available: "bg-green-100 text-green-800",

        // WARNING
        pending_payment: "bg-yellow-100 text-yellow-800",
        grace_period_active: "bg-yellow-100 text-yellow-800",
        waiting: "bg-yellow-100 text-yellow-800",
        unpaid: "bg-yellow-100 text-yellow-800",

        // NEGATIVE
        cancelled: "bg-red-100 text-red-800",
        cancelled_expired: "bg-red-200 text-red-900",
        failed: "bg-red-100 text-red-800",
        overdue: "bg-red-100 text-red-800",
        inactive: "bg-red-100 text-red-800",

        // NEUTRAL
        checked_in: "bg-blue-100 text-blue-800",
        booked: "bg-blue-100 text-blue-800",
        in_use: "bg-blue-100 text-blue-800",
        maintenance: "bg-blue-100 text-blue-800",
    };

    return colors[status] || "bg-gray-100 text-gray-800";
};

export const StatusBadge = ({ status }) => {
    const label = translateStatus(status);
    const classes = getStatusBadge(status);
    return (
        <span
            className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${classes}`}
        >
            {label}
        </span>
    );
};
