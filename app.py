from flask import Flask, render_template, redirect, url_for, flash, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, SelectField, DateField, TimeField
from wtforms.validators import DataRequired, Length, EqualTo
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, date
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///attendance.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# Models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), default='student')  # student, teacher, admin
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    attendances = db.relationship('Attendance', backref='user', lazy=True)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Attendance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    check_in = db.Column(db.Time, nullable=False)
    check_out = db.Column(db.Time)
    status = db.Column(db.String(20), default='present')  # present, absent, late
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Forms
class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=4, max=20)])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=4, max=20)])
    email = StringField('Email', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    role = SelectField('Role', choices=[('student', 'Student'), ('teacher', 'Teacher')], default='student')
    submit = SubmitField('Register')

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Routes
@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and user.check_password(form.password.data):
            login_user(user)
            flash('Login successful!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid username or password', 'error')
    
    return render_template('login.html', form=form)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    form = RegistrationForm()
    if form.validate_on_submit():
        if User.query.filter_by(username=form.username.data).first():
            flash('Username already exists', 'error')
            return render_template('register.html', form=form)
        
        if User.query.filter_by(email=form.email.data).first():
            flash('Email already exists', 'error')
            return render_template('register.html', form=form)
        
        user = User(username=form.username.data, email=form.email.data, role=form.role.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        
        flash('Registration successful! Please login.', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html', form=form)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out', 'info')
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    today = date.today()
    today_attendance = Attendance.query.filter_by(user_id=current_user.id, date=today).first()
    
    return render_template('dashboard.html', 
                         today_attendance=today_attendance,
                         current_date=today.strftime('%Y-%m-%d'))

@app.route('/check_in', methods=['POST'])
@login_required
def check_in():
    today = date.today()
    existing_attendance = Attendance.query.filter_by(user_id=current_user.id, date=today).first()
    
    if existing_attendance:
        flash('You have already checked in today!', 'error')
        return redirect(url_for('dashboard'))
    
    current_time = datetime.now().time()
    status = 'present'
    
    # Check if late (after 9:00 AM)
    if current_time.hour > 9 or (current_time.hour == 9 and current_time.minute > 0):
        status = 'late'
    
    attendance = Attendance(
        user_id=current_user.id,
        date=today,
        check_in=current_time,
        status=status
    )
    
    db.session.add(attendance)
    db.session.commit()
    
    flash(f'Checked in at {current_time.strftime("%H:%M:%S")}!', 'success')
    return redirect(url_for('dashboard'))

@app.route('/check_out', methods=['POST'])
@login_required
def check_out():
    today = date.today()
    attendance = Attendance.query.filter_by(user_id=current_user.id, date=today).first()
    
    if not attendance:
        flash('You need to check in first!', 'error')
        return redirect(url_for('dashboard'))
    
    if attendance.check_out:
        flash('You have already checked out today!', 'error')
        return redirect(url_for('dashboard'))
    
    current_time = datetime.now().time()
    attendance.check_out = current_time
    db.session.commit()
    
    flash(f'Checked out at {current_time.strftime("%H:%M:%S")}!', 'success')
    return redirect(url_for('dashboard'))

@app.route('/attendance_history')
@login_required
def attendance_history():
    attendances = Attendance.query.filter_by(user_id=current_user.id).order_by(Attendance.date.desc()).all()
    return render_template('attendance_history.html', attendances=attendances)

@app.route('/admin')
@login_required
def admin():
    if current_user.role != 'admin':
        flash('Access denied!', 'error')
        return redirect(url_for('dashboard'))
    
    users = User.query.all()
    return render_template('admin.html', users=users)

@app.route('/admin/attendance/<int:user_id>')
@login_required
def admin_user_attendance(user_id):
    if current_user.role != 'admin':
        flash('Access denied!', 'error')
        return redirect(url_for('dashboard'))
    
    user = User.query.get_or_404(user_id)
    attendances = Attendance.query.filter_by(user_id=user_id).order_by(Attendance.date.desc()).all()
    return render_template('admin_user_attendance.html', user=user, attendances=attendances)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
