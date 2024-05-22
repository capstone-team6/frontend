import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../types/Type';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import Geocoder from 'react-native-geocoding';

type SetNav =
  | StackNavigationProp<RootStackParamList, 'PostDetailSet'>
  | StackNavigationProp<RootStackParamList, 'ChatScreen'>;

type PostDetailRouteProps = RouteProp<RootStackParamList, 'PostDetail'>;
interface Props {
  route: PostDetailRouteProps;
}
type ImageType = {
  uri: string;
  type: string;
  name: string;
};
interface BoardData {
  boardId: number;
  scrapStus: string;
  userId: number;
  nickname: string;
  mannerTime: number;
  title: string;
  content: string;
  createdDate: string;
  itemTime: string;
  itemPrice: string;
  chatCount: number;
  scrapCount: number;
  address: string;
  longitude: number;
  latitude: number;
  boardState: string;
  category: string;
  boardType: string;
  images: ImageType[];
  who: string;
}

const convertToKorean = (category: string) => {
  switch (category) {
    case 'TALENT':
      return '재능기부';
    case 'EXERCISE':
      return '운동';
    case 'ERRANDS':
      return '심부름';
    case 'TICKETING':
      return '티켓팅';
    case 'WAITING':
      return '오픈런';
    case 'FREE':
      return '나눔';
    case 'ETC':
      return '기타';
    default:
      return category;
  }
};

