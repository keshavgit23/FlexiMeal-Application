import BrandLogo from "../../assets/BrandLogo.jpeg";

export interface AuthHeaderProps {
    title?: string;
    subtitle?: string;
    badgeText?: string;
}
export function AuthHeader({
    title = 'Welcome back',
    subtitle = 'Sign in to access your customized meal plans, nutrition goals, and canteen pre-orders.',
    badgeText = 'Choice Made Simple',
}: AuthHeaderProps) {
    return (
        <header className="flex flex-col items-center text-center mb-6 w-full">
            {/* Brand Logo & PWA Tag */}
            <div className="flex flex-col items-center gap-3 mb-3">
                <div className="relative flex items-center justify-center">
                    <img
                        src={BrandLogo}
                        alt="FlexiMeal"
                        className="w-14 h-14 rounded-full object-contain drop-shadow-sm transition-transform duration-200 hover:scale-105"
                    />
                </div>

                <div className="flex items-center gap-1.5">
                    <span
                        className="text-2xl font-extrabold tracking-tight text-[#111827]"
                        style={{ fontFamily: 'var(--font-family-heading, inherit)' }}
                    >
                        Flexi<span className="text-[#FF6B00]">Meal</span>
                    </span>
                </div>

                {badgeText && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF8EE] border border-[#FFEDD5] text-[#FF6B00] text-[11px] font-bold tracking-wide uppercase">
                        <span>{badgeText}</span>
                    </div>
                )}
            </div>

            {/* Main Heading */}
            <h1
                className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight mb-1.5"
                style={{ fontFamily: 'var(--font-family-heading, inherit)' }}
            >
                {title}
            </h1>

            {/* Supporting Subtext */}
            {subtitle && (
                <p
                    className="text-xs sm:text-sm text-[#6B7280] leading-relaxed max-w-xs sm:max-w-sm"
                    style={{ fontFamily: 'var(--font-family-body, inherit)' }}
                >
                    {subtitle}
                </p>
            )}
        </header>
    );
}