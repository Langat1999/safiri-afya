import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { symptomsAPI } from "@/services/api";

interface SymptomCheckerProps {
  language: 'en' | 'sw';
}

export const SymptomChecker = ({ language }: SymptomCheckerProps) => {
  const [symptoms, setSymptoms] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    urgency: 'low' | 'medium' | 'high';
    condition: string;
    recommendations: string[];
    disclaimer: string;
  } | null>(null);

  const content = {
    en: {
      title: "AI Symptom Analyzer",
      description: "Describe your symptoms in English or Swahili, and our AI will provide guidance",
      placeholder: "E.g., I have a headache and fever for 2 days...",
      analyze: "Analyze Symptoms",
      analyzing: "Analyzing...",
      urgencyLevels: {
        low: "Low Priority",
        medium: "Moderate Priority",
        high: "Urgent - Seek Immediate Care",
      },
      bookAppointment: "Book Appointment",
      findClinic: "Find Nearest Clinic",
    },
    sw: {
      title: "Mchanganuzi wa Dalili wa AI",
      description: "Eleza dalili zako kwa Kiingereza au Kiswahili, na AI yetu itakupa ushauri",
      placeholder: "Mfano: Nina maumivu ya kichwa na homa kwa siku 2...",
      analyze: "Changanua Dalili",
      analyzing: "Inachamganua...",
      urgencyLevels: {
        low: "Kipaumbele cha Chini",
        medium: "Kipaumbele cha Kati",
        high: "Dharura - Tafuta Huduma Mara Moja",
      },
      bookAppointment: "Weka Miadi",
      findClinic: "Tafuta Kliniki Karibu",
    },
  };

  const t = content[language];

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      toast.error(language === 'en' ? "Please describe your symptoms" : "Tafadhali eleza dalili zako");
      return;
    }

    setIsAnalyzing(true);

    try {
      const analysisResult = await symptomsAPI.analyze(symptoms);

      setResult({
        urgency: analysisResult.urgency,
        condition: analysisResult.condition,
        recommendations: analysisResult.recommendations,
        disclaimer: analysisResult.disclaimer,
      });

      toast.success(language === 'en' ? "Analysis complete!" : "Uchambuzi umekamilika!");
    } catch (error) {
      toast.error(language === 'en'
        ? "Failed to analyze symptoms. Please try again."
        : "Imeshindwa kuchambanua dalili. Tafadhali jaribu tena.");
      console.error('Symptom analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'default';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <section id="symptom-checker" className="py-20 bg-muted/30">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                {language === 'en' ? 'Powered by AI' : 'Inaendeshwa na AI'}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              {t.title}
            </h2>
            <p className="text-muted-foreground">
              {t.description}
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Describe Your Symptoms' : 'Eleza Dalili Zako'}</CardTitle>
              <CardDescription>
                {language === 'en' 
                  ? 'Be as detailed as possible for better analysis' 
                  : 'Kuwa wa kina iwezekanavyo kwa uchambuzi bora'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={t.placeholder}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <Button 
                onClick={analyzeSymptoms} 
                disabled={isAnalyzing}
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? t.analyzing : t.analyze}
              </Button>

              {result && (
                <div className="mt-6 space-y-4 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <Badge variant={getUrgencyColor(result.urgency)} className="text-sm">
                      {getUrgencyIcon(result.urgency)}
                      {t.urgencyLevels[result.urgency]}
                    </Badge>
                  </div>

                  <div className="p-3 bg-primary/10 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-1">
                      {language === 'en' ? 'Possible Condition:' : 'Hali Inayowezekana:'}
                    </h4>
                    <p className="text-sm text-foreground">{result.condition}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">
                      {language === 'en' ? 'Recommendations:' : 'Mapendekezo:'}
                    </h4>
                    <ul className="space-y-2">
                      {result.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-muted rounded-lg border-l-4 border-yellow-500">
                    <p className="text-xs text-muted-foreground italic">{result.disclaimer}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="default"
                      className="flex-1"
                      onClick={() => document.getElementById('book-doctor')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      {t.bookAppointment}
                    </Button>
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() => document.getElementById('clinic-locator')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      {t.findClinic}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
