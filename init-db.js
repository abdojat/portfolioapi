const mongoose = require('mongoose');
require('dotenv').config();

const Admin = require('./models/Admin');
const Portfolio = require('./models/Portfolio');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

const initializeDatabase = async () => {
  try {
    console.log('🚀 Initializing database...');

    // Create default admin account
    await Admin.createDefaultAdmin();
    console.log('✅ Default admin account created');

    // Create default portfolio data
    const portfolio = await Portfolio.getPortfolio();
    console.log('✅ Default portfolio data created');

    // Add some sample projects if none exist
    if (!portfolio.projects.items || portfolio.projects.items.length === 0) {
      const sampleProjects = [
        {
          title: "E-Commerce Platform",
          description: "Full-stack e-commerce application with user authentication, shopping cart, and payment integration.",
          technologies: ["React", "Node.js", "MongoDB", "Stripe"],
          frontendUrl: "https://github.com/abdojat/ecommerce-frontend",
          backendUrl: "https://github.com/abdojat/ecommerce-backend",
          liveUrl: "https://demo-ecommerce.com",
          image: "",
          featured: true,
          order: 1
        },
        {
          title: "Task Management App",
          description: "Collaborative task management application with real-time updates and team collaboration features.",
          technologies: ["React", "Express", "PostgreSQL", "Socket.io"],
          frontendUrl: "https://github.com/abdojat/task-manager-frontend",
          backendUrl: "https://github.com/abdojat/task-manager-backend",
          liveUrl: "https://demo-taskmanager.com",
          image: "",
          featured: true,
          order: 2
        },
        {
          title: "Weather Dashboard",
          description: "Interactive weather dashboard with location-based forecasts and data visualization.",
          technologies: ["React", "TypeScript", "Chart.js", "Weather API"],
          frontendUrl: "https://github.com/abdojat/weather-dashboard",
          backendUrl: "",
          liveUrl: "https://demo-weather.com",
          image: "",
          featured: false,
          order: 3
        }
      ];

      portfolio.projects.items = sampleProjects;
      await portfolio.save();
      console.log('✅ Sample projects added');
    }

    console.log('🎉 Database initialization completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start the server: npm run dev');
    console.log('2. Access admin panel: http://localhost:5000/admin');
    console.log('3. Login with your configured credentials:');
    console.log(`   Email: ${process.env.ADMIN_EMAIL}`);
    console.log('   Password: [Your configured password]');
    console.log('\n⚠️  Make sure to use strong credentials in production!');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run initialization
connectDB().then(initializeDatabase); 