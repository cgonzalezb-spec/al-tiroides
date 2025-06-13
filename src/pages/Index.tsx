
import { useState } from 'react';
import { Heart, Brain, Zap, Users, CheckCircle, AlertTriangle, Stethoscope, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ThyroidInfo from '@/components/ThyroidInfo';
import SymptomsTest from '@/components/SymptomsTest';
import DisorderTypes from '@/components/DisorderTypes';
import WhenToConsult from '@/components/WhenToConsult';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      <HeroSection />
      <ThyroidInfo />
      <SymptomsTest />
      <DisorderTypes />
      <WhenToConsult />
      <Footer />
    </div>
  );
};

export default Index;
