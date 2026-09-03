export interface AuthDividerProps {
  text?: string;
}


export function AuthDivider({ text = 'OR' }: AuthDividerProps) {
  return (
    <div className="relative flex items-center justify-center my-1 w-full" role="separator">
      <div className="w-full border-t border-[#E5E7EB]" />
      <span
        className="absolute bg-[#FFFDF9] sm:bg-[#FFFFFF] px-3 text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]"
        style={{ fontFamily: 'var(--font-family-body, inherit)' }}
      >
        {text}
      </span>
    </div>
  );
}