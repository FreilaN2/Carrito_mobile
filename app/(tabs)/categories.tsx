import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search } from 'lucide-react-native';
import api from '../../services/api';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../../constants/theme';

interface Category { id: string; name: string; description: string; }

const CATEGORY_STYLES: Record<string, { color: string; image: string }> = {
  'Salud y Medicamentos': { color: '#8CC63F', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80' },
  'Belleza': { color: '#A23B9B', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&q=80' },
  'Cuidado Personal': { color: '#613F8C', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80' },
  'Bebés': { color: '#00B4C5', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&q=80' },
  'Alimentos': { color: '#4082D9', image: 'https://images.unsplash.com/photo-1548813354-998f82855fde?w=400&q=80' },
  'Hogar Mascota y Otros': { color: '#4082D9', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&q=80' }
};

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const catRes = await api.get('/categories');
      setCategories(catRes.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color={Colors.primary} /></View>;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.title}>Categorías</Text>
        <TouchableOpacity style={styles.searchBtn}>
          <Search size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(i) => i.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={Colors.primary} />}
        renderItem={({ item }) => {
          // Default to Green if not exactly matched in the styles
          const styleConfig = CATEGORY_STYLES[item.name] || { color: '#8CC63F', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80' };
          
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                // Si el usuario hace click, lo enviamos al home con el filtro (para el futuro)
                router.push(`/(tabs)`); 
              }}
              activeOpacity={0.8}
            >
              <View style={styles.imageContainer}>
                <Image source={{ uri: styleConfig.image }} style={styles.image} resizeMode="contain" />
              </View>
              
              <Text style={[styles.categoryName, { color: styleConfig.color }]} numberOfLines={2}>
                {item.name}
              </Text>
              
              {/* Esquina inferior derecha (Triángulo con color) */}
              <View style={[styles.cornerTriangle, { borderBottomColor: styleConfig.color }]} />
              
              {/* Icono + encima del triángulo */}
              <View style={styles.plusContainer}>
                <Text style={styles.plusText}>+</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    backgroundColor: '#fff', 
    paddingHorizontal: Spacing.lg, 
    paddingTop: Spacing.md, 
    paddingBottom: Spacing.md, 
    borderBottomWidth: 1, 
    borderBottomColor: Colors.border,
    elevation: 2,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 2, 
    marginBottom: Spacing.lg 
  },
  title: { fontSize: FontSize.lg, fontWeight: '500', color: Colors.textSecondary },
  searchBtn: { padding: 4 },
  
  grid: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xl },
  row: { gap: Spacing.md, marginBottom: Spacing.md },
  
  card: { 
    flex: 1, 
    backgroundColor: '#fff', 
    borderRadius: Radius.md, 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: '#eaeaea',
    height: 180,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    position: 'relative'
  },
  imageContainer: {
    height: 110,
    width: '100%',
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { 
    width: '100%', 
    height: '100%', 
  },
  categoryName: { 
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.sm,
    fontSize: FontSize.sm, 
    fontWeight: '400',
    width: '70%',
    lineHeight: 16
  },
  
  // Triángulo usando CSS borders
  cornerTriangle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 60,
    borderLeftColor: 'transparent',
    borderBottomWidth: 60,
    // borderBottomColor es asignado dinámicamente
  },
  
  plusContainer: {
    position: 'absolute',
    bottom: 8,
    right: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '300',
    lineHeight: 28,
  }
});
