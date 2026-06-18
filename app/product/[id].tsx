import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Heart, ShoppingBag, Package, Star } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import api from '../../services/api';
import useCartStore from '../../store/cartStore';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../../constants/theme';

interface Product {
  id: string; name: string; description: string;
  price: number; stock: number; image_url: string | null;
  Category?: { name: string };
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem({ id: product.id, name: product.name, price: Number(product.price), image_url: product.image_url, stock: product.stock });
    }
    Toast.show({ type: 'success', text1: '¡Agregado!', text2: `${product.name} está en tu carrito` });
  };

  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color={Colors.primary} /></View>;
  if (!product) return <View style={styles.centered}><Text style={styles.errorText}>Producto no encontrado</Text></View>;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Imagen */}
        <View style={styles.imageContainer}>
          {product.image_url ? (
            <Image 
              source={{ uri: product.image_url.startsWith('http') ? product.image_url : `${api.defaults.baseURL?.replace('/api', '')}${product.image_url}` }} 
              style={styles.productImage} 
              resizeMode="contain" 
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <ShoppingBag size={80} color={Colors.textMuted} strokeWidth={1} />
            </View>
          )}
        </View>

        <View style={styles.content}>
          {/* Categoría */}
          {product.Category && (
            <Text style={styles.category}>{product.Category.name}</Text>
          )}

          {/* Nombre */}
          <Text style={styles.name}>{product.name}</Text>

          {/* Precio + Stock */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>${Number(product.price).toFixed(2)}</Text>
            <View style={[styles.stockBadge, product.stock === 0 && styles.outOfStock]}>
              <Package size={12} color={product.stock > 0 ? Colors.success : Colors.accent} />
              <Text style={[styles.stockText, product.stock === 0 && { color: Colors.accent }]}>
                {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
              </Text>
            </View>
          </View>

          {/* Descripción */}
          {product.description ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descripción</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>
          ) : null}

          {/* Cantidad */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cantidad</Text>
            <View style={styles.qtyRow}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botón agregar */}
      <View style={styles.footer}>
        <View style={styles.footerTotal}>
          <Text style={styles.footerLabel}>Total</Text>
          <Text style={styles.footerPrice}>${(Number(product.price) * quantity).toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.addBtn, product.stock === 0 && styles.addBtnDisabled]}
          onPress={handleAddToCart}
          disabled={product.stock === 0}
        >
          <ShoppingBag size={20} color="#fff" />
          <Text style={styles.addBtnText}>
            {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  errorText: { color: Colors.textSecondary, fontSize: FontSize.md },
  header: { flexDirection: 'row', padding: Spacing.md },
  backBtn: { padding: Spacing.sm, backgroundColor: Colors.surface, borderRadius: Radius.md },
  imageContainer: { height: 280, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', marginHorizontal: Spacing.lg, borderRadius: Radius.xl, marginBottom: Spacing.lg },
  productImage: { width: '100%', height: '100%', borderRadius: Radius.xl },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: Spacing.lg, paddingBottom: 120 },
  category: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.medium, marginBottom: Spacing.xs },
  name: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing.md },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  price: { fontSize: FontSize.xxxl, fontWeight: FontWeight.extrabold, color: Colors.primary },
  stockBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.successLight, paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  outOfStock: { backgroundColor: Colors.accentLight },
  stockText: { fontSize: FontSize.xs, color: Colors.success, fontWeight: FontWeight.medium },
  section: { marginBottom: Spacing.lg },
  sectionTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  description: { fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 24 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  qtyBtn: { width: 44, height: 44, backgroundColor: Colors.surface, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  qtyBtnText: { fontSize: FontSize.xl, color: Colors.textPrimary, fontWeight: FontWeight.bold },
  qtyValue: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary, minWidth: 32, textAlign: 'center' },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border,
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    padding: Spacing.lg, paddingBottom: Spacing.xl,
  },
  footerTotal: { flex: 1 },
  footerLabel: { fontSize: FontSize.xs, color: Colors.textSecondary },
  footerPrice: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  addBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.primary, borderRadius: Radius.md, height: 52 },
  addBtnDisabled: { backgroundColor: Colors.border },
  addBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: FontWeight.bold },
});
