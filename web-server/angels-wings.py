from flask import Flask

app = Flask(__name__,
            static_url_path='',
            static_folder='static',
            template_folder='templates')

@app.route("/")
def home():
    return "Hola"

if __name__ == "__main__":
    app.run(debug=True)
