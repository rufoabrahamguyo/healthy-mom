import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Clinic from '../models/Clinic.js';
import HealthArticle from '../models/HealthArticle.js';
import ForumQuestion from '../models/ForumQuestion.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/uzazi-salama';

// Sample clinics data
const sampleClinics = [
  {
    name: "Kenyatta National Hospital",
    nameSwahili: "Hospitali ya Taifa ya Kenyatta",
    location: "Nairobi",
    type: "Public Hospital",
    costRating: 3,
    staffRating: 4,
    phone: "+254 20 2726300",
    services: ["Antenatal Care", "Delivery", "Postnatal Care"],
    verified: true,
    coordinates: {
      lat: -1.2921,
      lng: 36.8219
    }
  },
  {
    name: "Mama Lucy Kibaki Hospital",
    nameSwahili: "Hospitali ya Mama Lucy Kibaki",
    location: "Nairobi",
    type: "Public Hospital",
    costRating: 4,
    staffRating: 4,
    phone: "+254 20 6903000",
    services: ["Antenatal Care", "Delivery", "Vaccination"],
    verified: true,
    coordinates: {
      lat: -1.2833,
      lng: 36.8167
    }
  },
  {
    name: "Aga Khan University Hospital",
    nameSwahili: "Hospitali ya Chuo Kikuu cha Aga Khan",
    location: "Nairobi",
    type: "Private Hospital",
    costRating: 2,
    staffRating: 5,
    phone: "+254 20 3662000",
    services: ["Antenatal Care", "Delivery", "Specialist Care"],
    verified: true,
    coordinates: {
      lat: -1.2736,
      lng: 36.8120
    }
  },
  {
    name: "Mbagathi District Hospital",
    nameSwahili: "Hospitali ya Wilaya ya Mbagathi",
    location: "Nairobi",
    type: "Public Hospital",
    costRating: 4,
    staffRating: 3,
    phone: "+254 20 2726300",
    services: ["Antenatal Care", "Delivery"],
    verified: true,
    coordinates: {
      lat: -1.3167,
      lng: 36.8167
    }
  },
  {
    name: "Pumwani Maternity Hospital",
    nameSwahili: "Hospitali ya Ujauzito ya Pumwani",
    location: "Nairobi",
    type: "Maternity Hospital",
    costRating: 4,
    staffRating: 4,
    phone: "+254 20 2222222",
    services: ["Antenatal Care", "Delivery", "Postnatal Care"],
    verified: true,
    coordinates: {
      lat: -1.2833,
      lng: 36.8333
    }
  },
  {
    name: "Nakuru Level 5 Hospital",
    nameSwahili: "Hospitali ya Ngazi ya 5 ya Nakuru",
    location: "Nakuru",
    type: "Public Hospital",
    costRating: 4,
    staffRating: 4,
    phone: "+254 51 2210000",
    services: ["Antenatal Care", "Delivery", "Postnatal Care"],
    verified: true,
    coordinates: {
      lat: -0.3031,
      lng: 36.0800
    }
  },
  {
    name: "Kisumu County Hospital",
    nameSwahili: "Hospitali ya Kaunti ya Kisumu",
    location: "Kisumu",
    type: "Public Hospital",
    costRating: 4,
    staffRating: 3,
    phone: "+254 57 2020000",
    services: ["Antenatal Care", "Delivery"],
    verified: true,
    coordinates: {
      lat: -0.0917,
      lng: 34.7680
    }
  }
];

