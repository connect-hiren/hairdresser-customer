import React from 'react';
import { StyleSheet, View, AppState, StatusBar } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import config from '../config';
import modules from '../modules';
import RequestPopup from '../modules/RequestPopup/RequestPopup';
import PaymentTimerPopup from '../modules/PaymentTimerPopup/PaymentTimerPopup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundTimer from 'react-native-background-timer';
import RequestRejectedPopup from '../modules/RequestRejectedPopup/RequestRejectedPopup';
import RequestTimeoutPopup from '../modules/RequestTimeoutPopup/RequestTimeoutPopup';
import ErrorAlert from '../modules/ErrorAlert/ErrorAlert';
import AcceptMoney from '../modules/AcceptMoney/AcceptMoney';
import AddMoney from '../modules/AddMoney/AddMoney';
import DisputePopup from '../modules/DisputePopup/DisputePopup';
import CustomLoader from './CustomLoader';
import SocketIOClient from 'socket.io-client';
// import SocketIOClient from 'socket.io-client/dist/socket.io';

import NetInfo from '@react-native-community/netinfo';
import OrderReviewPopup from '../modules/OrderReviewPopup/OrderReviewPopup';
var PushNotification = require('react-native-push-notification');
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { CommonActions } from '@react-navigation/native';
var interval
class RootComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      appState: AppState.currentState,
    };
  }

  componentDidMount = () => {
    config.Constant.showLoader = this.showLoader;
    this.socketConnect();
    PushNotification.configure({
      onNotification: (notification) => {
        if (!!notification.data && notification.data.order_id) {
          // this.props.navigation.navigate('OrderDetails', {
          //   order_id: notification.data.order_id,
          // });
        } else {
          // this.props.navigation.navigate('Notification');
        }
        notification.finish(PushNotificationIOS.FetchResult.NoData);
        // this.manageStateChange({result:notification.data})
      },
      
    }
    );
    // SOCKET DATA
    AppState.addEventListener('change', this._handleAppStateChange);
    PushNotification.createChannel(
      {
        channelId: "channel-id", // (required)
        channelName: "My channel", // (required)
        channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
        playSound: false, // (optional) default: true
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  };
  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      try {
        console.log("_handleAppStateChange ROOT")
        // config.Constant.USER_DATA.onRefresh && config.Constant.USER_DATA.onRefresh()
        config.Constant.USER_DATA.order_id && config.Constant.USER_DATA.onRefresh(config.Constant.USER_DATA.order_id)
        config.Constant.socket.connect();
        if (!!config.Constant.USER_DATA.id) {
          config.Constant.socket.emit('room', config.Constant.USER_DATA.id);
          // this.getPendingOrders()
        }
      } catch (error) { }
    } else {
      //Keyboard.dismiss();
    //   console.log('app goes to background')
    //   //tell the server that your app is still online when your app detect that it goes to background
    //   interval = BackgroundTimer.setInterval(()=>{
    //     console.log('connection status ', config.Constant.socket.connected)
    //     config.Constant.socket.emit('online')
    //   },5000)
    // this.setState({
    //   appState:nextAppState
    // })
    // console.log("AppState", this.state.appState);

    }
    PushNotification.removeAllDeliveredNotifications();
    this.setState({ appState: nextAppState });
  };
  componentWillUnmount = () => {
    AppState.addEventListener('change', this._handleAppStateChange);
  };
  giveFeedback = async (data) => {
      config.Constant.showLoader.showLoader();
      const formData = new FormData();
      formData.append('order_id', data.id);
      formData.append('sender_id', data.user_id);
      formData.append('receiver_id', data.user_id2);
      formData.append('rating', data.rating);
      formData.append('comment', data.reviewTxt);

      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.GIVE_RATING,
        formData,
      );

      if (data?.status_code == 200) {
        modules.DropDownAlert.showAlert(
          'success',
          config.I18N.t('success'),
          data.message,
        );
        config.Constant.showLoader.hideLoader();
        // this.props.navigation.reset({
        //   index: 1,
        //   routes: [{name: 'DashboardTab'}],
        // });
      } else {
        config.Constant.showLoader.hideLoader();
        modules.DropDownAlert.showAlert(
          'error',
          config.I18N.t('error'),
          data.message,
        );
      }
  };
  manageStateChange=async(data)=>{
    console.log("MANAGE EMIT - ",  modules.RequestPopup.isVisible())
    if (!!data.result.type && data.result.type == config.Constant.ORDER_REQUEST) {
      // ORDER REQUEST
      //this.getOrderDetails(data.result.order_id);
    } else if (!!data.result.type && data.result.type == config.Constant.ORDER_TIMEOUT) {
      // ORDER TIMEOUT
      
      modules.RequestPopup.isVisible() && modules.RequestPopup.hideRef();
      console.log("BEFORE CALL NAVIGATION ROOT")
        setTimeout(()=>{
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
    
      config.Constant.RootNavigation.reset({
        index: 1,
        routes: [
          {
            name: 'OrderDetails',
            params: { order_id: data.data.id } ,
          },
        ],
      });
    } else {
    }
  };
  
  socketConnect = () => {
    config.Constant.socket = SocketIOClient(config.Constant.API_SOCKET_URL,{
      // jsonp: false,
      // reconnection: true,
      // reconnectionDelay: 100,
      // reconnectionAttempts: 5000,
      transports: ['websocket']
    });

    // config.Constant.socket.connect();
    setTimeout(() => {
      console.log('SOCKET DATA >', config.Constant.socket);
    }, 10000);
    NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        try {
          config.Constant.socket.connect();
          if (!!config.Constant.USER_DATA.id) {
            config.Constant.socket.emit('room', config.Constant.USER_DATA.id);
          }
        } catch (error) { }
      }
    });
    config.Constant.socket.connect();
    config.Constant.socket.on('connect', () => {
      console.log('SOCKET DATA Connect');
      // if (!!config.Constant.USER_DATA.id) {
      //   config.Constant.socket.emit('room', config.Constant.USER_DATA.id);
      // }
    });
    config.Constant.socket.on('disconnect', () => {
      console.log('SOCKET DATA Disconnect');
      config.Constant.socket.connect();
    });

    config.Constant.socket.on('send_notification', (data) => {
      console.log('send_notification ROOT', data.result, config.Constant.ORDER_REQUEST)
      this.manageStateChange(data)
    });
    config.Constant.socket.on('reconnect', (number) => {
      console.log('Reconnected to server', number);
      try {
        config.Constant.socket.connect();
        if (!!config.Constant.USER_DATA.id) {
          config.Constant.socket.emit('room', config.Constant.USER_DATA.id);
        }
      } catch (error) { }
    });

    config.Constant.socket.on('reconnect_attempt', () => {
      console.log('Reconnect Attempt');
      try {
        config.Constant.socket.connect();
        if (!!config.Constant.USER_DATA.id) {
          config.Constant.socket.emit('room', config.Constant.USER_DATA.id);
        }
      } catch (error) { }
    });

    config.Constant.socket.on('reconnecting', (number) => {
      console.log('Reconnecting to server', number);
      try {
        config.Constant.socket.connect();
        if (!!config.Constant.USER_DATA.id) {
          config.Constant.socket.emit('room', config.Constant.USER_DATA.id);
        }
      } catch (error) { }
    });

    config.Constant.socket.on('reconnect_error', (err) => {
      console.log('Reconnect Error', err);
      try {
        config.Constant.socket.connect();
        if (!!config.Constant.USER_DATA.id) {
          config.Constant.socket.emit('room', config.Constant.USER_DATA.id);
        }
      } catch (error) { }
    });

    config.Constant.socket.on('error', (err) => {
      console.log('error Error', err);
      try {
        config.Constant.socket.connect();
        if (!!config.Constant.USER_DATA.id) {
          config.Constant.socket.emit('room', config.Constant.USER_DATA.id);
        }
      } catch (error) { }
    });

    config.Constant.socket.on('reconnect_failed', () => {
      console.log('Reconnect failed');
      try {
        config.Constant.socket.connect();
        if (!!config.Constant.USER_DATA.id) {
          config.Constant.socket.emit('room', config.Constant.USER_DATA.id);
        }
      } catch (error) { }
    });

    config.Constant.socket.on('connect_error', () => {
      console.log('connect_error');
      try {
        config.Constant.socket.connect();
        if (!!config.Constant.USER_DATA.id) {
          config.Constant.socket.emit('room', config.Constant.USER_DATA.id);
        }
      } catch (error) { }
    });
  };
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={false}
          translucent
          backgroundColor="transparent"
          barStyle={'dark-content'}
        />
        {this.props.children}
        <CustomLoader ref={(showLoader) => (this.showLoader = showLoader)} />
        <RequestRejectedPopup
          ref={(RequestRejectedPopupRef) =>
            modules.RequestRejectedPopup.setRef(RequestRejectedPopupRef)
          }
        />
        <RequestTimeoutPopup
          ref={(RequestTimeoutPopupRef) =>
            modules.RequestTimeoutPopup.setRef(RequestTimeoutPopupRef)
          }
        />
        <AcceptMoney
          ref={(AcceptMoneyRef) => modules.AcceptMoney.setRef(AcceptMoneyRef)}
        />

        <AddMoney 
           ref= {(AddMoneyRef) => modules.AddMoney.setRef(AddMoneyRef)}
        />
        
        <DisputePopup
          ref={(DisputePopupRef) =>
            modules.DisputePopup.setRef(DisputePopupRef)
          }
        />
        <RequestPopup
          ref={(RequestPopupRef) =>
            modules.RequestPopup.setRef(RequestPopupRef)
          }
        />
        <PaymentTimerPopup
          ref={(PaymentTimerPopupRef) =>
            modules.RequestPopup2.setRef(PaymentTimerPopupRef)
          }
        />
       
        <OrderReviewPopup
          ref={(OrderReviewPopupRef) =>
            modules.OrderReviewPopup.setRef(OrderReviewPopupRef)
          }
        />
        <ErrorAlert
          ref={(ErrorAlertRef) => modules.ErrorAlert.setRef(ErrorAlertRef)}
        />
        <DropdownAlert
          ref={(dropDownRef) =>
            modules.DropDownAlert.setDropDownRef(dropDownRef)
          }
          translucent={true}
          closeInterval={2000}
          updateStatusBar={false}
          onTap={(data) => { }}
          messageNumOfLines={5}
          containerStyle={{
            backgroundColor: config.Constant.COLOR_PRIMARY,
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RootComponent