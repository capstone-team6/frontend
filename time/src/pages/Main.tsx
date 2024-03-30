import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Text, View ,StyleSheet, Dimensions} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import StackNavigator from '../navigation/StackNavigator';
import Octicons from 'react-native-vector-icons/Octicons'
import Svg, { Circle,Rect } from 'react-native-svg';

function Main() {
    return (
        <View style={styles.main_container}>
            <View style={styles.location}>
                <Text style={styles.location_text}>경기도 용인시 처인구 명지대</Text>
                <AntDesign name='caretdown' size={13} style={styles.down_icon}/>
            </View>
            
            <View style={styles.options}>
                <Text style={styles.option1}>구매글</Text>
                <Text style={styles.option2}>판매글</Text>
            </View>
            <View>
                <View style={styles.options_line}></View>
            </View>

            <Svg style={styles.sections}>
                <Rect x="10" y="1" width='73' height='40' fill="#E8EAEC" rx='20' ry='20' />
                <Rect x="90" y="1" width='73' height='40' fill="#E8EAEC" rx='20' ry='20' />
                <Rect x="170" y="1" width='73' height='40' fill="#E8EAEC" rx='20' ry='20' />
                <Rect x="250" y="1" width='73' height='40' fill="#E8EAEC" rx='20' ry='20' />
                <Rect x="330" y="1" width='73' height='40' fill="#E8EAEC" rx='20' ry='20' />
                <View style={styles.section_text}>
                    <Text style={{ position: 'absolute', top: 12, left: 33 , fontFamily:'NanumGothic-Bold'}}>재능</Text>
                    <Text style={{ position: 'absolute', top: 12, left: 114  , fontFamily:'NanumGothic-Bold' }}>운동</Text>
                    <Text style={{ position: 'absolute', top: 12, left: 187  , fontFamily:'NanumGothic-Bold'}}>심부름</Text>
                    <Text style={{ position: 'absolute', top: 12, left: 274  , fontFamily:'NanumGothic-Bold'}}>기타</Text>
                </View>
            </Svg>
            

        </View>
    );
}

const styles=StyleSheet.create({
    main_container:{
        height:Dimensions.get('screen').height,
        backgroundColor:'white',
        flex:1,
    },
    location:{
        flexDirection:'row',
        margin:23,
    },
    location_text:{
        fontFamily:'NanumGothic-Bold',
        fontSize:15
    },
    down_icon:{
        marginLeft:6,
        color:'black'
    },
    options:{
        
        flexDirection:'row',
        justifyContent:'space-around',
        marginTop:20
    },
    option1:{
        color:'black',
        fontFamily:'NanumGothic-Bold',
        fontSize:15
    },
    option2:{
        color:'black',
        fontFamily:'NanumGothic-Bold',
        fontSize:15
    },
    options_line:{
        borderBottomWidth:2,
        margin:20,
        marginEnd: Dimensions.get('screen').width /1.8,
        
    },
    sections:{
        flexDirection:'row',
        marginHorizontal:10
    },
    section_text:{
        flexDirection:'row',
    }
})
export default Main;