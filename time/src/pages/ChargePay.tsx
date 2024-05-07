import React from 'react';
import { StyleSheet, Text, View,Image, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';


const ChargePay = () => {
    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <Text style={styles.text}>원하는 페이를 골라주세요</Text>
            </View>
            <View style={styles.box}>
                <View style={styles.btns}>
                    <TouchableOpacity>
                        <Image source={require('../assets/images/kakaopay.png')} style={styles.btn} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image source={require('../assets/images/naverpay.png')} style={styles.btn} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image source={require('../assets/images/payco.png')} style={styles.btn}/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};
const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white'
    },
    top:{
        paddingTop:50
    },
    text:{
        textAlign:'center',
        fontSize:25,
        color:'black',
        fontFamily:'NanumGothic-Regular'
    },
    btns:{
        paddingTop:Dimensions.get('screen').height/20,
        alignItems:'center'
    },
    btn:{
        marginBottom:45,
        
    },
    box:{
        marginTop:Dimensions.get('screen').height/20,
        height:Dimensions.get('screen').height/1.7,
        backgroundColor: '#EDEDED',
        padding: 20,
        margin: 40,
        borderRadius: 10,
        alignItems: 'center',
        
    }
})
export default ChargePay;