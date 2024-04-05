import React from 'react';
import { View,StyleSheet,Text } from 'react-native';



function Appeal() {
    return (
        <View style={styles.container}>
            <View style={styles.list}>
                <View style={{borderBottomColor:'gray',borderBottomWidth:1, width:'100%'}}/>
                <View style={styles.item}>
                    <Text style={styles.text}>틈새2님과의 거래</Text>
                    <Text style={styles.btn}>처리중</Text>
                </View>
                <View style={{borderBottomColor:'gray',borderBottomWidth:1, width:'100%'}}/>
                <View style={styles.item}>
                    <Text style={styles.text}>틈새3님과의 거래</Text>
                    <Text style={styles.btn}>처리완료</Text>
                </View>
                <View style={{borderBottomColor:'gray',borderBottomWidth:1, width:'100%'}}/>
            </View>
        </View>
    );
}

const styles=StyleSheet.create({
    container:{
        backgroundColor:'white',
        flex:1,
        flexDirection:'column',
        
    },
    list:{
        paddingTop:30,
    },
    item:{
        flexDirection:'row',
        justifyContent:'space-around',
        margin:30
        
    },
    text:{
        color:'black',
        fontFamily:'NanumGothic-Regular',
        fontSize:20
    },
    btn:{
        width:80,
        height:30,
        backgroundColor:'white',
        borderRadius:5,
        borderColor:'gray',
        borderWidth:1,
        textAlign:'center',
        textAlignVertical:'center',
        color:'black',
        fontFamily:'NanumGothic-Regular'
        
    },
})

export default Appeal;