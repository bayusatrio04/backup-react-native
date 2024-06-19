export const getCurrentFormatDate = () => {
    date = new Date(); // Mengembalikan tanggal hari ini

    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};