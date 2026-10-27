import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * StatusBadge Bileşeni
 * Föy Gereksinimi:
 * - Bekliyor = turuncu
 * - İşlemde  = mavi
 * - Çözüldü  = yeşil (Tamamlandı da desteklenir)
 */
export default function StatusBadge({ status, size = 'medium' }) {
  const normStatus = (status || '').toLowerCase().trim();

  let badgeConfig = {
    label: status || 'Bilinmiyor',
    bgColor: '#f1f5f9',
    textColor: '#475569',
    borderColor: '#cbd5e1',
    dotColor: '#64748b',
  };

  if (normStatus === 'bekliyor') {
    badgeConfig = {
      label: 'Bekliyor',
      bgColor: '#fffbeb', // Sarı-turuncu açık
      textColor: '#b45309', // Koyu kehribar
      borderColor: '#fde68a',
      dotColor: '#f59e0b', // Turuncu
    };
  } else if (normStatus === 'işlemde' || normStatus === 'islemde') {
    badgeConfig = {
      label: 'İşlemde',
      bgColor: '#eff6ff', // Açık mavi
      textColor: '#1d4ed8', // Koyu mavi
      borderColor: '#bfdbfe',
      dotColor: '#3b82f6', // Mavi
    };
  } else if (
    normStatus === 'çözüldü' ||
    normStatus === 'cozuldu' ||
    normStatus === 'tamamlandı' ||
    normStatus === 'tamamlandi'
  ) {
    badgeConfig = {
      label: 'Çözüldü',
      bgColor: '#ecfdf5', // Açık yeşil
      textColor: '#047857', // Koyu yeşil
      borderColor: '#a7f3d0',
      dotColor: '#10b981', // Yeşil
    };
  }

  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: badgeConfig.bgColor,
          borderColor: badgeConfig.borderColor,
          paddingVertical: isSmall ? 3 : 5,
          paddingHorizontal: isSmall ? 8 : 12,
        },
      ]}
    >
      <View
        style={[
          styles.dot,
          {
            backgroundColor: badgeConfig.dotColor,
            width: isSmall ? 6 : 8,
            height: isSmall ? 6 : 8,
          },
        ]}
      />
      <Text
        style={[
          styles.text,
          {
            color: badgeConfig.textColor,
            fontSize: isSmall ? 11 : 13,
          },
        ]}
      >
        {badgeConfig.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
    gap: 6,
  },
  dot: {
    borderRadius: 999,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
