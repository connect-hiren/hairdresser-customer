import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {MFWebView, MFSettings, MFTheme} from 'myfatoorah-reactnative';

import SplashScreen from '../screens/SplashScreen';
import Login from '../screens/Login';
import CreateAc from '../screens/CreateAc';
import ForgotPassword from '../screens/ForgotPassword';
import CreatePass from '../screens/CreatePass';
import DashboardTab from './DashboardTab';
import OrderDetails from '../screens/OrderDetails';
import PaymentPage from '../component/PaymentPage';
import PaymentScreen from '../screens/Payment';
import ResponseScreen from '../component/ResponseScreen';

const Stack = createStackNavigator();
export default MainNavigator = () => {
  return (
    <NavigationContainer
      gestureHandlerProps={false}
    >
      <Stack.Navigator
        gestureHandlerProps={false}
        mode="card"
        headerMode={'none'}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="CreateAc" component={CreateAc} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="CreatePass" component={CreatePass} />
        <Stack.Screen name="DashboardTab" component={DashboardTab} />
        <Stack.Screen name="OrderDetails" component={OrderDetails} />
        <Stack.Screen
          name="PaymentPage"
          component={PaymentPage}
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
        name="MFWebView"
        component={MFWebView}
        options={MFWebView.navigationOptions}
      />
        <Stack.Screen
          name="ResponseScreen"
          component={ResponseScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
