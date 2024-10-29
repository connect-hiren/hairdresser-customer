import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {MFWebView, MFSettings, MFTheme} from 'myfatoorah-reactnative';

import FastImage from 'react-native-fast-image';
import config from '../config';
import Home from '../screens/Home';
import CartItem from '../screens/CartItem';
import Notification from '../screens/Notification';
import WishList from '../screens/WishList';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfile from '../screens/ProfileScreen/EditProfile';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
import { isIphoneX } from '../Util/Utilities';
import VendorView from '../screens/VendorView';
import OrderHistory from '../screens/OrderHistory';
import NearByDresser from '../screens/NearByDresser';
import OrderReview from '../screens/OrderReview';
import Checkout from '../screens/Checkout';
import OrderDetails from '../screens/OrderDetails';
import Wallet from '../screens/Wallet';
import ChangePass from '../screens/ProfileScreen/ChangePass';
import PaymentScreen from '../screens/Payment';

import ContactUs from '../screens/ContactUs';
import ChangeLocation from '../screens/ChangeLocation';
import PaymentPage from '../component/PaymentPage';
import ResponseScreen from '../component/ResponseScreen';
import CustomTab from '../component/CustomTab';

import 'react-native-gesture-handler';
const HomeScreenStack = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CartItem"
        component={CartItem}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ChangeLocation"
        component={ChangeLocation}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ContactUs"
        component={ContactUs}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="VendorView"
        component={VendorView}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="NearByDresser"
        component={NearByDresser}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="OrderReview"
        component={OrderReview}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PaymentScreen"
        component={PaymentScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PaymentPage"
        component={PaymentPage}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ResponseScreen"
        component={ResponseScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Checkout"
        component={Checkout}
        options={{
          headerShown: false,
        }}
      />
      {/* <Stack.Screen
        name="OrderDetails"
        component={OrderDetails}
        options={{
          headerShown: false,
        }}
      /> */}
      <Stack.Screen
        name="Wallet"
        component={Wallet}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MFWebView"
        component={MFWebView}
        options={MFWebView.navigationOptions}
      />
      <Stack.Screen
        name="homeOrders"
        component={OrderFlowScreenStack}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
    // </NavigationContainer>
  );
};


const WishListScreenStack = () => {
  return (
    <Stack.Navigator initialRouteName="WishList">
      <Stack.Screen
        name="WishList"
        component={WishList}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="VendorView"
        component={VendorView}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
    // </NavigationContainer>
  );
};

const OrderFlowScreenStack = () => {
  return (
    <Stack.Navigator initialRouteName="OrderHistory">
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistory}
        options={{
          headerShown: false,
        }}
      />
      {/* <Stack.Screen
        name="OrderDetails"
        component={OrderDetails}
        options={{
          headerShown: false,
        }}
      /> */}
    </Stack.Navigator>
    // </NavigationContainer>
  );
};

const ProfileScreenStack = () => {
  return (
    <Stack.Navigator initialRouteName="ProfileScreen">
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ChangePass"
        component={ChangePass}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
    // </NavigationContainer>
  );
};

export default DashboardTab = () => {
  return (
    <Tab.Navigator
      initialRouteName={'scissor'}
      screenOptions={({ route, }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'ball') {
            return (
              <FastImage
                resizeMode={'contain'}
                style={styles.iconStyle}
                source={require('../assets/images/bell.png')}
              />
            );
          } else if (route.name === 'heart') {
            return (
              <FastImage
                resizeMode={'contain'}
                style={styles.iconStyle}
                source={require('../assets/images/heart.png')}
              />
            );
          } else if (route.name === 'scissor') {
            return (
              <FastImage
                resizeMode={'contain'}
                style={styles.iconBigStyle}
                source={require('../assets/images/scissor.png')}
              />
            );
          } else if (route.name === 'orders') {
            return (
              <FastImage
                resizeMode={'contain'}
                style={styles.iconStyle}
                source={require('../assets/images/editProfile.png')}
              />
            );
          } else if (route.name === 'profile') {
            return (
              <FastImage
                resizeMode={'contain'}
                style={styles.iconStyle}
                source={require('../assets/images/profile.png')}
              />
            );
          }
        },
      })}
      tabBarOptions={{
        keyboardHidesTabBar: true,
        showLabel: false,
        activeTintColor: 'white',
        inactiveTintColor: 'white',
        labelStyle: {
          fontSize: 14,
          //marginTop: 5,
        },
        style: {
          height: Platform.OS == 'ios' ? (isIphoneX() ? 85 : 60) : 60,
          justifyContent: 'center',
          backgroundColor: config.Constant.COLOR_TAB,
          shadowColor: config.Constant.COLOR_BLACK,
          shadowOffset: {
            width: 10,
            height: 10,
          },
          shadowRadius: 20,
          shadowOpacity: 1,
          elevation: 12,
        },
      }}
      tabBar={(props) => <CustomTab {...props} />}
    >
      <Tab.Screen name="ball" component={Notification} />
      <Tab.Screen name="heart" component={WishListScreenStack} />
      <Tab.Screen name="scissor" component={HomeScreenStack} />
      <Tab.Screen name="orders" component={OrderFlowScreenStack} />
      <Tab.Screen name="profile" component={ProfileScreenStack} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    width: 24,
    height: 24,
  },
  iconBigStyle: {
    width: 30,
    height: 30,
  },
});
