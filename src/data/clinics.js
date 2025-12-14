// Sample clinic data - in production, this would come from an API
export const clinics = [
  {
    id: 1,
    name: "Kenyatta National Hospital",
    nameSwahili: "Hospitali ya Taifa ya Kenyatta",
    location: "Nairobi",
    type: "Public Hospital",
    costRating: 3, // 1-5 scale, 5 = most affordable
    staffRating: 4,
    phone: "+254 20 2726300",
    services: ["Antenatal Care", "Delivery", "Postnatal Care"],
    verified: true
  },
  {
    id: 2,
    name: "Mama Lucy Kibaki Hospital",
    nameSwahili: "Hospitali ya Mama Lucy Kibaki",
    location: "Nairobi",
    type: "Public Hospital",
    costRating: 4,
    staffRating: 4,
    phone: "+254 20 6903000",
    services: ["Antenatal Care", "Delivery", "Vaccination"],
    verified: true
  },
  {
    id: 3,
    name: "Aga Khan University Hospital",
    nameSwahili: "Hospitali ya Chuo Kikuu cha Aga Khan",
    location: "Nairobi",
    type: "Private Hospital",
    costRating: 2,
    staffRating: 5,
    phone: "+254 20 3662000",
    services: ["Antenatal Care", "Delivery", "Specialist Care"],
    verified: true
  },
  {
    id: 4,
    name: "Mbagathi District Hospital",
    nameSwahili: "Hospitali ya Wilaya ya Mbagathi",
    location: "Nairobi",
    type: "Public Hospital",
    costRating: 4,
    staffRating: 3,
    phone: "+254 20 2726300",
    services: ["Antenatal Care", "Delivery"],
    verified: true
  },
  {
    id: 5,
    name: "Pumwani Maternity Hospital",
    nameSwahili: "Hospitali ya Ujauzito ya Pumwani",
    location: "Nairobi",
    type: "Maternity Hospital",
    costRating: 4,
    staffRating: 4,
    phone: "+254 20 2222222",
    services: ["Antenatal Care", "Delivery", "Postnatal Care"],
    verified: true
  }
];

export const getClinicsByLocation = (location) => {
  if (!location) return clinics;
  return clinics.filter(clinic => 
    clinic.location.toLowerCase().includes(location.toLowerCase())
  );
};

