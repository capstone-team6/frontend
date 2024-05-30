import React from 'react';
import { StyleSheet, View,Text, Linking } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Run from 'react-native-vector-icons/MaterialCommunityIcons'


const Help = () => {
    const onPress=()=>{
        const url='https://peach-pearl-6f6.notion.site/fa78b9d0f3cd45a4b1ddd5f9d99706af?pvs=4'
        Linking.openURL(url).catch(err=>console.log("error:",err))
    }
    return (
        <View style={styles.container}>
            <Text style={styles.text}>틈새시장 사용법에 대해 궁금하다면?!</Text>
            <TouchableOpacity onPress={onPress}>
                <Text style={[styles.text,styles.button]}>틈새시장 이용 가이드 바로가기 
                <Run name='run-fast' size={23}/>
                </Text>
            </TouchableOpacity>
        </View>
    );
};
const styles=StyleSheet.create({
    container:{
        backgroundColor:'white',
        flex:1,
        alignItems:'center'
    },
    text:{
        textAlign:'center',
        marginTop:50,
        fontSize:20,
        color:'black'
    },
    button:{
        backgroundColor:'#C9BAE5',
        padding:15,
        borderRadius:10
        
        
    }
})
export default Help;