import React from 'react';
import { View,Text,StyleSheet } from 'react-native';
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
    }
    
})

export default AppealWrite;