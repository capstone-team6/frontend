import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';
import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Delete from 'react-native-vector-icons/MaterialIcons'
import Setting from 'react-native-vector-icons/AntDesign'
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/Type';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ListRenderItemInfo } from 'react-native';

interface KeywordData{
    keywordId:number
    title:string
    keyword:string
    boardId:number
    firstImage:string
    image:string
    time:string
}

interface ActivityData{
    nickName:string
    activityType:string
    time: string
    title:string
    traderName:string
    activityId:number
    
}

type SetNav=StackNavigationProp<RootStackParamList,'Notify'>
const Notify = () => {
    const [selectedTab, setSelectedTab] = useState('Activity');
    const navigation=useNavigation<SetNav>()
    const [keywordPosts,setKeywordPosts]=useState<KeywordData[]>([])
    const [keywordCount, setKeywordCount]=useState<number>(0)

    const goToNav=()=>{
        navigation.navigate('KeywordSet')
    }
    const goToPostDetail = (boardId: number) => {
        navigation.navigate('PostDetail', {boardId});
    };
    const [activityList, setActivityList]=useState<ActivityData[]>([])
    

    useEffect(()=>{
        AsyncStorage.getItem('accessToken').then(token=>{
            const accessToken=token?JSON.parse(token):null
            axios.get('http://13.125.118.92:8080/keyword',{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            })
            .then((res)=>{
                console.log(res.data)
                const Data=res.data
                console.log(Data)
                // const lastId=Data.keywordResponses.length > 0 ? Data.keywordResponses[Data.keywordResponses.length - 1].id : null;
                let count=0
                Data.keywordResponses.forEach((response: { id: any; keyword: any; memberId: any; }) => {
                    if (response.id && response.keyword && response.memberId) {
                        count++;
                    }
                })
                setKeywordCount(count)
            }) 
            .catch((error: any)=>{
                console.log(error)
            })
        })
    },[selectedTab])

    useEffect(()=>{
        AsyncStorage.getItem('accessToken').then(token=>{
            const accessToken=token?JSON.parse(token):null
            axios.get('http://13.125.118.92:8080/notification/keyword',{
                headers:{
                    Authorization: `Bearer ${accessToken}`
                }
            })
            .then(res=>{
                console.log(res)
                const data=JSON.stringify(res.data.keywordNotificationListDtos)
                console.log(data)
                if(data){
                    const d=JSON.parse(data).reverse()  
                    setKeywordPosts(d)
                }
            })
            .catch(err=>{
                console.log(err)
            })
        })
    },[selectedTab])

    useEffect(()=>{
        AsyncStorage.getItem('accessToken').then(token=>{
            const accessToken=token?JSON.parse(token):null
            axios.get('http://13.125.118.92:8080/notification/activity',{
                headers:{
                    Authorization: `Bearer ${accessToken}`
                }
            })
            .then(res=>{
                const data=JSON.stringify(res.data.activityNotificationListDtoList)
                if(data){
                    const d=JSON.parse(data)
                    setActivityList(d.reverse())
                }
            })
            .catch(err=>{
                console.log(err)
            })
        })
    },[selectedTab])

    const deleteActivity=(id:number)=>{
        AsyncStorage.getItem('accessToken').then(token=>{
            const accessToken=token?JSON.parse(token):null
            axios.delete(`http://13.125.118.92:8080/notification/activity/${id}`,{
                headers:{
                    Authorization: `Bearer ${accessToken}`
                }
            })
            .then(res=>{
                setActivityList(prevList => prevList.filter(activity => activity.activityId !== id));
            })
            .catch(err=>{
                console.log(err)
            })
        })
    }
    return (
        <View style={styles.container}>
            <View style={styles.options}>
                        <TouchableWithoutFeedback onPress={()=>setSelectedTab('Activity')}>
                            <View style={styles.tabItem}>
                                <Text style={[
                                    styles.option1,
                                    selectedTab === 'Activity' && styles.selectedOption,
                                    styles.tabTextMargin,
                                ]}>
                                활동 알림
                                </Text>
                                {selectedTab==='Activity'&&(
                                    <View style={styles.lineUnderOption}></View>
                                )}
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableNativeFeedback onPress={()=>setSelectedTab('Keyword')}>
                            <View style={styles.tabItem}>
                                <Text
                                style={[
                                    styles.option2,
                                    selectedTab === 'Keyword' && styles.selectedOption,
                                    styles.tabTextMargin,
                                ]}
                                >키워드 알림
                                </Text>
                                {selectedTab==='Keyword'&&(
                                    <View style={styles.lineUnderOption}></View>
                                )}
                            </View>
                        </TouchableNativeFeedback>
            </View>

            {selectedTab === 'Activity' && (
                <View style={{marginTop:30, flexGrow:1}}>
                    <FlatList 
                    data={activityList} 
                    renderItem={({item}:ListRenderItemInfo<ActivityData>)=>(
                        <TouchableOpacity style={styles.textContainer} >
                            {item.activityType==="SCRAP"?
                            <View style={{padding:15}}>
                                    <Delete name='close' size={20} style={{alignSelf:'flex-end'}} onPress={()=>deleteActivity(item.activityId)}/>
                                    <Text style={styles.text}>{item.nickName}님이 "{item.title}" 게시물을 좋아해요</Text>
                                    <Text style={styles.textTime}>{item.time}</Text>
                            </View>
                            :
                            <View style={{padding:15}}>
                                    <Delete name='close' size={20} style={{alignSelf:'flex-end'}} onPress={()=>deleteActivity(item.activityId)}/>
                                    <Text style={styles.text}>{item.traderName}님과 틈새 시간 거래를 완료 했어요!</Text>
                                    <Text style={styles.text}>{item.traderName}님에게 후기를 남겨주세요 💌</Text>
                                    <Text style={styles.textTime}>{item.time}</Text>
                            </View>
                            }
                        </TouchableOpacity>
                    )}>
                    </FlatList>
            </View>
            )}
            {selectedTab === 'Keyword' && (
                <View>
                    <View style={{margin:15}}>
                        <View style={{flexDirection:'row',alignSelf:'center', justifyContent:'center'}}>
                            <Text style={{textAlign:'center',color:'black', marginBottom:10,marginRight:10}}>현재 키워드 알림 {keywordCount}개</Text>
                            <Setting name='setting' size={20} style={{color:'black'}}
                            onPress={()=>goToNav()}
                            />
                        </View>
                        <FlatList 
                        data={keywordPosts} 
                        contentContainerStyle={{ flexGrow: 1 }}
                        renderItem={({item}:ListRenderItemInfo<KeywordData>)=>(
                            <TouchableOpacity
                            style={styles.postContainer} 
                            onPress={()=>{
                                goToPostDetail(item.boardId)
                            }}>
                                {item.image?
                                <Image
                                    source={{
                                    uri: `http://13.125.118.92:8080/images/jpg/${item.image}`}}
                                    style={styles.post_image}
                                    // onError={(error) => console.error("이미지 로딩 오류:", error)}
                                />:
                                <Image source={require('../assets/images/postingImage.png')}
                                style={styles.post_image}/>}

                            <View style={styles.post_info}>
                                <Delete name='close' size={15} style={styles.deleteIcon}/>
                                <Text style={styles.info2}>{item.keyword}- {item.title}</Text>
                                <Text style={styles.info1}>{item.time}</Text>
                            </View>
                            </TouchableOpacity>
                        )}>
                        </FlatList>
                    </View>
                </View>
            )}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('screen').height,
        backgroundColor: 'white',
        flex: 1,
        paddingBottom:100
        
    },
    options: {
        flexDirection: 'row',
        justifyContent: 'space-around', 
        marginTop: 40,
    },
    option1: {
        color: 'black',
        fontFamily: 'NanumGothic-Bold',
        fontSize: 15,
        textAlign:'center',
        
        
    },
    selectedOption: {
        fontWeight: 'bold',
        color: 'black',
    },
    tabTextMargin: {
        marginBottom: 20,
    },
    lineUnderOption: {
        borderBottomWidth: 2,
        borderBottomColor: 'black',
        width: '100%',
        alignSelf: 'center',
    },
    option2: {
        color: 'black',
        fontFamily: 'NanumGothic-Bold',
        fontSize: 15,
    },
    tabItem: {
        alignItems: 'center',
        width: Dimensions.get('screen').width/2,
        // marginBottom: -10,
    },
    textContainer:{
        borderWidth:0.3,
        borderColor:'gray',
        marginRight:20,
        marginLeft:20,
        marginBottom:10,
        borderRadius:7
    },
    text:{
        fontFamily:'NanumGothic-Regular',
        marginBottom:10,
        color:'black'
    },
    textTime:{
        color:'gray',
        fontFamily:'NanumGothic-Regular',
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
    deleteIcon:{
        position: 'absolute',
        top: 0,
        left: 200,
    }
})
export default Notify;