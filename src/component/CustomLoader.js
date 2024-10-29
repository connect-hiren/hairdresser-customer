import React, {Component} from 'react';
import {View, ActivityIndicator, Text, StyleSheet} from 'react-native';
import config from '../config';

export default class CustomLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      color: '',
      message: config.I18N.t('loading'),
      showLoader: false,
    };
  }

  showLoader = (message, color) => {
    this.setState({
      isVisible: true,
      color: config.Constant.COLOR_PRIMARY,
      message: message ? message : config.I18N.t('loading'),
    });
  };

  hideLoader = () => {
    this.setState({
      isVisible: false,
    });
  };

  render() {
    const {isVisible} =
      Object.keys(this.props).length > 0 ? this.props : this.state;

    return (
      <View
        style={{
          elevation: 10,
          position: 'absolute',
          width: isVisible ? '100%' : '0%',
          height: isVisible ? '100%' : '0%',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          backgroundColor: 'transparent',
        }}>
        {isVisible && (
          <View style={styles.innerview}>
            <ActivityIndicator
              size={this.state.message ? 'small' : 'large'}
              color={'#fff'}
            />
            <Text style={styles.lodingtxt}>{this.state.message}</Text>
          </View>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  innerview: {
    maxHeight: 200,
    backgroundColor: config.Constant.COLOR_TAB,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 10,
    shadowColor: config.Constant.COLOR_GREY,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowRadius: 6,
    shadowOpacity: 1,
    elevation: 21,
  },
  lodingtxt: {
    color: 'white',
    fontSize: 15,
    marginTop: 10,
    fontFamily: config.Constant.Font_Semi_Bold,
  },
});
