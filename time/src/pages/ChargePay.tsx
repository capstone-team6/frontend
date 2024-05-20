import React, { useState } from 'react';
import { StyleSheet, Text, View,Image, Dimensions, Role } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Delete from 'react-native-vector-icons/AntDesign'
import IMP from 'iamport-react-native'
import Loading from './Loading';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/Type';
import { useNavigation } from '@react-navigation/native';

type Nav=StackNavigationProp<RootStackParamList,'ChargePay'>
const ChargePay = () => {
    const navigation=useNavigation<Nav>()
    const [amount, setAmount]=useState<number>(0)

    const onChangeText=(value:string)=>{
        const intValue=parseInt(value)
        if(!isNaN(intValue)){
            setAmount(intValue)
        }else{
            setAmount(0)
        }
        
    }

    const onSubmit=(amountValue:number)=>{
        navigation.navigate('KakaoPay',{amountValue})
    }

    const plusBtn=(value:number)=>{
        setAmount(amount+value)
    }

    const clearInput=()=>{
        setAmount(0)
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <View style={styles.btns}>
                    <View>
                        <Image source={require('../assets/images/kakaopay.png')} style={styles.btn} />
                    </View>

                    <View style={styles.input}>
                        <TextInput value={String(amount)} onChangeText={onChangeText} placeholder='충전할 금액을 적어주세요'  style={styles.textBox}></TextInput>
                        <TouchableOpacity onPress={clearInput}>
                            <Delete name='closecircle' size={16} color='black' style={{marginTop:20, marginLeft:10}}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'row', marginTop:20}}>
                        <TouchableOpacity onPress={()=>plusBtn(10000)}>
                            <Text style={styles.plus}>+1만원</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>plusBtn(50000)}>
                            <Text style={styles.plus}>+5만원</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>plusBtn(100000)}>
                            <Text style={styles.plus}>+10만원</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.submit}>
                        <TouchableOpacity onPress={()=>{onSubmit(amount)}}>
                            <Text style={styles.btnSub}>충전하기</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};
const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white'
    },
    top:{
        paddingTop:50
    },
    text:{
        textAlign:'center',
        fontSize:25,
        color:'black',
        fontFamily:'NanumGothic-Regular'
    },
    btns:{
        paddingTop:Dimensions.get('screen').height/50,
        alignItems:'center'
    },
    btn:{
        // marginBottom:45,
        
    },
    box:{
        marginTop:Dimensions.get('screen').height/20,
        height:Dimensions.get('screen').height/1.5,
        backgroundColor: '#FFEB00',
        margin: 40,
        borderRadius: 15,
        alignItems: 'center',
        
    },
    textBox:{
        borderBottomColor:'black',
        borderBottomWidth:1,
        fontSize:18
    },
    input:{
        flexDirection:'row',
        
    },
    plus:{
        backgroundColor:'#4A4A4A',
        color:'white',
        margin:10,
        fontSize:15, 
        borderWidth:1,
        borderRadius:10,
        padding:5,
        height:30,
        textAlign:'center',
        textAlignVertical:'center',
        fontFamily:'NanumGothic-Regular'
        
    },
    submit:{
        paddingTop:Dimensions.get('screen').height/4
    },
    btnSub:{
        fontSize:30,
        backgroundColor:'black',
        color:'white',
        padding:10,
        width:250,
        height:80,
        textAlign:'center',
        textAlignVertical:'center',
        borderRadius:7,
        fontFamily:'NanumGothic-Bold'
    }
})
export default ChargePay;