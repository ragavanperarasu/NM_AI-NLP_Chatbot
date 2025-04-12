const express = require('express');
const cors = require('cors');
const { TextDecoder } = require('util');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const { prompt } = req.body;

  const ollamaRes = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'deepseek-r1:1.5b',
      prompt,
      stream: true,
    }),
  });

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
      
            // 🚫 Skip the initial thinking lines (prompt part)
            if (data.is_prompt === true || data.response.trim() === '</think>' || data.response.trim() === '<think>') continue;
      
            const word = data.response || '';
            res.write(word);
          } catch (err) {
            console.error('JSON parse error:', err.message);
          }
        }
      }
      
      
  }

  res.end();
});

app.listen(3001, () => {
  console.log('🚀 Server running on http://localhost:3001');
});
