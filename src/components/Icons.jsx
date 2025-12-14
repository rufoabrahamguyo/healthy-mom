import { 
  FaSmile, FaMeh, FaSadTear, FaFlushed, FaBed, FaAngry, FaDizzy, FaHeart,
  FaBaby, FaTint, FaPills, FaSpinner, FaUtensils, FaPhone, FaHospital,
  FaCalendar, FaLightbulb, FaExclamationTriangle, FaCheckCircle,
  FaVolumeUp, FaVolumeMute, FaPause, FaPlay, FaUser, FaCheck,
  FaBabyCarriage, FaHeartbeat, FaClock, FaStopwatch, FaMapMarkerAlt,
  FaEdit, FaTrash, FaComment
} from 'react-icons/fa';

// Mood Icons
export const MoodIcons = {
  happy: FaSmile,
  calm: FaMeh,
  sad: FaSadTear,
  anxious: FaFlushed,
  tired: FaBed,
  angry: FaAngry,
  nauseous: FaDizzy,
  excited: FaHeart,
};

// Reminder Icons
export const ReminderIcons = {
  water: FaTint,
  vitamins: FaPills,
  stretch: FaSpinner,
  meals: FaUtensils,
  rest: FaBed,
  kicks: FaBaby,
};

// General Icons
export const Icons = {
  baby: FaBaby,
  phone: FaPhone,
  hospital: FaHospital,
  calendar: FaCalendar,
  lightbulb: FaLightbulb,
  warning: FaExclamationTriangle,
  check: FaCheckCircle,
  checkSimple: FaCheck,
  audio: FaVolumeUp,
  audioMute: FaVolumeMute,
  pause: FaPause,
  play: FaPlay,
  user: FaUser,
  babyCarriage: FaBabyCarriage,
  heartbeat: FaHeartbeat,
  clock: FaClock,
  stopwatch: FaStopwatch,
  location: FaMapMarkerAlt,
  bed: FaBed,
  edit: FaEdit,
  delete: FaTrash,
  comment: FaComment,
};

// Icon Component Wrapper
export const Icon = ({ name, size = 20, className = '', ...props }) => {
  const IconComponent = Icons[name] || ReminderIcons[name] || MoodIcons[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  
  return <IconComponent size={size} className={className} {...props} />;
};

export default Icon;

