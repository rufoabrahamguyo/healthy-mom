import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import {
  MoodEntry,
  KickEntry,
  Contraction,
  Appointment,
  Reminder,
  Checklist
} from '../models/UserData.js';
import ForumQuestion from '../models/ForumQuestion.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/uzazi-salama';

const testDatabase = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Test User creation
    console.log('📝 Testing User Model...');
    const testUser = new User({
      name: 'Test User',
      email: `test${Date.now()}@test.com`,
      password: 'test123456',
      pregnancyWeek: 20,
      language: 'en'
    });
    await testUser.save();
    console.log('✅ User created:', testUser.email);
    const userId = testUser._id;

    // Test Mood Entry
    console.log('\n😊 Testing Mood Entry...');
    const mood = new MoodEntry({
      userId,
      date: new Date().toISOString().split('T')[0],
      mood: 'happy',
      notes: 'Feeling great today!'
    });
    await mood.save();
    console.log('✅ Mood entry saved');

    // Test Kick Entry
    console.log('\n👶 Testing Kick Entry...');
    const kick = new KickEntry({
      userId,
      time: new Date(),
      sessionTime: 120
    });
    await kick.save();
    console.log('✅ Kick entry saved');

    // Test Contraction
    console.log('\n⏱️  Testing Contraction...');
    const contraction = new Contraction({
      userId,
      startTime: new Date(Date.now() - 60000),
      endTime: new Date(),
      duration: 60
    });
    await contraction.save();
    console.log('✅ Contraction saved');

    // Test Appointment
    console.log('\n📅 Testing Appointment...');
    const appointment = new Appointment({
      userId,
      date: '2024-12-15',
      time: '10:00',
      type: 'routine',
      provider: 'Dr. Test',
      location: 'Test Clinic',
      notes: 'Regular checkup',
      questions: ['How is baby growing?']
    });
    await appointment.save();
    console.log('✅ Appointment saved');

    // Test Reminder
    console.log('\n🔔 Testing Reminder...');
    const reminder = new Reminder({
      userId,
      type: 'water',
      enabled: true,
      times: ['08:00', '12:00', '18:00']
    });
    await reminder.save();
    console.log('✅ Reminder saved');

    // Test Checklist
    console.log('\n✅ Testing Checklist...');
    const checklist = new Checklist({
      userId,
      type: 'hospitalBag',
      category: 'For You',
      items: [
        { id: 1, text: 'Comfortable clothes', checked: false },
        { id: 2, text: 'Phone charger', checked: true }
      ]
    });
    await checklist.save();
    console.log('✅ Checklist saved');

    // Test Forum Question
    console.log('\n💬 Testing Forum Question...');
    const forumQuestion = new ForumQuestion({
      userId,
      question: 'Test question?',
      questionSwahili: 'Swali la majaribio?',
      anonymous: false,
      answers: []
    });
    await forumQuestion.save();
    console.log('✅ Forum question saved');

    // Query all data
    console.log('\n📊 Querying all user data...');
    const moods = await MoodEntry.find({ userId });
    const kicks = await KickEntry.find({ userId });
    const contractions = await Contraction.find({ userId });
    const appointments = await Appointment.find({ userId });
    const reminders = await Reminder.find({ userId });
    const checklists = await Checklist.find({ userId });
    const forumQuestions = await ForumQuestion.find({ userId });

    console.log(`\n📈 Summary:`);
    console.log(`   Users: 1`);
    console.log(`   Mood Entries: ${moods.length}`);
    console.log(`   Kick Entries: ${kicks.length}`);
    console.log(`   Contractions: ${contractions.length}`);
    console.log(`   Appointments: ${appointments.length}`);
    console.log(`   Reminders: ${reminders.length}`);
    console.log(`   Checklists: ${checklists.length}`);
    console.log(`   Forum Questions: ${forumQuestions.length}`);

    // Verify data integrity
    console.log('\n🔍 Verifying data integrity...');
    const userFromDb = await User.findById(userId);
    console.log(`✅ User found: ${userFromDb.email}`);
    console.log(`✅ User pregnancy week: ${userFromDb.pregnancyWeek}`);
    console.log(`✅ Mood entry linked to user: ${moods[0].userId.toString() === userId.toString()}`);
    console.log(`✅ Kick entry linked to user: ${kicks[0].userId.toString() === userId.toString()}`);

    console.log('\n✅ All database tests passed!');
    console.log('\n🧹 Cleaning up test data...');
    
    // Clean up test data
    await MoodEntry.deleteMany({ userId });
    await KickEntry.deleteMany({ userId });
    await Contraction.deleteMany({ userId });
    await Appointment.deleteMany({ userId });
    await Reminder.deleteMany({ userId });
    await Checklist.deleteMany({ userId });
    await ForumQuestion.deleteMany({ userId });
    await User.deleteOne({ _id: userId });
    
    console.log('✅ Test data cleaned up');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  }
};

testDatabase();

