import Geolocation from '@react-native-community/geolocation';
import React, {useCallback, useEffect, useRef, useState} from 'react';
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
  ScrollViewBase,
} from 'react-native';
import Geocoder from 'react-native-geocoding';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import {RootStackParamList} from '../../types/Type';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  NavigationProp,
  NavigationState,
  RouteProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeSyntheticEvent} from 'react-native';
import {NativeScrollEvent} from 'react-native';
import postStackNavigator from '../navigation/postNavigator';
import {RefreshControl} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';

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
interface SlideableCategoryButtonsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

type SearchProps = RouteProp<RootStackParamList, '틈새시장'>;
interface Props {
  route: SearchProps;
}

type MainNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;
type LoginNav = StackNavigationProp<RootStackParamList, 'LoginStackNavigation'>;
type SearchNav = StackNavigationProp<RootStackParamList, 'LocationSearch'>;

const Main: React.FC = () => {
  const {newAddress, newLocation} = useSelector(
    (state: RootState) => state.location,
  );

  useEffect(() => {
    Geocoder.init('AIzaSyCe4RbHkxkqRnuuvXUTEHXZ12zFT4tG5gQ', {
      language: 'ko',
      region: 'KR',
    });
  }, []);

  const navigation = useNavigation<MainNavigationProp>();
  const loginNavigation = useNavigation<LoginNav>();
  const goToPostDetail = (boardId: number) => {
    navigation.navigate('PostDetail', {boardId});
  };
  const goToSearch = useNavigation<SearchNav>();
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLocationSet, setIsLocationSet] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
      setRefreshing(false);
    }, 2000);
  };
  const [posts, setPosts] = useState<RoomData[]>([]);
  const [address, setAddress] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState('BUY');
  const handlerTab = (tab: string) => {
    setSelectedTab(tab);
    setPosts([]);
    setPageNum(0);
    setSelectedCategoryForBuy('');
    setSelectedCategoryForSell('');
  };

  const [selectedCategoryForBuy, setSelectedCategoryForBuy] = useState('');
  const [selectedCategoryForSell, setSelectedCategoryForSell] = useState('');

  const categories = [
    '재능기부',
    '운동',
    '심부름',
    '티켓팅',
    '오픈런',
    '나눔',
    '기타',
  ];

  const [pageNum, setPageNum] = useState<number>(0);
  // const totalPosts=posts.length
  // const postsPage=8 //한 페이지에 보여줄 게시물 개수
  // const totalPage=Math.ceil(totalPosts/postsPage)
  // const handelPageChange=(page:number)=>{
  //   setPageNum(page)
  // }
  // const startIndex=pageNum*postsPage
  // const endIndex=startIndex+postsPage
  // const currentPosts=posts.slice(startIndex,endIndex)
  const [boardState, setBoardState] = useState();

  const translateBoardState = (state: string | undefined) => {
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

  const convertToEnglish = (category: string) => {
    switch (category) {
      case '재능기부':
        return 'TALENT';
      case '운동':
        return 'EXERCISE';
      case '심부름':
        return 'ERRANDS';
      case '티켓팅':
        return 'TICKETING';
      case '오픈런':
        return 'WAITING';
      case '나눔':
        return 'FREE';
      case '기타':
        return 'ETC';
      default:
        return category;
    }
  };

  const handleSelectCategory = (category: string) => {
    if (selectedTab === 'BUY') {
      setSelectedCategoryForBuy(category);
      postData(category);
      setPosts([]);
      setPageNum(0);
    } else if (selectedTab === 'SELL') {
      setSelectedCategoryForSell(category);
      postData(category);
      setPosts([]);
      setPageNum(0);
    }
  };

  const SlideableCategoryButtons: React.FC<SlideableCategoryButtonsProps> = ({
    selectedCategory,
    onSelectCategory,
  }) => {
    // const scrollViewRef=useRef<ScrollView>(null)
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const {contentOffset, layoutMeasurement, contentSize} = event.nativeEvent;
      const currentPosition = contentOffset.x;
      const maxOffset = contentSize.width - layoutMeasurement.width;

      // 스크롤이 좌측 끝이거나 우측 끝에 도달했을 때 스크롤을 막습니다.
      if (currentPosition <= 0 || currentPosition >= maxOffset) {
        setScrollEnabled(false);
      } else {
        setScrollEnabled(true);
      }
    };

    return (
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
        style={styles.scrollView}
        onScroll={handleScroll}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.button,
              category === selectedCategory ? styles.selectedButton : null,
            ]}
            onPress={() => onSelectCategory(category)}>
            <Text style={styles.buttonText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };
  function locationPost(){
    requestPermission().then(result => {
      console.log({result});
      if (result === 'granted') {
        Geolocation.getCurrentPosition(
          pos => {
            if (newLocation) {
              setLocation(newLocation);
            } else {
              setLocation(pos.coords);
            }
            // const latitude=pos.coords.latitude
            // const longitude=pos.coords.longitude
            Geocoder.from(pos.coords.latitude, pos.coords.longitude, 'ko').then(
              json => {
                console.log(json);
                const addressComponent = json.results[0].formatted_address;
                const desireAddress = addressComponent.split(', ')[0];
                const words = desireAddress.split(' ');
                const lastAddress = `${words[1]} ${words[2]} ${words[3]} ${words[4]}`;

                if (newAddress) {
                  setAddress(newAddress);
                } else {
                  setAddress(lastAddress);
                }
                // console.log(longitude,latitude,address)

                if (address) {
                  AsyncStorage.getItem('kakaoId').then(id => {
                    const kakaoId = id;

                    const locationData = {
                      longitude: location?.longitude,
                      latitude: location?.latitude,
                      address: address,
                      kakaoId: kakaoId,
                    };

                    console.log(
                      location?.longitude,
                      location?.latitude,
                      address,
                      newLocation,
                    );
                    console.log(kakaoId);

                    axios
                      .post(
                        'http://13.125.118.92:8080/api/auth/point',
                        locationData,
                        {
                          headers: {
                            'Content-Type': 'application/json',
                          },
                        },
                      )

                      .then(res => {
                        console.log(res.data);
                        setIsLocationSet(true);
                      })
                      .catch(error => {
                        console.log(error);
                      });
                  });
                }
              },
            );
          },
          error => {
            console.log(error);
          },
          {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 10000,
          },
        );
      }
    });
  }
  useEffect(() => {
    locationPost()
  }, [
    selectedTab,
    selectedCategoryForBuy,
    selectedCategoryForSell,
    address,
    newLocation,
  ]);

  const postData = async (category: string) => {
    AsyncStorage.getItem('accessToken')
      .then(token => {
        const accessToken = token ? JSON.parse(token) : null;
        console.log(accessToken);
        axios
          .get('http://13.125.118.92:8080/api/board', {
            params: {
              pageNum: pageNum,
              boardType: selectedTab,
              category: convertToEnglish(category),
            },
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(response => {
            const boards = JSON.stringify(response.data.data.boards);
            console.log(boards);
            if (boards) {
              const b = JSON.parse(boards);

              // setPosts(prev=>[...prev,...b])
              setPosts(prev => {
                b.map((board: any) => setBoardState(board.boardState));
                setBoardState;
                const newPosts = [...prev, ...b];
                console.log('boardState', boardState);
                // Set을 사용하여 중복 제거
                const uniquePosts = Array.from(
                  new Set(newPosts.map(post => post.boardId)),
                ).map(id => newPosts.find(post => post.boardId === id));
                return uniquePosts;
              });
            }
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => console.warn(error));
  };
  useEffect(() => {
    AsyncStorage.getItem('accessToken')
      .then(token => {
        const accessToken = token ? JSON.parse(token) : null;
        console.log(accessToken);
        if (isLocationSet) {
          postData(
            selectedTab === 'BUY'
              ? selectedCategoryForBuy
              : selectedCategoryForSell,
          );
        }
      })
      .catch(error => console.warn(error));
  }, [
    selectedTab,
    isLocationSet,
    pageNum,
    address,
    newAddress,
    newLocation,
    location,
  ]);
  useFocusEffect(
    useCallback(() => {
      locationPost(); // 화면 focus 시 위치 정보 업데이트
      // 현재 선택된 탭에 따라 데이터를 다시 불러옴
      postData(selectedTab === 'BUY' ? selectedCategoryForBuy : selectedCategoryForSell);
    }, [])
  );
  const handleLoadMore = () => {
    setPageNum(pageNum + 1);
  };
  const goToLocationSearch = () => {
    goToSearch.navigate('LocationSearch');
  };
  const handleScroll = (event: {
    nativeEvent: {
      layoutMeasurement: {height: any};
      contentOffset: {y: any};
      contentSize: {height: any};
    };
  }) => {
    // 스크롤 뷰의 높이
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    // 스크롤된 위치
    const scrollOffset = event.nativeEvent.contentOffset.y;
    // 콘텐츠의 전체 높이
    const contentHeight = event.nativeEvent.contentSize.height;

    // 사용자가 스크롤의 끝에 도달했을 때, 다음 페이지를 요청합니다.
    if (scrollViewHeight + scrollOffset >= contentHeight) {
      // 현재 페이지 번호를 증가시킵니다.
      setPageNum(prev => prev + 1);
    }
  };

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
  return (
    // <ScrollView
    // refreshControl={
    //   <RefreshControl
    //   refreshing={refreshing}
    //   onRefresh={onRefresh}
    //   />
    // }
    // onScroll={(event)=>{
    //   const scrollPosition = event.nativeEvent.contentOffset.y;
    //   const scrollOffset = event.nativeEvent.contentSize.height - event.nativeEvent.layoutMeasurement.height;
    //   if (scrollPosition === 0 && !refreshing) {
    //     onRefresh();
    //   }
    // }}
    // scrollEventThrottle={16}
    // >
    <View style={styles.main_container}>
      <TouchableOpacity onPress={goToLocationSearch}>
        <View style={styles.location}>
          <Text style={styles.location_text}>
            {address ? address : 'Loading...'}
          </Text>
          <AntDesign name="caretdown" size={13} style={styles.down_icon} />
        </View>
      </TouchableOpacity>

      <View style={styles.options}>
        <View>
          <View style={{flexDirection: 'row', width: '100%'}}>
            <TouchableWithoutFeedback onPress={() => handlerTab('BUY')}>
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
            <TouchableWithoutFeedback onPress={() => handlerTab('SELL')}>
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

          <View style={{marginTop: 10}}>
            {selectedTab === 'BUY' ? (
              <SlideableCategoryButtons
                selectedCategory={selectedCategoryForBuy}
                onSelectCategory={handleSelectCategory}
              />
            ) : (
              <SlideableCategoryButtons
                selectedCategory={selectedCategoryForSell}
                onSelectCategory={handleSelectCategory}
              />
            )}
          </View>
        </View>
      </View>
      {/* 
      <View style={{flexGrow:1}}> */}
      <FlatList
        data={posts}
        keyExtractor={item => item.boardId.toString()}
        renderItem={({item}: ListRenderItemInfo<RoomData>) => (
          <TouchableOpacity
            style={styles.postContainer}
            onPress={() => {
              goToPostDetail(item.boardId);
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
                <View style={{width: 5}}></View>
                <View
                  style={{
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: 'black',
                  }}>
                  <Text style={styles.boardStateText}>
                    {translateBoardState(boardState)}
                  </Text>
                </View>
              </Text>

              <Text style={styles.info2}>{item.title}</Text>
              <Text style={styles.info3}>
                {item.itemPrice + '원'}/{item.itemTime}
              </Text>
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
            <View
              style={{
                backgroundColor: '#C9BAE5',
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'flex-end',
                width: 60,
              }}></View>
          </TouchableOpacity>
        )}
        onScroll={handleScroll}
        onEndReached={() => {
          setPageNum(prev => prev + 1);
        }}
        onEndReachedThreshold={0.8}
      />
      {/* </View> */}
    </View>
    //  </ScrollView>
  );
};

const styles = StyleSheet.create({
  main_container: {
    height: Dimensions.get('screen').height + 70,
    backgroundColor: 'white',
    flex: 1,
    paddingBottom: 10,
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
    marginLeft: 115,
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
    // maxHeight: 50,
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
    fontSize: 11,
    borderRadius: 10,
    borderColor: 'black',
    padding: 3,
    alignSelf: 'center',
    justifyContent: 'center',
    color: 'black',
    fontFamily: 'NanumGothic',
  },
});
export default Main;
