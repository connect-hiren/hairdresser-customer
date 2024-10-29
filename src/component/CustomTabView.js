import * as React from 'react';
import {View, StyleSheet, Dimensions, Text, StatusBar} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import config from '../config';

const initialLayout = {width: Dimensions.get('window').width};

export default function CustTabView({
  navigation,
  firstscreen,
  seconscreen,
  thirdscreen,
}) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: config.I18N.t('services')},
    {key: 'second', title: config.I18N.t('reviews')},
    {key: 'third', title: config.I18N.t('about')},
  ]);
  const FirstRoute = () => firstscreen;
  const SecondRoute = () => seconscreen;
  const ThirdRoute = () => thirdscreen;
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicatorStyle}
      style={styles.sceneContainerStyles}
      renderLabel={({route, focused, color}) => (<Text style={focused ? styles.renderLabelStyles : styles.renderLabelStyles1}>{route.title}</Text>)}
    />
  );
  console.log("selected Tab ", index )
  return (
    
    <TabView
      navigationState={{index, routes}}
      renderScene={SceneMap({
        first: FirstRoute,
        second: SecondRoute,
        third: ThirdRoute,
      })}
      style={{
        shadowOffset: {height: 0, width: 0},
        shadowColor: 'transparent',
        shadowOpacity: 0,
        elevation: 0,
      }}
      onIndexChange={setIndex}
      renderTabBar={renderTabBar}
      initialLayout={initialLayout}
    />
  );
}

const styles = StyleSheet.create({
  scene: {
    backgroundColor: config.Constant.COLOR_WHITE,
    flex: 1,
  },

  sceneContainerStyles: {
    backgroundColor: config.Constant.COLOR_WHITE,
    borderWidth: 0,
    borderBottomColor: config.Constant.COLOR_GREY,
    shadowOffset: {height: 0, width: 0},
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  indicatorStyle: {
    backgroundColor: config.Constant.COLOR_TAB,
    borderWidth: 1.5,
    borderColor: config.Constant.COLOR_TAB,
    borderRadius: 20,
    width: '25%',
    alignSelf: 'center',
    marginLeft: config.Constant.SCREEN_WIDTH * 0.04,
  },
  renderLabelStyles: {
    color: config.Constant.COLOR_TAB,
    fontSize: 16,
    fontFamily: config.Constant.Font_Regular,
  },
  renderLabelStyles1: {
    color: config.Constant.COLOR_DARK_GREY,
    fontSize: 16,
    fontFamily: config.Constant.Font_Regular,
  },
});
