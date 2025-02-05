import {StyleSheet} from 'react-native';
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
    paddingTop: getStatusBarHeight() + 5,
    paddingBottom: 15,
    paddingHorizontal: config.Constant.SCREEN_WIDTH * 0.05,
    backgroundColor: 'white',
    shadowColor: config.Constant.COLOR_GREY,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowRadius: 0.5,
    shadowOpacity: 0.4,
    elevation: 2,
  },
  smallIcon: {
    width: 20,
    height: 20,
    transform: [{rotate: config.Constant.isRTL ? '180deg' : '0deg'}],
  },
  headerTitle: {
    fontFamily: config.Constant.Font_Bold,
    fontSize: 18,
    color: config.Constant.COLOR_BLACK,
    textAlign: 'center',
    letterSpacing: 1.26,
    alignSelf: 'center',
  },
  profileIcon: {
    width: 130,
    height: 130,
    borderRadius: 100,
  },
  profileBorder: {
    width: 145,
    height: 145,
    borderColor: config.Constant.COLOR_PINK_ROUND,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: 40,
  },
  descriptionView: {
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    //marginTop: 30,
    flex: 1,
    //justifyContent: 'center',
  },
  rowView: {
    width: '70%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  fontStyle: {
    fontFamily: config.Constant.Font_Semi_Bold,
    fontSize: 16,
    color: config.Constant.COLOR_BLACK,
    letterSpacing: 0.98,
    marginRight: 15,
    marginBottom: 5,
  },
  appName: {
    fontFamily: config.Constant.Font_Semi_Bold,
    fontSize: 18,
    color: config.Constant.COLOR_BLACK,
    letterSpacing: 1.12,
    marginBottom: 5,
    alignSelf: 'center',
    marginVertical: 5,
  },
  inputStyle: {width: '100%', marginVertical: 5},
  emptyIcon: {
    borderRadius: 30,
    borderWidth: 0,
    height: 10,
    width: 10,
    borderColor: '#0000000F',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  filledIcon: {
    borderRadius: 30,
    borderWidth: 0,
    height: 10,
    width: 10,
    backgroundColor: config.Constant.COLOR_TAB,
  },
  selectedItemsView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'center',
    marginVertical: 5,
    alignItems: 'center',
    width: 200,
  },
  searchName: {
    fontFamily: config.Constant.Font_Regular,
    fontSize: 16,
    color: config.Constant.COLOR_BLACK,
    textAlign: 'left',
    letterSpacing: 1.12,
    paddingRight: 5,
  },
  floatCamera: {
    position: 'absolute',
    zIndex: 10,
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
  },
  btnStyle: {
    marginVertical: 20,
  },
  mapViewStyle: {
    width: config.Constant.SCREEN_WIDTH * 0.9,
    alignSelf: 'center',
    flex: 1,
    shadowColor: config.Constant.COLOR_GREY,
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowRadius: 20,
    shadowOpacity: 1,
    elevation: 21,
    borderRadius: 20,
  },
});
