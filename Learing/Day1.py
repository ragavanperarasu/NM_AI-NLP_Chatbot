print("hello")

'''
from transformers import pipeline

# Corrected pipeline task name
emotion_classifier = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", return_all_scores=True)

text = "I am really angry and frustrated right now."

results = emotion_classifier(text)[0]

# Sort results by score in descending order
sorted_results = sorted(results, key=lambda x: x['score'], reverse=True)

# Print emotions with their scores
for res in sorted_results:
    print(f"{res['label']}: {res['score']:.2f}")'''

'''

from textblob import TextBlob

# Your input text
text = "tha Prevous product I am used to brought is way too worse then ever , that made me frustrated "

# Create a TextBlob object
blob = TextBlob(text)

# Get sentiment
sentiment = blob.sentiment
print(blob.words)

for i in blob.tags:
    print(i)

print("Polarity:", sentiment.polarity)     # Range: [-1.0, 1.0]
print("Subjectivity:", sentiment.subjectivity)  # Range: [0.0, 1.0]
 

def get_sentiment_label(polarity):
    if polarity > 0:
        return "Positive 😊"
    elif polarity < 0:
        return "Negative 😠"
    else:
        return "Neutral 😐"

print("Sentiment:", get_sentiment_label(blob.sentiment.polarity))

print("")

print(blob.noun_phrases)
print(blob.word_counts)
print(blob.correct())


'''
'''
from transformers import pipeline

# Load emotion classification pipeline
emotion_classifier = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", return_all_scores=True)

def get_emotion(text):
    emotions = emotion_classifier(text)[0]
    # Sort by highest score
    sorted_emotions = sorted(emotions, key=lambda x: x['score'], reverse=True)
    
    # Get top emotion
    top_emotion = sorted_emotions[0]
    
    # Only return if it's angry or happy
    if top_emotion['label'].lower() in ['anger', 'joy']:
        return top_emotion['label'], round(top_emotion['score'], 2)
    else:
        return "neutral", round(top_emotion['score'], 2)

# Test
print(get_emotion("I am so happy to see you!"))       # → ('joy', 0.99)
print(get_emotion("This is the worst experience ever"))  # → ('anger', 0.95)


'''

'''

from transformers import pipeline

# Load the emotion classification pipeline
emotion_classifier = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base")

# Example text
text = "I feel so happy and excited about my new job!"

# Detect the emotion
emotion = emotion_classifier(text)

# Print the emotion label and score
print(emotion)

texts = [
    "I'm so happy with the service!",
    "This is really disappointing.",
    "I feel nothing at all.",
    "Why did they cancel my order without reason?"
]

for text in texts:
    result = emotion_classifier(text)[0]
    print(f"Text: {text}")
    print(f"Emotion: {result['label']} (Confidence: {result['score']:.2f})\n")

'''


'''
import language_tool_python

# Create a tool instance for English (US)
tool = language_tool_python.LanguageTool('en-US')

# Input sentence with clear grammar issues
text = "She go to temple."

# Get grammar matches
matches = tool.check(text)

# Print grammar issues
print(f"Issues Found: {len(matches)}\n")

for match in matches:
    print(f"Rule ID     : {match.ruleId}")
    print(f"Issue       : {match.message}")
    print(f"Context     : {match.context}")
    print(f"Suggestions : {match.replacements}")
    print("-" * 50)


from deep_translator import GoogleTranslator

translated = GoogleTranslator(source='english', target='tamil').translate("Welcome to our store!")
print(translated)

'''

import json
import random
import nltk
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from nltk.stem import WordNetLemmatizer

nltk.download('punkt')
nltk.download('wordnet')

# ---------------------------
# 1. Define Intents
# ---------------------------
intents = {
    "intents": [
        {
  "tag": "greeting",
  "patterns": ["Hi", "Hello", "Hey"],
  "responses": ["Hello {name}, how can I help you today?", "Hey there! What can I do for you, {name}?"]
}
,
{
  "tag": "introduction",
  "patterns": ["I am Ragavan", "My name is Kavi", "This is Ram", "I'm Meena"],
  "responses": ["Nice to meet you! How can I assist you today?"]
},
        {
            "tag": "product_inquiry",
            "patterns": ["I want to buy a phone", "Show me laptops", "Do you have shoes?"],
            "responses": ["Sure! We have several options, please check this:"]
        },
        {
            "tag": "place_order",
            "patterns": ["I want to order this", "Buy now", "Place an order"],
            "responses": ["Order placed! You'll receive confirmation soon."]
        }
    ]
}

# ---------------------------
# 2. Preprocess Intents
# ---------------------------
lemmatizer = WordNetLemmatizer()
all_words = []
tags = []
xy = []

for intent in intents['intents']:
    for pattern in intent['patterns']:
        tokens = nltk.word_tokenize(pattern)
        tokens = [lemmatizer.lemmatize(w.lower()) for w in tokens]
        all_words.extend(tokens)
        xy.append((tokens, intent['tag']))
    if intent['tag'] not in tags:
        tags.append(intent['tag'])

all_words = sorted(set(all_words))
tags = sorted(set(tags))

X = []
y = []

for (pattern, tag) in xy:
    bag = [1 if w in pattern else 0 for w in all_words]
    X.append(bag)
    y.append(tags.index(tag))

# ---------------------------
# 3. Train Classifier
# ---------------------------
clf = MultinomialNB()
clf.fit(X, y)

# ---------------------------
# 4. Helper Functions
# ---------------------------
def bag_of_words(sentence):
    tokens = nltk.word_tokenize(sentence)
    tokens = [lemmatizer.lemmatize(w.lower()) for w in tokens]
    return [1 if w in tokens else 0 for w in all_words]

def chat():
    print("\U0001F6CD Welcome to ShopBot! Type 'quit' to exit.")
    user_name = ""  # Stores the user's name if introduced
    while True:
        inp = input("You: ")
        if inp.lower() == "quit":
            break

        bow = bag_of_words(inp)
        result = clf.predict([bow])[0]
        tag = tags[result]

        if tag == "introduction":
            words = inp.split()
            for w in words:
                if w.lower() not in ['i', 'am', 'my', 'name', 'is', "i'm", "this"]:
                    user_name = w
                    break
            print(f"Bot: Nice to meet you, {user_name}! What would you like to do today?")
        else:
            for intent in intents['intents']:
                if intent['tag'] == tag:
                    response = random.choice(intent['responses'])
                    if "{name}" in response and user_name:
                        response = response.replace("{name}", user_name)
                    print("Bot:", response)


# ---------------------------
# 5. Run the Chatbot
# ---------------------------
if __name__ == "__main__":
    chat()


