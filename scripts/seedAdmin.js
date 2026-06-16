/**
 * Seed script to promote a user to admin by email.
 * Usage: node scripts/seedAdmin.js admin@example.com
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function seedAdmin() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: node scripts/seedAdmin.js <email>');
    process.exit(1);
  }

  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blogsphere';
  await mongoose.connect(mongoUri);

  const User = require('../models/User');
  const user = await User.findOne({ email });

  if (!user) {
    console.error(`No user found with email: ${email}`);
    process.exit(1);
  }

  user.role = 'admin';
  await user.save();

  console.log(`✓ User "${user.name}" (${email}) promoted to admin`);
  await mongoose.connection.close();
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
