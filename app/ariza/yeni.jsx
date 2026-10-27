import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Switch,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { addTicket } from '../../data/tickets';

/**
 * UYGULAMA 1: Yeni Arıza Bildirim Formu
 * Föy Gereksinimi:
 * - Yeni Arıza ekranı navigasyonda açılsın.
 * - Önceki haftanın tam formu korunur:
 *   Ad Soyad, Birim, Arıza Başlığı, Açıklama, Kategori, Öncelik, Acil Switch'i.
 * - Kaydedildiğinde yeni talep oluşturulur ve Arıza Listesine dönülür.
 */
export default function YeniArizaEkrani() {
  const router = useRouter();

  // Form State'leri
  const [adSoyad, setAdSoyad] = useState('');
  const [birim, setBirim] = useState('');
  const [konum, setKonum] = useState('');
  const [baslik, setBaslik] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [kategori, setKategori] = useState('Bilgisayar');
  const [oncelik, setOncelik] = useState('Orta');
  const [acil, setAcil] = useState(false);

  const kategoriler = [
    'Bilgisayar',
    'Yazıcı',
    'İnternet',
    'Yazılım',
    'Donanım',
  ];

  const oncelikler = ['Düşük', 'Orta', 'Yüksek'];

  const showNotification = (title, message, onOk) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
      if (onOk) onOk();
    } else {
      Alert.alert(title, message, [
        {
          text: 'Tamam',
          onPress: onOk,
        },
      ]);
    }
  };

  const handleKaydet = () => {
    // Validasyon
    if (!baslik.trim()) {
      showNotification('Hata', 'Lütfen arıza başlığını giriniz.');
      return;
    }

    if (!adSoyad.trim() || !birim.trim()) {
      showNotification('Hata', 'Lütfen ad soyad ve birim alanlarını doldurunuz.');
      return;
    }

    if (aciklama.trim().length < 8) {
      showNotification(
        'Hata',
        'Arıza açıklaması en az 8 karakter olmalıdır.'
      );
      return;
    }

    const yeniId = String(Math.floor(100 + Math.random() * 900));

    const yeniTalep = {
      id: yeniId,
      baslik: baslik.trim(),
      konum: konum.trim() || `${birim.trim()} Odası`,
      birim: birim.trim(),
      aciklama: aciklama.trim(),
      kategori,
      oncelik,
      acil,
      durum: 'Bekliyor', // Yeni açılan talep Bekliyor başlar
      adSoyad: adSoyad.trim(),
      tarih: new Date().toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    addTicket(yeniTalep);

    showNotification(
      'Kayıt Başarılı',
      `#${yeniId} numaralı teknik destek arıza kaydınız başarıyla oluşturuldu.`,
      () => {
        router.back();
      }
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <Text style={styles.formTitle}>Yeni Arıza Bildirimi</Text>
        <Text style={styles.formSubtitle}>
          Lütfen sorununuzu detaylı bir şekilde açıklayınız.
        </Text>

        {/* ARIZA BAŞLIĞI */}
        <Text style={styles.label}>Arıza Başlığı *</Text>
        <TextInput
          style={styles.input}
          placeholder="Örn: Projeksiyon HDMI kablosu temassızlığı"
          placeholderTextColor="#94a3b8"
          value={baslik}
          onChangeText={setBaslik}
        />

        {/* KULLANICI BİLGİLERİ */}
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Ad Soyad *</Text>
            <TextInput
              style={styles.input}
              placeholder="Adınız Soyadınız"
              placeholderTextColor="#94a3b8"
              value={adSoyad}
              onChangeText={setAdSoyad}
            />
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Birim / Bölüm *</Text>
            <TextInput
              style={styles.input}
              placeholder="Örn: Bilgi İşlem"
              placeholderTextColor="#94a3b8"
              value={birim}
              onChangeText={setBirim}
            />
          </View>
        </View>

        {/* KONUM */}
        <Text style={styles.label}>Açık Konum (Bina / Kat / Masa)</Text>
        <TextInput
          style={styles.input}
          placeholder="Örn: Mühendislik Binası 2. Kat Lab 3"
          placeholderTextColor="#94a3b8"
          value={konum}
          onChangeText={setKonum}
        />

        {/* AÇIKLAMA */}
        <Text style={styles.label}>Detaylı Açıklama *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Sorunu ve yapılan denemeleri belirtiniz..."
          placeholderTextColor="#94a3b8"
          value={aciklama}
          onChangeText={setAciklama}
          multiline
          textAlignVertical="top"
        />

        {/* KATEGORİ SEÇİMİ */}
        <Text style={styles.label}>Arıza Kategorisi</Text>
        <View style={styles.chipRow}>
          {kategoriler.map((kat) => (
            <Pressable
              key={kat}
              style={[
                styles.chip,
                kategori === kat && styles.chipActive,
              ]}
              onPress={() => setKategori(kat)}
            >
              <Text
                style={[
                  styles.chipText,
                  kategori === kat && styles.chipTextActive,
                ]}
              >
                {kat}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ÖNCELİK SEÇİMİ */}
        <Text style={styles.label}>Öncelik Seviyesi</Text>
        <View style={styles.chipRow}>
          {oncelikler.map((onc) => (
            <Pressable
              key={onc}
              style={[
                styles.chip,
                oncelik === onc && styles.chipActive,
              ]}
              onPress={() => setOncelik(onc)}
            >
              <Text
                style={[
                  styles.chipText,
                  oncelik === onc && styles.chipTextActive,
                ]}
              >
                {onc}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ACİL SWITCH */}
        <View style={styles.switchBox}>
          <View style={styles.switchTextCol}>
            <Text style={styles.switchTitle}>Acil Müdahale Çağrısı</Text>
            <Text style={styles.switchDesc}>
              Eğitim ve sınav süreçlerini doğrudan etkileyen kritik arızalar
            </Text>
          </View>
          <Switch
            value={acil}
            onValueChange={setAcil}
            trackColor={{ false: '#cbd5e1', true: '#fca5a5' }}
            thumbColor={acil ? '#dc2626' : '#f8fafc'}
          />
        </View>

        {/* KAYDET BUTONU */}
        <Pressable style={styles.submitBtn} onPress={handleKaydet}>
          <Text style={styles.submitBtnText}>Arıza Kaydını Oluştur</Text>
        </Pressable>

        {/* VAZGEÇ */}
        <Pressable style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelBtnText}>İptal / Vazgeç</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  textArea: {
    minHeight: 85,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  col: {
    flex: 1,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  chip: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  chipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  switchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    marginBottom: 10,
  },
  switchTextCol: {
    flex: 1,
    marginRight: 10,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#991b1b',
  },
  switchDesc: {
    fontSize: 11,
    color: '#b91c1c',
    marginTop: 2,
  },
  submitBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 18,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelBtnText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
});
