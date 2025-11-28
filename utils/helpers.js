module.exports = {
    formatPrice: (price) => {
        return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(price);
    },

    truncateText: (text, length = 100) => {
        if (text.length > length) return text.substring(0, length) + "...";
        return text;
    },

    // Add more helpers as needed
};
