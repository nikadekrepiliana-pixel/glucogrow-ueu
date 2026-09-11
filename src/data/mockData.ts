import { ArticleItem, ChildRecord, NutritionItem } from '../types';

export const INITIAL_CHILDREN: ChildRecord[] = [
  {
    id: 1,
    name: "Aisyah Putri",
    dob: "2023-07-20",
    age: 14,
    gender: "P",
    height: 77.5,
    weight: 9.3,
    status: "Normal",
    notes: "Anak lincah dan nafsu makan baik. Mulai makan menu keluarga lumat.",
    history: [
      { date: "2023-11-20", age: 4, h: 62.0, w: 6.4, status: "Normal" },
      { date: "2024-03-20", age: 8, h: 69.5, w: 7.9, status: "Normal" },
      { date: "2024-06-20", age: 11, h: 74.0, w: 8.7, status: "Normal" },
      { date: "2024-09-20", age: 14, h: 77.5, w: 9.3, status: "Normal" },
    ],
  },
  {
    id: 2,
    name: "Budi Santoso",
    dob: "2023-05-15",
    age: 16,
    gender: "L",
    height: 73.0,
    weight: 8.4,
    status: "Risiko",
    notes: "Tinggi badan berada di garis -2 SD kurva WHO. Perlu tambahan protein hewani harian.",
    history: [
      { date: "2023-10-15", age: 5, h: 62.5, w: 6.8, status: "Normal" },
      { date: "2024-02-15", age: 9, h: 67.5, w: 7.4, status: "Risiko" },
      { date: "2024-05-15", age: 12, h: 70.0, w: 7.9, status: "Risiko" },
      { date: "2024-09-15", age: 16, h: 73.0, w: 8.4, status: "Risiko" },
    ],
  },
  {
    id: 3,
    name: "Rizky Ramadhan",
    dob: "2022-11-10",
    age: 22,
    gender: "L",
    height: 76.5,
    weight: 9.1,
    status: "Stunting",
    notes: "Terindikasi stunting berat. Sudah dirujuk ke Puskesmas untuk PMT Pemulihan.",
    history: [
      { date: "2023-09-10", age: 10, h: 68.0, w: 7.6, status: "Risiko" },
      { date: "2024-03-10", age: 16, h: 72.0, w: 8.3, status: "Stunting" },
      { date: "2024-09-10", age: 22, h: 76.5, w: 9.1, status: "Stunting" },
    ],
  },
  {
    id: 4,
    name: "Siti Khalisa",
    dob: "2024-01-08",
    age: 8,
    gender: "P",
    height: 68.5,
    weight: 8.0,
    status: "Normal",
    notes: "Sudah mulai MPASI usia 6 bulan, suka puree labu dan telur.",
    history: [
      { date: "2024-03-08", age: 2, h: 56.5, w: 5.1, status: "Normal" },
      { date: "2024-06-08", age: 5, h: 63.0, w: 6.9, status: "Normal" },
      { date: "2024-09-08", age: 8, h: 68.5, w: 8.0, status: "Normal" },
    ],
  },
];

