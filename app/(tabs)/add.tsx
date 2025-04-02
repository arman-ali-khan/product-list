import { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useProductStore } from '../../store/useProductStore';
import { router } from 'expo-router';
import { Camera, ImagePlus } from 'lucide-react-native';

const initialFormState = {
  name: '',
  quantity: '',
  buyingPrice: '',
  sellingPrice: '',
  sku: '',
  imageUri: '',
};

export default function AddProductScreen() {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { addProduct } = useProductStore();

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      updateFormData('imageUri', result.assets[0].uri);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = 'Product name is required';
    if (!formData.quantity) newErrors.quantity = 'Quantity is required';
    if (!formData.buyingPrice) newErrors.buyingPrice = 'Buying price is required';
    if (!formData.sellingPrice) newErrors.sellingPrice = 'Selling price is required';
    if (!formData.sku) newErrors.sku = 'SKU is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    await addProduct({
      name: formData.name,
      quantity: parseInt(formData.quantity),
      buyingPrice: parseFloat(formData.buyingPrice),
      sellingPrice: parseFloat(formData.sellingPrice),
      sku: formData.sku,
      imageUri: formData.imageUri,
    });

    // Reset form after successful submission
    setFormData(initialFormState);
    router.push('/');
  };

  return (
    <ScrollView style={styles.container}>
      {formData.imageUri ? (
        <Surface style={styles.imagePreviewContainer}>
          <Image source={{ uri: formData.imageUri }} style={styles.imagePreview} />
          <Button 
            mode="contained" 
            onPress={pickImage} 
            style={styles.changeImageButton}
            icon={({ size, color }) => <Camera size={size} color={color} />}
          >
            Change Image
          </Button>
        </Surface>
      ) : (
        <Button 
          mode="outlined" 
          onPress={pickImage} 
          style={styles.pickImageButton}
          icon={({ size, color }) => <ImagePlus size={size} color={color} />}
        >
          Add Product Image
        </Button>
      )}

      <TextInput
        label="Product Name"
        value={formData.name}
        onChangeText={(value) => updateFormData('name', value)}
        error={!!errors.name}
        style={styles.input}
      />
      {errors.name && <Text style={styles.error}>{errors.name}</Text>}

      <TextInput
        label="Quantity"
        value={formData.quantity}
        onChangeText={(value) => updateFormData('quantity', value)}
        keyboardType="numeric"
        error={!!errors.quantity}
        style={styles.input}
      />
      {errors.quantity && <Text style={styles.error}>{errors.quantity}</Text>}

      <TextInput
        label="Buying Price"
        value={formData.buyingPrice}
        onChangeText={(value) => updateFormData('buyingPrice', value)}
        keyboardType="decimal-pad"
        error={!!errors.buyingPrice}
        style={styles.input}
      />
      {errors.buyingPrice && <Text style={styles.error}>{errors.buyingPrice}</Text>}

      <TextInput
        label="Selling Price"
        value={formData.sellingPrice}
        onChangeText={(value) => updateFormData('sellingPrice', value)}
        keyboardType="decimal-pad"
        error={!!errors.sellingPrice}
        style={styles.input}
      />
      {errors.sellingPrice && <Text style={styles.error}>{errors.sellingPrice}</Text>}

      <TextInput
        label="SKU"
        value={formData.sku}
        onChangeText={(value) => updateFormData('sku', value)}
        error={!!errors.sku}
        style={styles.input}
      />
      {errors.sku && <Text style={styles.error}>{errors.sku}</Text>}

      <Button 
        mode="contained" 
        onPress={handleSubmit} 
        style={styles.submitButton}
      >
        Add Product
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
  imagePreviewContainer: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  changeImageButton: {
    margin: 8,
  },
  pickImageButton: {
    marginBottom: 16,
    height: 200,
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderWidth: 2,
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 32,
  },
  error: {
    color: 'red',
    marginBottom: 8,
    fontSize: 12,
  },
});