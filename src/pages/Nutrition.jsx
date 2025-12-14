import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/language';
import { FaCheckCircle, FaTimesCircle, FaUtensils, FaLightbulb } from 'react-icons/fa';
import './Nutrition.css';

const Nutrition = () => {
  const { language } = useLanguage();
  const t = (key) => getTranslation(key, language);

  const [selectedSymptom, setSelectedSymptom] = useState(null);

  const safeFoods = {
    en: [
      'Cooked vegetables (sukuma wiki, spinach)',
      'Well-cooked meat and fish',
      'Pasteurized dairy products',
      'Fresh fruits (washed)',
      'Whole grains',
      'Legumes (beans, lentils)',
      'Nuts (in moderation)',
      'Eggs (fully cooked)'
    ],
    sw: [
      'Mboga zilizopikwa (sukuma wiki, spinach)',
      'Nyama na samaki walioipikwa vizuri',
      'Bidhaa za maziwa zilizosafishwa',
      'Matunda mazuri (yaliyooshwa)',
      'Nafaka nzima',
      'Nafaka (maharagwe, dengu)',
      'Njugu (kwa kiasi)',
      'Mayai (yaliyoipikwa kabisa)'
    ]
  };

  const unsafeFoods = {
    en: [
      'Raw or undercooked meat',
      'Raw fish (sushi)',
      'Unpasteurized dairy',
      'Raw eggs',
      'High-mercury fish (shark, swordfish)',
      'Alcohol',
      'Excessive caffeine',
      'Raw sprouts'
    ],
    sw: [
      'Nyama mbichi au isiyoipikwa vizuri',
      'Samaki mbichi (sushi)',
      'Maziwa yasiyosafishwa',
      'Mayai mbichi',
      'Samaki wenye zebaki nyingi (papa, samaki wa upanga)',
      'Pombe',
      'Kafeini nyingi',
      'Mimea mbichi'
    ]
  };

  const symptomMeals = {
    en: {
      nausea: {
        title: 'For Nausea',
        foods: [
          'Ginger tea',
          'Plain crackers',
          'Bananas',
          'Applesauce',
          'Small, frequent meals',
          'Avoid strong smells',
          'Stay hydrated with small sips'
        ]
      },
      heartburn: {
        title: 'For Heartburn',
        foods: [
          'Oatmeal',
          'Bananas',
          'Melons',
          'Avoid spicy foods',
          'Avoid citrus',
          'Eat smaller meals',
          'Don\'t lie down immediately after eating'
        ]
      },
      lowIron: {
        title: 'For Low Iron',
        foods: [
          'Lean red meat',
          'Spinach',
          'Beans and lentils',
          'Fortified cereals',
          'Dark leafy greens',
          'Pair with vitamin C (tomatoes, citrus)',
          'Avoid tea/coffee with meals'
        ]
      },
      constipation: {
        title: 'For Constipation',
        foods: [
          'High-fiber foods',
          'Prunes',
          'Whole grains',
          'Plenty of water',
          'Fruits and vegetables',
          'Legumes',
          'Regular exercise'
        ]
      },
      fatigue: {
        title: 'For Fatigue',
        foods: [
          'Iron-rich foods',
          'Complex carbohydrates',
          'Protein at every meal',
          'Stay hydrated',
          'Small, frequent meals',
          'Limit processed foods'
        ]
      }
    },
    sw: {
      nausea: {
        title: 'Kwa Kichefuchefu',
        foods: [
          'Chai ya tangawizi',
          'Biskuti za kawaida',
          'Ndizi',
          'Apple sauce',
          'Milo midogo mara kwa mara',
          'Epuka harufu kali',
          'Kaa na maji kwa sips ndogo'
        ]
      },
      heartburn: {
        title: 'Kwa Moto wa Kifua',
        foods: [
          'Oatmeal',
          'Ndizi',
          'Mabungo',
          'Epuka vyakula vya pilipili',
          'Epuka machungwa',
          'Kula milo midogo',
          'Usilale mara moja baada ya kula'
        ]
      },
      lowIron: {
        title: 'Kwa Chuma Cha Chini',
        foods: [
          'Nyama nyekundu nyepesi',
          'Spinach',
          'Maharagwe na dengu',
          'Nafaka zilizoimarishwa',
          'Mboga za majani meusi',
          'Panga na vitamini C (nyanya, machungwa)',
          'Epuka chai/kahawa na milo'
        ]
      },
      constipation: {
        title: 'Kwa Kukwama',
        foods: [
          'Vyakula vya fiber nyingi',
          'Prunes',
          'Nafaka nzima',
          'Maji mengi',
          'Matunda na mboga',
          'Nafaka',
          'Mazoezi ya kawaida'
        ]
      },
      fatigue: {
        title: 'Kwa Uchovu',
        foods: [
          'Vyakula vya chuma',
          'Carbohydrates changamano',
          'Protini katika kila mlo',
          'Kaa na maji',
          'Milo midogo mara kwa mara',
          'Punguza vyakula vilivyotengenezwa'
        ]
      }
    }
  };

  const symptoms = {
    en: ['Nausea', 'Heartburn', 'Low Iron', 'Constipation', 'Fatigue'],
    sw: ['Kichefuchefu', 'Moto wa Kifua', 'Chuma Cha Chini', 'Kukwama', 'Uchovu']
  };

  return (
    <div className="nutrition">
      <h2>{language === 'en' ? 'Nutrition & Recipes' : 'Lishe na Mapishi'}</h2>

      <div className="nutrition-section">
        <h3>{language === 'en' ? 'Safe Foods During Pregnancy' : 'Vyakula Salama Wakati wa Ujauzito'}</h3>
        <div className="foods-grid safe-foods">
          {safeFoods[language].map((food, index) => (
            <div key={index} className="food-item safe">
              <span className="food-icon">
                <FaCheckCircle size={20} color="#2e7d32" />
              </span>
              <span>{food}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="nutrition-section">
        <h3>{language === 'en' ? 'Foods to Avoid' : 'Vyakula vya Kuepuka'}</h3>
        <div className="foods-grid unsafe-foods">
          {unsafeFoods[language].map((food, index) => (
            <div key={index} className="food-item unsafe">
              <span className="food-icon">
                <FaTimesCircle size={20} color="#d32f2f" />
              </span>
              <span>{food}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="nutrition-section">
        <h3>{language === 'en' ? 'Meal Suggestions for Symptoms' : 'Mapendekezo ya Milo kwa Dalili'}</h3>
        <p className="section-description">
          {language === 'en' 
            ? 'Select a symptom to see food recommendations:'
            : 'Chagua dalili ili kuona mapendekezo ya chakula:'}
        </p>

        <div className="symptoms-buttons">
          {symptoms[language].map((symptom, index) => {
            const symptomKey = Object.keys(symptomMeals.en)[index];
            return (
              <button
                key={index}
                className={`symptom-btn ${selectedSymptom === symptomKey ? 'active' : ''}`}
                onClick={() => setSelectedSymptom(symptomKey)}
              >
                {symptom}
              </button>
            );
          })}
        </div>

        {selectedSymptom && (
          <div className="symptom-meals">
            <h4>{symptomMeals[language][selectedSymptom].title}</h4>
            <div className="meals-list">
              {symptomMeals[language][selectedSymptom].foods.map((food, index) => (
                <div key={index} className="meal-item">
                  <span className="meal-icon">
                    <FaUtensils size={18} />
                  </span>
                  <span>{food}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="nutrition-section">
        <h3>{language === 'en' ? 'Nutrition Tips' : 'Vidokezo vya Lishe'}</h3>
        <div className="tips-list">
          <div className="tip-card">
            <span className="tip-icon">
              <FaLightbulb size={24} />
            </span>
            <div className="tip-content">
              <strong>{language === 'en' ? 'Eat Small, Frequent Meals' : 'Kula Milo Midogo Mara kwa Mara'}</strong>
              <p>{language === 'en' 
                ? 'This helps manage nausea and keeps your energy levels stable.'
                : 'Hii husaidia kusimamia kichefuchefu na kukaa viwango vya nishati thabiti.'}</p>
            </div>
          </div>

          <div className="tip-card">
            <span className="tip-icon">
              <FaLightbulb size={24} />
            </span>
            <div className="tip-content">
              <strong>{language === 'en' ? 'Stay Hydrated' : 'Kaa na Maji'}</strong>
              <p>{language === 'en' 
                ? 'Drink plenty of water throughout the day. Aim for 8-10 glasses daily.'
                : 'Kunywa maji mengi siku nzima. Lengo ni glasi 8-10 kila siku.'}</p>
            </div>
          </div>

          <div className="tip-card">
            <span className="tip-icon">
              <FaLightbulb size={24} />
            </span>
            <div className="tip-content">
              <strong>{language === 'en' ? 'Include Protein' : 'Jumuisha Protini'}</strong>
              <p>{language === 'en' 
                ? 'Protein is essential for your baby\'s growth. Include lean meats, beans, and dairy.'
                : 'Protini ni muhimu kwa ukuaji wa mtoto wako. Jumuisha nyama nyepesi, maharagwe, na maziwa.'}</p>
            </div>
          </div>

          <div className="tip-card">
            <span className="tip-icon">
              <FaLightbulb size={24} />
            </span>
            <div className="tip-content">
              <strong>{language === 'en' ? 'Folate-Rich Foods' : 'Vyakula vya Folate'}</strong>
              <p>{language === 'en' 
                ? 'Sukuma wiki, spinach, and fortified cereals are excellent sources of folate.'
                : 'Sukuma wiki, spinach, na nafaka zilizoimarishwa ni vyanzo bora vya folate.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nutrition;

