import React from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Ripple from 'react-native-material-ripple';
import StarRating from 'react-native-star-rating';
import CustomButton from '../../component/CustomButton';
import CustomHeader from '../../component/CustomHeader';
import config from '../../config';
import styles from './styles';
import {getRoundOf, getFinalPrice} from '../../Util/Utilities';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class OrderReview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageUdate: true,
      Data1: 1,
      Data2: 1,
      Data3: 1,
      dataSource: null,
      catSelectedArr: [],
      address: '',
      latitude: '',
      longitude: '',
      fees: 0,
      commission: 0,
    };
  }
  componentDidMount = async () => {
    this.props.navigation.addListener('focus', async () => {
      BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
      try {
        var dataSource = this.props.route.params.dataSource;
        console.log("componentDidMount datasource", JSON.stringify(dataSource))


        this.setState({
          address: !!config.Constant.USER_DATA.address
            ? config.Constant.USER_DATA.address
            : '',
          latitude: !!config.Constant.USER_DATA.latitude
            ? config.Constant.USER_DATA.latitude
            : '',
          longitude: !!config.Constant.USER_DATA.longitude
            ? config.Constant.USER_DATA.longitude
            : '',
        });
        var catSelectedArr = await AsyncStorage.getItem('catSelectedArr');
        if (!!dataSource) {
          this.setState({
            dataSource
          });
        }
        if (!!catSelectedArr) {
          this.setState(
            {
              catSelectedArr: JSON.parse(catSelectedArr),
            },
            () => {
              this.updatePrice();
            },
          );
        }
      } catch (error) {}
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
    });
    this.props.navigation.addListener('blur', () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.hardwareBackPress,
      );
    });
  };
  hardwareBackPress = () => {
    this.props.navigation.pop();
    return true;
  };
  updatePrice = () => {
    const {dataSource} = this.state;

    !!dataSource &&
      !!dataSource.service &&
      dataSource.service.map((itm, ind) => {
        var priceTotal = 0;
        this.state.catSelectedArr.map((item, index) => {
          if (itm.category_id == item.id) {
            //priceTotal = parseFloat(itmS.price) + priceTotal;
            this.state.catSelectedArr[index].price = itm.price;
          }
        });
      });
    this.setState({
      catSelectedArr: this.state.catSelectedArr,
    });
  };
  getSubTotal = (type) => {
    const {catSelectedArr} = this.state;

    var total = 0;
    var Subtotal = 0;
    var totalFees = 0;
    var totalCommission =
      parseFloat(this.state.fees)
    catSelectedArr.map((item, index) => {
      if (!!item.price && !!item.quantity) {
        Subtotal = Subtotal + parseFloat(item.price * parseInt(item.quantity));
      }
    });
    if (type == '1') {
      return Subtotal;
    } else if (type == '2') {
      return (Subtotal * totalCommission) / 100;
    } else if (type == '3') {
      return Subtotal + (Subtotal * totalCommission) / 100;
    } else if (type == '4') {
      return (Subtotal * parseFloat(this.state.fees)) / 100;
    } else if (type == '5') {
      return (Subtotal * parseFloat(this.state.commission)) / 100;
    }
  };
  render() {
    const {dataSource, catSelectedArr} = this.state;
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
          txtStyle={config.I18N.t('reviewOrders')}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          bounces={false}>
          <View style={styles.reviewBox}>
            <View style={styles.serviceRowView}>
              <FastImage
                resizeMode={'cover'}
                style={{width: 50, borderRadius: 100, height: 50}}
                source={
                  !!dataSource && !!dataSource.image
                    ? {
                        uri:
                          config.Constant.UsersProfile_Url +
                          '' +
                          dataSource.image,
                      }
                    : require('../../assets/images/male.png')
                }
              />
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 10,
                  justifyContent: 'center',
                }}>
                <Text numberOfLines={2} style={styles.reviewName}>
                  {!!dataSource && !!dataSource.name ? dataSource.name : ''}
                </Text>
                {!!dataSource && (
                  <View
                    style={[
                      styles.serviceRowView,
                      {marginVertical: 0, justifyContent: 'flex-start'},
                    ]}>
                    <StarRating
                      disabled={true}
                      halfStar={require('../../assets/images/icon_halfstar.png')}
                      fullStar={require('../../assets/images/filledStar.png')}
                      emptyStar={require('../../assets/images/startInactive.png')}
                      maxStars={5}
                      rating={
                        !!dataSource &&
                        !!dataSource.avg_rating &&
                        dataSource.avg_rating.length > 0 &&
                        !!dataSource.avg_rating[0].avg_rating
                          ? dataSource.avg_rating[0].avg_rating
                          : 4
                      }
                      containerStyle={{height: 25, width: 70}}
                      starStyle={{marginRight: 5}}
                      starSize={20}
                      selectedStar={(rating) => {}}
                    />
                    {dataSource?.reviews?.length > 0 && (
                      <Text numberOfLines={2} style={styles.reviewTxt}>
                        (
                        {!!dataSource &&
                        !!dataSource.reviews &&
                        dataSource.reviews.length > 0
                          ? dataSource.reviews.length
                          : ''}{' '}
                        {config.I18N.t('reviews')})
                      </Text>
                    )}
                  </View>
                )}
              </View>
            </View>
          </View>
{/* 
          <View style={styles.addressContainer}>
            <Image
              style={styles.smallIcon}
              resizeMode={'contain'}
              source={require('../../assets/images/placeholder.png')}
            />
            <Text style={styles.locationPlaceTxt}>
              {!!this.state.address ? this.state.address : '-'}
            </Text>
            <Ripple
              onPress={() => {
                this.props.navigation.navigate('ChangeLocation', {
                  lat: this.state.latitude,
                  lng: this.state.longitude,
                  address: this.state.address,
                  chnageLocation: this.chnageLocation,
                });
              }}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={styles.smallIcon}
                resizeMode={'contain'}
                source={require('../../assets/images/cursor.png')}
              />
              <Text style={styles.changeTxt}>{config.I18N.t('CHANGE')}</Text>
            </Ripple>
          </View> */}


          <View style={styles.headerStyle}>
            <Text style={styles.descTitle}>{config.I18N.t('service')}</Text>
            <Text style={styles.qtyTitle}>{config.I18N.t('qty')}</Text>
            <Text style={styles.priceTitle}>{config.I18N.t('price')}</Text>
          </View>
          <View style={styles.headerBorderStyle} />
          {!!catSelectedArr &&
            catSelectedArr.map((itemService, indexService) => {
              return (
                <View style={styles.descStyle}>
                  <Text style={styles.descData}>
                    {!!itemService.name
                      ? config.I18N.locale == 'en'
                        ? itemService.name
                        : itemService.ar_name
                      : ''}
                  </Text>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <TouchableOpacity
                      style={{padding: 5}}
                      onPress={() => {
                        if (itemService.quantity > 1) {
                          this.state.catSelectedArr[indexService].quantity =
                            this.state.catSelectedArr[indexService].quantity -
                            1;
                          this.setState({
                            catSelectedArr,
                          });
                        }
                      }}>
                      <Image
                        resizeMode={'contain'}
                        source={require('../../assets/images/remove.png')}
                        style={{width: 15, height: 15}}
                      />
                    </TouchableOpacity>
                    <Text style={[styles.qtyData, {width: 50}]}>
                      {itemService.quantity}
                    </Text>
                    <TouchableOpacity
                      style={{padding: 5}}
                      onPress={() => {
                        this.state.catSelectedArr[indexService].quantity =
                          this.state.catSelectedArr[indexService].quantity + 1;
                        this.setState({
                          catSelectedArr,
                        });
                      }}>
                      <Image
                        resizeMode={'contain'}
                        source={require('../../assets/images/plus.png')}
                        style={{width: 15, height: 15}}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.priceData}>
                    {!!itemService.price
                      ? 
                            itemService.price * parseInt(itemService.quantity)
                        
                      : ''}
                  </Text>
                </View>
              );
            })}


          {/* <View style={[styles.headerStyle, {marginTop: 20}]}>
            <Text style={styles.descSubTotal}>{config.I18N.t('SubTotal')}</Text>
            <Text style={styles.qtySubTotal}></Text>
            <Text style={styles.priceSubTotal}>
              {
                getRoundOf(this.getSubTotal('1'))}
            </Text>
          </View> */}


          {/* <View style={[styles.headerStyle, {marginTop: 10}]}>
            <Text style={styles.descData}>
              {config.I18N.t('fees')} ({parseFloat(this.state.fees)}
              %)
            </Text>
            <Text style={styles.qtyData}></Text>
            <Text style={styles.priceData}>
              {' '}
              {getRoundOf(this.getSubTotal('4'))}
            </Text>
          </View> */}


          {/* <View style={[styles.headerStyle, {marginTop: 10}]}>
            <Text style={styles.descData}>
              {config.I18N.t('tax')} ({parseFloat(this.state.commission)}
              %)
            </Text>
            <Text style={styles.qtyData}></Text>
            <Text style={styles.priceData}>
              {' '}
              {getRoundOf(this.getSubTotal('5'))}
            </Text>
          </View> */}


          <View style={styles.borderView} />
          <View style={[styles.headerStyle, {marginTop: 10}]}>
            <Text
              style={[styles.descTitle, {color: config.Constant.COLOR_TAB}]}>
              {config.I18N.t('Total')}
            </Text>
            <Text
              style={[
                styles.qtyTitle,
                {color: config.Constant.COLOR_TAB},
              ]}></Text>
            <Text
              style={[styles.priceTitle, {color: config.Constant.COLOR_TAB}]}>
              {getRoundOf(this.getSubTotal('1'))}
            </Text>
          </View>
          <CustomButton
            btnTxt={config.I18N.t('confirm')}
            onPress={() => {
              //this.props.
              this.props.navigation.navigate('Checkout', {
                dataSource: this.state.dataSource,
                catSelectedArr: this.state.catSelectedArr,
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                address: this.state.address,
                from_search: this.props.route.params?.from_search ? this.props.route.params?.from_search : false
              });
            }}
            containerStyle={styles.btnStyle}
          />
        </ScrollView>
      </View>
    );
  }
}
