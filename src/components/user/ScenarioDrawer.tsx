import React from 'react';
import { useApp } from '../../context/AppContext';
import type { ScenarioKey } from '../../types/user';

export const ScenarioDrawer: React.FC = () => {
  const {
    isScenarioTesterOpen,
    setIsScenarioTesterOpen,
    activeScenario,
    setScenario,
  } = useApp();

  if (!isScenarioTesterOpen) return null;

  const scenarios: Array<{
    key: ScenarioKey;
    title: string;
    description: string;
    badge: string;
  }> = [
    {
      key: 'A',
      title: 'Scenario A: New Consumer (No Subscription)',
      description: 'Zero subscriptions. Home shows empty state "Find your regular mess" + benefits + real messes without fake stats.',
      badge: 'Empty State',
    },
    {
      key: 'B',
      title: 'Scenario B: Lunch Subscription Only',
      description: 'Single active lunch plan at Rajeshwari Mess. Daily operational dashboard active.',
      badge: 'Single Plan',
    },
    {
      key: 'C',
      title: 'Scenario C: Lunch + Dinner Subscriptions',
      description: 'Independent subscriptions: Lunch at Rajeshwari Mess and Dinner at Annapurna Mess.',
      badge: 'Multi-Plan',
    },
    {
      key: 'D',
      title: "Scenario D: Not Responded to Today's Meal",
      description: "Hero shows 'Will you eat today?' with cutoff alert and auto-default warning.",
      badge: 'Action Required',
    },
    {
      key: 'E',
      title: 'Scenario E: Explicit YES Selected',
      description: "User explicitly tapped YES. State displays 'You're eating today' + Confirmed.",
      badge: 'Confirmed YES',
    },
    {
      key: 'F',
      title: 'Scenario F: Explicit NO Selected',
      description: "User explicitly tapped NO. State displays 'Not eating today' + Confirmed.",
      badge: 'Confirmed NO',
    },
    {
      key: 'G',
      title: 'Scenario G: Default YES Automatically Applied',
      description: "Cutoff passed without response. Shows 'YES — Default' with explanatory note.",
      badge: 'Default Applied',
    },
    {
      key: 'H',
      title: 'Scenario H: Payment Submitted (Pending)',
      description: 'Payment submitted with UTR. Status is explicitly "Pending Verification", NOT Paid.',
      badge: 'Pending Verification',
    },
    {
      key: 'I',
      title: 'Scenario I: Payment Verified (Paid)',
      description: 'Mess verified the bank transfer. Status shows verified and active.',
      badge: 'Paid',
    },
    {
      key: 'J',
      title: 'Scenario J: PAYG at Another Mess',
      description: 'Consumer with monthly plan buys an individual meal at another mess without cancelling plan.',
      badge: 'PAYG',
    },
    {
      key: 'K',
      title: 'Scenario K: Discover Empty State',
      description: 'Filter parameters result in no messes found. Clear filters CTA shown.',
      badge: 'Empty Filter',
    },
    {
      key: 'L',
      title: 'Scenario L: Backend/API Error',
      description: 'Simulates network or cutoff sync failure with designed "Try Again" state.',
      badge: 'Error & Retry',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center p-0">
      <div
        className="w-full max-w-[430px] bg-[#FFFDF9] rounded-t-3xl border-t border-[#E5E7EB] shadow-2xl p-4 flex flex-col max-h-[88vh] animate-in slide-in-from-bottom duration-200"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
      >
        <div className="w-10 h-1.5 bg-[#D1D5DB] rounded-full mx-auto mb-3"></div>

        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] mb-3">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#FF6B00] uppercase tracking-wide">
              <i className="fa-solid fa-flask-vial"></i>
              <span>Section 27 Scenario Switcher</span>
            </div>
            <h2 className="font-heading font-bold text-lg text-[#111827]">
              Test Product Scenarios
            </h2>
          </div>
          <button
            onClick={() => setIsScenarioTesterOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B7280] hover:bg-[#F3F4F6]"
          >
            <i className="fa-solid fa-xmark text-base"></i>
          </button>
        </div>

        <div className="overflow-y-auto space-y-2 flex-1 pr-1">
          {scenarios.map((sc) => {
            const isActive = activeScenario === sc.key;
            return (
              <button
                key={sc.key}
                onClick={() => {
                  setScenario(sc.key);
                  setIsScenarioTesterOpen(false);
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-2.5 ${
                  isActive
                    ? 'border-[#DC2626] bg-[#FFF8EE] shadow-xs ring-1 ring-[#DC2626]'
                    : 'border-[#E5E7EB] bg-white hover:bg-[#F9FAFB]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    isActive
                      ? 'bg-[#DC2626] text-white'
                      : 'bg-[#F3F4F6] text-[#6B7280]'
                  }`}
                >
                  {sc.key}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-heading font-bold text-xs text-[#111827] truncate">
                      {sc.title}
                    </span>
                    <span className="text-[10px] font-semibold text-[#6B7280] shrink-0 bg-[#F3F4F6] px-1.5 py-0.5 rounded">
                      {sc.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#4B5563] leading-relaxed">
                    {sc.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
