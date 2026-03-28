import colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { Stack, useRouter } from 'expo-router';
import { LogOut, Mail, User } from 'lucide-react-native';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
            router.replace('/login');
          } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to sign out');
          }
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Profile',
          headerStyle: {
            backgroundColor: colors.dark.surface,
          },
          headerTintColor: colors.dark.text,
          headerShadowVisible: false,
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <User color={colors.dark.text} size={48} />
          </View>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Mail color={colors.dark.textSecondary} size={20} />
                <Text style={styles.infoLabelText}>Email</Text>
              </View>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <User color={colors.dark.textSecondary} size={20} />
                <Text style={styles.infoLabelText}>User ID</Text>
              </View>
              <Text style={styles.infoValue} numberOfLines={1}>
                {user?.id.slice(0, 8)}...
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>

          <TouchableOpacity style={styles.actionButton} onPress={handleSignOut}>
            <LogOut color={colors.dark.danger} size={20} />
            <Text style={styles.actionButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Trading Dashboard v1.0</Text>
          <Text style={styles.footerSubtext}>
            Stay informed with real-time market insights
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  content: {
    padding: 16,
    gap: 24,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 16,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.dark.surface,
    borderWidth: 2,
    borderColor: colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  email: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.dark.text,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.dark.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  infoCard: {
    backgroundColor: colors.dark.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.dark.border,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoLabelText: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.dark.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.dark.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.dark.border,
    gap: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.dark.danger,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.dark.textSecondary,
  },
  footerSubtext: {
    fontSize: 12,
    color: colors.dark.textSecondary,
    textAlign: 'center' as const,
  },
});
