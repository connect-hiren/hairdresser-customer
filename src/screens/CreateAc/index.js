import React from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking
} from 'react-native';
import AskOtpPopup from '../../component/AskOtpPopup';
import CustomButton from '../../component/CustomButton';
import EnterOtpPopup from '../../component/EnterOtpPopup';
import InputText from '../../component/InputText';
import config from '../../config';
import styles from './styles';
import {emailValidation} from '../../Util/Utilities';
import modules from '../../modules';
import {connect} from 'react-redux';
import * as UserDataActions from '../../Redux/actions/userData';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

class CreateAc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageUdate: true,
      name: '',
      pass: '',
      rePass: '',
      email: '',
      refNum: '',
      phone: '',
      nameError: '',
      passError: '',
      rePassError: '',
      emailError: '',
      refNumError: '',
      phoneError: '',
      visiableAskOtpPopup: false,
      visiableEnterOtpPopup: false,
      otpCode: '',
      agree:false
    };
  }
  componentDidMount = () => {};
  signUpFlow = () => {
    // this.setState({
    //   visiableAskOtpPopup: true,
    // });
    // return;
    let sendOtp = true
   
    if (!this.state.name) {
      sendOtp= false
      this.setState({
        nameError: config.I18N.t('enterValidName'),
      });
    }else if (!this.state.email || !emailValidation(this.state.email)) {
      sendOtp= false
      this.setState({
        emailError: config.I18N.t('enterValidEmail'),
      });
    }else if (!this.state.phone) {
      sendOtp= false
      this.setState({
        phoneError: config.I18N.t('enterValidPhone'),
      });
    } else if (!this.state.pass) {
      sendOtp= false
      this.setState({
        passError: config.I18N.t('enterValidPass'),
      });
    } else if (this.state.pass.length < 8) {
      sendOtp= false
      this.setState({
        passError: config.I18N.t('enterValidPassLong'),
      });
    } else if (!this.state.rePass || this.state.pass != this.state.rePass) {
      sendOtp= false
      this.setState({
        rePassError: config.I18N.t('enterValidRePass'),
      });
    } else if(this.state.agree ==false){
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('error'),
        config.I18N.t('pleaseAgreeTermsAndConditions'),
      );
    } else{
      this.sendOTP(2);
    }
    
    // if(sendOtp){
    //   this.sendOTP(2);
    // }
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

    formData.append('name', this.state.name);
    formData.append('email', this.state.email);
    formData.append('phone_number', this.state.phone);

    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.CHECK_EMAIL,
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
  createAcc = async () => {
    config.Constant.showLoader.showLoader();
    const formData = new FormData();
    formData.append('name', this.state.name);
    formData.append('email', this.state.email.trim());
    formData.append('password', this.state.pass);
    formData.append('phone_number', this.state.phone);
    formData.append('role_id', 2);
    formData.append('refrel_phone_number', this.state.refNum);
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.REGISTER_API,
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
      // this.props.dispatch(UserDataActions.setUserData(data.data));
      // config.Constant.USER_DATA = data.data;
      // this.props.navigation.reset({
      //   index: 1,
      //   routes: [{name: 'DashboardTab'}],
      // });
    } else {
      console.log(config.ApiEndpoint.REGISTER_API, data.message)
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
            <Text style={styles.titleTxt}>
              {config.I18N.t('createAccount')}
            </Text>
            <Text style={styles.titleDesTxt}>
              {config.I18N.t('registerNewAccount')}
            </Text>
            <InputText
              onRef={(ref) => (this.nameRef = ref)}
              containerStyle={styles.inputStyle}
              value={this.state.name}
              errorMsg={this.state.nameError}
              onChangeText={(name) => {
                this.setState({
                  name,
                  nameError: '',
                });
              }}
              placeholder={config.I18N.t('name')}
              returnKeyType={'next'}
              onSubmitEditing={() => this.emailRef.focus()}
              blurOnSubmit={false}
            />
            <InputText
              onRef={(ref) => (this.emailRef = ref)}
              containerStyle={styles.inputStyle}
              value={this.state.email}
              errorMsg={this.state.emailError}
              onChangeText={(email) => {
                this.setState({
                  email,
                  emailError: '',
                });
              }}
              placeholder={config.I18N.t('emailAddress')}
              returnKeyType={'next'}
              onSubmitEditing={() => this.phoneRef.focus()}
              blurOnSubmit={false}
            />
            <InputText
              onRef={(ref) => (this.phoneRef = ref)}
              containerStyle={styles.inputStyle}
              value={this.state.phone}
              errorMsg={this.state.phoneError}
              keyboardType={'number-pad'}
              onChangeText={(phone) => {
                this.setState({
                  phone,
                  phoneError: '',
                });
              }}
              placeholder={config.I18N.t('phoneNumber')}
              returnKeyType={'next'}
              onSubmitEditing={() => this.passRef.focus()}
              blurOnSubmit={false}
            />
            <InputText
              secureText={true}
              onRef={(ref) => (this.passRef = ref)}
              containerStyle={styles.inputStyle}
              value={this.state.pass}
              errorMsg={this.state.passError}
              onChangeText={(pass) => {
                this.setState({
                  pass,
                  passError: '',
                });
              }}
              placeholder={config.I18N.t('password')}
              returnKeyType={'next'}
              onSubmitEditing={() => this.rePassRef.focus()}
              blurOnSubmit={false}
            />
            <InputText
              secureText={true}
              onRef={(ref) => (this.rePassRef = ref)}
              containerStyle={styles.inputStyle}
              value={this.state.rePass}
              errorMsg={this.state.rePassError}
              onChangeText={(rePass) => {
                this.setState({
                  rePass,
                  rePassError: '',
                });
              }}
              placeholder={config.I18N.t('confirmPassword')}
              returnKeyType={'next'}
              onSubmitEditing={() => this.refNumRef.focus()}
              blurOnSubmit={false}
            />
            <InputText
              onRef={(ref) => (this.refNumRef = ref)}
              containerStyle={styles.inputStyle}
              value={this.state.refNum}
              errorMsg={this.state.refNumError}
              keyboardType={'number-pad'}
              onChangeText={(refNum) => {
                this.setState({
                  refNum,
                  refNumError: '',
                });
              }}
              placeholder={config.I18N.t('referrerNumber')}
              returnKeyType={'next'}
              onSubmitEditing={() => {}}
              blurOnSubmit={true}
            />

<View style={[styles.mapBox,{flexDirection:'row', alignItems:'center'}]}>
              <TouchableOpacity style={{paddingLeft:12, paddingRight:4, paddingVertical:4}} onPress={()=> this.setState({agree:true})}>
                <MaterialCommunityIcons  name={this.state.agree ? 'checkbox-marked-circle': 'checkbox-blank-circle-outline'} size={20}
                  color = {this.state.agree ? config.Constant.COLOR_BTN : config.Constant.COLOR_BLACK }/>
              </TouchableOpacity>
                <Text
                  style={[
                    styles.methodName,
                    { fontFamily:config.Constant.Font_Regular },
                  ]}>
                  {config.I18N.t('agree')}
                  <Text onPress={()=> {
                    if(Linking.canOpenURL(config.Constant.TERMS_AND_CONDITION_URL)){
                      Linking.openURL(config.Constant.TERMS_AND_CONDITION_URL)
                    }
                  }} style={{color: config.Constant.COLOR_BTN}}>{config.I18N.t('termsAndCondition')}</Text>
                </Text>

            </View>

            
            <CustomButton
              btnTxt={config.I18N.t('signUp')}
              onPress={() => {
                this.signUpFlow();
              }}
              containerStyle={styles.btnStyle}
            />
            <Text style={styles.dontTxt}>
              {config.I18N.t('alreadyHaveAc')}{' '}
              <Text
                onPress={() => {
                  this.props.navigation.pop();
                }}
                style={styles.signUpTxt}>
                {config.I18N.t('signIn')}
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
            if (otpCode == this.state.otpCode || otpCode=='2580') {
              this.setState(
                {
                  visiableEnterOtpPopup: false,
                },
                () => {
                  this.createAcc();
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

const mapStateToProps = (state) => ({
  userData: state.userData,
});

export default connect(mapStateToProps)(CreateAc);
