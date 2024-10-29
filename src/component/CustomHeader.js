import React from 'react';
import {StyleSheet, TouchableOpacity, Image, Text, View} from 'react-native';
import Ripple from 'react-native-material-ripple';
import config from '../config';
import {getStatusBarHeight} from '../Util/Utilities';

export default class CustomHeader extends React.Component {
  render() {
    const {containerStyle, btnTxt, onBackPress, txtStyle} = this.props;
    return (
      <View style={styles.rowContainer}>
        {!!onBackPress ? (
          <Ripple onPress={onBackPress}>
            <Image
              source={require('../assets/images/backICon.png')}
              style={styles.smallIcon}
              resizeMode={'contain'}
            />
          </Ripple>
        ) : (
          <View>
            <Image
              //source={require('../assets/images/backICon.png')}
              style={styles.smallIcon}
              resizeMode={'contain'}
            />
          </View>
        )}
        <Text style={styles.headerTitle}>{txtStyle}</Text>
        <Image style={styles.smallIcon} resizeMode={'contain'} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',

    backgroundColor: config.Constant.COLOR_WHITE,
  },
  rowContainer: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: getStatusBarHeight()+5,
    paddingBottom: 10,
    paddingHorizontal: config.Constant.SCREEN_WIDTH * 0.05,
    backgroundColor: 'white',
    shadowColor: config.Constant.COLOR_GREY,
    shadowOffset: {
      width: 0.5,
      height: 0.5,
    },
    shadowRadius: 0.5,
    shadowOpacity: 0.4,
    elevation: 2,
    marginBottom: 5,
  },
  smallIcon: {
    width: 20,
    height: 20,
    transform: [{rotate:config.Constant.isRTL?'180deg':'0deg'}]
  },
  headerTitle: {
    fontFamily: config.Constant.Font_Bold,
    fontSize: 18,
    color: config.Constant.COLOR_BLACK,
    textAlign: 'center',
    letterSpacing: 1.26,
    alignSelf: 'center',
  },
  notificationView: {
    width: config.Constant.SCREEN_WIDTH * 0.95,
    alignSelf: 'center',
    paddingHorizontal: config.Constant.SCREEN_WIDTH * 0.025,
    marginVertical: 5,
    paddingVertical: 10,
    backgroundColor: config.Constant.COLOR_LIGHT_BACKGROUND,
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  rowViewBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  rowTitle: {
    fontFamily: config.Constant.Font_Bold,
    fontSize: 16,
    color: config.Constant.COLOR_BLACK,
    letterSpacing: 0.98,
    flex: 1,
    textAlign: 'left',
  },
  rowDesc: {
    fontFamily: config.Constant.Font_Regular,
    fontSize: 16,
    color: config.Constant.COLOR_DARK_GREY,
    letterSpacing: 0,
    flex: 1,
    textAlign: 'left',
    paddingRight: 10,
  },
  rowTime: {
    fontFamily: config.Constant.Font_Roboto_Italic,
    fontSize: 14.5,
    color: config.Constant.COLOR_GREY,
    letterSpacing: 0,
  },
});
