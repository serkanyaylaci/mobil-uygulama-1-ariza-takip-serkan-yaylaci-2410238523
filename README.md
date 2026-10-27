# UYGULAMA 1 | Arıza Takip Uygulamasına Navigasyon

**Öğrenci Adı Soyadı:** Serkan Yaylacı  
**Öğrenci Numarası:** 2410238523  
**Ders:** Mobil Programlama  
**Konu:** Expo Router ile Ekran Ayrıştırma, Yığın (Stack) Navigasyonu ve Dinamik Rotalar  

---

## 📌 Senaryo ve Projenin Amacı
Bu proje, önceki hafta geliştirilen tek sayfalı Teknik Destek ve Arıza Talep Yönetimi uygulamasının kodlarını silmeden; ekranlara, dinamik rotalara ve yeniden kullanılabilir ortak bileşenlere ayırmak amacıyla Expo Router altyapısı kullanılarak geliştirilmiştir.

Uygulama sayesinde kampüs içerisindeki arıza bildirimleri listelenebilmekte, durumlarına göre filtrelenebilmekte, dinamik ID üzerinden detayları incelenebilmekte ve yeni arıza kaydı oluşturulabilmektedir.

---

## 📱 Ekranlar ve Navigasyon Akışı

```text
app/
├── _layout.jsx        # Root Stack Navigasyonu (Başlıklar, geri butonu stilleri)
├── index.jsx          # Ana Ekran / Arıza Listesi (FlatList, Sayaçlar, Canlı Arama)
└── ariza/
    ├── [id].jsx       # Dinamik Detay Ekranı (/ariza/[id] - useLocalSearchParams)
    └── yeni.jsx       # Yeni Arıza Bildirim Formu (Stack rotası)
```

1. **Arıza Listesi (`/` - `app/index.jsx`):**
   - Kayıtlar `FlatList` ile listelenir.
   - En üstte dinamik sayaçlar (Toplam, Bekliyor, İşlemde, Çözüldü) yer alır.
   - Başlık, konum veya talep numarasına göre anlık canlı arama yapılır.
   - Duruma göre tek dokunuşla filtreleme (Tümü, Bekliyor, İşlemde, Çözüldü) sağlanır.
   - Sağ üstteki `+ Yeni Arıza` butonu ile form ekranına yönlendirilir.

2. **Dinamik Arıza Detayı (`/ariza/[id]` - `app/ariza/[id].jsx`):**
   - URL parametresinden `useLocalSearchParams()` kancası ile `id` okunur.
   - `getTicketById(id)` ile ilgili kayıt bulunur; başlık, açık konum, ilgili birim, bildiren kişi, kayıt tarihi, acil durumu ve açıklama listelenir.
   - Arıza durumu (`Bekliyor`, `İşlemde`, `Çözüldü`) butonlarla anında güncellenebilir.
   - Sol üstteki `Geri` butonu veya alttaki `← Arıza Listesine Geri Dön` butonu ile liste ekranına dönülür.

3. **Yeni Arıza Bildirim Formu (`/ariza/yeni` - `app/ariza/yeni.jsx`):**
   - Ad Soyad, Birim, Açık Konum, Arıza Başlığı ve Detaylı Açıklama alanları.
   - Kategori seçimi (Bilgisayar, Yazıcı, İnternet, Yazılım, Donanım).
   - Öncelik seçimi (Düşük, Orta, Yüksek).
   - Acil Müdahale `Switch` kontrolü.
   - Kaydet butonuna basıldığında form doğrulanır (`.trim()` ve min. karakter), yeni talep listeye eklenir ve listeye güvenle dönülür.

---

## 🧩 Yeniden Kullanılabilir Bileşenler

### 1. `components/StatusBadge.jsx`
Föy kuralına uygun olarak durum değerine göre renklendirme sağlar:
- **`Bekliyor`:** Kehribar Turuncusu (Arka Plan: `#FFFBEB`, Yazı: `#B45309`, Nokta: `#F59E0B`)
- **`İşlemde`:** Bilgi Mavisi (Arka Plan: `#EFF6FF`, Yazı: `#1D4ED8`, Nokta: `#3B82F6`)
- **`Çözüldü` / `Tamamlandı`:** Zümrüt Yeşili (Arka Plan: `#ECFDF5`, Yazı: `#047857`, Nokta: `#10B981`)
- Boyut desteği (`small`, `medium`) ile hem kartlarda hem detay sayfasında ortak kullanılır.

### 2. `components/TicketCard.jsx`
- **Görüntülenen Alanlar:** Talep ID'si (`#101`), varsa kırmızı `ACİL` etiketi, `StatusBadge`, kalın başlık, açıklama özeti, harita pini (`📍`) ile açık konum ve `Detay Gör →` butonu.
- **Tıklama Davranışı:** Karta basıldığında `router.push('/ariza/' + ticket.id)` tetiklenerek detay ekranı açılır.

---

## 🛡️ Özel Hata Yakalama ve 404 Koruması (Föy C Bölümü)
- **Problem:** Kullanıcı bilinmeyen veya silinmiş bir adrese gittiğinde (Örn: `/ariza/999`), JavaScript `ticket.baslik` ifadesini okurken `TypeError` verip uygulamanın çökmesi (Crash).
- **Çözüm:** `app/ariza/[id].jsx` dosyasının başına erken dönüş (early return) mekanizması eklendi:
  ```jsx
  const ticket = getTicketById(id);
  if (!ticket) {
    return (
      <View style={styles.notFoundCard}>
        <Text style={styles.notFoundTitle}>⚠️ Arıza Kaydı Bulunamadı</Text>
        <Text>#{id} numaralı talep sistemde kayıtlı değil.</Text>
        <Pressable onPress={() => router.replace('/')}>
          <Text>← Arıza Listesine Dön</Text>
        </Pressable>
      </View>
    );
  }
  ```
  Bu sayede uygulama çökmez, kullanıcıya bilgilendirici uyarı kartı ve listeye dönme butonu sunulur (**T4 Senaryosu**).

---

## 🧪 İlgili Test Senaryoları ve Sonuçları

| Test No | Senaryo | Beklenen Sonuç | Gerçekleşen Sonuç | Durum |
| :---: | :--- | :--- | :--- | :---: |
| **T1** | Ana sayfadan Arıza Listesine git | Liste görünür | FlatList ve arıza kartları yüklendi | **GEÇTİ [X]** |
| **T2** | 101 numaralı arızayı aç | 101 detayları görünür | "Ağ Yazıcısı Kağıt Sıkışması" başlığı açıldı | **GEÇTİ [X]** |
| **T3** | Detaydan geri dön | Liste yeniden görünür | Liste durumu bozulmadan korunarak açıldı | **GEÇTİ [X]** |
| **T4** | Bilinmeyen arıza ID aç (`/ariza/999`) | Uyarı görünür; uygulama çökmez | Kontrollü 404 uyarı kartı çıktı, uygulama çökmedi | **GEÇTİ [X]** |

---

## 🚀 Kurulum ve Çalıştırma

```bash
# Proje dizinine geçin
cd "c:\Mobil Programlama\Uygulama1-ArizaTakip_serkan_yaylaci_2410238523"

# Expo geliştirici sunucusunu başlatın
npx expo start
```

- **Tarayıcıda test etmek için:** Terminalde `w` tuşuna basın.
- **Android Emülatör için:** `a` tuşuna basın.
- **Expo Go ile telefonda test etmek için:** Terminaldeki QR kodu taratın.
