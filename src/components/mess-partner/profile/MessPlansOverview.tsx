
import React from 'react';

export type MessPlanItem = {
  plan_id: number;
  profile_id: number;
  plan_name: string;
  target_gender: 'MALE' | 'FEMALE' | 'ALL';
  price: string | number;
  is_active: boolean;
  created_at: string;
  meal_types: ('BREAKFAST' | 'LUNCH' | 'DINNER')[];
};

interface MessPlansProps {
  plans: MessPlanItem[];
  onAddPlan: () => void;
  onBack: () => void;
}

const formatPrice = (price: string | number) => {
  const amount = Number(price);

  if (!Number.isFinite(amount)) return '—';

  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);
};

const getAudienceLabel = (gender: MessPlanItem['target_gender']) => {
  switch (gender) {
    case 'MALE':
      return 'Boys only';
    case 'FEMALE':
      return 'Girls only';
    default:
      return 'All Consumers';
  }
};

const getMealLabel = (meal: MessPlanItem['meal_types'][number]) => {
  return meal.charAt(0) + meal.slice(1).toLowerCase();
};

export const MessPlans: React.FC<MessPlansProps> = ({
  plans,
  onAddPlan,
  onBack,
}) => {
  const hasPlans = plans.length > 0;

  return (
    <div className="min-h-screen bg-stone-50/60">
      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-xl
              border border-gray-200 text-gray-600
              hover:bg-gray-50 transition-colors"
            aria-label="Go back"
          >
            <i className="fa-solid fa-arrow-left" />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="font-heading font-black text-gray-900 text-lg">
              Meal Plans
            </h1>
            <p className="text-xs text-gray-500">
              Manage your monthly meal packages
            </p>
          </div>

          {hasPlans && (
            <span className="text-xs font-bold text-emerald-700
              bg-emerald-50 px-3 py-1.5 rounded-full">
              {plans.length} {plans.length === 1 ? 'Plan' : 'Plans'}
            </span>
          )}
        </div>
      </header>

      <main className="p-4 space-y-5 max-w-2xl mx-auto">
        {/* INTRO */}
        <section className="space-y-1">
          <h2 className="font-heading font-black text-xl text-gray-900">
            Your monthly packages
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Create and manage meal packages for students at your mess.
          </p>
        </section>

        {/* EMPTY STATE */}
        {!hasPlans ? (
          <section className="bg-white border border-gray-200 rounded-2xl
            p-6 shadow-sm text-center space-y-4">

            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50
              flex items-center justify-center">
              <i className="fa-solid fa-utensils text-2xl text-emerald-700" />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading font-black text-gray-900 text-lg">
                No meal plans yet
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                Set up your first monthly package. Choose the meals,
                student audience and price that work for your mess.
              </p>
            </div>

            <button
              type="button"
              onClick={onAddPlan}
              className="w-full rounded-xl bg-emerald-700 text-white
                font-bold text-sm py-3.5 px-4
                hover:bg-emerald-800 active:scale-[0.98]
                transition-all flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-plus" />
              Create your first plan
            </button>

            <p className="text-xs text-gray-400">
              You can add more plans whenever you need.
            </p>
          </section>
        ) : (
          <>
            {/* PLAN LIST */}
            <section className="space-y-3">
              {/* ADD ANOTHER PLAN */}
              <button
                type="button"
                onClick={onAddPlan}
                className="w-full rounded-xl border-2 border-dashed
                border-emerald-300 bg-emerald-50/40
                text-emerald-800 font-bold text-sm py-4 px-4
                hover:bg-emerald-50 hover:border-emerald-500
                transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-plus" />
                Add another plan
              </button>
              {plans.map((plan) => (
                <article
                  key={plan.plan_id}
                  className="bg-white border border-gray-200 rounded-2xl
                    p-4 shadow-sm space-y-4"
                >
                  {/* PLAN NAME + STATUS */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <h3 className="font-heading font-black text-gray-900
                        text-base break-words">
                        {plan.plan_name}
                      </h3>

                      <div className="flex items-center gap-1.5
                        text-xs text-gray-500">
                        <i className="fa-solid fa-users text-gray-400" />
                        {getAudienceLabel(plan.target_gender)}
                      </div>
                    </div>

                    <span className={`shrink-0 text-[11px] font-bold
                      px-2.5 py-1 rounded-full ${plan.is_active
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-gray-100 text-gray-500'
                      }`}>
                      {plan.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* PRICE */}
                  <div className="bg-stone-50 rounded-xl p-3
                    flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">
                      Monthly package
                    </span>

                    <div className="text-right">
                      <span className="font-heading font-black
                        text-xl text-gray-900">
                        ₹{formatPrice(plan.price)}
                      </span>
                      <span className="text-xs text-gray-500"> / month</span>
                    </div>
                  </div>

                  {/* INCLUDED MEALS */}
                  <div className="space-y-2">
                    <p className="text-[11px] uppercase tracking-wider
                      font-bold text-gray-400">
                      Included meals
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {plan.meal_types.map((meal) => (
                        <span
                          key={meal}
                          className="inline-flex items-center gap-1.5
                            text-xs font-semibold text-emerald-800
                            bg-emerald-50 border border-emerald-100
                            px-3 py-1.5 rounded-lg"
                        >
                          <i className="fa-solid fa-check text-[10px]" />
                          {getMealLabel(meal)}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </section>

          </>
        )}
      </main>
    </div>
  );
};

export default MessPlans;
