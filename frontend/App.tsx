import React, { useState, useRef } from 'react';
import { Provider as PaperProvider, Text, Appbar, TextInput, IconButton } from 'react-native-paper';
import { ScrollView, StyleSheet, View, ImageBackground } from 'react-native';
import axios from 'axios';
import Logo from './assets/svg/message4.svg';
import Markdown from 'react-native-markdown-display';

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

  const scrollViewRef = useRef();

  const [umsg, setUmsg] = useState([

  ]);

  function formatDate(date) {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;

    return `${hours}:${minutes}${ampm}`;
  }


  async function handleSend() {
    if (inputText.trim() === '') return;
  
    const now = new Date();
    const formattedTime = formatDate(now);
  
    // Show user message
    setUmsg((prev) => [
      ...prev,
      { mstype: "user", msg: inputText, time: formattedTime },
    ]);
    setInputText('');
  
    try {
      const response = await axios.post('http://192.168.150.102:3002/chat', {
        prompt: inputText,
      });
  
      const word = response.data;
      const fullBotMsg = word.replace(/<think>.*?<\/think>/gs, '');
      console.log(fullBotMsg)
      typewriterEffect(fullBotMsg, formattedTime, setUmsg, scrollViewRef);
 // Use the typing effect
  
    } catch (error) {
      console.error('Error sending message to server:', error);
    }
  }
  
  

  function typewriterEffect(text, time, setUmsg, scrollViewRef) {
    let currentText = '';
    let index = 0;
    const typingSpeed = 30;
  
    setUmsg((prevMsgs) => [
      ...prevMsgs,
      { mstype: "bot", msg: "", time },
    ]);
  
    const interval = setInterval(() => {
      if (index < text.length) {
        currentText += text[index];
        setUmsg((prevMsgs) => {
          const updatedMsgs = [...prevMsgs];
          updatedMsgs[updatedMsgs.length - 1] = {
            ...updatedMsgs[updatedMsgs.length - 1],
            msg: currentText,
          };
          return updatedMsgs;
        });
  
        scrollViewRef.current?.scrollToEnd({ animated: true }); // 👈 Keep scrolling
  
        index++;
      } else {
        clearInterval(interval);
      }
    }, typingSpeed);
  }
  
  

  return (
    <PaperProvider>
      {/* <ImageBackground
        source={require('./assets/svg/back.jpeg')}
        style={styles.background}
        resizeMode="cover"
      > */}
      <View style={{height:"100%", backgroundColor:"#343a40"}}>
        <Appbar.Header style={{backgroundColor: "#40916c"}}>
          <View style={{ marginLeft: 10, marginRight: 10 }}>
            <Logo width={50} height={50} />
          </View>
          <Appbar.Content title="Shopping Chatbot" color="white" titleStyle={{ fontFamily: 'monospace', fontWeight: 700 }} />
          <Appbar.Action icon="account-circle" iconColor="white" size={40} />
        </Appbar.Header>

        <ScrollView contentContainerStyle={styles.container}
        
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {umsg.map((item, index) => (
            <View
              key={index}
              style={[
                styles.messageContainer,
                item.mstype === 'user' ? styles.userMessage : styles.botMessage,
              ]}
            >
             
<Markdown style={markdownStyles}>
  {item.msg}
</Markdown>
              <Text style={{ color: "#C6C6C6", fontSize: 12 }}>{item.time}</Text>
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
            outlineColor="#535E5F"
          
            activeOutlineColor="#3B3B3B"
            outlineStyle={{ borderRadius: 50, backgroundColor: "#535E5F"}}
            textColor="white"
            placeholderTextColor={"white"}
            cursorColor="white"
            right={<TextInput.Icon icon="send" onPress={handleSend} color={"white"} style={{backgroundColor:"#3a86ff", paddingLeft:5}}/>}
            left={<TextInput.Icon icon="attachment" />}
          />
        </View></View>
      {/* </ImageBackground> */}
    </PaperProvider>
  );
}

const markdownStyles = {
  body: {
    color: 'white',
    fontSize: 16,
  },
  strong: {
    fontWeight: 'bold',
    color:"#FFC2F9"
  },
  highlight: { color: '#FFD700' },
  number: { color: 'red', fontWeight: 'bold' },

  table: {
    borderWidth: 2,
    borderColor: '#AEBB80',
  },
  th: {
    borderWidth: 1,
    borderColor: '#AEBB80',
    padding: 6,
  },
  tr: {
    borderBottomWidth: 1,
    borderColor: '#AEBB80',
  },
  td: {
    padding: 6,
    borderWidth: 1,
    borderColor: '#AEBB80',
  },

  list_item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet_list_icon: {
    color: 'orange', // bullet point color (•)
  
  },
  ordered_list_icon: {
    color: '#FFECC2', // number color (1. 2. 3.)
  },
  list_item_text: {
    color: 'black', // text beside the marker
    fontSize: 16,
  },
  code_block: {
    backgroundColor: '#1e1e1e', // dark background for code blocks
    color: '#dcdcdc',           // text color inside code blocks
    fontFamily: 'Courier New',  // monospace font
    padding: 10,
    borderRadius: 8,
  },
  fence: {
    backgroundColor: '#1e1e1e',
    color: '#dcdcdc',
    fontFamily: 'Courier New',
    padding: 10,
    borderRadius: 8,
  },
  inlineCode: {
    backgroundColor: '#f5f5f5', // light background for inline code
    color: '#c7254e',           // inline code text color
    fontFamily: 'Courier New',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  
};


const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    padding: 10,
    paddingBottom: 30,
    backgroundColor:"#343a40",
 
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4a5759',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#5A696C',
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
  },
  messageText: {
    color: "white",
    fontSize: 16,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 5,
    paddingTop:5,
    backgroundColor: '#343a40',
  },
  input: {
    flex: 1,
    marginRight: 5,
    backgroundColor: 'white',
  },
  
  
  
});

export default App;
