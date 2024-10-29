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
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Ripple from 'react-native-material-ripple';
import CustomButton from '../../component/CustomButton';
import CustomHeader from '../../component/CustomHeader';
import config from '../../config';
import {getStatusBarHeight} from '../../Util/Utilities';
import styles from './styles';
import moment from 'moment';
export default class OrderHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageUdate: true,
      is_load: false,
      dataArr: [],
      emptyList: '',
      isFetching: false,
    };
  }
  componentDidMount = () => {
    this.props.navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
      this.GetOrderList();
    });
    this.props.navigation.addListener('blur', () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.hardwareBackPress,
      );
    });
  };
  hardwareBackPress = () => {
    this.props.navigation.navigate('scissor');
    return true;
  };
  getStatusColor = (item) => {
    if (!!item.order_status) {
      if (item.order_status == 1) {
        return config.Constant.COLOR_YELLOW;
      } else if (item.order_status == 2) {
        return 'red';
      } else if (item.order_status == 3) {
        return 'red';
      } else if (item.order_status == 4) {
        return config.Constant.COLOR_YELLOW;
      } else if (item.order_status == 5) {
        return config.Constant.COLOR_YELLOW;
      } else if (item.order_status == 6) {
        return config.Constant.COLOR_YELLOW;
      } else if (item.order_status == 7) {
        return config.Constant.COLOR_GREEN;
      } else if (item.order_status == 8) {
        return 'red';
      }
    }
  };
  getStatus = (item) => {
    if (!!item.order_status) {
      if (item.order_status == 1) {
        return config.I18N.t('requestSend');
      } else if (item.order_status == 2) {
        return config.I18N.t('reqestTimeot');
      } else if (item.order_status == 3) {
        return config.I18N.t('reqestCancel');
      } else if (item.order_status == 4) {
        return config.I18N.t('inProgress');
      } else if (item.order_status == 5) {
        return config.I18N.t('inProgress');
      } else if (item.order_status == 6) {
        return config.I18N.t('inProgress');
      } else if (item.order_status == 7) {
        return config.I18N.t('orderCompleted');
      } else if (item.order_status == 8) {
        return config.I18N.t('requestRejected');
      }
    }
  };
  onRefresh() {
    this.setState({isFetching: true}, () => {
      this.GetOrderList();
    });
  }
  renderItem = ({item, index}) => {
    console.log("item", item)
    return (
      <Ripple
        onPress={() => {
          this.props.navigation.navigate('OrderDetails', {order_id: item.id});
        }}
        style={styles.notificationView}>
        <FastImage
          resizeMode={'cover'}
          style={{width: 50, height: 50, borderRadius: 50}}
          source={
            !!item.hairdresser && !!item.hairdresser.image
              ? {
                  uri:
                    config.Constant.UsersProfile_Url +
                    '' +
                    item.hairdresser.image,
                }
              : require('../../assets/images/male.png')
          }
        />
        <View style={{flex: 1, marginHorizontal: 10}}>
          <View style={styles.rowView}>
            <Text style={styles.rowTitle}>Order code: {item.order_code}</Text>
            <Text style={styles.rowTime}>
              {' '}
              {moment.utc(item.created_at).local().format('DD MMM, YY')}
            </Text>
          </View>
          <View style={styles.rowViewBottom}>
            <Text style={styles.rowDesc}>For {item.hairdresser.name}</Text>
            <Text style={styles.rowStatus}>{this.getStatus(item)}</Text>
          </View>
        </View>
        <View
          style={[
            styles.viewLine,
            {
              backgroundColor: this.getStatusColor(item),
            },
          ]}
        />
      </Ripple>
    );
  };
  GetOrderList = async () => {
    const formData = new FormData();
    formData.append('role_id', 2);
    if (!this.state.is_load) {
      config.Constant.showLoader.showLoader();
      setTimeout(() => {
        this.setState({
          emptyList: config.I18N.t('noOrder'),
        });
      }, 10000);
    }

    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.ORDER_LIST,
      formData,
    );
    this.setState({
      emptyList: config.I18N.t('noOrder'),
      is_load: true,
      isFetching: false,
    });
    config.Constant.showLoader.hideLoader();
    if (data?.status_code == 200) {
      this.setState({
        dataArr: data.data,
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
          barStyle={'dark-content'}
        />

        <CustomHeader txtStyle={config.I18N.t('yourOrders')} />
        {this.state.dataArr.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={this.state.dataArr}
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
