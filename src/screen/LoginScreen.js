import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native'
import axios from 'axios'

const LoginScreen = ({setAuth}) => {
    const [Contact, setContact] = useState([])

    const GetContact = () => {
        axios({
            method : 'get',
            url : 'http://172.27.12.208:3000/contact',
            headers : {
                Accept : 'aplication/json'
            }
        }).then(res => {
            setContact(res.data.data)
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        GetContact()
    }, [])
    return(
        <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
            {
                Contact.map((list, index) =>
                    <TouchableOpacity key={index} onPress={() => setAuth({userId : list.id, username : list.name})}>
                        <View style={{marginTop : 20}}>
                            <Text style={{fontSize : 20}}>
                                {list.name}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )
            }
        </View>
    )
}

export default LoginScreen