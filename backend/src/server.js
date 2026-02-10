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
    // 1. Create Users
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@securesup.fr',
      password: 'admin_password', // Vulnerability: Plain text password
      role: 'ADMIN'
    });

    const student1 = await User.create({
      name: 'Alice',
      email: 'alice@test'
      , password: 'alice_password',
      role: 'USER'
    });

    // 2. Create Schools
    const efrei = await School.create({
      name: 'EFREI Paris',
      status: 'Private',
      maxPlace: 500
    });

    const sorbonne = await School.create({
      name: 'Sorbonne University',
      status: 'Public',
      maxPlace: 1000
    });

    // 3. Create Applications
    await Application.create({
      userId: student1.id,
      schoolId: efrei.id,
      rank: 1
    });

    await Application.create({
      userId: student1.id,
      schoolId: sorbonne.id,
      rank: 2
    });
    console.log("Seed completed.");
}

startServer();