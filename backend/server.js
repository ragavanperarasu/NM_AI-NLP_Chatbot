const express = require('express');
const cors = require('cors');
const { TextDecoder } = require('util');
const { MongoClient } = require('mongodb');
const stringSimilarity = require('string-similarity');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB setup
const MONGO_URI = 'mongodb://localhost:27017';
const client = new MongoClient(MONGO_URI);
let db;

async function connectDB() {
  await client.connect();
  db = client.db('chatbotDB');
  console.log('✅ Connected to MongoDB');
}
connectDB();

// RAG-powered chat endpoint
app.post('/chat', async (req, res) => {
  const { prompt } = req.body;
  console.log("Request : ", prompt);

  let fullResponse = '';

  // Step 1: Retrieve and fuzzy match products from MongoDB
  const allProducts = await db.collection('products').find().toArray();
  const threshold = 0.3;

  const products = allProducts.filter(p => {
    const combined = (p.product_name + ' ' + (p.category || '')).toLowerCase();
    const score = stringSimilarity.compareTwoStrings(prompt.toLowerCase(), combined);
    return score >= threshold;
  });

  console.log(products)
  let context = '';
  if (products.length > 0) {
    context = products.map((p, i) =>
      `Product ${i + 1}:\nName: ${p.product_name}\nPrice: ₹${p.price}\nMade In: ${p.made_in}\nSpec: ${p.spec}`
    ).join('\n\n');
  } else {
    context = 'No product data matched.';
  }

  // Step 2: Build prompt with context
  const finalPrompt = `You are a helpful shopping assistant for my shop. my shop name Quick Mart. Use the following product data to answer the user's question. if products available you give product details simple table or list format. \n\n${context}\n\nUser: ${prompt}\n\nAssistant:`;
  console.log("final prompt : ", finalPrompt);

  // Step 3: Send to Ollama (DeepSeek LLM)
  const ollamaRes = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'deepseek-r1:1.5b',
      prompt: finalPrompt,
      stream: true,
    }),
  });

  // Step 4: Stream response back to client
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const reader = ollamaRes.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.trim().split('\n');

    for (const line of lines) {
      if (line) {
        try {
          const data = JSON.parse(line);
          if (data.is_prompt === true) continue;

          const word = data.response || '';
          fullResponse += word;
          //process.stdout.write(word);
          res.write(word);
        } catch (err) {
          console.error('JSON parse error:', err.message);
        }
      }
    }
  }

  // Step 5: Optionally save the chat to DB
  await db.collection('chats').insertOne({
    prompt,
    response: fullResponse,
    timestamp: new Date(),
  });

  res.end();
});



app.listen(3001, () => {
  console.log('Server Running at Port : 3001');
});
