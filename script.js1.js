let users = JSON.parse(localStorage.getItem("users")) || {};
let timetable = JSON.parse(localStorage.getItem("timetable")) || [];

// Function to fetch and update the timetable
function fetchTimetable() {
    let newTimetable = [
        { subject: "Math", time: "09:00" },
        { subject: "Physics", time: "11:00" },
        { subject: "Chemistry", time: "13:00" }
    ];

    if (JSON.stringify(newTimetable) !== JSON.stringify(timetable)) {
        timetable = newTimetable;
        localStorage.setItem("timetable", JSON.stringify(timetable));
        scheduleReminders();
    }
}

// Function to schedule reminders for upcoming classes
function scheduleReminders() {
    timetable.forEach(classItem => {
        let classTime = new Date();
        let [hours, minutes] = classItem.time.split(":");
        classTime.setHours(hours, minutes - 5, 0);

        let now = new Date();
        let timeDifference = classTime - now;
        if (timeDifference > 0) {
            setTimeout(() => {
                alert(`Reminder: Your ${classItem.subject} class starts in 5 minutes.`);
            }, timeDifference);
        }
    });
}

// Function to load user profile data
function loadUserData() {
    let currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
        let profileData = JSON.parse(localStorage.getItem(`profile_${currentUser}`)) || {};
        document.getElementById("fullName").value = profileData.fullName || "";
        document.getElementById("idNumber").value = profileData.idNumber || "";
        document.getElementById("phoneNumber").value = profileData.phoneNumber || "";
        document.getElementById("departmentName").value = profileData.departmentName || "";
        document.getElementById("email").value = profileData.email || "";
    }
}

// Function to save user profile
function saveProfile() {
    let currentUser = localStorage.getItem("currentUser");
    let profileData = {
        fullName: document.getElementById("fullName").value,
        idNumber: document.getElementById("idNumber").value,
        phoneNumber: document.getElementById("phoneNumber").value,
        departmentName: document.getElementById("departmentName").value,
        email: document.getElementById("email").value
    };
    localStorage.setItem(`profile_${currentUser}`, JSON.stringify(profileData));
    alert("Profile saved successfully!");
}

// Function to handle login process
function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    if (users[username] && users[username] === password) {
        localStorage.setItem("currentUser", username);
        document.getElementById("loginPage").style.display = "none";
        document.getElementById("portalPage").style.display = "block";
        loadUserData();
        fetchTimetable();  // Fetch timetable after login
        scheduleReminders();
        setInterval(fetchTimetable, 60000);
    } else {
        document.getElementById("loginError").textContent = "Invalid credentials!";
    }
}

// Logout function
function logout() {
    localStorage.removeItem("currentUser");
    document.getElementById("portalPage").style.display = "none";
    if (Object.keys(users).length > 0) {
        document.getElementById("loginPage").style.display = "block";
    } else {
        document.getElementById("registerPage").style.display = "block";
    }
}

// Function to handle window load events
window.onload = function() {
    let currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
        document.getElementById("portalPage").style.display = "block";
        loadUserData();
        fetchTimetable();
        scheduleReminders();
        setInterval(fetchTimetable, 60000); // Auto-update timetable every minute
    } else {
        if (Object.keys(users).length > 0) {
            document.getElementById("loginPage").style.display = "block";
        } else {
            document.getElementById("registerPage").style.display = "block";
        }
    }
};
