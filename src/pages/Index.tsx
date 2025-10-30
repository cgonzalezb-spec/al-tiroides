
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ThyroidInfo from '@/components/ThyroidInfo';
import SymptomsTest from '@/components/SymptomsTest';
import DisorderTypes from '@/components/DisorderTypes';
import Medications from '@/components/Medications';
import MedicationManager from '@/components/MedicationManager';
import SymptomTracker from '@/components/SymptomTracker';
import AppointmentBooking from '@/components/AppointmentBooking';
import WhenToConsult from '@/components/WhenToConsult';
import MythsAndFAQ from '@/components/MythsAndFAQ';
import UserQuestions from '@/components/UserQuestions';
import CommunityForum from '@/components/CommunityForum';
import Footer from '@/components/Footer';
import ConsejosSection from '@/components/ConsejosSection';
import ThyroidArticles from '@/components/ThyroidArticles';
import ArticleManagement from '@/components/ArticleManagement';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      <HeroSection />
      <ThyroidInfo />
      <SymptomsTest />
      <DisorderTypes />
      <Medications />
      {user && (
        <>
          <div id="mis-medicamentos">
            <MedicationManager />
          </div>
          <div id="sintomas">
            <SymptomTracker />
          </div>
        </>
      )}
      <AppointmentBooking />
      <WhenToConsult />
      <MythsAndFAQ />
      <ConsejosSection />
      <ThyroidArticles />
      {user && <ArticleManagement />}
      <UserQuestions />
      <CommunityForum />
      <Footer />
    </div>
  );
};

export default Index;
