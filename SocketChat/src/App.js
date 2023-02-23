import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import io from 'socket.io-client';

export default function App() {
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const socket = io('http://192.168.0.120:5000');
    setUserId(Math.random().toString(36).substring(7));
    socket.on('chat message', msg => {
      setChatMessages(prevMessages => [...prevMessages, msg]);
    });
  }, []);

  const submitChatMessage = () => {
    const socket = io('http://192.168.0.120:5000');
    socket.emit('chat message', {message: chatMessage, id: userId});
    console.log(chatMessage);
  };

  const renderedChatMessages = chatMessages.map((chatMessage, index) => {
    const style =
      chatMessage.id === userId
        ? {
            color: 'white',
            fontSize: 20,
            alignSelf: 'flex-end',
            marginRight: 20,
            backgroundColor: 'blue',
          }
        : {
            color: 'white',
            fontSize: 20,
            alignSelf: 'flex-start',
            marginLeft: 20,
            backgroundColor: 'green',
          };
    return (
      <Text
        key={index}
        style={[{borderWidth: 1, padding: 10, margin: 10}, style]}>
        {chatMessage.message}
      </Text>
    );
  });

  return (
    <ScrollView>
      <View style={{flex: 1}}>
        <View
          style={{marginTop: 100, margin: '5%', flexDirection: 'row', flex: 1}}>
          <TextInput
            style={{
              height: 40,
              borderWidth: 2,
              borderColor: 'black',
              width: '75%',
            }}
            autoCorrect={false}
            value={chatMessage}
            onChangeText={chatMessage => {
              setChatMessage(chatMessage);
            }}
          />
          <TouchableOpacity
            onPress={submitChatMessage}
            style={{
              backgroundColor: 'black',
              borderRadius: 5,
              padding: 5,
              height: 40,
              marginLeft: 10,
              width: 70,
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: 'black',
              borderWidth: 3,
            }}>
            <Text style={{color: 'white'}}>Send</Text>
          </TouchableOpacity>
        </View>
        <View>{renderedChatMessages}</View>
      </View>
    </ScrollView>
  );
}
