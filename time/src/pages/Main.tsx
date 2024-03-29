
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Text, View ,StyleSheet, Dimensions} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Octicons from 'react-native-vector-icons/Octicons'

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
        
    }
})
export default Main;

