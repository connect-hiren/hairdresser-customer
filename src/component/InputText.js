import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Platform,
} from 'react-native';
import config from '../config';

export default class InputText extends React.Component {
  constructor(props) {
    super(props);
    this.state ={ focused: false}
  }
  render() {
    
    const { focused } = this.state
    const {
      containerStyle,
      value,
      onChangeText,
      placeholder,
      keyboardType,
      editable,
      multiline,
      onRef,
      returnKeyType,
      onSubmitEditing,
      blurOnSubmit,
      maxLength,
      textAlignVertical,
      errorMsg,
      secureText,
      containerInputStyle,
      onEndEditing
    } = this.props;
    return (
      <View style={{width: '100%', alignItems: 'center', ...containerStyle}}>
        <View style={[styles.container,{...containerInputStyle, flexDirection: 'row'}]}>
          <TextInput
            {...this.props}
            style={{flex:1, textAlign: config.I18N.locale == 'ar' ? 'right' : 'left'}}
            value={value}
            keyboardType={!!keyboardType ? keyboardType : 'default'}
            defaultValue={value}
            placeholderTextColor={config.Constant.COLOR_LIGHT_GREY}
            onChangeText={onChangeText}
            editable={editable != undefined ? editable : true}
            placeholder={placeholder}
            multiline={!!multiline ? multiline : false}
            ref={!!onRef && onRef}
            returnKeyType={!!returnKeyType ? returnKeyType : 'done'}
            onSubmitEditing={!!onSubmitEditing ? onSubmitEditing : () => {}}
            blurOnSubmit={!!blurOnSubmit ? blurOnSubmit : false}
            maxLength={maxLength}
            onEndEditing={!!onEndEditing?onEndEditing:()=>{}}
            pointerEvents={
              editable != undefined && editable == false ? 'none' : 'auto'
            }
            textAlignVertical={!!textAlignVertical ? textAlignVertical : 'center'}
            secureTextEntry={
              Platform.OS == 'ios'
                ? !!secureText
                : value.length > 0 && !!secureText
                ? true
                : false
            }
            // onFocus={()=> this.setState({focused:true})}
            // onBlur={()=> this.setState({focused:false})}
          />
        {false && focused &&
                 <TouchableOpacity style={styles.doneWrap}>
                    <Text style={styles.doneBtnStyle}>{config.I18N.t('Done')}</Text>
                </TouchableOpacity>
        }
        </View>
        {!!errorMsg && <Text style={styles.errorMsgStyle}>{errorMsg}</Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: config.Constant.COLOR_INPUT,
    borderRadius: 20,
    borderColor: config.Constant.COLOR_INPUT,
    borderWidth: 1,
    shadowColor: config.Constant.COLOR_TRANSPARENT,
    fontSize: 18,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowRadius: 6,
    shadowOpacity: 1,
    elevation: 0,
    fontFamily: config.Constant.Font_Regular,
    width: '100%',
    textAlign: config.Constant.isRTL ? 'right' : 'left',
    color: config.Constant.COLOR_BLACK,
    minHeight:45
  },
  txtStyle: {
    fontFamily: config.Constant.Font_Regular,
    color: config.Constant.COLOR_BLACK,
  },
  leftimg: {width: 10, height: 10, marginRight: 5},
  rightimg: {width: 10, height: 10},
  errorMsgStyle: {
    width: '100%',
    marginTop: 5,
    textAlign: 'left',
    paddingLeft: 10,
    fontSize: 15,
    fontFamily: config.Constant.Font_Roboto_Italic,
    color: '#FF0000',
  },
  doneWrap: { 
    alignSelf:'center',
  },
  doneBtnStyle:{
      fontSize: 14,
      fontFamily: config.Constant.Font_Medium,
      textAlign: config.Constant.isRTL ? 'right' : 'left',
    
  },
});
