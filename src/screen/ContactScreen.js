import React, {useState, useEffect, useContext} from 'react'
import {View, Text, TouchableOpacity, Image, Button} from 'react-native'
import { AuthContext } from '../provider/AuthProvider'
import axios from 'axios'

const ContactScreen = ({navigation}) => {
    const {username} = useContext(AuthContext)
    const [User, setUser] = useState([]);
    const [Loading, setLoading] = useState(true)

    const GetContact = async () => {
        await axios({
          method : 'get',
          url : 'http://cerdas-staging.ap-southeast-1.elasticbeanstalk.com/api/user/student/contacts',
          headers : {
              'Accept-Language' : '',
              'Authorization' : `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzdHVkZW50QGNlcmRhcy5jb20iLCJwZXJtaXNzaW9uIjpbIlJPTEVfUEFHRVNfVklFVyIsIlJPTEVfRElTQ1VTU0lPTl9WSUVXIiwiUk9MRV9GSUxFU19WSUVXIiwiUk9MRV9BU1NJR05NRU5UX1ZJRVciLCJST0xFX0FOTk9VTkNFTUVOVF9WSUVXIiwiUk9MRV9DTEFTU19NQU5BR0VNRU5UX1ZJRVciLCJST0xFX1NDSEVEVUxFX1ZJRVciLCJST0xFX1NZTExBQlVTX1ZJRVciLCJST0xFX01PRFVMRV9WSUVXIiwiUk9MRV9BVFRFTkRBTkNFX1ZJRVciLCJST0xFX0RJU0NVU1NJT05fVVBEQVRFIl0sImV4cCI6MTYyMTg2NDMyOSwiaWF0IjoxNjIxODM1NTI5fQ.DgUjHQGDddbfizAKKlAngDA2ZdW-JxBeaGXjWtUDPdoByeOEHUE3SxcR2qghIfcgxH5ntwvmTrPzF80wafGy6w`,
              'Device-Id' : '',
              'Device-Type' : 1
          }
        }).then(res => {
            const newData = [...res.data.data.teachers].map(item => ({
                id_chat : null,
                id : item.userId,
                name : item.fullName,
                profileImg: `https://picsum.photos/id/${item.userId * 5}/200/300`,
            }));
            setUser(newData.filter(item => item.name !== username));
        }).catch(err => {
            console.log(err)
        })
        setLoading(false)
    }

    const CobaSearch = () => {
      setUser(User.filter(item => item.name === "Ridwan"))
    }

    useEffect(() => {
        GetContact()
    }, [])

    

    return(
        <View style={{flex: 1, backgroundColor: '#f5f5ff'}}>
      {Loading ? (
        <View>
          <Text>Loading...</Text>
        </View>
      ) : (
        // eslint-disable-next-line react-native/no-inline-styles
        <View style={{marginTop: 5, marginHorizontal : 20}}>
          <View style={{marginBottom : 10, flexDirection : 'row'}}>
            <Text style={{fontSize : 30}}>Contact</Text>
            <View style={{alignItems : 'flex-end', flex : 1, justifyContent : 'center'}}>
            <TouchableOpacity onPress={CobaSearch}>
              <View style={{backgroundColor : '#00e6e6', width : 40, height : 30, justifyContent : 'center', alignItems : 'center', borderRadius : 10}}>
                <Text style={{fontSize : 16, fontWeight : 'bold', color : 'white'}}>Cari</Text>
              </View>
              </TouchableOpacity>
            </View>
          </View>
          {User.map((list, index) =>
              <TouchableOpacity
                key={index}
                onPress={() =>
                  navigation.navigate('Chat', {
                    to: {
                      id: list.id,
                      id_chat : list.id_chat,
                      name: list.name,
                      profileImg: 'https://picsum.photos/id/10/200/300',
                    },
                  })
                }>
                <View style={{backgroundColor: '#fff', marginBottom: 10, borderRadius : 10}}>
                  <View
                    style={{
                      marginHorizontal: 10,
                      marginVertical: 10,
                      flexDirection: 'row',
                    }}>
                    <Image
                      source={{uri: list.profileImg}}
                      style={{width: 60, height: 60, borderRadius: 30}}
                    />
                    <View>
                        <Text style={{fontSize: 25, marginLeft: 20}}>
                        {list.name}
                        </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
          )}
        </View>
      )}
    </View>
    )
}

export default ContactScreen