import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  Platform,
  PermissionsAndroid,
  Image
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Photo from 'react-native-vector-icons/MaterialIcons'
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import MapSearch from './MapSearch';
import Right from 'react-native-vector-icons/AntDesign'
import axios from 'axios';
import ImagePicker from 'react-native-image-crop-picker'
import ImageResizer from 'react-native-image-resizer'



type ImageType=any
Geocoder.init("AIzaSyCe4RbHkxkqRnuuvXUTEHXZ12zFT4tG5gQ",{lanuage:"ko",region:"KR"})

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
const Posting = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const [location,setLocation]=useState<{
    latitude:number
    longitude:number
    
}|null>(null)

const [address, setAddress]=useState<string>('')

const [image, setImage]=useState<{uri: string; name:string; type:string}>()
const [images, setImages]=useState<ImageType[]>([])
const [category, setCategory]=useState<string>('')
// const [preview, setPreview]=useState<{uri:string}>()
// const [previews, setPreviews] = useState<string[]>([]);
const [previews, setPreviews] = useState<{ uri: string } | string[]>([]);


const [time, setTime]=useState<string>('')
const [price, setPrice]=useState<string>('')
const [content, setContent]=useState<string>('')
const [title, setTitle]=useState<string>('')
const [boardType, setBoardType]=useState<string>('')
const [showMap, setShowMap]=useState<boolean>(true)
const [isActive,setIsActive]=useState<{[key:string]:boolean}>({
  'TALENT':false,
  'ECERCISE':false,
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
  // setPreview({uri: `data:${response.mime};base64,${response.data}`});
  const orientation = (response.exif as any)?.Orientation;
  console.log('orientation', orientation);
  return ImageResizer.createResizedImage(
    response.path,
    response.width/10,
    50,
    response.mime.includes('jpeg') ? 'JPEG' : 'PNG',
    100,
    0,
  ).then(r => {
    console.log(r.uri, r.name);

    setImage({
      uri: r.uri,
      name: r.name,
      type: response.mime,
    });
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

const onSubmit= async ()=>{
  const datas={
    category:category,
    title:title,
    price:price,
    content:content,
    address:address,
    latitude:location?.latitude,
    longtitude: location?.longitude,
    images:image,
    boardType:boardType
    }
  try{
    const res=await axios.post('http://13.125.118.92:8080/api/auth/board',datas)
    if(res.status===200){
      console.log(res.data)

    }
  }catch(err){
    console.log(err)
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
            <Image key={index} style={styles.previewImage} source={{ uri: preview }} />
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
              <Picker.Item label="분" value="minutes" />
              <Picker.Item label="시간" value="hours" />
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
              <Text style={{ fontSize: 20, borderWidth: 1, borderColor: 'gray', margin: 10, height: 40, borderRadius: 5, textAlignVertical: 'center' }}>{address}
                <Right name='right' size={20} />
              </Text>
              <ScrollView style={styles.mapContainer}>
                <MapSearch location={location} />
              </ScrollView>
            </>
          )}
        </View>
      </View>
    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  Posting_container: {
    height: Dimensions.get('screen').height,
    backgroundColor: 'white',
    flex: 1,
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
    
    height: Dimensions.get('window').height / 4, // Adjust the height according to your requirement
    marginBottom: 20,
  },
});

export default Posting;
