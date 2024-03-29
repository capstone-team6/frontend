import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Main from '../pages/Main';
import Mypage from '../pages/Mypage';
import Scrap from '../pages/Scrap';
import Posting from '../pages/Posting';
import Chatting from '../pages/Chatting';
import Octicons from 'react-native-vector-icons/Octicons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'


const Tab=createBottomTabNavigator()
const BottmTabNavigation = () => {
    return (
        <Tab.Navigator initialRouteName='main'
        screenOptions={{
            tabBarStyle:{
                height: 70,
            },
            tabBarLabelStyle:{
                marginBottom:10,
            },
            headerStyle:{
                height:80
            },
            tabBarActiveTintColor: '#C9BAE5',

        }}
        >
            <Tab.Screen 
            name='틈새시장' 
            component={Main}
            options={{
                headerTitleStyle:{
                    color:'#352456',
                    fontFamily:'Gugi-Regular',
                    fontSize:35,
                    paddingTop:20,
                    marginHorizontal:10,
                },
                tabBarLabel:'홈',
                tabBarIcon: ()=> <Octicons name='home' size={20}/>
            }}
            />
            <Tab.Screen 
            name='관심목록' 
            component={Scrap}
            options={{
                tabBarLabel:'관심',
                tabBarIcon:()=><AntDesign name='hearto' size={20}/>
            }}
            />
            <Tab.Screen 
            name='글 작성' 
            component={Posting}
            options={{
                tabBarLabel:'',
                tabBarIcon:()=><AntDesign name='pluscircle' size={35}/>
            }}
            />
            <Tab.Screen 
            name='채팅' 
            component={Chatting}
            options={{
                tabBarLabel:'채팅',
                tabBarIcon:()=><Ionicons name='chatbubble-outline' size={20}/>
            }}
            />
            <Tab.Screen 
            name='나의 틈새' 
            component={Mypage}
            options={{
                tabBarLabel:'마이',
                tabBarIcon:()=><Ionicons name='person-outline' size={20}/>
            }}
            />
        </Tab.Navigator>
    );
};

export default BottmTabNavigation;