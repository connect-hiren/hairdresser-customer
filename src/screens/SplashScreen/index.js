import React from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  I18nManager,
  ImageBackground,
} from 'react-native';
import config from '../../config';
import I18n from 'react-native-i18n';
import RNRestart from 'react-native-restart';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import modules from '../../modules';
var PushNotification = require('react-native-push-notification');

class SplashScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageUdate: true,
    };
    // I18nManager.forceRTL(false);
    // config.I18N.locale = 'ar';
    // I18nManager.forceRTL(true);
    // this.setState({
    //   languageUdate: true,
    // });
  }
  componentDidMount = async () => {
    //var is_arabic = await AsyncStorage.getItem('is_arabic');
     this.checkFCMPermission();

    this.getSettings();
    PushNotification.configure({
      onNotification: (notification) => {
        console.log("notification onNotification-1",{notification})
        if (!!notification.data && notification.data.order_id) {
          // this.props.navigation.navigate('OrderDetails', {
          //   order_id: notification.data.order_id,
          // });
        } else {
          // this.props.navigation.navigate('Notification');
        }
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
    });


    if (I18nManager.isRTL) {
      config.I18N.locale = 'ar';
    } else {
      config.I18N.locale = 'en';
    }
    try {
      var userData = this.props.userData;
      //if (!!userData && !!userData.userData && !!userData.userData.id) {
      config.Constant.USER_DATA = userData.userData;
      setTimeout(() => {
        this.props.navigation.reset({
          index: 1,
          routes: [{ name: 'DashboardTab' }],
        });
      }, 3000);
      // } else {
      //   setTimeout(() => {
      //     this.props.navigation.reset({
      //       index: 1,
      //       routes: [{ name: 'Login' }],
      //     });
      //   }, 3000);
      // }
    } catch (err) {
      // setTimeout(() => {
      //   this.props.navigation.reset({
      //     index: 1,
      //     routes: [{ name: 'Login' }],
      //   });
      // }, 3000);
    }
  };
  getDeviceToken = async () => {
    await messaging()
      .getToken()
      .then((fcmTkn) => {
        console.log('FCM DEVICE = ' + fcmTkn);
        config.Constant.FCM_TOKEN = fcmTkn;
      })
      .catch((err) => {
        debugger
        console.log(err);
      });
  };
  checkFCMPermission = async () => {
    const authStatus = await messaging().hasPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      this.getDeviceToken();
    } else {
      this.requestPermission();
    }
  };
  requestPermission = async () => {
    try {
      await messaging().requestPermission();
      this.getDeviceToken();
    } catch (error) { }
  };
  getSettings = async () => {

    config.Constant.showLoader.showLoader();
    const formData = new FormData();
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.SETTING,
      formData,
    );

    config.Constant.showLoader.hideLoader();
    if (data?.status_code == 200) {
      config.Constant.settingData = data.data
    } else {
    }
  };
  render() {
    return (
      <View style={styles.container}>
        {/* <TouchableOpacity
          onPress={() => {
            config.I18N.locale = 'en';
            I18nManager.forceRTL(false);
            this.setState({
              languageUdate: true,
            });
            RNRestart.Restart();
          }}>
          <Text>Change to en</Text>
        </TouchableOpacity>
        <Text>{config.I18N.t('welcomeBack')}</Text>
        <TouchableOpacity
          onPress={() => {
            config.I18N.locale = 'ar';
            I18nManager.forceRTL(true);
            this.setState({
              languageUdate: true,
            });
            RNRestart.Restart();
          }}>
          <Text>Change to db</Text>
        </TouchableOpacity> */}
        <ImageBackground
          resizeMode={'cover'}
          source={require('../../assets/images/splash_screen.png')}
          style={styles.innerContainer}></ImageBackground>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userData: state.userData,
});

export default connect(mapStateToProps)(SplashScreen);
