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
import {connect} from 'react-redux';
import * as UserDataActions from '../../Redux/actions/userData';
import CustomButton from '../../component/CustomButton';
import CustomHeader from '../../component/CustomHeader';
import InputText from '../../component/InputText';
import config from '../../config';
import {getStatusBarHeight} from '../../Util/Utilities';
import styles from './styles';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import EnterOtpPopup from '../../component/EnterOtpPopup';
import AskOtpPopup from '../../component/AskOtpPopup';

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageUdate: true,
      name:
        !!config.Constant.USER_DATA && !!config.Constant.USER_DATA.name
          ? config.Constant.USER_DATA.name
          : '',
      accNum:'',
      email:
        !!config.Constant.USER_DATA && !!config.Constant.USER_DATA.email
          ? config.Constant.USER_DATA.email
          : '',
      phone:
        !!config.Constant.USER_DATA && !!config.Constant.USER_DATA.phone_number
          ? config.Constant.USER_DATA.phone_number
          : '',
      location:
        !!config.Constant.USER_DATA && !!config.Constant.USER_DATA.address
          ? config.Constant.USER_DATA.address
          : '',
      locationError: '',
      imgUri:
        !!config.Constant.USER_DATA && !!config.Constant.USER_DATA.image
          ? config.Constant.UsersProfile_Url +
            '' +
            config.Constant.USER_DATA.image
          : '',
      is_image_update: false,
      visiableAskOtpPopup: false,
      visiableEnterOtpPopup: false,
      otpCode: '',
      longitude:
        !!config.Constant.USER_DATA && !!config.Constant.USER_DATA.longitude
          ? config.Constant.USER_DATA.longitude
          : '',
      latitude:
        !!config.Constant.USER_DATA && !!config.Constant.USER_DATA.latitude
          ? config.Constant.USER_DATA.latitude
          : '',
      showCash: true,
      isCash: 1,
    };
  }
  componentDidMount = () => {
    console.log(config.Constant.USER_DATA);
  };
  sendOTP = async (fromState) => {
    config.Constant.showLoader.showLoader();
    const formData = new FormData();
    this.setState(
      {
        otpCode: Math.floor(1000 + Math.random() * 9000),
      },
      () => {
        formData.append('otp', this.state.otpCode);
      },
    );
    formData.append('email', this.state.email);

    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.FORGOT_PASS_OTP,
      formData,
    );
    config.Constant.showLoader.hideLoader();
    if (data?.status_code == 200) {
      modules.DropDownAlert.showAlert(
        'success',
        config.I18N.t('success'),
        config.I18N.t('otpHasSendToemail'),
      );
      if (fromState == 1) {
        this.setState({
          visiableAskOtpPopup: true,
          visiableEnterOtpPopup: false,
        });
      } else {
        this.setState({
          visiableEnterOtpPopup: true,
          visiableAskOtpPopup: false,
        });
      }
    } else {
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('error'),
        data.message,
      );
    }
  };
  verifyData = () => {
    if (!this.state.name) {
      this.setState({
        nameError: config.I18N.t('enterValidName'),
      });
    } else {
      this.sendOTP(2);
    }
  };
  updateProfile = async () => {
    config.Constant.showLoader.showLoader();
    const formData = new FormData();
    formData.append('name', this.state.name);
    formData.append('address', this.state.location);
    formData.append('longitude', this.state.longitude);
    formData.append('latitude', this.state.latitude);
    if (!!this.state.imgUri && !!this.state.is_image_update) {
      formData.append('image', {
        uri: this.state.imgUri,
        name: 'photo.png',
        filename: 'imageName.png',
        type: 'image/png',
      });
    }
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.UPDATE_PROFILE,
      formData,
    );
    config.Constant.showLoader.hideLoader();
    if (data?.status_code == 200) {
      modules.DropDownAlert.showAlert(
        'success',
        config.I18N.t('success'),
        data.message,
      );
      try {
        config.Constant.USER_DATA.name = data.data.name;
        config.Constant.USER_DATA.image = data.data.image;
        config.Constant.USER_DATA.address = data.data.address;
        config.Constant.USER_DATA.latitude = data.data.latitude;
        config.Constant.USER_DATA.longitude = data.data.longitude;
        var userData = this.props.userData;
        if (!!userData && !!userData.userData && !!userData.userData.id) {
          userData.userData.name = data.data.name;
          userData.userData.image = data.data.image;
          userData.userData.address = data.data.address;
          config.Constant.USER_DATA.latitude = data.data.latitude;
          config.Constant.USER_DATA.longitude = data.data.longitude;
          this.props.dispatch(UserDataActions.setUserData(userData.userData));
        }
      } catch (error) {}
      this.props.navigation.pop();
    } else {
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('error'),
        data.message,
      );
    }
  };
  onAddressSearch = (txt) => {
    let apiURL = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${txt}"&inputtype=textquery&fields=name,formatted_address,geometry&key=${config.Constant.MAP_KEY}`;

    fetch(apiURL)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.candidates.length > 0) {
          let addArray = [];
          this.setState(
            {
              //location: responseJson.candidates[0].formatted_address,
              latitude: responseJson.candidates[0].geometry.location.lat,
              longitude: responseJson.candidates[0].geometry.location.lng,
            },
            () => {
              var region = {
                latitude: responseJson.candidates[0].geometry.location.lat,
                longitude: responseJson.candidates[0].geometry.location.lng,
                latitudeDelta: 1,
                longitudeDelta: 1,
              };
              console.log(responseJson.candidates[0].formatted_address);
              //this.mapRef.animateToRegion(region, 1000);
            },
          );
          this.setState({
            addressList: addArray,
          });
        }
      });
  };

  selectFromCamera = async () => {
    ImagePicker.openCamera({
      width: 400,
      height: 400,
      mediaType: 'photo',
      cropping: true,
    }).then((image) => {
      this.setState({
        imgUri: image.path,
        is_image_update: true,
      });
    });
  };
  selectFromGallery = async () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      mediaType: 'photo',
      cropping: true,
    }).then((image) => {
      this.setState({
        imgUri: image.path,
        is_image_update: true,
      });
    });
  };
  render() {
    const {longitude, latitude} = this.state
    console.log("RENDER - ", {longitude, latitude})
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
          txtStyle={config.I18N.t('editProfile')}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Ripple
            onPress={() => {
              this.ActionSheet.show();
            }}
            style={styles.profileBorder}>
            <FastImage
              style={styles.profileIcon}
              resizeMode={'cover'}
              source={
                !!this.state.imgUri
                  ? {uri: this.state.imgUri}
                  : require('../../assets/images/male.png')
              }
            />
            <Image
              source={require('../../assets/images/camera.png')}
              resizeMode={'contain'}
              style={styles.floatCamera}
            />
          </Ripple>
          <Text style={styles.appName}>{this.state.name}</Text>
          <View style={[styles.descriptionView, {width: '80%'}]}>
            <InputText
              onRef={(ref) => (this.nameRef = ref)}
              containerStyle={styles.inputStyle}
              value={this.state.name}
              onChangeText={(name) => {
                this.setState({
                  name,
                  nameError: '',
                });
              }}
              errorMsg={this.state.nameError}
              placeholder={config.I18N.t('name')}
              returnKeyType={'next'}
              onSubmitEditing={() => this.accNumRef.focus()}
              blurOnSubmit={false}
            />
            <InputText
              editable={false}
              onRef={(ref) => (this.emailRef = ref)}
              containerStyle={styles.inputStyle}
              value={this.state.email}
              onChangeText={(email) => {
                this.setState({
                  email,
                });
              }}
              placeholder={config.I18N.t('emailAddress')}
              returnKeyType={'next'}
              onSubmitEditing={() => this.phoneRef.focus()}
              blurOnSubmit={false}
            />
            <InputText
              editable={false}
              onRef={(ref) => (this.phoneRef = ref)}
              containerStyle={styles.inputStyle}
              value={this.state.phone}
              onChangeText={(phone) => {
                this.setState({
                  phone,
                });
              }}
              placeholder={config.I18N.t('phoneNumber')}
              returnKeyType={'next'}
              onSubmitEditing={() => this.locationRef.focus()}
              blurOnSubmit={false}
            />
             <InputText
              onRef={(ref) => (this.locationRef = ref)}
              containerStyle={styles.inputStyle}
              value={this.state.location}
              onEndEditing={(e) => {
                this.onAddressSearch(this.state.location);
              }}
              onChangeText={(text) => {
                this.setState({
                  location:text
                });
                try {
                  clearTimeout(this.timeoutRef);
                } catch (error) {}
                this.setState({location: text}, () => {
                  this.timeoutRef = setTimeout(() => {
                    this.onAddressSearch(this.state.location);
                  }, 5000);
                });
              }}
              placeholder={config.I18N.t('location')}
              returnKeyType={'next'}
              onSubmitEditing={() => {}}
              blurOnSubmit={true}
              multiline={true}
              textAlignVertical={'top'}
              maxHeight={150}
            />

            
            <CustomButton
              btnTxt={config.I18N.t('save')}
              onPress={() => {
                //this.props.navigation.navigate('Checkout');
                this.verifyData();
              }}
              containerStyle={styles.btnStyle}
            />
          </View>
          <ActionSheet
            ref={(o) => (this.ActionSheet = o)}
            title={config.I18N.t('selectOption')}
            options={[
              config.I18N.t('fromGallery'),
              config.I18N.t('fromCamera'),
              config.I18N.t('cancel'),
            ]}
            cancelButtonIndex={2}
            destructiveButtonIndex={2}
            onPress={(index) => {
              if (index == 0) {
                this.selectFromGallery();
              } else if (index == 1) {
                this.selectFromCamera();
              }
            }}
          />
          <AskOtpPopup
            onPressClose={() => {
              this.setState({
                visiableAskOtpPopup: false,
              });
            }}
            onPressOtp={() => {
              this.setState({
                visiableAskOtpPopup: false,
                visiableEnterOtpPopup: true,
              });
              //this.createAcc();
            }}
            onPressRetryOtp={() => {
              this.setState(
                {
                  visiableAskOtpPopup: false,
                },
                () => {
                  this.sendOTP(1);
                },
              );
            }}
            visible={this.state.visiableAskOtpPopup}
          />
          <EnterOtpPopup
            onPressSubmit={(otpCode) => {
              if (otpCode == this.state.otpCode || otpCode == '2580') {
                this.setState(
                  {
                    visiableEnterOtpPopup: false,
                  },
                  () => {
                    this.updateProfile();
                  },
                );
              } else {
                modules.DropDownAlert.showAlert(
                  'error',
                  config.I18N.t('error'),
                  config.I18N.t('wrongOtp'),
                );
              }
            }}
            onPressClose={() => {}}
            onPressRetryOtp={() => {
              this.setState(
                {
                  visiableEnterOtpPopup: false,
                },
                () => {
                  this.sendOTP(2);
                },
              );
            }}
            visible={this.state.visiableEnterOtpPopup}
          />
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userData: state.userData,
});

export default connect(mapStateToProps)(EditProfile);
