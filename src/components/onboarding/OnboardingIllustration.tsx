import React, { useState } from 'react';

/**
 * ============================================================================
 * ONBOARDING ILLUSTRATION COMPONENT
 * ============================================================================
 * Easily replaceable illustration container.
 * Future developers can simply update the `src` attribute:
 *   <OnboardingIllustration src="/assets/onboarding/welcome.png" alt="Student enjoying mess meal" />
 *
 * If no image is provided, or if the external image is not yet available,
 * this component automatically renders a modern, friendly fallback illustration
 * crafted for FlexiMeal's warm food and college student aesthetic.
 * ============================================================================
 */

export type IllustrationType = 'welcome' | 'profile' | 'role' | 'college' | 'food' | 'success' | 'loading';

interface OnboardingIllustrationProps {
  src?: string;
  alt: string;
  illustrationType?: IllustrationType;
  className?: string;
  aspectRatio?: 'square' | 'wide' | 'auto';
}

export const OnboardingIllustration: React.FC<OnboardingIllustrationProps> = ({
  src,
  alt,
  illustrationType = 'welcome',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  // Render external image if provided and valid
  if (src && !imgError) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-2xl ${className}`}
      >
        <img
          src={src}
          alt={alt}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain max-h-[220px]"
          loading="lazy"
        />
      </div>
    );
  }

  // Visual SVG illustration fallbacks
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      role="img"
      aria-label={alt}
    >
      {illustrationType === 'welcome' && (
        <svg viewBox="0 0 320 220" className="w-full max-w-[280px] h-auto drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Warm background glow */}
          <ellipse cx="160" cy="125" rx="130" ry="80" fill="#FFF7ED" />
          <path d="M70 145 C60 100 110 65 170 60 C230 55 265 95 255 145 C245 180 180 190 120 185 C80 180 75 165 70 145 Z" fill="#FFEDD5" opacity="0.6" />
          
          {/* Subtle leaves / organic food accents */}
          <path d="M45 130 C40 115 52 105 65 110 C62 125 50 135 45 130 Z" fill="#86EFAC" />
          <path d="M260 110 C275 105 285 118 280 130 C268 128 260 118 260 110 Z" fill="#86EFAC" />
          <circle cx="68" cy="80" r="4" fill="#FDBA74" />
          <circle cx="255" cy="70" r="5" fill="#FDBA74" />
          <circle cx="275" cy="140" r="3" fill="#F97316" />

          {/* Student eating illustration elements */}
          {/* Table surface */}
          <ellipse cx="160" cy="182" rx="105" ry="18" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="2" />
          
          {/* Student body with warm hoodie */}
          <path d="M125 155 C125 125 140 110 160 110 C180 110 195 125 195 155 Z" fill="#F97316" />
          <path d="M148 110 L160 122 L172 110 Z" fill="#EA580C" />

          {/* Head & Hair */}
          <circle cx="160" cy="92" r="20" fill="#FBCFE8" />
          <path d="M142 88 C144 72 156 68 168 68 C176 68 181 74 180 88 C175 80 168 78 160 78 C152 78 145 82 142 88 Z" fill="#1F2937" />
          <circle cx="154" cy="90" r="2" fill="#374151" />
          <circle cx="166" cy="90" r="2" fill="#374151" />
          <path d="M157 97 Q160 101 163 97" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" />

          {/* Mess Meal Plate / Thali */}
          <ellipse cx="160" cy="174" rx="42" ry="12" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1.5" />
          <ellipse cx="160" cy="173" rx="36" ry="9" fill="#FEF3C7" />
          {/* Katori bowls with curry/dal */}
          <circle cx="145" cy="172" r="6" fill="#F97316" />
          <circle cx="160" cy="170" r="6" fill="#10B981" />
          <circle cx="175" cy="172" r="6" fill="#FBBF24" />
          {/* Roti / Bread */}
          <ellipse cx="140" cy="174" rx="7" ry="4" fill="#FDE68A" stroke="#D97706" strokeWidth="0.5" />

          {/* Phone in hand */}
          <rect x="185" y="125" width="16" height="26" rx="3" fill="#1E293B" transform="rotate(-15 185 125)" />
          <rect x="187" y="127" width="12" height="20" rx="2" fill="#38BDF8" transform="rotate(-15 187 127)" />
          {/* Hand holding phone */}
          <circle cx="188" cy="142" r="6" fill="#FBCFE8" />

          {/* Floating verified food badge */}
          <g transform="translate(210, 72)">
            <circle cx="16" cy="16" r="16" fill="#FFFFFF" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))" />
            <circle cx="16" cy="16" r="12" fill="#FF6B00" />
            <path d="M12 16 L15 19 L21 13" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      )}

      {illustrationType === 'profile' && (
        <svg viewBox="0 0 200 160" className="w-full max-w-[180px] h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Warm decorative background */}
          <circle cx="100" cy="80" r="60" fill="#FFF7ED" />
          <circle cx="100" cy="80" r="48" fill="#FFEDD5" opacity="0.6" />
          
          {/* Sparkles */}
          <path d="M48 45 L50 40 L52 45 L57 47 L52 49 L50 54 L48 49 L43 47 Z" fill="#F97316" />
          <path d="M152 42 L153 38 L155 42 L159 43 L155 45 L153 49 L152 45 L148 43 Z" fill="#FBBF24" />
          <circle cx="160" cy="98" r="3" fill="#F97316" />
          <circle cx="42" cy="95" r="3" fill="#FBBF24" />

          {/* Clean User Profile Silhouette / Avatar */}
          <g transform="translate(60, 36)">
            <circle cx="40" cy="30" r="22" fill="#FED7AA" />
            <path d="M22 28 C24 12 36 8 48 8 C58 8 64 15 62 30 C56 22 48 20 40 20 C32 20 25 24 22 28 Z" fill="#1F2937" />
            {/* Shoulders */}
            <path d="M14 80 C14 62 26 54 40 54 C54 54 66 62 66 80 Z" fill="#3B82F6" />
            {/* Collar */}
            <path d="M34 54 L40 64 L46 54 Z" fill="#FFFFFF" />
          </g>
        </svg>
      )}

      {illustrationType === 'food' && (
        <svg viewBox="0 0 220 160" className="w-full max-w-[200px] h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="110" cy="115" rx="80" ry="40" fill="#FFF7ED" />
          
          {/* Steaming aroma lines */}
          <path d="M95 55 Q90 40 100 30" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
          <path d="M110 50 Q115 35 110 25" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
          <path d="M125 55 Q130 40 120 30" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />

          {/* Steaming hot meal bowl */}
          <ellipse cx="110" cy="112" rx="55" ry="18" fill="#EA580C" />
          <path d="M55 112 C55 145 165 145 165 112 Z" fill="#FF6B00" />
          <ellipse cx="110" cy="110" rx="50" ry="14" fill="#FED7AA" />
          
          {/* Fresh vegetables & toppings */}
          <circle cx="95" cy="108" r="8" fill="#10B981" />
          <circle cx="112" cy="105" r="9" fill="#EF4444" />
          <circle cx="128" cy="109" r="8" fill="#F59E0B" />
          <circle cx="106" cy="113" r="6" fill="#16A34A" />
          
          {/* Subtle leaves */}
          <path d="M110 96 C115 90 122 92 120 98 C115 97 112 96 110 96 Z" fill="#34D399" />
          
          {/* Sparkles */}
          <circle cx="48" cy="75" r="3" fill="#FBBF24" />
          <circle cx="178" cy="85" r="3.5" fill="#F97316" />
        </svg>
      )}

      {illustrationType === 'success' && (
        <svg viewBox="0 0 240 180" className="w-full max-w-[210px] h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Subtle radiating glow */}
          <circle cx="120" cy="90" r="70" fill="#FFF7ED" />
          
          {/* Confetti particles */}
          <rect x="55" y="45" width="8" height="4" rx="2" fill="#F97316" transform="rotate(35 55 45)" />
          <rect x="180" y="50" width="7" height="4" rx="2" fill="#FBBF24" transform="rotate(-25 180 50)" />
          <rect x="60" y="130" width="8" height="4" rx="2" fill="#34D399" transform="rotate(-40 60 130)" />
          <rect x="185" y="125" width="8" height="4" rx="2" fill="#FF6B00" transform="rotate(20 185 125)" />
          <circle cx="75" cy="85" r="3.5" fill="#F97316" />
          <circle cx="170" cy="90" r="4" fill="#10B981" />
          <circle cx="120" cy="25" r="3" fill="#F59E0B" />
          
          {/* Festive streamers */}
          <path d="M45 70 Q55 65 50 55" stroke="#F97316" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M195 85 Q185 80 190 70" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Central Check Circle Badge */}
          <circle cx="120" cy="90" r="42" fill="#FF6B00" className="shadow-lg" />
          <circle cx="120" cy="90" r="38" fill="#FF7817" />
          {/* Clean White Checkmark */}
          <path d="M107 90 L116 99 L134 81" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

      {illustrationType === 'loading' && (
        <svg viewBox="0 0 200 160" className="w-full max-w-[180px] h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="115" rx="70" ry="32" fill="#FFF7ED" />
          {/* Steaming meal */}
          <ellipse cx="100" cy="105" rx="45" ry="14" fill="#EA580C" />
          <path d="M55 105 C55 132 145 132 145 105 Z" fill="#FF6B00" />
          <ellipse cx="100" cy="103" rx="40" ry="10" fill="#FED7AA" />
          <circle cx="90" cy="101" r="6" fill="#10B981" />
          <circle cx="104" cy="99" r="6" fill="#EF4444" />
          <circle cx="114" cy="102" r="5" fill="#F59E0B" />
          {/* Steams */}
          <path d="M92 65 Q88 52 96 42" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
          <path d="M102 60 Q106 48 102 38" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
          <path d="M112 65 Q116 52 108 42" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
};
