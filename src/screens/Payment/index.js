//Global imports
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ScrollView,
  ImageBackground,
  TextInput,
  Pressable,
  I18nManager,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import CustomButton from '../../component/CustomButton';

import {
  MFPaymentRequest,
  MFCustomerAddress,
  MFExecutePaymentRequest,
  Response,
  MFLanguage,
  MFSettings,
  MFTheme,
  MFProduct,
  MFMobileCountryCodeISO,
  MFCurrencyISO,
  MFPaymentMethodCode,
  MFPaymentype,
  MFKeyType,
  MFInitiatePayment,
  MFEnvironment,
  MFCountry,
  MFInAppApplePayView,
  MFInitiateSessionRequest,
} from 'myfatoorah-reactnative';

//File imports
import Styles from './Styles';

//Component imports
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';
import CustomHeader from '../../component/CustomHeader';

const {
  container,
  devider,
  couponSection,
  coupontitle,
  rowContainer,
  discountIcon,
  applyText,
  couponInputSection,
  inputStyle,
  applyBtnContainer,
  applyTextStyle,
  subTotalText,
  totalPrice,
  totalPriceText,
  circleSection,
  innerSection,
  applyStyle,
  paymentText,
  emptySection,
  emptyAddressText,
  addButton,
  addText,
  mobileHeading,
  rowFlex,
  countryText,
  downArrow,
  drowDownContainer,
  dropDownItem,
  countryItem,
  countryItemName,
  errorText,
  callingView,
  callingCode,
  mobileInput,
  emptyText,
} = Styles;

