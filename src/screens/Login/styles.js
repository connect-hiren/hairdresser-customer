import {StyleSheet} from 'react-native';
import config from '../../config';
import {getStatusBarHeight} from '../../Util/Utilities';

export default styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    bannerImg: {
      width: config.Constant.SCREEN_WIDTH,
      height: config.Constant.SCREEN_HEIGHT / 2,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: -1,
    },
    bottomView: {
      width: config.Constant.SCREEN_WIDTH,
      backgroundColor: 'white',
      borderTopRightRadius: 35,
      borderTopLeftRadius: 35,
      marginTop: 10,
      alignItems: 'center',
    },
    bottomScrollView: {
      width: config.Constant.SCREEN_WIDTH,
      backgroundColor: config.Constant.COLOR_TRANSPARENT,
      //paddingTop:config.Constant.SCREEN_HEIGHT / 1.8
    },
    titleTxt: {
      textAlign: 'center',
      fontSize: 24,
      fontFamily: config.Constant.Font_Bold,
      marginTop: 20,
      marginBottom: 5,
      color: config.Constant.COLOR_BLACK,
    },
    titleDesTxt: {
      textAlign: 'center',
      fontSize: 14,
      fontFamily: config.Constant.Font_Regular,
      marginBottom: 20,
      color: config.Constant.COLOR_LIGHT_GREY,
    },
    forgotTxt: {
      textAlign: 'center',
      fontSize: 14,
      fontFamily: config.Constant.Font_Regular,
      marginBottom: 20,
      color: config.Constant.COLOR_BLACK,
    },
    dontTxt: {
      textAlign: 'center',
      fontSize: 14,
      marginBottom: 20,
      fontFamily: config.Constant.Font_Regular,
      color: config.Constant.COLOR_LIGHT_GREY,
    },
    signUpTxt: {
      textAlign: 'center',
      fontSize: 14,
      fontFamily: config.Constant.Font_Regular,
      color: config.Constant.COLOR_BTN,
    },
    inputStyle: {width: '85%', marginVertical: 5},
    btnStyle: {width: '85%', marginTop: 20, marginBottom: 15},
  });
  