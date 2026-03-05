# Online Attendance System

A comprehensive web-based attendance management system built with Flask, featuring user authentication, attendance tracking, and administrative controls.

## Features

- **User Authentication**: Secure login/registration system with role-based access
- **Attendance Tracking**: Check-in/check-out functionality with automatic status detection
- **Role Management**: Student, Teacher, and Admin roles with different permissions
- **Admin Dashboard**: Comprehensive attendance management and reporting
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Attendance History**: Detailed attendance records with duration calculation
- **Real-time Status**: Automatic detection of late arrivals (after 9:00 AM)

## Technology Stack

- **Backend**: Flask (Python web framework)
- **Database**: SQLite (with SQLAlchemy ORM)
- **Authentication**: Flask-Login with password hashing
- **Frontend**: HTML templates with Tailwind CSS
- **Forms**: Flask-WTF with WTForms validation

## Installation

1. **Clone or download the project files to your local directory**

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   - Copy the `.env` file and update the `SECRET_KEY` for production
   - The default uses SQLite database (`attendance.db`)

4. **Run the application:**
   ```bash
   python app.py
   ```

5. **Access the application:**
   - Open your browser and navigate to `http://127.0.0.1:5000`

## Default Setup

The application automatically creates the database and tables on first run. You'll need to:

1. Register your first user account
2. Manually set the first user's role to 'admin' in the database if needed
3. Or create an admin user through the registration form

## User Roles

### Student
- Can mark attendance (check-in/check-out)
- View personal attendance history
- View dashboard with today's attendance status

### Teacher
- Same permissions as students
- Can be tracked for attendance purposes

### Admin
- All student/teacher permissions
- View all users in the system
- Access attendance records for any user
- View system statistics and reports

## Usage

### For Students/Teachers:
1. Register for an account or login
2. On the dashboard, click "Check In Now" to mark your arrival
3. The system automatically detects if you're late (after 9:00 AM)
4. Click "Check Out" at the end of your day
5. View your attendance history in the "History" section

### For Admins:
1. Login with admin credentials
2. Access the "Admin Panel" from the navigation
3. View all registered users
4. Click "View Attendance" for any user to see their detailed records
5. Monitor attendance patterns and statistics

## File Structure

```
harshada/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── .env                  # Environment variables
├── README.md             # This file
└── templates/
    ├── base.html         # Base template with navigation
    ├── login.html        # Login page
    ├── register.html     # Registration page
    ├── dashboard.html    # User dashboard
    ├── attendance_history.html  # Attendance history page
    ├── admin.html        # Admin panel
    └── admin_user_attendance.html  # User attendance details
```

## Database Schema

### Users Table
- `id`: Primary key
- `username`: Unique username
- `email`: Unique email address
- `password_hash`: Hashed password
- `role`: User role (student/teacher/admin)
- `created_at`: Account creation timestamp

### Attendance Table
- `id`: Primary key
- `user_id`: Foreign key to Users table
- `date`: Attendance date
- `check_in`: Check-in time
- `check_out`: Check-out time (nullable)
- `status`: Attendance status (present/late/absent)
- `created_at`: Record creation timestamp

## Security Features

- Password hashing with bcrypt
- Session-based authentication
- CSRF protection on forms
- Role-based access control
- Input validation and sanitization

## Customization

### Modify Late Threshold
Edit the check-in logic in `app.py` (line ~120) to change the late arrival time.

### Add New User Roles
1. Update the role choices in the registration form
2. Modify role-based access control in admin templates
3. Update role display logic throughout the application

### Database Migration
For production use, consider migrating from SQLite to PostgreSQL or MySQL by updating the `DATABASE_URL` in `.env`.

## Development

To extend the application:

1. Add new routes in `app.py`
2. Create corresponding templates in the `templates/` directory
3. Update the navigation in `base.html`
4. Add database models as needed

## Production Deployment

For production deployment:

1. Set a strong `SECRET_KEY` in `.env`
2. Use a production database (PostgreSQL/MySQL)
3. Configure a proper web server (Gunicorn + Nginx)
4. Set up HTTPS/SSL certificates
5. Configure proper logging and monitoring

## License

This project is open source and available under the MIT License.
