from flask import Flask, render_template, request, session, redirect, url_for
from openai import OpenAI
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = Flask(__name__)
app.secret_key = "your_secret_key"  # Replace with a secure random string in production

@app.route('/')
def index():
    if "messages" not in session:
        session["messages"] = []
    return render_template('index.html', messages=session["messages"])

@app.route('/chat', methods=['POST'])
def chat():
    role = request.form.get("role", "assistant")
    user_message = request.form.get("prompt")
    messages = session.get("messages", [])
    try:
        messages.append({"role": "user", "content": user_message})
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "system", "content": f"You are a {role}."}, *messages],
        )
        chatbot_message = response.choices[0].message.content
        messages.append({"role": "assistant", "content": chatbot_message})
        session["messages"] = messages
    except Exception as e:
        chatbot_message = f"An error occurred: {str(e)}"
        messages.append({"role": "assistant", "content": chatbot_message})
        session["messages"] = messages
    return render_template('index.html', messages=session["messages"])

@app.route('/new_chat', methods=['POST'])
def new_chat():
    session.pop("messages", None)
    return redirect(url_for('index'))

@app.route('/load_chat', methods=['POST'])
def load_chat():
    chat_id = request.form.get("chat_id")
    predefined_chats = {
        "1": [{"role": "assistant", "content": "Welcome to Recent Chat 1!"}],
        "2": [{"role": "assistant", "content": "Welcome to Recent Chat 2!"}],
    }
    session["messages"] = predefined_chats.get(chat_id, [])
    return redirect(url_for('index'))

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return redirect(url_for('index'))

if __name__ == "__main__":
    app.run(debug=True)