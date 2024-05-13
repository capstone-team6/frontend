import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, View } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Trash from 'react-native-vector-icons/EvilIcons'


const KeywordSet = () => {
    const [keyword,setKeyword]=useState<string>('')
    const [resKeyword,setResKeyword]=useState<string[]>([])
    const onKeywordChange=(text:string)=>{
        setKeyword(text)
    }

    const deleteAlert=()=>{
    
        Alert.alert('','\'산책\' 키워드를 삭제하시겠습니까?',
        [
            {
                text: '취소',
                style: 'cancel',
            },
            {
                text: '확인',
                // onPress: () => {
                //     AsyncStorage.getItem('accessToken').then(item=>{
                //         const token=item?JSON.parse(item):null
                //         axios.delete(`http://13.125.118.92:8080/api/auth/board/${boardId}`,{
                //             headers:{
                //                 Authorization:`Bearer ${token}`
                //             }
                //         })
                //     .then(res=>{
                //         console.log(res)
                //         console.log('게시글 삭제됨');
                //         navigation.navigate('틈새시장')
                //     })
                //     .catch(err=>{
                //         console.log(err)
                //     })
                //     })
                // },
            },
        ],
        { cancelable: false })
    }

    const onSubmit=()=>{
        AsyncStorage.getItem('accessToken').then(token=>{
            const accessToken=token?JSON.parse(token):null
            const data={
                keyword:keyword
            }
            axios.post('http://13.125.118.92:8080/keyword',data,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            })
            .then((res)=>{
                console.log(res.config.data)
                const response=JSON.parse(res.config.data)
                setResKeyword(prevKeywords => [...prevKeywords, response.keyword])
                setKeyword('')

            })
            .catch((error)=>{
                console.log(error)
            })
        })
    }
    const isButtonDisabled = keyword.trim() === '';
    return (
        <ScrollView>
                <View style={styles.container}>
                    <View style={{margin:20, paddingTop:30, flexDirection:'row',alignItems:'center', alignSelf:'center'}}>
                        <TextInput value={keyword} onChangeText={onKeywordChange} placeholder='알림 받을 키워드를 입력해주세요.' style={styles.textInput}></TextInput>
                        <Text style={styles.btn} onPress={onSubmit} disabled={isButtonDisabled}>등록</Text>
                </View>
                <View style={styles.line}/>
                <View style={{flexDirection:'column', alignItems: 'center', alignSelf: 'center'}}>
                {resKeyword.map((keyword, index) => (
                    <View style={{flexDirection: 'row', alignItems: 'center'}} key={index}>
                        <View style={styles.keywordBox}>
                            <Text style={styles.keyword}>{keyword}</Text>
                        </View>
                        <Trash name='trash' size={30} onPress={()=>deleteAlert()}/>
                    </View>
                ))}
            </View>
            </View>
        </ScrollView>
    );
};
const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
        height:Dimensions.get('screen').height
    },
    textInput:{
        borderWidth:1,
        borderRadius:5,
        color:'black',
        marginRight:20
    },
    btn:{
        backgroundColor:'#C9BAE5',
        borderRadius:5,
        width:70,
        height:50,
        textAlign:'center',
        textAlignVertical:'center',
        color:'black',
        fontSize:16,
        fontFamily:'NanumGothic-Regular'
    },
    line:{
        borderBottomWidth: 0.5,
        borderBottomColor: 'black',
        marginVertical: 30, 
        alignSelf:'center',
        width:Dimensions.get('screen').width/1.2
    },
    keywordBox:{
        borderWidth:1,
        margin:20,
        borderRadius:5,
        width:Dimensions.get('screen').width/2,
        flexDirection:'row'
    },
    keyword:{
        margin:10,
        fontSize:17,
        fontFamily:'NanumGothic-Regular',
        color:'black'
    }
})
export default KeywordSet;