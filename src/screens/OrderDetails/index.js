import React from 'react';
import {
  Alert,
  StatusBar,
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  BackHandler,
  Linking,
  AppState,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Ripple from 'react-native-material-ripple';
import StarRating from 'react-native-star-rating';
import {getFinalPrice, getRoundOf, getArabicFromEng, getArabicFromEngLTR} from '../../Util/Utilities';
import config from '../../config';
import styles from './styles';
import Timeline from 'react-native-timeline-flatlist';
import modules from '../../modules';
import CustomHeader from '../../component/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  AnimatedRegion,
} from 'react-native-maps';
import { CommonActions } from '@react-navigation/native';

import Geolocation from 'react-native-geolocation-service';
import Polyline from '@mapbox/polyline';
import moment from 'moment';
let doNotCallPayment = true, showLog = true

export default class OrderDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageUdate: true,
      isFetching: false,
      Data1: 1,
      Data2: 1,
      Data3: 1,
      timeLine: [
        {
          id: 0,
          time: '',
          lineColor: 'grey',
          icon: require('../../assets/images/emptyCircle.png'),
          description: '',
          title: config.I18N.t(`dresserOnWay`),
        },
        {
          id: 1,
          time: '',
          lineColor: 'grey',
          icon: require('../../assets/images/emptyCircle.png'),
          description: '',
          title: config.I18N.t(`workInProgress`),
        },
        {
          id: 2,
          time: '',
          lineColor: 'grey',
          icon: require('../../assets/images/emptyCircle.png'),
          description: '',
          title: config.I18N.t(`orderCompleted`),
        },
      ],
      dataSource: null,
      coords: [],
      coordinates: [],
      startlat: 37.0902,
      startlong: 95.7129,
      endlat: 37.0902,
      endlong: 95.7129,
      showMap: false,
      forceLocation: true,
      highAccuracy: true,
      loading: false,
      showLocationDialog: true,
      significantChanges: false,
      updatesEnabled: false,
      foregroundService: false,
      location: {},
      counterVal: '00:00',

      country: 'IN',
      first_name: config.Constant.USER_DATA.name,
      last_name: 'deo',
      address: config.Constant.USER_DATA.address,
      city: 'Kolkata',
      state: 'West Bengal',
      zip: '700001',
      phone_number: config.Constant.USER_DATA.phone_number,
      customerEmail: config.Constant.USER_DATA.email,
      udf2: config.Constant.responseUrl,
      udf3: 'en',
      trackid: '1',
      tranid: '',
      currency: 'SAR',
      amount: '10.00',
      action: 1,
      tokenOperation: 'A',
      cardToken: '',
      maskCardNum: '',
      tokenizationType: 0,
      showPaymentTimer:true,
      is_payment:0,
      appState: AppState.currentState
    };
  }
  componentDidMount = () => {
    doNotCallPayment = true
    
    // AppState.addEventListener('change', this._handleAppStateChange);
    this.props.navigation.addListener('focus', (nextState) => {
      BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
      try {
        var order_id = this.props.route.params.order_id;

        if (!!order_id) {
          config.Constant.USER_DATA.order_id = order_id
          config.Constant.USER_DATA.onRefresh = this.getOrderDetails
          this.getOrderDetails(order_id);
        }
      } catch (error) {}
    });
    this.props.navigation.addListener('blur', () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.hardwareBackPress,
      );
    });

    config.Constant.socket.on('send_notification', (data) => {
      if (
        !!data &&
        !!data.result &&
        !!data.result.order_id &&
        !!this.state.dataSource &&
        data.result.order_id == this.state.dataSource?.id
      )
        this.getOrderDetails(data.result.order_id);
        if (!!data.result.type && data.result.type == config.Constant.ORDER_REQUEST) {
          // ORDER REQUEST
          //this.getOrderDetails(data.result.order_id);
        } else if (!!data.result.type && data.result.type == config.Constant.ORDER_TIMEOUT) {
          // ORDER TIMEOUT
          
          modules.RequestPopup.isVisible() && modules.RequestPopup.hideRef();
          console.log("BEFORE CALL NAVIGATION ROOT")
            setTimeout(()=>{
              // config.Constant.USER_DATA.order_id = undefined
              config.Constant.RootNavigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [
                    { name: 'DashboardTab' }
                  ],
                })
              )
              console.log("AFTER CALL NAVIGATION ROOT")
            },200)
          // config.Constant.RootNavigation.reset({
          //   index: 1,
          //   routes: [{ name: 'DashboardTab' }],
          // });
    
        } else if (!!data.result.type && data.result.type == config.Constant.ORDER_CANCEL) {
          // ORDER CANCEL
          modules.RequestPopup2.isVisible() && modules.RequestPopup2.hideRef()
        } else if (!!data.result.type && data.result.type == config.Constant.ORDER_REJECT) {
          // ORDER REJECT
          // modules.RequestPopup.hideRef();
          // setTimeout(()=>{
          //   config.Constant.RootNavigation.reset({
          //     index: 1,
          //     routes: [{ name: 'scissor'}],
          //   });
          // }, 200)
    
          // config.Constant.USER_DATA.order_id = undefined
          modules.RequestPopup.isVisible() && modules.RequestPopup.hideRef();
          config.Constant.RootNavigation.reset({
                index: 1,
                routes: [
                  {
                    name: 'NearByDresser',
                    params: {
                      latitude: config.Constant.LATITUDE,
                      longitude: config.Constant.LONGITUDE,
                      address: config.Constant.ADDRESS,
                    },
                  },
                ],
              });
              !modules.RequestRejectedPopup.isVisible() && modules.RequestRejectedPopup.getRef({
                title: '',
                negativeBtnTxt: '',
                positiveBtnTxt: '',
                extraData: {},
                onPressPositiveBtn: async (data, pressOK) => {
                  
                  if (pressOK) {
                    // this.props.navigation.reset({
                    //   index: 1,
                    //   routes: [{name: 'DashboardTab'}],
                    // });
                  }
                },
              });
    
        }
        else if (!!data.result.type && data.result.type == config.Constant.ORDER_COMPLETE) {
          // ORDER COMPLETE
          // config.Constant.RootNavigation.navigate('scissor');
          AsyncStorage.removeItem('catSelectedArr');
        
          config.Constant.RootNavigation.reset({
            index: 1,
            routes: [{ name: 'DashboardTab' }],
          });
          setTimeout(()=>{
            !modules.OrderReviewPopup.isVisible() && modules.OrderReviewPopup.getRef({
              title: '',
              negativeBtnTxt: '',
              positiveBtnTxt: '',
              extraData: {},
              onPressPositiveBtn: async (
                extraData,
                pressOK,
                rating,
                reviewTxt,
              ) => {
                if (pressOK) {
                    this.giveFeedback({ id: data?.result?.order_id,
                      user_id: data?.result?.user_id,
                      user_id2: data?.result?.user_id_2,
                      rating : rating,
                      reviewTxt: reviewTxt})
                }
              },
            });
    
          }, 2000)
          
         
        }
        else if (!!data.result.type && data.result.type == config.Constant.ORDER_ACCEPT) {
          // ORDER ACCEPT
          modules.RequestPopup.isVisible() && modules.RequestPopup.hideRef();
          modules.DropDownAlert.showAlert('success', '', data.result.message);
          // config.Constant.RootNavigation.navigate('OrderDetails', {
          //   order_id: data.result.order_id,
          // });
          setTimeout(()=>{
            config.Constant.RootNavigation.reset({
              index: 1,
              routes: [{ name: 'OrderDetails', params: { order_id: data.result.order_id } }],
            });
          }, 200)
          
        } else if (!!data.result.type && data.result.type == config.Constant.ORDER_PAYMENT_TIMEOUT) {
          // ORDER_PAYMENT_TIMEOUT
          console.log("modules.RequestPopup2.hideRef(); called ORDER_PAYMENT_TIMEOUT")
          modules.RequestPopup2.isVisible() && modules.RequestPopup2.hideRef()
          config.Constant.RootNavigation.navigate('scissor')
        }



    });

    config.Constant.socket.on('receive_lat_long', (data) => {
      this.setState(
        {
          startlat: data.lat,
          startlong: data.long,
        },
        () => {
          this.getDirections(
            `${this.state.startlat},${this.state.startlong}`,
            `${this.state.endlat},${this.state.endlong}`,
          );
        },
      );
    });
  };
  // _handleAppStateChange = (nextAppState) => {
  //   console.log
  //   if (
  //     this.state.appState.match(/inactive|background/) &&
  //     nextAppState === 'active'
  //   ) {
  //     console.log("this.state.appState ", this.state.appState, nextAppState)
  //     this.setState({appState: nextAppState})
  //     try {
  //       config.Constant.socket.connect();
  //       if (!!config.Constant.USER_DATA.id) {
  //         config.Constant.socket.emit('room', config.Constant.USER_DATA.id);
  //         this.onRefresh()
  //       }
  //     } catch (error) { }
  //   }
  // }

  hardwareBackPress = () => {
    if (
      !!this.state.dataSource &&
      this.state.dataSource.order_status != 4 &&
      this.state.dataSource.order_status != 5 &&
      this.state.dataSource.order_status != 6
    ) {
      if (!this.props.navigation.canGoBack()) {
        this.props.navigation.reset({
          index: 1,
          routes: [{name: 'DashboardTab'}],
        });
      } else {
        this.props.navigation.pop();
      }
    }
    return true;
  };
  onRefresh() {
    console.log("onRefresh OrderDetails call")
    // this.setState({isFetching: true});
    this.getOrderDetails(this.state.dataSource.id);
  }
  onEventComplete = (event) => {};
  getOrderDetails = async (order_id, is_loader = true) => {
    showLog && console.log("ORDER_DETAILS - 1", order_id)
    if (!!order_id) {
      showLog && console.log("ORDER_DETAILS - 2")
      if (!!is_loader) {
        config.Constant.showLoader.showLoader();
      }
      const formData = new FormData();
      formData.append('order_id', order_id);
      showLog && console.log("ORDER_DETAILS - 3")
      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.ORDER_DETAILS,
        formData,
      );
      showLog && console.log("ORDER_DETAILS - 4", data)
      this.setState({
        isFetching: false,
      });
      config.Constant.showLoader.hideLoader();
      showLog && console.log("ORDER_DETAILS - 5", JSON.stringify(data))
      if (data?.status_code == 200) {
        showLog && console.log("ORDER_DETAILS - 6")
        
        this.setState(
          {
            dataSource:data.data,
            showPaymentTimer: this.state.showPaymentTimer && data?.data?.is_payment != 1,
            endlat: data.data.latitude,
            endlong: data.data.longitude,
            startlat: data.data.hairdresser.latitude,
            startlong: data.data.hairdresser.longitude,
          },
          () => {
            this.getFixTimeline();
            this.getStartTime();
            this.setPaymentModal()
          },
        );
      }
    }
  };
  setPaymentModal=()=>{
    let that = this
    // let dataSource= data.data
    showLog && console.log("SET_ORDER_PAYMENT - 1")
    setTimeout(()=>{
      showLog && console.log("SET_ORDER_PAYMENT - 2")
      const {dataSource, showPaymentTimer, is_payment} = that.state
      showLog && console.log("SET_ORDER_PAYMENT - 3", dataSource, {showPaymentTimer, is_payment})
      if(!!dataSource &&
        dataSource.order_status ==4 &&
          dataSource.is_payment == 0 &&
          dataSource.payment_method == '2' && showPaymentTimer && is_payment != 1){
          showLog && console.log("SET_ORDER_PAYMENT - 4")
          var timeN = moment().format();
        var timeL = moment
          .utc(dataSource.updated_at, 'YYYY-MM-DD HH:mm:ss')
          .add(300, 's')
          .local()
          .format();
            var timeNow = moment(timeL).diff(moment(timeN), 'second');
            //showLog && console.log("render DATASOURCE - ", timeNow)
            // modules.RequestPopup.hideRef();
            !modules.RequestPopup2.isVisible() && modules.RequestPopup2.getRef({
                title: '',
                negativeBtnTxt: '',
                positiveBtnTxt: '',
                extraData: {...dataSource, isPaymentTimeout: true},
                onPressPositiveBtn: async (data1, pressOK) => {
                  modules.RequestPopup2.isVisible() && modules.RequestPopup2.hideRef()
                  if (pressOK) {
                    that.DoPayment();
                  } else{

                    that.cancelOrder(dataSource.id);
                  }
                },
                onTimeOutPopup: async () => {
                  that.timeoutOrder(data.data.id);
                },
              });
               this.timeoutOrder(dataSource.id, timeNow < 1 ? 1 :timeNow)
        } else{
          modules.RequestPopup2.isVisible() && modules.RequestPopup2.hideRef()
        }
    }, 500)
    
  }

  getSubTotal = (type) => {
    const {dataSource} = this.state;
    if (!dataSource) {
      return 0;
    }
    var total = 0;
    var Subtotal = 0;
    var totalFees = 0;
    var totalCommission =
      parseFloat(!!dataSource && dataSource.tax_percentage) 
      // + parseFloat(!!dataSource && dataSource.commision_percentage);
    !!dataSource &&
      dataSource.order_service.map((item, index) => {
        if (!!item.price && !!item.quantity) {
          Subtotal =
            Subtotal + parseFloat(item.price * parseInt(item.quantity));
            Subtotal = Subtotal+Number(item?.service_tax)
        }
      });
    // showLog && console.log("SUBTOTAL - ", Subtotal)
    // showLog && console.log("dataSource - ", dataSource)
    if (type == '1') {
      return Subtotal;
    } else if (type == '2') {
      return (Subtotal * totalCommission) / 100;
    } else if (type == '3') {
      return Subtotal + (Subtotal * totalCommission) / 100;
    } else if (type == '4') {
      return (
        (Subtotal * parseFloat(!!dataSource && dataSource.tax_percentage)) / 100
      );
    } else if (type == '5') {
      return (
        (Subtotal *
          parseFloat(!!dataSource && dataSource.commision_percentage)) /
        100
      );
    } else if (type == '6') {
      if (
        !!config.Constant.USER_DATA.wallet_total &&
        !config.Constant.USER_DATA.wallet_total.toString().includes('-') &&
        parseFloat(config.Constant.USER_DATA.wallet_total) >=
          dataSource.final_total
      ) {
        return dataSource.final_total;
      }
      return !!config.Constant.USER_DATA &&
        !!config.Constant.USER_DATA.wallet_total
        ? config.Constant.USER_DATA.wallet_total
        : 0;
    } else if (type == '7') {
      // FINAL AMOUNT - WALLET_BALANCE
      if ( !!dataSource && dataSource.is_payment == 0 && dataSource.payment_method == '2' ) {
        if ( !!config.Constant.USER_DATA.wallet_total && !config.Constant.USER_DATA.wallet_total.toString().includes('-') && parseFloat(config.Constant.USER_DATA.wallet_total) >= dataSource.final_total ) {
          return 0;
        }
        return !!config.Constant.USER_DATA &&
          !!config.Constant.USER_DATA.wallet_total
          ? -parseFloat(config.Constant.USER_DATA.wallet_total) +
              parseFloat(dataSource.final_total)
          : dataSource.final_total;
      } else {
        return !!dataSource && dataSource.final_total;
      }
    }else if (type == '8') {
      // showLog && console.log("getSubTotal - 8", {Subtotal, tax:this.state.tax, value:(Subtotal * parseFloat(this.state.tax)) / 100} )
      return (Subtotal * parseFloat(this.state.tax)) / 100;
    }
  };
  getFixTimeline = () => {
    const {dataSource} = this.state;

    if (!!dataSource && !!dataSource.order_status) {
      if (dataSource.order_status == 5) {
        this.setState(
          {
            showMap: true,
          },
          () => {
            this.getDirections(
              `${this.state.startlat},${this.state.startlong}`,
              `${this.state.endlat},${this.state.endlong}`,
            );
          },
        );
        this.state.timeLine[0] = {
          id: 0,
          time: '',
          lineColor: config.Constant.COLOR_TAB,
          icon: require('../../assets/images/checked.png'),
          description: '',
          title: config.I18N.t(`dresserOnWay`),
        };
      } else {
        this.setState({
          showMap: false,
        });
      }
      if (dataSource.order_status == 6) {
        this.state.timeLine[0] = {
          id: 0,
          time: '',
          lineColor: config.Constant.COLOR_TAB,
          icon: require('../../assets/images/checked.png'),
          description: '',
          title: config.I18N.t(`dresserOnWay`),
        };
        this.state.timeLine[1] = {
          id: 0,
          time: '',
          lineColor: config.Constant.COLOR_TAB,
          icon: require('../../assets/images/icon_clock.png'),
          description: '',
          title: config.I18N.t(`workInProgress`),
        };
      }
      if (dataSource.order_status == 7) {
        this.state.timeLine[0] = {
          id: 0,
          time: '',
          lineColor: config.Constant.COLOR_TAB,
          icon: require('../../assets/images/checked.png'),
          description: '',
          title: config.I18N.t(`dresserOnWay`),
        };
        this.state.timeLine[1] = {
          id: 0,
          time: '',
          lineColor: config.Constant.COLOR_TAB,
          icon: require('../../assets/images/icon_clock.png'),
          description: '',
          title: config.I18N.t(`workInProgress`),
        };
        this.state.timeLine[2] = {
          id: 0,
          time: '',
          lineColor: config.Constant.COLOR_TAB,
          icon: require('../../assets/images/checked.png'),
          description: '',
          title: config.I18N.t(`orderCompleted`),
        };
      }
      this.setState({
        timeLine: this.state.timeLine,
      });
    }
  };
  getStatusColor = (item) => {
    if (!!item.order_status) {
      if (item.order_status == 1) {
        return config.Constant.COLOR_YELLOW;
      } else if (item.order_status == 2) {
        return 'red';
      } else if (item.order_status == 3) {
        return 'red';
      } else if (item.order_status == 4) {
        return config.Constant.COLOR_YELLOW;
      } else if (item.order_status == 5) {
        return config.Constant.COLOR_YELLOW;
      } else if (item.order_status == 6) {
        return config.Constant.COLOR_YELLOW;
      } else if (item.order_status == 7) {
        return config.Constant.COLOR_GREEN;
      } else if (item.order_status == 8) {
        return 'red';
      }
    }
  };

  getStatus = (item) => {
    if (!!item && !!item.order_status) {
      if (item.order_status == 1) {
        return false;
      } else if (item.order_status == 2) {
        return config.I18N.t('reqestTimeot');
      } else if (item.order_status == 3) {
        return config.I18N.t('reqestCancel');
      } else if (item.order_status == 4) {
        return false;
      } else if (item.order_status == 5) {
        return false;
      } else if (item.order_status == 6) {
        return false;
      } else if (item.order_status == 7) {
        return false;
      } else if (item.order_status == 8) {
        return config.I18N.t('requestRejected');
      }
    }
  };
  getDispute = async (dispute_reason) => {
    const {dataSource} = this.state;
    if (!!dataSource.id) {
      config.Constant.showLoader.showLoader();
      const formData = new FormData();
      formData.append('order_id', dataSource.id);
      formData.append('dispute_reason', dispute_reason);

      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.DISPUTE_ORDER,
        formData,
      );

      if (data?.status_code == 200) {
        modules.DropDownAlert.showAlert(
          'success',
          config.I18N.t('success'),
          data.message,
        );
        this.getOrderDetails(dataSource.id);
        config.Constant.showLoader.hideLoader();
      } else {
        config.Constant.showLoader.hideLoader();
        modules.DropDownAlert.showAlert(
          'error',
          config.I18N.t('error'),
          data.message,
        );
      }
    }
  };
  giveFeedback = async (rating, ReviewTxt) => {
    const {dataSource} = this.state;
    if (!!dataSource.id) {
      config.Constant.showLoader.showLoader();
      const formData = new FormData();
      formData.append('order_id', dataSource.id);
      formData.append('sender_id', dataSource.customer.id);
      formData.append('receiver_id', dataSource.hairdresser.id);
      formData.append('rating', rating);
      formData.append('comment', ReviewTxt);

      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.GIVE_RATING,
        formData,
      );

      showLog && console.log('order_id ORDER_ON_WAY= ' + JSON.stringify(data));
      if (data?.status_code == 200) {
        modules.DropDownAlert.showAlert(
          'success',
          config.I18N.t('success'),
          data.message,
        );
        config.Constant.showLoader.hideLoader();
        this.props.navigation.reset({
          index: 1,
          routes: [{name: 'DashboardTab'}],
        });
      } else {
        config.Constant.showLoader.hideLoader();
        modules.DropDownAlert.showAlert(
          'error',
          config.I18N.t('error'),
          data.message,
        );
      }
    }
  };
  cancelOrder = async (order_id) => {
    modules.RequestPopup.isVisible() && modules.RequestPopup.hideRef();
    modules.RequestPopup2.isVisible() && modules.RequestPopup2.hideRef()
    if (!!order_id) {
      config.Constant.showLoader.showLoader();
      const formData = new FormData();
      formData.append('order_id', order_id);

      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.ORDER_CANCEL,
        formData,
      );
      config.Constant.showLoader.hideLoader();
      if (data?.status_code == 200) {
        modules.RequestPopup.isVisible() && modules.RequestPopup.hideRef();
        modules.RequestPopup2.isVisible() && modules.RequestPopup2.hideRef()
        // this.getOrderDetails(this.state.dataSource.id);
        console.log("BEFORE CALL NAVIGATION ORDER DETAILS")
        setTimeout(()=>{
          this.props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                { name: 'DashboardTab' },
                
              ],
            })
          )
          console.log("AFTER CALL NAVIGATION ORDER DETAILS")
        },200)
        
      } else {
        modules.DropDownAlert.showAlert(
          'error',
          config.I18N.t('error'),
          data.message,
        );
      }
    }
  };
  profileView = () => {
    const {dataSource} = this.state;
    return (
      <View style={styles.reviewBox}>
        <View style={styles.serviceRowView}>
          <FastImage
            resizeMode={'cover'}
            style={{width: 50, height: 50, borderRadius: 100}}
            source={
              !!dataSource &&
              !!dataSource.hairdresser &&
              !!dataSource.hairdresser.image
                ? {
                    uri:
                      config.Constant.UsersProfile_Url +
                      '' +
                      dataSource.hairdresser.image,
                  }
                : require('../../assets/images/male.png')
            }
          />
          <View style={{flex: 1, paddingHorizontal: 10}}>
            <Text numberOfLines={2} style={styles.reviewName}>
              {!!dataSource &&
              !!dataSource.hairdresser &&
              !!dataSource.hairdresser.name
                ? dataSource.hairdresser.name
                : ''}
            </Text>
            {!!dataSource &&
              !!dataSource.hairdresser &&
              !!dataSource.hairdresser.reviews && (
                <View
                  style={[
                    styles.ratingView,
                  ]}>
                  <StarRating
                    disabled={true}
                    halfStar={require('../../assets/images/icon_halfstar.png')}
                    fullStar={require('../../assets/images/filledStar.png')}
                    emptyStar={require('../../assets/images/startInactive.png')}
                    maxStars={5}
                    rating={
                      !!dataSource &&
                      !!dataSource.hairdresser &&
                      !!dataSource.hairdresser.avg_rating &&
                      dataSource.hairdresser.avg_rating.length > 0 &&
                      !!dataSource.hairdresser.avg_rating[0].avg_rating
                        ? dataSource.hairdresser.avg_rating[0].avg_rating
                        : 4
                    }
                    containerStyle={{height: 25, width: 70}}
                    starStyle={{marginRight: 5}}
                    starSize={20}
                    selectedStar={(rating) => {}}
                  />
                  {dataSource?.hairdresser?.reviews?.length > 0 && (
                    <Text numberOfLines={2} style={styles.reviewTxt}>
                      (
                      {!!dataSource &&
                        !!dataSource.hairdresser &&
                        !!dataSource.hairdresser.reviews &&
                        dataSource.hairdresser.reviews.length}{' '}
                      {config.I18N.t('reviews')})
                    </Text>
                  )}
                </View>
              )}
          </View>

          {!!this.state.dataSource &&
            (this.state.dataSource.order_status == 4 ||
              this.state.dataSource.order_status == 5 ||
              this.state.dataSource.order_status == 6) 
              // && dataSource?.is_payment == 1 
              && (
              <Ripple
                onPress={() => {
                  !!dataSource &&
                    !!dataSource.hairdresser &&
                    Linking.openURL(
                      `tel:${dataSource.hairdresser.phone_number}`,
                    );
                }}
                style={[
                  styles.wrapRow,
                  {backgroundColor: 'white', borderWidth: 1},
                ]}>
                <Text
                  style={[
                    styles.wrapTxtRow,
                    {color: config.Constant.COLOR_TAB},
                  ]}>
                  {config.I18N.t('call')}
                </Text>
              </Ripple>
            )}
        </View>
      </View>
    );
  };
  getDirections = async (startLoc, destinationLoc) => {
    var link = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=${config.Constant.MAP_KEY}`;
    showLog && console.log(link);

    try {
      //config.Constant.showLoader.showLoader()
      let resp = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=${config.Constant.MAP_KEY}`,
      );
      config.Constant.showLoader.hideLoader();
      let respJson = await resp.json();
      let points = Polyline.decode(respJson.routes[0].overview_polyline.points);

      let coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });
      this.setState({coords: coords});
      return coords;
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  getLiveLocation = () => {
    this.watchId = Geolocation.watchPosition(
      (position) => {
        this.setState(
          {
            location: position,
            startlat: position.coords.latitude,
            startlong: position.coords.longitude,
          },
          () => {
            this.getDirections(
              `${this.state.startlat},${this.state.startlong}`,
              `${this.state.endlat},${this.state.endlong}`,
            );
          },
        );
        // position.coords.latitude
        //     position.coords.longitude
        // showLog && console.log(position);
      },
      (error) => {
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'bestForNavigation',
        },
        enableHighAccuracy: this.state.highAccuracy,
        distanceFilter: 0,
        interval: 5000,
        fastestInterval: 2000,
        forceRequestLocation: this.state.forceLocation,
        showLocationDialog: this.state.showLocationDialog,
        useSignificantChanges: this.state.significantChanges,
      },
    );
  };
  getStartTime = () => {
    const {dataSource} = this.state;
    var time = '';
    var hour = '';
    var minutes = '';
    var seconds = '';
    try {
      clearInterval(this.countTimer);
    } catch (error) {}
    if (!!dataSource && !!dataSource.start_date && !dataSource.complete_date) {
      this.countTimer = setInterval(() => {
        var duration = moment.duration(
          moment.utc().local().diff(moment.utc(dataSource.start_date).local()),
        );
        seconds = duration.asSeconds();
        var h = Math.floor(seconds / 3600);
        var m = Math.floor((seconds % 3600) / 60);
        var s = Math.floor((seconds % 3600) % 60);

        var hDisplay = h > 0 ? h + (h == 1 ? '' : '') : '';
        hDisplay = hDisplay <= 9 ? '0' + hDisplay : hDisplay;
        var mDisplay = m > 0 ? m + (m == 1 ? '' : '') : '';
        mDisplay = mDisplay <= 9 ? '0' + mDisplay : mDisplay;
        var sDisplay = s > 0 ? s + (s == 1 ? '' : '') : '';
        sDisplay = sDisplay <= 9 ? '0' + sDisplay : sDisplay;
        this.setState({
          counterVal: hDisplay + ':' + mDisplay + ':' + sDisplay,
        });
      }, 1000);
    } else if (!!dataSource.start_date && !!dataSource.complete_date) {
      var duration = moment.duration(
        moment
          .utc(dataSource.complete_date)
          .local()
          .diff(moment.utc(dataSource.start_date).local()),
      );
      seconds = duration.asSeconds();
      var h = Math.floor(seconds / 3600);
      var m = Math.floor((seconds % 3600) / 60);
      var s = Math.floor((seconds % 3600) % 60);

      var hDisplay = h > 0 ? h + (h == 1 ? '' : '') : '';
      hDisplay = hDisplay <= 9 ? '0' + hDisplay : hDisplay;
      var mDisplay = m > 0 ? m + (m == 1 ? '' : '') : '';
      mDisplay = mDisplay <= 9 ? '0' + mDisplay : mDisplay;
      var sDisplay = s > 0 ? s + (s == 1 ? '' : '') : '';
      sDisplay = sDisplay <= 9 ? '0' + sDisplay : sDisplay;
      this.setState({
        counterVal: hDisplay + ':' + mDisplay + ':' + sDisplay,
      });
    } else {
      try {
        clearInterval(this.countTimer);
      } catch (error) {}
    }
  };

  DoPayment = async () => {
    // showLog && console.log("DoPayment... 1- ", this.getSubTotal(1))
    // showLog && console.log("DoPayment... 2- ", this.getSubTotal(2))
    // showLog && console.log("DoPayment... 3- ", this.getSubTotal(3))
    // showLog && console.log("DoPayment... 4- ", this.getSubTotal(4))
    // showLog && console.log("DoPayment... 5- ", this.getSubTotal(5))
    // showLog && console.log("DoPayment... 6- ", this.getSubTotal(6))
    // showLog && console.log("DoPayment... 7- ", this.getSubTotal(7))
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
      dataSource,
    } = this.state;
    // && !config.Constant.USER_DATA.wallet_total.toString().includes('-')
    showLog && console.log("DoPayment... 2", config.Constant.USER_DATA.wallet_total, typeof config.Constant.USER_DATA.wallet_total)
    if(!!config.Constant?.USER_DATA?.wallet_total && config.Constant?.USER_DATA?.wallet_total > 0 ){
        showLog && console.log("DoPayment... 3")
        Alert.alert(
          config.I18N.t("PaymentAlertHeader"),
          config.I18N.t("PaymentAlertDesc"),
          [
            {
              text: config.I18N.t("No"),
              onPress: () => {
                doNotCallPayment= false
                console.log("PaymentRequest- ",  {
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
                  amount: this.getSubTotal(3),
                  action: action,
                  tokenOperation: tokenOperation,
                  cardToken: cardToken,
                  maskCardNum: maskCardNum,
                  tokenizationType: tokenizationType,
                })
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
                    amount: this.getSubTotal(3),
                    action: action,
                    tokenOperation: tokenOperation,
                    cardToken: cardToken,
                    maskCardNum: maskCardNum,
                    tokenizationType: tokenizationType,
                  },
                  callBack: this.onProcessPayment,
                });
                // Alert.alert(
                //   config.I18N.t("PaymentAlertHeader"),
                //   config.I18N.t("PaymentAlertDesc2"),
                //   [
                //     {
                //       text: config.I18N.t("cancel"),
                //       onPress: () => {
                //         this.cancelOrder(dataSource.id);
                //       }
                //     },
                //     {
                //       text: config.I18N.t("confirm"),
                //       onPress: () => {
                //         this.props.navigation.navigate('PaymentScreen', {
                //           request: {
                //             country: country,
                //             first_name: first_name,
                //             last_name: last_name,
                //             address: address,
                //             city: city,
                //             state: state,
                //             zip: zip,
                //             phone_number: phone_number,
                //             customerEmail: customerEmail,
                //             udf2: udf2,
                //             udf3: udf3,
                //             trackid: trackid,
                //             tranid: tranid,
                //             currency: currency,
                //             amount: this.getSubTotal(3),
                //             action: action,
                //             tokenOperation: tokenOperation,
                //             cardToken: cardToken,
                //             maskCardNum: maskCardNum,
                //             tokenizationType: tokenizationType,
                //           },
                //           callBack: this.onProcessPayment,
                //         });
                //       }
                //     }
                //   ]
                // )
                
              },
              style: "cancel",
            },
            {
              text: config.I18N.t("Yes"),
              onPress: () => {
                doNotCallPayment=false
                if (parseFloat(this.getSubTotal(7)) <= 0) {
                  this.onProcessPayment({
                    data: {tranid: 'wallet_pay', amount: 0},
                    status: 'success',
                  });
                  return true;
                }
                console.log("PaymentRequest- ",  {
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
                  amount: this.getSubTotal(3),
                  action: action,
                  tokenOperation: tokenOperation,
                  cardToken: cardToken,
                  maskCardNum: maskCardNum,
                  tokenizationType: tokenizationType,
                })
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
                    amount: this.getSubTotal(7),
                    action: action,
                    tokenOperation: tokenOperation,
                    cardToken: cardToken,
                    maskCardNum: maskCardNum,
                    tokenizationType: tokenizationType,
                  },
                  callBack: this.onProcessPayment,
                });
              },
              style: "cancel",
            },
          ],
          {
            cancelable: true,
            onDismiss: () => {}
          }
        );
      } else {
        doNotCallPayment= false
        console.log("PaymentRequest- ",  {
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
          amount: this.getSubTotal(3),
          action: action,
          tokenOperation: tokenOperation,
          cardToken: cardToken,
          maskCardNum: maskCardNum,
          tokenizationType: tokenizationType,
        })
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
            amount: this.getSubTotal(7),
            action: action,
            tokenOperation: tokenOperation,
            cardToken: cardToken,
            maskCardNum: maskCardNum,
            tokenizationType: tokenizationType,
          },
          callBack: this.onProcessPayment,
        });
        // Alert.alert(
        //   config.I18N.t("PaymentAlertHeader"),
        //   config.I18N.t("PaymentAlertDesc2"),
        //   [
        //     {
        //       text: config.I18N.t("cancel"),
        //       onPress: () => {
        //         this.cancelOrder(dataSource.id);
        //       }
        //     },
        //     {
        //       text: config.I18N.t("confirm"),
        //       onPress: () => {
        //         doNotCallPayment= false
        //         this.props.navigation.navigate('PaymentScreen', {
        //           request: {
        //             country: country,
        //             first_name: first_name,
        //             last_name: last_name,
        //             address: address,
        //             city: city,
        //             state: state,
        //             zip: zip,
        //             phone_number: phone_number,
        //             customerEmail: customerEmail,
        //             udf2: udf2,
        //             udf3: udf3,
        //             trackid: trackid,
        //             tranid: tranid,
        //             currency: currency,
        //             amount: this.getSubTotal(7),
        //             action: action,
        //             tokenOperation: tokenOperation,
        //             cardToken: cardToken,
        //             maskCardNum: maskCardNum,
        //             tokenizationType: tokenizationType,
        //           },
        //           callBack: this.onProcessPayment,
        //         });
        //       }
        //     }
        //   ]
        // )        
      }



    
  };

  onProcessPayment = async (responseData) => {
    showLog && console.log("onProcessPayment called....", responseData)
    const {dataSource} = this.state;
    if (responseData.status == 'success') {
      this.setState({showpaymentTimer:false, is_payment:1})
      if (!!dataSource.id) {
        showLog && console.log("modules.RequestPopup2.hideRef() called")
        // modules.RequestPopup2.hideRef()
        config.Constant.showLoader.showLoader();
        const formData = new FormData();
        formData.append('order_id', dataSource.id);
        formData.append('receipt', responseData.data.InvoiceTransactions[0]?.TransactionId)
        
        // formData.append('receipt', responseData.data.tranid);
        if (!!responseData.data.InvoiceTransactions[0]?.TransationValue) {
          formData.append('amount', responseData.data.InvoiceTransactions[0]?.TransationValue);
          // formData.append('amount', responseData.data.amount);
        }else{
          formData.append('amount', 0);
        }
        
        var data = await modules.APIServices.PostApiCall(
          config.ApiEndpoint.ORDER_PAYMENT,
          formData,
        );

        if (data?.status_code == 200) {
          this.setState({showpaymentTimer:false, is_payment:1})
    
          // modules.DropDownAlert.showAlert(
          //   'success',
          //   config.I18N.t('success'),
          //   data.message,
          // );
          that = this
          that.getOrderDetails(dataSource.id);
          setTimeout(()=>{
            config.Constant.showLoader.hideLoader();
          }, 20000)
          
        } else {
          config.Constant.showLoader.hideLoader();
          modules.DropDownAlert.showAlert(
            'error',
            config.I18N.t('error'),
            data.message,
          );
        }
      }
    } else {
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('error'),
        responseData.error,
      );
    }
  };

  timeoutOrder = async (order_id, time) => {
    showLog && console.log("timeoutOrder. called")
    const that = this
    
    this.orderPaymentTimeout = setTimeout(async ()=>{
      const {dataSource} = that.state;
      showLog && console.log("timeoutOrder - inside", {
        order_status: dataSource?.order_status,
        is_payment: dataSource?.is_payment,
        payment_method: dataSource?.payment_method,
        otc: dataSource?.order_status == 4,
        ipc: dataSource?.is_payment == 0,
        pmc: dataSource?.payment_method == '2'
      })
      if (!!order_id && doNotCallPayment && (dataSource?.order_status == 4 && dataSource?.is_payment == 0 )) {
        modules.RequestPopup.isVisible() && modules.RequestPopup.hideRef()
        config.Constant.showLoader.showLoader();
        const formData = new FormData();
        formData.append('order_id', order_id);
        formData.append('order_status', config.Constant.ORDER_PAYMENT_TIMEOUT);
  
        var data = await modules.APIServices.PostApiCall(
          config.ApiEndpoint.ORDER_TIMEOUT,
          formData,
        );
        config.Constant.showLoader.hideLoader();
        if (data?.status_code == 200) {
          setTimeout(()=>{
            this.props.navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  { name: 'DashboardTab' },
                  
                ],
              })
            )
            
          },200)
       
          modules.DropDownAlert.showAlert(
            'error',
            config.I18N.t('cancelOrder'),
            config.I18N.t('paymentReqestTimeot'),
          );
          //modules.RequestTimeoutPopup.hideRef();
          // modules.RequestTimeoutPopup.getRef({
          //   title: '',
          //   negativeBtnTxt: '',
          //   positiveBtnTxt: '',
          //   extraData: {},
          //   onPressPositiveBtn: async (data, pressOK) => {
          //     if (pressOK) {
          //       this.retryOrder(data?.data?.id);
          //     } else {
          //       this.props.navigation.reset({
          //         index: 1,
          //         routes: [
          //           {
          //             name: 'NearByDresser',
          //             params: {
          //               latitude: this.state.latitude,
          //               longitude: this.state.longitude,
          //               address: this.state.address,
          //             },
          //           },
          //         ],
          //       });
          //     }
          //   },
          // });


        }
      } 
      modules.RequestPopup2.hideRef()
    }, time*1000)
    
  };

  componentDidUpdate=async ()=>{
  //   const {dataSource} = this.state;
  //   // {"ipc": true, "is_payment": 0, "order_status": 4, "otc": true, "payment_method": 2, "pmc": true}
  //   showLog && console.log("OrderDetails - render", {
  //     order_status: dataSource?.order_status,
  //     is_payment: dataSource?.is_payment,
  //     payment_method: dataSource?.payment_method,
  //     otc: dataSource?.order_status == 4,
  //     ipc: dataSource?.is_payment == 0,
  //     pmc: dataSource?.payment_method == '2'
  //   })
  //  this.setPaymentModal(this.state.dataSource)
  }

  render() {
    const {dataSource} = this.state;
    // this.setPaymentModal(dataSource)
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={false}
          translucent
          backgroundColor="transparent"
          barStyle={'dark-content'}
        />

        <CustomHeader
          onBackPress={
            !!this.state.dataSource &&
            !!this.state.dataSource &&
            this.state.dataSource.order_status != 4 &&
            this.state.dataSource.order_status != 5 &&
            this.state.dataSource.order_status != 6
              ? () => {
                  this.hardwareBackPress();
                }
              : false
          }
          txtStyle={config.I18N.t('orderProcessing')}
        />
        {!!this.state.coords &&
          !!this.state.showMap &&
          this.state.coords.length > 0 &&
          this.profileView()}
        {!!this.state.coords &&
        !!this.state.showMap &&
        this.state.coords.length > 0 ? (
          <View style={{flex: 1}}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={{
                flex: 1,
                //position: 'absolute',
                height: '100%',
                width: '100%',
              }}
              zoomEnabled={true}
              zoomControlEnabled={true}
              region={{
                latitude: parseFloat(this.state.startlat),
                longitude: parseFloat(this.state.startlong),
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}>
              <View>
                <MapView.Polyline
                  coordinates={this.state.coords}
                  strokeWidth={4}
                  strokeColor="#757686"
                />
                <Marker
                  coordinate={{
                    latitude: parseFloat(this.state.endlat),
                    longitude: parseFloat(this.state.endlong),
                    latitudeDelta: 0.09,
                    longitudeDelta: 0.02,
                  }}
                  // title={'ok'}
                  // description={'okok'}
                >
                  <FastImage
                    source={require('../../assets/images/scissor.png')}
                    resizeMode={FastImage.resizeMode.contain}
                    style={{
                      height: 30,
                      width: 30,
                      marginBottom: 10,
                      marginLeft: 20,
                      tintColor: config.Constant.COLOR_TAB,
                    }}
                  />
                </Marker>
                <Marker.Animated
                  title="Pickup"
                  coordinate={{
                    latitude: parseFloat(this.state.startlat),
                    longitude: parseFloat(this.state.startlong),
                    latitudeDelta: 0.09,
                    longitudeDelta: 0.02,
                  }}
                  ref={(ref) => {
                    this.markerRef = ref;
                  }}
                  style={{
                    transform: [{rotate: `${50}deg`}],
                    width: 20,
                    height: 20,
                  }}
                  tracksViewChanges={false}
                  icon={require('../../assets/images/pincar.png')}
                />
              </View>
            </MapView>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  showMap: false,
                });
              }}
              style={[
                styles.wrapRow,
                {
                  backgroundColor: 'white',
                  borderWidth: 1,
                  width: config.Constant.SCREEN_WIDTH * 0.8,
                  position: 'absolute',
                  bottom: 20,
                },
              ]}>
              <Text
                style={[
                  styles.wrapTxtRow,
                  {color: config.Constant.COLOR_TAB, fontSize: 18},
                ]}>
                {config.I18N.t('hideMap')}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            //bounces={false}
            refreshControl={
              <RefreshControl
                tintColor={config.Constant.COLOR_TAB}
                titleColor={config.Constant.COLOR_TAB}
                colors={[config.Constant.COLOR_TAB]}
                refreshing={this.state.isFetching}
                onRefresh={() => this.onRefresh()}
              />
            }>
            {this.profileView()}
            <View style={styles.headerStyle}>
              <Text style={styles.descTitle}>{config.I18N.t('address')}</Text>
            </View>
            <View style={styles.headerBorderStyle} />
            {/* <Text
              onPress={() => {
                if (
                  !!dataSource &&
                  !!dataSource.address &&
                  dataSource.longitude &&
                  dataSource.latitude
                ) {
                  config.Constant.showLoader.showLoader();
                  const scheme = Platform.select({
                    ios: 'maps:0,0?q=',
                    android: 'geo:0,0?q=',
                  });
                  const latLng = `${dataSource.latitude},${dataSource.longitude}`;
                  const url = Platform.select({
                    ios: `${scheme}${dataSource.address}@${latLng}`,
                    android: `${scheme}${latLng}(${label})`,
                  });
                  config.Constant.showLoader.hideLoader();
                  Linking.openURL(url);
                }
              }}
              style={styles.adddressTxt}>
              {!!dataSource && !!dataSource.address ? dataSource.address : '-'}
            </Text> */}

            <View style={styles.mapBox}>
            {/* <Image
              source={require('../../assets/images/mapView.png')}
              style={{
                width: '100%',
                height: 150,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
              }}
              resizeMode={'cover'}
            /> */}
            {dataSource?.latitude && dataSource?.longitude && (
              <MapView
                ref={(ref) => (this.mapRef2 = ref)}
                provider={PROVIDER_GOOGLE}
                style={{
                  overflow:'hidden',
                  width: '100%',
                  height: 150,
                  borderWidth:0
                }}
                draggable={false}
                zoomEnabled={false}
                zoomControlEnabled={false}
                initialRegion={{
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                  latitude: parseFloat(dataSource?.latitude),
                  longitude: parseFloat(dataSource?.longitude),
                }}
                // region={{
                //   latitude: parseFloat(this.state.latitude),
                //   longitude: parseFloat(this.state.longitude),
                // }}
              >
                <Marker
                  draggable={false}
                  coordinate={{
                    latitude: parseFloat(dataSource?.latitude),
                    longitude: parseFloat(dataSource?.longitude),
                  }}
                  // image={require("../../assets/Images /logos.png")}
                />
              </MapView>
            )}
            <Text style={styles.adddressTxt}>
            {!!dataSource && !!dataSource.address ? dataSource.address : '-'}
            </Text>

            {/* <Ripple
              onPress={() => {
                this.props.navigation.navigate('ChangeLocation', {
                  lat: this.state.latitude,
                  lng: this.state.longitude,
                  address: this.state.address,
                  chnageLocation: this.chnageLocation,
                });
              }}>
              <Text style={styles.mapChangeTxt}>{config.I18N.t('change')}</Text>
            </Ripple> */}
          </View>




            <Timeline
              onEventPress={(event) => {
                this.onEventComplete(event);
              }}
              titleStyle={{
                color: 'black',
                fontSize: 16,
                fontFamily: config.Constant.Font_Regular,
                fontWeight: '400',
                marginTop: -12,
              }}
              style={{width: '90%', alignSelf: 'center'}}
              circleSize={20}
              innerCircle={'icon'}
              circleColor={'#fff'}
              showTime={false}
              data={this.state.timeLine}
              options={{bounces: false}}
            />

            {!!dataSource &&
              !!dataSource.order_status &&
              dataSource.order_status != '1' &&
              dataSource.order_status != '2' &&
              dataSource.order_status != '3' &&
              dataSource.order_status != '4' &&
              dataSource.order_status != '5' &&
              dataSource.order_status != '8' && (
                <Text style={styles.counterStyle}>
                  {getArabicFromEng(this.state.counterVal)}
                </Text>
              )}
            {!!this.getStatus(dataSource) && (
              <Text style={styles.statusTxt}>{this.getStatus(dataSource)}</Text>
            )}

            {!!dataSource &&
              !!dataSource.order_status &&
              dataSource.order_status == '7' &&
              !dataSource.order_review && (
                <Ripple
                  onPress={() => {
                    !modules.OrderReviewPopup.isVisible() && modules.OrderReviewPopup.getRef({
                      title: '',
                      negativeBtnTxt: '',
                      positiveBtnTxt: '',
                      extraData: {},
                      onPressPositiveBtn: async (
                        data,
                        pressOK,
                        rating,
                        ReviewTxt,
                      ) => {
                        if (pressOK) {
                          this.giveFeedback(rating, ReviewTxt);
                        }
                      },
                    });
                  }
                }
                  style={[
                    styles.wrapRow,
                    {
                      backgroundColor: 'white',
                      borderWidth: 1,
                      width: config.Constant.SCREEN_WIDTH * 0.8,
                      marginBottom: 15,
                      justifyContent: 'center',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.wrapTxtRow,
                      {
                        color: config.Constant.COLOR_TAB,
                        fontSize: 18,
                        textAlign: 'center',
                      },
                    ]}>
                    {config.I18N.t('giveFeedback')}
                  </Text>
                </Ripple>
              )}
            {/* {!!dataSource &&
              !!dataSource.order_status &&
              dataSource.order_status == '7' &&
              dataSource.is_dispute != '1' &&
              !dataSource.order_review && (
                <Ripple
                  onPress={() => {
                    modules.DisputePopup.getRef({
                      title: '',
                      negativeBtnTxt: '',
                      positiveBtnTxt: '',
                      extraData: {},
                      onPressPositiveBtn: async (data, pressOK, disputeTxt) => {
                        if (pressOK) {
                          this.getDispute(disputeTxt);
                        }
                      },
                    });
                  }}
                  style={[
                    styles.wrapRow,
                    {
                      backgroundColor: 'white',
                      borderWidth: 1,
                      width: config.Constant.SCREEN_WIDTH * 0.8,
                      marginBottom: 15,
                      justifyContent: 'center',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.wrapTxtRow,
                      {
                        color: config.Constant.COLOR_TAB,
                        fontSize: 18,
                        textAlign: 'center',
                      },
                    ]}>
                    {config.I18N.t('dispute')}
                  </Text>
                </Ripple>
              )} */}

            {!!dataSource &&
              !!dataSource.order_status &&
              (dataSource.order_status == '1' ||
                dataSource.order_status == '4' ||
                dataSource.order_status == '5') && (
                <Ripple
                  onPress={() => {
                    Alert.alert(
                      'Alert',
                      config.I18N.t('DoYouWantToCancelServiceRequest'),
                      [
                        {
                          text: config.I18N.t('No'),
                          onPress: () => console.log("Cancel Pressed"),
                          style: "cancel",
                        },
                        {
                          text: config.I18N.t('Yes'),
                          onPress: () => {
                            this.cancelOrder(dataSource.id);
                          },
                        },
                      ],
                     
                    );
                    
                  }}
                  style={[
                    styles.wrapRow,
                    {
                      backgroundColor: 'white',
                      borderWidth: 1,
                      width: config.Constant.SCREEN_WIDTH * 0.8,
                      marginBottom: 15,
                      justifyContent: 'center',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.wrapTxtRow,
                      {
                        color: config.Constant.COLOR_TAB,
                        fontSize: 18,
                        textAlign: 'center',
                      },
                    ]}>
                    {config.I18N.t('cancelOrder')}
                  </Text>
                </Ripple>
              )}

            <View
              style={{
                width: '95%',
                alignSelf: 'center',
                padding: config.Constant.SCREEN_WIDTH * 0.025,
                backgroundColor: config.Constant.COLOR_BORDER_COLOR,
                borderRadius: 10,
              }}>
              <View style={[styles.headerStyle, {width: '100%'}]}>
                <Text style={styles.descTitle}>{config.I18N.t('service')}</Text>
                <Text style={styles.qtyTitle}>{config.I18N.t('qty')}</Text>
                <Text style={styles.priceTitle}>{config.I18N.t('price')}</Text>
              </View>
              {/* <View style={[styles.headerBorderStyle, {marginLeft: 0}]} /> */}
              {!!dataSource &&
                !!dataSource.order_service &&
                dataSource.order_service.map((item, index) => {
                  // showLog && console.log("ITEM-- ", JSON.stringify(item))
                  // showLog && console.log(`Price- `, item?.total, Number(item?.service_tax), config.Constant.dresserAmountWithFee(item?.total, Number(item?.service_tax)))
                  return (
                    <View style={[styles.descStyle, {marginTop: 20}]}>
                      <Text style={styles.descData}>
                        {!!item.category && item.category.name
                          ? item.category.name
                          : '-'}
                      </Text>
                      <Text style={styles.qtyData}>{item.quantity}</Text>
                      <Text style={styles.priceData}>
                        {/* {getFinalPrice(
                          item.total,
                          parseFloat(dataSource.commision_percentage),
                        )} */}
                        {`${(item?.price)*item.quantity}`}
                      </Text>
                    </View>
                  );
                })}
              <View style={styles.borderView} />
              <View
                style={[styles.headerStyle, {marginTop: 10, width: '100%'}]}>
                <Text style={styles.descSubTotal}>
                  {config.I18N.t('SubTotal')}
                </Text>
                <Text style={styles.qtySubTotal}></Text>
                <Text style={styles.priceSubTotal}>
                  {/* {!!dataSource &&
                    getFinalPrice(
                      this.getSubTotal(1),
                      parseFloat(dataSource.commision_percentage),
                    )} */}
                    {!!dataSource && `${dataSource?.hairdressor_amount + dataSource?.commision_amount}`}
                </Text>
              </View>
              {!!dataSource &&
                !!dataSource.promo_code_amount &&
                !!dataSource.promo_code_id && (
                  <View
                    style={[
                      styles.headerStyle,
                      {marginTop: 10, width: '100%'},
                    ]}>
                    <Text style={styles.descData}>
                      {config.I18N.t('promoCode')}
                    </Text>
                    <Text style={styles.qtyData}></Text>
                    <Text style={styles.priceData}>
                      {dataSource.promo_code_amount}
                    </Text>
                  </View>
                )}
              {/* <View
                style={[styles.headerStyle, {marginTop: 10, width: '100%'}]}>
                <Text style={styles.descData}>
                  {config.I18N.t('fees')} (
                  {!!dataSource
                    ? parseFloat(dataSource.commision_percentage)
                    : 0}
                  %)
                </Text>
                <Text style={styles.qtyData}></Text>
                <Text style={styles.priceData}>{this.getSubTotal(4)}</Text>
              </View> */}
              <View
                style={[styles.headerStyle, {marginTop: 10, width: '100%'}]}>
                <Text style={styles.descData}>
                  {config.I18N.t('tax')} (
                  {!!dataSource ? parseFloat(dataSource.tax_percentage) : 0}
                  %)
                </Text>
                <Text style={styles.qtyData}></Text>
                <Text style={styles.priceData}>{!!dataSource ? parseFloat(dataSource.tax_amount) : 0}</Text>
              </View>

              <View style={styles.borderView} />
              {!!dataSource &&
                dataSource.is_payment == 0 &&
                dataSource.payment_method == '2' && (
                  <View
                    style={[
                      styles.headerStyle,
                      {marginTop: 10, width: '100%'},
                    ]}>
                    <Text style={styles.descSubTotal}>
                      {config.I18N.t('PendingWallet')}
                    </Text>
                    <Text style={styles.qtySubTotal}></Text>
                    <Text style={styles.priceSubTotal}>
                      {this.getSubTotal('7')}
                    </Text>
                  </View>
                )}
              <View
                style={[styles.headerStyle, {marginTop: 10, width: '100%'}]}>
                <Text
                  style={[
                    styles.descTitle,
                    {color: config.Constant.COLOR_TAB},
                  ]}>
                  {config.I18N.t('Total')}
                </Text>
                <Text
                  style={[
                    styles.qtyTitle,
                    {color: config.Constant.COLOR_TAB},
                  ]}></Text>
                <Text
                  style={[
                    styles.priceTitle,
                    {color: config.Constant.COLOR_TAB},
                  ]}>
                  {!!dataSource ? parseFloat(dataSource.final_total) : 0}
                </Text>
              </View>
            </View>
            {/* <CustomButton
            btnTxt={config.I18N.t('confirm')}
            onPress={() => {
              //this.props.navigation.navigate('OrderReview');
            }}
            containerStyle={styles.btnStyle}
          /> */}
          </ScrollView>
        )}
        <View style={{backgroundColor: config.Constant.COLOR_TAB,}}>
        {false && !!dataSource &&
          dataSource.order_status != 3 &&
          dataSource.is_payment == 0 &&
          dataSource.payment_method == '2' && (
            <Ripple
              onPress={() => {
                this.DoPayment();
              }}
              style={[
                styles.wrapRow,
                {
                  backgroundColor: config.Constant.COLOR_TAB,
                  borderWidth: 1,
                  width: config.Constant.SCREEN_WIDTH * 0.8,
                  marginBottom: 15,
                  justifyContent: 'center',
                },
              ]}>
              <Text
                style={[
                  styles.wrapTxtRow,
                  {
                    color: 'white',
                    fontSize: 18,
                    textAlign: 'center',
                    fontWeight: 'bold'
                  },
                ]}>
                {config.I18N.t('PayToStartOrder')}
              </Text>
            </Ripple>
          )}
          </View>
        {!!this.state.coords &&
          !this.state.showMap &&
          dataSource != null &&
          //dataSource.order_status == 5 &&
          this.state.coords.length > 0 && (
            <TouchableOpacity
            onPress={() => {
             this.setState({showMap: true});
           }}
             style={[
               styles.wrapRow,
               {
                 backgroundColor: 'white',
                 borderWidth: 1,
                 width: config.Constant.SCREEN_WIDTH * 0.8,
                 marginVertical:24
               },
             ]}>
             <Text
               style={[
                 styles.wrapTxtRow,
                 { color: config.Constant.COLOR_TAB, fontSize: 18 },
               ]}>
               {config.I18N.t('showMap')}
             </Text>
           </TouchableOpacity>
          )}
      </View>
    );
  }
}
