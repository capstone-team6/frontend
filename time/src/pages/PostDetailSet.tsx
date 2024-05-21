import { RouteProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { RootStackParamList } from '../../types/Type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import Mater from 'react-native-vector-icons/MaterialIcons'

type PostDetailSetRouteProps = RouteProp<RootStackParamList,'PostDetailSet'>;
type Nav=StackNavigationProp<RootStackParamList,'PostDetailSet'>
interface Props {
    route: PostDetailSetRouteProps;
}
type ImageType={
    uri:string;
    type:string;
    name:string;
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
    itemPrice: string;
    chatCount: number;
    scrapCount: number;
    address: string;
    longitude: number;
    latitude: number;
    boardState: string;
    category: string;
    boardType: string;
    images:ImageType [];
    who:string;
    }
const PostDetailSet:React.FC<Props> = ({route}) => {
    const {boardId} = route.params;
    const navigation=useNavigation<Nav>()
    const [boardData, setBoardData] = useState<BoardData|any>(null);

    useEffect(()=>{
        AsyncStorage.getItem('accessToken').then(item=>{
            const token=item ? JSON.parse(item) : null;
            console.log(token)
            axios
            .get(`http://13.125.118.92:8080/api/board/${boardId}`,{
                headers:{
                Authorization:`Bearer ${token}`
                }
            })
            .then(response => {
                console.log('Data received:', response.data);
                console.log(response.data.data.images)
                setBoardData(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        })
        },[route])
    
    const deleteAlert=()=>{
        Alert.alert('','게시글을 삭제하시겠습니까?',
        [
            {
                text: '취소',
                style: 'cancel',
            },
            {
                text: '확인',
                onPress: () => {
                    AsyncStorage.getItem('accessToken').then(item=>{
                        const token=item?JSON.parse(item):null
                        axios.delete(`http://13.125.118.92:8080/api/auth/board/${boardId}`,{
                            headers:{
                                Authorization:`Bearer ${token}`
                            }
                        })
                    .then(res=>{
                        console.log(res)
                        console.log('게시글 삭제됨');
                        navigation.navigate('틈새시장')
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                    })
                },
            },
        ],
        { cancelable: false })
    }

    const goToModify=()=>{
        navigation.navigate('PostingChange',{boardData})
    }

    return (
        <View style={styles.container}>
            <View style={styles.options}>
            <TouchableOpacity style={styles.options_detail} onPress={deleteAlert}>
                <AntDesign name='delete' size={40} color='black'/>
                <Text style={{fontFamily:'NanumGothic-Bold', color:'#313131', fontSize:16, marginRight:45}}>게시글 삭제</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options_detail} onPress={goToModify}>
                <Mater name='published-with-changes' size={40} color='black'/>
                <Text style={{fontFamily:'NanumGothic-Bold', color:'#313131', fontSize:16, marginRight:45}}>게시글 수정</Text>
            </TouchableOpacity>
        </View>
        </View>
    );
};

const styles=StyleSheet.create({
    container:{
        backgroundColor:'white',
        flex:1
    },
    options:{
        flexDirection:'column',
        alignItems:'center',
        marginTop:30,
    },
    options_detail:{
        flexDirection:'row',
        borderColor:'gray',
        borderWidth:0.5,
        width:300,
        height:80,
        margin:5,
        justifyContent:'space-around',
        alignItems:'center',
        borderRadius:7,
    }
})
export default PostDetailSet;