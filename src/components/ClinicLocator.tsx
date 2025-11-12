import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Phone, Clock, Star } from "lucide-react";

interface ClinicLocatorProps {
  language: 'en' | 'sw';
}

// Mock clinic data
const mockClinics = [
  {
    id: 1,
    name: "Nairobi Medical Center",
    nameSwahili: "Kituo cha Matibabu cha Nairobi",
    distance: "1.2 km",
    rating: 4.5,
    services: ["General Practice", "Pediatrics", "Emergency"],
    servicesSwahili: ["Matibabu ya Jumla", "Watoto", "Dharura"],
    phone: "+254 712 345 678",
    hours: "24/7",
  },
  {
    id: 2,
    name: "Kenyatta Community Clinic",
    nameSwahili: "Kliniki ya Jamii ya Kenyatta",
    distance: "2.5 km",
    rating: 4.3,
    services: ["General Practice", "Maternal Health"],
    servicesSwahili: ["Matibabu ya Jumla", "Afya ya Mama na Mtoto"],
    phone: "+254 723 456 789",
    hours: "8:00 AM - 8:00 PM",
  },
  {
    id: 3,
    name: "Afya Plus Health Center",
    nameSwahili: "Kituo cha Afya Plus",
    distance: "3.8 km",
    rating: 4.7,
    services: ["General Practice", "Laboratory", "Pharmacy"],
    servicesSwahili: ["Matibabu ya Jumla", "Maabara", "Duka la Dawa"],
    phone: "+254 734 567 890",
    hours: "7:00 AM - 10:00 PM",
  },
];

export const ClinicLocator = ({ language }: ClinicLocatorProps) => {
  const [location, setLocation] = useState("");
  const [clinics, setClinics] = useState(mockClinics);

  const content = {
    en: {
      title: "Find Nearby Clinics",
      description: "Locate healthcare facilities near you",
      placeholder: "Enter your location or use current location",
      useLocation: "Use My Location",
      distance: "Distance",
      services: "Services",
      hours: "Hours",
      call: "Call",
      getDirections: "Get Directions",
      openNow: "Open Now",
    },
    sw: {
      title: "Tafuta Kliniki Karibu",
      description: "Pata vituo vya afya karibu nawe",
      placeholder: "Ingiza eneo lako au tumia mahali ulipo",
      useLocation: "Tumia Mahali Pangu",
      distance: "Umbali",
      services: "Huduma",
      hours: "Masaa",
      call: "Piga Simu",
      getDirections: "Pata Maelekezo",
      openNow: "Imefunguka Sasa",
    },
  };

  const t = content[language];

  const handleUseLocation = () => {
    // In production, this would use the Geolocation API
    setLocation("Nairobi, Kenya");
  };

  return (
    <section id="clinic-locator" className="py-20 bg-background">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              {t.title}
            </h2>
            <p className="text-muted-foreground">
              {t.description}
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder={t.placeholder}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleUseLocation} variant="secondary">
              <Navigation className="w-4 h-4" />
              {t.useLocation}
            </Button>
          </div>

          {/* Map Placeholder */}
          <div className="w-full h-64 sm:h-96 bg-muted rounded-lg border-2 border-border flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
            <div className="relative z-10 text-center space-y-2">
              <MapPin className="w-12 h-12 text-primary mx-auto" />
              <p className="text-muted-foreground">
                {language === 'en' 
                  ? 'Interactive map will load here' 
                  : 'Ramani ya interactive itapakia hapa'}
              </p>
            </div>
          </div>

          {/* Clinic List */}
          <div className="space-y-4">
            {clinics.map((clinic) => (
              <Card key={clinic.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">
                        {language === 'en' ? clinic.name : clinic.nameSwahili}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {clinic.distance}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-secondary text-secondary" />
                          {clinic.rating}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {t.openNow}
                        </Badge>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {(language === 'en' ? clinic.services : clinic.servicesSwahili).map((service, index) => (
                      <Badge key={index} variant="outline">
                        {service}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {clinic.hours}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {clinic.phone}
                    </span>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button variant="default" className="flex-1">
                      <Phone className="w-4 h-4" />
                      {t.call}
                    </Button>
                    <Button variant="secondary" className="flex-1">
                      <Navigation className="w-4 h-4" />
                      {t.getDirections}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
