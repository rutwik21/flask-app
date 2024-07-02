import os
from fileinput import filename 
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()

db = SQLAlchemy()
app = Flask(__name__)

db_user = os.getenv('DB_USER')
db_pass = os.getenv('DB_PASS')
db_name = os.getenv('DB_NAME')
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://{db_user}:{db_pass}@localhost/{db_name}".format(
    db_user=db_user, db_pass = db_pass, db_name=db_name
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Models
class User(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=False, nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(250), nullable=False)
    profile = db.Column(db.String(250), nullable=True)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"Name : {self.name}, Email: {self.email}, Profile: {self.profile}, Password: {self.password}"
    

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
bcrypt = Bcrypt(app)

@app.route('/signup', methods=['POST'])
@cross_origin()
def handle_singup():
    if request.method == 'POST':
        try:
            reqData = request.get_json(force=True)
            isEmailPresent = User.query.filter_by(email=reqData["email"]).first()
            if not isEmailPresent:
                hashed_password = bcrypt.generate_password_hash(reqData["password"]).decode('utf-8') 
                user = User(
                    name=reqData["name"],
                    email=reqData["email"],
                    password=hashed_password,
                    profile=None,
                )
                db.session.add(user)
                db.session.commit()
                
                return jsonify({"success":True})
            else:
                return jsonify({"success":False, "massage":"Email already present"})
        except Exception as err:
            print('Handling run-time error:', err)
            return jsonify({"success":False, "massage":"Email already present"})
    else:
        return jsonify({"success":False})

@app.route('/signin', methods=['POST'])
@cross_origin()
def handle_signin():
    if request.method == 'POST':
        try:
            reqData = request.get_json(force=True)
            user = User.query.filter_by(email=reqData["email"]).first()
            if user:
                isPassMatch = bcrypt.check_password_hash(user.password,reqData["password"])
                if isPassMatch:
                    print(user)
                    return jsonify({"success":True, "userId":user.id, "name":user.name, 'email': user.email})
                else:
                    return jsonify({"success":False, "massage":"Passwords do not match"})

            else:
                return jsonify({"success":False, "massage":"No user found"})
        except:
            return jsonify({"success":False, "massage":"Something went wrong!"})
    else:
        return jsonify({"success":False, "massage":"Something went wrong!"})

@app.route('/user/<int:id>', methods=['GET'])
@cross_origin()
def handle_user(id):
    if request.method == 'GET':
        try:
            user = User.query.get(id)
            return jsonify({"success":True, "name":user.name, 'email': user.email})
        except:
            return jsonify({"success":False, "massage":"User not found!"})
    else:
        return jsonify({"success":False, "massage":"Something went wrong!"})
 
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=os.getenv("PORT"))