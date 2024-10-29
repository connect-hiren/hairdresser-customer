import React from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  Linking,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Ripple from 'react-native-material-ripple';
import CustomButton from '../../component/CustomButton';
import config from '../../config';
import {getStatusBarHeight} from '../../Util/Utilities';
import styles from './styles';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import CustomHeader from '../../component/CustomHeader';

export default class ContactUs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageUdate: true,
      email: '',
      phone: '',
    };
  }
  componentDidMount = () => {
    config.Constant.settingData.map((itm, ind) => {
      if (itm.key_name == 'support_email') {
        this.setState({
          email: itm.key_value,
        });
      }
      if (itm.key_name == 'support_phone') {
        this.setState({
          phone: itm.key_value,
        });
      }
    });
  };

  showMenu = () => {
    this._menu.show();
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
          txtStyle={config.I18N.t('support')}
        />
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={styles.profileBorder}>
            <FastImage
              style={styles.profileIcon}
              resizeMode={'contain'}
              source={require('../../assets/images/logo.png')}
            />
          </View>

            
          <View style={styles.rowView}>
          <Text style={styles.fontStyle}>{config.I18N.t('phone')}</Text>
              <Text
                onPress={() => {
                  !!this.state.phone &&
                    Linking.openURL(`tel:${this.state.phone}`);
                }}
                style={styles.fontStyle}>
                {`: ${this.state.phone}`}
              </Text>
              
            </View>

            <View style={styles.rowView}>
            <Text style={styles.fontStyle}>{config.I18N.t('email')}</Text>
            <Text
                onPress={() => {
                  !!this.state.email &&
                    Linking.openURL(`mailto:${this.state.email}`);
                }}
                style={styles.fontStyle}>
                {`: ${this.state.email}`}
              </Text>
              </View>


           {/* <View style={styles.rowView}>
            <View style={{width: '30%', alignItems:'flex-end'}}>
              <Text style={styles.fontStyle}>{config.I18N.t('phone')}</Text>
              </View>
            
            <View style={{
              flex:1,
              alignItems: 'flex-start'
            }}>
              <Text
                onPress={() => {
                  !!this.state.phone &&
                    Linking.openURL(`tel:${this.state.phone}`);
                }}
                style={styles.fontStyle}>
                {`: ${this.state.phone}`}
              </Text>
              
            </View>
          </View>  */}



        {/* <View style={styles.rowView}>
          <View style={{width: '30%', alignItems:'flex-end'}}>
          
              <Text style={styles.fontStyle}>{config.I18N.t('email')}</Text>
            </View>
           
            <View style={{
              flex:1,
              alignItems: 'flex-start'
            }}>
              <Text
                onPress={() => {
                  !!this.state.email &&
                    Linking.openURL(`mailto:${this.state.email}`);
                }}
                style={styles.fontStyle}>
                {`: ${this.state.email}`}
              </Text>
            </View>
          </View> */}

        </View>
        
        <Text style={[styles.fontBottomStyle, {marginBottom: 5}]}>
          Copyright. All rights are reserved
        </Text>
        <Text style={styles.fontBottomStyle}>
          App developed by Digital Creativity
        </Text>
      </View>
    );
  }
}
