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

    const signInKaKao=async()=>{
        try{    
            const result = await KakaoLogin.login();
            console.log("Login Success", JSON.stringify(result));
            await getProfile(result.accessToken);
            
        }catch(error:any){
            console.log(error)
        }
    }
    const getProfile=async(token:string)=>{
        try{
            const res=await axios.post('서버 api',{token})
            if(res.status===200){
                console.log("GetProfile Success",JSON.stringify(res.data))
                onLoginSuccess()
            }
        }catch(error:any){
            if(error.response&&error.response.status===401){
                console.log(`GetProfile Fail(code:${error.response.status})`)
                goToSignUp()
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