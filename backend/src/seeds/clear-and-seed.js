import { config } from "dotenv";
import { connectDB } from "../db/db.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

config();

const seedUsers = [
  // Female Users
  {
    email: "emma.thompson@example.com",
    fullname: "Emma Thompson",
    password: "123456",
    profilepic: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    email: "olivia.miller@example.com",
    fullname: "Olivia Miller",
    password: "123456",
    profilepic: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    email: "sophia.davis@example.com",
    fullname: "Sophia Davis",
    password: "123456",
    profilepic: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    email: "ava.wilson@example.com",
    fullname: "Ava Wilson",
    password: "123456",
    profilepic: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    email: "isabella.brown@example.com",
    fullname: "Isabella Brown",
    password: "123456",
    profilepic: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    email: "mia.johnson@example.com",
    fullname: "Mia Johnson",
    password: "123456",
    profilepic: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    email: "charlotte.williams@example.com",
    fullname: "Charlotte Williams",
    password: "123456",
    profilepic: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    email: "amelia.garcia@example.com",
    fullname: "Amelia Garcia",
    password: "123456",
    profilepic: "https://randomuser.me/api/portraits/women/8.jpg",
  },

  // Male Users
  {
    email: "james.anderson@example.com",
    fullname: "James Anderson",
    password: "123456",
    profilepic: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    email: "william.clark@example.com",
    fullname: "William Clark",
    password: "123456",
    profilepic: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    email: "benjamin.taylor@example.com",
    fullname: "Benjamin Taylor",
    password: "123456",
    profilepic: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    email: "lucas.moore@example.com",
    fullname: "Lucas Moore",
    password: "123456",
    profilepic: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    email: "henry.jackson@example.com",
    fullname: "Henry Jackson",
    password: "123456",
    profilepic: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    email: "alexander.martin@example.com",
    fullname: "Alexander Martin",
    password: "123456",
    profilepic: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    email: "daniel.rodriguez@example.com",
    fullname: "Daniel Rodriguez",
    password: "123456",
    profilepic: "https://randomuser.me/api/portraits/men/7.jpg",
  },
];

const clearAndSeedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing users
    const deletedCount = await User.deleteMany({});
    console.log(`Cleared ${deletedCount.deletedCount} existing users`);

    // Hash passwords for all users
    const hashedUsers = await Promise.all(
      seedUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12),
      }))
    );

    // Insert users
    await User.insertMany(hashedUsers);
    console.log(`Database re-seeded successfully with ${hashedUsers.length} users`);
    
    // Log the created users (without passwords)
    console.log("\nCreated users:");
    hashedUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.fullname} (${user.email})`);
    });
    
    // Exit the process
    process.exit(0);
  } catch (error) {
    console.error("Error clearing and seeding database:", error);
    process.exit(1);
  }
};

// Call the function
clearAndSeedDatabase();
