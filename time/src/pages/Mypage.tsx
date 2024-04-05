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


type MypageNavigationProp=StackNavigationProp<RootStackParamList,'Mypage'>

const Mypage: React.FC=()=> {
    const navigation=useNavigation<MypageNavigationProp>()
    const goToProfile = () => {
        navigation.navigate('Profile');
    }

    const goToMyBuyTime = () => {
        navigation.navigate('MyBuyTime');
    }

    const goToMySellTime=()=>{
        navigation.navigate('MySellTime')
    }
    const goToNotify = () => {
        navigation.navigate('Notify');
    }
    const goToPay = () => {
        navigation.navigate('Pay');
    }
    const goToAppeal=()=>{
        navigation.navigate('Appeal')
    }

    return (
        <View style={styles.container}>
            <View style={styles.profile}>
                <Image source={require('../assets/images/profile.png')}/>
                <Text style={{fontFamily:'NanumGothic-regular', fontSize:20, paddingTop:20, color:'black'}}>홍길동</Text>
                <TouchableOpacity style={styles.profile_button} onPress={goToProfile}>
                    <Text style={styles.buttonText} >프로필 보기</Text>
                </TouchableOpacity>
                {/* <Button title='프로필 보기' style={styles.profile_button}></Button> */}
            </View>
            <View style={styles.options}>
                <TouchableOpacity style={styles.options_detail} onPress={goToMyBuyTime}>
                    <MaterialCommunityIcons name='clock-plus' size={40} color='black'/>
                    <Text style={{fontFamily:'NanumGothic-Bold', color:'#313131', fontSize:16, marginRight:45}}>내가 구매한 시간</Text>
                    <Antdesign name='right' size={15}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.options_detail} onPress={goToMySellTime}>
                    <MaterialCommunityIcons name='clock-minus' size={40} color='black'/>
                    <Text style={{fontFamily:'NanumGothic-Bold' , color:'#313131', fontSize:16, marginRight:45}}>내가 판매한 시간</Text>
                    <Antdesign name='right' size={15}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.options_detail} onPress={goToNotify}>
                    <Entypo name='megaphone' size={40} color='black'/>
                    <Text style={{fontFamily:'NanumGothic-Bold' , color:'#313131', fontSize:16, marginRight:45}}>공지사항</Text>
                    <Antdesign name='right' size={15}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.options_detail} onPress={goToPay}>
                    <Ionicons name='card' size={40} color='black'/>
                    <Text style={{fontFamily:'NanumGothic-Bold' , color:'#313131', fontSize:16, marginRight:45}}>틈새 페이</Text>
                    <Antdesign name='right' size={15}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.options_detail} onPress={goToAppeal}>
                    <FontAwesome6 name='pen-to-square' size={40} color='black'/>
                    <Text style={{fontFamily:'NanumGothic-Bold' , color:'#313131', fontSize:16, marginRight:45}}>이의 신청</Text>
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

export default Mypage;