import React from 'react';
import { View,StyleSheet,Image ,Text, Button, TouchableOpacity, Pressable} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Antdesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack';
import Profile from './Profile';
import { RootStackParamList} from '../../types/Type';


type MypageNavigationProp=StackNavigationProp<RootStackParamList,'Setting'>

const Setting: React.FC=()=> {
    const navigation=useNavigation<MypageNavigationProp>()
    const goToLogout = () => {
        navigation.navigate('Logout');
    }

    const goToDeleteMem = () => {
        navigation.navigate('DeleteMem');
    }

    return (
        <View style={styles.container}>
            
            <View style={styles.options}>
                <TouchableOpacity style={styles.options_detail} onPress={goToLogout}>
                    <MaterialCommunityIcons name='logout' size={40} color='black'/>
                    <Text style={{fontFamily:'NanumGothic-Bold', color:'#313131', fontSize:16, marginRight:45}}>로그아웃</Text>
                    <Antdesign name='right' size={15}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.options_detail} onPress={goToDeleteMem}>
                    <Antdesign name='deleteuser' size={40} color='black'/>
                    <Text style={{fontFamily:'NanumGothic-Bold' , color:'#313131', fontSize:16, marginRight:45}}>회원 탈퇴</Text>
                    <Antdesign name='right' size={15}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white'
    },
    profile:{
        paddingTop:15,
        margin:10,
        flexDirection:'row',
        justifyContent:'flex-start'

    },
    profile_button:{
        width:80,
        height:30,
        backgroundColor:'white',
        borderRadius:5,
        borderColor:'gray',
        borderWidth:1,
        marginLeft:100,
        marginTop:23,
        
    },
    buttonText:{
        marginTop:3,
        color:'black',
        textAlign:'center'
    },
    options:{
        flexDirection:'column',
        alignItems:'center',
        marginTop:30,
    },
    options_detail:{
        flexDirection:'row',
        borderColor:'gray',
        borderWidth:0.5,
        width:300,
        height:80,
        margin:5,
        justifyContent:'space-around',
        alignItems:'center',
        borderRadius:7,
    }
})

export default Setting;