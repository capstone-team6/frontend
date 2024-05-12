import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Antdesign from 'react-native-vector-icons/AntDesign'
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/Type';
import ChargePay from './ChargePay';
import { useNavigation } from '@react-navigation/native';

type PlusNav=StackNavigationProp<RootStackParamList,'ChargePay'>
type Miuns=StackNavigationProp<RootStackParamList,'MinusPay'>
const Pay=()=> {
    const plusNav=useNavigation<PlusNav>()
    const minusNav=useNavigation<Miuns>()
    const goToPlus=()=>{
        plusNav.navigate('ChargePay')
    }
    const goToMinus=()=>{
        minusNav.navigate('MinusPay')
    }
    return (
        <View style={styles.container}>
            
        <View style={styles.options}>
            <TouchableOpacity style={styles.options_detail} onPress={goToPlus}>
                <MaterialCommunityIcons name='credit-card-plus' size={40} color='black'/>
                <Text style={{fontFamily:'NanumGothic-Bold', color:'#313131', fontSize:16, marginRight:45}}>충전하기</Text>
                <Antdesign name='right' size={15}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options_detail} onPress={goToMinus}>
                <MaterialCommunityIcons name='credit-card-minus' size={40} color='black'/>
                <Text style={{fontFamily:'NanumGothic-Bold' , color:'#313131', fontSize:16, marginRight:45}}>인출하기</Text>
                <Antdesign name='right' size={15}/>
            </TouchableOpacity>
        </View>
    </View>
    );
}
const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',

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
export default Pay;