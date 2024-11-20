import re
import mysql.connector
from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS

# Create Flask app
app = Flask(__name__)
CORS(app)

# MySQL configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'  # replace with your MySQL username
app.config['MYSQL_PASSWORD'] = 'Nax@tra@1'  # replace with your MySQL password
app.config['MYSQL_DB'] = 'chatbot_db'  # use your actual database name
mysql = MySQL(app)

# Function to validate password
def is_valid_password(password):
    regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
    return re.match(regex, password)

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data['username']
    password = data['password']

    # Validate password
    if not is_valid_password(password):
        return jsonify({
            'message': (
                'Password must be at least 8 characters long, '
                'include at least 1 uppercase letter, 1 lowercase letter, '
                '1 number, and 1 special character.'
            )
        }), 400

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM users WHERE username = %s', (username,))
    existing_user = cursor.fetchone()

    if existing_user:
        return jsonify({'message': 'Username already exists!'}), 409

    cursor.execute(
        'INSERT INTO users (username, password) VALUES (%s, %s)', 
        (username, hashed_password)
    )
    mysql.connection.commit()
    cursor.close()

    return jsonify({'message': 'User created successfully!'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM users WHERE username = %s', (username,))
    user = cursor.fetchone()

    if user and check_password_hash(user[2], password):
        return jsonify({'message': 'Login successful!'}), 200
    return jsonify({'message': 'Invalid credentials!'}), 401

if __name__ == "__main__":
    app.run(port=5001, debug=True)  # Ensure this runs on port 5000
