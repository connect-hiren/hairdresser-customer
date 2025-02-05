import { StyleSheet } from 'react-native';
import config from '../../config';
import { getStatusBarHeight } from '../../Util/Utilities';

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
    transform: [{ rotate: config.Constant.isRTL ? '180deg' : '0deg' }],
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
    width: '70%',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 10,
    flex: 1,
    justifyContent: 'center',
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
    marginVertical: 15,
  },
  inputStyle: { width: '100%', marginVertical: 5 },
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
  fontStyleNew: {
    fontFamily: config.Constant.Font_Semi_Bold,
    fontSize: 16,
    color: config.Constant.COLOR_BLACK,
    letterSpacing: 0.98,
    marginRight: 15,
    marginBottom: 5,
    flex: 0.5,
    textAlign: 'left',
    marginLeft: 20,
  },
  fontStyleCenterNew: {
    fontFamily: config.Constant.Font_Semi_Bold,
    fontSize: 16,
    color: config.Constant.COLOR_BLACK,
    letterSpacing: 0.98,
    marginRight: 15,
    marginBottom: 5,
    width: 10,
  },
  fontStyleEndNew: {
    fontFamily: config.Constant.Font_Semi_Bold,
    fontSize: 16,
    color: config.Constant.COLOR_BLACK,
    letterSpacing: 0.98,
    marginRight: 15,
    marginBottom: 5,
    flex: 1,
  },

  headerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  headerBorderStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 60,
    alignSelf: 'flex-start',
    marginBottom: 20,
    marginTop: 5,
    marginLeft: config.Constant.SCREEN_WIDTH * 0.05,
    borderBottomWidth: 1.5,
    borderBottomColor: config.Constant.COLOR_TAB,
  },
  descStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 15,
    backgroundColor: config.Constant.COLOR_LIGHT_BG,
    borderRadius: 100,
  },
  descTitle: {
    fontSize: 19,
    fontFamily: config.Constant.Font_Medium,
    color: config.Constant.COLOR_BLACK,
    textAlign: 'left',
    flex: 1,
    marginTop: 10,
  },
  qtyTitle: {
    fontSize: 19,
    fontFamily: config.Constant.Font_Semi_Bold,
    color: config.Constant.COLOR_BLACK,
    textAlign: 'center',
    width: 80,
  },
  priceTitle: {
    fontSize: 19,
    fontFamily: config.Constant.Font_Semi_Bold,
    color: config.Constant.COLOR_BLACK,
    textAlign: 'right',
    width: 70,
  },
  mapBox: {
    borderRadius: 20,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  methodName: {
    fontFamily: config.Constant.Font_Regular,
    fontSize: 16,
    color: config.Constant.COLOR_BLACK,
    flex: 1,
    textAlign: 'left',
    letterSpacing: 0.98,
  },
  selectedItemsViewMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
    alignItems: 'center',
  },
  emptyIconMethod: {
    borderRadius: 30,
    borderWidth: 3,
    height: 20,
    width: 20,
    borderColor: '#0000000F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filledIconMethod: {
    borderRadius: 30,
    borderWidth: 0,
    height: 14,
    width: 14,
    backgroundColor: config.Constant.COLOR_TAB,
  },

  deleteBtn:
    { width: '85%', marginTop: 20, marginBottom: 15, alignSelf: "center" },

});
