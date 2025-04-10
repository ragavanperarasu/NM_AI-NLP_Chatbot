/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import { Provider as PaperProvider, Text, Appbar, TextInput, IconButton} from 'react-native-paper';
import { ScrollView, StyleSheet, View, ImageBackground, TouchableOpacity } from 'react-native';
import Logo from './assets/svg/message4.svg'


const messages = [
  { mstype: "bot", msg: "Hello! How can I help you?" },
  { mstype: "user", msg: "Hi, tell me about your services." },
  { mstype: "bot", msg: "Sure! We offer 24/7 support and free delivery." },
  { mstype: "user", msg: "Great! How do I place an order?" },
  { mstype: "bot", msg: "You can order through our app or website." },

  { mstype: "user", msg: "Can I track my order?" },
  { mstype: "bot", msg: "Yes! You can track your order in the 'My Orders' section." },

  { mstype: "user", msg: "Do you support cash on delivery?" },
  { mstype: "bot", msg: "Yes, we support cash on delivery in select areas." },

  { mstype: "user", msg: "How long will it take to deliver?" },
  { mstype: "bot", msg: "Most orders are delivered within 2–3 working days." },

  { mstype: "user", msg: "Is there a return policy?" },
  { mstype: "bot", msg: "Yes, you can return products within 7 days of delivery." },

  { mstype: "user", msg: "Thank you, that's helpful!" },
  { mstype: "bot", msg: "You're welcome! Let me know if you have more questions." },

  { mstype: "user", msg: "Do you have any discounts today?" },
  { mstype: "bot", msg: "Yes! Use code WELCOME10 to get 10% off your first order." },

  { mstype: "user", msg: "Cool, I'll try it now!" },
  { mstype: "bot", msg: "Awesome! Have a great shopping experience 😊" },
];


function App() {
  const [inputText, setInputText] = useState('');

  const [umsg, setUmsg] = useState([
    { mstype: "bot", msg: "Hello! 👋 How can I help you?", time: "06:30pm" },
    { mstype: "user", msg: "Hi, tell me about your services. 📦", time: "06:30pm" },
    { mstype: "bot", msg: "Sure! ✅ We offer 24/7 support 🕒 and fast delivery 🚚.", time: "06:31pm" },
    { mstype: "user", msg: "Do you have any discounts? 💸", time: "06:32pm" },
    { mstype: "bot", msg: "Yes! 🎉 Use code WELCOME10 to get 10% off. 🛍️", time: "06:32pm" },
    { mstype: "user", msg: "Nice! 😄 Can I return items? 🔄", time: "06:33pm" },
    { mstype: "bot", msg: "Yes, returns are accepted within 7 days. ✅📦", time: "06:33pm" },

  ]);
  

  function formatDate(date) {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
  
    return `${hours}:${minutes}${ampm}`;
  }
  
  
  function handleSend() {
    if (inputText.trim() === '') return;
  
    const now = new Date();
    const formattedTime = formatDate(now);
  
    setUmsg([
      ...umsg,
      { mstype: "user", msg: inputText, time: formattedTime }
    ]);
    setInputText('');
  }
  
  return (
    <PaperProvider>
      
    <ImageBackground
      source={require('./assets/svg/back.webp')} // 🖼️ your background image here
      style={styles.background}
      resizeMode="cover"
    >

<Appbar.Header style={{marginTop:10,backgroundColor:"transparent" }}>
        <View style={{marginLeft:10, marginRight:10}}>
        <Logo width={50} height={50} />
        </View>
      <Appbar.Content title="Shoping Chatbot" color='white' titleStyle={{fontFamily:'monospace', fontWeight:700}}/>
      <Appbar.Action icon="account-circle"  iconColor='white' size={40}/>
    </Appbar.Header>

      <ScrollView contentContainerStyle={styles.container}>
        {umsg.map((item, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              item.mstype === 'user' ? styles.userMessage : styles.botMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.msg}</Text>
            <Text style={{color:"#C6C6C6", fontSize:12}}>{item.time}</Text>

          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
      <TextInput
        value={inputText}
        onChangeText={setInputText}
        placeholder="Type your message..."
        mode="outlined"
        style={styles.input}
        outlineColor="gray"
        activeOutlineColor="#50514F"
        outlineStyle={{borderRadius:50, backgroundColor:"#50514F"}}
        textColor='white'
        placeholderTextColor={"white"}
        cursorColor='white'
        right={<TextInput.Icon icon="send" onPress={handleSend}/>}
        left={<TextInput.Icon icon="attachment"/>}
      />
      </View>

    </ImageBackground>
  </PaperProvider>
    
  );
}


const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    padding: 10,
    paddingBottom: 30,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#006D18',
    borderTopLeftRadius:10,
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#1C4B6D',
    borderTopRightRadius:10,
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10
  },
  messageText: {
    color:"white",
    fontSize: 16,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom:5,

    backgroundColor: 'transparent',

  },
  input: {
    flex: 1,
    marginRight: 5,
    backgroundColor: 'white',
    
  },
});

export default App;
