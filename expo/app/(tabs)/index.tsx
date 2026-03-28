import colors from '@/constants/colors';
import { mockNews } from '@/mocks/news';
import { Bias, ForexPair, NewsItem } from '@/types/news';
import { Stack } from 'expo-router';
import { ArrowDown, ArrowUp, Minus, TrendingUp } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const PAIRS: ForexPair[] = ['EURUSD', 'USDJPY', 'EURCAD', 'XAUUSD'];

export default function DashboardScreen() {
  const [selectedPair, setSelectedPair] = useState<ForexPair | 'ALL'>('ALL');

  const filteredNews = useMemo(() => {
    if (selectedPair === 'ALL') return mockNews;
    return mockNews.filter((item) => item.pair === selectedPair);
  }, [selectedPair]);

  const getBiasColor = (bias: Bias): string => {
    switch (bias) {
      case 'bullish':
        return colors.dark.success;
      case 'bearish':
        return colors.dark.danger;
      case 'neutral':
        return colors.dark.neutral;
    }
  };

  const getBiasIcon = (bias: Bias) => {
    const color = getBiasColor(bias);
    const size = 14;
    switch (bias) {
      case 'bullish':
        return <ArrowUp color={color} size={size} />;
      case 'bearish':
        return <ArrowDown color={color} size={size} />;
      case 'neutral':
        return <Minus color={color} size={size} />;
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <View style={styles.newsCard}>
      <View style={styles.newsHeader}>
        <View style={styles.pairBadge}>
          <Text style={styles.pairText}>{item.pair}</Text>
        </View>
        <View style={[styles.biasBadge, { backgroundColor: getBiasColor(item.bias) + '20' }]}>
          {getBiasIcon(item.bias)}
          <Text style={[styles.biasText, { color: getBiasColor(item.bias) }]}>
            {item.bias.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.newsTitle}>{item.title}</Text>
      <Text style={styles.newsDescription}>{item.description}</Text>

      <View style={styles.newsFooter}>
        <Text style={styles.newsSource}>{item.source}</Text>
        <Text style={styles.newsTime}>{formatTimestamp(item.timestamp)}</Text>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Trading Dashboard',
          headerStyle: {
            backgroundColor: colors.dark.surface,
          },
          headerTintColor: colors.dark.text,
          headerShadowVisible: false,
        }}
      />
      <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedPair === 'ALL' && styles.filterChipActive,
            ]}
            onPress={() => setSelectedPair('ALL')}
          >
            <TrendingUp
              color={selectedPair === 'ALL' ? colors.dark.text : colors.dark.textSecondary}
              size={16}
            />
            <Text
              style={[
                styles.filterText,
                selectedPair === 'ALL' && styles.filterTextActive,
              ]}
            >
              All Pairs
            </Text>
          </TouchableOpacity>

          {PAIRS.map((pair) => (
            <TouchableOpacity
              key={pair}
              style={[
                styles.filterChip,
                selectedPair === pair && styles.filterChipActive,
              ]}
              onPress={() => setSelectedPair(pair)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedPair === pair && styles.filterTextActive,
                ]}
              >
                {pair}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList
          data={filteredNews}
          renderItem={renderNewsItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  filterContainer: {
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.dark.surface,
    borderWidth: 1,
    borderColor: colors.dark.border,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: colors.dark.primary,
    borderColor: colors.dark.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.dark.textSecondary,
  },
  filterTextActive: {
    color: colors.dark.text,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  newsCard: {
    backgroundColor: colors.dark.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.dark.border,
    gap: 12,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pairBadge: {
    backgroundColor: colors.dark.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  pairText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: colors.dark.text,
  },
  biasBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  biasText: {
    fontSize: 11,
    fontWeight: '700' as const,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.dark.text,
    lineHeight: 24,
  },
  newsDescription: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    lineHeight: 20,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  newsSource: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.dark.primary,
  },
  newsTime: {
    fontSize: 12,
    color: colors.dark.textSecondary,
  },
});
