import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle, XCircle, Info } from 'lucide-react-native';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../../constants/theme';

const ToastBase = ({
  text1, text2, icon, bg, borderColor,
}: {
  text1?: string; text2?: string; icon: React.ReactNode; bg: string; borderColor: string;
}) => (
  <View style={[styles.container, { backgroundColor: bg, borderLeftColor: borderColor }]}>
    <View style={styles.iconWrapper}>{icon}</View>
    <View style={styles.textWrapper}>
      {text1 && <Text style={styles.text1}>{text1}</Text>}
      {text2 && <Text style={styles.text2}>{text2}</Text>}
    </View>
  </View>
);

export const toastConfig = {
  success: ({ text1, text2 }: any) => (
    <ToastBase
      text1={text1} text2={text2}
      icon={<CheckCircle size={20} color={Colors.success} />}
      bg={Colors.surface} borderColor={Colors.success}
    />
  ),
  error: ({ text1, text2 }: any) => (
    <ToastBase
      text1={text1} text2={text2}
      icon={<XCircle size={20} color={Colors.accent} />}
      bg={Colors.surface} borderColor={Colors.accent}
    />
  ),
  info: ({ text1, text2 }: any) => (
    <ToastBase
      text1={text1} text2={text2}
      icon={<Info size={20} color={Colors.primary} />}
      bg={Colors.surface} borderColor={Colors.primary}
    />
  ),
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: Radius.lg, borderLeftWidth: 4,
    padding: Spacing.md, marginHorizontal: Spacing.md,
    gap: Spacing.sm, elevation: 8,
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
  },
  iconWrapper: { alignItems: 'center', justifyContent: 'center' },
  textWrapper: { flex: 1 },
  text1: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  text2: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
});
