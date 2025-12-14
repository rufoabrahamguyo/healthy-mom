// Health library articles - bilingual content
export const healthArticles = {
  en: [
    {
      id: 1,
      title: "Is it safe to eat sukuma wiki during pregnancy?",
      category: "Nutrition",
      content: "Yes! Sukuma wiki (collard greens) is excellent during pregnancy. It's rich in folate, which helps prevent birth defects, and contains iron, calcium, and vitamins A, C, and K. Make sure to wash it thoroughly and cook it well to avoid any foodborne illnesses.",
      myth: "Myth: Pregnant women shouldn't eat sukuma wiki",
      truth: "Truth: Sukuma wiki is very beneficial for pregnant women when properly prepared."
    },
    {
      id: 2,
      title: "Morning Sickness: Natural Remedies",
      category: "Symptoms",
      content: "Morning sickness is common in early pregnancy. Try these natural remedies: ginger tea, small frequent meals, staying hydrated, and getting fresh air. If vomiting is severe, consult your healthcare provider immediately.",
      myth: null,
      truth: null
    },
    {
      id: 3,
      title: "Exercise During Pregnancy",
      category: "Lifestyle",
      content: "Moderate exercise is safe and beneficial during pregnancy. Walking, swimming, and prenatal yoga are excellent choices. Avoid contact sports and activities with high fall risk. Always listen to your body and stop if you feel pain or discomfort.",
      myth: null,
      truth: null
    },
    {
      id: 4,
      title: "Can I drink tea during pregnancy?",
      category: "Nutrition",
      content: "Moderate amounts of caffeine (less than 200mg per day) are generally safe. This is about 1-2 cups of tea. However, herbal teas should be used with caution - some are not safe during pregnancy. Always check with your healthcare provider.",
      myth: "Myth: All tea is harmful during pregnancy",
      truth: "Truth: Moderate amounts of regular tea are safe, but herbal teas need caution."
    },
    {
      id: 5,
      title: "Signs of Labor",
      category: "Delivery",
      content: "Signs that labor may be starting include: regular contractions that get stronger and closer together, water breaking, bloody show, and lower back pain. If you experience any of these, contact your healthcare provider or go to the hospital.",
      myth: null,
      truth: null
    }
  ],
  sw: [
    {
      id: 1,
      title: "Je, ni salama kula sukuma wiki wakati wa ujauzito?",
      category: "Lishe",
      content: "Ndiyo! Sukuma wiki ni bora wakati wa ujauzito. Ina folate nyingi, ambayo husaidia kuzuia kasoro za kuzaliwa, na ina chuma, kalisi, na vitamini A, C, na K. Hakikisha kuosha vizuri na kuipika vizuri ili kuepuka magonjwa yoyote ya chakula.",
      myth: "Imani potofu: Wanawake wajawazito hawapaswi kula sukuma wiki",
      truth: "Kweli: Sukuma wiki ni muhimu sana kwa wanawake wajawazito wakati imeandaliwa vizuri."
    },
    {
      id: 2,
      title: "Kichefuchefu cha Asubuhi: Dawa za Asili",
      category: "Dalili",
      content: "Kichefuchefu cha asubuhi ni kawaida katika ujauzito wa mapema. Jaribu dawa hizi za asili: chai ya tangawizi, milo midogo mara kwa mara, kunywa maji mengi, na kupata hewa safi. Ikiwa kutapika ni kali, wasiliana na mhudumu wako wa afya mara moja.",
      myth: null,
      truth: null
    },
    {
      id: 3,
      title: "Mazoezi Wakati wa Ujauzito",
      category: "Maisha",
      content: "Mazoezi ya wastani ni salama na yenye faida wakati wa ujauzito. Kutembea, kuogelea, na yoga ya ujauzito ni chaguo bora. Epuka michezo ya mawasiliano na shughuli zenye hatari ya kuanguka. Sikiza mwili wako kila wakati na acha ikiwa unahisi maumivu au usumbufu.",
      myth: null,
      truth: null
    }
  ]
};

export const getArticlesByCategory = (category, language = 'en') => {
  const articles = healthArticles[language] || [];
  if (!category) return articles;
  return articles.filter(article => article.category === category);
};

