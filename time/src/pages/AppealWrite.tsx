import React from 'react';
import { View,Text,StyleSheet, Button, TouchableOpacity} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

function AppealWrite() {
    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={{fontSize:17,fontFamily: 'NanumGothic-Bold',color:'black'}}>제목</Text>
                <TextInput placeholder='15자 이내 입력' style={styles.input}></TextInput>
            </View>
            <View style={styles.section}>
                <Text style={{fontSize:17,fontFamily: 'NanumGothic-Bold',color:'black'}}>내용</Text>
                <TextInput  style={styles.inputContent}></TextInput>
            </View>
            <View style={styles.section}>
                <Text style={{fontSize:17,fontFamily: 'NanumGothic-Bold',color:'black'}}>사진</Text>
                <View  style={styles.photoAdd}>
                    <Text style={{textAlign:'center',textAlignVertical:'center',fontSize:70}}>+</Text>
                </View>
            </View>
            <View>
                <TouchableOpacity style={{flexDirection:'row',justifyContent:'center', marginTop:60}}>
                    <Text style={styles.buttonC}>취소</Text>
                    <Text style={styles.buttonA}>신청하기</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
        flexDirection:'column'
    },
    section:{
        margin:30
    },
    input:{
        borderColor:'gray',
        borderWidth:1,
        marginTop:10,
        fontFamily: 'NanumGothic-Bold',
    },
    inputContent:{
        borderColor:'gray',
        borderWidth:1,
        marginTop:10,
        fontFamily: 'NanumGothic-Bold',
        height:200,
        textAlignVertical:'top'
        
    },
    photoAdd:{
        borderColor:'gray',
        borderWidth:1,
        marginTop:10,
        fontFamily: 'NanumGothic-Bold',
        height:100,
        width:100
    },
    buttonA:{
        borderColor:'gray',
        borderWidth:1,
        margin:10,
        borderRadius:3,
        fontSize:20,
        width:90,
        height:35,
        textAlign:'center',
        textAlignVertical:'center',
        backgroundColor:'#C9BAE5',
        fontFamily: 'NanumGothic-Regular',
    },
    buttonC:{
        borderColor:'gray',
        borderWidth:1,
        margin:10,
        borderRadius:3,
        fontSize:20,
        width:90,
        height:35,
        textAlign:'center',
        textAlignVertical:'center',
        backgroundColor:'#D9D9D9',
        fontFamily: 'NanumGothic-Regular',
    }
    
})

export default AppealWrite;