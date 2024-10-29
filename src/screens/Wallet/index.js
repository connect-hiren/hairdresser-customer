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
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Ripple from 'react-native-material-ripple';
import StarRating from 'react-native-star-rating';
import CustomButton from '../../component/CustomButton';
import CustomHeader from '../../component/CustomHeader';
import config from '../../config';
import {getStatusBarHeight} from '../../Util/Utilities';
import styles from './styles';
import moment from 'moment';

export default class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageUdate: true,
      transaction: [],
      emptyList: '',
      is_load: false,
      amount:''
    };
  }
  componentDidMount = () => {
    this.props.navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
      this.GetUserData();
      this.GetWalletData();
    });
    this.props.navigation.addListener('blur', () => {
      BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
    });
  };

  doPayment=(amount)=>{
    let requestData = {
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
        amount: amount,
        action: 1,
        tokenOperation: 'A',
        cardToken: '',
        maskCardNum: '',
        tokenizationType: 0,
      };



    this.props.navigation.navigate('PaymentScreen', {
      request: requestData,
      callBack: this.onProcessPayment,
    });
  }
  onProcessPayment=async (responseData) => {
    console.log("responseData- ", responseData)
    // responseData.data.tranid
    if (responseData.status == 'success') {
      const formData = new FormData();
      formData.append('amount', this.state.amount );
      formData.append('receipt', responseData.data.tranid);
      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.ADD_MONEY,
        formData,
      );

      if (data?.status_code == 200) {
        this.GetUserData();
        this.GetWalletData();
      }
    }

  }

  hardwareBackPress = () => {
    this.props.navigation.pop();
    return true;
  };
  GetUserData = async () => {
    const formData = new FormData();
    formData.append('id', '1');
    //config.Constant.showLoader.showLoader();
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.GET_PROFILE,
      formData,
    );
    config.Constant.showLoader.hideLoader();
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
        this.setState({
          transaction: this.state.transaction,
        });
      } catch (error) {}
    }
  };
  GetWalletData = async () => {
    const formData = new FormData();
    formData.append('id', '1');

    if (!this.state.is_load) {
      config.Constant.showLoader.showLoader();
      setTimeout(() => {
        this.setState({
          emptyList: config.I18N.t('noWalletHistory'),
        });
      }, 10000);
    }
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.WALLET_DATA,
      formData,
    );
    config.Constant.showLoader.hideLoader();
    this.setState({
      emptyList: config.I18N.t('noWalletHistory'),
      is_load: true,
    });
    if (data?.status_code == 200) {
      this.setState({
        transaction: data.data,
      });
    }
  };
  renderItem = ({item, index}) => {
    const desc = config.I18N.locale == 'ar' && item?.arabic_description != null ? item?.arabic_description.split(',') : item.description.split(',')
    return (
      <View style={styles.notificationView}>
         <View style={styles.rowView}>
          { desc &&  desc.map((descItem)=>{
            return <Text style={styles.rowTitle}>{descItem.trim()}</Text>
          })}
          
          <Text style={styles.rowDesc}>
            {moment.utc(item.created_at).local().format('DD MMM, YY hh:mm a')}
          </Text>
        </View>
        <Text
          style={[
            styles.amoutStaus,
            {
              color:
                !!item.amount &&
                !!parseFloat(item.amount) &&
                parseFloat(item.amount) > 0
                  ? config.Constant.COLOR_LIGHT_GREEN
                  : '#FF0000',
            },
          ]}>
          {item.amount} SAR
        </Text>
      </View>
    );
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

        <CustomHeader
          onBackPress={() => {
            this.hardwareBackPress();
          }}
          txtStyle={config.I18N.t('wallet')}
        />
        <Text style={styles.moneyTxt}>
          {!!config.Constant.USER_DATA &&
          !!config.Constant.USER_DATA.wallet_total
            ? config.Constant.USER_DATA.wallet_total
            : 0}
        </Text>
        <Text style={styles.balanceTxt}>{config.I18N.t('BALANCE')}</Text>
        {!!config.Constant.USER_DATA &&
         (
          <CustomButton
            btnTxt={config.I18N.t('addAmount')}
            onPress={() => {
              console.log("Add Amount")
              modules.AddMoney.getRef({
                title: '',
                negativeBtnTxt: '',
                positiveBtnTxt: '',
                extraData: {
                  final_total:'',
                  sendOTP: '',
                },
                onPressPositiveBtn: async (data, pressOK, sarVal) => {
                  if (pressOK) {
                    this.setState({
                      amount:sarVal
                    },this.doPayment(sarVal))
                    
                  }
                },
              });
            }}
            containerStyle={styles.btnStyle}
          />
        )}
        <View style={styles.borderView} />
        <View
          style={{flex:1,width:'100%'}}>
          <View style={styles.headerStyle}>
            <Text style={styles.descTitle}>
              {config.I18N.t('recentTransactions')}
            </Text>
          </View>
          <View style={styles.headerBorderStyle} />
          {this.state.transaction.length > 0 ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              bounces={false}
              scrollEnabled={true}
              renderItem={this.renderItem}
              extraData={this.state}
              data={this.state.transaction}
            />
          ) : (
            <View
              style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
              <Text style={styles.emptyString}>{this.state.emptyList}</Text>
            </View>
          )}

          {/* <CustomButton
            btnTxt={config.I18N.t('confirm')}
            onPress={() => {
              //this.props.navigation.navigate('loadMore');
            }}
            containerStyle={styles.btnEmptyStyle}
          /> */}
          {/* <Ripple style={styles.btnEmptyStyle} onPress={() => {}}>
            <Text style={styles.txtStyle}>{config.I18N.t('loadMore')}</Text>
          </Ripple> */}
        </View>
      </View>
    );
  }
}
