import axios from 'axios';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { err } from 'react-native-svg';
import Delete from 'react-native-vector-icons/MaterialIcons'
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/Type';
import { useNavigation } from '@react-navigation/native';

type Nav=StackNavigationProp<RootStackParamList,'Search'>

const Search = () => {
    const [keyword, setKeyword]=useState<string|''>('')
    const onKeywordChange=(text:string)=>{
        setKeyword(text)
    }
    const navigation=useNavigation<Nav>()
    const goToList=(key:string)=>{
        navigation.navigate('SearchList',{key})
    }

    const onSubmit=()=>{
        AsyncStorage.getItem('accessToken').then((token)=>{
            const accessToken=token?JSON.parse(token):null
            console.log(accessToken)
            axios.get('http://13.125.118.92:8080/api/board', {
                params: {
                    keyword:keyword,
                    pageNum: 0,
                    boardType: '',
                    category:''
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            }
                )
                .then((response) => {
                    console.log(response.data.data)
                    goToList(keyword)
                })
                .catch(error=>{
                    console.log(error)
                })
                })
                
    }
    return (
        <View style={styles.container}>
            <View style={styles.keywordInput}>
                <TextInput value={keyword} onChangeText={onKeywordChange} placeholder='검색어를 입력해주세요'
                placeholderTextColor='gray'
                onSubmitEditing={onSubmit}
                />
            </View>
            
        </View>
    );
};
const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
        // alignItems:'center',
        
    },
    keywordInput:{
        textAlign:'center',
        borderRadius:5,
        backgroundColor:'#E9E9E9',
        marginTop:10,
        width:Dimensions.get('screen').width/1.3,
        alignSelf:'center'
    },
    textTitle:{
        marginTop:30,
        paddingLeft:25,
        flexDirection:'row'
    },
    text:{
        textAlign:'left',
        fontSize:20,
        color:'black',
        fontFamily:'NanumGothic-Bold'
    },
    keywords:{
        paddingLeft:25,
        marginTop:20
    },
    keyword:{
        borderWidth:1,
        borderRadius:5,
        textAlign:'center',
        borderColor:'#757575',
        height:30,
        verticalAlign:'middle'
    }
})

export default Search;


{/* <View style={styles.textTitle}>
                <Text style={styles.text}>최근 검색어</Text>
                <Text style={{marginLeft:10}}>전체 삭제</Text>
            </View>
            <View style={styles.keywords}>
                <Text style={[styles.keyword, { width: keyword ? keyword.length *20 : 1 }]}>{keyword+"\t"} 
                <Delete name='close' size={10} color='black'/></Text>
            </View> */}