import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface MapPopupProps {
  open: boolean;
  onClose: () => void;
}

export default function MapPopup({ open, onClose }: MapPopupProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (!open || !mapRef.current) return;

    const initMap = async () => {
      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');

      if (mapInstance.current) {
        mapInstance.current.remove();
      }

      const map = L.map(mapRef.current!, { zoomControl: false }).setView([9.1104647, 7.2638260], 15);
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
        .bindPopup('<b>Wichtech Showroom</b><br/>Dei Dei, Abuja')
        .openPopup();

      mapInstance.current = map;
      setTimeout(() => map.invalidateSize(), 100);
    };

    setTimeout(initMap, 100);

    return () => {
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
        <div ref={mapRef} className="w-full h-64 rounded-lg bg-muted" />
        <p className="font-body text-sm text-muted-foreground">
          Dei Dei, Abuja, Nigeria — Visit our showroom for a premium in-person experience.
        </p>
      </DialogContent>
    </Dialog>
  );
}
