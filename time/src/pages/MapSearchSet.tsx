import Geolocation from '@react-native-community/geolocation';
import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, Text, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'
import { err } from 'react-native-svg';
import {WebView} from 'react-native-webview'

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

const MapSearchSet:React.FC = () => {
    const [location,setLocation]=useState<{
        latitude:number
        longitude:number
    }|null>(null)
    useEffect(()=>{
        requestPermission().then(result=>{
        console.log({result})
        if(result==="granted"){
            Geolocation.getCurrentPosition(
            pos=>{
                setLocation(pos.coords)
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

    if(!location){
        return(
        <View>
            <Text>Splash Screen</Text>
        </View>
        )
    }
    return (
    <View>
        <MapView 
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
        latitude: location.latitude,
        longitude:location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
        }}   
        >
        <Marker coordinate={{
            latitude: location.latitude,
            longitude:location.longitude
        }}/>
        </MapView>
        <GooglePlacesAutocomplete minLength={2} placeholder={'장소를 검색하세요'} query={{
            key:'AIzaSyC4WpgLqA2gKhSuE7NqBKVbYsfo8u724to',
            language:'ko',
            components:'country:kr',
        }}
        keyboardShouldPersistTaps={"handled"}
        fetchDetails={true}
        onPress={(data, details) => {console.log(data, details);}}
        onFail={(error) => console.log(error)}
        onNotFound={() => console.log("no results")}
        keepResultsAfterBlur={true}
        enablePoweredByContainer={false}
        // styles={styles.search}
        />
    </View>
        
    );
};



export default MapSearchSet;