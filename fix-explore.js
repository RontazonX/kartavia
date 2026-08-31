const fs = require('fs');
const idStr = fs.readFileSync('src/i18n/dictionaries/id.json', 'utf8');
const idJson = JSON.parse(idStr);
idJson.explore = {
  title: 'Jelajahi Destinasi',
  subtitle: 'Temukan permata tersembunyi di Indonesia',
  searchPlaceholder: 'Cari destinasi wisata...',
  bookNow: 'Pesan Sekarang',
  reviews: 'Ulasan',
  all: 'Semua',
  backToHome: 'Kembali ke Beranda',
  noDestinations: 'Tidak ada destinasi yang ditemukan.',
  noDestinationsIn: 'Tidak ada destinasi yang ditemukan di',
  viewDetail: 'Lihat Detail',
  searchBar: {
    whereTo: 'Ke mana?',
    selectDates: 'Pilih tanggal',
    guest: 'Tamu',
    guests: 'Tamu',
    ages: 'Usia 2 tahun ke atas',
    apply: 'Terapkan',
    searchBtn: 'Cari'
  },
  sidebar: {
    filters: 'Filter',
    clearAll: 'Hapus Semua',
    ecoFriendly: 'Hanya Tampilkan Tempat Ramah Lingkungan 🍃',
    categories: 'Kategori',
    allDestinations: 'Semua Destinasi',
    attraction: 'Atraksi Wisata',
    tour: 'Tur',
    rental: 'Penyewaan',
    region: 'Wilayah',
    allRegions: 'Semua Wilayah',
    priceRange: 'Rentang Harga (Rp)',
    min: 'Min',
    max: 'Maks',
    minRating: 'Rating Minimum'
  },
  guides: {
    title: 'Pemandu Lokal Tersedia',
    subtitle: 'Buat perjalanan Anda lebih berkesan dengan pemandu lokal profesional.'
  },
  wasteReport: {
    title: 'Lapor Sampah Bersama',
    loginPrompt: 'Bantu kami menjaga kebersihan tempat ini. Silakan masuk untuk melaporkan sampah atau fasilitas yang kotor.',
    loginBtn: 'Masuk untuk Lapor',
    successTitle: 'Laporan Terkirim!',
    successDesc: 'Terima kasih atas kepedulian Anda. Laporan Anda telah diteruskan ke pengelola.',
    sendAnother: 'Kirim Laporan Lain',
    subtitle: 'Laporkan fasilitas kotor atau sampah berserakan',
    photoLabel: 'Foto Kondisi Saat Ini',
    changePhoto: 'Ubah Foto',
    uploadPrompt: 'Ketuk untuk mengunggah foto',
    uploadSize: 'JPG, PNG (Maks 5MB)',
    descLabel: 'Deskripsi Laporan',
    descPlaceholder: 'Contoh: Tempat sampah di area toilet umum penuh...',
    submitBtn: 'Kirim Laporan',
    submitting: 'Mengirim...',
    errorSize: 'Ukuran file maksimal adalah 5MB',
    errorGeneric: 'Terjadi kesalahan saat mengunggah. Coba gambar yang lebih kecil.'
  },
  card: {
    crowded: 'PADAT',
    medium: 'SEDANG',
    low: 'SEPI',
    open: 'Buka',
    closed: 'Tutup',
    reviews: 'ulasan',
    new: 'Baru',
    natureDesc: 'Alam yang damai',
    cultureDesc: 'Spot foto eksklusif',
    popularDesc: 'Destinasi populer',
    noImage: 'Tidak ada gambar'
  },
  searchResults: 'Hasil pencarian untuk "{q}"',
  found: 'ditemukan',
  noResultsTitle: 'Tidak ada hasil yang ditemukan',
  noResultsDesc: 'Coba sesuaikan filter atau kata kunci pencarian Anda.',
  clearAllFilters: 'Hapus semua filter'
};
fs.writeFileSync('src/i18n/dictionaries/id.json', JSON.stringify(idJson, null, 2));
