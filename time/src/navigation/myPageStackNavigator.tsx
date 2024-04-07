// StackNavigator.tsx

import React from 'react';
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack';
import Profile from '../pages/Profile';
import Mypage from '../pages/Mypage';
import Notify from '../pages/Notify';
import { SafeAreaView, View } from 'react-native';
import { Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MyBuyTime from '../pages/MyBuyTime';
import MySellTime from '../pages/MySellTime';
import Pay from '../pages/Pay';
import Appeal from '../pages/Appeal';
import AppealWriteIcon from 'react-native-vector-icons/FontAwesome'
import AppealWrite from '../pages/AppealWrite';
import { RootStackParamList } from '../../types/myPageType';
import { useNavigation } from '@react-navigation/native';


const Stack = createStackNavigator();
type writeNavigation=StackNavigationProp<RootStackParamList,'Appeal'>

const StackNavigator:React.FC = () => {
    const navigation=useNavigation<writeNavigation>()
    const goToWrite=()=>{
        navigation.navigate('AppealWrite')
    }
    return (
            <Stack.Navigator>
                <Stack.Screen name='나의틈새' component={Mypage} 
                options={{ 
                        header:()=>(
                            <SafeAreaView>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 80,backgroundColor:'white' }}>
                                    <Text style={{ fontFamily: 'NanumGothic-Bold', fontSize: 28, color:'black' }}>나의 틈새</Text>
                                    <Ionicons name='settings-outline' size={25} color='black' style={{marginRight: 20}}/>
                                </View>
                            </SafeAreaView>
                        )
                    }}
                        />
                <Stack.Screen name="Profile" component={Profile} 
                options={{
                    headerTitle:'프로필',
                    headerTitleStyle:{
                        fontFamily:'NanumGothic-Bold',
                        fontSize: 28, color:'black',
                    },
                    headerStyle:{
                        height:80
                    }
                }}
                />
                <Stack.Screen name="MyBuyTime" component={MyBuyTime} 
                options={{
                    headerTitle:'구매내역',
                    headerTitleStyle:{
                        fontFamily:'NanumGothic-Bold',
                        fontSize: 28, color:'black'
                    }
                }}
                />
                <Stack.Screen name='MySellTime' component={MySellTime}
                options={{
                    headerTitle:'판매내역',
                    headerTitleStyle:{
                        fontFamily:'NanumGothic-Bold',
                        fontSize: 28, color:'black'
                    }
                }}
                />
                <Stack.Screen name='Notify' component={Notify}
                options={{
                    headerTitle:'공지사항',
                    headerTitleStyle:{
                        fontFamily:'NanumGothic-Bold',
                        fontSize: 28, color:'black'
                    }
                }}
                />
                <Stack.Screen name='Pay' component={Pay}
                options={{
                    headerTitle:'틈새페이',
                    headerTitleStyle:{
                        fontFamily:'NanumGothic-Bold',
                        fontSize: 28, color:'black'
                    },
                }}
                />
                <Stack.Screen name='Appeal' component={Appeal}
                options={{
                    headerTitle:'이의신청',
                    headerTitleStyle:{
                        fontFamily:'NanumGothic-Bold',
                        fontSize: 28, color:'black'
                    },
                    headerRight:()=>(
                    <AppealWriteIcon name='pencil-square-o' size={35} style={{marginRight:20,paddingTop:10}} onPress={goToWrite}/>
                    )
                }}
                />
                <Stack.Screen name='AppealWrite' component={AppealWrite}
                options={{
                    headerTitle:'이의신청 작성',
                    headerTitleStyle:{
                        fontFamily:'NanumGothic-Bold',
                        fontSize: 28, color:'black'
                    },
                    headerTitleAlign:'center'
                }}
                />
            </Stack.Navigator>
            )
        }

export default StackNavigator;