export const ARTICLES_DATA: ArticleItem[] = [
  {
    id: 1,
    title: "1.000 Hari Pertama Kehidupan (HPK): Periode Emas Cegah Stunting",
    category: "Perkembangan",
    img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=700&auto=format&fit=crop",
    summary: "Fase krusial sejak masa kehamilan 270 hari hingga anak usia 2 tahun (730 hari) yang menentukan kecerdasan dan fisik anak.",
    content: `Periode **1.000 Hari Pertama Kehidupan (1000 HPK)** merupakan jendela kesempatan terbaik dalam membentuk fondasi otak, sistem metabolisme, serta pertumbuhan tinggi badan anak. Gangguan gizi pada periode ini bersifat permanen dan sulit diperbaiki setelah anak berusia di atas 2 tahun.

**Mengapa 1000 HPK Begitu Penting?**
1. **Perkembangan Otak Cepat:** Hingga 80% volume otak manusia terbentuk di masa ini. Kekurangan zat besi dan zink dapat menurunkan IQ anak hingga 10-15 poin di masa depan.
2. **Kekebalan Tubuh:** Organ imunitas seperti timus dan kelenjar limfoid membutuhkan protein dan vitamin A agar anak tidak mudah sakit demam atau diare berulang.
3. **Pencegahan Penyakit Metabolik:** Anak yang mengalami stunting memiliki risiko lebih tinggi terkena diabetes dan penyakit kardiovaskular saat dewasa.

**Tahapan Utama:**
- **Masa Kehamilan (270 hari):** Ibu hamil wajib mengonsumsi tablet tambah darah minimal 90 butir, asupan asam folat, dan protein tinggi.
- **Usia 0-6 Bulan:** ASI Eksklusif tanpa air putih atau makanan lain.
- **Usia 6-24 Bulan:** MPASI bergizi seimbang dengan fokus utama protein hewani dan melanjutkan ASI hingga 2 tahun.`,
    readTime: "4 min",
    source: "Kemenkes RI & WHO",
    tags: ["1000 HPK", "Golden Age", "Stunting", "Perkembangan"],
  },
  {
    id: 2,
    title: "Panduan MPASI Berkualitas Tinggi: Prioritas Protein Hewani",
    category: "Nutrisi",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=700&auto=format&fit=crop",
    summary: "Standar terbaru WHO & IDAI menegaskan bahwa telur, ikan kembung, hati ayam, dan daging adalah kunci utama pencegahan gagal tumbuh.",
    content: `Pemberian Makanan Pendamping ASI (MPASI) dimulai tepat saat anak berusia 6 bulan. Pada usia ini, kebutuhan gizi balita meningkat drastis sementara produksi ASI ibu saja sudah tidak mencukupi 100% kebutuhan harian zat besi dan kalori.

**Prinsip 4 Bintang MPASI WHO:**
1. **Tepat Waktu (Timely):** Dimulai saat genap 6 bulan ketika refleks menelan dan otot leher bayi sudah siap.
2. **Adekuat (Adequate):** Mengandung energi, protein hewani, dan mikronutrien lengkap.
3. **Aman & Bersih (Safe):** Menjaga higienitas saat menyiapkan, memasak, dan menyajikan makanan.
4. **Diberikan dengan Cara yang Benar (Responsive Feeding):** Bersabar, mengenali sinyal lapar dan kenyang bayi, tanpa paksaan.

**Pilihan Protein Hewani Terjangkau:**
- **Telur Ayam:** 1 butir telur mengandung 6 gram protein bermutu tinggi dan kolin untuk memori otak.
- **Ikan Kembung:** Mengandung Omega-3 (DHA & EPA) lebih tinggi daripada ikan salmon dengan harga yang jauh lebih ramah keluarga.
- **Hati Ayam:** Sumber zat besi hewani terbaik yang sangat cepat diserap tubuh bayi untuk mencegah anemia.`,
    readTime: "5 min",
    source: "WHO & IDAI",
    tags: ["MPASI", "Protein Hewani", "Zat Besi", "Nutrisi Anak"],
  },
  {
    id: 3,
    title: "Inisiasi Menyusu Dini (IMD) dan ASI Eksklusif 6 Bulan",
    category: "Parenting",
    img: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=700&auto=format&fit=crop",
    summary: "Pemberian ASI dalam satu jam pertama kelahiran menurunkan angka kematian bayi dan membentuk imunitas kolostrum yang kaya antibodi.",
    content: `Inisiasi Menyusu Dini (IMD) dilakukan dengan meletakkan bayi tengkurap di dada ibu segera setelah lahir dan membiarkannya mencari puting susu secara mandiri selama minimal 1 jam.

**Manfaat Luar Biasa Kolostrum:**
Kolostrum adalah cairan kuning kental yang keluar pada hari 1-3 pasca persalinan. Sering disebut sebagai "vaksin pertama bayi" karena sarat imunoglobulin A (IgA) yang melapisi usus bayi dari serangan bakteri patogen.

**Kunci Sukses ASI Eksklusif:**
- Tidak memberikan susu formula, teh, maupun air putih sebelum usia 6 bulan.
- Posisikan pelekatan mulut bayi dengan benar (areola bagian bawah lebih banyak masuk ke mulut bayi).
- Pompa atau susui sesuai permintaan bayi (*on-demand*) agar produksi ASI terus terjaga melimpah.`,
    readTime: "3 min",
    source: "Pedoman Kemenkes RI",
    tags: ["IMD", "ASI Eksklusif", "Kolostrum", "Ibu & Bayi"],
  },
  {
    id: 4,
    title: "Jadwal Imunisasi Dasar Lengkap & Perlindungan dari Infeksi",
    category: "Imunisasi",
    img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=700&auto=format&fit=crop",
    summary: "Infeksi berulang seperti diare, pneumonia, dan campak adalah pemicu utama stunting sekunder. Lindungi anak dengan vaksinasi lengkap.",
    content: `Salah satu penyebab terbesar balita mengalami gagal tumbuh (stunting) adalah infeksi berulang (*vicious cycle* infeksi dan malnutrisi). Ketika anak sering sakit diare atau radang paru (pneumonia), zat gizi yang dimakan habis terpakai untuk melawan penyakit, bukan untuk pertumbuhan fisik dan otak.

**Vaksin Wajib Program Nasional:**
- **0 Bulan:** Hepatitis B (HB-0) segera setelah lahir.
- **1 Bulan:** BCG (mencegah TBC parah) dan Polio 1.
- **2, 3, 4 Bulan:** DPT-HB-Hib, Polio Tetes, PCV (mencegah pneumonia), dan Rotavirus (mencegah diare cair akut).
- **9 Bulan:** Campak-Rubella (MR) dan IPV.
- **18 Bulan:** Booster DPT-HB-Hib dan Campak-Rubella lanjutan.

Pastikan catatan imunisasi selalu dibawa dan diperiksa setiap kali berkunjung ke Posyandu atau Fasilitas Pelayanan Kesehatan.`,
    readTime: "6 min",
    source: "Kemenkes RI",
    tags: ["Imunisasi", "Vaksin", "Posyandu", "Pencegahan Penyakit"],
  },
];

