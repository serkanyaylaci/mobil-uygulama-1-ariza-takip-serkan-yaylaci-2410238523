import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import StatusBadge from '../../components/StatusBadge';
import { getTicketById } from '../../data/tickets';

/**
 * UYGULAMA 1: Dinamik Arıza Detay Ekranı (/ariza/[id])
 * Föy Gereksinimleri:
 * - useLocalSearchParams ile id okuma
 * - Doğru arıza kaydını bulma ve gösterme
 * - Başlık, konum, durum ve geri butonu
 * - StatusBadge bileşeni ile durum renklendirme
 * - Olmayan arıza ID'sinde (örn: 999) çökme yerine anlamlı uyarı (T4 Test Senaryosu)
 * - Detaydan geri gelindiğinde liste ekranının tekrar kullanılabilmesi (T3 Test Senaryosu)
 */
export default function ArizaDetayEkrani() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // ID'ye göre arızayı bul
  const ticket = getTicketById(id);

  // Talep durumunu yerel olarak değiştirebilmek için state
  const [currentStatus, setCurrentStatus] = useState(
    ticket ? ticket.durum : null
  );

  // Platform uyumlu bildirim
  const showNotification = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  // DURUM 1: Arıza kaydı bulunamadı (Örn: /ariza/999)
  // FÖY KURALI: "Olmayan /ariza/999 adresine gidildiğinde çökme yerine anlamlı uyarı gösterin."
  if (!ticket) {
    return (
      <View style={styles.notFoundContainer}>
        <View style={styles.notFoundCard}>
          <Text style={styles.notFoundIcon}>⚠️</Text>
          <Text style={styles.notFoundTitle}>Arıza Kaydı Bulunamadı</Text>
          <Text style={styles.notFoundSubtitle}>
            #{id} numaralı talep sistemde kayıtlı değil veya silinmiş olabilir.
          </Text>

          <View style={styles.hintBox}>
            <Text style={styles.hintTitle}>🔍 Föy Test Notu (T4):</Text>
            <Text style={styles.hintText}>
              Bilinmeyen arıza ID sorgusunda uygulama çökmedi ve kullanıcı
              kontrollü bir şekilde uyarıldı.
            </Text>
          </View>

          <Pressable
            style={styles.backToListBtn}
            onPress={() => router.replace('/ariza')}
          >
            <Text style={styles.backToListBtnText}>← Arıza Listesine Dön</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Durum değiştirme işleyicisi
  const handleStatusChange = (newStatus) => {
    ticket.durum = newStatus;
    setCurrentStatus(newStatus);
    showNotification(
      'Durum Güncellendi',
      `Talep durumu "${newStatus}" olarak güncellendi.`
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ÜST BİLGİ KARTI: ID & DURUM */}
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <View style={styles.idBox}>
            <Text style={styles.idLabel}>TALEP NO</Text>
            <Text style={styles.idValue}>#{ticket.id}</Text>
          </View>
          <StatusBadge status={currentStatus || ticket.durum} size="medium" />
        </View>

        <Text style={styles.title}>{ticket.baslik}</Text>

        <View style={styles.tagsRow}>
          <View style={styles.tagItem}>
            <Text style={styles.tagLabel}>Kategori:</Text>
            <Text style={styles.tagValue}>{ticket.kategori}</Text>
          </View>
          <View style={styles.tagItem}>
            <Text style={styles.tagLabel}>Öncelik:</Text>
            <Text
              style={[
                styles.tagValue,
                ticket.oncelik === 'Yüksek' && { color: '#dc2626' },
              ]}
            >
              {ticket.oncelik}
            </Text>
          </View>
          {ticket.acil && (
            <View style={styles.urgentTag}>
              <Text style={styles.urgentTagText}>🚨 ACİL ÇAĞRI</Text>
            </View>
          )}
        </View>
      </View>

      {/* KONUM VE BİRİM DETAYLARI */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>📍 Konum & Bildirim Bilgileri</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoField}>Arıza Konumu:</Text>
          <Text style={styles.infoData}>{ticket.konum}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoField}>İlgili Birim:</Text>
          <Text style={styles.infoData}>{ticket.birim}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoField}>Bildiren Kişi:</Text>
          <Text style={styles.infoData}>{ticket.adSoyad}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoField}>Kayıt Tarihi:</Text>
          <Text style={styles.infoData}>{ticket.tarih}</Text>
        </View>
      </View>

      {/* AÇIKLAMA KARTI */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>📝 Arıza Açıklaması</Text>
        <Text style={styles.descriptionText}>{ticket.aciklama}</Text>
      </View>

      {/* DURUM GÜNCELLEME İŞLEMLERİ */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>⚡ Durumu Güncelle</Text>
        <Text style={styles.statusHint}>
          Talebin mevcut ilerleyişine göre durumu anında değiştirebilirsiniz:
        </Text>

        <View style={styles.statusButtonsRow}>
          <Pressable
            style={[
              styles.statusBtn,
              styles.btnOrange,
              currentStatus === 'Bekliyor' && styles.statusBtnActive,
            ]}
            onPress={() => handleStatusChange('Bekliyor')}
          >
            <Text style={styles.btnOrangeText}>Bekliyor</Text>
          </Pressable>

          <Pressable
            style={[
              styles.statusBtn,
              styles.btnBlue,
              currentStatus === 'İşlemde' && styles.statusBtnActive,
            ]}
            onPress={() => handleStatusChange('İşlemde')}
          >
            <Text style={styles.btnBlueText}>İşlemde</Text>
          </Pressable>

          <Pressable
            style={[
              styles.statusBtn,
              styles.btnGreen,
              currentStatus === 'Çözüldü' && styles.statusBtnActive,
            ]}
            onPress={() => handleStatusChange('Çözüldü')}
          >
            <Text style={styles.btnGreenText}>Çözüldü</Text>
          </Pressable>
        </View>
      </View>

      {/* GERİ DÖNÜŞ VE TEST BİLGİSİ (T3 senaryosu) */}
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backBtnText}>← Arıza Listesine Geri Dön</Text>
      </Pressable>

      <Text style={styles.footerNote}>
        Talep ID: {ticket.id} • Dinamik Rota: /ariza/{ticket.id}
      </Text>
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
  headerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  idBox: {
    flexDirection: 'column',
  },
  idLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  idValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 26,
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  tagLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  tagValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1e293b',
  },
  urgentTag: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  urgentTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#dc2626',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  infoField: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
    flex: 1,
  },
  infoData: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '600',
    flex: 1.5,
    textAlign: 'right',
  },
  descriptionText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
  },
  statusHint: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 10,
  },
  statusButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  statusBtnActive: {
    transform: [{ scale: 1.02 }],
    borderWidth: 2,
  },
  btnOrange: {
    backgroundColor: '#fffbeb',
    borderColor: '#f59e0b',
  },
  btnOrangeText: {
    color: '#b45309',
    fontWeight: '700',
    fontSize: 13,
  },
  btnBlue: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  btnBlueText: {
    color: '#1d4ed8',
    fontWeight: '700',
    fontSize: 13,
  },
  btnGreen: {
    backgroundColor: '#ecfdf5',
    borderColor: '#10b981',
  },
  btnGreenText: {
    color: '#047857',
    fontWeight: '700',
    fontSize: 13,
  },
  backBtn: {
    backgroundColor: '#0f172a',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 12,
  },
  backBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 12,
    color: '#94a3b8',
  },
  notFoundContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 420,
    borderWidth: 1,
    borderColor: '#fecaca',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  notFoundIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#991b1b',
    marginBottom: 8,
    textAlign: 'center',
  },
  notFoundSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  hintBox: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    width: '100%',
  },
  hintTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#b45309',
    marginBottom: 4,
  },
  hintText: {
    fontSize: 12,
    color: '#78350f',
    lineHeight: 17,
  },
  backToListBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  backToListBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
