import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {HomeScreen, ProfileScreen} from '../screens';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AppBar} from '../components';

import {TabBarIcon} from '../components';
import {Colors} from '../styles';
import AuthScreen from '../screens/Auth';
import ProductScreen from '../screens/Profile/screen';
import AddProductScreen from '../screens/AddProduct';
import {getIsTabBarVisible} from '../utils/Utils';
import EditDeleteProductScreen from '../screens/EditDeleteProduct';
import DetailProductScreen from '../screens/DetailProduct';
import ScanProductScreen from '../screens/ScanProduct';
import ReportScreen from '../screens/Report';
import UserLoginScreen from '../screens/AuthUser';
import UserSignupScreen from '../screens/AuthUserRegister';
import UserHomeScreen from '../screens/UserHome';
import UserProductScreen from '../screens/UserProduct/screen';
import RequestProductScreen from '../screens/CreateRequest';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export const InitStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={'Auth'}
        component={AuthScreen}
        options={{
          title: 'Masuk',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'Dashboard'}
        component={TabStack}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export const TabStack = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: props => <TabBarIcon {...props} route={route} />,
        tabBarVisible: getIsTabBarVisible(route),
      })}
      tabBarOptions={{
        activeTintColor: Colors.COLOR_PRIMARY,
        inactiveTintColor: Colors.COLOR_GRAY,
      }}>
      <Tab.Screen
        name={'Home'}
        component={HomeStack}
        options={{
          title: 'Dashboard',
        }}
      />
      <Tab.Screen name={'Product'} component={ProductStack} />
    </Tab.Navigator>
  );
};

export const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeInit"
        component={HomeScreen}
        options={{
          title: 'Dashboard',
        }}
      />
      <Stack.Screen
        name="Report"
        component={ReportScreen}
        options={{
          title: 'Laporan',
        }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={DetailProductScreen}
        options={{
          title: 'Detail Permintaan',
        }}
      />
      <Stack.Screen
        name="ScanProduct"
        component={ScanProductScreen}
        options={{
          title: 'Scan',
        }}
      />
    </Stack.Navigator>
  );
};

export const ProductStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProductInit"
        component={ProductScreen}
        options={{
          title: 'Product',
        }}
      />

      <Stack.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{
          title: 'Tambah Product',
        }}
      />

      <Stack.Screen
        name="EditDeleteProduct"
        component={EditDeleteProductScreen}
        options={{
          title: 'Ubah Product',
        }}
      />
    </Stack.Navigator>
  );
};

//USER STACK NAVIGATOR

export const InitUserStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={'Auth'}
        component={UserLoginScreen}
        options={{
          title: 'Masuk',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'AuthRegister'}
        component={UserSignupScreen}
        options={{
          title: 'Daftar',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'UserHome'}
        component={UserTabStack}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'Dashboard'}
        component={TabStack}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export const UserTabStack = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: props => <TabBarIcon {...props} route={route} />,
        tabBarVisible: getIsTabBarVisible(route),
      })}
      tabBarOptions={{
        activeTintColor: Colors.COLOR_PRIMARY,
        inactiveTintColor: Colors.COLOR_GRAY,
      }}>
      <Tab.Screen
        name={'Home'}
        component={UserHomeStack}
        options={{
          title: 'Permintaan',
        }}
      />
      <Tab.Screen name={'Product'} component={UserProductStack} />
    </Tab.Navigator>
  );
};

export const UserHomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeInit"
        component={UserHomeScreen}
        options={{
          title: 'Permintaan',
        }}
      />
      <Stack.Screen
        name="Report"
        component={ReportScreen}
        options={{
          title: 'Laporan',
        }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={DetailProductScreen}
        options={{
          title: 'Detail Permintaan',
        }}
      />
      <Stack.Screen
        name="ScanProduct"
        component={ScanProductScreen}
        options={{
          title: 'Scan',
        }}
      />
    </Stack.Navigator>
  );
};

export const UserProductStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProductInit"
        component={UserProductScreen}
        options={{
          title: 'Barang',
        }}
      />

      <Stack.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{
          title: 'Tambah Product',
        }}
      />

      <Stack.Screen
        name="RequestProduct"
        component={RequestProductScreen}
        options={{
          title: 'Detail Barang',
        }}
      />
    </Stack.Navigator>
  );
};
