import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


function SignIn() {
    return (
        <View style={styles.container}>
            <View style={styles.mainDisplay}>
                <Image source={require('../assets/images/loginLogo.png')} style={styles.mainLogo}></Image>
            </View>

            <View style={styles.imageContainer}>
                <Image source={require('../assets/images/kakao_login.png')} style={styles.image}></Image>
            </View>
        </View>
        
    );
}

const styles=StyleSheet.create({
    container:{
        height:Dimensions.get('screen').height,
        backgroundColor:'#C9BAE5',
        
    },
    mainDisplay:{
        alignItems:'center',
        justifyContent:'center',
        padding:100,
        
    },
    mainLogo:{
        padding:20,
        marginBottom:20,
        marginEnd:40,
    },
    
    imageContainer:{
        flex:1,
        justifyContent:'center',
    },
    image:{
        width:300,
        alignSelf:'center',
        marginBottom:80,
    }
})



export default SignIn;