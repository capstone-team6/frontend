import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/Type';

type Navigation=StackNavigationProp<RootStackParamList,'App'>
const DeleteMem = () => {
    const navigation=useNavigation<Navigation>()

    const disConnectKakao=async()=>{
        try{
            const res=await KakaoLogin.unlink()
            if(res){
                console.log("카카오톡 연결이 끊어졌습니다")
                await AsyncStorage.clear()
                console.log('storage의 모든 데이터가 삭제되었습니다.')
                navigation.navigate('App')
            }
        }catch(error){
            console.log(error)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.q}>회원 탈퇴를 원하시나요?</Text>
            <Text style={styles.e}>계정을 삭제하면 틈새 시간, 게시글, 관심, 채팅 등 모든 활동 정보가 삭제됩니다. </Text>
            <View style={styles.buttons}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                    <Text style={styles.bnt1}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={disConnectKakao}>
                    <Text style={styles.bnt2}>확인</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
        paddingTop:30,
        padding:20
    },
    q:{
        color:'black',
        fontSize:25,
        
    },
    e:{
        fontSize:18,
        color:'black',
        marginTop:10
    },
    buttons:{
        flexDirection:'row',
        justifyContent:'space-around',
        paddingTop:Dimensions.get('screen').height/2
    },
    bnt1:{
        fontFamily:'NanumGothic-Reglular',
        color:'black',
        fontSize:20,
        borderWidth:1,
        borderColor:'gray',
        backgroundColor:'#D9D9D9',
        borderRadius:5,
        width:90,
        height:45,
        textAlign:'center',
        textAlignVertical:'center'
        
        
    },
    bnt2:{
        fontFamily:'NanumGothic-Reglular',
        color:'black',
        fontSize:20,
        borderWidth:1,
        borderColor:'gray',
        backgroundColor:'#C9BAE5',
        borderRadius:5,
        width:90,
        height:45,
        textAlign:'center',
        textAlignVertical:'center'
    }

})

export default DeleteMem;