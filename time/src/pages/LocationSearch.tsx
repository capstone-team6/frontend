import Geolocation from '@react-native-community/geolocation';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, PermissionsAndroid, Platform, StyleSheet, View,Text } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/Type';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { updateLocation } from '../redux/locationSlice';
import { RootState } from '../redux/store';



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

type MainNav=StackNavigationProp<RootStackParamList,'Main'>
const LocationSearch= () =>{
    useEffect(()=>{
        Geocoder.init("AIzaSyCe4RbHkxkqRnuuvXUTEHXZ12zFT4tG5gQ",{language:"ko",region:"KR"})
    },[])
    const dispatch = useDispatch();
    const { newAddress, newLocation } = useSelector((state:RootState) => state.location);
    const navigation=useNavigation<MainNav>()
    const mapRef=useRef<MapView>(null)
    const [address, setAddress]=useState<string>('')
    const [location,setLocation]=useState<{
        latitude:number
        longitude:number
        
    }|null>(null)
    const [markerLocation,setMarkerLocation]=useState<{
        latitude:number,
        longitude:number,
        }|any>(null)
    async function moveToLocation(latitude:any,longitude:any) {
        mapRef.current?.animateToRegion(
            {
                latitude,
                longitude,
                latitudeDelta:0.015,
                longitudeDelta:0.01121
            },
            2000,
        )
        setMarkerLocation({latitude,longitude})
    }

    const handleMapSearchComplete = (data: any, details: any) => {
        const selectedLocation = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
        };
        moveToLocation(selectedLocation.latitude, selectedLocation.longitude);
        const words = data.description.split(" ");
        
        // Finding the index of "대한민국"
        const index = words.findIndex((word: string) => word === "대한민국");
        // If "대한민국" is found, updating the address from the next word
        if (index !== -1) {
            const addressStart = words.slice(index + 1).join(" ");
            setAddress(addressStart);
        } else {
            setAddress(data.description);
        }
        
    };


    useEffect(()=>{
        requestPermission().then(result=>{
            console.log({result})
            if(result==="granted"){
                Geolocation.getCurrentPosition(
                    pos=>{
                        setLocation(pos.coords);
                        Geocoder.from(pos.coords.latitude, pos.coords.longitude,"ko-KR")
                            .then(json => {
                                console.log(json.results[0])
                                const addressComponent = json.results[0].formatted_address;
                                const words=addressComponent.split(" ")
                                const lastAddress=`${words[1]} ${words[2]} ${words[3]}`
                                setAddress(lastAddress);
                                console.log(lastAddress)
                                setMarkerLocation(pos.coords)
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
    useEffect(() => {
        if (address && markerLocation) {
            dispatch(updateLocation({ newAddress: address, newLocation: markerLocation }));
        }
    }, [address, markerLocation]);
    
    const goToMain=(addressChange:string,markerLocation:{latitude:number,longitude:number})=>{
        navigation.navigate('틈새시장',{addressChange,markerLocation})
    }
    
    return (
        <View style={styles.container}>
            <View style={{zIndex:4,flex:2, paddingTop:30,paddingBottom:70}}>
                <GooglePlacesAutocomplete minLength={2} 
                textInputProps={{
                    style: {
                        borderWidth: 1, 
                        borderColor: 'gray',
                        borderRadius: 5, 
                        padding: 10,
                        height: 50, 
                        fontSize: 16, 
                        width:Dimensions.get('screen').width/1.2,
                        marginLeft:10,
                        marginBottom:10
                        },
                    }}
                    placeholder={'장소를 검색하세요'}
                    query={{
                    key:'AIzaSyCe4RbHkxkqRnuuvXUTEHXZ12zFT4tG5gQ',
                    language:'ko',
                    components:'country:kr',
                }}
                keyboardShouldPersistTaps={"handled"}
                fetchDetails={true}
                onPress={(data,details=null)=>{
                    console.log(data,details)
                    moveToLocation(details?.geometry.location.lat,details?.geometry.location.lng)
                    handleMapSearchComplete(data, details)
                }}
                onFail={(error) => console.log(error)}
                onNotFound={() => console.log("no results")}
                keepResultsAfterBlur={true}
                enablePoweredByContainer={false}
                
                />
                
            </View>
            
            {location&&(
                <MapView
                style={{ flex: 4, width:Dimensions.get('screen').width,height:250, marginBottom:20}}
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                latitude:location?.latitude,
                longitude:location?.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
                }}   
            >
                {markerLocation&&(
                <Marker coordinate={markerLocation}/>
            )}
            </MapView>
            
            )}
            <View style={{paddingTop:50, alignItems:'center',marginBottom:50}}>
                <TouchableOpacity onPress={()=>{
                    goToMain(address,markerLocation)
                }}>
                    <Text style={styles.btn}>설정</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles=StyleSheet.create({
    container:{
        backgroundColor:'white',
        flex:1
    },
    btn:{
        fontSize:18,
        textAlign:'center',
        color:'black',
        borderWidth:2, width:140, borderRadius:5,
        borderColor:'#C9BAE5',fontFamily:'NanumGothic-Regular',height:30, 
        textAlignVertical:'center',backgroundColor:'#C9BAE5'
    }
})

export default LocationSearch;