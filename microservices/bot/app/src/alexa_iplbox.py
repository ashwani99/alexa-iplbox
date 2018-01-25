from src import app

@app.route('/')
@app.route('/index')
def home():
    return '<h1>Hello from Team - T66PF1</h1>\
    <p>Ashwani, Dhairya and Amal \U0001f604'
