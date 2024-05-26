import { RouteProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, ListRenderItemInfo, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { RootStackParamList } from '../../types/Type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { StackNavigationProp } from '@react-navigation/stack';

type NavigationProp = StackNavigationProp<RootStackParamList, 'SearchList'>;
type KeywordProps=RouteProp<RootStackParamList,'SearchList'>
interface Props{
    route:KeywordProps
}
interface SlideableCategoryButtonsProps {
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}
interface RoomData {
    boardId: number;
    title: string|null;
    createdDate: string;
    chatCount: number|null;
    scrapCount: number|null;
    distance: number|null;
    address: string|null;
    boardState: string|null;
    firstImage: string|null;
    itemTime: string|null;
    itemPrice: number|null;
}
const SearchList:React.FC<Props> = ({route}) => {
    const {key}=route.params||null
    console.log(key)
    const [keyword,setKeyword]=useState<string>(key)
    const [posts, setPosts] = useState<RoomData[]>([]);
    const [pageNum, setPageNum]=useState<number>(0)
    const categories = [
        '재능기부',
        '운동',
        '심부름',
        '티켓팅',
        '오픈런',
        '나눔',
        '기타',
    ];
    
    const [selectedTab, setSelectedTab] = useState('BUY');
    const [selectedCategoryForBuy, setSelectedCategoryForBuy] =
    useState('');
    const [selectedCategoryForSell, setSelectedCategoryForSell] =
    useState('');

    const handleSelectCategory = (category: string) => {
        if (selectedTab === 'BUY') {
            setSelectedCategoryForBuy(category);
            setPosts([])
        } else if (selectedTab === 'SELL') {
            setSelectedCategoryForSell(category);
            setPosts([])
        }
    };
    const navigation = useNavigation<NavigationProp>();
    const goToPostDetail = (boardId: number) => {
        navigation.navigate('PostDetail', {boardId});
    };
    const handleLoadMore=()=>{
        setPageNum(pageNum+1)
    }
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
    const SlideableCategoryButtons: React.FC<SlideableCategoryButtonsProps> = ({
        selectedCategory,
        onSelectCategory,
    }) => {
        // const scrollViewRef=useRef<ScrollView>(null)
        const [scrollEnabled, setScrollEnabled] = useState(true);
        const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
            const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
            const currentPosition = contentOffset.x;
            const maxOffset = contentSize.width - layoutMeasurement.width;

          // 스크롤이 좌측 끝이거나 우측 끝에 도달했을 때 스크롤을 막습니다.
            if (currentPosition <= 0 || currentPosition >= maxOffset) {
            setScrollEnabled(false);
            } else {
            setScrollEnabled(true);
            }
        };
        const handleCategoryPress = (category: string) => {
            setScrollEnabled(false); // 버튼을 누를 때 스크롤을 막습니다.
            onSelectCategory(category);
        };
        return (
            <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            // contentContainerStyle={styles.container}
            style={styles.scrollView}
            onScroll={handleScroll}
            scrollEnabled={scrollEnabled}
            >
            
            {categories.map((category, index) => (
                <TouchableOpacity
                key={index}
                style={[
                    styles.button,
                    category === selectedCategory ? styles.selectedButton : null,
                ]}
                onPress={() => handleCategoryPress(category)}>
                <Text style={styles.buttonText}>{category}</Text>
                </TouchableOpacity>
            ))}
            </ScrollView>
        );
    };
    


    useEffect(()=>{
        const {key}=route.params||null
        console.log(key)
        if(!key){
            return
        }
        setKeyword(key)
        console.log("keyword"+key)
        AsyncStorage.getItem('accessToken').then((token)=>{
            const accessToken=token?JSON.parse(token):null
            console.log(accessToken)
            axios.get('http://13.125.118.92:8080/api/board', {
                params: {
                    keyword:keyword,
                    pageNum: 0,
                    boardType:selectedTab,
                    category:  selectedTab === 'BUY'
                    ? convertToEnglish(selectedCategoryForBuy)
                    : convertToEnglish(selectedCategoryForSell),
                    
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            }
                )
                .then((response) => {
                    console.log(response.data.data.boards)
                    const boards=JSON.stringify(response.data.data.boards)
                    console.log(boards)
                    if(boards && boards.length > 0){
                        const b=JSON.parse(boards)
                        setPosts(b)
                    }else{
                        setPosts([])
                    }
                })
                .catch(error=>{
                    console.log(error)
                    setPosts([])
                })
                })
    },[ selectedTab, selectedCategoryForBuy, selectedCategoryForSell])


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
    return (
        <View style={styles.container}>
            <View style={styles.keywordInput}>
                <Text style={styles.keyword}>{keyword}</Text>
            </View>
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
      {posts&& (
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
                {item.firstImage ?
                    <FastImage
                        source={{
                            uri: `http://13.125.118.92:8080/images/jpg/${item.firstImage}`
                        }}
                        style={styles.post_image}
                        // resizeMethod='resize'
                        // onError={(error) => console.error("이미지 로딩 오류:", error)}
                    /> :
                    <Image source={require('../assets/images/postingImage.png')}
                            style={styles.post_image}
                    />
                }
                <View style={styles.post_info}>
                    <Text style={styles.info1}>
                        {item.distance + "km"} · {timeDiffence(new Date(item.createdDate))}
                    </Text>
                    <Text style={styles.info2}>{item.title}</Text>
                    <Text style={styles.info3}>
                        {item.itemPrice + "원"}/{item.itemTime}
                    </Text>
                </View>
                <View style={styles.appeal_icon}></View>
                <View style={styles.interactionContainer}>
                    <View style={styles.interactionItem}>
                        <Feather name="message-circle" size={15}/>
                        <Text style={styles.interactionText}>{item.chatCount}</Text>
                    </View>
                    <View style={styles.interactionItem}>
                        <AntDesign name="hearto" size={15}/>
                        <Text style={styles.interactionText}>{item.scrapCount}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
    />
)}

        </View>
    );
};

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
        // alignItems:'center',
        
    },
    keywordInput:{
        textAlign:'center',
        borderRadius:5,
        backgroundColor:'#E9E9E9',
        marginTop:10,
        width:Dimensions.get('screen').width/1.3,
        alignSelf:'center',
        height:45,
    
    },
    keyword:{
        fontSize:20,
        color:'gray',
        marginVertical:10,
        marginLeft:20,
        fontFamily:'NanumGothic-Regular'
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
    scrollView: {
        maxHeight: 50,
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
      postContainer: {
        width: '95%',
        height: 110,
        borderRadius: 5,
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderWidth: 0.1,
        borderColor: 'black',
        marginTop:10
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

})

export default SearchList;