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
import modules from '../../modules';
import styles from './styles';

export default class CreatePass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageUdate: true,
      rePass: '',
      pass: '',
    };
  }
  componentDidMount = () => {};
  updatePass = async () => {
    config.Constant.showLoader.showLoader();
    const formData = new FormData();
    formData.append('email', this.props.route.params.email);
    formData.append('new_password', this.state.pass);
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.FORGOT_PASS,
      formData,
    );
    config.Constant.showLoader.hideLoader();
    console.log(data,"datadatadatadata");
    if (data?.status_code == 200) {
      modules.DropDownAlert.showAlert(
        'success',
        config.I18N.t('success'),
        data.message,
      );
      this.props.navigation.reset({
        index: 1,
        routes: [{name: 'Login'}],
      });
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
            <Text style={styles.titleTxt}>
              {config.I18N.t('createNewPass')}
            </Text>
            <Text style={styles.titleDesTxt}>
              {config.I18N.t('enterNewPass')}
            </Text>
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
              placeholder={config.I18N.t('newPass')}
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
              placeholder={config.I18N.t('confirmPass')}
              returnKeyType={'next'}
              onSubmitEditing={() => {}}
              blurOnSubmit={true}
            />
            <CustomButton
              btnTxt={config.I18N.t('create')}
              onPress={() => {
                if (!this.state.pass) {
                  this.setState({
                    passError: config.I18N.t('enterValidPass'),
                  });
                } else if (this.state.pass.length < 8) {
                  this.setState({
                    passError: config.I18N.t('enterValidPassLong'),
                  });
                } else if (
                  !this.state.rePass ||
                  this.state.pass != this.state.rePass
                ) {
                  this.setState({
                    rePassError: config.I18N.t('enterValidRePass'),
                  });
                } else {
                  //this.props.navigation.navigate('DashboardTab');
                  this.updatePass();
                }
              }}
              containerStyle={styles.btnStyle}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
