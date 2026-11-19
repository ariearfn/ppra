import type { KonfirmasiItem } from '../types'

const k = (id: string, pertanyaan: string, ditanyakanKe: string): KonfirmasiItem => ({
  id,
  pertanyaan,
  ditanyakanKe,
  status: 'Perlu konfirmasi',
  jawaban: '',
})

export const DEFAULT_KONFIRMASI: KonfirmasiItem[] = [
  k('kf-layanan', 'Jenis layanan RSCC: rawat jalan, rawat inap, ICU, IGD, operasi/bedah, dan layanan lainnya.', 'Manajemen / Direktur'),
  k('kf-tt', 'Jumlah tempat tidur dan unit pelayanan yang relevan.', 'Manajemen / Rekam Medis'),
  k('kf-lab', 'Apakah laboratorium RSCC dapat melakukan kultur dan uji kepekaan sendiri atau bekerja sama dengan laboratorium rujukan.', 'Laboratorium'),
  k('kf-data-ab', 'Apakah tersedia data penggunaan antibiotik yang dapat dianalisis.', 'Farmasi'),
  k('kf-antibiogram', 'Apakah sudah pernah dibuat antibiogram rumah sakit.', 'Laboratorium / Ketua sebelumnya'),
  k('kf-panduan', 'Apakah sudah ada panduan antibiotik empiris dan formularium yang berlaku.', 'Farmasi / Komite Medik'),
  k('kf-sdm', 'Apakah ada dokter/farmasis yang memiliki kompetensi atau pelatihan terkait PPRA/antimicrobial stewardship.', 'Komite Medik / Farmasi / SDM'),
  k('kf-sk', 'Struktur dan SK Komite PPRA yang berlaku (termasuk penetapan ketua baru).', 'Direktur / Sekretariat'),
  k('kf-2026', 'Kegiatan PPRA 2026 yang benar-benar telah dilaksanakan.', 'Ketua sebelumnya / Sekretariat'),
  k('kf-anggaran', 'Besaran anggaran dan mekanisme persetujuan anggaran 2027.', 'Direktur / Keuangan'),
  k('kf-dinkes', 'Pembinaan, format pelaporan, kegiatan surveilans, dan mekanisme koordinasi dengan Dinas Kesehatan Kabupaten Sleman.', 'Dinas Kesehatan Kab. Sleman'),
  k('kf-lokus', 'Apakah RSCC ditetapkan sebagai lokus surveilans AMR menurut Kepdirjen Keslan HK.02.02/D/1476/2026 (menentukan kewajiban lapor data AMR paling lambat 30 April, PME, dan antibiogram kumulatif).', 'Dinkes Kab. Sleman / Pusat Koordinasi Nasional'),
  k('kf-se44930', 'Naskah resmi SE Dirjen Yankes HK.02.02/D/44930/2024: tenggat laporan PPRA (31 Agustus menurut salinan sekunder), kanal pelaporan (SIRS Online atau mutufasyankes/ppra), dan sanksi.', 'Dinkes Kab. Sleman / Ditjen Kesehatan Lanjutan / bagian SIRS RS'),
  k('kf-3610', 'Naskah resmi Kepdirjen Keslan HK.02.02/D/3610/2025 tentang Pedoman Penyusunan Antibiogram di RS (belum ditemukan di JDIH).', 'JDIH Kemenkes / Ditjen Kesehatan Lanjutan'),
  k('kf-pmk6', 'Pedoman teknis komite RS sesuai Permenkes 6/2026 Pasal 50(5), yang dapat memengaruhi bentuk Komite PPRA.', 'JDIH Kemenkes / Manajemen'),
  k('kf-tanggal', 'Tanggal pasti presentasi progress kepada Direktur (target: awal Desember 2026).', 'Sekretariat Direktur'),
]
