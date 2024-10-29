//Global imports
import { StyleSheet } from 'react-native';
import config from '../../config';
import { Dimensions } from 'react-native';
// import { Cairo_BOLD, Cairo_MEDIUM, Cairo_REGULAR, Cairo_SEMIBOLD, POPPINS_BOLD, POPPINS_MEDIUM, POPPINS_REGULAR, POPPINS_SEMIBOLD, RALEWAY_MEDIUM, RALEWAY_SEMIBOLD } from '../../Assets/Fonts';

//File imports
// import { COLORS } from '../../Utility/Colors';
// import { Sizes } from '../../Utility/Sizes';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: config.Constant.COLOR_WHITE
    },

    devider: {
        // height: 1,
        // width: '100%',
        // backgroundColor: COLORS.Secondary10
    },

    couponSection: {
        padding: 20,
        borderWidth: 1,
        borderColor: config.Constant.COLOR_BORDER_COLOR,
        width: '90%',
        alignSelf: 'center',
        borderRadius: 10,
        marginBottom: 10
    },

    coupontitle: {
        // flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'space-between'
    },

    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    discountIcon: {
        // height: Sizes._20,
        // width: Sizes._20
    },

    applyText: {
        // fontFamily: Cairo_MEDIUM,
        // fontSize: Sizes._16,
        // color: COLORS.Neutral,
        // marginLeft: Sizes._10
    },

    couponInputSection: {
        // height: Sizes._40,
        // flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'space-between',
        // marginTop: Sizes._20
    },

    inputStyle: {
        // height: Sizes._40,
        // paddingHorizontal: Sizes._20,
        // width: '60%',
        // backgroundColor: COLORS.Primary10,
        // borderRadius: Sizes._20,
        // fontFamily: Cairo_REGULAR,
        // fontSize: Sizes._11,
        // color: COLORS.Secondary
    },

    applyBtnContainer: {
        // height: Sizes._40,
        // width: '35%',
        // borderRadius: Sizes._20,
        // backgroundColor: COLORS.Primary,
        // justifyContent: 'center',
        // alignItems: 'center'
    },

    applyTextStyle: {
        // fontFamily: Cairo_SEMIBOLD,
        // fontSize: Sizes._15,
        // color: COLORS.Fourth
    },

    subTotalText: {
        fontFamily: config.Constant.Font_Regular,
        fontSize: 14,
        color: config.Constant.COLOR_GREY,
        textAlign: 'left'
    },

    totalPrice: {
        fontFamily: config.Constant.Font_Bold,
        fontSize: 16,
        color: config.Constant.COLOR_LIGHT_GREY,
        textAlign: 'left'
    },

    totalPriceText: {
        // fontFamily: Cairo_SEMIBOLD,
        // fontSize: Sizes._16,
        // color: COLORS.Primary
    },

    circleSection: {
        height: 24,
        width: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: config.Constant.COLOR_PRIMARY,
        borderRadius: 12
    },

    innerSection: {
        height: 14,
        width: 14,
        backgroundColor: config.Constant.COLOR_PRIMARY,
        borderRadius: 8
    },

    paymentText: {
        fontFamily: config.Constant.Font_Medium,
        fontSize: 14,
        color: config.Constant.COLOR_PRIMARY,
        textAlign: 'left',
        marginLeft: 10
    },
    applyStyle: {
        // width:Dimensions.get("window").width-48,
        width:Dimensions.get("window").width-48,
        justifyContent:"center",
        alignItems:"center",
        alignSelf:"center",
        marginHorizontal:24,
        marginTop:16
    },
    emptySection: {
        // height: Sizes.FindSize(120),
        // justifyContent: 'center',
        // alignItems: 'center'
    },

    emptyAddressText: {
        // fontFamily: Cairo_REGULAR,
        // color: COLORS.BodyTextColor,
        // textAlign: 'center',
        // width: '70%'
    },

    addButton: {
        // height: Sizes._40,
        // paddingHorizontal: Sizes._20,
        // backgroundColor: COLORS.Primary,
        // justifyContent: 'center',
        // alignItems: 'center',
        // borderRadius: Sizes._10
    },

    addText: {
        // fontFamily: Cairo_MEDIUM,
        // fontSize: Sizes._12,
        // color: COLORS.Fourth
    },

    mobileHeading: {
        // fontFamily: Cairo_REGULAR,
        // color: COLORS.BodyTextColor,
        // fontSize: Sizes._14,
        // textAlign: 'left'
    },

    rowFlex: {
        // flexDirection: 'row',
        // alignItems: 'center',
        // backgroundColor: COLORS.Primary10,
        // height: Sizes._45,
        // borderRadius: Sizes._15,
        // marginVertical: Sizes._10,
        // paddingHorizontal: Sizes._20,
        // justifyContent: 'space-between'
    },

    countryText: {
        // fontFamily: Cairo_REGULAR,
        // color: COLORS.TextColor,
        // fontSize: Sizes._14,
        // textAlign: 'left'
    },

    downArrow: {
        // height: Sizes._12,
        // width: Sizes._12
    },

    countryText: {
        // fontFamily: Cairo_REGULAR,
        // color: COLORS.TextColor,
        // fontSize: Sizes._14,
        // textAlign: 'left'
    },

    drowDownContainer: {
        // paddingHorizontal: Sizes._20,
        // marginTop: Sizes._20,
        // backgroundColor: COLORS.Primary10,
        // borderRadius: Sizes._10
    },

    dropDownItem: {
        // fontFamily: Cairo_REGULAR,
        // fontSize: Sizes._12,
        // color: COLORS.Secondary,
        // textAlign: 'left'
    },

    countryItem: {
        // height: Sizes._40,
        // justifyContent: 'center',
    },

    countryItemName: {
        // fontFamily: Cairo_MEDIUM,
        // color: COLORS.BodyTextColor,
        // fontSize: Sizes._14,
        // textAlign: 'left'
    },

    errorText: {
        // fontFamily: Cairo_REGULAR,
        // fontSize: Sizes._12,
        // color: COLORS.Error,
        // marginTop: Sizes._8,
        // textAlign: 'left'
    },

    callingView : {
        // height : '100%',
        // width : Sizes.FindSize(67),
        // backgroundColor : COLORS.Primary10,
        // borderRadius : Sizes._15,
        // justifyContent:'center',
        // alignItems:'center'
    },

    callingCode :{
        // fontFamily : Cairo_MEDIUM,
        // color : COLORS.TextColor,
        // fontSize : Sizes.FindSize(14)
    },

    mobileInput : {
        // height : '100%',
        // width : '75%',
        // paddingHorizontal : Sizes._20,
    },

    emptyText : {
        // fontFamily : Cairo_REGULAR,
        // fontSize : Sizes._14,
        // color: COLORS.BodyTextColor
    }

})