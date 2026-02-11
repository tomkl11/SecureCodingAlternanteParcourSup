const app = require('./app');
const sequelize = require('./config/db');
const User = require('./models/User');
const School = require('./models/School');
const Application = require('./models/Application');

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("✅ Database synchronized.");

    // Seed data if empty
    const userCount = await User.count();
    if (userCount === 0) {
      await seedData(); 
    }

    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Startup error:", error);
  }
}

async function seedData() {
    console.log("🌱 Seeding initial data...");
    // 1. Create Admin
    await User.create({
      name: 'Admin',
      email: 'admin@securesup.fr',
      password: 'admin_password', // Vulnerability: Plain text password
      role: 'ADMIN'
    });
    console.log("Seed completed.");
}

startServer();