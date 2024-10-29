import React from 'react';
import {
  BackHandler,
  StatusBar,
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  ScrollView,
  I18nManager,
  ImageBackground,
  Linking,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import config from '../../config';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import Ripple from 'react-native-material-ripple';
import styles from './styles';
import Dialog, { SlideAnimation, DialogContent } from 'react-native-popup-dialog';
import RNExitApp from 'react-native-exit-app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import { connect } from 'react-redux';
import * as UserDataActions from '../../Redux/actions/userData';
import Geolocation from 'react-native-geolocation-service';
import { getRoundOf, sendNotification } from '../../Util/Utilities';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import CustomButton from '../../component/CustomButton';
import Constant from '../../config/Constant';
import modules from '../../modules';

var PushNotification = require('react-native-push-notification');

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageUdate: true,
      isRTL: config.Constant.isRTL,
      isMenuOpen: false,
      ViewHeight: 0,
      is_arabic: 'english',
      catArr: [],
      dresserArr: [],
      bannerList: [],
      previousHairderArr: [],
      latitude: null,
      longitude: null,
      isFetching: false,

      country: 'IN',
      first_name: 'John',
      last_name: 'Doe',
      address: '101 ABC Street',
      city: 'Kolkata',
      state: 'West Bengal',
      zip: '700001',
      phone_number: '9001010101',
      customerEmail: 'test@test.com',
      udf2: Constant.responseUrl,
      udf3: 'en',
      trackid: '1',
      tranid: '',
      currency: 'SAR',
      amount: '1.00',
      action: 1,
      tokenOperation: 'A',
      cardToken: '',
      maskCardNum: '',
      tokenizationType: 0,
    };
  }

  requestOrder = () => {
    const {
      country,
      first_name,
      last_name,
      address,
      city,
      state,
      zip,
      phone_number,
      customerEmail,
      udf2,
      udf3,
      trackid,
      tranid,
      currency,
      amount,
      action,
      tokenOperation,
      cardToken,
      maskCardNum,
      tokenizationType,
    } = this.state;
    this.props.navigation.navigate('PaymentScreen', {
      request: {
        country: country,
        first_name: first_name,
        last_name: last_name,
        address: address,
        city: city,
        state: state,
        zip: zip,
        phone_number: phone_number,
        customerEmail: customerEmail,
        udf2: udf2,
        udf3: udf3,
        trackid: trackid,
        tranid: tranid,
        currency: currency,
        amount: amount,
        action: action,
        tokenOperation: tokenOperation,
        cardToken: cardToken,
        maskCardNum: maskCardNum,
        tokenizationType: tokenizationType,
      },
      callBack: this.onProcessPayment,
    });
  };

  onProcessPayment = (responseData) => {
    if (responseData.status == 'success') {
      this.props.navigation.navigate('ResponseScreen', {
        response: responseData.data,
      });
    } else {
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('error'),
        responseData.error,
      );
    }
  };

  componentDidMount = async () => {
    let userData = this.props.userData;

      // console.log("PushNotification.configure calling")
      // PushNotification.configure({
      //   onNotification: (notification) => {
      //     console.log("notification onNotification-1",{notification})
      //     if (!!notification.data && notification.data.order_id) {
      //       // this.props.navigation.navigate('OrderDetails', {
      //       //   order_id: notification.data.order_id,
      //       // });
      //     } else {
      //       // this.props.navigation.navigate('Notification');
      //     }
      //     notification.finish(PushNotificationIOS.FetchResult.NoData);
      //   },
      // });
    
    this.getSettings(false);
    try {
      // console.log("this.props.route- ", this.props.route)
      config.Constant.RootNavigation = this.props.navigation;
      config.Constant.Route = this.props.route
      config.Constant.socket.connect();
      // if (!!config.Constant.USER_DATA.id) {
      //   config.Constant.socket.emit('room', config.Constant.USER_DATA.id);
      // }
    } catch (error) { }
    var is_arabic = await AsyncStorage.getItem('is_arabic');
    if (!!is_arabic) {
      this.setState({
        is_arabic: is_arabic,
      });
    }
    if (!!userData && !!userData.userData && !!userData.userData.id) {
      this.GetUserData(false);
      this.getPreviousImage(false);
      this.getPendingOrders(false);
    }
    await this.getBannerImage(false);
    await this.getLiveLatLng(false);
    await this.catData(false);
    await this.getNearByDresser(false);
    


    this.props.navigation.addListener('focus', async () => {

      let userData = this.props.userData;

      BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);

      if (!config.Constant.USER_DATA) {

      } else if (!!userData && !!userData.userData && !!userData.userData.id) {
        this.getLiveLatLng();
        await this.GetUserData(false);
        await this.getPreviousImage(false);
        await this.getPendingOrders(false);

        this.setState(
          {
            address: config.Constant.USER_DATA.address,
            latitude: config.Constant.USER_DATA.latitude,
            longitude: config.Constant.USER_DATA.longitude,
          }, () => {
            this.getNearByDresser(false);
          });
      }
    });
    this.props.navigation.addListener('blur', () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.hardwareBackPress,
      );
    });
    this.getNotificationClass();
  };
  componentDidUpdate=()=> {
    if(config.Constant?.USER_DATA){
      config.Constant.USER_DATA.order_id= undefined
    }
    
  }
  onRefresh() {
    this.setState({ isFetching: true }, () => {
      if (
        !config.Constant?.USER_DATA?.latitude ||
        !config.Constant?.USER_DATA?.longitude ||
        !config.Constant?.USER_DATA?.address
      ) {
        this.getLiveLatLng();
      } else {
        this.setState(
          {
            address: config.Constant?.USER_DATA?.address,
            latitude: config.Constant?.USER_DATA?.latitude,
            longitude: config.Constant?.USER_DATA?.longitude,
          },
          () => {
            this.getNearByDresser();
          },
        );
      }
    });
  }
