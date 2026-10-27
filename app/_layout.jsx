import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#ffffff' },
          headerTintColor: '#0f172a',
          headerTitleStyle: { fontWeight: '700' },
          headerShadowVisible: false,
          headerBackTitle: 'Geri',
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: 'Arıza Takip Listesi', headerShown: true }}
        />
        <Stack.Screen
          name="ariza/[id]"
          options={{ title: 'Arıza Detayı', headerShown: true }}
        />
        <Stack.Screen
          name="ariza/yeni"
          options={{ title: 'Yeni Arıza Bildirimi', headerShown: true }}
        />
      </Stack>
    </>
  );
}
