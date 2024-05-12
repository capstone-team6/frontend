import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import React, { useState } from 'react';
import { View,Text, StyleSheet, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { RootStackParamList } from '../../types/Type';
import { useNavigation } from '@react-navigation/native';



type SignInNavigation=StackNavigationProp<RootStackParamList,'SignIn'>
type MainNavigation=StackNavigationProp<RootStackParamList,'BottmTabNavigation'>
const SignUp:React.FC=()=> {

    //닉네임 설정
    const [nickName, setNickname]=useState('')
    //중복 시 에러 메시지
    const [errorText, setErrorText]=useState('')
    //닉네임 유효 여부
    const [isNicnameVaild,setIsNicNameVaild]=useState<boolean>(false)

    const returnNavigation=useNavigation<SignInNavigation>()
    const mainNavigation=useNavigation<MainNavigation>()

    const onChange=(text:string)=>{
        setNickname(text)
    }

    // 닉네임 중복 검사
    const checkName=async(name:string)=>{
        try{
            const data={
                nickname:name
            }
            const nameRes=await axios.post("http://13.125.118.92:8080/sign-up/nicknameCheck",data)
            if(nameRes.status===200){
                console.log(nameRes.data)
                console.log(nameRes.data.data.success)
                if(nameRes.data.data.success===true){ 
                    setIsNicNameVaild(true)
                    setErrorText("사용 가능한 닉네임 입니다.")
                    
                }else{
                    setIsNicNameVaild(false)
                    setErrorText("이미 존재하는 닉네임 입니다. ")
                }
            }
        }catch(error:any){
        console.log(error)
        }
    }

    const onSubmit=async()=>{
        try{
            const id=await AsyncStorage.getItem('kakaoId')
            console.log(id)
            const datas={
                kakaoId:id,
                nickname:nickName
            }
            axios.put("http://13.125.118.92:8080/sign-up",datas)
            .then(res=>{
                const result=res.data.data
                console.log(result)
                mainNavigation.navigate('BottmTabNavigation')
                
            }).catch(err=>{
                const result=err.response.data.data
                console.log(result)
            })
        }catch(error){
            console.log(error)
        }
    }

    const returnNav=()=>{
        returnNavigation.navigate('SignIn')
    }
    return (
        <View style={styles.container}>
            
            <View style={styles.input}>
                <Text style={{fontSize:18, marginTop:50, fontFamily:'NanumGothic-Regular', color:'black'}}>닉네임</Text>
                <View style={styles.inputcheck}>
                    <TextInput placeholder='10자 이내 입력' value={nickName} onChangeText={onChange}
                    style={{borderWidth:1,marginTop:10,fontFamily:'NanumGothic-Regular', width:Dimensions.get('screen').width/1.6, marginRight:10}}></TextInput>
                    <TouchableOpacity style={{paddingTop:13}}>
                        <Text style={styles.checkButton} onPress={()=>checkName(nickName)}>중복확인</Text>
                    </TouchableOpacity>
                </View>
                {errorText?<Text style={{color:'black'}}>{errorText}</Text>:null}
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