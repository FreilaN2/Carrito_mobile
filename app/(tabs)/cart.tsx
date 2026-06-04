import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../../constants/theme';

export default function CartScreen() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCartStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const count = totalItems();
  const total = totalPrice();

  if (count === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Mi Carrito</Text>
        <View style={styles.emptyState}>
          <ShoppingBag size={72} color={Colors.textMuted} strokeWidth={1.2} />
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptySubtitle}>Agrega productos desde la tienda</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      Toast.show({ type: 'info', text1: 'Inicia sesión', text2: 'Debes iniciar sesión para comprar' });
      router.push('/login');
      return;
    }
    Toast.show({ type: 'success', text1: '¡Pedido realizado!', text2: 'Gracias por tu compra 🎉' });
    clearCart();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Carrito</Text>
        <TouchableOpacity onPress={clearCart} style={styles.clearBtn}>
          <Text style={styles.clearText}>Vaciar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <View style={styles.itemImageWrapper}>
              {item.image_url ? (
                <Image source={{ uri: item.image_url }} style={styles.itemImage} resizeMode="cover" />
              ) : (
                <View style={styles.itemImagePlaceholder}>
                  <ShoppingBag size={24} color={Colors.textMuted} />
                </View>
              )}
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
              <Text style={styles.itemUnitPrice}>${Number(item.price).toFixed(2)} c/u</Text>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeItem(item.id)}
              >
                <Trash2 size={14} color={Colors.accent} />
              </TouchableOpacity>
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus size={14} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus size={14} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/* Footer con total y botón */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total ({count} {count === 1 ? 'producto' : 'productos'})</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.checkoutText}>Confirmar pedido</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.primary, paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.md, borderBottomLeftRadius: Radius.lg, borderBottomRightRadius: Radius.lg, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, marginBottom: Spacing.md },
  title: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: '#fff' },
  clearBtn: { padding: Spacing.sm, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: Radius.full, paddingHorizontal: Spacing.md },
  clearText: { color: '#fff', fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  list: { paddingHorizontal: Spacing.lg, paddingBottom: 160 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  emptySubtitle: { fontSize: FontSize.md, color: Colors.textSecondary },
  cartItem: {
    flexDirection: 'row', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, marginBottom: Spacing.sm,
    padding: Spacing.sm, borderWidth: 1, borderColor: Colors.border, gap: Spacing.sm,
  },
  itemImageWrapper: { width: 80, height: 80, borderRadius: Radius.md, overflow: 'hidden' },
  itemImage: { width: '100%', height: '100%' },
  itemImagePlaceholder: { width: '100%', height: '100%', backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center' },
  itemInfo: { flex: 1, justifyContent: 'center', gap: 4 },
  itemName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  itemPrice: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.primary },
  itemUnitPrice: { fontSize: FontSize.xs, color: Colors.textMuted },
  itemActions: { alignItems: 'flex-end', justifyContent: 'space-between' },
  removeBtn: { padding: Spacing.xs, backgroundColor: Colors.accentLight, borderRadius: Radius.sm },
  qtyRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceElevated, borderRadius: Radius.sm, overflow: 'hidden' },
  qtyBtn: { padding: Spacing.sm },
  qtyText: { minWidth: 28, textAlign: 'center', color: Colors.textPrimary, fontWeight: FontWeight.bold, fontSize: FontSize.sm },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border,
    padding: Spacing.lg, paddingBottom: Spacing.xl,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md },
  totalLabel: { fontSize: FontSize.md, color: Colors.textSecondary },
  totalAmount: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  checkoutBtn: { backgroundColor: Colors.primary, borderRadius: Radius.md, height: 52, alignItems: 'center', justifyContent: 'center' },
  checkoutText: { color: '#fff', fontSize: FontSize.md, fontWeight: FontWeight.bold },
});
