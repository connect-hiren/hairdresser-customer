import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  BackHandler,
} from 'react-native';
import config from '../../config';
import CustomDialog from '../../component/CustomDialog';
import CustomButton from '../../component/CustomButton';

export default class ErrorAlert extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dialogData: {},
      dialogVisible: false,
    };

    setTimeout(() => {
      BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
    }, 3000);
  }

  setVisible=()=> this.state.dialogVisible;
  
  _handleBackPress = () => {
    if (!!this.state.dialogVisible) {
      this.setState({dialogVisible: false});

      setTimeout(() => {
        this.setState({dialogData: {}});
      }, 500);
      return true;
    }
  };

  onShowAlert = (data) => {
    this.setState({visible: true, dialogData: data, dialogVisible: true});
  };

  onTouchOutside = (pressOK) => {
    this.state.dialogData.onPressPositiveBtn(
      this.state.dialogData.extraData,
      pressOK,
    );

    this.setState({dialogVisible: false});

    setTimeout(() => {
      this.setState({dialogData: {}});
    }, 500);
  };

  render() {
    const {dialogData} = this.state;

    if (Object.keys(dialogData).length === 0) {
      return null;
    }

    return (
      <CustomDialog
        onPressClose={() => {
          this.setState({
            dialogVisible: false,
          });
        }}
        visible={this.state.dialogVisible}>
        <View style={styles.dialogView}>
          {/* <Image
            source={require('../assets/images/sendEmail.png')}
            style={styles.logoIcon}
            resizeMode={'contain'}
          /> */}
          <Text style={styles.titleTxt}>{dialogData.title}</Text>
          <Text style={styles.titleDesTxt}>{dialogData.message}</Text>
          <CustomButton
            btnTxt={
              !!dialogData.negativeBtnTxt
                ? dialogData.negativeBtnTxt
                : config.I18N.t('cancel')
            }
            onPress={() => {
              this.onTouchOutside(false);
            }}
            containerStyle={styles.btnStyle}
          />
          {/* <Text
            onPress={() => {
              this.onTouchOutside(false);
            }}
            style={styles.resend}>
            {config.I18N.t('cancel')}
          </Text> */}
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
  logoIcon: {width: 70, height: 70, marginTop: 15},
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
  btnStyle: {width: '100%', marginBottom: 15},
  resend: {
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 15,
    fontFamily: config.Constant.Font_Regular,
    color: config.Constant.COLOR_LIGHT_GREY,
  },
});
