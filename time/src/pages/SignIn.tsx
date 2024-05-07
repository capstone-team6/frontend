import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/Type';
import qs from 'qs'
import SignUp from './SignUp';

// SignIn 컴포넌트가 받을 props를 설명하는 인터페이스 SignIn은 onLoginSuccess라는 이름의 props을 받을 것을 명시하고 있다. 
interface SignInProps{
    onLoginSuccess:()=>void
}

type SignUpNavigation=StackNavigationProp<RootStackParamList,'SignUp'>
const SignIn:React.FC<SignInProps>=({onLoginSuccess})=> {
    const navigation=useNavigation<SignUpNavigation>()
    const goToSignUp=()=>{
        navigation.navigate('SignUp')
    }

    //카카오 api로 로그인 시도하고 카카오 토큰 받기
    const signInKaKao=async()=>{
        try{    
            const result = await KakaoLogin.login();
            console.log("Login Success", JSON.stringify(result));
            // await AsyncStorage.setItem('KakaoaccessToken',result.accessToken)
            await getProfile(result.accessToken);
            
        }catch(error:any){
            console.log(error)
        }
    }

    //서버한테 카카오 토큰 보내고 카카오 ID 받기
    const getProfile=async(Token:string)=>{
        try{
            const data={
                token:Token
            }
            const res=await axios.post('http://13.125.118.92:8080/kakao/getinfo',data)
            if(res.status===200){
                console.log("GetProfile Success",JSON.stringify(res.data))
                // userId 따로 저장
                const id=res.data.data.kakaoId
                await AsyncStorage.setItem("kakaoId",id)
                
                
                try {
                    
                    const data = {
                        username: id,
                        password: id
                    }
                    const qs = require('qs')
                    console.log("kakaoId 보내서 토큰 발급 시도 ")
                    axios.post("http://13.125.118.92:8080/kakao/login", qs.stringify(data), {
                        headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }).then(async res=>{
                      //성공
                        console.log(res.data);
                        const result = res.data.data;
                        console.log('isOurMember :' + result.isOurMemeber); // true값이 담김

                        console.log('토큰'+result.accessToken)
                        await AsyncStorage.setItem('accessToken',JSON.stringify(result.accessToken))
                        await AsyncStorage.setItem('refreshToken',JSON.stringify(result.refreshToken))

                        onLoginSuccess()
                    }).catch(err=>{
                      //실패 : 회원가입 로직으로 이동
                        const result = err.response.data.data;
                      console.log('isOurMember : ' + result.isOurMemeber); // false값이 담김
                        goToSignUp()
                    })
                    } catch (error: any) {
                    console.log(error)
                    }
            }
        }catch(error:any){
            if(error.response&&error.response.status===400){
                console.log(`GetProfile Fail(code:${error.response.status})`)
                
            }
            
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.mainDisplay}>
                <Image source={require('../assets/images/loginLogo.png')} style={styles.mainLogo}></Image>
            </View>

            <View style={styles.imageContainer}>
                <TouchableOpacity onPress={()=>signInKaKao()}>
                    <Image source={require('../assets/images/kakao_login.png')} style={styles.image}></Image>
                </TouchableOpacity>
            </View>
        </View>
        
    );
}

const styles=StyleSheet.create({
    container:{
        height:Dimensions.get('screen').height,
        backgroundColor:'#C9BAE5',
        
    },
    mainDisplay:{
        alignItems:'center',
        justifyContent:'center',
        padding:100,
        
    },
    mainLogo:{
        padding:20,
        marginBottom:20,
        marginEnd:40,
    },
    
    imageContainer:{
        flex:1,
        justifyContent:'center',
    },
    image:{
        width:300,
        alignSelf:'center',
        marginBottom:80,
    }
})



export default SignIn;