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
}
const Scrap = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get('http://13.125.118.92:8080/api/scrap-list')
      .then((response: any) => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <View style={styles.main_container}>
      {/* 임시 */}
      <TouchableOpacity style={styles.postContainer}>
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
          <AntDesign name="heart" size={15} color={'#E7736F'} />
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
              source={require('../assets/images/post1.jpg')}
              style={styles.post_image}
            />
            <View style={styles.post_info}>
              <Text style={styles.info1}>
                {item.distance} · {item.createdDate}
              </Text>
              <Text style={styles.info2}>{item.title}</Text>
              <Text style={styles.info3}>10,000원/20분</Text>
            </View>
            <View style={styles.appeal_icon}>
              <AntDesign name="hearto" size={15} color={'red'} />
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
};
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

export default Scrap;
