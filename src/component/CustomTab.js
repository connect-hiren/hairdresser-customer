import React from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect, useSelector } from 'react-redux';
import config from '../config';
import { isIphoneX } from '../Util/Utilities';
import 'react-native-gesture-handler';

const CustomTab = ({ state, navigation }) => {
    // console.log(routes, "bottom tab props");
    const { routes }= state
    const { userData } = useSelector((state) => ({
        userData: state.userData,
    }));

    function renderIcon(routeName) {
        if (routeName === 'ball') {
            return <FastImage
                resizeMode={'contain'}
                style={styles.iconStyle}
                source={require('../assets/images/bell.png')}
            />
        } else if (routeName === 'heart') {
            return (
                <FastImage
                    resizeMode={'contain'}
                    style={styles.iconStyle}
                    source={require('../assets/images/heart.png')}
                />
            );
        } else if (routeName === 'scissor') {
            return (
                <View style={styles.iconBack}>
                <FastImage
                    resizeMode={'contain'}
                    style={styles.iconBigStyle}
                    source={require('../assets/images/scissor.png')}
                />
                </View>
            );
        } else if (routeName === 'orders') {
            return (
                <FastImage
                    resizeMode={'contain'}
                    style={styles.iconStyle}
                    source={require('../assets/images/editProfile.png')}
                />
            );
        } else if (routeName === 'profile') {
            return (
                <FastImage
                    resizeMode={'contain'}
                    style={styles.iconStyle}
                    source={require('../assets/images/profile.png')}
                />
            );
        }
    }

    return (
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            shadowColor: config.Constant.COLOR_BLACK,
            height: Platform.OS == 'ios' ? (isIphoneX() ? 85 : 60) : 60,
            width: '100%',
            shadowOffset: {
                width: 10,
                height: 10,
            },
            elevation: 12,
            backgroundColor: config.Constant.COLOR_TAB,
            shadowRadius: 20,
            shadowOpacity: 1,
        }}>
            {
                routes.map((item, i) => {

                    return <TouchableOpacity
                        key={`item-${i}`}
                        style={{
                            height: '100%',
                            width: '20%',
                            justifyContent: 'center',
                            alignItems: "center"
                        }}
                        onPress={() => {
                            if (item.name != 'scissor') {
                                if (!!userData && !!userData.userData && !!userData.userData.id) {
                                    navigation.navigate(item.name);
                                } else {
                                    navigation.navigate('Login');
                                }
                            }
                            else {
                                // navigation.canGoBack() && navigation.popToTop();
                                const currentRoute = state.routes.find(route => route.name === state.routeNames[i]);
                                if (currentRoute?.state) 
                                  if (currentRoute.state.index !== 0) navigation.popToTop();
                                navigation.navigate(item.name)
                            }
                        }}
                    >
                        {renderIcon(item.name)}
                    </TouchableOpacity>
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    iconStyle: {
        width: 24,
        height: 24
    },
    iconBigStyle: {
        width: 50,
        height: 50
        
    },
    iconBack:{
        backgroundColor:config.Constant.COLOR_TAB,
                padding:4,
        borderRadius: 30,
        borderWidth:0.5,
        borderColor:config.Constant.COLOR_TAB,
        marginTop:-32   
    }
});


export default CustomTab;