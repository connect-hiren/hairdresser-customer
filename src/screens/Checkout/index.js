import React from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  BackHandler,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

import FastImage from 'react-native-fast-image';
import Ripple from 'react-native-material-ripple';
import StarRating from 'react-native-star-rating';
import CustomButton from '../../component/CustomButton';
import CustomHeader from '../../component/CustomHeader';
import InputText from '../../component/InputText';
import config from '../../config';
import styles from './styles';
import {getRoundOf, getFinalPrice} from '../../Util/Utilities';
import modules from '../../modules';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

export default class Checkout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageUdate: true,
      coupon: '',
      errorMsg: '',
      Data1: 1,
      Data2: 1,
      Data3: 1,
      dataSource: null,
      catSelectedArr: [],
      latitude: '',
      longitude: '',
      address: '',
      fees: 0,
      commission: 0,
      cash_limit:500,
      tax:0,
      isCash: false,
      successMsg: '',
      couponCode: '',
      couponPercentage: '',
      couponid: '',
      showCash: true,
      counterVal: '00:00',
      country: 'IN',
      first_name: 'John',
      last_name: 'Doe',
      address: '101 ABC Street',
      city: 'Kolkata',
      state: 'West Bengal',
      zip: '700001',
      phone_number: '9001010101',
      customerEmail: 'test@test.com',
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
      allowCash: false,
      minCash: 0,
      maxCash: 0
    };
  }
  componentDidMount = () => {
    // const navi = config.Constant.RootNavigation.navigate('scissor');
    this.props.navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
      var dataSource = this.props.route.params.dataSource;
      var latitude = this.props.route.params.latitude;
      var longitude = this.props.route.params.longitude;
      var address = this.props.route.params.address;
      var catSelectedArr = this.props.route.params.catSelectedArr;

      config.Constant.LATITUDE = latitude
      config.Constant.LONGITUDE = longitude
      config.Constant.ADDRESS = address


      if (!!dataSource && !!catSelectedArr) {
        this.setState(
          {
            dataSource,
            catSelectedArr,
            latitude,
            longitude,
            address,
          },
          () => {
            
            let isCashSet= false ;
            config.Constant.settingData.map((itm, ind) => {
              // console.log("itm.key_name ", itm.key_name,itm.key_value)
              if (itm.key_name == 'cash_limit') {
                var showCash = true;
                if (
                  !!this.state.dataSource &&
                  !!this.state.dataSource.wallet_total
                ) {
                  var walletAmout = `${this.state.dataSource.wallet_total}`;
                  


                  if (walletAmout.includes('-')) {
                    walletAmout = walletAmout.replace('-', '');
                //     console.log("walletAmout 101- ", walletAmout, parseFloat(walletAmout) +
                //   getRoundOf(this.getSubTotal('3')),  parseFloat(walletAmout) +
                //   getRoundOf(this.getSubTotal('3')) >
                // parseFloat(itm.key_value))
                    if (
                      parseFloat(walletAmout) +
                        getRoundOf(this.getSubTotal('3')) >
                      parseFloat(itm.key_value) 
                    ) {
                      showCash = false;
                      isCashSet= true
                      this.setState({
                        isCash: false,
                      });
                    }
                  }
                }
                if (
                  !!config.Constant.USER_DATA &&
                  !!config.Constant.USER_DATA.wallet_total
                ) {
                  var walletAmoutCustomer = `${config.Constant.USER_DATA.wallet_total}`;
                  if (walletAmoutCustomer.includes('-')) {
                    walletAmoutCustomer = walletAmoutCustomer.replace('-', '');
                    if (
                      parseFloat(walletAmoutCustomer) +
                        getRoundOf(this.getSubTotal('3')) >
                      parseFloat(itm.key_value)
                    ) {
                      showCash = false;
                      isCashSet= true;
                      this.setState({
                        isCash: false,
                      });
                    }
                  }
                }
                this.setState({
                  showCash,
                });
              }else if (itm.key_name == 'min_cash_limit' && !isCashSet) {
                if(getRoundOf(this.getSubTotal('3')) < parseFloat(itm.key_value)){
                  isCashSet= true
                this.setState({
                  isCash: false,
                  showCash: false,
                });
               }else{
                this.setState({
                  showCash: true,
                });
               }
              }
               else if (itm.key_name == 'max_cash_limit' && !isCashSet) {
                 console.log("MAX2. ", getRoundOf(this.getSubTotal('3')), parseFloat(itm.key_value), getRoundOf(this.getSubTotal('3')) > parseFloat(itm.key_value))
                if(getRoundOf(this.getSubTotal('3')) > parseFloat(itm.key_value)){
                  isCashSet= true
                 this.setState({
                   isCash: false,
                   showCash: false,
                 });
                }else{
                 this.setState({
                   showCash: true,
                 });
                }
              
                
              }
            });
          },
        );
      }
      // config.Constant.socket.on('send_notification', async (data) => {
      //   console.log("send_notification Checkout", data.result)
      //   if (!!data.result.type && data.result.type == config.Constant.ORDER_REJECT) {
      //     modules.RequestPopup.hideRef();
      //     this.props.navigation.reset({
      //       index: 1,
      //       routes: [
      //         {
      //           name: 'NearByDresser',
      //           params: {
      //             latitude: this.state.latitude,
      //             longitude: this.state.longitude,
      //             address: this.state.address,
      //           },
      //         },
      //       ],
      //     });
      //     modules.RequestRejectedPopup.getRef({
      //       title: '',
      //       negativeBtnTxt: '',
      //       positiveBtnTxt: '',
      //       extraData: {},
      //       onPressPositiveBtn: async (data, pressOK) => {
              
      //         if (pressOK) {
      //           // this.props.navigation.reset({
      //           //   index: 1,
      //           //   routes: [{name: 'DashboardTab'}],
      //           // });
      //         }
      //       },
      //     });
      //   }
      //   // else if (!!data.result.type && data.result.type == config.Constant.ORDER_TIMEOUT) {
      //   //   console.log("manageStateChange - Call NearBYHairDresser" )
      //   //   modules.RequestPopup.hideRef();
      //   //   config.Constant.RootNavigation.reset({
      //   //     index: 1,
      //   //     routes: [{ name: 'NearByDresser' } ],
      //   //   });
      //   //   // config.Constant.RootNavigation.reset({
      //   //   //   index: 1,
      //   //   //   routes: [{ name: 'DashboardTab' }],
      //   //   // });
    
      //   // } 
      // });
    });
    this.props.navigation.addListener('blur', () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.hardwareBackPress,
      );
    });
    let stateNew={}
    config.Constant.settingData.map((itm, ind) => {
      console.log(`${itm.key_name}=> ${itm.key_value}`)
      if (itm.key_name == 'tax') {
        stateNew={
          ...stateNew,
          tax: itm.key_value
        }
        // this.setState({
        //   tax: itm.key_value,
        // });
      }
      if (itm.key_name == 'app_fee') {
        stateNew={
          ...stateNew,
          fees: itm.key_value
        }
        // this.setState({
        //   fees: itm.key_value,
        // });
      }
      if (itm.key_name == 'min_cash_limit') {
        stateNew={
          ...stateNew,
          minCash: itm.key_value
        }
        // this.setState({
        //   minCash: itm.key_value,
        // });
      }
      if (itm.key_name == 'max_cash_limit') {
        stateNew={
          ...stateNew,
          maxCash: itm.key_value
        }
        // this.setState({
        //   maxCash: itm.key_value,
        // });
      }
      
      if (itm.key_name == 'commission') {
        stateNew={
          ...stateNew,
          commission: itm.key_value
        }
        // this.setState({
        //   commission: itm.key_value,
        // });
      }

      if (itm.key_name == 'cash_limit') {
        stateNew={
          ...stateNew,
          cash_limit: itm.key_value
        }
        // this.setState({
        //   commission: itm.key_value,
        // });
      }
    });
    this.setState(stateNew)

  };
  hardwareBackPress = () => {
    this.props.navigation.pop();
    return true;
  };
  getSubTotal = (type) => {
    const {catSelectedArr} = this.state;
    var total = 0;
    var Subtotal = 0;
    var totalFees = 0;
    var totalCommission = parseFloat(this.state.fees) 
    catSelectedArr.map((item, index) => {
      if (!!item.price && !!item.quantity) {
        Subtotal = Subtotal + parseFloat(item.price * parseInt(item.quantity));
      }
    });
    var discount = !!this.state.couponPercentage
      ? parseFloat(this.state.couponPercentage)
      : 0;
    let subTotalNew = Subtotal // added By HIREN
    if(!!this.state.couponPercentage){
      subTotalNew = subTotalNew*(100-parseFloat(this.state.couponPercentage)) /100
      console.log("subTotalNew - ",subTotalNew)
    }

    if (type == '1') {
      return Subtotal;
    } else if (type == '2') {
      Subtotal = Subtotal - discount;
      return (Subtotal * totalCommission) / 100;
    } else if (type == '3') {
      Subtotal = Subtotal - discount;
      // return Subtotal + (Subtotal * totalCommission) / 100;
      // console.log("3.1 Subtotal", Subtotal)
      // console.log("3.2 Total", Subtotal + ((Subtotal * totalCommission) / 100) +(Subtotal * parseFloat(this.state.tax)) / 100)
      return subTotalNew + ((subTotalNew * totalCommission) / 100) +(subTotalNew * parseFloat(this.state.tax)) / 100;


      
    } else if (type == '4') {
      Subtotal = Subtotal - discount;
      return (Subtotal * parseFloat(this.state.tax)) / 100;
    } else if (type == '5') {
      // Subtotal = Subtotal - discount;

      return (Subtotal * parseFloat(this.state.commission)) / 100;

    } else if (type == '6') {
      return (Subtotal * parseFloat(this.state.couponPercentage)) / 100;
    }
    else if (type == '7') {
      // console.log("getSubTotal - 7", {Subtotal, tax:this.state.tax, value:(Subtotal * parseFloat(this.state.tax)) / 100} )
      return (subTotalNew * parseFloat(this.state.tax)) / 100;
    } else if (type == '8') {
      Subtotal = Subtotal - discount;
      return (Subtotal * parseFloat(this.state.fees)) / 100;
    } 
  };


  getTotal=()=>{
   let amount = getRoundOf(this.getSubTotal('3'))+Math.abs(config.Constant.USER_DATA.wallet_total)
   return amount.toFixed(2)
  }

  timeoutOrder = async (order_id) => {
    //modules.RequestTimeoutPopup.hideRef();
    if (!!order_id) {
      config.Constant.showLoader.showLoader();
      const formData = new FormData();
      formData.append('order_id', order_id);

      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.ORDER_TIMEOUT,
        formData,
      );
      config.Constant.showLoader.hideLoader();
      if (data?.status_code == 200) {
        //modules.RequestTimeoutPopup.hideRef();
        console.log("SHOW REQUEST TIMEOUT START")
        !modules.RequestTimeoutPopup.isVisible() && modules.RequestTimeoutPopup.getRef({
          title: '',
          negativeBtnTxt: '',
          positiveBtnTxt: '',
          extraData: {},
          onPressPositiveBtn: async (data, pressOK) => {
            console.log("modules.RequestTimeoutPopup called")
            console.log("BEFORE CALL NAVIGATION ORDER CHECKOUT TIMEOUT 1 ")
        setTimeout(()=>{
          this.props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                { name: 'NearByDresser',
                params: {
                  latitude: this.state.latitude,
                  longitude: this.state.longitude,
                  address: this.state.address,
                }, },
                
              ],
            })
          )
          console.log("AFTER CALL NAVIGATION ORDER CHECKOUT TIMEOUT 2 ")
        },200)
            // this.props.navigation.reset({
            //   index: 1,
            //   routes: [
            //     {
            //       name: 'NearByDresser',
            //       params: {
            //         latitude: this.state.latitude,
            //         longitude: this.state.longitude,
            //         address: this.state.address,
            //       },
            //     },
            //   ],
            // });
           
          },
        });
      }
    }
  };
  cancelOrder = async (order_id) => {
    modules.RequestPopup.isVisible() && modules.RequestPopup.hideRef();
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
        console.log("BEFORE CALL NAVIGATION ORDER CHECKOUT TIMEOUT 1 CANCEL")
        setTimeout(()=>{
          this.props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                { name: 'DashboardTab' },
                
              ],
            })
          )
          console.log("AFTER CALL NAVIGATION ORDER CHECKOUT TIMEOUT 2 CANCEL")
        },200)
      }
    }
  };
  applyCoupon = async () => {
    config.Constant.showLoader.showLoader();
    const formData = new FormData();
    formData.append('promo_code', this.state.coupon);
    formData.append('amount', this.getSubTotal('1'));

    
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.APPLY_PROMOCODE,
      formData,
    );
    config.Constant.showLoader.hideLoader();
    if (data?.status_code == 200) {
      this.setState({
        couponCode: data?.data?.code,
        coupon: '',
        couponPercentage: data?.data?.percentage,
        couponid: data?.data?.id,
      });
      modules.DropDownAlert.showAlert(
        'success',
        config.I18N.t('success'),
        data.message,
      );
    } else {
      this.setState({
        errorMsg: data.message,
        coupon: '',
        couponCode: '',
        couponPercentage: '',
      });
    }
  };
  retryOrder = async (orderId) => {
    config.Constant.showLoader.showLoader();
    
    const formData = new FormData();
    formData.append('order_id', orderId);
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.RETRY_ORDER,
      formData,
    );
    config.Constant.showLoader.hideLoader();
    if (data?.status_code == 200) {
      modules.DropDownAlert.showAlert(
        'success',
        config.I18N.t('success'),
        data.message,
      );
     
      !modules.RequestPopup.isVisible() && modules.RequestPopup.getRef({
        title: '',
        negativeBtnTxt: '',
        positiveBtnTxt: '',
        extraData: data.data,
        onPressPositiveBtn: async (data1, pressOK) => {
          if (pressOK) {
            //this.updateData(false);
            this.cancelOrder(data.data.id);
          } else {
          }
        },
        onTimeOutPopup: async () => {
          this.timeoutOrder(data.data.id);
        },
      });
      //this.props.navigation.navigate('OrderDetails');
      // this.props.navigation.reset({
      //   index: 1,
      //   routes: [{name: 'OrderDetails'}],
      // });
    } else {
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('error'),
        data.message,
      );
    }
  };
  requestOrder1 = () => {
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
      callBack: this.onProcessPayment(),
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
  requestOrder = async () => {
    config.Constant.showLoader.showLoader();
    const formData = new FormData();
    formData.append('services', JSON.stringify(this.state.catSelectedArr));
    formData.append('latitude', this.state.latitude);
    formData.append('longitude', this.state.longitude);
    formData.append('hairdresser_id', this.state.dataSource.id);
    formData.append('address', this.state.address);
    formData.append('tax_percentage', parseFloat(this.state.tax));
    formData.append('tax_amount', this.getSubTotal('7'));
    let commision_percentage = parseFloat(this.state.commission)
    let commision_amount = this.getSubTotal('5')
    if(`${this.state.couponPercentage}`.length > 0){
      commision_percentage = commision_percentage - parseFloat(this.state.couponPercentage)
      console.log("commision_amount ",{
        commision_amount,
        promo_amount: this.getSubTotal('6')
      })
      commision_amount = commision_amount - this.getSubTotal('6')
    }
    
    formData.append('commision_percentage', commision_percentage);
    formData.append('commision_amount', commision_amount);
    formData.append('payment_method', !!this.state.isCash ? 1 : 2);
    if (!!this.state.couponid && !!this.getSubTotal('6')) {
      formData.append('promo_code_id', this.state.couponid);
      formData.append('promo_code_amount', this.getSubTotal('6'));
    }
    console.log("BEFORE_API_CALL - ", formData)
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.ORDER_REQUEST,
      formData,
    );

    // var data = {}
    config.Constant.showLoader.hideLoader();
    if (data?.status_code == 200) {
      // console.log('this.props.route.params?.from_search - ', this.props.route.params?.from_search )   
      // await AsyncStorage.setItem('from_search', this.props.route.params?.from_search ? '1' : '0')
      // await AsyncStorage.removeItem('catSelectedArr')
      modules.DropDownAlert.showAlert(
        'success',
        config.I18N.t('success'),
        data.message,
      );
      console.log("AFTER_API_CALL - ", data?.data)
      if(data?.data && data?.data?.order_status != 4){
        !modules.RequestPopup.isVisible() && modules.RequestPopup.getRef({
          title: '',
          negativeBtnTxt: '',
          positiveBtnTxt: '',
          extraData: data.data,
          onPressPositiveBtn: async (data1, pressOK) => {
            if (pressOK) {
              this.cancelOrder(data.data.id);
            } else {
            }
          },
          onTimeOutPopup: async () => {
            this.timeoutOrder(data.data.id);
          },
        });
      }
      //this.props.navigation.navigate('OrderDetails');
      // this.props.navigation.reset({
      //   index: 1,
      //   routes: [{name: 'OrderDetails'}],
      // });
    } else {
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('error'),
        data.message,
      );
    }
  };

  chnageLocation = (latitude, longitude, address) => {
    this.setState({
      latitude,
      longitude,
      address,
    });
  };

  render() {
    const {dataSource, catSelectedArr} = this.state;
    console.log("this.state.minCash render  ", this.state.minCash, typeof this.state.minCash)
    let isAllowOrder = Number(this.state.minCash) <= this.getSubTotal('1')
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={false}
          translucent
          backgroundColor="transparent"
          barStyle={'dark-content'}
        />

        <CustomHeader
          onBackPress={() => {
            this.hardwareBackPress();
          }}
          txtStyle={config.I18N.t('checkout')}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          bounces={false}>
          
          
          {false && <View style={styles.reviewBox}>
            <View style={styles.serviceRowView}>
              <FastImage
                resizeMode={'cover'}
                style={{width: 50, height: 50, borderRadius: 100}}
                source={
                  !!dataSource && !!dataSource.image
                    ? {
                        uri:
                          config.Constant.UsersProfile_Url +
                          '' +
                          dataSource.image,
                      }
                    : require('../../assets/images/male.png')
                }
              />
              <View style={{flex: 1, paddingHorizontal: 10}}>
                <Text numberOfLines={2} style={styles.reviewName}>
                  {!!dataSource && !!dataSource.name ? dataSource.name : ''}
                </Text>
                {!!dataSource &&
                  !!dataSource.reviews &&
                   (
                    <View
                      style={[
                        styles.serviceRowView,
                        {marginVertical: 0, justifyContent: 'flex-start', width:'100%'},
                      ]}>
                      <StarRating
                        disabled={true}
                        halfStar={require('../../assets/images/icon_halfstar.png')}
                        fullStar={require('../../assets/images/filledStar.png')}
                        emptyStar={require('../../assets/images/startInactive.png')}
                        maxStars={5}
                        rating={
                          !!dataSource &&
                          !!dataSource.avg_rating &&
                          dataSource.avg_rating.length > 0 &&
                          !!dataSource.avg_rating[0].avg_rating
                            ? dataSource.avg_rating[0].avg_rating
                            : 4
                        }
                        containerStyle={{height: 25, width: 70}}
                        starStyle={{marginRight: 5}}
                        starSize={20}
                        selectedStar={(rating) => {}}
                      />
                     {dataSource?.reviews?.length > 0 && <Text numberOfLines={2} style={styles.reviewTxt}>
                        (
                        {!!dataSource &&
                        !!dataSource.reviews &&
                        dataSource.reviews.length > 0
                          ? dataSource.reviews.length
                          : ''}{' '}
                        {config.I18N.t('reviews')})
                      </Text>}
                    </View>
                  )}
              </View>

              
              {/* <Ripple
                onPress={() => {
                  !!dataSource &&
                    !!dataSource.name &&
                    Linking.openURL(`tel:${dataSource.phone_number}`);
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
              </Ripple> */}
            </View>
          </View>}
          
          { false && <> <View style={styles.headerStyle}>
            <Text style={styles.descTitle}>{config.I18N.t('address')}</Text>
          </View>
          <View style={styles.headerBorderStyle} />

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
            {!!this.state.latitude && !!this.state.longitude && (
              <MapView
                ref={(ref) => (this.mapRef = ref)}
                provider={PROVIDER_GOOGLE}
                style={{
                  width: '100%',
                  height: 150,
                  borderTopRightRadius: 20,
                  borderTopLeftRadius: 20,
                }}
                draggable={false}
                zoomEnabled={false}
                zoomControlEnabled={false}
                initialRegion={{
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                  latitude: parseFloat(this.state.latitude),
                  longitude: parseFloat(this.state.longitude),
                }}
                // region={{
                //   latitude: parseFloat(this.state.latitude),
                //   longitude: parseFloat(this.state.longitude),
                // }}
              >
                <Marker
                  draggable={false}
                  coordinate={{
                    latitude: parseFloat(this.state.latitude),
                    longitude: parseFloat(this.state.longitude),
                  }}
                  // image={require("../../assets/Images /logos.png")}
                />
              </MapView>
            )}
            <Text style={styles.mapDescTxt}>
              {!!this.state.address ? this.state.address : ''}
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
          </View> </>}

          <View style={styles.headerStyle}>
            <Text style={styles.descTitle}>{config.I18N.t('applyCoupon')}</Text>
          </View>
          <View style={styles.headerBorderStyle} />
          <View
            style={[
              styles.selectedItemsView,
              {marginTop: 0, marginBottom: 20, alignItems: 'flex-start'},
            ]}>
            <InputText
              onRef={(ref) => (this.couponRef = ref)}
              containerStyle={styles.inputStyle}
              value={this.state.coupon}
              onChangeText={(coupon) => {
                this.setState({
                  coupon,
                  errorMsg: '',
                });
              }}
              placeholder={config.I18N.t('enterCouponCode')}
              returnKeyType={'next'}
              onSubmitEditing={() => {}}
              blurOnSubmit={true}
              errorMsg={this.state.errorMsg}
            />
            <CustomButton
              btnTxt={config.I18N.t('apply')}
              onPress={() => {
                if (!this.state.coupon) {
                  this.setState({
                    errorMsg: config.I18N.t('fillPromo'),
                  });
                } else {
                  this.applyCoupon();
                }
                //this.props.navigation.navigate('CreatePass');
              }}
              containerStyle={styles.applyStyle}
            />
          </View>
          <View style={styles.headerStyle}>
            <Text style={styles.descTitle}>
              {config.I18N.t('paymentMethod')}
            </Text>
          </View>
          <View style={styles.headerBorderStyle} />

          <View style={styles.mapBox}>
            <Ripple
              onPress={() => {
                this.setState({
                  isCash: false,
                });
              }}
              style={[
                styles.selectedItemsView,
                {
                  marginTop: 20,
                  marginBottom:
                    !!this.state.showCash &&
                    !!dataSource &&
                    dataSource.payment_type == '1'
                      ? 0
                      : 20,
                },
              ]}>
              <Text
                style={[
                  styles.searchName,
                  {
                    fontFamily: !this.state.isCash
                      ? config.Constant.Font_Semi_Bold
                      : config.Constant.Font_Regular,
                  },
                ]}>
                {config.I18N.t('creditDebitCard')}
              </Text>
              <View style={styles.emptyIcon}>
                {!this.state.isCash && <View style={styles.filledIcon} />}
              </View>
            </Ripple>
            {!!this.state.showCash &&
              !!dataSource &&
              dataSource.payment_type == '1' && (
                <Ripple
                  onPress={() => {
                    this.setState({
                      isCash: true,
                    });
                  }}
                  style={[styles.selectedItemsView, {marginBottom: 20}]}>
                  <Text
                    style={[
                      styles.searchName,
                      {
                        fontFamily: !!this.state.isCash
                          ? config.Constant.Font_Semi_Bold
                          : config.Constant.Font_Regular,
                      },
                    ]}>
                    {config.I18N.t('cashOnDelivery')}
                  </Text>
                  <View style={styles.emptyIcon}>
                    {!!this.state.isCash && <View style={styles.filledIcon} />}
                  </View>

                  {/* </Ripple> */}
                </Ripple>
              )}
          </View>

          <View
            style={{
              width: '95%',
              alignSelf: 'center',
              padding: config.Constant.SCREEN_WIDTH * 0.025,
              backgroundColor: config.Constant.COLOR_BORDER_COLOR,
              borderRadius: 10,
              marginBottom:20
            }}>
              <View style={[styles.headerStyle, {marginTop: 10, width: '100%'}]}>
                <Text style={styles.descData}>{config.I18N.t('minCash')}</Text>
                
                <Text style={styles.qtyData}></Text>
                <Text style={styles.priceData}>{' '}{this.state.minCash}</Text>
              </View> 


             
              <View style={[styles.headerStyle, {marginTop: 10, width: '100%'}]}>
                <Text style={styles.descData}>{config.I18N.t('maxCash')}</Text>
                <Text style={styles.qtyData}></Text>
                <Text style={styles.priceData}>{' '}{this.state.maxCash}</Text>
              </View> 
          </View>


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
            

            <View style={[styles.headerBorderStyle, {marginLeft: 0}]} />
            {catSelectedArr &&
              catSelectedArr.map((itemService, indexService) => {
                return (
                  <View key={indexService} style={styles.descStyle}>
                    <Text style={styles.descData}>
                      {!!itemService.name ? config.I18N.locale == 'en'
                              ? itemService.name
                              : itemService.ar_name : ''}
                    </Text>
                    <Text style={styles.qtyData}>{itemService.quantity}</Text>
                    <Text style={styles.priceData}>
                      {!!itemService.price
                        ?   getRoundOf(
                              itemService.price *
                                parseInt(itemService.quantity),
                            )
                        : ''}
                    </Text>
                  </View>
                );
              })}

            <View style={styles.borderView} />
            <View style={[styles.headerStyle, {marginTop: 10, width: '100%'}]}>
              <Text style={styles.descSubTotal}>
                {config.I18N.t('SubTotal')}
              </Text>
              <Text style={styles.qtySubTotal}></Text>
              <Text style={styles.priceSubTotal}>
                {' '}
                { getRoundOf(this.getSubTotal('1'))
                }
              </Text>
            </View>
            {!!this.state.couponCode && !!this.state.couponPercentage && (
              <View
                style={[styles.headerStyle, {marginTop: 10, width: '100%'}]}>
                <Text style={styles.descData}>
                  {config.I18N.t('promoCode')} {this.state.couponCode} (
                  {this.state.couponPercentage}%)
                </Text>
                <Text style={[styles.qtyData, {width: 0}]}></Text>
                <Text style={styles.priceData}>
                  {' '}
                  {getRoundOf(this.getSubTotal('6'))}
                </Text>
              </View>
            )}

             <View style={[styles.headerStyle, {marginTop: 10, width: '100%'}]}>
              <Text style={styles.descData}>
                {config.I18N.t('fees')} ({parseFloat(this.state.fees)}
                %)
              </Text>
              <Text style={styles.qtyData}></Text>
              <Text style={styles.priceData}>
                {' '}
                {getRoundOf(this.getSubTotal('8'))}
              </Text>
            </View> 

            <View style={[styles.headerStyle, {marginTop: 10, width: '100%'}]}>
              <Text style={styles.descData}>
                {config.I18N.t('tax')} ({parseFloat(this.state.tax)}
                %)
              </Text>
              <Text style={styles.qtyData}></Text>
              <Text style={styles.priceData}>
                {' '}
                {getRoundOf(this.getSubTotal('7'))}
              </Text>
            </View>
            
            {config.Constant.USER_DATA.wallet_total < 0  && <View style={[styles.headerStyle, {marginTop: 10, width: '100%'}]}>
              <Text style={styles.descData}>
                {config.I18N.t('DueAmount')}
              </Text>
              <Text style={styles.qtyData}></Text>
              <Text style={styles.priceData}>
                {' '}
                {Math.abs(`${config.Constant.USER_DATA.wallet_total}`)}
              </Text>
            </View>}

            <View style={styles.borderView} />
            <View style={[styles.headerStyle, {marginTop: 10, width: '100%'}]}>
              <Text
                style={[styles.descTitle, {color: config.Constant.COLOR_TAB}]}>
                {config.I18N.t('Total')}
              </Text>
              <Text
                style={[
                  styles.qtyTitle,
                  {color: config.Constant.COLOR_TAB},
                ]}></Text>
              <Text
                style={[styles.priceTitle, {color: config.Constant.COLOR_TAB}]}>
                {`${config.Constant.USER_DATA.wallet_total < 0 ? this.getTotal() : getRoundOf(this.getSubTotal('3'))}`}
              </Text>
            </View>
          </View>
          {isAllowOrder ? <CustomButton
            btnTxt={config.I18N.t('confirm')}
            onPress={() => {
              //this.props.navigation.navigate('OrderDetails');
              // console.log('this.props.route.params?.from_search - ', this.props.route.params?.from_search )

              this.requestOrder();
            }}
            containerStyle={styles.btnStyle}
          /> :<>
          <Text style={styles.errorText}>{config.I18N.t('subtotalNeedToMoreThenMinimumCashAmount')}</Text>
          <CustomButton
            btnTxt={config.I18N.t('AddService')}
            onPress={() => {
              this.hardwareBackPress();
            }}
            containerStyle={styles.btnStyle}
          /></>
          }
        </ScrollView>
      </View>
    );
  }
}
