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
