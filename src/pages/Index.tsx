import { useState } from "react";
import { Hero } from "@/components/Hero";
import { SymptomChecker } from "@/components/SymptomChecker";
import { ClinicLocator } from "@/components/ClinicLocator";
import { BookingForm } from "@/components/BookingForm";
import { HealthPrompt } from "@/components/HealthPrompt";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Heart } from "lucide-react";

const Index = () => {
  const [language, setLanguage] = useState<'en' | 'sw'>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'sw' : 'en');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground">
              {language === 'en' ? 'Afya Karibu Kenya' : 'Afya Karibu Kenya'}
            </h1>
          </div>
          <LanguageToggle language={language} onToggle={toggleLanguage} />
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Hero language={language} />
        <SymptomChecker language={language} />
        <HealthPrompt language={language} />
        <ClinicLocator language={language} />
        <BookingForm language={language} />
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold text-foreground">
                Afya Karibu Kenya
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {language === 'en' 
                ? 'Making healthcare accessible to all Kenyans, one step at a time.' 
                : 'Kufanya huduma za afya zipatikane kwa Wakenya wote, hatua kwa hatua.'}
            </p>
            <p className="text-xs text-muted-foreground">
              © 2025 Afya Karibu Kenya. {language === 'en' ? 'All rights reserved.' : 'Haki zote zimehifadhiwa.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
