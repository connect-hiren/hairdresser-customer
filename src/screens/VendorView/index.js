import React from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  Image,
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';
import config from '../../config';
import * as Animatable from 'react-native-animatable';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import Ripple from 'react-native-material-ripple';
import styles from './styles';
import CustomButton from '../../component/CustomButton';
import {TabView, SceneMap} from 'react-native-tab-view';
import CustTabView from '../../component/CustomTabView';
import StarRating from 'react-native-star-rating';
import {getRoundOf, getFinalPrice} from '../../Util/Utilities';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';

class VendorView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageUdate: true,
      isRTL: config.Constant.isRTL,
      isMenuOpen: false,
      serviceData: [
        {title: 'Normal Haircut'},
        {title: 'Styling'},
        {title: 'Spa'},
      ],
      parantArr: [],
      reviewData: [1, 2, 3],
      dataSource: null,
      latitude: '',
      longitude: '',
      address: '',
      catSelectedArr: [],
      fees: 0,
      currTab: 0,
    };
  }
  getCount = (cId) => {
    count = 0;
    this.state.catSelectedArr.map((itm, index) => {
      if (cId == itm.id && !!itm.quantity) {
        count = itm.quantity;
      }
    });
    return count;
  };
  getPlusCount = (cId, item) => {
    is_added = false;
    this.state.catSelectedArr.map((itm, index) => {
      if (cId == itm.id) {
        is_added = true;
        if (!!itm.quantity && !!parseInt(itm.quantity)) {
          this.state.catSelectedArr[index].quantity = itm.quantity + 1;
        }
      }
    });
    if (!is_added) {
      item.quantity = 1;
      this.state.catSelectedArr.push(item);
    }

    this.setState({
      catSelectedArr: this.state.catSelectedArr,
    });
  };

  getMinusCount = (cId, item) => {
    this.state.catSelectedArr.map((itm, index) => {
      if (cId == itm.id) {
        if (!!itm.quantity && !!parseInt(itm.quantity)) {
          if (parseInt(itm.quantity) == 1) {
            var arrLocal = this.state.catSelectedArr;
            arrLocal.splice(index, 1);
            this.state.catSelectedArr = arrLocal;
          } else {
            this.state.catSelectedArr[index].quantity = itm.quantity - 1;
          }
        } else {
          var arrLocal = this.state.catSelectedArr;
          arrLocal.splice(index, 1);
          this.state.catSelectedArr = arrLocal;
        }
      }
    });
    this.setState({
      catSelectedArr: this.state.catSelectedArr,
    });
  };
  componentDidMount = () => {
    this.props.navigation.addListener('focus', async () => {
      try {
        console.log('VENDORVIEW - 1 ');
        var dataSource = this.props.route.params.dataSource;

        console.log('VENDORVIEW - 2 ');
        var latitude = this.props.route.params.latitude;
        var longitude = this.props.route.params.longitude;
        var address = this.props.route.params.address;
        var user_id = this.props.route.params.user_id;

        var catSelectedArr = await AsyncStorage.getItem('catSelectedArr');
        console.log('VENDORVIEW - 3 ');
        if (!!dataSource) {
          console.log('VENDORVIEW - 4 ');
          this.setState({
            dataSource,
            latitude,
            longitude,
            address,
          });
        }
        if (!!dataSource?.showCount) {
          if (!!catSelectedArr) {
            this.setState({
              catSelectedArr: JSON.parse(catSelectedArr),
            });
          }
        } else {
          if (!!user_id) {
            this.setState({
              catSelectedArr: [],
            });
          } else if (!!catSelectedArr) {
            this.setState({
              catSelectedArr: JSON.parse(catSelectedArr),
            });
          }
        }

        console.log('VENDORVIEW - 5 ');
        if (!!dataSource) {
          console.log('VENDORVIEW - 6 ');
          this.getData(dataSource.id);
          console.log('VENDORVIEW - 7 ');
          this.setState({
            dataSource,
            latitude,
            longitude,
            address,
          });
        } else if (!!user_id) {
          this.getData(user_id);
        }
      } catch (error) {}
    });
    this.props.navigation.addListener('blur', () => {
      console.log('VendorView - blur. ASCSA', this.state.catSelectedArr);
      try {
        AsyncStorage.setItem(
          'catSelectedArr',
          JSON.stringify(this.state.catSelectedArr),
        );
      } catch (error) {}
    });
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
  };
  getData = async (user_id) => {
    const formData = new FormData();
    formData.append('hairdresser_id', user_id);
    config.Constant.showLoader.showLoader();
    console.log(
      'config.ApiEndpoint.HAIRDRESSER_DETAILS',
      config.ApiEndpoint.HAIRDRESSER_DETAILS,
    );
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.HAIRDRESSER_DETAILS,
      formData,
    );

    config.Constant.showLoader.hideLoader();
    if (data?.status_code == 200) {
      console.log('data.data ', data.data);
      var dataSource = this.props.route.params.dataSource;
      this.setState(
        {
          dataSource: {
            ...data.data,
            favorite_count: dataSource?.favorite_count
              ? dataSource?.favorite_count
              : '0',
          },
        },
        () => {
          this.getArrange();
        },
      );
    } else {
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('error'),
        data.message,
      );
    }
  };
  getArrange = () => {
    const {dataSource} = this.state;
    var parantArr = [];
    dataSource.service.map((serCatItm, indd) => {
      var is_add = true;
      parantArr.map((Pid, Pind) => {
        if (
          !serCatItm.category_detail ||
          Pid.id == serCatItm.category_detail.parent_category.id
        ) {
          is_add = false;
        }
      });
      if (!!is_add) {
        parantArr.push({
          id: serCatItm.category_detail.parent_category.id,
          name:
            config.I18N.locale == 'en'
              ? serCatItm.category_detail.parent_category.name
              : serCatItm.category_detail.parent_category.ar_name,
        });
      }
    });
    parantArr.map((item, index) => {
      var subCatArr = dataSource.service.filter((sItem, sIndex) => {
        return (
          !!sItem.category_detail &&
          sItem.category_detail.parent_category.id == item.id
        );
      });
      parantArr[index].subCatArr = subCatArr;
    });

    this.setState({
      parantArr: parantArr,
    });
  };
  changeFavData = async () => {
    const {dataSource} = this.state;
    if (!!dataSource && !!dataSource.id) {
      const formData = new FormData();
      formData.append('hairdressor_id', dataSource.id);
      formData.append('type', dataSource.favorite_count == '1' ? 0 : 1);
      config.Constant.showLoader.showLoader();
      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.USER_FAVORITE,
        formData,
      );

      config.Constant.showLoader.hideLoader();
      if (data?.status_code == 200) {
        this.state.dataSource.favorite_count =
          this.state.dataSource.favorite_count == '1' ? '0' : '1';
        this.setState({
          dataSource: this.state.dataSource,
        });
      } else {
        modules.DropDownAlert.showAlert(
          'error',
          config.I18N.t('error'),
          data.message,
        );
      }
    }
  };
  aboutScreen = () => {
    return (
      <View style={styles.tabView}>
        {(!this.state.dataSource || !this.state.dataSource.about) && (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              marginTop: config.Constant.SCREEN_HEIGHT * 0.1,
            }}>
            <Text style={styles.emptyString}>
              {config.I18N.t('add_someting_about_you')}
            </Text>
          </View>
        )}
        <Text style={styles.descTxt}>
          {!!this.state.dataSource ? this.state.dataSource.about : ''}
        </Text>
      </View>
    );
  };
  serviceScreen = () => {
    return (
      <View style={styles.tabView}>
        {this.state.parantArr.length < 1 && (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              marginTop: config.Constant.SCREEN_HEIGHT * 0.13,
            }}>
            <Text style={styles.emptyString}>
              {config.I18N.t('add_Services')}
            </Text>
          </View>
        )}
        {this.state.parantArr.map((itm, ind) => {
          return (
            <View>
              <Text style={styles.serviceHeader}>
                {config.I18N.locale == 'en' ? itm.name : itm?.ar_name}
              </Text>
              {itm.subCatArr.map((item, index) => {
                return (
                  <View style={styles.serviceRowView}>
                    <Text style={styles.serviceTitle}>
                      {!!item.category_detail && item.category_detail.name}
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
                          this.getMinusCount(
                            item.category_detail.id,
                            item.category_detail,
                          );
                        }}>
                        <Image
                          resizeMode={'contain'}
                          source={require('../../assets/images/remove.png')}
                          style={{width: 15, height: 15}}
                        />
                      </TouchableOpacity>
                      <Text style={[styles.qtyData, {width: 50}]}>
                        {`${this.getCount(item.category_detail.id)}`}
                      </Text>
                      <TouchableOpacity
                        style={{padding: 5}}
                        onPress={() => {
                          this.getPlusCount(
                            item.category_detail.id,
                            item.category_detail,
                          );
                        }}>
                        <Image
                          resizeMode={'contain'}
                          source={require('../../assets/images/plus.png')}
                          style={{width: 15, height: 15}}
                        />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.serviceDetails}>
                      {getRoundOf(
                        item.price * this.getCount(item.category_detail.id),
                      )}
                    </Text>
                  </View>
                );
              })}
              <View style={styles.borderView} />
            </View>
          );
        })}
      </View>
    );
  };

  reviewScreen = () => {
    return (
      <View style={styles.tabView}>
        {!this.state.dataSource ||
          !this.state.dataSource.review_list ||
          (this.state.dataSource.review_list.length < 1 && (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                marginTop: config.Constant.SCREEN_HEIGHT * 0.1,
              }}>
              <Text style={styles.emptyString}>
                {config.I18N.t('noReviews')}
              </Text>
            </View>
          ))}

        {!!this.state.dataSource &&
          !!this.state.dataSource.review_list &&
          this.state.dataSource.review_list.map((item, index) => {
            return (
              <View key={`rating${index}`} style={styles.reviewBox}>
                <View style={styles.serviceRowView}>
                  <FastImage
                    resizeMode={'cover'}
                    style={{width: 70, height: 70, borderRadius: 100}}
                    source={
                      !!item.sender && !!item.sender.image
                        ? {
                            uri:
                              config.Constant.UsersProfile_Url +
                              '' +
                              item.sender.image,
                          }
                        : require('../../assets/images/male.png')
                    }
                  />
                  <View style={{flex: 1, paddingHorizontal: 10}}>
                    <View style={[styles.serviceRowView, {marginVertical: 0}]}>
                      <Text numberOfLines={2} style={styles.reviewName}>
                        {!!item.sender && !!item.sender.name
                          ? item.sender.name
                          : ''}
                      </Text>
                      <Text numberOfLines={2} style={styles.timeTxt}>
                        {moment.utc(item.created_at).local().format('hh:mm a')}
                        {'\n'}
                        {moment
                          .utc(item.created_at)
                          .local()
                          .format('DD MMM, YY')}
                      </Text>
                    </View>
                    <StarRating
                      disabled={true}
                      halfStar={require('../../assets/images/icon_halfstar.png')}
                      fullStar={require('../../assets/images/filledStar.png')}
                      emptyStar={require('../../assets/images/startInactive.png')}
                      maxStars={5}
                      rating={item.rating}
                      containerStyle={{height: 25, width: 70, marginTop: -10}}
                      starStyle={{marginRight: 5}}
                      starSize={20}
                      selectedStar={(rating) => {}}
                    />
                  </View>
                </View>
                <Text numberOfLines={2} style={styles.reviewTxt}>
                  {item.comment}
                </Text>
              </View>
            );
          })}
      </View>
    );
  };

  render() {
    const {dataSource} = this.state;
    const rowHeight = 38;
    let count = (this.state.parantArr.length + 1) * rowHeight;

    for (let ind in this.state.parantArr) {
      count += (this.state.parantArr[ind].subCatArr.length + 1) * rowHeight;
    }

    if (count < rowHeight * 13) {
      count = rowHeight * 13;
    }

    let userData = this.props.userData;
    console.log('this.state.dataSource ==>. ', dataSource);
    console.log('this.state.userData ==>. ', userData);
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={false}
          translucent
          backgroundColor="transparent"
          barStyle={'light-content'}
        />
        <FastImage
          source={
            !!dataSource && !!dataSource.image
              ? {
                  uri: config.Constant.UsersProfile_Url + '' + dataSource.image,
                }
              : require('../../assets/images/no_image.png')
          }
          resizeMode={'cover'}
          style={styles.bannerImg}
        />

        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <Ripple
            onPress={() => {
              this.props.navigation.pop();
            }}
            style={styles.backBtnView}>
            <Image
              style={{
                width: 20,
                height: 20,
                tintColor: 'white',
                transform: [
                  {rotate: config.Constant.isRTL ? '180deg' : '0deg'},
                ],
              }}
              resizeMode={'contain'}
              source={require('../../assets/images/backICon.png')}
            />
          </Ripple>
          <View style={styles.detailView}>
            <Text style={styles.titleTxt}>
              {!!dataSource ? dataSource.name : ''}
            </Text>
            <View style={styles.rowView}>
              <Text style={styles.locationTxt}>
                {!!dataSource && !!dataSource.address
                  ? dataSource.address
                  : '-'}
                -{' '}
                {!!dataSource && !!dataSource.distance
                  ? getRoundOf(dataSource.distance)
                  : '0'}{' '}
                km {config.I18N.t('away')}
              </Text>
              <Ripple
                onPress={() => {
                  // this.setState({
                  //   favorite_count,
                  // });
                  if (
                    !!userData &&
                    !!userData.userData &&
                    !!userData.userData.id
                  ) {
                    this.changeFavData();
                  } else {
                    this.props.navigation.navigate('Login');
                  }
                }}
                style={{paddingRight: 13}}>
                <Image
                  resizeMode={'contain'}
                  style={{width: 20, height: 20}}
                  source={
                    !!dataSource &&
                    !!dataSource.favorite_count &&
                    dataSource.favorite_count == '1'
                      ? require('../../assets/images/likeFilled.png')
                      : require('../../assets/images/heart.png')
                  }
                />
              </Ripple>
            </View>
            {!!dataSource && !!dataSource.reviews && (
              <View style={styles.rowView}>
                <StarRating
                  disabled={true}
                  halfStar={require('../../assets/images/icon_halfstar.png')}
                  fullStar={require('../../assets/images/filledStar.png')}
                  emptyStar={require('../../assets/images/startInactive.png')}
                  maxStars={5}
                  rating={
                    !!dataSource.avg_rating &&
                    dataSource.avg_rating.length > 0 &&
                    !!dataSource.avg_rating[0].avg_rating
                      ? parseFloat(dataSource.avg_rating[0].avg_rating)
                      : 4
                  }
                  containerStyle={{height: 25, width: 70}}
                  starStyle={{marginRight: 5}}
                  starSize={20}
                  selectedStar={(rating) => {}}
                />
                {!!dataSource &&
                  !!dataSource.reviews &&
                  dataSource.reviews.length > 0 && (
                    <Text style={styles.profileReviewTxt}>
                      (
                      {!!dataSource &&
                        !!dataSource.reviews &&
                        dataSource.reviews.length}{' '}
                      {config.I18N.t('reviews')})
                    </Text>
                  )}
              </View>
            )}
          </View>
          <View
            showsVerticalScrollIndicator={false}
            bounces={false}
            style={styles.bottomScrollView}>
            {!!dataSource &&
              (dataSource.is_online == '1' ? (
                <View style={styles.onlineView}>
                  <Text style={styles.onlineTxt}>
                    {config.I18N.t('online')}
                  </Text>
                </View>
              ) : (
                <View style={styles.offlineView}>
                  <Text style={styles.offlineTxt}>
                    {config.I18N.t('offline')}
                  </Text>
                </View>
              ))}
            <View style={styles.bottomView}>
              {!!dataSource &&
              !!dataSource.id &&
              dataSource.is_online == '1' ? (
                <CustomButton
                  btnTxt={config.I18N.t('bookNow')}
                  onPress={async () => {
                    if (!!this.state.address) {
                      if (
                        !!userData &&
                        !!userData.userData &&
                        !!userData.userData.id
                      ) {
                        this.props.navigation.navigate('CartItem', {
                          dataSource,
                          latitude: this.state.latitude,
                          longitude: this.state.longitude,
                          address: this.state.address,
                          from_search: this.props.route.params?.from_search
                            ? this.props.route.params?.from_search
                            : false,
                        });
                      } else {
                        this.props.navigation.navigate('Login');
                      }
                    } else {
                      if (
                        !!userData &&
                        !!userData.userData &&
                        !!userData.userData.id
                      ) {
                        let catSelectedStr =
                          this.state.catSelectedArr.length == 0
                            ? undefined
                            : JSON.stringify(this.state.catSelectedArr);
                        console.log(
                          'vendorView - bookNow ASCSA',
                          this.state.catSelectedArr,
                        );
                        await AsyncStorage.setItem(
                          'catSelectedArr',
                          catSelectedStr,
                        );

                        this.props.navigation.navigate('CartItem', {
                          dataSource: dataSource,
                        }); // CartItem.  - OrderReview
                      } else {
                        this.props.navigation.navigate('Login');
                      }
                    }
                  }}
                  containerStyle={styles.btnStyle}
                />
              ) : (
                <View style={styles.btnStyle} />
              )}
            </View>
            <ScrollView
              style={{flex: 1, height: '100%'}}
              contentContainerStyle={{flexGrow: 1, height: '100%'}}>
              <CustTabView
                firstscreen={this.serviceScreen()}
                seconscreen={this.reviewScreen()}
                thirdscreen={this.aboutScreen()}
                changeIndex={(currTab) => {
                  this.setState({
                    currTab,
                  });
                }}
              />
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userData: state.userData,
});

export default connect(mapStateToProps, null)(VendorView);
