import Geolocation from '@react-native-community/geolocation';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  PermissionsAndroid,
  Image,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import Geocoder from 'react-native-geocoding';
import {err} from 'react-native-svg';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import Posting from './Posting';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {RootStackParamList} from '../../types/Type';
import {StackNavigationProp} from '@react-navigation/stack';
import PostDetail from './PostDetail';
import {useNavigation} from '@react-navigation/native';

Geocoder.init('AIzaSyCe4RbHkxkqRnuuvXUTEHXZ12zFT4tG5gQ', {language: 'ko'});

async function requestPermission() {
  try {
    if (Platform.OS === 'android') {
      return await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }
  } catch (e) {
    console.log(e);
  }
}

interface RoomData {
  boardId: number;
  title: string;
  createdDate: string;
  chatCount: number;
  scrapCount: number;
  distance: number;
  address: string;
  boardState: string;
  firstImage: string;
  itemTime: string;
  itemPrice: number;
}
type MainNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

function Main() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [posts, setPosts] = useState([]);
  const [isScrap, setIsScrap] = useState(false);
  const [address, setAddress] = useState<string>('');

  const navigation = useNavigation<MainNavigationProp>();
  const goToPostDetail = () => {
    navigation.navigate('PostDetail');
  };
  const handleHeartPress = async (boardId: number) => {
    try {
      setIsScrap(!isScrap);
      const res = await axios.post(
        `http://13.125.118.92:8080/api/board/${boardId}/scrap`,
        {
          isScrap: !isScrap,
        },
      );
      if (res.status === 200) {
        console.log(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    axios
      .get('http://13.125.118.92:8080/api/board', {
        params: {
          keyword: '%E3%85%8E',
          pageNum: 0,
          category: 'ETC',
          boardType: 'BUY',
        },
      })
      .then((response: any) => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error(error);
      });

    requestPermission().then(result => {
      console.log({result});
      if (result === 'granted') {
        Geolocation.getCurrentPosition(
          pos => {
            setLocation(pos.coords);
            Geocoder.from(pos.coords.latitude, pos.coords.longitude, 'ko')
              .then(json => {
                console.log(json);
                const addressComponent = json.results[0].formatted_address;
                const desireAddress = addressComponent.split(', ')[0];
                const words = desireAddress.split(' ');
                const lastAddress = `${words[1]} ${words[2]} ${words[3]}`;
                // 주소에서 한글 부분을 선택
                // const desireAddress=addressArray.filter(address => address !== "대한민국").join(', ');
                setAddress(lastAddress);
              })
              .catch(error => console.warn(error));
          },
          error => {
            console.log(error);
          },
          {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 10000,
          },
        );
      }
    });
  }, []);

  return (
    <View style={styles.main_container}>
      <View style={styles.location}>
        <Text style={styles.location_text}>
          {address ? address : 'Loading...'}
        </Text>
        <AntDesign name="caretdown" size={13} style={styles.down_icon} />
      </View>

      <View style={styles.options}>
        <Text style={styles.option1}>구매글</Text>
        <Text style={styles.option2}>판매글</Text>
      </View>
      <View>
        <View style={styles.options_line}></View>
      </View>
      {/* 임시 데이터 */}
      <TouchableOpacity style={styles.postContainer} onPress={goToPostDetail}>
        <Image
          source={require('../assets/images/post1.jpg')}
          style={styles.post_image}
        />
        <View style={styles.post_info}>
          <Text style={styles.info1}>3km · 5분 전</Text>
          <Text style={styles.info2}>강아지 산책 부탁드려요</Text>
          <Text style={styles.info3}>10,000원/20분</Text>
        </View>
        <View style={styles.appeal_icon}>
          <TouchableOpacity onPress={() => handleHeartPress(0)}>
            <Ionicons
              name={isScrap ? 'heart' : 'heart-outline'}
              size={24}
              color={isScrap ? 'red' : 'gray'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.interactionContainer}>
          <View style={styles.interactionItem}>
            <Feather name="message-circle" size={15} />
            <Text style={styles.interactionText}>2</Text>
          </View>
          <View style={styles.interactionItem}>
            <AntDesign name="hearto" size={15} />
            <Text style={styles.interactionText}>2</Text>
          </View>
        </View>
      </TouchableOpacity>
      <FlatList
        data={posts}
        keyExtractor={item => item.boardId.toString()}
        renderItem={({item}: ListRenderItemInfo<RoomData>) => (
          <TouchableOpacity style={styles.postContainer}>
            <Image
              source={{
                uri: `http:://13.125.118.92:8080/var/www/myapp/images/${item.firstImage}`,
              }}
              style={styles.post_image}
            />
            <View style={styles.post_info}>
              <Text style={styles.info1}>
                {item.distance} · {item.createdDate}
              </Text>
              <Text style={styles.info2}>{item.title}</Text>
              <Text style={styles.info3}>
                {item.itemPrice}/{item.itemTime}
              </Text>
            </View>
            <View style={styles.appeal_icon}>
              <TouchableOpacity onPress={() => handleHeartPress(item.boardId)}>
                <Ionicons
                  name={isScrap ? 'heart' : 'heart-outline'}
                  size={15}
                  color={isScrap ? 'red' : 'gray'}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.interactionContainer}>
              <View style={styles.interactionItem}>
                <Feather name="message-circle" size={15} />
                <Text style={styles.interactionText}>{item.chatCount}</Text>
              </View>
              <View style={styles.interactionItem}>
                <AntDesign name="hearto" size={15} />
                <Text style={styles.interactionText}>{item.scrapCount}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main_container: {
    height: Dimensions.get('screen').height,
    backgroundColor: 'white',
    flex: 1,
  },
  location: {
    flexDirection: 'row',
    margin: 23,
  },
  location_text: {
    fontFamily: 'NanumGothic-Bold',
    fontSize: 15,
  },
  down_icon: {
    marginLeft: 6,
    color: 'black',
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  option1: {
    color: 'black',
    fontFamily: 'NanumGothic-Bold',
    fontSize: 15,
  },
  option2: {
    color: 'black',
    fontFamily: 'NanumGothic-Bold',
    fontSize: 15,
  },
  options_line: {
    borderBottomWidth: 2,
    margin: 20,
    marginEnd: Dimensions.get('screen').width / 1.8,
  },
  postContainer: {
    width: '95%',
    height: 110,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 0.1,
    borderColor: 'black',
  },
  post_image: {
    width: 95,
    height: 95,
    borderRadius: 25,
    marginRight: 10,
    position: 'absolute',
    left: 10,
  },
  post_info: {
    flexDirection: 'column',
  },
  info1: {
    fontFamily: 'NanumGothic',
    fontSize: 11,
    color: '#747474',
    marginBottom: 5,
  },
  info2: {
    fontFamily: 'NanumGothic',
    fontSize: 16,
    color: '#3C444C',
    marginBottom: 5,
  },
  info3: {fontFamily: 'NanumGothic-bold', fontSize: 13, color: '#3C444C'},
  interactionContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  interactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  interactionText: {
    fontFamily: 'NanumGothic',
    fontSize: 11,
    color: 'black',
  },
  appeal_icon: {position: 'absolute', right: 15, top: 10},
});
export default Main;