const PaymentScreen = (props) => {
  const {
    navigation: {toggleDrawer, navigate, goBack},
    route: {params},
  } = props;

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [goToPayment, setGoToPayment] = useState(true);

  const [paymentMethodList, setPaymentMethodList] = useState(
    params?.data?.paymentMethodList || [],
  );

  useEffect(() => {
    if (isFocused && goToPayment) {
      let theme = new MFTheme('blue', 'gray', 'Payment', 'Cancel');
      MFSettings.sharedInstance.setTheme(theme);
      console.log(
        MFSettings.sharedInstance.getInvironment(MFEnvironment.LIVE),
        'PPP',
      );
      MFSettings.sharedInstance.configure(
        'jSD2cFUwBFAyzlp5xWSaxUEUqc3IAUTSTOp_6fzVcopkf4s1mrzM6FjyQ5BtnOP2RhdZqwJUiBg-DZAAjb_RlcJWvC9i0nLBlGOxeR4x7e8wAV1Fd7sfO0Ho9cUn5p__vUoZm4YgLXPeCTwY_CZpapeMqxbjymSN0NTBYG1O9inRd8D47CBoaHLi_jdF5fiOISB5tbw1-QhhxF15B1EdZ8NOd80pxYJzKjeO5_SyBr09c6gNwif6pohRfPOzMTW422Sfz147WMPmDv3e51Bi4WyTTjl4srY7yLiOByA-JDB9GGpSwGUM_PS0G7Of2zZdCuYkk5_NsFZTJwEvJqlFsSZuT1wTYwHYTv1Zst47w8zIRGy6ezVAKYSX7-_6FZG3EL6hZVOWdkWjruBoTEZ-1_5tBKeT_4ADUBDi2YSxt9XJu4x0_rFQ9GgU958m8RkMpIKCcZY42ofBUnwPoeJ07iGbtZQxmtczNxUciDbW0wfU3rvSHrQ9XnZ4VUtN5BnSSCEAcIyXaGyL0FTlesZn98f51l0AeIVay6quDGg9D9NOxsWR6gJY3OfJzxgkt1LVfXAaUEYgZauZrFZDHVAqyzMVNlmFhp798F4p3FvFw7Wdyd2s56oKHZTPwOGl9ALQxbV-3LyKgdnhCmhXbyC_Q2-rGjOqRRYOlnYb5oGntwnJJp3ljCAB0Pzw19rbfa8unmx7LQ',
        // 'rLtt6JWvbUHDDhsZnfpAhpYk4dxYDQkbcPTyGaKp2TYqQgG7FGZ5Th_WD53Oq8Ebz6A53njUoo1w3pjU1D4vs_ZMqFiz_j0urb_BH9Oq9VZoKFoJEDAbRZepGcQanImyYrry7Kt6MnMdgfG5jn4HngWoRdKduNNyP4kzcp3mRv7x00ahkm9LAK7ZRieg7k1PDAnBIOG3EyVSJ5kK4WLMvYr7sCwHbHcu4A5WwelxYK0GMJy37bNAarSJDFQsJ2ZvJjvMDmfWwDVFEVe_5tOomfVNt6bOg9mexbGjMrnHBnKnZR1vQbBtQieDlQepzTZMuQrSuKn-t5XZM7V6fCW7oP-uXGX-sMOajeX65JOf6XVpk29DP6ro8WTAflCDANC193yof8-f5_EYY-3hXhJj7RBXmizDpneEQDSaSz5sFk0sV5qPcARJ9zGG73vuGFyenjPPmtDtXtpx35A-BVcOSBYVIWe9kndG3nclfefjKEuZ3m4jL9Gg1h2JBvmXSMYiZtp9MR5I6pvbvylU_PP5xJFSjVTIz7IQSjcVGO41npnwIxRXNRxFOdIUHn0tjQ-7LwvEcTXyPsHXcMD8WtgBh-wxR8aKX7WPSsT1O8d8reb2aR7K3rkV3K82K_0OgawImEpwSvp9MNKynEAJQS6ZHe_J_l77652xwPNxMRTMASk1ZsJL',
        MFCountry.SAUDIARABIA,
        MFEnvironment.LIVE,
      );
      // _getCart();
      setSelectedShippingID('3');
    }
    initiatePayments(300);
  }, [isFocused]);

  const [appleSessionID, setAppleSessionID] = useState('');

  function initiatePayments(amount) {
    let initiateRequest = new MFInitiatePayment(
      parseFloat(amount),
      MFCurrencyISO.KUWAIT_KWD,
    );
    MFPaymentRequest.sharedInstance.initiatePayment(
      initiateRequest,
      MFLanguage.ENGLISH,
      (response) => {
        if (response.getError()) {
          alert('error: ' + response.getError().error);
        } else {
          const newArray = response.getPaymentMethods().map((item, i) => {
            return {...item, isActive: false};
          });
          console.log(newArray, 'method');

          setPaymentMethodList(newArray);
        }
      },
    );
  }

  const [selectedShippingID, setSelectedShippingID] = useState(
    params?.data?.selectedShippingID || '3',
  );

  const [badShipping, setBadShipping] = useState(false);
  const [badAddress, setBadAddress] = useState(false);
  const [activePayment, setActivePayment] = useState('1');

  const [AddAddressShow, setAddAddressShow] = useState(false);

  const executeResquestJson = (paymentMethodID) => {
    // const app = MFInitiatePayment(150, MFCurrencyISO.SAUDIARABIA_SAR)
    // console.log(app, "app")
    // let total = JSON.stringify(data?.amount);
    let total = data?.amount

    let request = new MFExecutePaymentRequest(
      parseFloat(total),
      // parseFloat(cartData.total),
      paymentMethodID,
    );

    request.invoiceValue = parseFloat(total); // must be email
    request.customerEmail = data?.email;
    // user_info.email ? user_info.email : data.email; // must be email
    request.customerMobile = parseInt(
      data.mobile1,
      // user_info.mobile ? user_info.mobile : data.mobile1,
    );
    request.customerCivilId = '';

    let address = new MFCustomerAddress(
      data?.name,
      data?.address,
      data?.region,
      data?.city,
      data?.country,
    );
    // !user_info.id?new MFCustomerAddress(data?.name,data?.address, data?.region, data?.city, data?.country):
    // new MFCustomerAddress(address1, city_name, region, country_name, country_name);
    request.customerAddress = address;
    request.customerName = data?.name;
    // user_info.name ? user_info.name : data.name;
    request.customerReference = data?.name;
    // user_info.name ? user_info.name : data.name;
    request.language = I18nManager.isRTL ? 'ar' : 'en';
    (request.sessionId = appleSessionID),
      (request.mobileCountryCode = MFMobileCountryCodeISO.SAUDIARABIA);
    request.displayCurrencyIso = MFCurrencyISO.SAUDIARABIA_SAR;

    var productList = [];
    // cartData?.items?.map((item, idx) => {
    //   let product = {
    //     name: item?.product_name,
    //     quantity: item?.quantity,
    //     unitPrice: item?.price,
    //   };
    //   productList.push(product);
    // });
    // let product = {
    //       name: "Cream",
    //       quantity: 1,
    //       unitPrice: 272,
    //     };
    // productList.push(product);
    // let shippingObj = {
    //   name: 'Shipping',
    //   quantity: 1,
    //   unitPrice: 28,
    // };

    // if (cartData?.discount > 0) {
    //   let couponObj = {
    //     name: 'coupon',
    //     quantity: 1,
    //     unitPrice: -cartData?.discount,
    //   };
    //   productList.push(couponObj);
    // }
    // productList.push(shippingObj);
    // request.invoiceItems = productList;
    console.log({paymentModel: request});
    return request;
  };

  const executePayment = (selectedPaymentMethodId) => {
    let request = executeResquestJson(selectedPaymentMethodId);

    MFPaymentRequest.sharedInstance.executePayment(
      props.navigation,
      request,
      I18nManager.isRTL ? MFLanguage.ARABIC : MFLanguage.ENGLISH,
      (response) => {
        debugger
        if (response.getError()) {
          console.log(response, 'Cart.paymentFailed');
        } else {
          var bodyString = response.getBodyString();

          let newObj = JSON.parse(bodyString);
          let data = JSON.parse(bodyString).Data;
          let modifiedObje = {status: 'success', data: data};

          modules.DropDownAlert.showAlert(
            'success',
            config.I18N.t('success'),
            config.I18N.t('paymentSuccess'),
          );
          modules.RequestPopup2.isVisible() && modules.RequestPopup2.hideRef();
          props.route.params.callBack(modifiedObje);
        }
      },
    );
  };

  const [data, setData] = useState({
    name:
      params?.request?.first_name.substring(
        0,
        params?.request?.first_name.indexOf(' '),
      ) || 'chandan',
    email: params?.request?.customerEmail || 'cs@yopmail.com',
    region: params?.request?.state || 'SA',
    address: params?.request?.address.substring(0, 49) || 'SAUdi',
    zipCode: params?.request?.zip || '643423',
    country: params?.request?.country || 'Saudi',
    mainAddress: params?.request?.address.substring(0, 49) || 'Saudi',
    city: params?.request?.city || 'Riyadh',
    mobile1: params?.request?.phone_number || '556357253',
    callingCode1: params?.request?.callingCode1 || '966',
    amount: params?.request?.amount || '0',
  });

  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState('');

  const selectPayment = (paymentMethodId) => {
    const newArray = paymentMethodList.map((item, i) => {
      if (item.PaymentMethodId == paymentMethodId) {
        if (Platform.OS === 'android') {
          item.isActive = true;
          setSelectedPaymentMethodId(item.PaymentMethodId);
        } else if (Platform.OS === 'ios') {
          if (item.PaymentMethodCode === 'ap') {
            if (parseInt(Platform.Version, 10) >= 16) {
              item.isActive = true;
              setSelectedPaymentMethodId(item.PaymentMethodId);
            } else {
              modules.DropDownAlert.showAlert(
                'error',
                config.I18N.t('OsValid'),
                data.message,
              );
              // showMessage({
              //   message: Translator('Cart.OsValid'),
              //   type: 'danger',
              // });
            }
          } else {
            item.isActive = true;
            setSelectedPaymentMethodId(item.PaymentMethodId);
          }
        }

        return item;
      } else {
        item.isActive = false;
        return item;
      }
    });
    setPaymentMethodList(newArray);
  };

  const validate = () => {
    let valid = true;
    if (activePayment == 1 && selectedPaymentMethodId === '') {
      valid = false;
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('selectPaymentMethod'),
        config.I18N.t('selectPaymentMethod'),
      );
      // alert(config.I18N.t('selectPaymentMethod'));
    }

    return valid;
  };

  const hardwareBackPress = () => {
    props.navigation.pop();
    return true;
  };

  return (
    <SafeAreaView style={[container]}>
      <CustomHeader
        onBackPress={() => {
          hardwareBackPress();
        }}
        txtStyle={config.I18N.t('PaymentAlertHeader')}
      />
      <ScrollView style={{flex: 1}}>
        {activePayment != 0 && paymentMethodList.length > 0 ? (
          <View>
            <View style={[couponSection]}>
              <Text
                style={[
                  totalPrice,
                  {
                    fontSize: 18,
                  },
                ]}>
                {config.I18N.t('PaymentMethods')}
              </Text>
              <Text style={[subTotalText, {fontSize: 13, marginTop: 5}]}>
                {config.I18N.t('ClickMethod')}
              </Text>
            </View>

            <View style={[couponSection]}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={paymentMethodList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => {
                  return item.PaymentMethodCode === 'ap' &&
                    Platform.OS === 'android' ? null : (
                    <Pressable
                      key={`item=${item.PaymentMethodId}`}
                      onPress={() => selectPayment(item.PaymentMethodId)}
                      style={[rowContainer, {marginBottom: 15}]}>
                      <View
                        style={[
                          circleSection,
                          {
                            borderColor: item.isActive
                              ? config.Constant.COLOR_PRIMARY
                              : config.Constant.COLOR_BLACK,
                          },
                        ]}>
                        {item.isActive ? <View style={innerSection} /> : null}
                      </View>
                      <View style={[rowContainer, {marginLeft: 20}]}>
                        <ImageBackground
                          source={{uri: item.ImageUrl}}
                          resizeMode="contain"
                          style={{height: 30, width: 30}}
                        />
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={[
                            paymentText,
                            {
                              color: item.isActive
                                ? config.Constant.COLOR_PRIMARY
                                : config.Constant.COLOR_BLACK,
                              paddingRight: 20,
                            },
                          ]}>
                          {item.PaymentMethodEn}
                        </Text>
                      </View>
                    </Pressable>
                  );
                }}
              />
            </View>
          </View>
        ) : null}

        <CustomButton
          btnTxt={config.I18N.t('MAKEPAYMENT')}
          onPress={() => {
            if (validate()) {
              if (activePayment === '1') {
                setGoToPayment(false);
                executePayment(selectedPaymentMethodId);
              } else {
                _checkOut();
              }
            }
          }}
          containerStyle={applyStyle}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentScreen;
