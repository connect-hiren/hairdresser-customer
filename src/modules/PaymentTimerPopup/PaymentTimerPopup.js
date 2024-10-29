import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Image,
  BackHandler,
  I18nManager,
  Alert,
} from 'react-native';
import config from '../../config';
import CustomDialog from '../../component/CustomDialog';
import CustomButton from '../../component/CustomButton';
import moment from 'moment';
import CountDown from '../../component/CountDown';

export default class PaymentTimerPopup extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dialogData: {},
      dialogVisible: false,
      timeNow: '',
    };

    setTimeout(() => {
      BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
    }, 3000);
  }

  isVisible = () => this.state.dialogVisible;

  _handleBackPress = () => {
    return this.state.dialogVisible;
  };

  onShowAlert = (data) => {
    try {
      var timeN = moment().format();
      var timeL = moment
        .utc(
          data?.extraData?.isPaymentTimeout
            ? data.extraData.updated_at
            : data.extraData.request_date,
          'YYYY-MM-DD HH:mm:ss',
        )
        .add(300, 's')
        .local()
        .format();
      var timeNow = moment(timeL).diff(moment(timeN), 'second');
      console.log(timeNow);
      setTimeout(() => {
        if (!!timeNow && timeNow < 301 && timeNow > 0) {
          this.setState({
            visible: true,
            dialogData: data,
            dialogVisible: true,
            timeNow,
          });
        }
      }, 500);
    } catch (error) {}
  };
  onHidePop = () => {
    this.setState({dialogVisible: false});

    setTimeout(() => {
      this.setState({dialogData: {}});
    }, 500);
  };
  onTouchOutsidePerform = (pressOK) => {
    this.state.dialogData?.onPressPositiveBtn &&
      this.state.dialogData.onPressPositiveBtn(
        this.state.dialogData.extraData,
        pressOK,
      );

    this.setState({dialogVisible: false});

    setTimeout(() => {
      this.setState({dialogData: {}});
    }, 500);
  };
  onTouchOutside = (pressOK) => {
    if (pressOK) {
      this.onTouchOutsidePerform(pressOK);
    } else {
      Alert.alert('Alert', config.I18N.t('DoYouWantToCancelServiceRequest'), [
        {
          text: config.I18N.t('No'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: config.I18N.t('Yes'),
          onPress: () => {
            this.onTouchOutsidePerform(pressOK);
          },
        },
      ]);
    }
  };
  onTimeOutPopup = () => {
    // this.state.dialogData.onTimeOutPopup();
    this.setState({dialogVisible: false});
    setTimeout(() => {
      this.setState({dialogData: {}});
    }, 500);
    this.state.dialogData?.extraData?.onTimeOutPopup &&
      this.state.dialogData.extraData.onTimeOutPopup;
  };
  render() {
    const {dialogData, timeNow} = this.state;
    console.log('PaymentTimerPopup render', dialogData.extraData);
    if (Object.keys(dialogData).length === 0) {
      console.log('PaymentTimerPopup render return null');
      return null;
    }
    const isPaymentTimeout = dialogData?.extraData?.isPaymentTimeout;
    return (
      <CustomDialog
        onPressClose={() => {
          // this.setState({
          //   dialogVisible: false,
          // });
        }}
        visible={this.state.dialogVisible}>
        <View style={styles.dialogView}>
          {!isPaymentTimeout && (
            <Image
              source={require('../../assets/images/GreenTick.png')}
              style={styles.logoIcon}
              resizeMode={'contain'}
            />
          )}
          <Text style={styles.titleTxt}>
            {config.I18N.t(
              isPaymentTimeout ? 'PaymentAlertHeader' : 'requestSend',
            )}
          </Text>
          <Text style={styles.titleDesTxt}>{config.I18N.t('waitFor')}</Text>
          {/* <Text style={styles.timerDisplay}>05:00</Text> !!dialogData.extraData && !!dialogData.extraData.request_date && */}
          {!!timeNow && (
            <CountDown
              size={20}
              until={parseInt(timeNow)}
              onFinish={() => {
                this.onTimeOutPopup();
              }}
              digitStyle={{
                backgroundColor: 'transparent',
                borderWidth: 0,
                marginBottom: 20,
              }}
              digitTxtStyle={{
                color: config.Constant.COLOR_TAB,
                fontFamily: config.Constant.Font_Bold,
              }}
              timeLabelStyle={{
                fontSize: 24,
                //fontFamily: config.Constant.Font_Bold,
                color: config.Constant.COLOR_TAB,
              }}
              separatorStyle={{
                color: config.Constant.COLOR_TAB,
                marginBottom: 25,
              }}
              timeToShow={I18nManager.isRTL ? ['M', 'S'] : ['M', 'S']}
              timeLabels={{m: null, s: null}}
              showSeparator
            />
          )}
          {isPaymentTimeout ? (
            <View style={{alignItems: 'center'}}>
              <CustomButton
                btnTxt={config.I18N.t('PayToStartOrder')}
                onPress={() => {
                  this.onTouchOutside(true);
                }}
                containerStyle={styles.btnStyle}
              />
              <TouchableOpacity
                style={styles.btnStyle50}
                onPress={() => {
                  this.onTouchOutside(false);
                }}>
                <Text style={styles.resend}>{config.I18N.t('cancel')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <CustomButton
              btnTxt={config.I18N.t('cancel')}
              onPress={() => {
                this.onTouchOutside(true);
              }}
              containerStyle={styles.btnStyle}
            />
          )}
          {/* <CustomButton
            btnTxt={config.I18N.t(isPaymentTimeout ? 'PayToStartOrder' :'cancel')}
            onPress={() => {
              this.onTouchOutside(true);
            }}
            containerStyle={styles.btnStyle}
          /> */}
          {/* <Text style={styles.resend}>{config.I18N.t('tryAgain')}</Text> */}
        </View>
      </CustomDialog>
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
  logoIcon: {width: 50, height: 50, marginTop: 15},
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
    marginBottom: 5,
    color: config.Constant.COLOR_LIGHT_GREY,
  },
  timerDisplay: {
    textAlign: 'center',
    fontSize: 24,
    fontFamily: config.Constant.Font_Bold,
    marginBottom: 20,
    color: config.Constant.COLOR_TAB,
  },
  btnStyle: {width: '100%', marginBottom: 15},
  btnStyle50: {width: '60%'},
  resend: {
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 15,
    fontFamily: config.Constant.Font_Regular,
    color: config.Constant.COLOR_LIGHT_GREY,
  },
});
