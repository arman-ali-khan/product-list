import { useState } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Searchbar, Text, IconButton, Surface, Divider } from 'react-native-paper';
import { useProductStore } from '../../store/useProductStore';
import { router } from 'expo-router';
import { CreditCard as Edit2, Trash2 } from 'lucide-react-native';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { searchProducts, deleteProduct } = useProductStore();

  const products = searchProducts(searchQuery);

  const handleEdit = (id: string) => {
    router.push(`/product/${id}`);
  };

  const renderItem = ({ item }) => (
    <Surface style={styles.itemContainer} elevation={1}>
      <View style={styles.itemContent}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
        ) : (
          <View style={[styles.thumbnail, styles.placeholderImage]} />
        )}
        
        <View style={styles.details}>
          <Text variant="titleMedium" numberOfLines={1} style={styles.name}>
            {item.name}
          </Text>
          <View style={styles.infoRow}>
            <Text variant="bodySmall" style={styles.sku}>SKU: {item.sku}</Text>
            <Text variant="bodySmall" style={styles.quantity}>
              Stock: {item.quantity}
            </Text>
          </View>
          <Text variant="bodyMedium" style={styles.price}>
            ${item.sellingPrice}
          </Text>
        </View>

       
      </View>
    </Surface>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search products by name or SKU"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        elevation={1}
      />

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text variant="titleMedium" style={styles.emptyText}>
              {searchQuery 
                ? 'No products found matching your search'
                : 'Start typing to search products'}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    margin: 16,
    borderRadius: 12,
  },
  list: {
    padding: 16,
    paddingTop: 0,
  },
  itemContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  placeholderImage: {
    backgroundColor: '#E1E1E1',
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  sku: {
    color: '#666',
    marginRight: 12,
  },
  quantity: {
    color: '#666',
  },
  price: {
    marginTop: 4,
    fontWeight: '600',
    color: '#007AFF',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    height: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 32,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
  },
});