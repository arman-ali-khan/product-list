import { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import { ActivityIndicator, Card, Text, Button, Portal, Dialog } from 'react-native-paper';
import { useProductStore } from '../../store/useProductStore';
import { router } from 'expo-router';
import { Pencil, Trash2, CircleArrowDown as ArrowDownCircle, CircleArrowUp as ArrowUpCircle } from 'lucide-react-native';

export default function ProductListScreen() {
  const { products, loading, loadProducts, deleteProduct } = useProductStore();
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
          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <ArrowDownCircle size={16} color="#FF6B6B" style={styles.priceIcon} />
              <Text variant="bodySmall" style={styles.buyingPrice}>
                Buying: ${item.buyingPrice}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <ArrowUpCircle size={16} color="#51CF66" style={styles.priceIcon} />
              <Text variant="bodySmall" style={styles.sellingPrice}>
                Selling: ${item.sellingPrice}
              </Text>
            </View>
          </View>
        </Card.Content>
        <Card.Actions style={styles.listActions}>
          <Button 
            mode="text" 
            onPress={() => router.push(`/product/${item.id}`)}
            icon={({ size, color }) => <Pencil style={{widht:'12px',height:'12px'}} size={size} color={color} />}
          >
          </Button>
          <Button 
            mode="text" 
            style={{widht:'12px',height:'32px',display:'block'}}
            onPress={() => showDeleteDialog(item.id)}
            textColor="red"
          icon={({ size, color }) => <Trash2 size={size} color={color} />}
          >
          </Button>
        </Card.Actions>
      </View>
    </Card>
  );

  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderListItem}
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
  list: {
    padding: 8,
  },
  listCard: {
    margin: 8,
    backgroundColor: '#fff',
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
    display:'flex',
    alighItems:'center',
    justifyContent:'center',
    width:'20px',
    flexDirection: 'column',
  },
  priceContainer: {
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  priceIcon: {
    marginRight: 4,
  },
  buyingPrice: {
    color: '#FF6B6B',
  },
  sellingPrice: {
    color: '#51CF66',
  },
});