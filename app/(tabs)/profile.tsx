import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { User, Mail, LogOut, ShoppingBag, Heart, ChevronRight } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../../constants/theme';

export default function ProfileScreen() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const cartCount = useCartStore((s) => s.totalItems());

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Perfil</Text>
      </View>

      {/* Avatar + info */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <User size={40} color={Colors.primary} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.name ?? 'Usuario'}</Text>
          <View style={styles.emailRow}>
            <Mail size={14} color={Colors.textMuted} />
            <Text style={styles.profileEmail}>{user?.email ?? ''}</Text>
          </View>
          {user?.role === 'admin' && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>Administrador</Text>
            </View>
          )}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <TouchableOpacity style={styles.statCard} onPress={() => router.push('/(tabs)/cart')}>
          <ShoppingBag size={24} color={Colors.primary} />
          <Text style={styles.statNumber}>{cartCount}</Text>
          <Text style={styles.statLabel}>En carrito</Text>
        </TouchableOpacity>
      </View>

      {/* Opciones */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/cart')}>
          <View style={styles.menuIcon}>
            <ShoppingBag size={20} color={Colors.primary} />
          </View>
          <Text style={styles.menuLabel}>Mi carrito</Text>
          <ChevronRight size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Iniciar / Cerrar sesión */}
      {!isAuthenticated ? (
        <TouchableOpacity style={[styles.logoutBtn, { borderColor: Colors.primary, backgroundColor: Colors.primaryLight }]} onPress={() => router.push('/(auth)/login')}>
          <User size={20} color={Colors.primary} />
          <Text style={[styles.logoutText, { color: Colors.primary }]}>Iniciar sesión</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={20} color={Colors.accent} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.md, borderBottomLeftRadius: Radius.lg, borderBottomRightRadius: Radius.lg, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, marginBottom: Spacing.md },
  title: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: '#fff' },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, marginHorizontal: Spacing.lg,
    borderRadius: Radius.xl, padding: Spacing.lg,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  avatar: { width: 72, height: 72, borderRadius: Radius.full, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  profileInfo: { flex: 1, gap: 6 },
  profileName: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  emailRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  profileEmail: { fontSize: FontSize.sm, color: Colors.textSecondary },
  adminBadge: { backgroundColor: Colors.primaryLight, borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 2, alignSelf: 'flex-start' },
  adminBadgeText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.semibold },
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginHorizontal: Spacing.lg, marginTop: Spacing.md },
  statCard: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.md, alignItems: 'center', gap: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  statNumber: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  statLabel: { fontSize: FontSize.xs, color: Colors.textSecondary },
  section: { marginHorizontal: Spacing.lg, marginTop: Spacing.lg, backgroundColor: Colors.surface, borderRadius: Radius.xl, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  menuIcon: { width: 36, height: 36, borderRadius: Radius.sm, backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary, fontWeight: FontWeight.medium },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    marginHorizontal: Spacing.lg, marginTop: Spacing.xl,
    backgroundColor: Colors.accentLight, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.accent,
  },
  logoutText: { fontSize: FontSize.md, color: Colors.accent, fontWeight: FontWeight.semibold },
});
