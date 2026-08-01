import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from './src/screens/HomeScreen.tsx';
import ScanScreen from './src/screens/ScanScreen';
import ManualEntryScreen from './src/screens/ManualEntryScreen';
import PageHeader from './src/components/PageHeader';

const Drawer = createDrawerNavigator();

type DrawerIconProps = {
  color: string;
};

const DummyScreen = ({ title }: { title: string }) => {
  return (
    <SafeAreaView style={styles.dummyWrap}>
      <PageHeader title={title} />

      <View style={styles.dummyContent}>
        <Text style={styles.dummyTitle}>{title}</Text>
        <Text style={styles.dummyBody}>
          This page is ready. You can connect real functionality here.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const makeDummyComponent = (title: string) => {
  return function DummyPage() {
    return <DummyScreen title={title} />;
  };
};

const makeDrawerIcon = (iconName: string) => {
  return ({ color }: DrawerIconProps) => (
    <MaterialCommunityIcons name={iconName} size={24} color={color} />
  );
};

// Keep drawer simple: only a few top-level items the user requested
const menuItems = [
  { name: 'Profile', icon: 'account-circle-outline' },
  { name: 'Settings', icon: 'cog-outline' },
  { name: 'About App', icon: 'information' },
  { name: 'Contact Us', icon: 'email-outline' },
  { name: 'Privacy Policy', icon: 'shield-check-outline' },
];

const drawerScreens = menuItems.map(item => ({
  ...item,
  component: makeDummyComponent(item.name),
  drawerIcon: makeDrawerIcon(item.icon),
}));

const authenticatorDrawerIcon = makeDrawerIcon('shield-account-outline');

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0B1220" />
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Authenticator"
          screenOptions={{
            headerShown: false,
            drawerType: 'front',
            drawerActiveTintColor: '#E2E8F0',
            drawerInactiveTintColor: '#94A3B8',
            drawerLabelStyle: {
              fontSize: 18,
              marginLeft: -18,
              fontWeight: '500',
            },
            drawerStyle: {
              backgroundColor: '#0F172A',
              width: '82%',
            },
            drawerActiveBackgroundColor: '#1E293B',
            sceneStyle: {
              backgroundColor: '#0B1220',
            },
          }}
        >
          <Drawer.Screen
            name="Authenticator"
            component={HomeScreen}
            options={{
              drawerIcon: authenticatorDrawerIcon,
            }}
          />

          {/* Hidden routes used for full-screen scan/manual entry navigation */}
          <Drawer.Screen
            name="Scan"
            component={ScanScreen}
            options={{ drawerItemStyle: { height: 0 } }}
          />

          <Drawer.Screen
            name="ManualEntry"
            component={ManualEntryScreen}
            options={{ drawerItemStyle: { height: 0 } }}
          />

          {drawerScreens.map(item => (
            <Drawer.Screen
              key={item.name}
              name={item.name}
              component={item.component}
              options={{
                drawerIcon: item.drawerIcon,
              }}
            />
          ))}
        </Drawer.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  dummyWrap: {
    flex: 1,
    backgroundColor: '#0B1220',
  },
  dummyContent: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  dummyTitle: {
    fontSize: 28,
    color: '#E2E8F0',
    fontWeight: '700',
  },
  dummyBody: {
    marginTop: 10,
    color: '#94A3B8',
    fontSize: 16,
    lineHeight: 24,
  },
});

export default App;
