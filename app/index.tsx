import { Redirect } from 'expo-router';

export default function Index() {
  // Siempre redirigir al inicio directamente
  return <Redirect href="/(tabs)" />;
}
