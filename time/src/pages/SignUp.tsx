import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import React, { useState } from 'react';
import { View,Text, StyleSheet, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { RootStackParamList } from '../../types/Type';
import { useNavigation } from '@react-navigation/native';



type SignInNavigation=StackNavigationProp<RootStackParamList,'SignIn'>
type MainNavigation=StackNavigationProp<RootStackParamList,'BottomTabNavigation'>
const SignUp:React.FC=()=> {

    const [nickName, setNickname]=useState('')
    const [errorText, setErrorText]=useState('')
    const [isNicnameVaild,setIsNicNameVaild]=useState(false)
    const returnNavigation=useNavigation<SignInNavigation>()
    const mainNavigation=useNavigation<MainNavigation>()

    const handleNickNameChange=(text:string)=>{
    setNickname(text)
    setIsNicNameVaild(false)
    }

    const nicknameCannotUse=()=>{
    setErrorText('이미 존재하는 닉네임 입니다.')
    }

    const checkName=async(name:string)=>{
        try{
            const data={
                nickname:name
            }
            const nameRes=await axios.post("http://:8080/sign-up/nicknameCheck",data)
            if(nameRes.status===200){
                console.log(nameRes.data)
                if(nameRes.data.isOk===true){
                    setIsNicNameVaild(true)
                }else{
                    nicknameCannotUse()
                }
            }
        }catch(error:any){
        console.log(error)
        }
    }

    const onSubmit=async()=>{
        try{
            const datas={
                id:AsyncStorage.getItem('userId'),
                nickname:nickName
            }
            const res=await axios.post("http://:8080/sign-up",datas)
            if(res.status===200){
                returnNavigation.navigate('BottomTabNavigation')
            }
        }catch(error){
            console.log(error)
        }
    }

    const returnNav=()=>{
        returnNavigation.navigate('SignIn')
    }
    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>닉네임 변경</Text>
            <View style={styles.input}>
                <Text style={{fontSize:18, marginTop:50, fontFamily:'NanumGothic-Regular', color:'black'}}>닉네임</Text>
                <View style={styles.inputcheck}>
                    <TextInput placeholder='10자 이내 입력' value={nickName} onChangeText={handleNickNameChange}
                    style={{borderWidth:1,marginTop:10,fontFamily:'NanumGothic-Regular', width:Dimensions.get('screen').width/1.6, marginRight:10}}></TextInput>
                    <TouchableOpacity style={{paddingTop:13}}>
                        <Text style={styles.checkButton} onPress={()=>checkName(nickName)}>중복확인</Text>
                    </TouchableOpacity>
                </View>
                {errorText?<Text style={{color:'red'}}>{errorText}</Text>:null}
            </View>
            <View style={styles.button} >
                <TouchableOpacity onPress={returnNav}>
                    <Text style={styles.text1}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onSubmit} disabled={!isNicnameVaild}>
                    <Text style={styles.text2}>완료</Text>
                </TouchableOpacity>
                
            </View>
        </View>
    );  
}
const styles=StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column'
    },
    headerTitle:{
        fontFamily:'NanumGothic-Bold',
        fontSize: 28, color:'black',
        textAlign:'center',
        justifyContent:'center',
        padding:20
    },
    input:{
        paddingHorizontal:50,
    },
    button:{
        flexDirection:'row',
        justifyContent:'center',
        paddingTop:Dimensions.get('screen').height/2,
        
    },
    text1:{
        marginRight:50, borderWidth:1, borderColor:'gray', height:40,width:90,
        fontSize:20,
        textAlign:'center',
        textAlignVertical:'center',
        backgroundColor:'#D9D9D9',
        fontFamily:'NanumGothic-Regular'
    },
    text2:{
        borderWidth:1, borderColor:'gray', height:40,width:90,
        fontSize:20,
        textAlign:'center',
        textAlignVertical:'center',
        backgroundColor:'#C9BAE5',
        fontFamily:'NanumGothic-Regular'
    },
    inputcheck:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    checkButton:{
        fontFamily:'NanumGothic-Regular',
        borderWidth:1,
        fontSize:15,color:'black',textAlignVertical:'center',
        height:40, backgroundColor:'#C9BAE5',width:70,textAlign:'center',borderColor:'gray',
        borderRadius:5
    }

})
export default SignUp;