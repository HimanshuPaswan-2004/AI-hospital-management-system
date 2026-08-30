import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  English: {
    translation: {
      "Dashboard": "Dashboard",
      "Appointments": "Appointments",
      "Patients": "Patients",
      "My Schedule": "My Schedule",
      "Prescriptions": "Prescriptions",
      "Reports": "Reports",
      "AI Assistant": "AI Assistant",
      "Messages": "Messages",
      "Profile": "Profile",
      "Settings": "Settings",
      "Logout": "Logout",
      "Medical Records": "Medical Records",
      "Health Summary": "Health Summary",
      
      "Good morning": "Good morning",
      "Here's what's happening with your practice today": "Here's what's happening with your practice today.",
      "Today's Appointments": "Today's Appointments",
      "Total Patients": "Total Patients",
      "Pending Reports": "Pending Reports",
      "Consultations": "Consultations",
      "Today's Schedule": "Today's Schedule",
      "View all": "View all",
      "No appointments today": "No appointments today.",
      "Appointments Overview": "Appointments Overview"
    }
  },
  Spanish: {
    translation: {
      "Dashboard": "Panel de control",
      "Appointments": "Citas",
      "Patients": "Pacientes",
      "My Schedule": "Mi Horario",
      "Prescriptions": "Recetas",
      "Reports": "Informes",
      "AI Assistant": "Asistente de IA",
      "Messages": "Mensajes",
      "Profile": "Perfil",
      "Settings": "Ajustes",
      "Logout": "Cerrar sesión",
      "Medical Records": "Historial Médico",
      "Health Summary": "Resumen de Salud",
      
      "Good morning": "Buenos días",
      "Here's what's happening with your practice today": "Esto es lo que sucede en su clínica hoy.",
      "Today's Appointments": "Citas de Hoy",
      "Total Patients": "Pacientes Totales",
      "Pending Reports": "Informes Pendientes",
      "Consultations": "Consultas",
      "Today's Schedule": "Horario de Hoy",
      "View all": "Ver todo",
      "No appointments today": "No hay citas hoy.",
      "Appointments Overview": "Resumen de Citas"
    }
  },
  French: {
    translation: {
      "Dashboard": "Tableau de bord",
      "Appointments": "Rendez-vous",
      "Patients": "Patients",
      "My Schedule": "Mon Programme",
      "Prescriptions": "Ordonnances",
      "Reports": "Rapports",
      "AI Assistant": "Assistant IA",
      "Messages": "Messages",
      "Profile": "Profil",
      "Settings": "Paramètres",
      "Logout": "Déconnexion",
      "Medical Records": "Dossiers Médicaux",
      "Health Summary": "Bilan de Santé",
      
      "Good morning": "Bonjour",
      "Here's what's happening with your practice today": "Voici ce qui se passe dans votre cabinet aujourd'hui.",
      "Today's Appointments": "Rendez-vous d'aujourd'hui",
      "Total Patients": "Total des Patients",
      "Pending Reports": "Rapports en Attente",
      "Consultations": "Consultations",
      "Today's Schedule": "Programme d'aujourd'hui",
      "View all": "Voir tout",
      "No appointments today": "Aucun rendez-vous aujourd'hui.",
      "Appointments Overview": "Aperçu des Rendez-vous"
    }
  },
  Hindi: {
    translation: {
      "Dashboard": "डैशबोर्ड",
      "Appointments": "नियुक्तियाँ",
      "Patients": "मरीज़",
      "My Schedule": "मेरा कार्यक्रम",
      "Prescriptions": "नुस्खे",
      "Reports": "रिपोर्ट",
      "AI Assistant": "एआई सहायक",
      "Messages": "संदेश",
      "Profile": "प्रोफ़ाइल",
      "Settings": "सेटिंग्स",
      "Logout": "लॉग आउट",
      "Medical Records": "मेडिकल रिकॉर्ड",
      "Health Summary": "स्वास्थ्य सारांश",
      
      "Good morning": "सुप्रभात",
      "Here's what's happening with your practice today": "आज आपके क्लिनिक में क्या हो रहा है, यह यहाँ है।",
      "Today's Appointments": "आज की नियुक्तियाँ",
      "Total Patients": "कुल मरीज़",
      "Pending Reports": "लंबित रिपोर्ट",
      "Consultations": "परामर्श",
      "Today's Schedule": "आज का कार्यक्रम",
      "View all": "सभी देखें",
      "No appointments today": "आज कोई नियुक्ति नहीं।",
      "Appointments Overview": "नियुक्तियों का अवलोकन"
    }
  }
};

const savedLanguage = localStorage.getItem('language') || 'English';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: "English",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
