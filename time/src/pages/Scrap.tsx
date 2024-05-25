import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ListRenderItemInfo,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useState, useEffect} from 'react';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/Type';
interface RoomData {
  boardId: number;
  title: string;
  itemTime: string;
  itemPrice: number;
  createdDate: string;
  chatCount: number;
  scrapCount: number;
  distance: number;
  address: string;
  boardState: string;
  firstImage: string;
}
type MainNavigationProp = StackNavigationProp<RootStackParamList, 'Scrap'>;
const Scrap = () => {
  const [posts, setPosts] = useState<RoomData[]>([]);
  const navigation=useNavigation<MainNavigationProp>()
  const [pageNum,setPageNum]=useState<number>(0)
  const goToPostDetail=(boardId:number)=>{
    navigation.navigate('PostDetail',{boardId})
  }
  useEffect(() => {
    AsyncStorage.getItem('accessToken').then(token => {
      const accessToken = token ? JSON.parse(token) : null;
      console.log(accessToken);
      axios
        .get('http://13.125.118.92:8080/api/scrap-list', {
          params:{
            pageNum:pageNum
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(response => {
          const posts = JSON.stringify(response.data.data);
          if (posts) {
            const b = JSON.parse(posts);
            // setPosts(prev=>[...prev,...b]);
            setPosts(prev => {
              const newPosts = [...prev, ...b];
              // Set을 사용하여 중복 제거
              const uniquePosts = Array.from(new Set(newPosts.map(post => post.boardId)))
                .map(id => newPosts.find(post => post.boardId === id));
              return uniquePosts;
            });
          
          }
        })
        .catch(error => {
          console.error(error);
        });
    });
  }, [pageNum]);

  function timeDiffence(targetTime:Date):string{
    const koreanTime = new Date().getTime()
    const create=new Date(targetTime)
    const diffInMinutes = Math.floor((new Date(koreanTime).getTime() - targetTime.getTime()) / (1000 * 60));
    if(diffInMinutes<60){
      return `${diffInMinutes}분 전`
    }else if(diffInMinutes<60*24){
      const diffInHour=Math.floor(diffInMinutes/60)
      return `${diffInHour}시간 전`
    }else{
      const diffInDays=Math.floor(diffInMinutes/(60*24))
      return `${diffInDays}일 전`
    }
  }
  const handleScroll = (event: { nativeEvent: { layoutMeasurement: { height: any; }; contentOffset: { y: any; }; contentSize: { height: any; }; }; }) => {
    // 스크롤 뷰의 높이
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    // 스크롤된 위치
    const scrollOffset = event.nativeEvent.contentOffset.y;
    // 콘텐츠의 전체 높이
    const contentHeight = event.nativeEvent.contentSize.height;
  
    // 사용자가 스크롤의 끝에 도달했을 때, 다음 페이지를 요청합니다.
    if (scrollViewHeight + scrollOffset >= contentHeight) {
      // 현재 페이지 번호를 증가시킵니다.
      setPageNum(prev=>prev + 1);
    }
  };
  
  return (
    <View style={styles.main_container}>
      <FlatList
        data={posts}
        keyExtractor={item => String(item.boardId)}
        renderItem={({item}: ListRenderItemInfo<RoomData>) => (
          <TouchableOpacity style={styles.postContainer}
          onPress={() => {
            goToPostDetail(item.boardId);
            // postStackNavigator(item.boardId)
          }}>
            {item.firstImage?
            <FastImage
            source={{
              uri: `http://13.125.118.92:8080/images/jpg/${item.firstImage}`
            }}
            style={styles.post_image}
            // resizeMethod='resize'
            // onError={(error) => console.error("이미지 로딩 오류:", error)}
          />:
            <Image source={require('../assets/images/postingImage.png')}
            style={styles.post_image}
            
            />
            }
            <View style={styles.post_info}>
              <Text style={styles.info1}>
                {item.distance+"km"} · {timeDiffence(new Date(item.createdDate))}
              </Text>
              <Text style={styles.info2}>{item.title}</Text>

              <Text style={styles.info3}>
                {item.itemPrice+"원"}/{item.itemTime}
              </Text>
            </View>
            <View style={styles.appeal_icon}>
              <AntDesign name="heart" size={15} color={'#E7736F'} />

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
        onScroll={handleScroll}
        onEndReached={()=>{
          setPageNum(prev=>prev+1)
        }}
        onEndReachedThreshold={0.8}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  main_container: {
    height: Dimensions.get('screen').height,
    backgroundColor: 'white',
    flex: 1,
    paddingBottom:10
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
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 0.1,
    borderColor: 'black',
    marginTop:10,
  },
  post_image: {
    width: 95,
    height: 95,
    borderRadius: 25,
    // marginRight: 10,
    position: 'absolute',
    left: 10,
  },
  post_info: {
    flexDirection: 'column',
    marginLeft:115
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

export default Scrap;
