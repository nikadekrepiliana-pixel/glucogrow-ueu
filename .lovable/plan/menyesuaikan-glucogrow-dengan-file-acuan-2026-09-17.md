# Menyesuaikan GLUCOGROW dengan file acuan

## Tujuan
Menggunakan `index-2.html`, `style.css`, `javascript.js`, dan `glucogrow-cloud.js` yang dikirim sebagai acuan utama tampilan dan alur, sambil mempertahankan layanan GlucoBot AI yang sudah bekerja di project.

## Perubahan
- Menyamakan halaman utama, navigasi, modal login, dashboard, form pasien, detail pasien, riwayat kunjungan, imunisasi, dan tata letak dengan file acuan.
- Menggabungkan perilaku terbaru dari file acuan ke sistem aktif, bukan menimpa layanan AI server-side yang sudah ada.
- Mempertahankan panggilan GlucoBot melalui endpoint AI project saat ini, termasuk pilihan GPT/Gemini dan fallback yang sudah berjalan.
- Menyelesaikan akun Orang Tua otomatis saat anak dibuat, akses dua role yang terlihat, data anak khusus pemiliknya, serta tampilan Orang Tua yang hanya-baca.
- Menyimpan pemeriksaan, petugas, kunjungan, pertumbuhan, dan imunisasi sebagai riwayat permanen yang saling terhubung.
- Menyatukan AI Nutrition menjadi rekomendasi personal berdasarkan data anak dengan tombol Refresh, menggunakan layanan AI yang sama.
- Memperbaiki hitungan usia berdasarkan tanggal lahir lengkap dan tanggal pemeriksaan/saat ini.
- Memastikan tombol detail, grafik, history, pemeriksaan, imunisasi, login, logout, dan navigasi berfungsi sesuai hak akses.

## Keamanan dan data
- Memastikan pembatasan akses Orang Tua berlaku di database, bukan hanya menyembunyikan tombol.
- Memastikan Tenaga Kesehatan dapat menambah dan memperbarui data sesuai kewenangannya.
- Menjaga data lama dan tidak mengganti riwayat ketika kunjungan baru disimpan.

## Pemeriksaan akhir
- Memeriksa halaman desktop dan ponsel.
- Menguji alur login Tenaga Kesehatan dan Orang Tua, data anak, pemeriksaan, imunisasi, history, grafik, serta logout/login ulang.
- Menguji GlucoBot dan AI Nutrition melalui layanan AI project yang ada.
- Memeriksa error halaman, tombol, permintaan data, dan akses langsung ke data anak lain.
