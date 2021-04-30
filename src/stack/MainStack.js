import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screen/HomeScreen'
import ContactScreen from '../screen/ContactScreen'
import ChatScreen from '../screen/ChatScreen'

const Stack = createStackNavigator();

const MainStack = () => {

    return(
        <Stack.Navigator backBehavior={'Home'}>
            <Stack.Screen name='Home' component={HomeScreen} options={{
                title : ''
            }}/>
            <Stack.Screen name='Contact' component={ContactScreen} options={{
                title : ''
            }}/>
            <Stack.Screen name='Chat' component={ChatScreen}/>
        </Stack.Navigator>
    )
}

export default MainStack