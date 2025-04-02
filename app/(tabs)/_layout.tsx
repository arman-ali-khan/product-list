import { Tabs } from 'expo-router';
import { Package2, ListPlus, Search } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#007AFF',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Products',
          tabBarIcon: ({ size, color }) => (
            <Package2 size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add Product',
          tabBarIcon: ({ size, color }) => (
            <ListPlus size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ size, color }) => (
            <Search size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}