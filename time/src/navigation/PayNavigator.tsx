import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ChargePay from '../pages/ChargePay'
import MinusPay from '../pages/MinusPay'
import KakaoPay from '../pages/KakaoPay'

const Stack=createStackNavigator()
const PayNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='ChargePay' component={ChargePay}/>
            <Stack.Screen name='MinusPay' component={MinusPay}/>
            <Stack.Screen name='KakaoPay' component={KakaoPay}/>
            
        </Stack.Navigator>
    );
};

export default PayNavigator;