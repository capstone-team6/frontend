import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Photo from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import {RootStackParamList} from '../../types/Type';
import {RouteProp} from '@react-navigation/native';
import ChatScreen from './ChatScreen';
import {StackNavigationProp} from '@react-navigation/stack';
type ImageType = {
  uri: string;
  type: string;
  name: string;
};
type routeProp = RouteProp<RootStackParamList, 'AppealWrite'>;
type navigationProp = StackNavigationProp<RootStackParamList, 'ChatScreen'>;

interface Props {
  route: routeProp;
  navigation: navigationProp;
}

const AppealWrite: React.FC<Props> = ({route, navigation}) => {
  const objectId = route.params?.objectId;
  console.log(objectId);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [previews, setPreviews] = useState<{uri: string} | string[]>([]);
  const [images, setImages] = useState<ImageType[]>([]);

  const onSubmit = async () => {
    const body = new FormData();

    body.append('title', title);
    body.append('content', content);
    body.append('objectId', objectId);

    try {
      const store = await AsyncStorage.getItem('accessToken');
      const token = store ? JSON.parse(store) : null;
      console.log(token);

      const res = await axios.post(
        'http://13.125.118.92:8080/post/objection',
        body,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          transformRequest: [(data, headers) => data],
        },
      );
      if (res.status === 200) {
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  const onResponse = useCallback(async (response: any) => {
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
    ).then(res => {
      console.log(res.uri);
      setImages(prevState => [
        ...prevState,
        {
          uri: res.uri,
          name: response.name,
          type: response.mime.includes('png') ? 'image/png' : 'image/jpeg',
        },
      ]);
    });
  }, []);

  const onChangeFile = useCallback(() => {
    return ImagePicker.openPicker({
      includeExif: true,
      includeBase64: true,
      mediaType: 'photo',
      multiple: true,
    })
      .then((responses: any[]) => {
        return Promise.all(responses.map(response => onResponse(response)));
      })
      .catch(console.log);
  }, [onResponse]);

  return (
    <View style={styles.AppealWrite_container}>
      <View style={styles.section}>
        <Text
          style={{
            fontSize: 17,
            fontFamily: 'NanumGothic-Bold',
            color: 'black',
          }}>
          제목
        </Text>
        <TextInput
          placeholder="15자 이내 입력"
          style={styles.input}
          onChangeText={text => setTitle(text)}></TextInput>
      </View>
      <View style={styles.section}>
        <Text
          style={{
            fontSize: 17,
            fontFamily: 'NanumGothic-Bold',
            color: 'black',
          }}>
          내용
        </Text>
        <TextInput
          style={styles.inputContent}
          onChangeText={text => setContent(text)}></TextInput>
      </View>
      <View style={styles.container}>
        <Text style={styles.container_text}>사진</Text>
        <View style={styles.preview}>
          {/* {previews && <Image style={styles.previewImage} source={previews}/>} */}
          {Array.isArray(previews) &&
            previews.map((preview, index) => (
              // <Image key={index} style={styles.previewImage} source={{ uri: preview }} />
              <View key={index}>
                <Image style={styles.previewImage} source={{uri: preview}} />
                <TouchableOpacity onPress={() => deleteImage(index)}>
                  <Photo name="close" size={20} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          <TouchableOpacity onPress={onChangeFile}>
            <Photo name="add-a-photo" size={35} />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 60,
        }}>
        <TouchableOpacity>
          <Text
            style={styles.buttonC}
            onPress={() => {
              navigation.goBack();
            }}>
            취소
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onSubmit()}>
          <Text style={styles.buttonA}>신청하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  AppealWrite_container: {
    height: Dimensions.get('screen').height,
    backgroundColor: 'white',
  },
  container: {
    backgroundColor: 'white',
    flexDirection: 'column',
    marginHorizontal: 30,
  },
  section: {
    margin: 30,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    fontFamily: 'NanumGothic-Bold',
  },
  inputContent: {
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    fontFamily: 'NanumGothic-Bold',
    height: 200,
    textAlignVertical: 'top',
  },
  photoAdd: {
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    fontFamily: 'NanumGothic-Bold',
    height: 100,
    width: 100,
  },
  buttonA: {
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    borderRadius: 3,
    fontSize: 20,
    width: 90,
    height: 35,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#C9BAE5',
    fontFamily: 'NanumGothic-Regular',
  },
  buttonC: {
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    borderRadius: 3,
    fontSize: 20,
    width: 90,
    height: 35,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#D9D9D9',
    fontFamily: 'NanumGothic-Regular',
  },
  previewImage: {
    height: Dimensions.get('window').height / 8,
    resizeMode: 'contain',
    width: Dimensions.get('window').width / 4, // 화면의 너비의 1/4로 설정
    margin: 5, // 이미지들 간의 간격을 설정
  },
  preview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  previews: {
    marginHorizontal: 10,
    width: Dimensions.get('window').width / -20,
    height: Dimensions.get('window').height / 3,
    backgroundColor: '#D2D2D2',
    marginBottom: 10,
    // alignItems:'center'
  },
  container_text: {
    fontFamily: 'NanumGothic-Bold',
    fontSize: 15,
    color: '#000000',
    marginBottom: 10,
  },
});

export default AppealWrite;
