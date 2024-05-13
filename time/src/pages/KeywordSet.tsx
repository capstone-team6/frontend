import React from 'react';
import { Alert, Dimensions, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Trash from 'react-native-vector-icons/EvilIcons'

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
const KeywordSet = () => {
    return (
        <View style={styles.container}>
            <View style={{margin:20, paddingTop:30, flexDirection:'row',alignItems:'center', alignSelf:'center'}}>
                <TextInput placeholder='알림 받을 키워드를 입력해주세요.' style={styles.textInput}></TextInput>
                <Text style={styles.btn}>등록</Text>
            </View>
            <View style={styles.line}/>
            <View  style={{flexDirection:'row',alignItems:'center', alignSelf:'center'}}>
                <View style={styles.keywordBox}>
                    <Text style={styles.keyword}>산책</Text>
                </View>
                <Trash name='trash' size={30} onPress={()=>deleteAlert()}/>
            </View>

        </View>
    );
};
const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white'
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
        width:Dimensions.get('screen').width/2
    },
    keyword:{
        margin:10,
        fontSize:17,
        fontFamily:'NanumGothic-Regular',
        color:'black'
    }
})
export default KeywordSet;