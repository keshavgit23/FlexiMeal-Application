import React, { useState } from 'react';

export interface MenuSectionProps {
  initialMenuItems: string[];
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  initialMenuItems,
}) => {
  const [menuItems, setMenuItems] = useState<string[]>(initialMenuItems);
  const [preparedItems, setPreparedItems] = useState<Record<string, boolean>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [newItemText, setNewItemText] = useState('');

  const togglePrepared = (item: string) => {
    setPreparedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemText.trim()) {
      setMenuItems([...menuItems, newItemText.trim()]);
      setNewItemText('');
    }
  };

  const handleRemoveItem = (indexToRemove: number) => {
    setMenuItems(menuItems.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center text-sm">
            <i className="fa-solid fa-fire-burner" />
          </div>
          <div>
            <h3 className="text-sm font-black font-heading uppercase tracking-wider text-gray-900">
              Menu To Cook
            </h3>
            <span className="text-[11px] text-gray-500">
              Today&apos;s special thali items
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition flex items-center gap-1.5"
        >
          <i className="fa-solid fa-pen text-[10px]" />
          <span>{isEditing ? 'Done' : 'Edit Menu'}</span>
        </button>
      </div>

      {/* Menu List */}
      <div className="space-y-2">
        {menuItems.map((dish, idx) => {
          const isDone = Boolean(preparedItems[dish]);
          return (
            <div
              key={idx}
              onClick={() => !isEditing && togglePrepared(dish)}
              role={!isEditing ? 'button' : undefined}
              tabIndex={!isEditing ? 0 : undefined}
              onKeyDown={(e) => {
                if (!isEditing && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  togglePrepared(dish);
                }
              }}
              className={`flex items-center justify-between p-3 rounded-xl border transition ${
                isDone
                  ? 'bg-emerald-50/50 border-emerald-200 text-gray-400'
                  : 'bg-stone-50/60 border-gray-200 hover:border-emerald-300 text-gray-800'
              } ${!isEditing ? 'cursor-pointer' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-xs transition ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-gray-300 bg-white'
                  }`}
                >
                  {isDone && <i className="fa-solid fa-check text-[9px]" />}
                </div>
                <span
                  className={`text-sm font-medium font-heading ${
                    isDone ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}
                >
                  {dish}
                </span>
              </div>

              {isEditing && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveItem(idx);
                  }}
                  className="w-7 h-7 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center transition"
                  aria-label={`Remove ${dish}`}
                >
                  <i className="fa-solid fa-trash-can text-xs" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add new dish in Edit mode */}
      {isEditing && (
        <form onSubmit={handleAddItem} className="mt-3 flex gap-2">
          <input
            type="text"
            placeholder="Add new dish (e.g. Gulab Jamun)"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-emerald-700 text-white text-xs font-bold rounded-lg hover:bg-emerald-800 transition"
          >
            Add
          </button>
        </form>
      )}

      <p className="text-[10px] text-gray-500 mt-2.5 flex items-center gap-1.5">
        <i className="fa-solid fa-info-circle text-[10px] text-emerald-600" />
        <span>Tap dish to mark as cooked / ready for service</span>
      </p>
    </div>
  );
};
