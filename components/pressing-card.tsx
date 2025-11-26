"use client"

import { Star, MapPin, Scale, Shirt, Bike, Building } from "lucide-react"
import { memo } from "react"

interface PressCardProps {
  pressing: any
  onSelect: () => void
}

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
      {halfStar && <Star key="half" className="w-4 h-4 text-yellow-400" />}
      {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-gray-300" />)}
      <span className="ml-1 text-sm font-bold">{rating}</span>
    </div>
  );
};

const PressingCardComponent = ({ pressing, onSelect }: PressCardProps) => {
  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  const avatarColors = ['bg-teal-500', 'bg-red-400', 'bg-blue-500', 'bg-orange-400'];
  const colorIndex = pressing.name.length % avatarColors.length;
  const avatarColor = avatarColors[colorIndex];

  return (
    <button
      onClick={onSelect}
      className="w-full text-left group p-4 rounded-2xl bg-card border border-border/10 shadow-lg shadow-primary/5 hover:shadow-primary/20 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-xs font-bold ${
          pressing.pricingType === 'kilo' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
      }`}>
          {pressing.pricingType === 'kilo' ? 'Au Kilo' : 'À la pièce'}
      </div>

      <div className="flex items-center gap-4 mt-2">
        <div className={`w-14 h-14 ${avatarColor} rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0`}>
          {getInitials(pressing.name)}
        </div>

        <div className="flex-grow">
          <div className="flex justify-between items-start pr-16">
            <h3 className="font-bold text-foreground text-base">{pressing.name}</h3>
          </div>
          
          <div className="flex items-center gap-2 mt-0.5 mb-2">
            <StarRating rating={pressing.rating} />
            <span className="text-xs text-muted-foreground">• {pressing.distance} km</span>
          </div>
          
          {pressing.delivery ? (
            <p className="flex items-center gap-2 text-sm text-blue-500 font-semibold">
              <Bike size={14} />
              <span>Livraison à domicile</span>
            </p>
          ) : (
            <p className="flex items-center gap-2 text-sm text-red-500 font-semibold">
              <Building size={14} />
              <span>Sur place uniquement</span>
            </p>
          )}

          <div className="flex items-center justify-between text-sm text-muted-foreground mt-3 border-t border-border pt-2">
            {pressing.pricingType === 'piece' && (
                <div className="flex items-center gap-2 bg-blue-50 px-2 py-1 rounded-md">
                    <Shirt size={14} className="text-blue-600" />
                    <span className="font-bold text-blue-700">{pressing.pricePerPiece} F <span className="font-normal text-blue-600/70">/ pièce</span></span>
                </div>
            )}
            {pressing.pricingType === 'kilo' && (
                <div className="flex items-center gap-2 bg-orange-50 px-2 py-1 rounded-md">
                    <Scale size={14} className="text-orange-600" />
                    <span className="font-bold text-orange-700">{pressing.pricePerKilo} F <span className="font-normal text-orange-600/70">/ kg</span></span>
                </div>
            )}
            <span className="text-muted-foreground/30 ml-auto group-hover:translate-x-1 transition-transform">{'>'}</span>
          </div>
        </div>
      </div>
    </button>
  )
}

export default memo(PressingCardComponent);