getPendingOrders = async (loaderToggle=true) => {
    const formData = new FormData();
    loaderToggle && config.Constant.showLoader.showLoader();
    var data = await modules.APIServices.PostApiCall2(
      config.ApiEndpoint.CHECK_ONGOING_ORDER,
      formData,
    );
    loaderToggle && config.Constant.showLoader.hideLoader();
    if (data?.status_code == 200 && !!data.data) {
      // this.props.navigation.navigate('OrderDetails', {
      //   order_id: data.data.id,
      // });
      //  config.Constant.USER_DATA.order_id = data.data.id
      this.props.navigation.reset({
        index: 1,
        routes: [{ name: 'OrderDetails', params: { order_id: data.data.id } }],
      });
    } else {
    }
  };
  hardwareBackPress = () => {
    BackHandler.exitApp();
  };
  getNotificationClass = () => {
    messaging().onMessage(async (remoteMessage) => {
      //Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      //TODO getting here when app in foreground
      console.log("notification getNotificationClass-1",{remoteMessage})
      sendNotification(
        remoteMessage.notification.title,
        remoteMessage.notification.body,
      );
    });
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log("notification getNotificationClass-2", {remoteMessage})
      // console.log(
      //   'Notification caused app to open from background state:',
      //   remoteMessage,
      // );
      if (!!remoteMessage.data && remoteMessage.data.order_id) {
        this.props.navigation.navigate('OrderDetails', {
          order_id: remoteMessage.data.order_id,
        });
      } else {
        // this.props.navigation.navigate('Notification');
      }
      //navigation.navigate(remoteMessage.data.type);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'notification Notification caused app to open from quit state:',
            {remoteMessage},
          );
          
          if (!!remoteMessage.data && remoteMessage.data.order_id) {
            this.props.navigation.navigate('OrderDetails', {
              order_id: remoteMessage.data.order_id,
            });
          } else {
            this.props.navigation.navigate('Notification');
          }
          //setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
      });
  };

  getNearByDresser = async (loaderToggle=true) => {
    loaderToggle && config.Constant.showLoader.showLoader();
    const formData = new FormData();
    formData.append('latitude', this.state.latitude);
    formData.append('longitude', this.state.longitude);

    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.GET_NEAR_BY_DRESSER_DASHBOARD,
      formData,
    );
    config.Constant.showLoader.hideLoader();
    if (data?.status_code == 200) {
      this.setState({
          isFetching: false,
          dresserArr: data.data,
        }
      );
    } else {
      this.setState({
          isFetching: false,
          dresserArr: [],
        }
      );
    }
  };
  getBannerImage = async (loaderToggle = true) => {
    if (this.state.bannerList.length < 1 && loaderToggle) {
      config.Constant.showLoader.showLoader();
    }

    const formData = new FormData();
    formData.append('id', '1');
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.GET_BANNER,
      formData,
    );

    loaderToggle && config.Constant.showLoader.hideLoader();
    // console.log("Home --3 ")
    if (data?.status_code == 200) {
      //alert(JSON.stringify(data.data));
      this.setState(
        {
          bannerList: data.data,
        },
        () => {
          //this.updatePrice();
        },
      );
    } else {
    }
  };
  getPreviousImage = async (loaderToggle=true) => {
    loaderToggle && config.Constant.showLoader.showLoader();
    const formData = new FormData();
    formData.append('id', '1');
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.GET_PRIOUS_DRESSER,
      formData,
    );
    console.log(data, "previous data")
    loaderToggle && config.Constant.showLoader.hideLoader();
    // console.log("Home --4 ")
    if (data?.status_code == 200) {
      //alert(JSON.stringify(data.data));
      this.setState(
        {
          previousHairderArr: data.data,
        },
        () => {
          //this.updatePrice();
        },
      );
    } else {
    }
  };
  getSettings = async (loaderToggle = true) => {

    config.Constant.showLoader.showLoader();
    const formData = new FormData();
    formData.append('role_id', 2);
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.SETTING,
      formData,
    );
    console.log(data, 'setting data')

    loaderToggle && config.Constant.showLoader.hideLoader();
    // console.log("Home --5 ")
    if (data?.status_code == 200) {
      config.Constant.settingData = data.data;
    } else {
      // modules.DropDownAlert.showAlert(
      //   'error',
      //   config.I18N.t('error'),
      //   data.message,
      // );
    }
  };
  GetUserData = async (loaderToggle=true) => {
    const formData = new FormData();
    formData.append('id', '1');
    loaderToggle && config.Constant.showLoader.showLoader();
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.GET_PROFILE,
      formData,
    );
    loaderToggle && config.Constant.showLoader.hideLoader();
    // console.log("Home --6 ")
    if (data?.status_code == 200) {
      try {
        var token = config.Constant.USER_DATA.token;
        config.Constant.USER_DATA = data.data;
        config.Constant.USER_DATA.token = token;
        var userData = this.props.userData;
        if (!!userData && !!userData.userData && !!userData.userData.id) {
          userData.userData = data.data;
          this.props.dispatch(UserDataActions.setUserData(userData.userData));
        }
      } catch (error) { }
    }
  };
  hasLocationPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      // modules.DropDownAlert.showAlert(
      //   'error',
      //   config.I18N.t('error'),
      //   config.I18N.t('locationError'),
      //   null,
      //   null,
      //   () => {
      //     setTimeout(() => {
      //       if (Platform.OS == 'ios') {
      //         RNExitApp.exitApp();
      //       } else {
      //         BackHandler.exitApp();
      //       }
      //     }, 2000);
      //   },
      //   'Close Application'
      // );
    }

    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
        '',
        [
          { text: 'Go to Settings', onPress: openSetting },
          { text: "Don't Use Location", onPress: () => { } },
        ],
      );
    }

    return false;
  };
  hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await this.hasLocationPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };
  getLiveLatLng = async () => {

    let userData = this.props.userData;
    const hasLocationPermission = await this.hasLocationPermission();
    if (!hasLocationPermission) {
      return;
    }
    Geolocation.getCurrentPosition(
      async (position) => {
        // console.log(position, "position")
        // config.Constant.showLoader.hideLoader();
        await this.setState({
          isFetching: false,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        try {
          // console.log(!userData && !userData.userData && !userData.userData.id, "dfghdfgh")
          //if (!userData && !userData.userData && !userData.userData.id) {
          this.onMaLocationUpdate(
            position.coords.latitude,
            position.coords.longitude,
          );
         
        } catch (e) {
          //alert(e);
          config.Constant.showLoader.hideLoader();
        }
      },
      (error) => {
        //alert(error);
        config.Constant.showLoader.hideLoader();
      },
      { enableHighAccuracy: false, maximumAge: 1000, timeout: 50000 },
    );
  };
  onMaLocationUpdate = (lat, lng) => {
    // console.log('onMaLocationUpdate111-  ', {lat,lng})
    var apiLink =
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
      lat +
      ',' +
      lng +
      '&key=' +
      config.Constant.MAP_KEY;

    fetch(apiLink)
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log('onMaLocationUpdate111-  ', responseJson)
        if (responseJson.results.length > 0) {
          this.setState(
            {
              address: responseJson.results[0].formatted_address,
              latitude: lat,
              longitude: lng,
            },
            () => {
              this.getNearByDresser();
              if (config.Constant.USER_DATA) {
                this.updateProfile(
                  lat,
                  lng,
                  responseJson.results[0].formatted_address,
                );
              }
            },
          );
        }
      });
  };
  updateProfile = async (latitude, longitude, address) => {
    if (
      config.Constant.USER_DATA
    ) {

      const formData = new FormData();
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('address', address);
      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.UPDATE_PROFILE,
        formData,
      );
      // console.log("Home --7 ")
      if (data?.status_code == 200) {
        try {
          config.Constant.USER_DATA.latitude = data.data.latitude;
          config.Constant.USER_DATA.longitude = data.data.longitude;
          config.Constant.USER_DATA.address = data.data.address;

          var userData = this.props.userData;
          if (!!userData && !!userData.userData && !!userData.userData.id) {
            userData.userData.latitude = data.data.latitude;
            userData.userData.longitude = data.data.longitude;
            userData.userData.address = data.data.address;

            this.props.dispatch(UserDataActions.setUserData(userData.userData));
          }
        } catch (error) { }
      }
    }
  };
  catData = async (loaderToggle = true) => {
    if (this.state.catArr.length < 1 && loaderToggle) {
      config.Constant.showLoader.showLoader();
    }
    const formData = new FormData();
    formData.append('role_id', 2);
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.categoryList,
      formData,
    );
    // console.log(data, "catData")
    loaderToggle && config.Constant.showLoader.hideLoader();
    // console.log("Home --8 ")
    if (data?.status_code == 200) {
      this.setState({
        catArr: data.data,
      });
    } else {
      // console.log("HomeScreen...1")
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('error'),
        data.message,
      );
    }
  };
  logout = () => {
    config.Constant.USER_DATA = {
      token: '',
    };
    this.props.dispatch(UserDataActions.setUserData(null));
    // this.props.navigation.reset({
    //   index: 1,
    //   routes: [{ name: 'DashboardTab' }],
    // });
    this.setState({
      isMenuOpen: false,
    });
  };

  menuView = () => {
    let userData = this.props.userData;
    return (
      <ImageBackground
        resizeMode={'cover'}
        source={require('../../assets/images/sidecircle.png')}
        // useNativeDriver
        // animation={!this.state.isMenuOpen ? 'fadeOutUp' : 'fadeInDownBig'}
        style={styles.menuView}>
        <View
          onLayout={(event) => {
            var { x, y, width, height } = event.nativeEvent.layout;
            this.setState({
              ViewHeight: height,
            });
          }}
          style={{ backgroundColor: 'transparent', borderRadius: 50 }}>
          <Image
            resizeMode={'contain'}
            style={styles.menuIconImg}
            source={require('../../assets/images/logo.png')}
          />
          <View
            onTouchStart={() => {
              this.setState({
                isMenuOpen: false,
              });
              if (!!userData && !!userData.userData && !!userData.userData.id) {
                this.props.navigation.navigate('homeOrders');
              } else {
                this.props.navigation.navigate('Login');
              }
            }}
            style={[styles.menuOptionView, { marginTop: 30 }]}>
            <Text style={styles.menuTitleTxt}>{config.I18N.t('myorders')}</Text>
          </View>
          <View
            onTouchStart={() => {
              this.setState({
                isMenuOpen: false,
              });
              if (!!userData && !!userData.userData && !!userData.userData.id) {
                this.props.navigation.navigate('Wallet');
              } else {
                this.props.navigation.navigate('Login');
              }
            }}
            style={styles.menuOptionView}>
            <Text style={styles.menuTitleTxt}>{config.I18N.t('wallet')}</Text>
          </View>
          <View
            onTouchStart={() => {
              this.setState({
                isMenuOpen: false,
              });
              // if (!!userData && !!userData.userData && !!userData.userData.id) {
              this.props.navigation.navigate('ContactUs');
              // } else {
              //   this.props.navigation.navigate('Login');
              // }
            }}
            style={styles.menuOptionView}>
            <Text style={styles.menuTitleTxt}>{config.I18N.t('support')}</Text>
          </View>
          <View
            onTouchStart={async () => {
              this.setState({
                isMenuOpen: false,
              });
              if (this.state.is_arabic == 'english') {
                await AsyncStorage.setItem('is_arabic', 'arabic');
                config.I18N.locale = 'ar';
                I18nManager.forceRTL(true);
                RNRestart.Restart();
              } else {
                await AsyncStorage.setItem('is_arabic', 'english');
                config.I18N.locale = 'en';
                I18nManager.forceRTL(false);
                RNRestart.Restart();
              }
            }}
            style={styles.menuOptionView}>
            <Text style={styles.menuTitleTxt}>
              {config.Constant.isRTL
                ? config.I18N.t('SwitchToEnglish')
                : config.I18N.t('SwitchToArabic')}
            </Text>
          </View>

          <View
            onTouchStart={() => {
              this.setState({
                isMenuOpen: false,
              });
              this.logout();
            }}
            style={[styles.menuOptionView, { marginTop: 20 }]}>
            {!!userData && !!userData.userData && !!userData.userData.id
              ?
              <View>
                <Image
                  resizeMode={'contain'}
                  style={styles.logoutIconImg}
                  source={require('../../assets/images/logout.png')}
                />
                <Text style={styles.menuTitleTxt}>{config.I18N.t('logout')}</Text>
              </View>
              :
              <View
                style={[styles.menuOptionView, { marginTop: 20 }]}>
                <View style={styles.logoutIconImg}>
                </View>
              </View>
            }
          </View>

        </View>
      </ImageBackground>
    );
  };
  serviceRenderRow = ({ item, index }) => {
    let userData = this.props.userData;
    return (
      <Ripple
        onPress={() => {
          if (!!userData && !!userData.userData && !!userData.userData.id) {
            this.props.navigation.navigate('CartItem'); //CartItem -  OrderReview
          } else {
            this.props.navigation.navigate('Login');
          }
        }}
        style={styles.serviceView}>
        <FastImage
          source={
            !!item.image && { uri: config.Constant.CAT_IMAGE_URL + item.image }
          }
          style={{ width: 60, height: 60 }}
          resizeMode={'cover'}
        />
        <Text style={styles.serviceName}>{config.I18N.locale == 'en' ? item.name : item.ar_name}</Text>
      </Ripple>
    );
  };
  packageRenderRow = ({ item, index }) => {
    return (
      <Ripple style={styles.serviceView}>
        <Image
          resizeMode={'cover'}
          source={
            !!item && !!item.image
              ? {
                uri: config.Constant.BANNER_URL + '' + item.image,
              }
              : require('../../assets/images/no_image.png')
          }
          style={{ width: config.Constant.SCREEN_WIDTH * 0.85, height: 180 }}
        />
      </Ripple>
    );
  };
  dresserRenderRow = ({ item, index }) => {
    let userData = this.props.userData;
    return (
      <TouchableOpacity
        style={{ zIndex: 1 }}
        onPress={() => {
          this.props.navigation.navigate('VendorView', {
            user_id: item.id,
            dataSource: item,
          });
        }}
        style={styles.packageView}>
        <FastImage
          resizeMode={'cover'}
          source={
            !!item && !!item.image
              ? {
                uri: config.Constant.UsersProfile_Url + '' + item.image,
              }
              : require('../../assets/images/no_image.png')
          }
          style={{ width: '100%', height: 100 }}
        />
        <View style={styles.dresserRowViewStyle}>
          <Text style={styles.dresserName}>{item.name}</Text>

          {!!item.reviews && (
            <Image
              styles={{ width: 10, height: 10 }}
              resizeMode={'contain'}
              source={require('../../assets/images/star.png')}
            />
          )}
          <Text style={styles.startView}>
            {!!item.avg_rating &&
              item.avg_rating.length > 0 &&
              !!item.avg_rating[0].avg_rating
              ? Math.round(item.avg_rating[0].avg_rating*10)/10
              : '4'}
          </Text>
          {!!item.reviews && item.reviews.length > 0 && (
            <Text style={styles.reviewView}>
              (
              {!!item.reviews && item.reviews.length > 0
                ? item.reviews.length
                : ''}
              )
            </Text>
          )}
        </View>
        <View
          style={[
            styles.dresserRowViewStyle,
            { justifyContent: 'flex-start', alignItems: 'flex-start' },
          ]}>
          <Text style={styles.kgView}>
            {!!item.distance ? getRoundOf(item.distance) : '0'} km{' '}
            {config.I18N.t('away')}
          </Text>
          <TouchableOpacity
            style={{ zIndex: 2 }}
            onPress={() => {
              if (!!userData && !!userData.userData && !!userData.userData.id) {
                this.props.navigation.navigate('CartItem', {
                  dataSource: item,
                }); // CartItem
              } else {
                this.props.navigation.navigate('Login');
              }
            }}>
            <Text style={styles.btnView}>{config.I18N.t('bookNow')}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };
  userRenderRow = ({ item, index }) => {
    return (
      <Ripple
        onPress={() => {
          this.props.navigation.navigate('VendorView', {
            user_id: item.hairdresser.id,
          });
        }}
        style={styles.userView}>
        <Image
          resizeMode={'cover'}
          source={
            !!item.hairdresser && !!item.hairdresser.image
              ? {
                uri:
                  config.Constant.UsersProfile_Url +
                  '' +
                  item.hairdresser.image,
              }
              : require('../../assets/images/no_image.png')
          }
          style={{ width: '90%', height: '90%', borderRadius: 100 }}
        />
      </Ripple>
    );
  };
  render() {
    let userData = this.props.userData;
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={false}
          translucent={true}
          backgroundColor="transparent"
          barStyle={'light-content'}
        />
        <Image
          source={require('../../assets/images/loginBanner.png')}
          resizeMode={'cover'}
          style={styles.bannerImg}
        />
        {this.state.isRTL ? (
          <View
            style={styles.menuIconContainer}
            onTouchStart={() => {
              this.setState({
                isMenuOpen: true,
              });
            }}>
            <ImageBackground
              resizeMode={'contain'}
              source={require('../../assets/images/sidebartopleftcircle.png')}
              style={[styles.menuIcon, { transform: [{ rotate: '90deg' }] }]}>
              <Image
                resizeMode={'contain'}
                style={[styles.iconImg, { transform: [{ rotate: '-90deg' }] }]}
                source={require('../../assets/images/logo.png')}
              />
            </ImageBackground>
          </View>
        ) : (
          <View
            style={styles.menuIconContainer}
            onTouchStart={() => {
              this.setState({
                isMenuOpen: true,
              });
            }}>
            <ImageBackground
              resizeMode={'contain'}
              source={require('../../assets/images/sidebartopleftcircle.png')}
              style={styles.menuIcon}>
              <Image
                resizeMode={'contain'}
                style={styles.iconImg}
                source={require('../../assets/images/logo.png')}
              />
            </ImageBackground>
          </View>
        )}
        {/* {!!this.state.isMenuOpen && this.menuView()} */}
        <ScrollView
          //bounces={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              tintColor={config.Constant.COLOR_TAB}
              titleColor={config.Constant.COLOR_TAB}
              colors={[config.Constant.COLOR_TAB]}
              refreshing={this.state.isFetching}
              onRefresh={() => this.onRefresh()}
            />
          }>
          <Ripple
            onPress={ async () => {
              if (!!userData && !!userData.userData && !!userData.userData.id) {
                // await AsyncStorage.getItem('is_arabic');
                this.props.navigation.navigate('CartItem'); //CartItem
              }
              else {
                this.props.navigation.navigate('Login');
              }
            }}
            style={styles.searchBar}>
            <Image
              resizeMode={'contain'}
              source={require('../../assets/images/Search.png')}
              style={styles.searchIcon}
            />
            <TextInput
              placeholder={config.I18N.t('seachService')}
              placeholderTextColor={config.Constant.COLOR_GREY}
              style={styles.inputStyle}
            />
          </Ripple>
          <View
            onTouchStart={() => {
              // if (!!this.state.isMenuOpen) {
              this.setState({
                isMenuOpen: false,
              });
              //}
            }}
            showsVerticalScrollIndicator={false}
            bounces={false}
            style={styles.bottomScrollView}>
            {/* <View style={{height: config.Constant.SCREEN_HEIGHT *0.30}} /> */}
            <View style={styles.bottomView}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                style={{ width: '100%' }}>
                <View style={styles.rowViewStyle}>
                  <Text style={styles.rowTitle}>
                    {config.I18N.t('topService')}
                  </Text>
                  {/* <Ripple>
                    <Text style={styles.rowBtnTitle}>
                      {config.I18N.t('viewAll')}
                    </Text>
                  </Ripple> */}
                </View>
                
                <FlatList
                  data={this.state.catArr}
                  horizontal
                  inverted={Platform.OS == 'android' && !!config.Constant.isRTL}
                  contentContainerStyle={{
                    paddingHorizontal: config.Constant.SCREEN_WIDTH * 0.05,
                  }}
                  keyExtractor={(item, index) => index.toString()}
                  showsHorizontalScrollIndicator={false}
                  renderItem={this.serviceRenderRow}
                />
                {this.state.dresserArr.length > 0 && (
                  <View style={styles.rowViewStyle}>
                    <Text style={styles.rowTitle}>
                      {config.I18N.t('nearByHairDresser')}
                    </Text>
                  </View>
                )}
                {this.state.dresserArr.length > 0 && (
                  <FlatList
                    data={this.state.dresserArr}
                    horizontal
                    inverted={
                      Platform.OS == 'android' && !!config.Constant.isRTL
                    }
                    contentContainerStyle={{
                      paddingHorizontal: config.Constant.SCREEN_WIDTH * 0.05,
                    }}
                    showsHorizontalScrollIndicator={false}
                    renderItem={this.dresserRenderRow}
                    keyExtractor={(item, index) => `dresser${index.toString()}`}
                  />
                )}
                {this.state.bannerList.length > 0 && (
                  <View style={styles.rowViewStyle}>
                    <Text style={styles.rowTitle}>
                      {config.I18N.t('specialPackage')}
                    </Text>
                    {/* <Ripple>
                    <Text style={styles.rowBtnTitle}>
                      {config.I18N.t('viewAll')}
                    </Text>
                  </Ripple> */}
                  </View>
                )}
                {this.state.bannerList.length > 0 && (
                  <FlatList
                    data={this.state.bannerList}
                    horizontal
                    extraData={this.state}
                    contentContainerStyle={{
                      paddingHorizontal: config.Constant.SCREEN_WIDTH * 0.05,
                    }}
                    showsHorizontalScrollIndicator={false}
                    renderItem={this.packageRenderRow}
                    keyExtractor={(item, index) => `banner${index.toString()}`}

                  />
                )}
                {this.state.previousHairderArr.length > 0 && (
                  <View style={styles.rowViewStyle}>
                    <Text style={styles.rowTitle}>
                      {config.I18N.t('previouslyHired')}
                    </Text>
                  </View>
                )}
                {this.state.previousHairderArr.length > 0 && (
                  <FlatList
                    data={this.state.previousHairderArr}
                    horizontal
                    inverted={
                      Platform.OS == 'android' && !!config.Constant.isRTL
                    }
                    contentContainerStyle={{
                      paddingHorizontal: config.Constant.SCREEN_WIDTH * 0.05,
                    }}
                    showsHorizontalScrollIndicator={false}
                    renderItem={this.userRenderRow}
                    keyExtractor={(item, index) => `prevHairDresser${index.toString()}`}

                  />
                )}
                <View style={{ height: 100 }} />
              </ScrollView>
            </View>
          </View>
        </ScrollView>
        <Dialog
          visible={this.state.isMenuOpen}
          onTouchOutside={() => {
            this.setState({
              isMenuOpen: false,
            });
          }}
          width={1}
          overlayOpacity={0.9}
          overlayBackgroundColor={'white'}
          dialogAnimation={
            new SlideAnimation({
              slideFrom: 'top',
            })
          }
          containerStyle={[
            {
              justifyContent: 'flex-start',
            },
          ]}
          dialogStyle={styles.dialogStyle}>
          <DialogContent
            style={[
              styles.dialogContent,
              {
                height: !!this.state.ViewHeight
                  ? this.state.ViewHeight - 10
                  : config.Constant.SCREEN_HEIGHT * 0.75,
              },
            ]}>
            {this.menuView()}
          </DialogContent>
        </Dialog>
        <View style={{ position: 'absolute', bottom: 30, right: 15, zIndex: 2 }}>
          <CustomButton
            btnTxt={config.I18N.t('services')}
            onPress={() => {
              if (!!userData && !!userData.userData && !!userData.userData.id) {
                this.props.navigation.navigate('CartItem'); //CartItem. - OrderReview
              }
              else {
                this.props.navigation.navigate('Login');
              }
              //this.requestOrder()
            }}
            containerStyle={{ width: 150 }}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userData: state.userData,
});

export default connect(mapStateToProps)(Home);
