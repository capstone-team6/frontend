import Geolocation from '@react-native-community/geolocation';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Text, View ,StyleSheet, Dimensions, Platform, PermissionsAndroid} from 'react-native';
import Geocoder from 'react-native-geocoding';
import { err } from 'react-native-svg';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Octicons from 'react-native-vector-icons/Octicons'

Geocoder.init("AIzaSyCe4RbHkxkqRnuuvXUTEHXZ12zFT4tG5gQ")

async function requestPermission() {
    try{
        if(Platform.OS==="android"){
        return await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            )
        }
    }catch(e){
        console.log(e)
    }
}

function Main() {
    const [locatoin,setLocation]=useState<{
        latitude:number
        longitude:number
        
    }|null>(null)

    const [address, setAddress]=useState<string>('')

    useEffect(()=>{
        requestPermission().then(result=>{
            console.log({result})
            if(result==="granted"){
                Geolocation.getCurrentPosition(
                    pos=>{
                        setLocation(pos.coords);
                        Geocoder.from(pos.coords.latitude, pos.coords.longitude)
                            .then(json => {
                                console.log(json)
                                const addressComponent = json.results[6].formatted_address;
                                const desireAddress=addressComponent.split(', ')[1]
                                setAddress(desireAddress);
                            })
                            .catch(error => console.warn(error));
                    },
                    error=>{
                        console.log(error)
                    },
                    {
                        enableHighAccuracy:false,
                        timeout:5000,
                        maximumAge:10000,
                    },
                )
            }
        })
    },[])
    return (
        <View style={styles.main_container}>
            <View style={styles.location}>
                <Text style={styles.location_text}>{address? address : 'Loading...'}</Text>
                <AntDesign name='caretdown' size={13} style={styles.down_icon}/>
            </View>
            
            <View style={styles.options}>
                <Text style={styles.option1}>구매글</Text>
                <Text style={styles.option2}>판매글</Text>
            </View>
            <View>
                <View style={styles.options_line}></View>
            </View>
        
        </View>
    );
}

const styles=StyleSheet.create({
    main_container:{
        height:Dimensions.get('screen').height,
        backgroundColor:'white',
        flex:1,
    },
    location:{
        flexDirection:'row',
        margin:23,
    },
    location_text:{
        fontFamily:'NanumGothic-Bold',
        fontSize:15
    },
    down_icon:{
        marginLeft:6,
        color:'black'
    },
    options:{
        
        flexDirection:'row',
        justifyContent:'space-around',
        marginTop:20
    },
    option1:{
        color:'black',
        fontFamily:'NanumGothic-Bold',
        fontSize:15
    },
    option2:{
        color:'black',
        fontFamily:'NanumGothic-Bold',
        fontSize:15
    },
    options_line:{
        borderBottomWidth:2,
        margin:20,
        marginEnd: Dimensions.get('screen').width /1.8,
        
    }
})
export default Main;

