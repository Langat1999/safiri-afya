import { useLanguage } from "@/contexts/LanguageContext";
import { Hero } from "@/components/Hero";
import { SymptomChecker } from "@/components/SymptomChecker";
import { ClinicLocator } from "@/components/ClinicLocator";
import { BookingForm } from "@/components/BookingForm";
import { HealthPrompt } from "@/components/HealthPrompt";
import { Navbar } from "@/components/Navbar";
import { Heart } from "lucide-react";

const Index = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

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
