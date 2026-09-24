import React, { useState, useRef, useEffect } from 'react';
import { Plus, Minus, Trash2, AlertTriangle } from 'lucide-react';
import { CartItemType } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import { DishImage } from './DishImage';
import { useSplit } from '../features/split/SplitContext';
import { SplitPerson } from '../features/split/splitTypes';

interface CartItemProps {
  item: CartItemType;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    isSplitMode,
    people,
    assignments,
    toggleAssignment,
    assignToPerson,
    getAvatarColor,
    getInitials,
  } = useSplit();

  const lineTotal = item.price * item.quantity;
  const rawAssigned = assignments[item.id];
  const defaultPersonId = people[0]?.id || 'person_you';
  // Items default to being assigned to the primary payer ("You") until explicitly unassigned
  const assignedIds: string[] =
    rawAssigned !== undefined ? rawAssigned : [defaultPersonId];
  const assignedPeople = people.filter((p: SplitPerson) => assignedIds.includes(p.id));
  const isUnassigned = isSplitMode && assignedPeople.length === 0;

  const triggerRemoval = () => {
    if (isExiting) return;
    setIsExiting(true);
    exitTimeoutRef.current = setTimeout(() => {
      onRemove(item.id);
    }, 200);
  };

  const handleDecrease = () => {
    if (item.quantity <= 1) {
      triggerRemoval();
    } else {
      onDecrease(item.id);
    }
  };

  useEffect(() => {
    return () => {
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      id={`cart-item-${item.id}`}
      style={{
        animation: isExiting
          ? 'itemSlideOut 200ms cubic-bezier(0.22, 1, 0.36, 1) forwards'
          : 'itemSlideIn var(--dur-base) var(--ease-out)',
        willChange: isExiting ? 'transform, opacity' : 'auto',
      }}
      className={`group relative flex flex-col gap-2 rounded-xl border bg-[#141414] p-3 transition-colors duration-[var(--dur-fast)] ${
        isUnassigned
          ? 'border-amber-500/40 hover:border-amber-500/60'
          : 'border-[#262626] hover:border-[#FFD60A]/40'
      }`}
    >
      {/* Top Row: Image & Details */}
      <div className="flex items-center gap-3.5">
        {/* Item Image Thumbnail */}
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#0A0A0A]">
          <DishImage
            slug={item.slug}
            name={item.name}
            category={item.category}
            width={80}
            height={80}
            isThumbnail={true}
            className="h-full w-full object-cover object-center"
          />
          {/* Dietary indicator dot */}
          <span
            className={`absolute bottom-1 right-1 h-2 w-2 rounded-full ring-1 ring-[#0A0A0A] ${
              item.dietary === 'veg' ? 'bg-emerald-400' : 'bg-rose-400'
            }`}
            title={item.dietary === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
          />
        </div>

        {/* Item Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-1">
            <h4 className="font-sora text-xs font-bold text-[#F5F5F5] line-clamp-1">
              {item.name}
            </h4>

            {/* Remove Button */}
            <button
              onClick={triggerRemoval}
              id={`remove-cart-item-${item.id}`}
              aria-label={`Remove ${item.name} from cart`}
              className="press-scale rounded p-1 text-[#A3A3A3] transition-colors hover:bg-[#262626] hover:text-rose-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-rose-500"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Unit price */}
          <p className="font-mono text-[11px] text-[#A3A3A3]">
            {formatCurrency(item.price)} each
          </p>

          {/* Quantity Controls & Line Total */}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center rounded-lg border border-[#262626] bg-[#0A0A0A] p-0.5">
              <button
                onClick={handleDecrease}
                id={`decrease-cart-item-${item.id}`}
                aria-label={`Decrease quantity of ${item.name}`}
                className="press-scale flex h-6 w-6 items-center justify-center rounded text-[#A3A3A3] transition-colors hover:bg-[#262626] hover:text-[#F5F5F5] focus:outline-none"
              >
                <Minus className="h-3 w-3" />
              </button>

              <span className="w-7 text-center font-mono text-xs font-bold text-[#F5F5F5]">
                {item.quantity}
              </span>

              <button
                onClick={() => onIncrease(item.id)}
                id={`increase-cart-item-${item.id}`}
                aria-label={`Increase quantity of ${item.name}`}
                className="press-scale flex h-6 w-6 items-center justify-center rounded text-[#A3A3A3] transition-colors hover:bg-[#FFD60A] hover:text-[#0A0A0A] focus:outline-none"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>

            <span className="font-bebas text-lg tracking-wide text-[#FFD60A]">
              {formatCurrency(lineTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Split Assignment Control (Displayed only when Split Mode is active) */}
      {isSplitMode && (
        <div className="mt-1 border-t border-[#222222] pt-2">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#737373]">
              Assign To:
            </span>

            {/* Unassigned Warning Badge & Quick Action */}
            {isUnassigned ? (
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 font-mono text-[10px] font-bold text-[#FFD60A]">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Unassigned</span>
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    assignToPerson(item.id, defaultPersonId);
                  }}
                  className="font-mono text-[10px] text-[#FFD60A] underline hover:text-[#FFE566] transition-colors"
                >
                  Assign to You
                </button>
              </div>
            ) : (
              <span className="font-mono text-[10px] text-[#A3A3A3]">
                {assignedPeople.length === 1
                  ? `For ${assignedPeople[0].name}`
                  : `Split (${formatCurrency(lineTotal / assignedPeople.length)} ea)`}
              </span>
            )}
          </div>

          {/* Participant Avatar Chips */}
          <div
            className="mt-1.5 flex flex-wrap gap-1.5"
            role="group"
            aria-label={`Assign participants for ${item.name}`}
          >
            {people.map((person: SplitPerson) => {
              const isAssigned = assignedIds.includes(person.id);
              const color = getAvatarColor(person.colorIndex);
              const initials = getInitials(person.name);

              return (
                <button
                  key={person.id}
                  type="button"
                  aria-pressed={isAssigned}
                  aria-label={
                    isAssigned
                      ? `Remove assignment of ${item.name} for ${person.name}`
                      : `Assign ${item.name} to ${person.name}`
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleAssignment(item.id, person.id);
                  }}
                  className={`press-scale relative flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A] cursor-pointer ${
                    isAssigned
                      ? 'shadow-sm font-semibold'
                      : 'border-[#2D2D2D] bg-[#0E0E0E] text-[#888888] opacity-75 hover:opacity-100 hover:border-[#555555]'
                  }`}
                  style={
                    isAssigned
                      ? {
                          borderColor: color.border,
                          backgroundColor: color.bg,
                          color: color.text,
                        }
                      : {}
                  }
                >
                  {/* Circle Avatar */}
                  <span
                    className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold"
                    style={
                      isAssigned
                        ? {
                            backgroundColor: color.badgeBg,
                            color: color.text,
                          }
                        : {
                            backgroundColor: '#262626',
                            color: '#A3A3A3',
                          }
                    }
                    aria-hidden="true"
                  >
                    {initials}
                  </span>

                  <span className="font-medium truncate max-w-[90px]">{person.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItem;
