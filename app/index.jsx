import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import TicketCard from '../components/TicketCard';
import StatusBadge from '../components/StatusBadge';
import { getTickets } from '../data/tickets';

/**
 * UYGULAMA 1: Arıza Takip Listesi Ekranı
 * Föy Gereksinimleri:
 * - Arıza listesinde en az 3 kayıt bulunsun.
 * - Her kayıt TicketCard bileşeni ile gösterilsin.
 * - FlatList kullanılsın.
 * - Yeni Arıza butonuna basılınca yeni arıza formu açılsın.
 */
export default function ArizaListesiEkrani() {
  const router = useRouter();
  const [tickets, setTickets] = useState(getTickets());
  const [filterStatus, setFilterStatus] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');

  // Sayfa her odaklandığında veya state değiştikçe verileri güncelle
  const refreshTickets = () => {
    setTickets([...getTickets()]);
  };

  // Filtreleme mantığı
  const filteredTickets = tickets.filter((t) => {
    const matchStatus =
      filterStatus === 'Tümü' ||
      t.durum.toLowerCase() === filterStatus.toLowerCase();

    const query = searchQuery.toLowerCase().trim();
    const matchSearch =
      query === '' ||
      t.baslik.toLowerCase().includes(query) ||
      t.konum.toLowerCase().includes(query) ||
      t.id.toLowerCase().includes(query);

    return matchStatus && matchSearch;
  });

  // İstatistik sayıları
  const countAll = tickets.length;
  const countBekliyor = tickets.filter(
    (t) => t.durum.toLowerCase() === 'bekliyor'
  ).length;
  const countIslemde = tickets.filter(
    (t) => t.durum.toLowerCase() === 'işlemde' || t.durum.toLowerCase() === 'islemde'
  ).length;
  const countCozuldu = tickets.filter(
    (t) => t.durum.toLowerCase() === 'çözüldü' || t.durum.toLowerCase() === 'cozuldu'
  ).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* ÜST BİLGİ & YENİ TALEP BUTONU */}
      <View style={styles.header}>
        <View style={styles.headerTextCol}>
          <Text style={styles.headerTitle}>Teknik Destek Talepleri</Text>
          <Text style={styles.headerSubtitle}>
            Kampüs ve laboratuvar arıza kayıtları
          </Text>
        </View>

        <Pressable
          style={styles.newBtn}
          onPress={() => router.push('/ariza/yeni')}
        >
          <Text style={styles.newBtnText}>+ Yeni Arıza</Text>
        </Pressable>
      </View>

      {/* İSTATİSTİK SAYAÇLARI */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, styles.statAll]}>
          <Text style={styles.statNum}>{countAll}</Text>
          <Text style={styles.statLabel}>Toplam</Text>
        </View>
        <View style={[styles.statBox, styles.statOrange]}>
          <Text style={[styles.statNum, { color: '#b45309' }]}>
            {countBekliyor}
          </Text>
          <Text style={[styles.statLabel, { color: '#b45309' }]}>Bekliyor</Text>
        </View>
        <View style={[styles.statBox, styles.statBlue]}>
          <Text style={[styles.statNum, { color: '#1d4ed8' }]}>
            {countIslemde}
          </Text>
          <Text style={[styles.statLabel, { color: '#1d4ed8' }]}>İşlemde</Text>
        </View>
        <View style={[styles.statBox, styles.statGreen]}>
          <Text style={[styles.statNum, { color: '#047857' }]}>
            {countCozuldu}
          </Text>
          <Text style={[styles.statLabel, { color: '#047857' }]}>Çözüldü</Text>
        </View>
      </View>

      {/* CANLI ARAMA ÇUBUĞU */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Arıza no, başlık veya konum ara..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <Text style={styles.clearSearch}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* DURUM FİLTRE BUTONLARI */}
      <View style={styles.filterRow}>
        {['Tümü', 'Bekliyor', 'İşlemde', 'Çözüldü'].map((tab) => (
          <Pressable
            key={tab}
            style={[
              styles.filterTab,
              filterStatus === tab && styles.filterTabActive,
            ]}
            onPress={() => setFilterStatus(tab)}
          >
            <Text
              style={[
                styles.filterTabText,
                filterStatus === tab && styles.filterTabTextActive,
              ]}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* ARIZA LİSTESİ (FlatList) */}
      <FlatList
        data={filteredTickets}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <TicketCard ticket={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📂</Text>
            <Text style={styles.emptyTitle}>Kayıt Bulunamadı</Text>
            <Text style={styles.emptyText}>
              Seçilen kriterlere uygun arıza kaydı bulunmamaktadır.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  headerTextCol: {
    flex: 1,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  newBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  newBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginTop: 8,
    marginBottom: 10,
  },
  statBox: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  statAll: {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
  },
  statOrange: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  statBlue: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  statGreen: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  statNum: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    height: 42,
    marginBottom: 10,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  clearSearch: {
    fontSize: 14,
    color: '#94a3b8',
    padding: 4,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterTabActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterTabTextActive: {
    color: '#ffffff',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
  },
});
