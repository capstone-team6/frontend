import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { RootStackParamList } from '../../types/Type';
import Scrap from '../pages/Scrap';
import PostDetail from '../pages/PostDetail';

const Stack = createStackNavigator<RootStackParamList>();

const ScrapStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='Scrap' component={Scrap} options={{
                headerTitle:'관심목록',
                headerTitleStyle:{
                    fontFamily: 'NanumGothic-Bold',
                    fontSize: 28,
                },
                
            }}/>
            <Stack.Screen name='PostDetail' component={PostDetail} options={{
                headerTransparent:true,
                headerTitle:'',
                
            }}/>
        </Stack.Navigator>
    );
};

export default ScrapStackNavigator;