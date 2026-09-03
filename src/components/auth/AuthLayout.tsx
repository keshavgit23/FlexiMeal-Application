export interface AuthLayoutProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthLayout({ children, footer }: AuthLayoutProps) {
  return (
    <div
      className="min-h-screen w-full flex flex-col justify-between bg-[#FFFDF9] text-[#111827] selection:bg-[#FEE2E2] selection:text-[#991B1B]"
      style={{
        backgroundColor: 'var(--color-background, #FFFDF9)',
        fontFamily: 'var(--font-family-body, inherit)',
      }}
    >

      {/* Centered Scrollable App Card Area */}
      <main className="w-full flex-1 flex flex-col justify-center items-center px-4 py-4 sm:px-6 sm:py-8">
        <div className="w-full max-w-[420px] mx-auto bg-[#FFFFFF] sm:border sm:border-[#E5E7EB] rounded-2xl sm:p-8 p-4 shadow-none sm:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all">
          {children}
        </div>
      </main>

      {/* App Shell Footer / Navigation */}
      {footer && (
        <footer className="w-full py-4 px-4 border-t border-[#F3F4F6] text-center text-xs text-[#6B7280] bg-[#FFFDF9]">
          {footer}
        </footer>
      )}
    </div>
  );
}