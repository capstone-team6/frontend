import Geolocation from '@react-native-community/geolocation';
import React, { useEffect, useState } from 'react';
import { Dimensions, PermissionsAndroid, Platform, Text, View } from 'react-native';
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

const MapSearch= ({location}:{location: { latitude: number, longitude: number } | null }) => {
  const [curLocation,setLocation]=useState<{
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

  if(!curLocation){
    return(
      <View>
        <Text>Splash Screen</Text>
      </View>
    )
  }
  return (
    <MapView 
    style={{ flex: 1 , width:Dimensions.get('screen').width,height:250, marginBottom:20}}
      provider={PROVIDER_GOOGLE}
      initialRegion={{
      latitude: curLocation.latitude,
      longitude:curLocation.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
      }}   
    >
      <Marker coordinate={{
        latitude: curLocation.latitude,
        longitude:curLocation.longitude
      }}/>
    </MapView>
  );
};

export default MapSearch;