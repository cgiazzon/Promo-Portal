import { useState } from "react";
import { Copy, CalendarClock, ExternalLink, Percent } from "lucide-react";
import { Offer } from "@workspace/api-client-react";
import { cn, formatCurrency, getMarketplaceColor, getMarketplaceBorderColor } from "@/lib/utils";

interface OfferCardProps {
  offer: Offer;
  onSchedule?: (offer: Offer) => void;
}

export function OfferCard({ offer, onSchedule }: OfferCardProps) {
  const [copied, setCopied] = useState(false);

  const copyCoupon = () => {
    if (offer.couponCode) {
      navigator.clipboard.writeText(offer.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={cn(
      "group flex flex-col bg-card rounded-2xl overflow-hidden border transition-all duration-300",
      "hover:shadow-xl hover:-translate-y-1",
      getMarketplaceBorderColor(offer.marketplaceName)
    )}>
      {/* Image & Badges */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        <img 
          src={offer.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop"} 
          alt={offer.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Marketplace Badge */}
        <div className={cn(
          "absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold shadow-md",
          getMarketplaceColor(offer.marketplaceName)
        )}>
          {offer.marketplaceName}
        </div>

        {/* Discount Badge */}
        <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground w-12 h-12 rounded-full flex items-center justify-center font-black shadow-lg rotate-12 group-hover:rotate-0 transition-transform">
          -{offer.discountPercent}%
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="font-display font-semibold text-foreground line-clamp-2 leading-tight">
            {offer.title}
          </h3>
          
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-primary">
              {formatCurrency(offer.finalPrice)}
            </span>
            <span className="text-sm font-medium text-muted-foreground line-through">
              {formatCurrency(offer.originalPrice)}
            </span>
          </div>

          {offer.couponCode && (
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 border border-dashed border-primary/40 bg-primary/5 rounded-lg px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary font-mono font-bold text-sm">
                  <Percent className="w-4 h-4" />
                  {offer.couponCode}
                </div>
                <button 
                  onClick={copyCoupon}
                  className="p-1 hover:bg-primary/10 rounded-md transition-colors text-primary"
                  title="Copiar cupom"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copied && <span className="text-xs text-primary font-medium animate-in fade-in zoom-in">Copiado!</span>}
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-2">
          {onSchedule && (
            <button 
              onClick={() => onSchedule(offer)}
              className="flex-1 bg-gradient-to-r from-primary to-[#1DA851] text-white py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <CalendarClock className="w-5 h-5" />
              Agendar Envio
            </button>
          )}
          <a 
            href={offer.productUrl} 
            target="_blank" 
            rel="noreferrer"
            className="p-2.5 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/80 active:scale-95 transition-all flex items-center justify-center"
            title="Ver no marketplace"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
