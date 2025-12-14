// Language utility functions
export const translations = {
  en: {
    appName: "Healthy Mom",
    nav: {
      tracker: "Week Tracker",
      library: "Health Library",
      clinics: "Find Clinics",
      mood: "Mood Tracker",
      kicks: "Kick Counter",
      contractions: "Contractions",
      appointments: "Appointments",
      prep: "Baby Prep",
      reminders: "Reminders",
      nutrition: "Nutrition",
      partner: "Partner Mode",
      forum: "Q&A Forum"
    },
    common: {
      language: "Language",
      english: "English",
      swahili: "Swahili",
      search: "Search",
      back: "Back",
      next: "Next",
      previous: "Previous",
      save: "Save",
      cancel: "Cancel",
      submit: "Submit",
      anonymous: "Anonymous",
      verified: "Verified"
    },
    tracker: {
      title: "Your Pregnancy Journey",
      currentWeek: "Week {week}",
      babySize: "Your baby is the size of",
      development: "Baby Development",
      bodyChanges: "Your Body Changes",
      toDo: "This Week's Checklist",
      tips: "Tips for You"
    },
    library: {
      title: "Health Library",
      categories: "Categories",
      all: "All",
      nutrition: "Nutrition",
      symptoms: "Symptoms",
      lifestyle: "Lifestyle",
      delivery: "Delivery",
      mythBusting: "Myth Busting",
      playAudio: "Play Audio"
    },
    clinics: {
      title: "Find a Clinic",
      searchPlaceholder: "Search by location...",
      costFriendly: "Cost-Friendly",
      staffFriendly: "Staff-Friendly",
      call: "Call",
      services: "Services",
      verified: "Verified Clinic"
    },
    forum: {
      title: "Community Forum",
      askQuestion: "Share Your Experience",
      recentQuestions: "Recent Posts",
      postAnonymously: "Post Anonymously",
      questionPlaceholder: "Share your experience, ask a question, or connect with other moms...",
      answers: "Responses",
      answeredBy: "Shared by",
      noQuestions: "No posts yet. Be the first to share!",
      postQuestion: "Share Post"
    },
    disclaimer: "This app does not provide medical diagnosis. Always consult a healthcare professional for personal medical advice."
  },
  sw: {
    appName: "Healthy Mom",
    nav: {
      tracker: "Kufuatilia Wiki",
      library: "Maktaba ya Afya",
      clinics: "Tafuta Kliniki",
      mood: "Kufuatilia Mhemko",
      kicks: "Kuhesabu Vuguvugu",
      contractions: "Mikazo",
      appointments: "Miadi",
      prep: "Maandalizi",
      reminders: "Ukumbusho",
      nutrition: "Lishe",
      partner: "Hali ya Mshirika",
      forum: "Maswali na Majibu"
    },
    common: {
      language: "Lugha",
      english: "Kiingereza",
      swahili: "Kiswahili",
      search: "Tafuta",
      back: "Rudi",
      next: "Ifuatayo",
      previous: "Iliyotangulia",
      save: "Hifadhi",
      cancel: "Ghairi",
      submit: "Wasilisha",
      anonymous: "Bila Jina",
      verified: "Imethibitishwa"
    },
    tracker: {
      title: "Safari Yako ya Ujauzito",
      currentWeek: "Wiki {week}",
      babySize: "Mtoto wako ni ukubwa wa",
      development: "Maendeleo ya Mtoto",
      bodyChanges: "Mabadiliko ya Mwili Wako",
      toDo: "Orodha ya Wiki Hii",
      tips: "Vidokezo Kwa Wewe"
    },
    library: {
      title: "Maktaba ya Afya",
      categories: "Jamii",
      all: "Zote",
      nutrition: "Lishe",
      symptoms: "Dalili",
      lifestyle: "Maisha",
      delivery: "Kujifungua",
      mythBusting: "Kubomoa Imani Potofu",
      playAudio: "Cheza Sauti"
    },
    clinics: {
      title: "Tafuta Kliniki",
      searchPlaceholder: "Tafuta kwa eneo...",
      costFriendly: "Bei Nafuu",
      staffFriendly: "Wafanyakazi Wema",
      call: "Piga Simu",
      services: "Huduma",
      verified: "Kliniki Imethibitishwa"
    },
    forum: {
      title: "Jukwaa la Jamii",
      askQuestion: "Shiriki Uzoefu Wako",
      recentQuestions: "Machapisho ya Hivi Karibuni",
      postAnonymously: "Chapisha Bila Jina",
      questionPlaceholder: "Shiriki uzoefu wako, uliza swali, au uungane na mamake wengine...",
      answers: "Majibu",
      answeredBy: "Imeshiriwa na",
      noQuestions: "Hakuna machapisho bado. Wa kwanza kushiriki!",
      postQuestion: "Chapisha"
    },
    disclaimer: "Programu hii haitoi utambuzi wa matibabu. Daima wasiliana na mtaalamu wa afya kwa ushauri wa matibabu binafsi."
  }
};

export const getTranslation = (key, language = 'en') => {
  const keys = key.split('.');
  let value = translations[language];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || translations.en[key.split('.')[0]]?.[key.split('.')[1]] || key;
};

