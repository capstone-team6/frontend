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
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../types/Type';
import axios from 'axios';

type PostDetailRouteProps = RouteProp<RootStackParamList, 'PostDetail'>;
interface Props {
  route: PostDetailRouteProps;
}

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
  itemPrice: number;
  chatCount: number;
  scrapCount: number;
  address: string;
  longitude: number;
  latitude: number;
  boardState: string;
  category: string;
  boardType: string;
  images: string[];
}

const PostDetail: React.FC<Props> = ({route}) => {
  const boardId = route.params;

  const [isScrap, setIsScrap] = useState(false);
  const [boardData, setBoardData] = useState<BoardData | null>(null);

  const handleHeartPress = async (boardId: number) => {
    const newScrapValue = !isScrap;
    try {
      setIsScrap(newScrapValue);
      const res = await axios.post(
        `http://13.125.118.92:8080/api/board/1/scrap`,
        {
          isScrap: newScrapValue,
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
      .get(`http://13.125.118.92:8080/api/board/1`)
      .then(response => {
        console.log('Data received:', response.data);
        setBoardData(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // const dateStr = boardData?.itemTime;
  // const date = new Date(dateStr);

  // const options = {
  //   year: 'numeric',
  //   month: 'long',
  //   day: 'numeric',
  //   hour: 'numeric',
  //   minute: 'numeric',
  //   second: 'numeric',
  //   hour12: false,
  //   timeZone: 'Asia/Seoul',
  // };

  // const koreanDateStr = date.toLocaleDateString('ko-KR', options);

  return (
    <View style={styles.PostDetail_container}>
      <View style={styles.postingImg}>
        <Image
          source={require('../assets/images/logo.png')}
          style={{height: 133, width: 124}}
        />
      </View>

      <View style={styles.user}>
        <View style={styles.user_info}>
          <Image
            style={styles.user_profile}
            source={require('../assets/images/profile.png')}
          />
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.user_name}>{boardData?.nickname}</Text>
            <View style={styles.icon_container}>
              <AntDesign name="message1" size={13} color="black" />
              <Text>{boardData?.chatCount}</Text>
            </View>
            <View style={styles.icon_container}>
              <AntDesign name="hearto" size={13} color="black" />
              <Text>{boardData?.scrapCount}</Text>
            </View>
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
        </View>
      </View>

      <View style={styles.title}>
        <TouchableOpacity style={styles.categoryBtn}>
          <Text style={styles.categoryBtn_text}>{boardData?.title}</Text>
        </TouchableOpacity>
        <Text style={styles.title_text}>{boardData?.content}</Text>
        <View style={styles.title_location}>
          <Text style={styles.title_time}>{boardData?.address}</Text>
          <Text style={styles.title_time}>1분 전</Text>
        </View>
        <View style={{height: 5}} />
        <Text style={styles.title_content}>{boardData?.content}</Text>
      </View>

      <View style={styles.info_detail}>
        <Text style={styles.text}>시간대</Text>
        <View style={{width: 15}} />
        <Text style={styles.text}>지금 당장</Text>
      </View>
      <View style={{height: 10}} />
      <View style={styles.info_detail}>
        <Text style={styles.text}>가격</Text>
        <View style={{width: 28}} />
        <Text style={styles.text}>{boardData?.itemPrice}</Text>
      </View>

      <View style={styles.location}>
        <Text style={styles.location_text}>틈새위치</Text>
      </View>

      <View style={styles.mapContainer}>
        <AntDesign name="location-pin" size={13} color="black" />
        <View style={styles.map}>
          <TouchableOpacity style={styles.mapBtn}>
            <Text style={styles.mapBtn_text}>지도보기</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.chatBtn}>
          <Text style={styles.chatBtn_text}> 채팅하기</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    backgroundColor: '#D9D9D9',
    width: Dimensions.get('screen').width - 40,
    height: 100,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContainer: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 20,
    alignSelf: 'center',
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
