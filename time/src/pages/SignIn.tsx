import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SignInProps{
    onLoginSuccess:()=>void
}

const SignIn:React.FC<SignInProps>=({onLoginSuccess})=> {

    const signInKaKao=async()=>{
        try{
            const result = await KakaoLogin.login();
            console.log("Login Success", JSON.stringify(result));
            await getProfile();
            onLoginSuccess()
        }catch(err){
            console.log(err)
        }
    }
    const getProfile=async()=>{
        try{
            const result=await KakaoLogin.getProfile()
            console.log("GetProfile Success",JSON.stringify(result))
        }catch(error:any){
            console.log(`GetProfile Fail(code:${error.code})`, error.message)
        }
    }

    // 서버 통신 토큰 함수
    // const sendUserInfo=async(userInfo:any)=>{
    //     try{
    //         const res=await axios.post('서버api',userInfo)
    //         console.log('Server Response: ',res.data)
    //         const token=res.data.token
    //         if(token){
    //             await AsyncStorage.setItem('token',token)
    //             console.log('Token saved successfully')
    //         }else{
    //             console.log('NO token received from server')
    //         }
    //     }catch(error){
    //         console.log(error)
    //     }
    // }
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