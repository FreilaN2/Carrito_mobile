import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, RefreshControl, ActivityIndicator, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search, Bell, ShoppingBag, Heart } from 'lucide-react-native';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../../constants/theme';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  stock: number;
  category?: { name: string };
}

interface Category {
  id: string;
  name: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  'Belleza': '💄',
  'Cuidado Personal': '🧴',
  'Bebés': '🍼',
  'Alimentos': '🛒',
};

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const user = useAuthStore((s) => s.user);
  const addItem = useCartStore((s) => s.addItem);

  const fetchData = useCallback(async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
      ]);
      setProducts(prodRes.data?.products || prodRes.data || []);
      setCategories(catRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory ? p.category?.name === selectedCategory : true;
    return matchSearch && matchCat;
  });

  const renderProduct = ({ item }: { item: Product }) => {
    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => router.push(`/product/${item.id}`)}
        activeOpacity={0.8}
      >
        <View style={styles.productImageWrapper}>
          {item.image_url ? (
            <Image source={{ uri: item.image_url }} style={styles.productImage} resizeMode="cover" />
          ) : (
            <View style={styles.productImagePlaceholder}>
              <ShoppingBag size={32} color={Colors.textMuted} />
            </View>
          )}
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productCategory}>{item.category?.name || 'Sin categoría'}</Text>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <View style={styles.productFooter}>
            <Text style={styles.productPrice}>${Number(item.price).toFixed(2)}</Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => addItem({ id: item.id, name: item.name, price: Number(item.price), image_url: item.image_url, stock: item.stock })}
            >
              <Text style={styles.addBtnText}>+ Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header tipo Farmatodo */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hola, {user?.name?.split(' ')[0] ?? 'Invitado'} 👋</Text>
            <Text style={styles.headerSub}>¿Qué buscas hoy?</Text>
          </View>
          <View style={styles.headerActions}>
            {!user && (
              <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.headerBtnText}>Ingresar</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.notifBtn}>
              <Bell size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Buscador */}
        <View style={styles.searchWrapper}>
          <Search size={18} color={Colors.primary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Categorías (Estilo Farmatodo: Círculos con texto abajo) */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Compra por categoría</Text>
      </View>
      <FlatList
        horizontal
        data={[{ id: 'all', name: 'Todos' }, ...categories]}
        keyExtractor={(i) => i.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesRow}
        renderItem={({ item }) => {
          const active = (item.id === 'all' && !selectedCategory) || item.name === selectedCategory;
          return (
            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => setSelectedCategory(item.id === 'all' ? null : item.name)}
            >
              <View style={[styles.categoryCircle, active && styles.categoryCircleActive]}>
                <Text style={styles.categoryIcon}>{CATEGORY_ICONS[item.name] ?? (item.id === 'all' ? '✨' : '🏷️')}</Text>
              </View>
              <Text style={[styles.categoryText, active && styles.categoryTextActive]} numberOfLines={2}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Productos */}
      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        numColumns={2}
        contentContainerStyle={styles.productGrid}
        columnWrapperStyle={styles.productRow}
        renderItem={renderProduct}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={Colors.primary} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No se encontraron productos</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: Spacing.md, borderBottomLeftRadius: Radius.lg, borderBottomRightRadius: Radius.lg, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, marginBottom: Spacing.md },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  greeting: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: '#fff' },
  headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  headerBtn: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: Radius.full, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  headerBtnText: { color: '#fff', fontSize: FontSize.sm, fontWeight: '600' },
  notifBtn: { padding: Spacing.sm, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: Radius.full },
  searchWrapper: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: '#fff', borderRadius: Radius.full,
    paddingHorizontal: Spacing.md, height: 46,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2,
  },
  searchInput: { flex: 1, color: Colors.textPrimary, fontSize: FontSize.md },
  sectionHeader: { marginHorizontal: Spacing.lg, marginTop: Spacing.sm, marginBottom: Spacing.sm },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  categoriesRow: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg, gap: Spacing.md },
  categoryItem: { alignItems: 'center', width: 76 },
  categoryCircle: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
    marginBottom: Spacing.sm,
  },
  categoryCircleActive: { borderColor: Colors.primary, borderWidth: 2 },
  categoryIcon: { fontSize: 28, lineHeight: 32, textAlign: 'center' },
  categoryText: { fontSize: FontSize.xs, color: Colors.textSecondary, textAlign: 'center', fontWeight: FontWeight.medium, lineHeight: 14, marginTop: 4 },
  categoryTextActive: { color: Colors.primary, fontWeight: FontWeight.bold },
  productGrid: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },
  productRow: { gap: Spacing.sm, marginBottom: Spacing.sm },
  productCard: {
    flex: 1, backgroundColor: Colors.surface,
    borderRadius: Radius.lg, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.border,
  },
  productImageWrapper: { position: 'relative', height: 150 },
  productImage: { width: '100%', height: '100%' },
  productImagePlaceholder: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surfaceElevated },
  wishlistBtn: {
    position: 'absolute', top: Spacing.sm, right: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: Radius.full,
    padding: Spacing.sm,
  },
  productInfo: { padding: Spacing.sm },
  productCategory: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.medium, marginBottom: 2 },
  productName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  productFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.primary },
  addBtn: { backgroundColor: Colors.primary, borderRadius: Radius.sm, paddingVertical: 5, paddingHorizontal: Spacing.sm },
  addBtnText: { color: '#fff', fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  emptyState: { alignItems: 'center', paddingTop: Spacing.xxl },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.md },
  emptyText: { color: Colors.textSecondary, fontSize: FontSize.md },
});
