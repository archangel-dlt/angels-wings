from flask import Flask, redirect

app = Flask(__name__,
            static_url_path='',
            static_folder='static',
            template_folder='templates')

@app.route("/")
def home():
    return redirect("/index.html", code=302)

@app.route("/photo-id")
def photoId():
    return "Identifying a Photo"

if __name__ == "__main__":
    app.run(debug=True)
