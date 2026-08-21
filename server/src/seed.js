import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import Grave from './models/Grave.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing database records...');
    await User.deleteMany({});
    await Grave.deleteMany({});

    console.log('Seeding Users...');
    const adminUser = await User.create({
      name: 'Admin Maqam',
      email: 'test@example.com',
      password: 'admin123',
      role: 'admin',
    });

    const visitorUser = await User.create({
      name: 'Visitor User',
      email: 'visitor@example.com',
      password: 'visitor123',
      role: 'visitor',
    });

    console.log(`Created admin user: ${adminUser.email} / admin123`);
    console.log(`Created visitor user: ${visitorUser.email} / visitor123`);

    console.log('Seeding Graves...');
    const sampleGraves = [
      {
        name: 'Haji Ahmad bin Sulaiman',
        ic_number: '550102-10-5431',
        date_of_death: '2021-04-15',
        plot_number: 'A-101',
        gps_lat: '2.909680',
        gps_lng: '101.464500',
        photo: null,
        notes: 'Section A - Near the main gate',
        createdBy: adminUser._id,
      },
      {
        name: 'Hajah Fatimah binti Kassim',
        ic_number: '580912-14-5120',
        date_of_death: '2022-08-20',
        plot_number: 'A-102',
        gps_lat: '2.909710',
        gps_lng: '101.464530',
        photo: null,
        notes: 'Section A - Next to Plot A-101',
        createdBy: adminUser._id,
      },
      {
        name: 'Mohd Razali bin Abdullah',
        ic_number: '621105-08-6677',
        date_of_death: '2023-01-10',
        plot_number: 'B-205',
        gps_lat: '2.909640',
        gps_lng: '101.464470',
        photo: null,
        notes: 'Section B - West corner',
        createdBy: adminUser._id,
      },
      {
        name: 'Siti Aminah binti Zulkifli',
        ic_number: '750314-10-5892',
        date_of_death: '2023-11-04',
        plot_number: 'B-206',
        gps_lat: '2.909610',
        gps_lng: '101.464450',
        photo: null,
        notes: 'Section B',
        createdBy: adminUser._id,
      },
      {
        name: 'Zulkarnain bin Mahmud',
        ic_number: '800619-01-5233',
        date_of_death: '2024-05-18',
        plot_number: 'C-310',
        gps_lat: '2.909750',
        gps_lng: '101.464580',
        photo: null,
        notes: 'Section C - East walkway',
        createdBy: adminUser._id,
      },
    ];

    await Grave.insertMany(sampleGraves);
    console.log(`Seeded ${sampleGraves.length} grave records successfully.`);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
