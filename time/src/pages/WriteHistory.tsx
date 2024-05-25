import React, {useEffect, useRef, useState} from 'react';
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
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import {RootStackParamList} from '../../types/Type';
import {RouteProp} from '@react-navigation/native';
import { number } from 'prop-types';

type tRouteProp = RouteProp<RootStackParamList, 'WriteHistory'>;

interface Props {
  route: tRouteProp;
}

const data = [
  {
    boardId: 21,
    title: '강아지',
    itemTime: '5분',
    itemPrice: 1000,
    createdDate: '2024-05-20T19:49:15.784+09:00',
    chatCount: 0,
    scrapCount: 0,
    distance: null,
    address: '경기도 용인시 처인구',
    boardState: 'SALE',
    firstImage: null,
    boardType: 'BUY',
  },
  {
    boardId: 20,
    title: 'ㅂㄴ',
    itemTime: '1시간',
    itemPrice: 1000,
    createdDate: '2024-05-20T18:21:38.173+09:00',
    chatCount: 0,
    scrapCount: 0,
    distance: null,
    address: '경기도 용인시 처인구',
    boardState: 'SALE',
    firstImage: null,
    boardType: 'BUY',
  },
];
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
  boardType: string;
}
const WriteHistory: React.FC<Props> = ({route}) => {
  const [pageNum, setPageNum]=useState<number>(0)
  const userId = route.params.userId;
  console.log('userId', userId);
  const [selectedTab, setSelectedTab] = useState('BUY');
  const [posts, setPosts] = useState<RoomData[]>([]);
  const filteredPosts = posts?.filter(post => post.boardType === selectedTab);
  useEffect(() => {
    axios
      .get(`http://13.125.118.92:8080/users/${userId}/boards/write`)
      .then(response => {
        console.log(JSON.stringify(response.data.data));
        const data = JSON.stringify(response.data.data);
        console.log('Received data', data);
        if (data) {
          const d = JSON.parse(data);
          setPosts(prev=>[...prev,...d]);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

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

  const translateBoardState = (state: string) => {
    switch (state) {
      case 'SALE':
        return '판매 중';
      case 'RESERVED':
        return '예약 중';
      case 'SOLD':
        return '판매 완료';
      default:
        return state;
    }
  };
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
      <View style={styles.options}>
        <View>
          <View style={{flexDirection: 'row', width: '100%'}}>
            <TouchableWithoutFeedback onPress={() => setSelectedTab('BUY')}>
              <View style={[{alignItems: 'center', width: '50%'}]}>
                <Text
                  style={[
                    styles.option1,
                    selectedTab === 'BUY' && styles.selectedOption,
                    styles.tabTextMargin,
                  ]}>
                  구매글
                </Text>
                {selectedTab === 'BUY' && (
                  <View style={[styles.lineUnderOption]}></View>
                )}
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => setSelectedTab('SELL')}>
              <View style={[{alignItems: 'center', width: '50%'}]}>
                <Text
                  style={[
                    styles.option2,
                    selectedTab === 'SELL' && styles.selectedOption,
                    styles.tabTextMargin,
                  ]}>
                  판매글
                </Text>
                {selectedTab === 'SELL' && (
                  <View style={[styles.lineUnderOption]}></View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
      
        <FlatList
          data={filteredPosts}
          keyExtractor={item => item.boardId.toString()}
          renderItem={({item}: ListRenderItemInfo<RoomData>) => (
            <TouchableOpacity
              style={styles.postContainer}
              onPress={() => {
                // goToPostDetail(item.boardId);
                // postStackNavigator(item.boardId)
              }}>
              {item.firstImage ? (
                <Image
                  source={{
                    uri: `http://13.125.118.92:8080/images/jpg/${item.firstImage}`,
                  }}
                  style={styles.post_image}
                  // resizeMethod='resize'
                  // onError={(error) => console.error("이미지 로딩 오류:", error)}
                />
              ) : (
                <Image
                  source={require('../assets/images/postingImage.png')}
                  style={styles.post_image}
                />
              )}
              <View style={styles.post_info}>
                <Text style={styles.info1}>
                  {item.distance + 'km'} ·{' '}
                  {timeDiffence(new Date(item.createdDate))}
                </Text>
                <Text style={styles.info2}>{item.title}</Text>
                <Text style={styles.info3}>
                  {item.itemPrice + '원'}/{item.itemTime}
                </Text>
              </View>
              <View style={styles.appeal_icon}></View>
              <View style={styles.interactionContainer}>
                <View
                  style={{
                    backgroundColor: '#C9BAE5',
                    borderRadius: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 65,
                  }}>
                  <Text style={styles.boardStateText}>
                    {translateBoardState(item.boardState)}
                  </Text>
                </View>

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
    height: Dimensions.get('screen').height + 70,
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
    marginTop: 10,
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
  info3: {
    fontFamily: 'NanumGothic-bold',
    fontSize: 13,
    color: '#3C444C',
    fontWeight: 'bold',
  },
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
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#E8EAEC',
  },
  selectedButton: {
    backgroundColor: '#C9BAE5',
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'NanumGothic',
  },
  scrollView: {
    maxHeight: 50,
  },
  selectedOption: {
    fontWeight: 'bold',
    color: 'black',
  },
  lineUnderOption: {
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    width: '100%',
    alignSelf: 'center',
  },
  tabTextMargin: {
    marginBottom: 20,
  },
  boardStateText: {
    fontSize: 12,

    padding: 3,
    alignSelf: 'center',
    justifyContent: 'center',
    color: 'black',
    fontFamily: 'NanumGothic',
  },
});
export default WriteHistory;
