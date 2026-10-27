import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import StatusBadge from './StatusBadge';

/**
 * TicketCard Bileşeni
 * Föy Gereksinimleri:
 * - Başlık, konum ve durum gösterecek.
 * - İlgili arıza ID'si ile /ariza/[id] ekranını açacak.
 * - Yerleşim: Üstte Talep No ve Durum Rozeti, ortada Arıza Başlığı,
 *   altta Konum ve Kategori/Öncelik bilgisi.
 */
export default function TicketCard({ ticket }) {
  const router = useRouter();

  if (!ticket) return null;

  const handlePress = () => {
    router.push(`/ariza/${ticket.id}`);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={handlePress}
    >
      {/* ÜST BİLGİ SATIRI: ID & DURUM ROZETİ */}
      <View style={styles.topRow}>
        <View style={styles.idContainer}>
          <Text style={styles.idPrefix}>#</Text>
          <Text style={styles.idText}>{ticket.id}</Text>
          {ticket.acil && (
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>ACİL</Text>
            </View>
          )}
        </View>
        <StatusBadge status={ticket.durum} size="small" />
      </View>

      {/* ORTA: ARIZA BAŞLIĞI */}
      <Text style={styles.title} numberOfLines={2}>
        {ticket.baslik}
      </Text>

      {/* AÇIKLAMA ÖZETİ */}
      {ticket.aciklama && (
        <Text style={styles.description} numberOfLines={2}>
          {ticket.aciklama}
        </Text>
      )}

      {/* AYIRICI ÇİZGİ */}
      <View style={styles.divider} />

      {/* ALT SATIR: KONUM / BİRİM & DETAY BUTONU */}
      <View style={styles.bottomRow}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText} numberOfLines={1}>
            {ticket.konum || ticket.birim || 'Merkez Yerleşke'}
          </Text>
        </View>

        <View style={styles.detailButton}>
          <Text style={styles.detailButtonText}>Detay Gör →</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    // Gölge (iOS & Android)
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardPressed: {
    backgroundColor: '#f8fafc',
    transform: [{ scale: 0.99 }],
    borderColor: '#cbd5e1',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  idPrefix: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
  },
  idText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
  },
  urgentBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  urgentText: {
    color: '#dc2626',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 22,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginBottom: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  locationIcon: {
    fontSize: 13,
    marginRight: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  detailButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
  },
  detailButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
});
