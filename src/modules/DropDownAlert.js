import {Alert} from 'react-native';
import config from '../config';
import modules from './index';

var dropDownAlert = '';

const setDropDownRef = (ref) => {
  dropDownAlert = ref;
};

const showAlert = (
  type,
  title,
  message,
  data,
  duration,
  callBack,
  cancelBtnTxt = '',
) => {
  if (type === 'custom') {
    dropDownAlert.alertWithType(type, title, message, data, duration);
  } else {
    if (type == 'error') {
      //Alert.alert(config.I18N.t('error'),message)
      modules.ErrorAlert.getRef({
        title: config.I18N.t('error'),
        message: message,
        negativeBtnTxt: !!cancelBtnTxt ? cancelBtnTxt : '',
        positiveBtnTxt: '',
        extraData: {},
        onPressPositiveBtn: async (data, pressOK) => {
          !!callBack ? callBack() : () => {};
          if (pressOK) {
            //this.updateData(false);
          }
        },
      });
    } else {
      dropDownAlert.alertWithType(type, title, message);
    }
  }
};

export default {
  setDropDownRef,
  showAlert,
};
