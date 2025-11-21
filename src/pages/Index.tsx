
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ThyroidInfo from '@/components/ThyroidInfo';
import ThyroidPhysiology from '@/components/ThyroidPhysiology';
import DisorderTypes from '@/components/DisorderTypes';
import ThyroidSurgery from '@/components/ThyroidSurgery';
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
import PharmacyLinksManagement from '@/components/PharmacyLinksManagement';
import ThyroidSymptomExplorer from '@/components/ThyroidSymptomExplorer';
import ThyroidHealthTips from '@/components/ThyroidHealthTips';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      <HeroSection />
      <div id="que-es-tiroides">
        <ThyroidInfo />
      </div>
      <div id="fisiologia">
        <ThyroidPhysiology />
      </div>
      <div id="sintomas">
        <ThyroidSymptomExplorer />
      </div>
      <div id="tipos-trastornos">
        <DisorderTypes />
      </div>
      <div id="cirugia">
        <ThyroidSurgery />
      </div>
      <div id="medicamentos">
        <Medications />
      </div>
      {user && (
        <>
          <div id="mis-medicamentos">
            <MedicationManager />
          </div>
          <div id="sintomas-tracker">
            <SymptomTracker />
          </div>
        </>
      )}
      <div id="agenda">
        <AppointmentBooking />
      </div>
      <div id="cuando-consultar">
        <WhenToConsult />
      </div>
      <div id="mitos-faq">
        <MythsAndFAQ />
      </div>
      <div id="consejos-salud">
        <ThyroidHealthTips />
      </div>
      <div id="consejos">
        <ConsejosSection />
      </div>
      <div id="articulos">
        <ThyroidArticles />
      </div>
      {user && <ArticleManagement />}
      {user && <PharmacyLinksManagement />}
      <div id="preguntas">
        <UserQuestions />
      </div>
      <div id="foro">
        <CommunityForum />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
