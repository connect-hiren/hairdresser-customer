import React from 'react';
import {StyleSheet, TouchableOpacity, Image, Text, View} from 'react-native';
import Ripple from 'react-native-material-ripple';
import config from '../config';
import LinearGradient from 'react-native-linear-gradient';

export default class CustomButton extends React.Component {
  render() {
    const {containerStyle, btnTxt, onPress, txtStyle} = this.props;
    return (
      <Ripple style={[styles.container, {...containerStyle}]} onPress={onPress}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={[config.Constant.COLOR_BTN, config.Constant.COLOR_BTN_LIGHT]}
          style={{
            width: '100%',
            alignSelf: 'center',
            alignItems: 'center',
            paddingVertical: 8,
            borderRadius: 20,
          }}>
          <Text style={[styles.txtStyle, {...txtStyle}]}>{btnTxt}</Text>
        </LinearGradient>
      </Ripple>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: config.Constant.COLOR_BTN,
    borderRadius: 20,
    borderColor: config.Constant.COLOR_BTN,
    height:45,
    shadowColor: config.Constant.COLOR_TRANSPARENT,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowRadius: 6,
    shadowOpacity: 1,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
  },
  txtStyle: {
    fontFamily: config.Constant.Font_Regular,
    color: config.Constant.COLOR_WHITE,
    fontSize:18,
    letterSpacing:1.26,
    textAlign:'center'
  },
});
