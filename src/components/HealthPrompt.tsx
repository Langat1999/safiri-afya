import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface HealthPromptProps {
  language: 'en' | 'sw';
}

const prompts = {
  en: [
    "Afya ni uhai - your health is your life, treasure it today",
    "Mwili ni hekalu - your body is a temple, honor it with care",
    "Kila hatua ni safari - every step is a journey to wellness",
    "Tunza mwili, tunza roho - care for the body, nurture the soul",
  ],
  sw: [
    "Afya ni uhai, tunza mwili wako leo",
    "Mwili ni hekalu, uitunze kwa uangalifu",
    "Kila hatua ni safari ya afya",
    "Tunza mwili, tunza roho yako",
  ],
};

export const HealthPrompt = ({ language }: HealthPromptProps) => {
  const randomPrompt = prompts[language][Math.floor(Math.random() * prompts[language].length)];

  return (
    <section className="py-12 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="container px-4 sm:px-6 lg:px-8">
        <Card className="max-w-4xl mx-auto bg-card/80 backdrop-blur border-2 border-primary/20 shadow-lg">
          <div className="p-8 text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-primary/10">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
            </div>
            <blockquote className="text-xl sm:text-2xl font-medium text-foreground italic">
              "{randomPrompt}"
            </blockquote>
            <p className="text-sm text-muted-foreground">
              {language === 'en' 
                ? 'A moment of wisdom for your health journey' 
                : 'Hekima ya dakika kwa safari yako ya afya'}
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};
