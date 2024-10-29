import React from 'react';
import { StyleSheet, View, Image, Text, BackHandler, I18nManager } from 'react-native';
import config from '../config';
import persianJs from "persianjs";
import Dialog, { SlideAnimation, DialogContent } from 'react-native-popup-dialog';
import CustomButton from './CustomButton';
import CodeInput from 'react-native-code-input';
import Ripple from 'react-native-material-ripple';

export default class EnterOtpPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { currInd: 0, otpCode: '' };
    setTimeout(() => {
      BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
    }, 3000);
  }

  _handleBackPress = () => {
    if (!!this.props.visible) {
      this.props.onPressClose();
      return true;
    }
  };
  _onFinishCheckingCode = (otpCode) => {
    this.setState({
      otpCode,
    });
  };
  render() {
    const {
      visible,
      onPressClose,
      containerStyle,
      container1,
      onPressSubmit,
      onPressRetryOtp,
    } = this.props;
    return (
      <Dialog
        visible={visible}
        onTouchOutside={onPressClose}
        width={1}
        overlayOpacity={0.9}
        overlayBackgroundColor={'white'}
        dialogAnimation={
          new SlideAnimation({
            slideFrom: 'bottom',
          })
        }
        containerStyle={[{ justifyContent: 'center' }, { ...containerStyle }]}
        dialogStyle={styles.dialogStyle}>
        <DialogContent style={[styles.dialogContent, { ...container1 }]}>
          <View style={styles.dialogView}>
            <Image
              source={require('../assets/images/unlocked.png')}
              style={styles.logoIcon}
              resizeMode={'contain'}
            />
            <Text style={styles.titleTxt}>{config.I18N.t('enterOtp')}</Text>
            <Text style={styles.titleDesTxt}>
              {config.I18N.t('otpIsSendToemail')}
            </Text>
            <CodeInput
              ref="codeInputRef2"
              activeColor={config.Constant.COLOR_LIGHT_GREY}
              inactiveColor={config.Constant.COLOR_LIGHT_GREY}
              autoFocus={true}
              inputPosition="center"
              codeLength={4}
              borderType="circle"
              size={50}
              keyboardType="numeric"
              onFulfill={(code) => this._onFinishCheckingCode(code)}
              containerStyle={{ marginTop: 2, flexDirection: I18nManager.isRTL ? "row-reverse" : 'row' }}
              codeInputStyle={{
                borderWidth: 0,
                width: 55,
                height: 55,
                backgroundColor: config.Constant.COLOR_LIGHT_BG,
              }}
            />
            {<CustomButton
              btnTxt={config.I18N.t('submit')}
              onPress={
                !!this.state.otpCode && this.state.otpCode.length == 4
                  ? () => {
                    let arabic = /[\u0600-\u06FF]/;
                    if (arabic.test(this.state.otpCode)) {
                      let EnglishOTP = persianJs(this.state.otpCode).toEnglishNumber().toString();
                      onPressSubmit(EnglishOTP);
                    }
                    else {
                      onPressSubmit(this.state.otpCode);
                    }

                  }
                  : () => { }
              }
              containerStyle={styles.btnStyle}
            />}
            <Ripple onPress={onPressRetryOtp}>
              <Text style={styles.resend}>{config.I18N.t('resend')}</Text>
            </Ripple>
          </View>
        </DialogContent>
      </Dialog>
    );
  }
}

const styles = StyleSheet.create({
  dialogStyle: {
    backgroundColor: config.Constant.COLOR_TRANSPARENT,
    borderRadius: 0,
    maxHeight: config.Constant.SCREEN_HEIGHT * 0.8,
    paddingVertical: 10,
  },
  txtStyle: {
    fontFamily: config.Constant.Font_Regular,
    color: 'white',
  },
  dialogContent: {
    backgroundColor: config.Constant.COLOR_WHITE,
    paddingBottom: 40,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 30,
    paddingBottom: 10,
    shadowColor: config.Constant.COLOR_BLACK,
    shadowOffset: {
      width: 0.5,
      height: 0.5,
    },
    shadowRadius: 5,
    shadowOpacity: 0.3,
    elevation: 5,
  },
  dialogView: {
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  logoIcon: { width: 70, height: 70, marginTop: 15 },
  titleTxt: {
    textAlign: 'center',
    fontSize: 25,
    fontFamily: config.Constant.Font_Bold,
    marginBottom: 5,
    marginTop: 5,
    color: config.Constant.COLOR_BLACK,
  },
  titleDesTxt: {
    textAlign: 'center',
    fontSize: 15,
    fontFamily: config.Constant.Font_Regular,
    marginBottom: 20,
    color: config.Constant.COLOR_LIGHT_GREY,
  },
  btnStyle: { width: '100%', marginBottom: 15, marginTop: 90 },
  resend: {
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 15,
    fontFamily: config.Constant.Font_Regular,
    color: config.Constant.COLOR_LIGHT_GREY,
  },
});
