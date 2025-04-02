import { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import { ActivityIndicator, Card, Text, Button, SegmentedButtons, Portal, Dialog } from 'react-native-paper';
import { useProductStore } from '../../store/useProductStore';
import { router } from 'expo-router';
import { Grid2x2X as Grid2X2, List } from 'lucide-react-native';

export default function ProductListScreen() {
  const { products, loading, loadProducts, deleteProduct } = useProductStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [deleteDialog, setDeleteDialog] = useState({ visible: false, productId: '' });

  useEffect(() => {
    loadProducts();
  }, []);

  const showDeleteDialog = (productId: string) => {
    setDeleteDialog({ visible: true, productId });
  };

  const hideDeleteDialog = () => {
    setDeleteDialog({ visible: false, productId: '' });
  };

  const handleDelete = async () => {
    await deleteProduct(deleteDialog.productId);
    hideDeleteDialog();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderGridItem = ({ item }) => (
    <Card style={styles.gridCard}>
      {item.imageUri && (
        <Card.Cover source={{ uri: item.imageUri }} style={styles.gridImage} />
      )}
      <Card.Content>
        <Text variant="titleMedium" numberOfLines={1}>{item.name}</Text>
        <Text variant="bodySmall">SKU: {item.sku}</Text>
        <Text variant="bodySmall">Qty: {item.quantity}</Text>
        <Text variant="bodySmall">${item.sellingPrice}</Text>
      </Card.Content>
      <Card.Actions>
        <Button compact onPress={() => router.push(`/product/${item.id}`)}>Edit</Button>
        <Button compact onPress={() => showDeleteDialog(item.id)}>Delete</Button>
      </Card.Actions>
    </Card>
  );

  const renderListItem = ({ item }) => (
    <Card style={styles.listCard}>
      <View style={styles.listItemContainer}>
        {item.imageUri && (
          <Image source={{ uri: item.imageUri }} style={styles.listImage} />
        )}
        <Card.Content style={styles.listContent}>
          <Text variant="titleMedium">{item.name}</Text>
          <Text variant="bodySmall">SKU: {item.sku}</Text>
          <Text variant="bodySmall">Quantity: {item.quantity}</Text>
          <Text variant="bodySmall">Buying Price: ${item.buyingPrice}</Text>
          <Text variant="bodySmall">Selling Price: ${item.sellingPrice}</Text>
        </Card.Content>
        <Card.Actions style={styles.listActions}>
          <Button onPress={() => router.push(`/product/${item.id}`)}>Edit</Button>
          <Button onPress={() => showDeleteDialog(item.id)}>Delete</Button>
        </Card.Actions>
      </View>
    </Card>
  );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <SegmentedButtons
            value={viewMode}
            onValueChange={value => setViewMode(value as 'grid' | 'list')}
            buttons={[
              {
                value: 'grid',
                icon: ({ size, color }) => <Grid2X2 size={size} color={color} />,
                label: 'Grid',
              },
              {
                value: 'list',
                icon: ({ size, color }) => <List size={size} color={color} />,
                label: 'List',
              },
            ]}
          />
        </View>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={viewMode === 'grid' ? renderGridItem : renderListItem}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode}
          contentContainerStyle={styles.list}
        />
      </View>

      <Portal>
        <Dialog visible={deleteDialog.visible} onDismiss={hideDeleteDialog}>
          <Dialog.Title>Delete Product</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete this product? This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDeleteDialog}>Cancel</Button>
            <Button onPress={handleDelete} textColor="red">Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  list: {
    padding: 8,
  },
  gridCard: {
    flex: 1,
    margin: 8,
    maxWidth: '47%',
  },
  gridImage: {
    height: 120,
  },
  listCard: {
    margin: 8,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    margin: 8,
  },
  listContent: {
    flex: 1,
  },
  listActions: {
    flexDirection: 'column',
  },
});