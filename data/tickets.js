// UYGULAMA 1: TEKNİK DESTEK / ARIZA TAKİP VERİLERİ
// Başlangıç için örnek kayıtlar (Test senaryoları için ID 101 mutlaka bulunmaktadır)

export const initialTickets = [
  {
    id: '101',
    baslik: 'Ağ Yazıcısı Kağıt Sıkışması',
    konum: 'Öğrenci İşleri - Zemin Kat',
    birim: 'Öğrenci İşleri',
    aciklama: 'HP LaserJet ağ yazıcısı sürekli kağıt sıkışma uyarısı veriyor ve çıktı kuyruğu kilitlenmiş durumda.',
    kategori: 'Yazıcı',
    oncelik: 'Yüksek',
    acil: true,
    durum: 'Bekliyor', // Bekliyor -> Turuncu
    adSoyad: 'Mehmet Demir',
    tarih: '27.10.2026 09:15',
  },
  {
    id: '102',
    baslik: 'Laboratuvar Bilgisayarı Açılmıyor',
    konum: 'Mühendislik Fakültesi - Lab 3 / Masa 14',
    birim: 'Bilgisayar Mühendisliği',
    aciklama: '14 numaralı bilgisayar güç tuşuna basıldığında bip sesi veriyor ve ekrana görüntü gelmiyor.',
    kategori: 'Bilgisayar',
    oncelik: 'Yüksek',
    acil: false,
    durum: 'İşlemde', // İşlemde -> Mavi
    adSoyad: 'Ayşe Kaya',
    tarih: '27.10.2026 10:00',
  },
  {
    id: '103',
    baslik: 'Eduroam Wi-Fi IP Alamama Hatası',
    konum: 'Merkez Kütüphane - 2. Kat Okuma Salonu',
    birim: 'Kütüphane ve Dokümantasyon',
    aciklama: 'Kütüphanenin doğu kanadındaki access point üzerinden eduroam ağına bağlanan cihazlara IP atanmıyor.',
    kategori: 'İnternet',
    oncelik: 'Orta',
    acil: false,
    durum: 'Çözüldü', // Çözüldü -> Yeşil
    adSoyad: 'Canan Çetin',
    tarih: '26.10.2026 16:40',
  },
  {
    id: '104',
    baslik: 'Projeksiyon Cihazı Renk Bozulması',
    konum: 'İktisadi İdari Bilimler - Amfi B',
    birim: 'Derslik Yönetimi',
    aciklama: 'Derslik projeksiyonu görüntüyü tamamen sarı tonlarda veriyor, VGA/HDMI kablosu gevşemiş olabilir.',
    kategori: 'Donanım',
    oncelik: 'Düşük',
    acil: false,
    durum: 'Bekliyor',
    adSoyad: 'Kemal Aksoy',
    tarih: '27.10.2026 11:10',
  },
  {
    id: '105',
    baslik: 'Öğrenci Bilgi Sistemi Giriş Hatası',
    konum: 'Rektörlük Binası - Bilgi İşlem',
    birim: 'Bilgi İşlem Daire Bşk.',
    aciklama: 'Kullanıcı şifre sıfırlama taleplerinde SMS doğrulama servisi zaman aşımına uğruyor.',
    kategori: 'Yazılım',
    oncelik: 'Yüksek',
    acil: true,
    durum: 'İşlemde',
    adSoyad: 'Zeynep Yıldız',
    tarih: '27.10.2026 11:25',
  },
];

// Uygulama çalışma süresince bellekte güncellenen global liste
let ticketsData = [...initialTickets];

export const getTickets = () => ticketsData;

export const getTicketById = (id) => {
  return ticketsData.find((t) => String(t.id) === String(id));
};

export const addTicket = (newTicket) => {
  ticketsData = [newTicket, ...ticketsData];
  return ticketsData;
};
