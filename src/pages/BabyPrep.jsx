import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getTranslation } from '../utils/language';
import { userDataAPI } from '../utils/userDataAPI';
import './BabyPrep.css';

const BabyPrep = () => {
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const t = (key) => getTranslation(key, language);

  const [hospitalBag, setHospitalBag] = useState([]);
  const [nursery, setNursery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadChecklists();
    } else {
      const savedBag = localStorage.getItem('hospitalBag');
      const savedNursery = localStorage.getItem('nurseryChecklist');
      setHospitalBag(savedBag ? JSON.parse(savedBag) : getDefaultHospitalBag(language));
      setNursery(savedNursery ? JSON.parse(savedNursery) : getDefaultNursery(language));
      setLoading(false);
    }
  }, [isAuthenticated, language]);

  const loadChecklists = async () => {
    try {
      setLoading(true);
      const response = await userDataAPI.getChecklists();
      if (response.success) {
        const checklists = response.checklists;
        const bag = checklists.filter(c => c.type === 'hospitalBag');
        const nurseryList = checklists.filter(c => c.type === 'nursery');
        
        if (bag.length > 0) {
          setHospitalBag(bag);
        } else {
          // Initialize with defaults
          const defaults = getDefaultHospitalBag(language);
          for (const cat of defaults) {
            await userDataAPI.saveChecklist({
              type: 'hospitalBag',
              category: cat.category,
              items: cat.items
            });
          }
          const reloadResponse = await userDataAPI.getChecklists();
          const reloaded = reloadResponse.checklists.filter(c => c.type === 'hospitalBag');
          setHospitalBag(reloaded);
        }
        
        if (nurseryList.length > 0) {
          setNursery(nurseryList);
        } else {
          const defaults = getDefaultNursery(language);
          for (const cat of defaults) {
            await userDataAPI.saveChecklist({
              type: 'nursery',
              category: cat.category,
              items: cat.items
            });
          }
          const reloadResponse = await userDataAPI.getChecklists();
          const reloaded = reloadResponse.checklists.filter(c => c.type === 'nursery');
          setNursery(reloaded);
        }
      }
    } catch (error) {
      console.error('Error loading checklists:', error);
      setHospitalBag(getDefaultHospitalBag(language));
      setNursery(getDefaultNursery(language));
    } finally {
      setLoading(false);
    }
  };

  function getDefaultHospitalBag(lang) {
    const items = {
      en: [
        { id: 1, category: 'For You', items: [
          'Comfortable clothes (2-3 sets)',
          'Nursing bras',
          'Maternity pads',
          'Toiletries',
          'Phone charger',
          'Snacks',
          'Comfortable shoes',
          'Going-home outfit'
        ]},
        { id: 2, category: 'For Baby', items: [
          'Newborn clothes (3-4 sets)',
          'Diapers',
          'Baby wipes',
          'Blanket',
          'Going-home outfit',
          'Car seat (installed)'
        ]},
        { id: 3, category: 'Important Documents', items: [
          'ID/Passport',
          'Insurance card',
          'Birth plan',
          'Hospital forms',
          'Emergency contacts'
        ]}
      ],
      sw: [
        { id: 1, category: 'Kwa Wewe', items: [
          'Nguo za starehe (seti 2-3)',
          'Suti za kunyonyesha',
          'Ped za ujauzito',
          'Vifaa vya bafuni',
          'Chaja ya simu',
          'Vitafunio',
          'Viatu vya starehe',
          'Nguo za kurudi nyumbani'
        ]},
        { id: 2, category: 'Kwa Mtoto', items: [
          'Nguo za mzazi mchanga (seti 3-4)',
          'Nguo za mtoto',
          'Maji ya kusafisha',
          'Blanketi',
          'Nguo za kurudi nyumbani',
          'Kiti cha gari (kimewekwa)'
        ]},
        { id: 3, category: 'Nyaraka Muhimu', items: [
          'Kitambulisho/Pasipoti',
          'Kadi ya bima',
          'Mpango wa kuzaliwa',
          'Fomu za hospitali',
          'Nambari za dharura'
        ]}
      ]
    };
    return items[lang].map(cat => ({
      ...cat,
      items: cat.items.map((item, idx) => ({ id: idx + 1, text: item, checked: false }))
    }));
  }

  function getDefaultNursery(lang) {
    const items = {
      en: [
        { id: 1, category: 'Sleeping', items: [
          'Crib or bassinet',
          'Mattress',
          'Fitted sheets (2-3)',
          'Swaddles/blankets',
          'Sleep sack'
        ]},
        { id: 2, category: 'Feeding', items: [
          'Bottles (if bottle-feeding)',
          'Bottle warmer',
          'Breast pump (if needed)',
          'Burp cloths',
          'Nursing pillow'
        ]},
        { id: 3, category: 'Diapering', items: [
          'Changing table or pad',
          'Diapers',
          'Wipes',
          'Diaper rash cream',
          'Diaper pail'
        ]},
        { id: 4, category: 'Safety', items: [
          'Baby monitor',
          'Outlet covers',
          'Corner guards',
          'First aid kit',
          'Thermometer'
        ]},
        { id: 5, category: 'Comfort', items: [
          'Rocking chair',
          'Storage bins',
          'Night light',
          'Sound machine',
          'Clothes organized'
        ]}
      ],
      sw: [
        { id: 1, category: 'Kulala', items: [
          'Kitanda cha mtoto au kitanda kidogo',
          'Godoro',
          'Shuka za kitanda (2-3)',
          'Blanketi',
          'Mfuko wa kulala'
        ]},
        { id: 2, category: 'Kulisha', items: [
          'Chupa (ikiwa unalisha chupa)',
          'Jiko la kupasha chupa',
          'Pampu ya maziwa (ikiwa inahitajika)',
          'Nguo za kufutia',
          'Mto wa kunyonyesha'
        ]},
        { id: 3, category: 'Kubadilisha Nguo', items: [
          'Meza ya kubadilisha au pedi',
          'Nguo za mtoto',
          'Maji ya kusafisha',
          'Krimu ya kuvimba',
          'Pipa la nguo za mtoto'
        ]},
        { id: 4, category: 'Usalama', items: [
          'Kifuatiliaji cha mtoto',
          'Vifuniko vya soketi',
          'Vikinga vya pembe',
          'Sanduku la dawa za kwanza',
          'Kipima joto'
        ]},
        { id: 5, category: 'Starehe', items: [
          'Kiti cha kusukuma',
          'Masanduku ya kuhifadhi',
          'Taa ya usiku',
          'Mashine ya sauti',
          'Nguo zimepangwa'
        ]}
      ]
    };
    return items[lang].map(cat => ({
      ...cat,
      items: cat.items.map((item, idx) => ({ id: idx + 1, text: item, checked: false }))
    }));
  }

  const toggleHospitalBagItem = async (categoryId, itemId) => {
    const category = hospitalBag.find(cat => cat.id === categoryId || cat._id?.toString() === categoryId.toString());
    if (!category) return;

    const updatedItems = category.items.map(item => 
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );

    if (isAuthenticated) {
      try {
        await userDataAPI.saveChecklist({
          type: 'hospitalBag',
          category: category.category,
          items: updatedItems
        });
        await loadChecklists();
      } catch (error) {
        console.error('Error saving checklist:', error);
      }
    } else {
      const updated = hospitalBag.map(cat => 
        (cat.id === categoryId || cat._id?.toString() === categoryId.toString())
          ? { ...cat, items: updatedItems }
          : cat
      );
      setHospitalBag(updated);
      localStorage.setItem('hospitalBag', JSON.stringify(updated));
    }
  };

  const toggleNurseryItem = async (categoryId, itemId) => {
    const category = nursery.find(cat => cat.id === categoryId || cat._id?.toString() === categoryId.toString());
    if (!category) return;

    const updatedItems = category.items.map(item => 
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );

    if (isAuthenticated) {
      try {
        await userDataAPI.saveChecklist({
          type: 'nursery',
          category: category.category,
          items: updatedItems
        });
        await loadChecklists();
      } catch (error) {
        console.error('Error saving checklist:', error);
      }
    } else {
      const updated = nursery.map(cat => 
        (cat.id === categoryId || cat._id?.toString() === categoryId.toString())
          ? { ...cat, items: updatedItems }
          : cat
      );
      setNursery(updated);
      localStorage.setItem('nurseryChecklist', JSON.stringify(updated));
    }
  };

  const getProgress = (checklist) => {
    const total = checklist.reduce((sum, cat) => sum + cat.items.length, 0);
    const checked = checklist.reduce((sum, cat) => 
      sum + cat.items.filter(item => item.checked).length, 0
    );
    return total > 0 ? Math.round((checked / total) * 100) : 0;
  };

  return (
    <div className="baby-prep">
      <h2>{language === 'en' ? 'Baby Preparation' : 'Maandalizi ya Mtoto'}</h2>

      <div className="prep-section">
        <div className="section-header">
          <h3>{language === 'en' ? 'Hospital Bag Checklist' : 'Orodha ya Begi la Hospitali'}</h3>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${getProgress(hospitalBag)}%` }}></div>
            <span className="progress-text">{getProgress(hospitalBag)}%</span>
          </div>
        </div>

        {hospitalBag.map(category => (
          <div key={category.id} className="checklist-category">
            <h4>{category.category}</h4>
            <div className="checklist-items">
              {category.items.map(item => (
                <label key={item.id} className="checklist-item">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleHospitalBagItem(category.id, item.id)}
                  />
                  <span className={item.checked ? 'checked' : ''}>{item.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="prep-section">
        <div className="section-header">
          <h3>{language === 'en' ? 'Nursery Checklist' : 'Orodha ya Chumba cha Mtoto'}</h3>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${getProgress(nursery)}%` }}></div>
            <span className="progress-text">{getProgress(nursery)}%</span>
          </div>
        </div>

        {nursery.map(category => (
          <div key={category.id} className="checklist-category">
            <h4>{category.category}</h4>
            <div className="checklist-items">
              {category.items.map(item => (
                <label key={item.id} className="checklist-item">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleNurseryItem(category.id, item.id)}
                  />
                  <span className={item.checked ? 'checked' : ''}>{item.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="prep-section">
        <h3>{language === 'en' ? 'Birth Plan Template' : 'Kiolezo cha Mpango wa Kuzaliwa'}</h3>
        <div className="birth-plan-info">
          <p>{language === 'en' 
            ? 'A birth plan helps you communicate your preferences to your healthcare team. Consider discussing these with your provider:'
            : 'Mpango wa kuzaliwa husaidia kujulisha mapendeleo yako kwa timu yako ya afya. Fikiria kujadili haya na mhudumu wako:'}</p>
          
          <div className="birth-plan-sections">
            <div className="plan-section">
              <h4>{language === 'en' ? 'Pain Management' : 'Usimamizi wa Maumivu'}</h4>
              <ul>
                <li>{language === 'en' ? 'Natural methods (breathing, movement)' : 'Njia za asili (kupumua, harakati)'}</li>
                <li>{language === 'en' ? 'Epidural' : 'Epidural'}</li>
                <li>{language === 'en' ? 'Other pain relief options' : 'Chaguzi zingine za kupunguza maumivu'}</li>
              </ul>
            </div>

            <div className="plan-section">
              <h4>{language === 'en' ? 'Labor Preferences' : 'Mapendeleo ya Kujifungua'}</h4>
              <ul>
                <li>{language === 'en' ? 'Positions during labor' : 'Msimamo wakati wa kujifungua'}</li>
                <li>{language === 'en' ? 'Mobility preferences' : 'Mapendeleo ya kusonga'}</li>
                <li>{language === 'en' ? 'Who will be present' : 'Nani atakuwa hapo'}</li>
              </ul>
            </div>

            <div className="plan-section">
              <h4>{language === 'en' ? 'After Birth' : 'Baada ya Kuzaliwa'}</h4>
              <ul>
                <li>{language === 'en' ? 'Delayed cord clamping' : 'Kufunga kamba baadaye'}</li>
                <li>{language === 'en' ? 'Skin-to-skin contact' : 'Kugusa ngozi kwa ngozi'}</li>
                <li>{language === 'en' ? 'Breastfeeding preferences' : 'Mapendeleo ya kunyonyesha'}</li>
              </ul>
            </div>
          </div>

          <div className="birth-plan-note">
            <p><strong>{language === 'en' ? 'Note:' : 'Kumbuka:'}</strong> {language === 'en' 
              ? 'Birth plans are preferences, not guarantees. Be flexible and discuss with your healthcare provider.'
              : 'Mipango ya kuzaliwa ni mapendeleo, si dhamana. Kuwa mnyumbulivu na jadili na mhudumu wako wa afya.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BabyPrep;