export const IMMUNIZATION_LIST = [
  { name: "Hepatitis B (HB-0)", age: "0 Bulan", mandatory: true, desc: "Diberikan dalam 24 jam pertama kelahiran" },
  { name: "BCG", age: "1 Bulan", mandatory: true, desc: "Mencegah tuberkulosis milier dan meningitis TBC" },
  { name: "Polio Tetes 1", age: "1 Bulan", mandatory: true, desc: "Mencegah kelumpuhan akibat virus polio" },
  { name: "DPT-HB-Hib 1", age: "2 Bulan", mandatory: true, desc: "Mencegah difteri, pertusis, tetanus, hepatitis B, & pneumonia" },
  { name: "Polio Tetes 2", age: "2 Bulan", mandatory: true, desc: "Dosis kedua vaksin polio oral" },
  { name: "PCV 1 & Rotavirus 1", age: "2 Bulan", mandatory: true, desc: "Mencegah pneumonia radang paru dan diare rotavirus" },
  { name: "DPT-HB-Hib 2", age: "3 Bulan", mandatory: true, desc: "Lanjutan perlindungan difteri dan pertusis" },
  { name: "Polio Tetes 3 & Rotavirus 2", age: "3 Bulan", mandatory: true, desc: "Dosis lanjutan untuk imunitas saluran cerna" },
  { name: "DPT-HB-Hib 3 & IPV", age: "4 Bulan", mandatory: true, desc: "Lanjutan lengkap ditambah polio suntik" },
  { name: "Campak-Rubella (MR) 1", age: "9 Bulan", mandatory: true, desc: "Mencegah campak dan sindrom rubella kongenital" },
  { name: "PCV 3 Booster", age: "12 Bulan", mandatory: false, desc: "Penguat perlindungan saluran napas balita" },
  { name: "DPT-HB-Hib Lanjutan", age: "18 Bulan", mandatory: true, desc: "Booster usia batita untuk daya tahan jangka panjang" },
];

export const NUTRITION_FOODS: NutritionItem[] = [
  {
    name: "Hati Ayam & Daging Sapi",
    desc: "Zat Besi Heme Tinggi",
    category: "protein",
    portion: "30-50 gram per porsi",
    benefit: "Mencegah anemia defisiensi besi dan mendukung pertumbuhan sel otak secara pesat.",
    sources: ["Hati ayam kampung", "Daging sapi cincang", "Hati sapi"],
  },
  {
    name: "Telur Ayam & Bebek",
    desc: "Protein Sempurna & Kolin",
    category: "protein",
    portion: "1 butir per hari",
    benefit: "Nilai biologi protein 100%, mudah dicerna dan merangsang pelepasan hormon pertumbuhan (IGF-1).",
    sources: ["Telur ayam ras", "Telur bebek", "Telur puyuh"],
  },
  {
    name: "Ikan Kembung & Ikan Gabus",
    desc: "Omega-3 (DHA) & Albumin",
    category: "protein",
    portion: "40-50 gram per porsi",
    benefit: "Ikan kembung kaya DHA melebihi salmon, ikan gabus mempercepat perbaikan jaringan sel.",
    sources: ["Ikan kembung banjar", "Ikan lele", "Ikan gabus lokal"],
  },
  {
    name: "Labu Kuning & Bayam",
    desc: "Beta Karoten & Vitamin A",
    category: "vitamins",
    portion: "1-2 sendok makan cincang",
    benefit: "Menjaga integritas epitel usus dan daya tahan mata dari rabun senja.",
    sources: ["Labu kuning parut", "Bayam hijau", "Wortel manis"],
  },
  {
    name: "Alpukat & Minyak Kelapa",
    desc: "Lemak Tambahan Sehat",
    category: "carbs",
    portion: "1 sdt minyak / 1/4 alpukat",
    benefit: "Menambah kepadatan kalori MPASI tanpa membuat anak cepat kenyang oleh air.",
    sources: ["Alpukat mentega", "Santan kelapa murni", "Minyak kelapa / butter"],
  },
];