// Sample health articles data
const sampleHealthArticles = [
  {
    title: "Is it safe to eat sukuma wiki during pregnancy?",
    titleSwahili: "Je, ni salama kula sukuma wiki wakati wa ujauzito?",
    category: "Nutrition",
    categorySwahili: "Lishe",
    content: "Yes! Sukuma wiki (collard greens) is excellent during pregnancy. It's rich in folate, which helps prevent birth defects, and contains iron, calcium, and vitamins A, C, and K. Make sure to wash it thoroughly and cook it well to avoid any foodborne illnesses.",
    contentSwahili: "Ndiyo! Sukuma wiki ni bora wakati wa ujauzito. Ina folate nyingi, ambayo husaidia kuzuia kasoro za kuzaliwa, na ina chuma, kalisi, na vitamini A, C, na K. Hakikisha kuosha vizuri na kuipika vizuri ili kuepuka magonjwa yoyote ya chakula.",
    myth: "Myth: Pregnant women shouldn't eat sukuma wiki",
    mythSwahili: "Imani potofu: Wanawake wajawazito hawapaswi kula sukuma wiki",
    truth: "Truth: Sukuma wiki is very beneficial for pregnant women when properly prepared.",
    truthSwahili: "Kweli: Sukuma wiki ni muhimu sana kwa wanawake wajawazito wakati imeandaliwa vizuri.",
    verified: true
  },
  {
    title: "Morning Sickness: Natural Remedies",
    titleSwahili: "Kichefuchefu cha Asubuhi: Dawa za Asili",
    category: "Symptoms",
    categorySwahili: "Dalili",
    content: "Morning sickness is common in early pregnancy. Try these natural remedies: ginger tea, small frequent meals, staying hydrated, and getting fresh air. If vomiting is severe, consult your healthcare provider immediately.",
    contentSwahili: "Kichefuchefu cha asubuhi ni kawaida katika ujauzito wa mapema. Jaribu dawa hizi za asili: chai ya tangawizi, milo midogo mara kwa mara, kunywa maji mengi, na kupata hewa safi. Ikiwa kutapika ni kali, wasiliana na mhudumu wako wa afya mara moja.",
    verified: true
  },
  {
    title: "Exercise During Pregnancy",
    titleSwahili: "Mazoezi Wakati wa Ujauzito",
    category: "Lifestyle",
    categorySwahili: "Maisha",
    content: "Moderate exercise is safe and beneficial during pregnancy. Walking, swimming, and prenatal yoga are excellent choices. Avoid contact sports and activities with high fall risk. Always listen to your body and stop if you feel pain or discomfort.",
    contentSwahili: "Mazoezi ya wastani ni salama na yenye faida wakati wa ujauzito. Kutembea, kuogelea, na yoga ya ujauzito ni chaguo bora. Epuka michezo ya mawasiliano na shughuli zenye hatari ya kuanguka. Sikiza mwili wako kila wakati na acha ikiwa unahisi maumivu au usumbufu.",
    verified: true
  },
  {
    title: "Can I drink tea during pregnancy?",
    titleSwahili: "Je, naweza kunywa chai wakati wa ujauzito?",
    category: "Nutrition",
    categorySwahili: "Lishe",
    content: "Moderate amounts of caffeine (less than 200mg per day) are generally safe. This is about 1-2 cups of tea. However, herbal teas should be used with caution - some are not safe during pregnancy. Always check with your healthcare provider.",
    contentSwahili: "Kiasi cha wastani cha kafeini (chini ya 200mg kwa siku) kwa ujumla ni salama. Hii ni karibu vikombe 1-2 vya chai. Hata hivyo, chai za mimea zinapaswa kutumika kwa tahadhari - baadhi hazifai wakati wa ujauzito. Daima angalia na mhudumu wako wa afya.",
    myth: "Myth: All tea is harmful during pregnancy",
    mythSwahili: "Imani potofu: Chai zote ni hatari wakati wa ujauzito",
    truth: "Truth: Moderate amounts of regular tea are safe, but herbal teas need caution.",
    truthSwahili: "Kweli: Kiasi cha wastani cha chai ya kawaida ni salama, lakini chai za mimea zinahitaji tahadhari.",
    verified: true
  },
  {
    title: "Signs of Labor",
    titleSwahili: "Ishara za Kujifungua",
    category: "Delivery",
    categorySwahili: "Kujifungua",
    content: "Signs that labor may be starting include: regular contractions that get stronger and closer together, water breaking, bloody show, and lower back pain. If you experience any of these, contact your healthcare provider or go to the hospital.",
    contentSwahili: "Ishara kwamba kujifungua kunaweza kuanza ni pamoja na: mikazo ya mara kwa mara inayoongezeka na kuwa karibu zaidi, maji kuvunja, kuonyesha damu, na maumivu ya mgongo wa chini. Ikiwa unapata yoyote kati ya hizi, wasiliana na mhudumu wako wa afya au nenda hospitalini.",
    verified: true
  },
  {
    title: "Iron-Rich Foods for Pregnancy",
    titleSwahili: "Vyakula vya Chuma kwa Ujauzito",
    category: "Nutrition",
    categorySwahili: "Lishe",
    content: "Iron is crucial during pregnancy to prevent anemia. Good sources include: lean red meat, beans, lentils, spinach, fortified cereals, and dark leafy greens. Pair iron-rich foods with vitamin C (like tomatoes or citrus) to enhance absorption.",
    contentSwahili: "Chuma ni muhimu sana wakati wa ujauzito ili kuzuia anemia. Vyanzo vizuri ni pamoja na: nyama nyekundu nyepesi, maharagwe, dengu, spinach, nafaka zilizoimarishwa, na mboga za majani meusi. Panga vyakula vya chuma na vitamini C (kama nyanya au machungwa) ili kuongeza unyonyaji.",
    verified: true
  }
];

