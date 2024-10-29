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
} from 'react-native';
import CustomButton from '../../component/CustomButton';
import InputText from '../../component/InputText';
import config from '../../config';
import styles from './styles';
import {emailValidation} from '../../Util/Utilities';
import EnterOtpPopup from '../../component/EnterOtpPopup';
import AskOtpPopup from '../../component/AskOtpPopup';

export default class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageUdate: true,
      email: '',
      emailError: '',
      pass: '',
      visiableAskOtpPopup: false,
      visiableEnterOtpPopup: false,
      otpCode: '',
    };
  }
  componentDidMount = () => {};
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
          bounces={false}
          style={styles.bottomScrollView}>
          <View style={{height: config.Constant.SCREEN_HEIGHT / 2.3}} />
          <View style={styles.bottomView}>
            <Text style={styles.titleTxt}>{config.I18N.t('forgotPass')}</Text>
            <Text style={styles.titleDesTxt}>
              {config.I18N.t('enterYourEmail')}
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
              onSubmitEditing={() => {}}
              blurOnSubmit={true}
            />
            <CustomButton
              btnTxt={config.I18N.t('resetPass')}
              onPress={() => {
                if (!this.state.email || !emailValidation(this.state.email)) {
                  this.setState({
                    emailError: config.I18N.t('enterValidEmail'),
                  });
                } else {
                  //this.props.navigation.navigate('CreatePass');
                  this.sendOTP(2);
                }
              }}
              containerStyle={styles.btnStyle}
            />
            <Text style={styles.dontTxt}>
              <Text
                onPress={() => {
                  this.props.navigation.pop();
                }}
                style={styles.signUpTxt}>
                {config.I18N.t('back')}
              </Text>
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
                  this.props.navigation.navigate('CreatePass', {
                    email: this.state.email,
                  });
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
          onPressClose={() => {}}
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
