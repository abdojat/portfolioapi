const mongoose = require('mongoose');
require('dotenv').config();

const Admin = require('./models/Admin');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    return false;
  }
};

const debugAdmin = async () => {
  console.log('🔍 Debugging admin account...\n');
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log(`ADMIN_EMAIL: ${process.env.ADMIN_EMAIL || 'NOT SET'}`);
  console.log(`ADMIN_PASSWORD: ${process.env.ADMIN_PASSWORD ? 'SET' : 'NOT SET'}`);
  console.log(`MONGODB_URI: ${process.env.MONGODB_URI || 'NOT SET'}`);
  console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? 'SET' : 'NOT SET'}\n`);

  // Connect to database
  const connected = await connectDB();
  if (!connected) {
    console.log('❌ Cannot connect to database. Please check MongoDB.');
    return;
  }

  try {
    // Check if admin exists
    const admin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (admin) {
      console.log('✅ Admin account found:');
      console.log(`   Email: ${admin.email}`);
      console.log(`   Name: ${admin.name}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Active: ${admin.isActive}`);
      console.log(`   Created: ${admin.createdAt}`);
      
      // Test password
      const isPasswordValid = await admin.matchPassword(process.env.ADMIN_PASSWORD);
      console.log(`   Password Valid: ${isPasswordValid ? '✅ YES' : '❌ NO'}`);
      
      if (!isPasswordValid) {
        console.log('\n❌ Password is incorrect!');
        console.log('💡 Try these steps:');
        console.log('   1. Check your .env file');
        console.log('   2. Run: npm run init-db');
        console.log('   3. Make sure ADMIN_PASSWORD matches');
      }
    } else {
      console.log('❌ Admin account not found!');
      console.log('💡 Try these steps:');
      console.log('   1. Run: npm run init-db');
      console.log('   2. Check if MongoDB is running');
      console.log('   3. Verify your .env file');
    }

    // List all admins
    const allAdmins = await Admin.find().select('-password');
    console.log(`\n📊 Total admins in database: ${allAdmins.length}`);
    if (allAdmins.length > 0) {
      console.log('Available admin accounts:');
      allAdmins.forEach((admin, index) => {
        console.log(`   ${index + 1}. ${admin.email} (${admin.name}) - ${admin.isActive ? 'Active' : 'Inactive'}`);
      });
    }

  } catch (error) {
    console.error('❌ Error checking admin:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

debugAdmin();
