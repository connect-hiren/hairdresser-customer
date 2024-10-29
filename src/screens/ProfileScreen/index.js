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
  Alert,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Ripple from 'react-native-material-ripple';
import CustomButton from '../../component/CustomButton';
import config from '../../config';
import { getStatusBarHeight } from '../../Util/Utilities';
import styles from './styles';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import Tooltip from 'rn-tooltip';
import StarRating from 'react-native-star-rating';
import modules from '../../modules';
import { connect } from 'react-redux';
import * as UserDataActions from '../../Redux/actions/userData';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  AnimatedRegion,
} from 'react-native-maps';
class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageUdate: true,
      longitude:
        !!config.Constant.USER_DATA && !!config.Constant.USER_DATA.longitude
          ? config.Constant.USER_DATA.longitude
          : '',
      latitude:
        !!config.Constant.USER_DATA && !!config.Constant.USER_DATA.latitude
          ? config.Constant.USER_DATA.latitude
          : ''
    };
  }
  componentDidMount = () => {
    this.props.navigation.addListener('focus', () => {
      this.setState({
        languageUdate: true,
      });
    });
  };
  _menu = null;

  setMenuRef = (ref) => {
    this._menu = ref;
  };

  hideMenu = (index) => {
    //this._menu.hide();
    if (index == 1) {
      this.props.navigation.navigate('EditProfile');
    } else if (index == 2) {
      this.props.navigation.navigate('ChangePass');
    }
  };

  showMenu = () => {
    this._menu.show();
  };

  deleteAccount = () => {

    Alert.alert(
      config.I18N.t('deleteAccount'),
      config.I18N.t('deleteAccountMsg'),
      [
        {
          text: config.I18N.t('No'),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: config.I18N.t('Yes'), onPress: async () => {
            config.Constant.showLoader.showLoader();
            var data = await modules.APIServices.PostApiCall(
              config.ApiEndpoint.DELETE_ACCOUNT + `/${this.props.userData.userData.id}`,
              {},
            );
            if (data?.status_code == 200) {
              config.Constant.USER_DATA = {
                token: '',
              };
              this.props.dispatch(UserDataActions.setUserData(null));
              this.props.navigation.reset({
                index: 1,
                routes: [{ name: 'Login' }],
              });
            } else {
              modules.DropDownAlert.showAlert(
                'error',
                config.I18N.t('error'),
                data.message,
              );
            }
            config.Constant.showLoader.hideLoader();
          }
        }
      ]
    );
  }

  render() {
    const {longitude, latitude} = this.state
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={false}
          translucent
          backgroundColor="transparent"
          barStyle={'dark-content'}
        />
        <View style={styles.rowContainer}>
          <View>
            <Image
              //source={require('../../assets/images/backICon.png')}
              style={styles.smallIcon}
              resizeMode={'contain'}
            />
          </View>
          <Text style={styles.headerTitle}>{config.I18N.t('profile')}</Text>
          {/* <Menu
            style={{borderRadius: 15, marginTop: 30}}
            ref={this.setMenuRef}
            button={
              <Ripple onPress={this.showMenu}>
                <Image
                  source={require('../../assets/images/edit.png')}
                  style={styles.smallIcon}
                  resizeMode={'contain'}
                />
              </Ripple>
            }>
            <MenuItem
              style={{
                marginBottom: -10,
                marginVertical: 0,
                paddingHorizontal: 10,
              }}
              onPress={() => this.hideMenu(1)}>
              <View style={styles.selectedItemsView}>
                <View style={styles.emptyIcon}>
                  <View style={styles.filledIcon} />
                </View>
                <Text style={styles.searchName}>
                  {config.I18N.t('generalProfile')}
                </Text>
              </View>
            </MenuItem>
            <MenuItem
              style={{paddingHorizontal: 10}}
              onPress={() => this.hideMenu(2)}>
              <View style={styles.selectedItemsView}>
                <View style={styles.emptyIcon}>
                  <View style={styles.filledIcon} />
                </View>
                <Text style={styles.searchName}>
                  {config.I18N.t('changePassword')}
                </Text>
              </View>
            </MenuItem>
          </Menu> */}
          <Tooltip
            width={200}
            height={100}
            containerStyle={{
              borderRadius: 15,
              padding: 10,
              shadowColor: config.Constant.COLOR_TRANSPARENT,
              shadowOffset: {
                width: 2,
                height: 2,
              },
              shadowRadius: 6,
              shadowOpacity: 1,
              elevation: 5,
            }}
            pointerStyle={{}}
            backgroundColor={'#efedd7'}
            pointerColor={'#efedd7'}
            popover={
              <View
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  width: 200,
                }}>
                <View
                  onTouchStart={() => this.hideMenu(1)}
                  style={styles.selectedItemsView}>
                  <View style={styles.emptyIcon}>
                    <View style={styles.filledIcon} />
                  </View>
                  <Text style={styles.searchName}>
                    {config.I18N.t('generalProfile')}
                  </Text>
                </View>
                <View
                  onTouchStart={() => this.hideMenu(2)}
                  style={styles.selectedItemsView}>
                  <View style={styles.emptyIcon}>
                    <View style={styles.filledIcon} />
                  </View>
                  <Text style={styles.searchName}>
                    {config.I18N.t('changePassword')}
                  </Text>
                </View>
              </View>
            }>
            <View //onPress={this.showMenu}
            >
              <Image
                source={require('../../assets/images/edit.png')}
                style={[
                  styles.smallIcon,
                  {
                    transform: [
                      { rotate: config.Constant.isRTL ? '0deg' : '0deg' },
                    ],
                  },
                ]}
                resizeMode={'contain'}
              />
            </View>
          </Tooltip>
          {/* <Ripple
            onPress={() => {
              this.props.navigation.navigate('EditProfile');
            }}>
            <Image
              source={require('../../assets/images/edit.png')}
              style={styles.smallIcon}
              resizeMode={'contain'}
            />
          </Ripple> */}
        </View>
        <View style={styles.profileBorder}>
          <FastImage
            style={styles.profileIcon}
            resizeMode={'cover'}
            source={
              !!config.Constant.USER_DATA && !!config.Constant.USER_DATA.image
                ? {
                  uri:
                    config.Constant.UsersProfile_Url +
                    '' +
                    config.Constant.USER_DATA.image,
                }
                : require('../../assets/images/male.png')
            }
          />
        </View>
        <Text style={styles.appName}>
          {!!config.Constant.USER_DATA && !!config.Constant.USER_DATA.name
            ? config.Constant.USER_DATA.name
            : ''}
        </Text>
        {!!config.Constant.USER_DATA &&
          !!config.Constant.USER_DATA.review_list &&
          config.Constant.USER_DATA.review_list.length > 0 && (
            <StarRating
              disabled={true}
              halfStar={require('../../assets/images/icon_halfstar.png')}
              fullStar={require('../../assets/images/filledStar.png')}
              emptyStar={require('../../assets/images/startInactive.png')}
              maxStars={5}
              rating={
                !!config.Constant.USER_DATA &&
                  !!config.Constant.USER_DATA.avg_rating &&
                  config.Constant.USER_DATA.avg_rating.length > 0 &&
                  !!config.Constant.USER_DATA.avg_rating[0].avg_rating
                  ? config.Constant.USER_DATA.avg_rating[0].avg_rating
                  : 0
              }
              containerStyle={{
                height: 25,
                width: 120,
                alignSelf: 'center',
                marginBottom: 30,
              }}
              starStyle={{ marginRight: 5 }}
              starSize={20}
              selectedStar={(rating) => { }}
            />
          )}
        <View style={{ width: '95%', alignSelf: 'center', marginTop: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}>
            <Text style={styles.fontStyleNew}>{config.I18N.t('phone')}</Text>
            <Text style={styles.fontStyleCenterNew}>:</Text>
            <Text style={styles.fontStyleEndNew}>
              {!!config.Constant.USER_DATA &&
                !!config.Constant.USER_DATA.phone_number
                ? config.Constant.USER_DATA.phone_number
                : ''}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}>
            <Text style={styles.fontStyleNew}>{config.I18N.t('email')}</Text>
            <Text style={styles.fontStyleCenterNew}>:</Text>
            <Text style={styles.fontStyleEndNew}>
              {!!config.Constant.USER_DATA && !!config.Constant.USER_DATA.email
                ? config.Constant.USER_DATA.email
                : ''}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}>
            <Text style={styles.fontStyleNew}>{config.I18N.t('location')}</Text>
            <Text style={styles.fontStyleCenterNew}>:</Text>
            <Text style={styles.fontStyleEndNew}></Text>
            {/* <Text style={styles.fontStyleEndNew}>
              {config.Constant.USER_DATA.address}
            </Text> */}
          </View>
          <View  style={{
                height: 200,
                width: '100%',
                alignItems:'center'
              }}>
          <MapView
              provider={PROVIDER_GOOGLE}
              style={{
                height: 200,
                width: '90%',
              }}
              zoomEnabled={true}
              zoomControlEnabled={true}
              region={{
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}>
              <View>
              <Marker
                  coordinate={{
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    latitudeDelta: 0.09,
                    longitudeDelta: 0.02,
                  }}
                  // title={'ok'}
                  // description={'okok'}
                >
                  {/* <FastImage
                    source={require('../../assets/images/scissor.png')}
                    resizeMode={FastImage.resizeMode.contain}
                    style={{
                      height: 30,
                      width: 30,
                      marginBottom: 10,
                      marginLeft: 20,
                      tintColor: config.Constant.COLOR_TAB,
                    }}
                  /> */}
                  <FastImage
              style={{
                height: 36,
                width: 36,
                marginBottom: 10,
                marginLeft: 20,
                borderRadius:18,
                borderWidth:0
              }}
              resizeMode={'cover'}
              source={
                !!this.state.imgUri
                  ? {uri: this.state.imgUri}
                  : require('../../assets/images/male.png')
              }
            />
                </Marker>
               
              
              </View>
            </MapView>
            </View>
          {/* <CustomButton
            btnTxt={config.I18N.t('deleteAccount')}
            onPress={() => {
              this.deleteAccount();
            }}
            containerStyle={styles.deleteBtn}
          /> */}
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userData: state.userData,
});

export default connect(mapStateToProps, null)(ProfileScreen);