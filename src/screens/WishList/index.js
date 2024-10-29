import React from 'react';
import {
  RefreshControl,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  BackHandler,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Ripple from 'react-native-material-ripple';
import CustomButton from '../../component/CustomButton';
import CustomHeader from '../../component/CustomHeader';
import config from '../../config';
import {getRoundOf} from '../../Util/Utilities';
import styles from './styles';

export default class WishList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageUdate: true,
      emptyList: '',
      is_load: false,
      dataArr: [],
      isFetching: false,
    };
  }
  componentDidMount = () => {
    this.props.navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
      this.getWishlist();
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
  onRefresh() {
    this.setState({isFetching: true}, () => {
      this.getWishlist();
    });
  }
  getWishlist = async () => {
    const formData = new FormData();
    formData.append('latitude', config.Constant.USER_DATA.latitude);
    formData.append('longitude', config.Constant.USER_DATA.longitude);
    if (!this.state.is_load) {
      config.Constant.showLoader.showLoader();
      setTimeout(() => {
        this.setState({
          emptyList: config.I18N.t('noFavorites'),
        });
      }, 10000);
    }

    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.FAVORITE_DRESSER_LIST,
      formData,
    );
    this.setState({
      emptyList: config.I18N.t('noFavorites'),
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
  changeFavData = async (dataSource, index) => {
    if (!!dataSource && !!dataSource.id) {
      const formData = new FormData();
      formData.append('hairdressor_id', dataSource.id);
      formData.append('type', 0);
      config.Constant.showLoader.showLoader();
      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.USER_FAVORITE,
        formData,
      );

      config.Constant.showLoader.hideLoader();
      if (data?.status_code == 200) {
        var dataArr = this.state.dataArr;
        dataArr.splice(index, 1);
        this.setState({
          dataArr,
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
  renderItem = ({item, index}) => {
    console.log(JSON.stringify(item))
    return (
      <TouchableOpacity
        activeOpacit={0.8}
        onPress={() => {
          this.props.navigation.navigate('VendorView', {
            user_id: item.id,
            dataSource: { ...item, favorite_count:'1'},
          });
        }}
        style={styles.wishListView}>
        <View style={{marginBottom: 10}}>
          <FastImage
            resizeMode={'cover'}
            style={styles.bannerImg}
            source={
              !!item && !!item.image
                ? {
                    uri: config.Constant.UsersProfile_Url + '' + item.image,
                  }
                : require('../../assets/images/male.png')
            }
          />
          <TouchableOpacity
            style={styles.heartIconView}
            onPress={() => {
              this.changeFavData(item, index);
            }}>
            <Image
              source={require('../../assets/images/likeFilled.png')}
              resizeMode={'contain'}
              style={styles.heartIcon}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{item.name}</Text>
        <View style={styles.rowViewBottom}>
          {item.is_online == '1' && (
            <Image
              style={{width: 10, height: 10}}
              resizeMode={'contain'}
              source={require('../../assets/images/OnlineStatus.png')}
            />
          )}
          <Text style={styles.rowKm}>
            {getRoundOf(item.distance)} KM {config.I18N.t('away')}
          </Text>

          {!!item.avg_rating && (
              <Image
                styles={{width: 10, height: 10, marginTop: 0}}
                resizeMode={'contain'}
                source={require('../../assets/images/star.png')}
              />
            )}
          <Text style={styles.rowRating}>
            {!!item.avg_rating &&
            item.avg_rating.length > 0 &&
            !!item.avg_rating[0].avg_rating
              ? item.avg_rating[0].avg_rating
              : '4'}
          </Text>
        </View>
      </TouchableOpacity>
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

        <CustomHeader txtStyle={config.I18N.t('wishlist')} />
        {this.state.dataArr.length > 0 ? (
          <FlatList
            numColumns={2}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={this.state.dataArr}
            extraData={this.state}
            style={{
              width: '90%',
              alignSelf: 'center',
              marginTop: config.Constant.SCREEN_WIDTH * 0.045,
            }}
            refreshControl={
              <RefreshControl
                tintColor={config.Constant.COLOR_TAB}
                titleColor={config.Constant.COLOR_TAB}
                colors={[config.Constant.COLOR_TAB]}
                refreshing={this.state.isFetching}
                onRefresh={() => this.onRefresh()}
              />
            }
            columnWrapperStyle={{justifyContent: 'space-between'}}
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
