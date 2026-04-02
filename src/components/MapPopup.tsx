import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface MapPopupProps {
  open: boolean;
  onClose: () => void;
}

export default function MapPopup({ open, onClose }: MapPopupProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open || !mapRef.current) return;
    setLoading(true);

    const initMap = async () => {
      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');

      if (mapInstance.current) {
        mapInstance.current.remove();
      }

      const map = L.map(mapRef.current!, { zoomControl: true }).setView([9.1104647, 7.2638260], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(map);

      const icon = L.divIcon({
        html: `<div style="color: hsl(0 60% 35%); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg></div>`,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      L.marker([9.1104647, 7.2638260], { icon }).addTo(map)
        .bindPopup('<b>Wichtech Festoon Project ShowRoom</b><br/>Opposite IBB Plaza, Before Dei Dei International Market<br/>FCT Abuja, Nigeria')
        .openPopup();

      mapInstance.current = map;

      map.whenReady(() => {
        setLoading(false);
        map.invalidateSize();
      });
    };

    // Small delay for dialog animation
    const timer = setTimeout(initMap, 200);

    return () => {
      clearTimeout(timer);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-foreground flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            Our Location
          </DialogTitle>
        </DialogHeader>
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg z-10">
              <Loader2 className="w-6 h-6 text-accent animate-spin" />
              <span className="ml-2 text-sm text-muted-foreground font-body">Loading map...</span>
            </div>
          )}
          <div ref={mapRef} className="w-full h-64 rounded-lg bg-muted" />
        </div>
        <p className="font-body text-sm text-muted-foreground">
          Wichtech Festoon Project Plaza, opposite IBB Plaza, before Dei Dei International Market, FCT Abuja, Nigeria.
        </p>
      </DialogContent>
    </Dialog>
  );
}
