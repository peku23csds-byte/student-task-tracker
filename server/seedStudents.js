// seedStudents.js
const mongoose = require("mongoose");
const Student = require("./models/Student"); // Adjust path if your model is in another folder

// Replace this with your MongoDB connection string
const MONGO_URI = "mongodb://127.0.0.1:27017/studentDB";

// Sample student data
const students = [
  { name: "Alice", email: "alice@example.com", rollNumber: "101" },
  { name: "Bob", email: "bob@example.com", rollNumber: "102" },
  { name: "Charlie", email: "charlie@example.com", rollNumber: "103" },
];

async function seedDB() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log(" MongoDB connected");

    // Clear existing students
    await Student.deleteMany({});
    console.log(" Existing students deleted");

    // Insert sample students
    await Student.insertMany(students);
    console.log(" Database seeded with students!");

  } catch (err) {
    console.error(" Error seeding database:", err);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log(" MongoDB connection closed");
  }
}

// Run the seeding function
seedDB();
