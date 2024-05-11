import Geolocation from '@react-native-community/geolocation';
import { Picker } from '@react-native-picker/picker';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, Image, PermissionsAndroid, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import ImageResizer from 'react-native-image-resizer';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Photo from 'react-native-vector-icons/MaterialIcons'
import Right from 'react-native-vector-icons/AntDesign'
import ImagePicker from 'react-native-image-crop-picker'
import Geocoder from 'react-native-geocoding';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/Type';
import { func } from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';

type PostChangeProps=RouteProp<RootStackParamList,'PostingChange'>
type Nav=StackNavigationProp<RootStackParamList,'PostingChange'>
interface Props{
    route:PostChangeProps
}

type ImageType={
    uri:string;
    type:string;
    name:string;
    }

    Geocoder.init("AIzaSyCe4RbHkxkqRnuuvXUTEHXZ12zFT4tG5gQ",{lanuage:"ko",region:"KR"})

function changeTime(str:string):{timeNew:string, unit:string}{
    const timeNew = str.match(/\d+/)?.[0] || ''
    const unit=str.replace(/\d/g,"").trim()
    return {timeNew,unit}
}

const PostingChange: React.FC<Props> = ({route}) => {
    const {boardData}=route.params
    // console.log(boardData.images)
    const navigation=useNavigation<Nav>()
    const {timeNew, unit}=changeTime(boardData.itemTime)
    const [location,setLocation]=useState<{
        latitude:number
        longitude:number
        
    }|null>({latitude:boardData?.latitude,longitude:boardData?.longitude})
    
    const [address, setAddress]=useState<string>(boardData?.address)
    
    const [images, setImages]=useState<ImageType[]>([])
    const [category, setCategory]=useState<string>(boardData.category)
    const [previews, setPreviews] = useState< string[]>();
    const mapRef=useRef<MapView>(null)
    const [markerLocation,setMarkerLocation]=useState<{
        latitude:number,
        longitude:number,
    }|any>({latitude:boardData?.latitude,longitude:boardData?.longitude})
    const [selectedValue, setSelectedValue] = useState(unit);
    
    const [time, setTime]=useState<string>(timeNew)
    const [price, setPrice]=useState<string>(boardData.itemPrice.toString())
    const [content, setContent]=useState<string>(boardData?.content||'')
    const [title, setTitle]=useState<string>(boardData?.title||'')
    const [boardType, setBoardType]=useState<string>(boardData?.boardType||'')
    const [showMap, setShowMap]=useState<boolean>(true)
    const [isComplete,setIsComplete]=useState<boolean>(false)
    const [isActive,setIsActive]=useState<{[key:string]:boolean}>({
        'TALENT':false,
        'EXERCISE':false,
        'ERRANDS':false,
        'FREE':false,
        'TICKETING':false,
        'WAITING':false,
        'ETC':false,
    })
    
    const [isType, setIsType]=useState<{[key:string]:boolean}>({
        'BUY':false,
        'SELL':false,
    })
    const [showMapSearch,setShowMapSearch]=useState(false)
    
    useEffect(() => {
        if (boardData && Array.isArray(boardData.images)) {
            setImages(boardData.images)
            const imageLinks = boardData.images.map(imageName => `http://13.125.118.92:8080/images/jpg/${imageName}`);
            setPreviews(imageLinks);
        }
        }, [boardData]);
    
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
    useEffect(() => {
        if (boardData && boardData.category) {
            const initialIsActive = {
            'TALENT': false,
            'EXERCISE': false,
            'ERRANDS': false,
            'FREE': false,
            'TICKETING': false,
            'WAITING': false,
            'ETC': false,
            };
          // 해당 카테고리만 true로 설정
            const updatedIsActive = {
            ...initialIsActive,
            [boardData.category]: true,
            };
            setIsActive(updatedIsActive);
        }
        }, [boardData]);

        useEffect(() => {
            if (boardData && boardData.boardType) {
                const initialIsType = {
                'BUY': false,
                'SELL': false,
                };
              // 해당 타입만 true로 설정
                const updatedIsType = {
                ...initialIsType,
                [boardData.boardType]: true,
                };
                setIsType(updatedIsType);
            }
            }, [boardData]);
    
    const onTitleChange=(text:string)=>{
        setTitle(text)
    }
    const onTimeChange=(text:string)=>{
        setTime(text)
    }
    const onPriceChange=(text:string)=>{
        setPrice(text)
    }
    
    const onContentChange=(text:string)=>{
        setContent(text)
    }   
    
    
    
    const onResponse = useCallback(async (response:any) => {
        console.log(response.width, response.height, response.exif);
        const previewImage = `data:${response.mime};base64,${response.data}`;
        setPreviews(prevState => {
        if (Array.isArray(prevState)) {
            return [...prevState, previewImage];
        } else {
            return [previewImage];
        }
        });
        const orientation = (response.exif as any)?.Orientation;
        console.log('orientation', orientation);
        return ImageResizer.createResizedImage(
        response.path,
        response.width,
        response.height,
        response.mime.includes('jpeg') ? 'JPEG' : 'PNG',
        100,
        0,
        ).then((res) => {
        console.log(res.uri);
        setImages(prevState => [...prevState, {
            uri: res.uri,
            name: response.name,
            type: response.mime.includes('png') ? 'image/png' : 'image/jpeg'
            }]);
        });
    }, []);
    
    
    
    const onChangeFile = useCallback(() => {
      
      return ImagePicker.openPicker({
        includeExif: true,
        includeBase64: true,
        mediaType: 'photo',
        multiple:true
      })
        .then((responses:any[])=>{
          return Promise.all(responses.map((response) => onResponse(response)));
        })
        .catch(console.log);
    }, [onResponse]);
    
    const toggleMapVisibility=()=>{
      setShowMap(!showMap)
    }
    
    
    const deleteImage = (index: number) => {
      const newPreviews = Array.isArray(previews) ? [...previews] : [];
      newPreviews.splice(index, 1);
      setPreviews(newPreviews);
      if (Array.isArray(images)) {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages.length > 0 ? newImages : []);
    
      } 
    };
    
    const handlePress=(category:string)=>{
      const updatedState = {...isActive};
      for (const key in updatedState) {
        updatedState[key] = false;
      }
      updatedState[category] = true;
      setIsActive(updatedState);
    }
    
    const handleType=(type:string)=>{
      const updateType={...isType}
      for(const key in updateType){
        updateType[key]=false
      }
      updateType[type]=true
      setIsType(updateType)
    }
    
    
    const handleShowMapSearch=()=>{
      setShowMapSearch(true)
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
      if(title && category&&selectedValue&&time&&boardType&&price){
        setIsComplete(true)
      }else{
        setIsComplete(false)
      }
    },[title,category,selectedValue,time,boardType,price])
    
    const alert=()=>{
      Alert.alert("입력하지 않은 항목이 있습니다. ")
    }
    
    const onSubmit = async () => {
        const body = new FormData();
        body.append('category', category);
        body.append('title', title);
        body.append('time', time + selectedValue);
        body.append('price', price);
        body.append('content', content);
      
        if (showMap) {
          body.append('address', address);
          body.append('latitude', location?.latitude);
          body.append('longitude', location?.longitude);
        }
      
        images.forEach((image, index) => {
          const file = {
            uri: image.uri,
            type: image.type,
            name: `image_${index}.jpg`,
          };
          body.append('images', file);
        });
      
        body.append('boardType', boardType);
      
        try {
          const store = await AsyncStorage.getItem('accessToken');
          const token = store ? JSON.parse(store) : null;
          
          console.log(token);
          
          const res = await axios.put(`http://13.125.118.92:8080/api/auth/board/${boardData.boardId}`, body, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`, 
            },
            transformRequest: [(data, headers) =>  data],
          });
      
          if (res.status === 200) {
            console.log(res.data);
            navigation.goBack();
          }
        } catch(error) {
          console.log(error);
        }
      }
    return (
        
            <ScrollView style={styles.Posting_container}>
      <View >
        <View style={styles.container}>
          <Text style={styles.container_text}>사진</Text>
          <View style={styles.preview} >
            {/* {previews && <Image style={styles.previewImage} source={previews}/>} */}
            {Array.isArray(previews) && previews.map((preview, index) => (
            // <Image key={index} style={styles.previewImage} source={{ uri: preview }} />
            <View key={index} >
            <Image style={styles.previewImage} source={{ uri: preview }} />
            <TouchableOpacity onPress={() => deleteImage(index)} >
              <Photo name='close' size={20} color='red' />
            </TouchableOpacity>
          </View>
            ))}
          </View>
          {/* <ScrollView horizontal>
    {previews.map((preview, index) => (
      <Image key={index} style={styles.previewImage} source={{ uri: preview }} />
    ))}
  </ScrollView> */}
          <TouchableOpacity onPress={onChangeFile}>
            <Photo name='add-a-photo' size={35}/>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <Text style={styles.container_text}>제목</Text>
          <TextInput placeholder="제목" style={styles.titleInput} value={title} onChangeText={onTitleChange}></TextInput>
        </View>
        <View style={styles.container}>
          <Text style={styles.container_text}>카테고리</Text>
          <View style={styles.container_view}>
            <TouchableOpacity style={[styles.categoryBtn, isActive['TALENT'] && styles.activeCategoryBtn]} onPress={()=>{setCategory("TALENT");handlePress('TALENT'); }}>
              <Text style={styles.categoryBtn_text}>재능기부</Text>
            </TouchableOpacity>
            <View style={styles.space} />
            <TouchableOpacity style={[styles.categoryBtn, isActive['EXERCISE'] && styles.activeCategoryBtn]} onPress={()=>{setCategory("EXERCISE"); handlePress('EXERCISE')}}>
              <Text style={styles.categoryBtn_text}>운동</Text>
            </TouchableOpacity>
            <View style={styles.space} />
            <TouchableOpacity style={[styles.categoryBtn, isActive['ERRANDS'] && styles.activeCategoryBtn]} onPress={()=>{setCategory("ERRANDS");handlePress('ERRANDS'); }}>
              <Text style={styles.categoryBtn_text}>심부름</Text>
            </TouchableOpacity>
            <View style={styles.space} />
            <TouchableOpacity style={[styles.categoryBtn, isActive['TICKETING'] && styles.activeCategoryBtn]} onPress={()=>{setCategory("TICKETING");handlePress('TICKETING'); }}>
              <Text style={styles.categoryBtn_text}>티켓팅</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.container_view}>
            <TouchableOpacity style={[styles.categoryBtn, isActive['WAITING'] && styles.activeCategoryBtn]} onPress={()=>{setCategory("WAITING");handlePress('WAITING'); }}>
              <Text style={styles.categoryBtn_text}>오픈런</Text>
            </TouchableOpacity>
            <View style={styles.space} />
            <TouchableOpacity style={[styles.categoryBtn, isActive['FREE'] && styles.activeCategoryBtn]} onPress={()=>{setCategory("FREE");handlePress('FREE'); }}>
              <Text style={styles.categoryBtn_text}>나눔</Text>
            </TouchableOpacity>
            <View style={styles.space} />
            <TouchableOpacity style={[styles.categoryBtn, isActive['ETC'] && styles.activeCategoryBtn]} onPress={()=>{setCategory("ETC");handlePress('ETC'); }}>
              <Text style={styles.categoryBtn_text}>기타</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.container}>
          <Text style={styles.container_text}>시간</Text>
          <View style={{flexDirection: 'row'}}>
            <TextInput style={styles.input} value={time} onChangeText={onTimeChange}></TextInput>
            <Picker
              selectedValue={selectedValue}
              onValueChange={item => setSelectedValue(item)}
              style={{
                width: 120,
                height: 40,
                borderWidth: 1,
                borderColor: 'black',
              }}>
              <Picker.Item label="단위" value="" />
              <Picker.Item label="분" value="분" />
              <Picker.Item label="시간" value="시간" />
            </Picker>
          </View>
        </View>

        <View style={styles.container}>
          <Text style={styles.container_text}>가격</Text>
          <View style={styles.container_view}>
            <TouchableOpacity style={[styles.priceBtn, isType['SELL'] && styles.activeTypeBtn]} onPress={()=>{setBoardType("SELL");handleType('SELL'); }}>
              <Text style={{color: 'black'}}>팔기</Text>
            </TouchableOpacity>
            <View style={{width: 10}} />
            <TouchableOpacity style={[styles.priceBtn, isType['BUY'] && styles.activeTypeBtn]} onPress={()=>{setBoardType("BUY");handleType('BUY'); }}>
              <Text style={{color: 'black'}}>사기</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TextInput style={styles.input} value={price} onChangeText={onPriceChange}></TextInput>
            <View style={{width: 5}} />
            <Text
              style={{
                color: 'black',
                height: 40,
                marginTop: 10,
                marginLeft: 10,
              }}>
              원
            </Text>
          </View>
        </View>
        <View style={styles.container}>
          <Text style={styles.container_text}>내용</Text>
          <TextInput
            placeholder="자세한 내용을 적어주세요.
          (유해성 게시물의 경우 게시가 제한됩니다.)"
            multiline={true}
            style={styles.textInput}
            value={content}
            onChangeText={onContentChange}
          />
        </View>
        <View style={styles.container}>
          <View style={styles.location}>
            <Text style={styles.container_text}>틈새위치</Text>
            <TouchableOpacity onPress={toggleMapVisibility}>
              <Text style={styles.locationButton}>{showMap?"위치 설정 안하기":"위치 설정하기"}</Text>
            </TouchableOpacity>
          </View>
          {showMap&&(
            <>
              <Text style={{ fontSize: 15, borderWidth: 1, borderColor: 'gray', margin: 10, height: 40, borderRadius: 5, textAlignVertical: 'center' }}>{address}
                <Right name='right' size={20} onPress={handleShowMapSearch} />
              </Text>
              <View style={{zIndex:4,flex:2}}>
                <GooglePlacesAutocomplete minLength={2} 
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
                style={{ flex: 1 , width:Dimensions.get('screen').width,height:250, marginBottom:20}}
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                latitude:location?.latitude,
                longitude:location?.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
                }}   
              >
              {markerLocation&&(
                <Marker coordinate={markerLocation}/>
            )}
            </MapView>
            
              )}
            </>
          )}
        </View>
      </View>
      <View style={styles.complete}>
          <TouchableOpacity onPress={isComplete?onSubmit:alert} style={{ justifyContent:'center'}}>
            <Text style={styles.completeBtn}
            disabled={!isComplete}
            >
              완료</Text>
          </TouchableOpacity>
          </View>
    </ScrollView>
    );
};
const styles = StyleSheet.create({
    Posting_container: {
        height: Dimensions.get('screen').height,
        backgroundColor: 'white',
        
    },
    container: {
        flexDirection: 'column',
        margin: 20,
        marginBottom: 10,
    },
    container_text: {
        fontFamily: 'NanumGothic-Bold',
        fontSize: 15,
        color: '#000000',
        marginBottom: 10,
    },
    titleInput: {
        height: 45,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
    },
    textInput: {
        height: 100,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        textAlignVertical: 'top',
    },
    container_view: {
        flexDirection: 'row',
        margin: 5,
    },
    priceBtn: {
        backgroundColor: '#E8EAEC',
        width: 50,
        height: 24,
        alignItems: 'center',
        borderRadius: 10,
    },
    activeTypeBtn:{
        backgroundColor: '#C9BAE5',
        width: 50,
        height: 24,
        alignItems: 'center',
        borderRadius: 10,
    },
    space: {
      width: 15,
    },
    input: {
      borderWidth: 0,
      borderBottomWidth: 1,
      height: 40,
      width: 110,
      marginLeft: 5,
    },
    categoryBtn: {
      backgroundColor: '#E8EAEC',
      width: 80,
      height: 35,
      borderRadius: 10,
      justifyContent: 'center',
      
    },
    activeCategoryBtn:{
      width: 80,
      height: 35,
      borderRadius: 10,
      justifyContent: 'center',
      backgroundColor:"#C9BAE5"
    },
    categoryBtn_text: {
      color: 'black',
      textAlign: 'center',
    },
    location:{
      flexDirection:'row'
    },
    locationButton:{
      borderColor:'gray',
      borderRadius:5,
      borderWidth:1,
      marginLeft:10,
      fontSize:13,
      width:110,
      height:25,
      textAlign:'center',
      textAlignVertical:'center',
      backgroundColor:'#E8EAEC',
      
    },
    previewImage:{
      height: Dimensions.get('window').height /8,
      resizeMode: 'contain',
      width: Dimensions.get('window').width / 4, // 화면의 너비의 1/4로 설정
      margin: 5, // 이미지들 간의 간격을 설정
      
    },
    preview:{
      flexDirection:'row',
      flexWrap:'wrap',
      justifyContent:'flex-start'
      
    },
    previews: {
      marginHorizontal: 10,
      width: Dimensions.get('window').width /-20,
      height: Dimensions.get('window').height / 3,
      backgroundColor: '#D2D2D2',
      marginBottom: 10,
      // alignItems:'center'
    },
    previewsContainer: {
      flexDirection: 'row',
    },
    mapContainer: {
      
      height: Dimensions.get('window').height / 2,
      marginBottom: 20,
    },
    complete:{
      flex:1,
      justifyContent:'center',
      alignItems:'center',
      paddingBottom:30
    },
    completeBtn:{
      fontSize:18,
      textAlign:'center',
      color:'black',
      borderWidth:2, width:140, borderRadius:5,
      borderColor:'gray',fontFamily:'NanumGothic-Regular',height:30, 
      textAlignVertical:'center',backgroundColor:'#C9BAE5'
    }
  });
export default PostingChange;