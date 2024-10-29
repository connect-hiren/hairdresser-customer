import 'react-native-gesture-handler';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';
import RootComponent from './src/component/RootComponent';
import {Provider} from 'react-redux';
import {persistStore} from 'redux-persist';

import {PersistGate} from 'redux-persist/lib/integration/react';
import MainNavigator from './src/navigator/MainNavigator';
import Store from './src/Redux/store';
import './shim.js';
import {Text, TextInput} from 'react-native';


export default class App extends React.Component {
  persistor = persistStore(Store);

  componentDidMount() {
    // Override Text scaling
    if (Text.defaultProps) {
      Text.defaultProps.allowFontScaling = false;
    } else {
      Text.defaultProps = {};
      Text.defaultProps.allowFontScaling = false;
    }

    // Override Text scaling in input fields
    if (TextInput.defaultProps) {
      TextInput.defaultProps.allowFontScaling = false;
    } else {
      TextInput.defaultProps = {};
      TextInput.defaultProps.allowFontScaling = false;
    }
  }

  render() {
    return (
      <Provider store={Store}>
        <PersistGate persistor={this.persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>

          <RootComponent>
            <MainNavigator />
          </RootComponent>
          </GestureHandlerRootView>
        </PersistGate>
      </Provider>
    );
  }
}
