export const formatCurrency = (amount) => {
    if (amount == null || isNaN(amount)) return "0";
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return Math.floor(numAmount).toLocaleString("id-ID");
};
