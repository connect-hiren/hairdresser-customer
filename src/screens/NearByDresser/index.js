import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  ScrollView,
  RefreshControl,
  Image,
  FlatList,
  BackHandler,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Ripple from 'react-native-material-ripple';
import CustomButton from '../../component/CustomButton';
import CustomHeader from '../../component/CustomHeader';
import config from '../../config';
import { getRoundOf, getFinalPrice } from '../../Util/Utilities';
import styles from './styles';

export default class NearByDresser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      catSelectedArr: [],
      dresserArr: [],
      latitude: '',
      longitude: '',
      address: '',
      emptyList: '',
      isFetching: false,
      fees: 0,
    };
    
  }
  componentDidMount = () => {
    console.log("NearByHairDresser componentDidMount 1")
    config.Constant.settingData.map((itm, ind) => {
      if (itm.key_name == 'tax') {
        this.setState({
          fees: itm.key_value,
        });
      }
      if (itm.key_name == 'commission') {
        this.setState({
          commission: itm.key_value,
        });
      }
    });
    try {
      var latitude = this.props.route.params.latitude;
      var longitude = this.props.route.params.longitude;
      var address = this.props.route.params.address;

      console.log({
        longitude,latitude,address
      })

      //  {
      //       address: config.Constant.USER_DATA.address,
      //       latitude: config.Constant.USER_DATA.latitude,
      //       longitude: config.Constant.USER_DATA.longitude,
      //     }
      this.setState({
        latitude,
        longitude,
        address,
      });
    } catch (error) { }

    this.props.navigation.addListener('focus', async () => {
      try {
        var catSelectedArr = await AsyncStorage.getItem('catSelectedArr');
        console.log("catSelectedArr 101 ", catSelectedArr)
        if (!!catSelectedArr && JSON.parse(catSelectedArr).length > 0) {
          this.setState(
            {
              catSelectedArr: JSON.parse(catSelectedArr),
            },
            () => {
              var data = [];
              JSON.parse(catSelectedArr).map((item, index) => {
                data.push(item.id);
              });
              console.log("this.getNearByDresser(data) - ",catSelectedArr, data)
              this.getNearByDresser(data);
            },
          );
        } else{
          this.setState({
            emptyList: config.I18N.t('noDresserAvailable'),
          });
        }
      } catch (error) { }
    });
    // this.props.navigation.addListener('blur', () => {
    //   try {
    //     console.log("NearByHairDresser - blur ASCSA", this.state.catSelectedArr)
    //     AsyncStorage.setItem('catSelectedArr',
    //       JSON.stringify(this.state.catSelectedArr),
    //     );
    //   } catch (error) { }
    // });
  };
  onRefresh() {
    this.setState({ isFetching: true }, async () => {
      try {
        var catSelectedArr = await AsyncStorage.getItem('catSelectedArr');
        console.log("catSelectedArr -102 ", catSelectedArr)
        if (!!catSelectedArr && JSON.parse(catSelectedArr).length > 0) {
          this.setState(
            {
              catSelectedArr: JSON.parse(catSelectedArr),
            },
            () => {
              var data = [];
              JSON.parse(catSelectedArr).map((item, index) => {
                data.push(item.id);
              });
              console.log("NearByHairDresser onRefresh 2", data)
              this.getNearByDresser(data, false);
            },
          );
        } else{
          this.setState({
            emptyList: config.I18N.t('noDresserAvailable'),
          });
        }
      } catch (error) { }
    });
  }
  hardwareBackPress = () => {
    // this.props.navigation.pop();
    this.props.navigation.reset({
      index: 1,
      routes: [{ name: 'DashboardTab' }],
    });
    return true;
  };
  getNearByDresser = async (service_ids, loader = true) => {
    if (!!loader) {
      config.Constant.showLoader.showLoader();
    }

    const formData = new FormData();
    formData.append('service_ids', JSON.stringify(service_ids));
    formData.append('latitude', this.state.latitude.length == 0 ? config.Constant.USER_DATA.latitude : this.state.latitude);
    formData.append('longitude', this.state.longitude.length == 0 ? config.Constant.USER_DATA.longitude: this.state.longitude);
    setTimeout(() => {
      this.setState({
        emptyList: config.I18N.t('noDresserAvailable'),
      });
    }, 10000);
    console.log("GET_NEAR_BY_DRESSER data", {
      'service_ids': JSON.stringify(service_ids),
      'latitude': this.state.latitude,
      'longitude': this.state.longitude
    })
    //  GET_NEAR_BY_DRESSER data {"latitude": "30.51506", "longitude": "75.84709", "service_ids": "[1]"}

    // GET_NEAR_BY_DRESSER data {"latitude": "30.51506", "longitude": "75.84709", "service_ids": "[1]"}

    // GET_NEAR_BY_DRESSER data {"latitude": "30.51506", "longitude": "75.84709", "service_ids": "[1]"}


    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.GET_NEAR_BY_DRESSER,
      formData,
    );
    this.setState({
      isFetching: false,
    });
    config.Constant.showLoader.hideLoader();
    if (data?.status_code == 200) {
      //alert(JSON.stringify(data.data));
      this.setState(
        {
          emptyList: config.I18N.t('noDresserAvailable'),
          dresserArr: data.data,
        },
        () => {
          this.updatePrice();
        },
      );
    } else {
    }
  };
  updatePrice = () => {
    this.state.dresserArr.map((itm, ind) => {
      var priceTotal = 0;
      itm.service.map((itmS, indS) => {
        this.state.catSelectedArr.map((item, index) => {
          console.log("catSelectedArrItem - ", item)
          if (itmS.category_id == item.id) {
            priceTotal = (parseFloat(itmS.price) * item.quantity) + priceTotal;
          }
        });
      });
      this.state.dresserArr[ind].priceTotal = priceTotal;
    });
    this.setState({
      dresserArr: this.state.dresserArr,
    });
  };
  renderItem = ({ item, index }) => {
    return (
      <Ripple
        onPress={() => {
            this.props.navigation.goBack()
            this.props.navigation.goBack()
            this.props.navigation.navigate('VendorView', {
            user_id: item.id,
            // dataSource: item,
            dataSource: { ...item, showCount:true},

          });

          // this.props.navigation.navigate('CartItem', {
          //   dataSource: item,
          //   latitude: this.state.latitude,
          //   longitude: this.state.longitude,
          //   address: this.state.address,
          //   from_search: true
          // }); // VendorView
        }}
        style={styles.notificationView}>
        <FastImage
          resizeMode={'cover'}
          style={{ width: 50, height: 50, borderRadius: 100 }}
          source={
            !!item && !!item.image
              ? {
                uri: config.Constant.UsersProfile_Url + '' + item.image,
              }
              : require('../../assets/images/male.png')
          }
        />
        <View style={{ flex: 1, marginHorizontal: 10 }}>
          <View style={styles.rowView}>
            <Text style={styles.rowTitle}>{item.name}</Text>
            {!!item.review_list && item.review_list.length > 0 && (
              <View style={{ flexDirection: 'row' }}>
                <Image
                  styles={{ width: 10, height: 10, marginTop: -5 }}
                  resizeMode={'contain'}
                  source={require('../../assets/images/star.png')}
                />
                <Text style={[styles.rowTime, { marginLeft: 10 }]}>
                  {!!item.avg_rating &&
                    item.avg_rating.length > 0 &&
                    !!item.avg_rating[0].avg_rating
                    ? item.avg_rating[0].avg_rating
                    : '0.0'}{' '}
                  <Text
                    style={[
                      styles.rowTime,
                      { color: config.Constant.COLOR_GREY },
                    ]}>
                    ({!!item.review_list && item.review_list.length})
                  </Text>
                </Text>
              </View>
            )}
          </View>
          <View style={styles.rowViewBottom}>
            <Text style={styles.rowDesc}>
              {!!item.distance ? getRoundOf(item.distance) : '0'} km{' '}
              {config.I18N.t('away')}
            </Text>
            <Text style={styles.rowStatus}>
              {!!item.priceTotal
                ? getRoundOf(item.priceTotal) : ''}{' '}
              SAR
            </Text>
          </View>
        </View>
      </Ripple>
    );
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
            this.hardwareBackPress();
          }}
          txtStyle={config.I18N.t('nearByHairDresser')}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              tintColor={config.Constant.COLOR_TAB}
              titleColor={config.Constant.COLOR_TAB}
              colors={[config.Constant.COLOR_TAB]}
              refreshing={this.state.isFetching}
              onRefresh={() => this.onRefresh()}
            />
          }>
          <View style={styles.catView}>
            {this.state.catSelectedArr.map((item, index) => {
              return (
                <View style={styles.wrapRow}>
                  <Text style={styles.wrapTxtRow}>{item.name}</Text>
                  <View style={styles.deviderLine} />
                  <Ripple
                    onPress={() => {
                      var arr = [];
                      this.state.catSelectedArr.map((itm, ind) => {
                        if (itm.id != item.id) {
                          arr.push(itm);
                        }
                      });

                      this.setState(
                        {
                          catSelectedArr: arr,
                        },
                        () => {
                          if (arr.length < 1) {
                            this.props.navigation.pop();
                          }
                          this.updatePrice();
                        },
                      );
                    }}>
                    <Image
                      style={{ width: 15, height: 15, tintColor: 'white' }}
                      resizeMode={'contain'}
                      source={require('../../assets/images/dashIcon.png')}
                    />
                  </Ripple>
                </View>
              );
            })}
            <Ripple
              onPress={() => {
                this.props.navigation.navigate('CartItem');
              }}
              style={[
                styles.wrapRow,
                { backgroundColor: 'white', borderWidth: 1 },
              ]}>
              <Text
                style={[styles.wrapTxtRow, { color: config.Constant.COLOR_TAB }]}>
                {config.I18N.t('change')}
              </Text>
            </Ripple>
          </View>
          <View style={styles.borderView} />
          {this.state.dresserArr.length > 0 ? (
            <FlatList
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              data={this.state.dresserArr}
              extraData={this.state}
              renderItem={this.renderItem}
            />
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                marginTop: config.Constant.SCREEN_HEIGHT * 0.25,
              }}>
              <Text style={styles.emptyString}>{this.state.emptyList}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}
