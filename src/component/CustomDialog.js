import React from 'react';
import {StyleSheet, TouchableOpacity, Image, Text} from 'react-native';
import config from '../config';
import Dialog, {SlideAnimation, DialogContent} from 'react-native-popup-dialog';

export default class CustDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {currInd: 0};
  }

  render() {
    const {visible, onPressClose, containerStyle, container1} = this.props;
    return (
      <Dialog
        visible={visible}
        onTouchOutside={onPressClose}
        width={1}
        overlayOpacity={0.9}
        overlayBackgroundColor={'white'}
        dialogAnimation={
          new SlideAnimation({
            slideFrom: 'bottom',
          })
        }
        containerStyle={[{justifyContent: 'center'}, {...containerStyle}]}
        dialogStyle={styles.dialogStyle}>
        <DialogContent style={[styles.dialogContent, {...container1}]}>
          {this.props.children}
        </DialogContent>
      </Dialog>
    );
  }
}

const styles = StyleSheet.create({
  dialogStyle: {
    backgroundColor: config.Constant.COLOR_TRANSPARENT,
    borderRadius: 0,
    maxHeight: config.Constant.SCREEN_HEIGHT * 0.8,
    paddingVertical: 10,

  },
  dialogContent: {
    backgroundColor: config.Constant.COLOR_WHITE,
    paddingBottom: 40,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 30,
    paddingBottom: 10,
    shadowColor: config.Constant.COLOR_BLACK,
    shadowOffset: {
      width: 0.5,
      height: 0.5,
    },
    shadowRadius: 5,
    shadowOpacity: 0.3,
    elevation: 5,
  },
});
