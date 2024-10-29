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
  Platform,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Ripple from 'react-native-material-ripple';
import CustomButton from '../../component/CustomButton';
import CustomHeader from '../../component/CustomHeader';
import InputText from '../../component/InputText';
import config from '../../config';
import styles from './styles';
import Geolocation from 'react-native-geolocation-service';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

export default class ChangeLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageUdate: true,
      address: '',
      addressError: '',
      latitude: 7.934984,
      longitude: 8.3027363,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };
  }
  componentDidMount = () => {
    try {
      var lat = this.props.route.params.lat;
      var lng = this.props.route.params.lng;
      var address = this.props.route.params.address;
      console.log('lat' + +'lng' + 'address');
      if (!!lat && !!lng && !!address) {
        //this.onMaLocationUpdate(lat, lng,address);
        this.setState({
          address: address,
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
        });
      } else {
        this.getLiveLatLng();
      }
    } catch (error) {
      this.getLiveLatLng();
    }
  };
  hasLocationPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
        '',
        [
          {text: 'Go to Settings', onPress: openSetting},
          {text: "Don't Use Location", onPress: () => {}},
        ],
      );
    }

    return false;
  };
  hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await this.hasLocationPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };
  getLiveLatLng = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) {
      return;
    }
    Geolocation.getCurrentPosition(
      async (position) => {
        config.Constant.showLoader.showLoader();
        config.Constant.showLoader.hideLoader();
        this.onMaLocationUpdate(
          position.coords.latitude,
          position.coords.longitude,
        );
      },
      (error) => {
        alert(JSON.stringify(error));
        console.log(JSON.stringify(error));
        config.Constant.showLoader.hideLoader();
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };
  onMapSelect = (lat, lng) => {
    // this.setState({
    //   latitude: lat,
    //   longitude: lng,
    // });
    // return;
    var apiLink =
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
      lat +
      ',' +
      lng +
      '&key=' +
      config.Constant.MAP_KEY;

    fetch(apiLink)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.results.length > 0) {
          this.setState({
            address: responseJson.results[0].formatted_address,
            latitude: parseFloat(lat),
            longitude: parseFloat(lng),
          });
        }
      });
  };
  verifyData = () => {
    if (!this.state.address) {
      //pinpointOnMap
      this.setState({
        addressError: config.I18N.t('fillValidAddress'),
      });
    } else if (!this.state.latitude || !this.state.longitude) {
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('error'),
        config.I18N.t('pinpointOnMap'),
      );
    } else {
      this.props.route.params.chnageLocation(
        this.state.latitude,
        this.state.longitude,
        this.state.address,
      );
      this.props.navigation.pop();
    }
  };
  onMaLocationUpdate = (lat, lng) => {
    var apiLink =
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
      lat +
      ',' +
      lng +
      '&key=' +
      config.Constant.MAP_KEY;

    fetch(apiLink)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.results.length > 0) {
          this.setState({
            address: responseJson.results[0].formatted_address,
            latitude: lat,
            longitude: lng,
          });
          var region = {
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          this.mapRef.animateToRegion(region, 1000);
        }
      });
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
              //address: responseJson.candidates[0].formatted_address,
              latitude: responseJson.candidates[0].geometry.location.lat,
              longitude: responseJson.candidates[0].geometry.location.lng,
            },
            () => {
              var region = {
                latitude: responseJson.candidates[0].geometry.location.lat,
                longitude: responseJson.candidates[0].geometry.location.lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              };
              this.mapRef.animateToRegion(region, 1000);
            },
          );
          this.setState({
            addressList: addArray,
          });
        }
      });
  };
  timeoutRef = null;
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
          txtStyle={config.I18N.t('changeLocation')}
        />

        <View style={[styles.descriptionView, {width: '90%'}]}>
          <InputText
            errorMsg={this.state.addressError}
            onRef={(ref) => (this.addressRef = ref)}
            containerStyle={styles.inputStyle}
            value={this.state.address}
            onChangeText={(address) => {
              try {
                clearTimeout(this.timeoutRef);
              } catch (error) {}
              this.setState({address, addressError: ''}, () => {
                this.timeoutRef = setTimeout(() => {
                  this.onAddressSearch(this.state.address);
                }, 5000);
              });
            }}
            placeholder={config.I18N.t('address')}
            returnKeyType={'next'}
            onSubmitEditing={() => {
              this.onAddressSearch(this.state.address);
            }}
            blurOnSubmit={true}
          />
          <MapView
            ref={(ref) => (this.mapRef = ref)}
            provider={PROVIDER_GOOGLE}
            style={styles.mapViewStyle}
            onPress={(e) => {
              this.onMapSelect(
                e.nativeEvent.coordinate.latitude,
                e.nativeEvent.coordinate.longitude,
              );
            }}
            zoomEnabled={true}
            zoomControlEnabled={true}
            initialRegion={{
              latitudeDelta: this.state.latitudeDelta,
              longitudeDelta: this.state.longitudeDelta,
              latitude: parseFloat(this.state.latitude),
              longitude: parseFloat(this.state.longitude),
            }}
            // region={{
            //   latitude: parseFloat(this.state.latitude),
            //   longitude: parseFloat(this.state.longitude),
            // }}
          >
            <Marker
              draggable
              onDragEnd={(e) =>
                this.onMapSelect(
                  e.nativeEvent.coordinate.latitude,
                  e.nativeEvent.coordinate.longitude,
                )
              }
              coordinate={{
                latitude: parseFloat(this.state.latitude),
                longitude: parseFloat(this.state.longitude),
              }}
              // image={require("../../assets/Images /logos.png")}
            />
          </MapView>
          <CustomButton
            btnTxt={config.I18N.t('changeLocation')}
            onPress={() => {
              this.verifyData();
            }}
            containerStyle={styles.btnStyle}
          />
        </View>
      </View>
    );
  }
}
