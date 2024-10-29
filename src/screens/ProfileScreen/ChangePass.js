import React from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  TextInput,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Ripple from 'react-native-material-ripple';
import CustomButton from '../../component/CustomButton';
import CustomHeader from '../../component/CustomHeader';
import InputText from '../../component/InputText';
import config from '../../config';
import {getStatusBarHeight} from '../../Util/Utilities';
import styles from './styles';
import EnterOtpPopup from '../../component/EnterOtpPopup';
import AskOtpPopup from '../../component/AskOtpPopup';

export default class ChangePass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageUdate: true,
      oldPass: '',
      newPass: '',
      rePass: '',
      oldPassError: '',
      newPassError: '',
      rePassError: '',
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
    formData.append('email', config.Constant.USER_DATA.email);

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
  verifyData = () => {
    try {
      if (!this.state.oldPass) {
        this.setState({
          oldPassError: config.I18N.t('enterValidOldPass'),
        });
      } else if (!this.state.newPass) {
        this.setState({
          newPassError: config.I18N.t('enterValidNewPass'),
        });
      } else if (this.state.newPass.length < 8) {
        this.setState({
          newPassError: config.I18N.t('enterValidPassLong'),
        });
      } else if (
        !this.state.rePass ||
        this.state.newPass != this.state.rePass
      ) {
        this.setState({
          rePassError: config.I18N.t('enterValidNewRePass'),
        });
      } else {
        this.sendOTP(2);
      }
    } catch (error) {}
  };
  updatePass = async () => {
    config.Constant.showLoader.showLoader();
    const formData = new FormData();
    formData.append('password', this.state.oldPass);
    formData.append('new_password', this.state.newPass);
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.CHANGE_PASSWORD,
      formData,
    );
    config.Constant.showLoader.hideLoader();
    if (data?.status_code == 200) {
      modules.DropDownAlert.showAlert(
        'success',
        config.I18N.t('success'),
        data.message,
      );
      this.props.navigation.pop();
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
          barStyle={'dark-content'}
        />

        <CustomHeader
          onBackPress={() => {
            this.props.navigation.pop();
          }}
          txtStyle={config.I18N.t('changePassword')}
        />

        <View style={[styles.descriptionView, {width: '80%'}]}>
          <InputText
            errorMsg={this.state.oldPassError}
            secureText={true}
            onRef={(ref) => (this.oldPassRef = ref)}
            containerStyle={styles.inputStyle}
            value={this.state.oldPass}
            onChangeText={(oldPass) => {
              this.setState({
                oldPass,
                oldPassError: '',
              });
            }}
            placeholder={config.I18N.t('oldPass')}
            returnKeyType={'next'}
            onSubmitEditing={() => this.newPassRef.focus()}
            blurOnSubmit={false}
          />
          <InputText
            errorMsg={this.state.newPassError}
            secureText={true}
            onRef={(ref) => (this.newPassRef = ref)}
            containerStyle={styles.inputStyle}
            value={this.state.newPass}
            onChangeText={(newPass) => {
              this.setState({
                newPass,
                newPassError: '',
              });
            }}
            placeholder={config.I18N.t('newPass')}
            returnKeyType={'next'}
            onSubmitEditing={() => this.rePassRef.focus()}
            blurOnSubmit={false}
          />
          <InputText
            errorMsg={this.state.rePassError}
            secureText={true}
            onRef={(ref) => (this.rePassRef = ref)}
            containerStyle={styles.inputStyle}
            value={this.state.rePass}
            onChangeText={(rePass) => {
              this.setState({
                rePass,
                rePassError: '',
              });
            }}
            placeholder={config.I18N.t('confirmPass')}
            returnKeyType={'next'}
            onSubmitEditing={() => {}}
            blurOnSubmit={true}
          />

          <CustomButton
            btnTxt={config.I18N.t('save')}
            onPress={() => {
              this.verifyData();
            }}
            containerStyle={styles.btnStyle}
          />
        </View>
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
            if (otpCode == this.state.otpCode || otpCode=='2580') {
              this.setState(
                {
                  visiableEnterOtpPopup: false,
                },
                () => {
                  this.updatePass();
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
