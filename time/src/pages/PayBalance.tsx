import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RootStackParamList } from '../../types/Type';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

type Nav=StackNavigationProp<RootStackParamList,'PayBalance'>

const PayBalance = () => {
    const [nickname, setNickname]=useState<string>('')
    const [pay, setPay]=useState<number>(0)
    const navigation=useNavigation<Nav>()
    const goToCharge=()=>{
        navigation.navigate('ChargePay')
    }

    useEffect(()=>{
        AsyncStorage.getItem('accessToken').then(item=>{
            const token=item ? JSON.parse(item) : null;
            axios.get(`http://13.125.118.92:8080/member/profile`,{
                headers:{
                    Authorization: `Bearer ${token}`,
                }
            })
            .then(res=>{
                console.log(res.data.data)
                setNickname(res.data.data.nickname)
                setPay(res.data.data.timePay)
                
            })
            .catch(error=>{
                console.log(error)
            })
        })
    },[])
    return (
        <View style={styles.container}>
            <View style={styles.texts}>
                <Text style={styles.text}>{nickname}님,</Text>
                <Text style={styles.text}>안녕하세요.</Text>
            </View>
            <View style={styles.box}>
                <Text style={{margin:40, color:'gray', fontSize:17}}>사용 가능 금액</Text>
                <Text style={styles.amount}>{pay}원</Text>
                <View style={styles.charge}>
                    <TouchableOpacity onPress={goToCharge}>
                        <Text style={styles.chargeText}>충전하기</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
        </View>
    );
};
const styles=StyleSheet.create({
    container:{
        backgroundColor:'white',
        flex:1
    },
    texts:{
        padding:20,
        margin:30,
    },
    text:{
        fontSize:25,
        color:'black'
    },
    box:{
        marginTop:50,
        borderWidth:2,
        width:Dimensions.get('screen').width/1.1,
        height:Dimensions.get('screen').height/3.5,
        borderRadius:10,
        alignContent:'center',
        alignItems:'center',
        alignSelf:'center',
        backgroundColor:'#C9BAE5',
        borderColor:'#C9BAE5'
    },
    amount:{
        fontFamily: 'NanumGothic-Bold',
        fontSize:35,
        color:'black',
        
    },
    charge:{
        marginTop:50,
        
    },
    chargeText:{
        left:Dimensions.get('screen').width/3,
        color:'black',
        fontSize:18,
        
        fontFamily:'NanumGothic-Regular',
        borderWidth:1,
        borderRadius:5,
        padding:10,
        borderColor:'gray'
    }
})
export default PayBalance;