Geocoder.init('AIzaSyCe4RbHkxkqRnuuvXUTEHXZ12zFT4tG5gQ', {
  language: 'ko',
  region: 'KR',
});
const PostDetail: React.FC<Props> = ({route}) => {
  const navigation = useNavigation<SetNav>();
  const {boardId} = route.params;
  console.log(boardId);
  const [isScrap, setIsScrap] = useState(false);
  const [boardData, setBoardData] = useState<BoardData | null>(null);
  const [roomName, setRoomName] = useState('');
  const [userName, setName] = useState();
  const [otherUserId, setUserId] = useState();

  const goToSet = () => {
    navigation.navigate('PostDetailSet', {boardId});
  };
  const goToReport = () => {
    navigation.navigate('PostSet', {boardId});
  };

  const goToChatScreen = (boardId: number, roomName: string) => {
    console.log(`PostDetailToChatScreen${boardId}${roomName}`);
    navigation.navigate('ChatScreen', {
      boardId,
      roomName,
      userName,
      otherUserId,
    });
  };

  const handleHeartPress = async () => {
    const newScrapValue = !isScrap;
    AsyncStorage.getItem('accessToken').then(async item => {
      const token = item ? JSON.parse(item) : null;
      try {
        setIsScrap(newScrapValue);
        const res = await axios.post(
          `http://13.125.118.92:8080/api/board/${boardId}/scrap`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (res.status === 200) {
          console.log(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    });
  };

  useEffect(() => {
    AsyncStorage.getItem('accessToken').then(item => {
      const token = item ? JSON.parse(item) : null;
      console.log(token);
      axios
        .get(`http://13.125.118.92:8080/api/board/${boardId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(response => {
          console.log('Data received:', response.data);
          console.log(response.data.data.images);
          setBoardData(response.data.data);
          setRoomName(response.data.data.roomName);
          if (response.data.data.scrapStus === 'YES') {
            setIsScrap(true);
          }
          setName(response.data.data.nickname);
          setUserId(response.data.data.userId);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    });
  }, [isScrap, boardId]);

  function timeDiffence(targetTime: Date): string {
    const koreanTime = new Date().getTime();
    const create = new Date(targetTime);
    const diffInMinutes = Math.floor(
      (new Date(koreanTime).getTime() - targetTime.getTime()) / (1000 * 60),
    );
    if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInMinutes < 60 * 24) {
      const diffInHour = Math.floor(diffInMinutes / 60);
      return `${diffInHour}시간 전`;
    } else {
      const diffInDays = Math.floor(diffInMinutes / (60 * 24));
      return `${diffInDays}일 전`;
    }
  }

  const renderItem = ({item, index}: {item: ImageType; index: number}) => {
    return (
      <View>
        <Image
          source={{uri: `http://13.125.118.92:8080/images/jpg/${item}`}}
          style={{height: 300, width: 300}}
          resizeMode="contain"
        />
      </View>
    );
  };
  const [activeSlide, setActiveSlide] = useState(0);
  const renderPagination = () => {
    return (
      <Pagination
        dotsLength={boardData?.images.length ?? 0}
        activeDotIndex={activeSlide}
        containerStyle={{paddingVertical: 10}}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  };

  const [showOptions, setShowOptions] = useState(false);
  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionSelect = (option: any) => {
    Alert.alert(`${option}`);
    setShowOptions(false);
  };

  return (
    <ScrollView>
      <View style={styles.PostDetail_container}>
        <View style={styles.postingImg}>
          {boardData?.who == 'writer' ? (
            <SimpleLineIcons
              name="options-vertical"
              size={20}
              style={{
                left: Dimensions.get('screen').width / 2.5,
                marginTop: 10,
              }}
              onPress={() => {
                goToSet();
              }}
            />
          ) : (
            <SimpleLineIcons
              name="options-vertical"
              size={20}
              style={{
                left: Dimensions.get('screen').width / 2.5,
                marginTop: 10,
              }}
              onPress={() => {
                goToReport();
              }}
            />
          )}

          {boardData?.images && boardData.images.length > 0 ? (
            <Carousel
              data={boardData?.images ?? []}
              renderItem={renderItem}
              sliderWidth={300}
              itemWidth={300}
              layout="default"
              style={{alignContent: 'center', alignItems: 'center'}}
              onSnapToItem={index => setActiveSlide(index)}>
              {renderPagination()}
            </Carousel>
          ) : (
            <Image
              source={require('../assets/images/logo.png')}
              style={{marginVertical: 50}}
            />
          )}
        </View>

        <View style={styles.user}>
          <View style={styles.user_info}>
            <Image
              style={styles.user_profile}
              source={require('../assets/images/profile.png')}
            />
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.user_name}>{boardData?.nickname} </Text>
              <View style={styles.icon_container}>
                <AntDesign name="message1" size={13} color="black" />
                <Text> {boardData?.chatCount} </Text>
              </View>
              <View style={styles.icon_container}>
                <AntDesign name="hearto" size={13} color="black" />
                <Text> {boardData?.scrapCount}</Text>
              </View>
            </View>
            <View style={styles.appeal_icon}>
              <TouchableOpacity onPress={() => handleHeartPress()}>
                <Ionicons
                  name={isScrap ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isScrap ? 'red' : 'gray'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.title}>
          <TouchableOpacity style={styles.categoryBtn}>
            <Text style={styles.categoryBtn_text}>
              {convertToKorean(boardData?.category ?? '')}
            </Text>
          </TouchableOpacity>
          <Text style={styles.title_text}>{boardData?.title}</Text>
          <View style={styles.title_location}>
            <Text style={styles.title_time}>{boardData?.address} </Text>
            <Text style={styles.title_time}>
              {timeDiffence(new Date(boardData?.createdDate ?? ''))}
            </Text>
          </View>
          <View style={{height: 5}} />
          <Text style={styles.title_content}>{boardData?.content}</Text>
        </View>

        <View style={styles.info_detail}>
          <Text style={styles.text}>시간</Text>
          <View style={{width: 15}} />
          <Text style={styles.text}>{boardData?.itemTime}</Text>
        </View>
        <View style={{height: 10}} />
        <View style={styles.info_detail}>
          <Text style={styles.text}>가격</Text>
          <View style={{width: 28}} />
          <Text style={styles.text}>{boardData?.itemPrice + '원'}</Text>
        </View>

        <View style={styles.location}>
          <Text style={styles.location_text}>틈새위치</Text>
        </View>

        {/* <View style={styles.mapContainer}> */}
        {/* <AntDesign name="location-pin" size={13} color="black" /> */}
        {/* <View style={styles.map}> */}
        {/* <TouchableOpacity style={styles.mapBtn}>
            <Text style={styles.mapBtn_text}>지도보기</Text>
          </TouchableOpacity> */}

        {boardData?.latitude && boardData.longitude && (
          <MapView
            style={styles.mapContainer}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: boardData?.latitude || 0,
              longitude: boardData?.longitude || 0,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}>
            {boardData?.latitude && boardData?.longitude && (
              <Marker
                coordinate={{
                  latitude: boardData.latitude,
                  longitude: boardData.longitude,
                }}
              />
            )}
          </MapView>
        )}

        {/* </View> */}
        {/* </View> */}

        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.chatBtn}
            onPress={() => {
              goToChatScreen(boardId, roomName);
            }}>
            <Text style={styles.chatBtn_text}> 채팅하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  PostDetail_container: {
    height: Dimensions.get('screen').height,
    backgroundColor: 'white',
    flex: 1,
  },
  user: {},
  postingImg: {
    width: Dimensions.get('screen').width,
    height: 300,
    backgroundColor: '#C9BAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info_detail: {
    marginLeft: 20,
    flexDirection: 'row',
  },
  user_info: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    paddingTop: 10,
  },
  user_profile: {
    width: 30,
    height: 30,
  },
  user_name: {
    paddingHorizontal: 5,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'NanumGothic-Bold',
  },
  categoryBtn: {
    backgroundColor: '#E8EAEC',
    width: 50,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
  },
  categoryBtn_text: {
    color: 'black',
    textAlign: 'center',
    fontSize: 10,
  },

  title: {margin: 20},

  title_text: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'NanumGothic-Bold',
    paddingVertical: 10,
  },
  title_location: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  title_content: {
    fontSize: 17,
    fontFamily: 'NanumGothic-Bold',
    color: 'black',
  },
  title_time: {
    fontSize: 10,
    fontFamily: 'NanumGothic-Bold',
  },
  text: {fontFamily: 'NanumGothic-Bold', color: 'black', fontSize: 12},
  info: {
    flexDirection: 'column',
    margin: 20,
  },
  space: {width: 5},
  location: {margin: 20},
  location_text: {
    fontFamily: 'NanumGothic-Bold',
    color: 'black',
  },
  icon_container: {flexDirection: 'row', alignItems: 'center'},
  mapBtn: {
    backgroundColor: '#3C444C',
    width: 50,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    marginRight: 5,
  },
  mapBtn_text: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'NanumGothic-Bold',
    fontSize: 10,
  },
  map: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 10,
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  mapContainer: {
    flex: 1,
    width: Dimensions.get('screen').width - 40,
    height: 100,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContainer: {
    bottom: 0,
    marginBottom: 20,
    alignSelf: 'center',
    paddingTop: 10,
  },
  chatBtn: {
    width: 200,
    height: 35,
    backgroundColor: '#C9BAE5',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  chatBtn_text: {
    fontFamily: 'NanumGothic-Bold',
    fontWeight: 'bold',
    color: 'black',
  },
  appeal_icon: {position: 'absolute', right: 15, top: 10},
});
export default PostDetail;
