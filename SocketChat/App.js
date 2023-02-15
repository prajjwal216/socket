import React, { useState, useEffect } from 'react';
import { View, TextInput, Text } from 'react-native';
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
    socket.emit('chat message', { message: chatMessage, id: userId }); 
    console.log(chatMessage);
  };

  const renderedChatMessages = chatMessages.map((chatMessage, index) => {
    const style =
      chatMessage.id === userId 
        ? { color: 'blue', fontSize: 20, alignSelf: 'flex-end', marginRight: 20 } 
        : { color: 'black', fontSize: 20, alignSelf: 'flex-start', marginLeft: 20 }; 
    return (
      <Text key={index} style={[{ borderWidth: 1, padding: 10, margin: 10 }, style]}>
        {chatMessage.message}
      </Text>
    );
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginTop: 100, margin: '9%' }}>
        <TextInput
          style={{ height: 40, borderWidth: 2, borderColor: 'black' }}
          autoCorrect={false}
          value={chatMessage}
          onSubmitEditing={submitChatMessage}
          onChangeText={chatMessage => {
            setChatMessage(chatMessage);
          }}
        />
      </View>
      <View>{renderedChatMessages}</View>
    </View>
  );
}