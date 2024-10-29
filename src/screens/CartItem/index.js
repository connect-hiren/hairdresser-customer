import React from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  TextInput,
  BackHandler,
} from 'react-native';
import Ripple from 'react-native-material-ripple';
import CustomButton from '../../component/CustomButton';
import config from '../../config';
import styles from './styles';
import StarRating from 'react-native-star-rating';
import CustomDropdownSearch from '../../component/CustomDropdownSearch';
import Dialog, { SlideAnimation, DialogContent } from 'react-native-popup-dialog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

export default class CartItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageUdate: true,
      catArr: [],
      catSelectedArr: [],
      selectedItems: 'test',
      optionBox: false,
      showArr: false,
      catSubArr: [],
      searchCatArr: [],
      address: '',
      latitude: '',
      longitude: '',
      searchTxt: '',
    };
  }
  componentDidMount = () => {
    this.catData();

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
    this.props.navigation.addListener('focus', async () => {
      BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
      var dataSource =
        !!this.props.route.params && !!this.props.route.params.dataSource
          ? this.props.route.params.dataSource
          : false;
      const { catArr } = this.state;

      if (!!dataSource) {
        // this.setState({
        //   catSelectedArr: [],
        // });
        try {
          
          var catSelectedArr = await AsyncStorage.getItem('catSelectedArr');
          
          if (!!catSelectedArr) {
            this.setState({
              catSelectedArr: JSON.parse(catSelectedArr),
            });
          }
        } catch (error) { }
      } else {
        try {
          var catSelectedArr = await AsyncStorage.getItem('catSelectedArr');
          if (!!catSelectedArr) {
            this.setState({
              catSelectedArr: JSON.parse(catSelectedArr),
            });
          }
        } catch (error) { }
      }
    });
    this.props.navigation.addListener('blur', () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.hardwareBackPress,
      );

      try {
        // console.log("CartItem blur ASCSA - ", this.state.catSelectedArr)
        AsyncStorage.setItem('catSelectedArr',
          JSON.stringify(this.state.catSelectedArr),
        );
      } catch (error) { }
    });
  };
  hardwareBackPress = () => {
    if (!!this.state.optionBox) {
      this.setState({
        optionBox: false,
      });
      return true;
    }
  };
  serviceRenderRow = ({ item }) => {
    return (
      <Ripple
        onPress={() => {
          this.setState({
            catSubArr: item.category,
            optionBox: true,
          });
        }}
        style={styles.serviceView}>
        {/* <View style={styles.serviceImgView}>
          <Image
            resizeMode={'contain'}
            source={require('../../assets/images/chair.png')}
            style={{width: '80%', height: '80%'}}
          />
        </View> */}
        <FastImage
          source={
            !!item.image && { uri: config.Constant.CAT_IMAGE_URL + item.image }
          }
          style={{ width: 60, height: 60 }}
          resizeMode={'cover'}
        />
        <Text style={styles.serviceName}>{item.name}</Text>
      </Ripple>
    );
  };
  searchRender = ({ item }) => {
    return (
      <Ripple style={styles.selectedItemsView}>
        <Text style={styles.searchName}>{item.name}</Text>
        <Text style={styles.searchType}>{item.type}</Text>
      </Ripple>
    );
  };
  popupListRenderRow = ({ item }) => {
    var selected = false;
    this.state.catSelectedArr.map((itm, ind) => {
      if (itm.id == item.id) {
        selected = true;
      }
    });
    return (
      <Ripple
        onPress={() => {
          if (!selected) {
            this.state.catSelectedArr.push(item);
            this.setState({
              catSelectedArr: this.state.catSelectedArr,
            });
          } else {
            var arr = [];
            this.state.catSelectedArr.map((itm, ind) => {
              if (itm.id != item.id) {
                arr.push(itm);
              }
            });

            this.setState({
              catSelectedArr: arr,
            });
          }
        }}
        style={styles.selectedItemsView}>
        <View style={styles.emptyIcon}>
          {!!selected && <View style={styles.filledIcon} />}
        </View>
        <Text style={styles.searchName}>{item.name}</Text>
      </Ripple>
    );
  };
  searchItem = ({ item }) => {
    var selected = false;
    this.state.catSelectedArr.map((itm, ind) => {
      if (itm.id == item.id) {
        selected = true;
      }
    });
    return (
      <Ripple
        onPress={() => {
          this.setState({
            showArr: false,
          });
          if (!selected) {
            this.state.catSelectedArr.push(item);
            this.setState({
              catSelectedArr: this.state.catSelectedArr,
            });
          } else {
            // var arr = [];
            // this.state.catSelectedArr.map((itm, ind) => {
            //   if (itm.id != item.id) {
            //     arr.push(itm);
            //   }
            // });
            // this.setState({
            //   catSelectedArr: arr,
            // });
          }
        }}
        style={[styles.selectedItemsView, { marginVertical: 5 }]}>
        <Text style={styles.searchSubName}>{item.name}</Text>
        <Text style={styles.searchCatName}>{item.mainCatName}</Text>
      </Ripple>
    );
  };
  catData = async () => {
    config.Constant.showLoader.showLoader();
    const formData = new FormData();
    formData.append('role_id', 2);
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.categoryList,
      formData,
    );
    config.Constant.showLoader.hideLoader();
    if (data?.status_code == 200) {
      //quantity
      var catArr = [];
      data.data.map((item, index) => {
        catArr.push(item);
      });
      this.setState(
        {
          catArr: catArr,
        },
        () => this.getArrange(),
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
    var catMainArr = [];
    var subCatArr = [];

    // try {
    var dataSource =
      !!this.props.route.params && !!this.props.route.params.dataSource
        ? this.props.route.params.dataSource
        : false;
    const { catArr } = this.state;
    // console.log("dataSource ", dataSource)
    if (!!dataSource) {
      var parantArr = [];
      // this.setState({
      //   catSelectedArr: [],
      // });
      dataSource.service.map((serCatItm, indd) => {
        var is_add = true;
        parantArr.map((Pid, Pind) => {
          if (
            !serCatItm.category_detail ||
            Pid == serCatItm.category_detail.parent_category.id
          ) {
            is_add = false;
          }
        });
        if (!!is_add) {
          parantArr.push(serCatItm.category_detail.parent_category.id);
        }
        console.log('parantArr = ' + JSON.stringify(parantArr));
      });
      parantArr.map((item, index) => {
        catArr.map((itm, ind) => {
          if (item == itm.id) {
            var subCatArr = [];
            dataSource.service.map((sItem, sIndex) => {
              itm.category.map((sItm, sInd) => {
                if (sItem.category_id == sItm.id) {
                  subCatArr.push(sItm);
                }
              });
            });
            if (subCatArr.length > 0) {
              var itmFinal = itm;
              itmFinal.category = subCatArr;
              catMainArr.push(itmFinal);
            }
          }
        });
      });
      this.setState({
        catArr: catMainArr,
      });
    }
    // } catch (error) {}
  };
  chnageLocation = (latitude, longitude, address) => {
    this.setState({
      latitude,
      longitude,
      address,
    });
  };
  updatePrice = async () => {
    var dataSource =
    !!this.props.route.params && !!this.props.route.params.dataSource
      ? this.props.route.params.dataSource
      : [];
      let updatedCategory= []
    console.log("updatePrice datasource", JSON.stringify(dataSource))
    !!dataSource &&
      !!dataSource.service &&
      dataSource.service.map((itm, ind) => {
        this.state.catSelectedArr.map((item, index) => {
          if (itm.category_id == item.id) {
            //priceTotal = parseFloat(itmS.price) + priceTotal;
            // this.state.catSelectedArr[index].price = itm.price;
            updatedCategory.push({
              ...this.state.catSelectedArr[index],
              price:itm.price
            })
          }
        });
      });
      // console.log("CartItem updatePrice ASCSA - ", this.state.catSelectedArr)
      await AsyncStorage.setItem('catSelectedArr',
        JSON.stringify(updatedCategory),
      );
    return updatedCategory ;
  };
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
    let is_added = false;
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
  render() {
    const { catSelectedArr } = this.state;
    const isSearch = this.props.route.params?.dataSource == undefined
    var dataSource = this.props.route.params?.dataSource;

    return (
      <View style={styles.container}>
        <StatusBar
          hidden={false}
          translucent
          backgroundColor="transparent"
          barStyle={'dark-content'}
        />
        <ScrollView
          ref={(ref) => {
            this.scrollRef = ref;
          }}
          scrollEnabled={!this.state.showArr}
          showsVerticalScrollIndicator={false}
          bounces={false}>
          <Text style={styles.userName}>
            {config.I18N.t('hello')},{' '}
            {!!config.Constant.USER_DATA && !!config.Constant.USER_DATA.name
              ? config.Constant.USER_DATA.name
              : ''}
          </Text>

          { !isSearch && <View>
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
                  paddingHorizontal: 10
                }}>
                <Text numberOfLines={2} style={styles.reviewName}>
                  {!!dataSource && !!dataSource.name ? dataSource.name : ''}
                </Text>
                {!!dataSource && (
                  <View
                    style={[
                      styles.serviceRowView,
                      {marginVertical: 0, justifyContent: 'flex-start', width:'100%'},
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
                      containerStyle={{height: 25, width: 120}}
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

          <Text style={styles.locationTxt}>
            {config.I18N.t('yourLocation')}
          </Text>
          <View style={styles.rowContainer}>
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
          </View>

          <View style={styles.mapBox}>
          {!!this.state.latitude && !!this.state.longitude && (
              <MapView
                ref={(ref) => (this.mapRef = ref)}
                provider={PROVIDER_GOOGLE}
                style={{
                  width: '100%',
                  height: 150,
                  borderTopRightRadius: 20,
                  borderTopLeftRadius: 20,
                }}
                draggable={false}
                zoomEnabled={false}
                zoomControlEnabled={false}
                initialRegion={{
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                  latitude: parseFloat(this.state.latitude),
                  longitude: parseFloat(this.state.longitude),
                }}
                // region={{
                //   latitude: parseFloat(this.state.latitude),
                //   longitude: parseFloat(this.state.longitude),
                // }}
              >
                <Marker
                  draggable={false}
                  coordinate={{
                    latitude: parseFloat(this.state.latitude),
                    longitude: parseFloat(this.state.longitude),
                  }}
                  // image={require("../../assets/Images /logos.png")}
                />
              </MapView>
            )}
            </View>

            </View>}
            {/* <View style={styles.mapBox}>
            {!!this.state.latitude && !!this.state.longitude && (
              <MapView
                ref={(ref) => (this.mapRef = ref)}
                provider={PROVIDER_GOOGLE}
                style={{
                  width: '100%',
                  height: 150,
                  borderTopRightRadius: 20,
                  borderTopLeftRadius: 20,
                }}
                draggable={false}
                zoomEnabled={false}
                zoomControlEnabled={false}
                initialRegion={{
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                  latitude: parseFloat(this.state.latitude),
                  longitude: parseFloat(this.state.longitude),
                }}
              >
                <Marker
                  draggable={false}
                  coordinate={{
                    latitude: parseFloat(this.state.latitude),
                    longitude: parseFloat(this.state.longitude),
                  }}
                />
              </MapView>
            )}
            <Text style={styles.mapDescTxt}>
              {!!this.state.address ? this.state.address : ''}
            </Text>

            <Ripple
              onPress={() => {
                this.props.navigation.navigate('ChangeLocation', {
                  lat: this.state.latitude,
                  lng: this.state.longitude,
                  address: this.state.address,
                  chnageLocation: this.chnageLocation,
                });
              }}>
              <Text style={styles.mapChangeTxt}>{config.I18N.t('change')}</Text>
            </Ripple>
          </View> */}



          {/* <View style={styles.catView}>
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
                        this.setState({
                          catSelectedArr: arr,
                        });
                      }}>
                      <Image
                        style={{width: 15, height: 15, tintColor: 'white'}}
                        resizeMode={'contain'}
                        source={require('../../assets/images/dashIcon.png')}
                      />
                    </Ripple>
                  </View>
                );
              })}
            </View> */}

          {/* <View onPress={() => {}} style={styles.searchBar}>
            <Image
              resizeMode={'contain'}
              source={require('../../assets/images/Search.png')}
              style={styles.searchIcon}
            />
            <TextInput
              placeholder={config.I18N.t('seachService')}
              placeholderTextColor={config.Constant.COLOR_GREY}
              style={styles.inputStyle}
              value={this.state.searchTxt}
              onChangeText={(searchTxt) => {
                var searchCatArr = [];
                this.state.catArr.map((itm, ind) => {
                  !!itm.category &&
                    itm.category.map((sItm, sInd) => {
                      sItm.mainCatName = itm.name;
                      if (
                        !searchTxt ||
                        sItm.name
                          .toLowerCase()
                          .includes(searchTxt.toLowerCase())
                      ) {
                        searchCatArr.push(sItm);
                      }
                    });
                });
                this.setState({
                  searchCatArr,
                  searchTxt,
                });
              }}
              onFocus={() => {
                var searchCatArr = [];
                this.state.catArr.map((itm, ind) => {
                  !!itm.category &&
                    itm.category.map((sItm, sInd) => {
                      sItm.mainCatName = itm.name;
                      if (
                        !this.state.searchTxt ||
                        sItm.name
                          .toLowerCase()
                          .includes(this.state.searchTxt.toLowerCase())
                      ) {
                        searchCatArr.push(sItm);
                      }
                    });
                });
                this.setState({
                  searchCatArr,
                  showArr: true,
                });
              }}
              onBlur={() => {
                //alert('onBlur')
                // setTimeout(() => {
                //   this.setState({
                //     showArr: false,
                //   });
                // }, 1000);
              }}
            />
            {!!this.state.showArr && (
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    showArr: false,
                  });
                }}>
                <Image
                  resizeMode={'contain'}
                  source={require('../../assets/images/letterx.png')}
                  style={[styles.searchIcon, {width: 15}]}
                />
              </TouchableOpacity>
            )}
          </View>
          */}
          {/* {!!this.state.showArr && (
            <FlatList
              data={this.state.searchCatArr}
              style={{
                padding: 5,
                width: '90%',
                alignSelf: 'center',
                maxHeight: 170,
                shadowColor: config.Constant.COLOR_GREY,
                backgroundColor: 'white',
                shadowOffset: {
                  width: 2,
                  height: 2,
                },
                shadowRadius: 6,
                shadowOpacity: 1,
                elevation: 10,
              }}
              extraData={this.state}
              renderItem={this.searchItem}
            />
          )} */}
          {/* <CustomDropdownSearch
            onItemSelect={(item) => {
              this.setState({selectedItems: item.name});
            }}
            containerStyle={{padding: 5,width:'90%',alignSelf:'center'}}
            itemStyle={{
              padding: 10,
              marginTop: 2,
              backgroundColor: '#ddd',
              borderColor: '#bbb',
              borderWidth: 1,
              borderRadius: 5,
            }}
            itemTextStyle={{color: '#222'}}
            itemsContainerStyle={{maxHeight: 140}}
            items={this.state.catArr}
            defaultIndex={2}
            resetValue={this.state.selectedItems}
            textInputProps={{
              placeholder: config.I18N.t('seachService'),
              placeholderTextColor: config.Constant.COLOR_GREY,
              style: styles.inputStyle,
              onTextChange: (text) => {},
            }}
            listProps={{
              nestedScrollEnabled: true,
              renderItem: this.searchRender,
            }}
          /> */}
          {/* <View style={styles.rowViewStyle}>
            <Text style={styles.rowTitle}>{config.I18N.t('services')}</Text>
          </View> */}
          <View style={styles.headerStyle}>
            <Text style={styles.descTitle}>{config.I18N.t('service')}</Text>
            <Text style={styles.qtyTitle}>{config.I18N.t('qty')}</Text>
            {/* <Text style={styles.priceTitle}>{config.I18N.t('price')}</Text> */}
          </View>

          <View style={styles.headerBorderStyle} />

          {!!this.state.catArr &&
            this.state.catArr.map((itemMainService) => {
              return (
                <View>
                  <Text
                    style={[
                      styles.descTitle,
                      { width: '90%', alignSelf: 'center', marginBottom: 10 },
                    ]}>
                    {config.I18N.locale == 'en' ? itemMainService.name : itemMainService.ar_name}
                  </Text>
                  {itemMainService.category.map((itemService, indexService) => {
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
                            style={{ padding: 5 }}
                            onPress={() => {
                              this.getMinusCount(itemService.id, itemService);
                            }}>
                            <Image
                              resizeMode={'contain'}
                              source={require('../../assets/images/remove.png')}
                              style={{ width: 15, height: 15 }}
                            />
                          </TouchableOpacity>
                          <Text style={[styles.qtyData, { width: 50 }]}>
                            {`${this.getCount(itemService.id)}`}
                          </Text>
                          <TouchableOpacity
                            style={{ padding: 5 }}
                            onPress={() => {
                              this.getPlusCount(itemService.id, itemService);
                            }}>
                            <Image
                              resizeMode={'contain'}
                              source={require('../../assets/images/plus.png')}
                              style={{ width: 15, height: 15 }}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                </View>
              );
            })}

          {/* <ScrollView
            bounces={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: config.Constant.SCREEN_WIDTH * 0.05,
            }}
            horizontal>
            <FlatList
              bounces={false}
              style={{height: 200, alignSelf: 'center'}}
              data={this.state.catArr}
              numColumns={9}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              renderItem={this.serviceRenderRow}
            />
          </ScrollView> */}
          <CustomButton
            btnTxt={
              !!this.props.route.params && !!this.props.route.params.dataSource
                ? config.I18N.t('bookNow')
                : config.I18N.t('searchHairDresser')
            }
            onPress={async () => {
              if (this.state.catSelectedArr.length < 1) {
                modules.DropDownAlert.showAlert(
                  'error',
                  config.I18N.t('error'),
                  config.I18N.t('pleaseSelectOneService'),
                );
              } else if (
                !this.state.address ||
                !this.state.latitude ||
                !this.state.longitude
              ) {
                modules.DropDownAlert.showAlert(
                  'error',
                  config.I18N.t('error'),
                  config.I18N.t('selectLocation'),
                );
              } else {
                try {
                  var dataSource =
                    !!this.props.route.params &&
                      !!this.props.route.params.dataSource
                      ? this.props.route.params.dataSource
                      : false;
                      console.log("bookNow", dataSource)
                  if (!!dataSource) {
                    // dataSource: this.state.dataSource,
                    // catSelectedArr: this.state.catSelectedArr,
                    // latitude: this.state.latitude,
                    // longitude: this.state.longitude,
                    // address: this.state.address,
                    // from_search: this.props.route.params?.from_search ? this.props.route.params?.from_search : false
                    
                    // let updatedCategorySelected = this.updatePrice()
                    // console.log("CartItem bookNow ASCSA - ", this.state.catSelectedArr)
                    await AsyncStorage.setItem('catSelectedArr',
                      JSON.stringify(this.state.catSelectedArr),
                    );
                    let updatedCat =await this.updatePrice()
                    console.log("CART_ITEM updatedCat - ", updatedCat)
                    this.props.navigation.navigate('Checkout', {
                      dataSource,
                      catSelectedArr: updatedCat,
                      latitude: this.state.latitude,
                      longitude: this.state.longitude,
                      address: this.state.address,
                      from_search: this.props.route.params?.from_search ? this.props.route.params?.from_search : false
                    });
                  } else {
                    this.props.navigation.navigate('NearByDresser', {
                      latitude: this.state.latitude,
                      catSelectedArr: catSelectedArr,
                      longitude: this.state.longitude,
                      address: this.state.address,
                    });
                  }
                } catch (error) { }
              }
            }}
            containerStyle={styles.btnStyle}
          />
        </ScrollView>
        <Dialog
          visible={this.state.optionBox}
          onTouchOutside={() => {
            this.setState({
              optionBox: false,
            });
          }}
          width={1}
          overlayOpacity={0.1}
          overlayBackgroundColor={'white'}
          dialogAnimation={
            new SlideAnimation({
              slideFrom: 'bottom',
            })
          }
          containerStyle={[
            {
              justifyContent: 'flex-end',
            },
          ]}
          dialogStyle={styles.dialogStyle}>
          <DialogContent style={[styles.dialogContent]}>
            <Ripple
              onPress={() => {
                this.setState({
                  optionBox: false,
                });
              }}
              style={{ alignItems: 'center', padding: 10, width: '100%' }}>
              <Image
                resizeMode={'contain'}
                source={require('../../assets/images/arrow.png')}
                style={{
                  width: 30,
                  height: 30,
                  tintColor: config.Constant.COLOR_TAB,
                  transform: [{ rotate: '90deg' }],
                }}
              />
            </Ripple>
            <FlatList
              bounces={false}
              style={{ alignSelf: 'center' }}
              data={this.state.catSubArr}
              extraData={this.state}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              renderItem={this.popupListRenderRow}
            />
          </DialogContent>
        </Dialog>
      </View>
    );
  }
}
