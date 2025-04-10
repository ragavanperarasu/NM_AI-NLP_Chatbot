<<<<<<< HEAD
This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
=======
🤖 AI Chatbot using DeepSeek R1 (1.5B) with RAG

This project is an AI-powered chatbot application using the **DeepSeek R1 1.5B model** with **Retrieval-Augmented Generation (RAG)**. It allows users to chat with a locally hosted LLM, with support for custom knowledge base retrieval using **MongoDB** and a clean **React Native** frontend. The backend is built using **Node.js** and **Express.js**.

✨ Features

- 🔍 **RAG-based Chatbot**: Combines a lightweight LLM with MongoDB vector search for relevant document retrieval.
- 🧠 **DeepSeek R1 (1.5B)** model: Efficient and lightweight LLM run locally via [Ollama](https://ollama.com).
- 💬 **Real-time Chat UI**: Built with React Native and React Native Paper.
- 📦 **Node.js Backend**: Handles chat logic, vector embeddings, and communication with MongoDB.
- 🗃️ **MongoDB Vector Store**: Stores knowledge base documents with embedded vectors for RAG.
- 📱 **Cross-platform mobile app** using React Native.


🏗️ Architecture


User (React Native App)
       |
       v
Node.js Server (Express.js)
       |
       |---> MongoDB (Vector DB for RAG)
       |
       |---> Ollama (DeepSeek R1 model for response generation)


📁 Folder Structure


root/
├── backend/         # Node.js + Express + MongoDB + RAG logic
│   ├── routes/
│   ├── rag/
│   ├── controllers/
│   └── index.js
├── frontend/        # React Native app
│   ├── components/
│   ├── screens/
│   └── App.js
├── docs/            # Sample documents for RAG
└── README.md



🚀 Getting Started

1. Clone the Repo


git clone https://github.com/yourusername/your-chatbot-project.git
cd your-chatbot-project


2. Setup the Backend

Install Dependencies


cd backend
npm install


Start MongoDB

Make sure MongoDB is running. If using MongoDB Atlas, set the connection string in `.env`.

env
MONGO_URI=mongodb://localhost:27017/chatbotDB


Start Ollama with DeepSeek R1


ollama run deepseek-coder:1.5b

Run Backend

```bash
node index.js
```

---

3. Setup the Frontend

Install Dependencies

```bash
cd ../frontend
npm install
```

Run React Native App

```bash
npx react-native run-android # or run-ios
```


🧠 RAG Pipeline (How it Works)

1. **User sends a query** via chat.
2. **Server searches MongoDB** using vector similarity to retrieve relevant documents.
3. Retrieved context is **combined with the user query**.
4. Combined input is sent to the **DeepSeek R1 model** via Ollama.
5. **Model generates a response** and sends it back to the app.


📚 Add Custom Knowledge Base

Add your documents in `docs/` folder and use the embedding script (in `backend/rag/embed.js`) to store vectors in MongoDB.


🔧 Technologies Used

- **Frontend**: React Native, React Native Paper
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Vector Search)
- **LLM**: DeepSeek R1 1.5B via Ollama
- **Embedding**: `ollama.embeddings` API or compatible tool


📝 Future Improvements

- 🔔 Push notifications
- 🌐 Web version with React.js
- 🗂️ Admin dashboard to manage documents
- 🧪 Test coverage for RAG logic


📸 Screenshots

> _Coming soon..._


💡 Contributing

Pull requests are welcome. For major changes, please open an issue first.


📜 License

[MIT License](LICENSE)
>>>>>>> 2f4fec9b348bec472415ae943c6c81a555047a2d
