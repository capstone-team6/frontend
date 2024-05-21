import { RouteProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View,Text, Dimensions, Button, Alert } from 'react-native';
import { RootStackParamList } from '../../types/Type';
import { Picker } from '@react-native-picker/picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';

type DataProps=RouteProp<RootStackParamList,'ReportPost'>
type Nav=StackNavigationProp<RootStackParamList,'ReportPost'>
interface Props{
    route:DataProps
}
const ReportPost:React.FC<Props> = ({route}) => {
    const {boardId}=route.params
    const [selectValue, setSelectValue]=useState<string>('')
    const navigation=useNavigation<Nav>()

    const goToNav=()=>{
        navigation.navigate('틈새시장')
    }
    const onSubmit=()=>{
        AsyncStorage.getItem('accessToken').then(token=>{
            const accessToken=token?JSON.parse(token):null
            const data={
                reportCategory:selectValue
            }
            axios.post(`http://13.125.118.92:8080/board/${boardId}/report`,data,{
                headers:{
                    Authorization: `Bearer ${accessToken}`
                }
            })
            .then(res=>{
                console.log(res.data)
                Alert.alert('',"접수 되었습니다.",[{
                    text:'확인',
                    onPress:()=>{
                        navigation.navigate('틈새시장')
                    }
                }])
            })
            .catch(err=>{
                console.log(err)
            })
        })
    }

    const onPress=(value:string)=>{
        setSelectValue(value)
    }
    return (
        <View style={styles.container}>

            <View style={styles.options}>
            <TouchableOpacity style={styles.options_detail} onPress={()=>onPress('ADVERTISEMENT')}>
                <Text style={{fontFamily:'NanumGothic-Bold', color:'#313131', fontSize:16,}}>스팸 및 홍보글</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options_detail} onPress={()=>onPress('OTHER')}>
                <Text style={{fontFamily:'NanumGothic-Bold', color:'#313131', fontSize:16,}}>음란성이 포함된 글</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options_detail} onPress={()=>onPress('ABUSE')}>
                <Text style={{fontFamily:'NanumGothic-Bold', color:'#313131', fontSize:16,}}>게시글 도배</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options_detail} onPress={()=>onPress('HATE_SPEECH')}>
                <Text style={{fontFamily:'NanumGothic-Bold', color:'#313131', fontSize:16,}}>욕설/생명경시/혐오/차별적인 글</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options_detail} onPress={()=>onPress('ILLEGAL_CONTENT')}>
                <Text style={{fontFamily:'NanumGothic-Bold', color:'#313131', fontSize:16,}}>불법적인 글</Text>
            </TouchableOpacity>
            
        </View>
        <View style={styles.btn}>
                <TouchableOpacity onPress={onSubmit} disabled={!selectValue}>
                    <Text style={styles.text}>제출하기</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles=StyleSheet.create({
    container:{
        backgroundColor:'white',
        flex:1,
        alignItems:'center'
    },
    btn:{
        paddingTop:Dimensions.get('screen').height/11
    },
    text:{
        fontSize:20,
        color:'black',
        borderWidth:1,
        padding:10,
        borderRadius:8,
        fontFamily:'NanumGothic-Regular',
        backgroundColor:'#C9BAE5',
        borderColor:'#C9BAE5',
        width:100,
        height:50,
        textAlign:'center',
        textAlignVertical:'center'

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
    },
    selectedOption:{
        borderColor:'#C9BAE5',
        borderWidth:2
    }
})
export default ReportPost;