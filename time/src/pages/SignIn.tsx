import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/Type';


interface SignInProps{
    onLoginSuccess:()=>void
}
type SignUpNavigation=StackNavigationProp<RootStackParamList,'SignUp'>
const SignIn:React.FC<SignInProps>=({onLoginSuccess})=> {
    const navigation=useNavigation<SignUpNavigation>()
    const goToSignUp=()=>{
        navigation.navigate('SignUp')
    }

    //카카오 api로 로그인 시도
    const signInKaKao=async()=>{
        try{    
            const result = await KakaoLogin.login();
            console.log("Login Success", JSON.stringify(result));
            await getProfile(result.accessToken);
            
        }catch(error:any){
            console.log(error)
        }
    }

    //서버한테 토큰 보내기
    const getProfile=async(Token:string)=>{
        try{
            const data={
                token:Token
            }
            const res=await axios.post('http://192.168.0.4:8080/kakao/login',data)
            if(res.status===200){
                console.log("GetProfile Success",JSON.stringify(res.data))
                await AsyncStorage.setItem('userId',res.data.id)
                if(res.data.isOurMember===true){
                    onLoginSuccess()
                }else{
                    goToSignUp()
                }
                
            }
        }catch(error:any){
            if(error.response&&error.response.status===403){
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