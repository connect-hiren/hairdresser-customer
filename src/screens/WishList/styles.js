import {Platform, StyleSheet} from 'react-native';
import config from '../../config';
import {getStatusBarHeight} from '../../Util/Utilities';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',

    backgroundColor: config.Constant.COLOR_WHITE,
  },
  rowContainer: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: getStatusBarHeight(),
    paddingBottom: 15,
    paddingHorizontal: config.Constant.SCREEN_WIDTH * 0.05,
    backgroundColor: 'white',
    shadowColor: config.Constant.COLOR_GREY,
    shadowOffset: {
      width: 0.5,
      height: 0.5,
    },
    shadowRadius: 0.5,
    shadowOpacity: 0.4,
    elevation: 2,
    marginBottom: 5,
  },
  smallIcon: {
    width: 20,
    height: 20,
  },
  headerTitle: {
    fontFamily: config.Constant.Font_Bold,
    fontSize: 18,
    color: config.Constant.COLOR_BLACK,
    textAlign: 'center',
    letterSpacing: 1.26,
    alignSelf: 'center',
  },
  wishListView: {
    width: config.Constant.SCREEN_WIDTH * 0.425,
    alignSelf: 'center',
    marginBottom: config.Constant.SCREEN_WIDTH * 0.045,
  },
  rowViewBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  userName: {
    fontFamily: config.Constant.Font_Bold,
    fontSize: 16,
    color: config.Constant.COLOR_BLACK,
    letterSpacing: 0.98,
    textAlign: 'left',
    marginBottom: 0,
  },
  rowKm: {
    fontFamily: config.Constant.Font_Regular,
    fontSize: 13,
    color: config.Constant.COLOR_LIGHT_GREY,
    letterSpacing: 0,
    flex: 1,
    paddingHorizontal: 10,
  },
  rowRating: {
    fontFamily: config.Constant.Font_Regular,
    fontSize: 13,
    color: config.Constant.COLOR_YELLOW,
    letterSpacing: 0,
    marginLeft: 5,
    marginBottom:Platform.OS=='ios'?0: -2
  },
  bannerImg: {
    width: '100%',
    height: config.Constant.SCREEN_WIDTH * 0.4,
    borderRadius: 10,
  },
  heartIconView: {
    position: 'absolute',
    zIndex: 1,
    bottom: -25,
    right: 0,
    height: 50,
    width: 50,
    justifyContent:'center',alignItems:'center'
  },
  heartIcon: {
    height: 30,
    width: 30,
  },
  emptyString: {
    fontFamily: config.Constant.Font_Roboto_Italic,
    fontSize: 18,
    width: config.Constant.SCREEN_WIDTH * 0.8,
    textAlign:'center',
    alignSelf:'center',
    color: config.Constant.COLOR_DARK_GREY,
  },
});
