import React, {useState, useEffect, useContext} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {AuthContext} from '../provider/AuthProvider';

const HomeScreen = ({navigation}) => {
  const {socket} = useContext(AuthContext);
  const [User, setUser] = useState([]);
  const [Search, setSearch] = useState('')
  const [Loading, setLoading] = useState(true);


  useEffect(() => {
  
    socket.emit('FETCH_USER_CONVERSATION', Search)
    socket.on('USER_CONVERSATION_SENT', data => {
        const newData = [...data].map(item => ({
            id_chat : item.id,
            id : item.userId,
            name : item.userName,
            message : item.lastMessage.content,
            unread : item.unRead,
            profileImg: `https://picsum.photos/id/${item.userId * 5}/200/300`,
        }));
        setUser(newData);
        setLoading(false)
    })

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setSearch(Search === '' ? 'Ridwan' : '')} style={{marginRight : 25}}>
           <Text style={{fontSize : 20}}>
            {
              Search === '' ? 'Cari' : 'Batal'
            }
           </Text>
        </TouchableOpacity>
       )
    })
  }, [Search]);


  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{flex: 1, backgroundColor: '#f5f5ff'}}>
      {Loading ? (
        <View>
          <Text>Loading...</Text>
        </View>
      ) : (
        // eslint-disable-next-line react-native/no-inline-styles
        <View style={{marginTop: 5, marginHorizontal : 20}}>
          <View style={{marginBottom : 10, flexDirection : 'row'}}>
            <Text style={{fontSize : 30}}>Chat</Text>
            <View style={{alignItems : 'flex-end', flex : 1, justifyContent : 'center'}}>
              <TouchableOpacity onPress={() => navigation.navigate('Contact')}>
                <View style={{backgroundColor : '#00e6e6', width : 40, height : 30, justifyContent : 'center', alignItems : 'center', borderRadius : 10}}>
                  <Text style={{fontSize : 20, fontWeight : 'bold', color : 'white'}}>+</Text>
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
                        <View style={{flexDirection : 'row'}}>
                          <Text numberOfLines={1} style={{marginLeft : 20, marginTop : 5, width : 270}}>
                              {list.message}
                          </Text>
                          {
                            list.unread > 0 ?
                            <View style={{width : 20, backgroundColor : 'pink', borderRadius : 10, justifyContent : 'center', alignItems : 'center'}}>
                            <Text>
                              {list.unread}
                            </Text>
                          </View> : null
                          }
                        </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default HomeScreen;
