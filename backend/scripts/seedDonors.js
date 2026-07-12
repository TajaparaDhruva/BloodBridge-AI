const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Donor = require('../models/Donor');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
const firstNames = ['Rajesh', 'Deepak', 'Sunita', 'Priya', 'Amit', 'Sneha', 'Ravi', 'Meera', 'Karan', 'Pooja', 'Vikram', 'Anita', 'Rahul', 'Neha', 'Sanjay', 'Kavita', 'Manish', 'Ritu', 'Arun', 'Poonam'];
const lastNames = ['Kumar', 'Nair', 'Rao', 'Patel', 'Shah', 'Gupta', 'Verma', 'Singh', 'Malhotra', 'Reddy', 'Desai', 'Jain', 'Sharma', 'Mehta', 'Iyer', 'Bose'];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clean up existing dummy donors if any to avoid duplicates
    const dummyUsers = await User.find({ email: { $regex: 'dummy.*@example.com' } });
    const dummyUserIds = dummyUsers.map(u => u._id);
    await Donor.deleteMany({ user: { $in: dummyUserIds } });
    await User.deleteMany({ _id: { $in: dummyUserIds } });

    console.log('Cleaned old dummy data');

    let counter = 1;

    for (let bg of bloodGroups) {
      const count = bg === 'O-' ? 2 : 5;
      for (let i = 0; i < count; i++) {
        const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
        const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
        const name = `${fn} ${ln}`;
        
        // Create user
        const user = await User.create({
          name: name,
          email: `dummy${counter}@example.com`,
          password: 'password123',
          role: 'donor',
        });

        // Generate coordinates around a central point (approx center of a city)
        const lat = 19.0760 + (Math.random() - 0.5) * 0.1;
        const lng = 72.8777 + (Math.random() - 0.5) * 0.1;

        // Random last donation date
        const lastDonationDate = new Date();
        lastDonationDate.setMonth(lastDonationDate.getMonth() - Math.floor(Math.random() * 11 + 1));

        await Donor.create({
          user: user._id,
          name: name,
          bloodGroup: bg,
          age: Math.floor(Math.random() * 30 + 20),
          weight: Math.floor(Math.random() * 30 + 55),
          gender: Math.random() > 0.5 ? 'male' : 'female',
          contact: `98765${Math.floor(10000 + Math.random() * 90000)}`,
          city: 'Mumbai',
          state: 'Maharashtra',
          location: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          lastDonationDate: lastDonationDate,
          isAvailable: Math.random() > 0.1,
          isVerified: Math.random() > 0.2,
          medicalConditions: [],
          donationCount: Math.floor(Math.random() * 10 + 1),
          responseRate: Math.floor(Math.random() * 20 + 80),
          rating: (Math.random() * 1 + 4).toFixed(1),
          aiScore: Math.floor(Math.random() * 15 + 85),
          avatarChar: fn[0],
        });
        
        counter++;
      }
    }

    console.log(`Seeded ${counter - 1} mock donors successfully!`);
    process.exit();
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedData();
