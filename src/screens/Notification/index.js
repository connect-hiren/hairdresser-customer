import React from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  ScrollView,
  RefreshControl,
  FlatList,
  BackHandler,
  Pressable,
} from 'react-native';
import Ripple from 'react-native-material-ripple';
import CustomButton from '../../component/CustomButton';
import CustomHeader from '../../component/CustomHeader';
import config from '../../config';
import {getStatusBarHeight} from '../../Util/Utilities';
import styles from './styles';
import moment from 'moment';

export default class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageUdate: true,
      notificationData: [],
      emptyList: '',
      is_load: false,
      isFetching: false,
    };
  }
  componentDidMount = () => {
    this.props.navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
      this.getNotification();
    });
    this.props.navigation.addListener('blur', () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.hardwareBackPress,
      );
    });
  };
  onRefresh() {
    this.setState({isFetching: true}, () => {
      this.getNotification();
    });
  }

  hardwareBackPress = () => {
    this.props.navigation.navigate('scissor');
    return true;
  };
  renderItem = ({item, index}) => {
    return (
      <View style={styles.notificationView}>
        <View style={styles.rowView}>
          <Text style={styles.rowTitle}>Order code: {item.order_code}</Text>
          <Text style={styles.rowTime}>
            {moment.utc(item.created_at).local().format('hh:mm a')}
          </Text>
        </View>
        <View style={styles.rowViewBottom}>
          <Text style={styles.rowDesc}>{item.message}</Text>
          <Text style={[styles.rowTime, {marginTop: 1}]}>
            {moment.utc(item.created_at).local().format('DD MMM, YY')}
          </Text>
        </View>
      </View>
    );
  };
  getNotification = async () => {
    const formData = new FormData();
    formData.append('role_id', 2);
    if (!this.state.is_load) {
      config.Constant.showLoader.showLoader();
      setTimeout(() => {
        this.setState({
          emptyList: config.I18N.t('noNotification'),
        });
      }, 10000);
    }

    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.NOTIFICATION_LIST,
      formData,
    );
    this.setState({
      emptyList: config.I18N.t('noNotification'),
      is_load: true,
      isFetching: false,
    });
    config.Constant.showLoader.hideLoader();
    if (data?.status_code == 200) {
      this.setState({
        notificationData: data.data,
      });
    } else {
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('error'),
        data.message,
      );
    }
  };

  // clearnotifications

  clearnotifications=async()=>{
    const formData = new FormData();
    config.Constant.showLoader.showLoader()
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.CLEAR_NOTIFICATION_LIST,
      formData,
    );
    this.setState({
      emptyList: config.I18N.t('noNotification'),
      is_load: true,
      isFetching: false,
    });
    config.Constant.showLoader.hideLoader();
    if (data?.status_code == 200) {
      this.setState({
        notificationData: data.data,
      });
    } else {
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('error'),
        data.message,
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={false}
          translucent
          backgroundColor="transparent"
          barStyle={'dark-content'}
        />
        <CustomHeader txtStyle={config.I18N.t('notification')} />
        {this.state.notificationData.length > 0 ? (
          <View style={{flex:1}}>
          <Pressable onPress={()=>{this.clearnotifications()}} style={{alignItems:"flex-end",padding:16}}>
            <Text style={styles.clearText}>{config.I18N.t('clear_all')}</Text>
          </Pressable>
            <FlatList
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              data={this.state.notificationData}
              extraData={this.state}
              refreshControl={
                <RefreshControl
                  tintColor={config.Constant.COLOR_TAB}
                  titleColor={config.Constant.COLOR_TAB}
                  colors={[config.Constant.COLOR_TAB]}
                  refreshing={this.state.isFetching}
                  onRefresh={() => this.onRefresh()}
                />
              }
              renderItem={this.renderItem}
            />
          </View>
        ) : (
          <View
            style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <Text style={styles.emptyString}>{this.state.emptyList}</Text>
          </View>
        )}
      </View>
    );
  }
}
