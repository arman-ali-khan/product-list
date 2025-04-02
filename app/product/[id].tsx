import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useProductStore } from '../../store/useProductStore';
import { useLocalSearchParams, router } from 'expo-router';

export default function EditProductScreen() {
  const { id } = useLocalSearchParams();
  const { products, updateProduct } = useProductStore();
  const product = products.find(p => p.id === id);

  const [name, setName] = useState(product?.name || '');
  const [quantity, setQuantity] = useState(product?.quantity.toString() || '');
  const [buyingPrice, setBuyingPrice] = useState(product?.buyingPrice.toString() || '');
  const [sellingPrice, setSellingPrice] = useState(product?.sellingPrice.toString() || '');
  const [sku, setSku] = useState(product?.sku || '');
  const [imageUri, setImageUri] = useState(product?.imageUri || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!product) {
      router.back();
    }
  }, [product]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name) newErrors.name = 'Product name is required';
    if (!quantity) newErrors.quantity = 'Quantity is required';
    if (!buyingPrice) newErrors.buyingPrice = 'Buying price is required';
    if (!sellingPrice) newErrors.sellingPrice = 'Selling price is required';
    if (!sku) newErrors.sku = 'SKU is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !product) return;

    await updateProduct({
      ...product,
      name,
      quantity: parseInt(quantity),
      buyingPrice: parseFloat(buyingPrice),
      sellingPrice: parseFloat(sellingPrice),
      sku,
      imageUri,
    });

    router.back();
  };

  if (!product) return null;

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Product Name"
        value={name}
        onChangeText={setName}
        error={!!errors.name}
        style={styles.input}
      />
      {errors.name && <Text style={styles.error}>{errors.name}</Text>}

      <TextInput
        label="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        error={!!errors.quantity}
        style={styles.input}
      />
      {errors.quantity && <Text style={styles.error}>{errors.quantity}</Text>}

      <TextInput
        label="Buying Price"
        value={buyingPrice}
        onChangeText={setBuyingPrice}
        keyboardType="decimal-pad"
        error={!!errors.buyingPrice}
        style={styles.input}
      />
      {errors.buyingPrice && <Text style={styles.error}>{errors.buyingPrice}</Text>}

      <TextInput
        label="Selling Price"
        value={sellingPrice}
        onChangeText={setSellingPrice}
        keyboardType="decimal-pad"
        error={!!errors.sellingPrice}
        style={styles.input}
      />
      {errors.sellingPrice && <Text style={styles.error}>{errors.sellingPrice}</Text>}

      <TextInput
        label="SKU"
        value={sku}
        onChangeText={setSku}
        error={!!errors.sku}
        style={styles.input}
      />
      {errors.sku && <Text style={styles.error}>{errors.sku}</Text>}

      <Button mode="contained" onPress={pickImage} style={styles.button}>
        Change image
      </Button>

      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        Update Product
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
});