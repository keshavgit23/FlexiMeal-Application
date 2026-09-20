import React from 'react';
import BrandLogo from '../../assets/BrandLogo.jpeg';
/**
 * ============================================================================
 * LOGO PLACEHOLDER COMPONENT
 * ============================================================================
 * This component visually reserves the exact space for the official FlexiMeal logo.
 * Future developers can replace the contents inside this container with:
 *   - An SVG file: <img src="/assets/logo.svg" alt="FlexiMeal" />
 *   - A PNG file: <img src="/assets/logo.png" alt="FlexiMeal" />
 *   - Or your dedicated <BrandLogo /> component
 *
 * It is completely decoupled from onboarding business logic.
 * ============================================================================
 */

interface LogoPlaceholderProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  tagline?: string;
  className?: string;
  layout?: 'row' | 'column';
}

export const LogoPlaceholder: React.FC<LogoPlaceholderProps> = ({
  size = 'md',
  showTagline = false,
  tagline = 'Better Meals. Happier Days.',
  className = '',
  layout = 'column',
}) => {

  const brandTextSize = {
    sm: 'text-base font-bold',
    md: 'text-2xl font-bold tracking-tight',
    lg: 'text-3xl font-extrabold tracking-tight',
  }[size];

  return (
    <div
      id="fleximeal-logo-container"
      className={`flex ${layout === 'row' ? 'flex-row items-center gap-2.5' : 'flex-col items-center gap-2'} ${className}`}
      aria-label="FlexiMeal Logo"
    >
      <div className="flex items-center gap-2">
          {/* Default placeholder icon using Font Awesome */}
          <img
            src={BrandLogo}
            alt="FlexiMeal"
            className="w-14 h-14 rounded-full object-contain drop-shadow-sm transition-transform duration-200 hover:scale-105"
          />
       

        <span
          className={`${brandTextSize} text-[#111827]`}
          style={{ fontFamily: 'var(--font-family-heading)' }}
        >
          Flexi<span className="text-[#FF6B00]">Meal</span>
        </span>
      </div>

      {showTagline && tagline && (
        <p
          className="text-xs text-[#6B7280] font-medium tracking-normal text-center"
          style={{ fontFamily: 'var(--font-family-body)' }}
        >
          {tagline}
        </p>
      )}
    </div>
  );
};