// Sample forum questions
const sampleForumQuestions = [
  {
    question: "Is it normal to feel tired all the time in the first trimester?",
    questionSwahili: "Je, ni kawaida kuhisi uchovu kila wakati katika mzunguko wa kwanza?",
    userId: null, // Anonymous
    anonymous: true,
    answers: [
      {
        text: "Yes, extreme fatigue is very common in the first trimester. Your body is working hard to support your growing baby. Make sure to rest when you can and eat nutritious meals.",
        textSwahili: "Ndiyo, uchovu mkubwa ni kawaida sana katika mzunguko wa kwanza. Mwili wako unafanya kazi ngumu kusaidia mtoto wako anayeendelea kukua. Hakikisha kupumzika wakati unapoweza na kula milo yenye virutubisho.",
        answeredBy: "Verified Midwife",
        answeredBySwahili: "Mkunga Aliyethibitishwa",
        verified: true,
        createdAt: new Date()
      }
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    question: "When should I start taking prenatal vitamins?",
    questionSwahili: "Nipaswa kuanza lini kuchukua vitamini za ujauzito?",
    userId: null,
    anonymous: true,
    answers: [
      {
        text: "Ideally, you should start taking prenatal vitamins before you become pregnant, or as soon as you find out you're pregnant. Folic acid is especially important in the early weeks to prevent neural tube defects.",
        textSwahili: "Kwa kweli, unapaswa kuanza kuchukua vitamini za ujauzito kabla ya kuwa mjamzito, au mara tu unapogundua uko mjamzito. Folic acid ni muhimu sana katika wiki za mapema ili kuzuia kasoro za mfumo wa neva.",
        answeredBy: "Verified Midwife",
        answeredBySwahili: "Mkunga Aliyethibitishwa",
        verified: true,
        createdAt: new Date()
      }
    ],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await Clinic.deleteMany({});
    await HealthArticle.deleteMany({});
    await ForumQuestion.deleteMany({});
    // Don't delete users - keep existing user accounts

    // Seed Clinics
    console.log('🏥 Seeding clinics...');
    const clinics = await Clinic.insertMany(sampleClinics);
    console.log(`✅ Inserted ${clinics.length} clinics`);

    // Seed Health Articles
    console.log('📚 Seeding health articles...');
    const articles = await HealthArticle.insertMany(sampleHealthArticles);
    console.log(`✅ Inserted ${articles.length} health articles`);

    // Seed Forum Questions
    console.log('💬 Seeding forum questions...');
    const questions = await ForumQuestion.insertMany(sampleForumQuestions);
    console.log(`✅ Inserted ${questions.length} forum questions`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\nSummary:');
    console.log(`- Clinics: ${clinics.length}`);
    console.log(`- Health Articles: ${articles.length}`);
    console.log(`- Forum Questions: ${questions.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  }
};

// Run the seed function
seedDatabase();

