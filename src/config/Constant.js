import {Dimensions, Platform, I18nManager} from 'react-native';
import Config from "react-native-config";

// const URL = `https://carcare.dc.net.sa/`
const URL = Config.API_URL


// API_SOCKET_URL = 'http://carcare.dc.net.sa:3001';
API_SOCKET_URL = Config.API_SOCKET_URL

// const URL = `https://quafere.hoabex.com/`
// API_SOCKET_URL = 'http://hoabex.com:3001';


// Base_Url = `https://carcare.dc.net.sa/api/v1/`;
// UsersProfile_Url = `https://carcare.dc.net.sa/user/`
// CAT_IMAGE_URL = `https://carcare.dc.net.sa/public/`
// BANNER_URL = `https://carcare.dc.net.sa/banner/`
// AdminBase_Url = ''

TERMS_AND_CONDITION_URL = `${URL}terms`
Base_Url = `${URL}api/v1/`;
UsersProfile_Url = `${URL}user/`
CAT_IMAGE_URL = `${URL}public/`
BANNER_URL = `${URL}banner/`
AdminBase_Url = ''




// API_SOCKET_URL = `https://carcare.dc.net.sa:3001`
export default Constant = {
  
  LATITUDE:0,
  LONGITUDE:0,
  ADDRESS: null,

  // app details
  APP_LINK_IOS: '',
  APP_LINK_ANDROID: '',

  //Upload Data
  uploadArray: [],
  settingData: [],

  //Chat page
  isChatOpen: false,

  FCM_TOKEN: '',

  //socket
  socket: null,

  //map key

  // MAP_KEY: 'AIzaSyAQbnvTvrQiWN5IUSLXOH2Wl_iVAH74Jsw', // OLD
  MAP_KEY: Config.MAP_KEY, //SET BY HIREN

  // color
  COLOR_PRIMARY: '#007BA4',
  COLOR_DARK_PRIMARY: '#b79665',
  COLOR_BTN: '#D31C4A',
  COLOR_BTN_LIGHT: '#FF2E82',
  COLOR_TRANSPARENT: 'rgba(0,0,0,0)',
  COLOR_BLACK: '#000',
  COLOR_GREEN: '#00B460',
  COLOR_RED: '#B43030',
  COLOR_LIGHT_GREEN: '#00C569',
  COLOR_INPUT: '#F6F6F6',
  COLOR_WHITE: '#fff',
  COLOR_BORDER_COLOR: '#F5F5F5',
  COLOR_TAB: '#E82565',
  COLOR_TXT_BOX: '#c99128',
  COLOR_LIGHT_GREY: '#777777',
  COLOR_EXTRA_LIGHT: '#AAAAAA',
  COLOR_ULTRA_LIGHT_GREY: '#F8F8F8',
  COLOR_GREY: '#A8A8A8',
  COLOR_DARK_GREY: '#373737',
  COLOR_LIGHT_BG: '#F6F6F6',
  COLOR_YELLOW: '#FCB900',
  COLOR_MONEY_GREEN: '#219804',
  COLOR_PINK_ROUND: '#D81E50',
  COLOR_LIGHT_BACKGROUND: '#FBFBFB',

  // fonts
  Font_Regular: 'Poppins-Regular',
  Font_Bold: 'Poppins-Bold',
  Font_Semi_Bold: 'Poppins-SemiBold',
  Font_Medium: 'Poppins-Medium',
  Font_LIGHT: 'Poppins-Light',
  Font_Italic_LIGHT: 'Poppins-LightItalic',
  Font_Roboto_Italic: 'Roboto-Italic',
  Font_Roboto_Light_Italic: 'Roboto-LightItalic',
  Font_Roboto_Bold: 'Roboto-Bold',

  // screen dimension
  SCREEN_WIDTH: Dimensions.get('screen').width,
  SCREEN_HEIGHT: Dimensions.get('screen').height,
  Base_Url: Base_Url,
  TERMS_AND_CONDITION_URL,
  UsersProfile_Url: UsersProfile_Url,
  CAT_IMAGE_URL: CAT_IMAGE_URL,
  BANNER_URL: BANNER_URL,
  API_SOCKET_URL: API_SOCKET_URL,
  isRTL: I18nManager.isRTL,
  //Socket

  USER_DATA: {
    token: '',
    order_id: undefined
  },
  RootNavigation: null,
  Route: undefined,
  showLoader: '',
  currency: Config.currency,
  timeout: Config.timeout,
  terminalId: Config.terminalId,
  password: Config.password,
  key: Config.key,
  requestUrl:Config.requestUrl,
  responseUrl: Config.responseUrl,

  ORDER_REQUEST: 1,
  ORDER_TIMEOUT: 2,
  ORDER_CANCEL: 3,
  ORDER_ACCEPT: 4,
  ORDER_ON_THE_WAY: 5,
  ORDER_PROCESSING: 6,
  ORDER_COMPLETE: 7,
  ORDER_REJECT: 8,
  ORDER_PAYMENT: 9,
  ORDER_PAID: 10,
  ORDER_OFFLINE: 11,
  ORDER_PAYMENT_TIMEOUT: 12,
  dresserAmountWithFee: (amount, per)=> amount/((100-per)/100)
};
