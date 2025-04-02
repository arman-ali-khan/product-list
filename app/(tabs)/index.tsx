import { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import { ActivityIndicator, Card, Text, Button, Portal, Dialog, Menu, IconButton } from 'react-native-paper';
import { useProductStore } from '../../store/useProductStore';
import { router } from 'expo-router';
import { Pencil, Trash2, CircleArrowDown as ArrowDownCircle, CircleArrowUp as ArrowUpCircle, MoveVertical as MoreVertical } from 'lucide-react-native';

export default function ProductListScreen() {
  const { products, loading, loadProducts, deleteProduct } = useProductStore();
  const [deleteDialog, setDeleteDialog] = useState({ visible: false, productId: '' });
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const showDeleteDialog = (productId: string) => {
    setMenuVisible(null);
    setDeleteDialog({ visible: true, productId });
  };

  const hideDeleteDialog = () => {
    setDeleteDialog({ visible: false, productId: '' });
  };

  const handleDelete = async () => {
    await deleteProduct(deleteDialog.productId);
    hideDeleteDialog();
  };

  const handleEdit = (id: string) => {
    setMenuVisible(null);
    router.push(`/product/${id}`);
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
          <Text style={{color:'black',fontWeight:'900'}} variant="titleMedium">{item.name}</Text>
          <Text style={{color:'black'}} variant="bodySmall">SKU: {item.sku}</Text>
          <Text style={{color:'black',}} variant="bodySmall">Quantity: {item.quantity}</Text>
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
        <Menu
          visible={menuVisible === item.id}
          onDismiss={() => setMenuVisible(null)}
          anchor={
            <IconButton
              icon={() => <MoreVertical size={20} color="#666" />}
              onPress={() => setMenuVisible(item.id)}
              style={styles.menuButton}
            />
          }
          contentStyle={styles.menuContent}
        >
          <Menu.Item
            leadingIcon={() => <Pencil size={20} color="#666" />}
            onPress={() => handleEdit(item.id)}
            title="Edit"
            titleStyle={{ color: '#000' }}
            style={styles.menuItem}
          />
          <Menu.Item
            leadingIcon={() => <Trash2 size={20} color="#FF6B6B" />}
            onPress={() => showDeleteDialog(item.id)}
            title="Delete"
            titleStyle={{ color: '#FF6B6B' }}
            style={styles.menuItem}
          />
        </Menu>
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
        <Dialog visible={deleteDialog.visible} onDismiss={hideDeleteDialog} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Delete Product</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={styles.dialogContent}>
              Are you sure you want to delete this product? This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            <Button onPress={hideDeleteDialog} textColor="#666">Cancel</Button>
            <Button onPress={handleDelete} textColor="#FF6B6B">Delete</Button>
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
  menuButton: {
    margin: 4,
  },
  menuContent: {
    backgroundColor: '#fff',
  },
  menuItem: {
    backgroundColor: '#fff',
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
  dialog: {
    backgroundColor: '#fff',
  },
  dialogTitle: {
    color: '#000',
  },
  dialogContent: {
    color: '#666',
  },
  dialogActions: {
    backgroundColor: '#fff',
  },
});