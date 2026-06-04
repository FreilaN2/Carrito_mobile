import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius } from '../../constants/theme';
import { ShoppingBag, Home, LayoutGrid, Heart, User } from 'lucide-react-native';
import useCartStore from '../../store/cartStore';
import { Text } from 'react-native';

function TabIcon({
  icon: Icon,
  color,
  size,
  focused,
}: {
  icon: any;
  color: string;
  size: number;
  focused: boolean;
}) {
  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
      <Icon size={size} color={color} strokeWidth={focused ? 2.5 : 1.8} />
    </View>
  );
}

function CartTabIcon({ color, size, focused }: { color: string; size: number; focused: boolean }) {
  const totalItems = useCartStore((s) => s.totalItems());
  return (
    <View>
      <TabIcon icon={ShoppingBag} color={color} size={size} focused={focused} />
      {totalItems > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{totalItems > 9 ? '9+' : totalItems}</Text>
        </View>
      )}
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar, 
          { 
            paddingBottom: Platform.OS === 'android' ? Math.max(insets.bottom, 8) : insets.bottom,
            height: (Platform.OS === 'android' ? 64 : 60) + Math.max(insets.bottom, 0)
          }
        ],
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon icon={Home} color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categorías',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon icon={LayoutGrid} color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Carrito',
          tabBarIcon: ({ color, size, focused }) => (
            <CartTabIcon color={color} size={size} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon icon={User} color={color} size={size} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  iconContainer: {
    padding: 6,
    borderRadius: Radius.sm,
  },
  iconContainerActive: {
    backgroundColor: Colors.primaryLight,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: -2,
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
});
