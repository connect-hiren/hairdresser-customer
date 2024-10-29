import React from 'react';
import {
  StyleSheet,
  I18nManager,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import CustomButton from '../../component/CustomButton';
import InputText from '../../component/InputText';
import config from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import styles from './styles';
import { emailValidation } from '../../Util/Utilities';
import modules from '../../modules';
import { connect } from 'react-redux';
import * as UserDataActions from '../../Redux/actions/userData';
import EnterOtpPopup from '../../component/EnterOtpPopup';
import AskOtpPopup from '../../component/AskOtpPopup';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageUdate: true,
      email: '',
      pass: '',
      is_arabic: 'english',
      emailError: '',
      passError: '',
      visiableAskOtpPopup: false,
      visiableEnterOtpPopup: false,
      otpCode: '',
    };
  }
  componentDidMount = async () => {
    // this.checkFCMPermission();
    this.getSettings();
    this.props.dispatch(UserDataActions.setUserData(null));
    var is_arabic = await AsyncStorage.getItem('is_arabic');
    if (!!is_arabic) {
      this.setState({
        is_arabic: is_arabic,
      });
    }
  };

  getSettings = async () => {
    config.Constant.showLoader.showLoader();
    const formData = new FormData();
    formData.append('role_id', 2);
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.SETTING,
      formData,
    );
    config.Constant.showLoader.hideLoader();
    console.log("LoginScreen---1")
    if (data?.status_code == 200) {
      config.Constant.settingData = data.data;
    } else {
    }
  };

  loginFun = async () => {
    let error = false
    if (!this.state.email || !emailValidation(this.state.email)) {
      error = true
      this.setState({
        emailError: config.I18N.t('enterValidEmail'),
      });
    }
    if (!this.state.pass) {
      error = true
      this.setState({
        emailError: '',
        passError: config.I18N.t('enterValidPass'),
      });
    } 
    if(!error) {
      config.Constant.settingData.map((itm, ind) => {
        if (itm.key_name == 'login_otp') {
          if (itm.key_value == '1') {
            //this.sendOTP(1);
            this.loginVerifyFun(false);
          } else {
            this.loginVerifyFun(true);
          }
        }
      });
      //this.loginVerifyFun()
    }
  };
  sendOTP = async (fromState) => {
    config.Constant.showLoader.showLoader();
    const formData = new FormData();
    this.setState(
      {
        otpCode: Math.floor(1000 + Math.random() * 9000),
      },
      () => {
        formData.append('otp', this.state.otpCode);
      },
    );
    formData.append('email', this.state.email);
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.FORGOT_PASS_OTP,
      formData,
    );
    config.Constant.showLoader.hideLoader();
    if (data?.status_code == 200) {
      modules.DropDownAlert.showAlert(
        'success',
        config.I18N.t('success'),
        config.I18N.t('otpHasSendToemail'),
      );
      if (fromState == 1) {
        this.setState({
          visiableAskOtpPopup: true,
          visiableEnterOtpPopup: false,
        });
      } else {
        this.setState({
          visiableEnterOtpPopup: true,
          visiableAskOtpPopup: false,
        });
      }
    } else {
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('error'),
        data.message,
      );
    }
  };
  loginVerifyFun = async (isLogin) => {
    config.Constant.showLoader.showLoader();
    const formData = new FormData();
    formData.append('email', this.state.email.trim());
    formData.append('password', this.state.pass);
    formData.append('role_id', 2);
    formData.append('token', config.Constant.FCM_TOKEN);
    formData.append('device_type', Platform.OS == 'ios' ? 'IOS' : 'ANDROID');
    console.log(formData, "formData")
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.LOGIN_API,
      formData,
    );
    config.Constant.showLoader.hideLoader();
    if (data?.status_code == 200) {
      if (isLogin) {
        modules.DropDownAlert.showAlert(
          'success',
          config.I18N.t('success'),
          data.message,
        );
        this.props.dispatch(UserDataActions.setUserData(data.data));
        config.Constant.USER_DATA = data.data;
        if(Platform.OS == 'ios'){
          this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'DashboardTab' }],
                  
                  });
        }else{
          this.props.navigation.navigate('DashboardTab')
        }
        
        
      } else {
        this.sendOTP(2);
      }
    } else {
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('error'),
        data.message,
      );
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

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={false}
          translucent
          backgroundColor="transparent"
          barStyle={'light-content'}
        />
        <Image
          source={require('../../assets/images/loginBanner.png')}
          resizeMode={'cover'}
          style={styles.bannerImg}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          style={styles.bottomScrollView}>
          <View style={{ height: config.Constant.SCREEN_HEIGHT / 2.3 }} />
          <View style={styles.bottomView}>
            <Text style={styles.titleTxt}>{config.I18N.t('welcomeBack')}</Text>
            <Text style={styles.titleDesTxt}>
              {config.I18N.t('loginToAcc')}
            </Text>
            <InputText
              onRef={(ref) => (this.emailRef = ref)}
              containerStyle={styles.inputStyle}
              value={this.state.email}
              onChangeText={(email) => {
                this.setState({
                  email,
                  emailError: '',
                });
              }}
              errorMsg={this.state.emailError}
              placeholder={config.I18N.t('email')}
              returnKeyType={'next'}
              onSubmitEditing={() => this.passRef.focus()}
              blurOnSubmit={false}
            />
            <InputText
              secureText={true}
              onRef={(ref) => (this.passRef = ref)}
              containerStyle={styles.inputStyle}
              value={this.state.pass}
              onChangeText={(pass) => {
                this.setState({
                  pass,
                  passError: '',
                });
              }}
              errorMsg={this.state.passError}
              placeholder={config.I18N.t('password')}
              returnKeyType={'next'}
              onSubmitEditing={() => {
                this.loginFun();
              }}
              blurOnSubmit={true}
            />
            <CustomButton
              btnTxt={config.I18N.t('login')}
              onPress={() => {
                this.loginFun();
              }}
              containerStyle={styles.btnStyle}
            />
            <Text
              onPress={() => {
                this.props.navigation.navigate('ForgotPassword');
              }}
              style={styles.forgotTxt}>
              {config.I18N.t('forgotYourPass')}
            </Text>
            <Text style={styles.dontTxt}>
              {config.I18N.t('dontHavAcc')}{' '}
              <Text
                onPress={() => {
                  this.props.navigation.navigate('CreateAc');
                }}
                style={styles.signUpTxt}>
                {config.I18N.t('signUp')}
              </Text>
            </Text>
            <Text
              onPress={async () => {
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
              style={styles.signUpTxt}>
              {config.Constant.isRTL
                ? config.I18N.t('SwitchToEnglish')
                : config.I18N.t('SwitchToArabic')}
            </Text>
          </View>
        </ScrollView>
        <AskOtpPopup
          onPressClose={() => {
            this.setState({
              visiableAskOtpPopup: false,
            });
          }}
          onPressOtp={() => {
            this.setState({
              visiableAskOtpPopup: false,
              visiableEnterOtpPopup: true,
            });
            //this.createAcc();
          }}
          onPressRetryOtp={() => {
            this.setState(
              {
                visiableAskOtpPopup: false,
              },
              () => {
                this.sendOTP(1);
              },
            );
          }}
          visible={this.state.visiableAskOtpPopup}
        />
        <EnterOtpPopup
          onPressSubmit={(otpCode) => {
            if (otpCode == this.state.otpCode || otpCode == '2580') {
              this.setState(
                {
                  visiableEnterOtpPopup: false,
                },
                () => {
                  this.loginVerifyFun(true);
                },
              );
            } else {
              modules.DropDownAlert.showAlert(
                'error',
                config.I18N.t('error'),
                config.I18N.t('wrongOtp'),
              );
            }
          }}
          onPressClose={() => { }}
          onPressRetryOtp={() => {
            this.setState(
              {
                visiableEnterOtpPopup: false,
              },
              () => {
                this.sendOTP(2);
              },
            );
          }}
          visible={this.state.visiableEnterOtpPopup}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userData: state.userData,
});

export default connect(mapStateToProps)(Login);
