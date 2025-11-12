import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Phone, Clock, Star } from "lucide-react";
import { clinicsAPI } from "@/services/api";
import { toast } from "sonner";

interface ClinicLocatorProps {
  language: 'en' | 'sw';
}

interface Clinic {
  id: string;
  name: string;
  location: string;
  distance: string;
  rating: number;
  services: string[];
  hours: string;
  phone: string;
  coordinates: { lat: number; lng: number };
}

export const ClinicLocator = ({ language }: ClinicLocatorProps) => {
  const [location, setLocation] = useState("");
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load all clinics on mount
  useEffect(() => {
    const loadClinics = async () => {
      try {
        const data = await clinicsAPI.getAll();
        setClinics(data);
      } catch (error) {
        toast.error(language === 'en'
          ? "Failed to load clinics"
          : "Imeshindwa kupakia kliniki");
        console.error('Error loading clinics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClinics();
  }, [language]);

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
    // Use the Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude}, ${longitude}`);

          try {
            const nearbyClinics = await clinicsAPI.getNearby(latitude, longitude);
            setClinics(nearbyClinics);
            toast.success(language === 'en'
              ? "Found nearby clinics"
              : "Kliniki za karibu zimepatikana");
          } catch (error) {
            toast.error(language === 'en'
              ? "Failed to find nearby clinics"
              : "Imeshindwa kupata kliniki za karibu");
          }
        },
        (error) => {
          toast.error(language === 'en'
            ? "Unable to get your location"
            : "Haiwezi kupata mahali pako");
          console.error('Geolocation error:', error);
        }
      );
    } else {
      toast.error(language === 'en'
        ? "Geolocation not supported"
        : "Geolocation haitegemezwi");
    }
  };

  const handleSearch = async () => {
    if (!location.trim()) {
      const data = await clinicsAPI.getAll();
      setClinics(data);
      return;
    }

    try {
      const results = await clinicsAPI.search(location);
      setClinics(results);

      if (results.length === 0) {
        toast.info(language === 'en'
          ? "No clinics found for this location"
          : "Hakuna kliniki zilizopatikana kwa eneo hili");
      }
    } catch (error) {
      toast.error(language === 'en'
        ? "Failed to search clinics"
        : "Imeshindwa kutafuta kliniki");
      console.error('Search error:', error);
    }
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
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} variant="default">
              {language === 'en' ? 'Search' : 'Tafuta'}
            </Button>
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
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {language === 'en' ? 'Loading clinics...' : 'Inapakia kliniki...'}
                </p>
              </div>
            ) : clinics.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {language === 'en' ? 'No clinics found' : 'Hakuna kliniki zilizopatikana'}
                </p>
              </div>
            ) : (
              clinics.map((clinic) => (
                <Card key={clinic.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{clinic.name}</CardTitle>
                        <CardDescription className="flex items-center gap-4 text-sm flex-wrap">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {clinic.location} • {clinic.distance}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-secondary text-secondary" />
                            {clinic.rating}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {clinic.services.map((service, index) => (
                        <Badge key={index} variant="outline">
                          {service}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
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
                      <Button
                        variant="default"
                        className="flex-1"
                        onClick={() => window.open(`tel:${clinic.phone}`, '_self')}
                      >
                        <Phone className="w-4 h-4" />
                        {t.call}
                      </Button>
                      <Button
                        variant="secondary"
                        className="flex-1"
                        onClick={() =>
                          window.open(
                            `https://www.google.com/maps/search/?api=1&query=${clinic.coordinates.lat},${clinic.coordinates.lng}`,
                            '_blank'
                          )
                        }
                      >
                        <Navigation className="w-4 h-4" />
                        {t.getDirections}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
