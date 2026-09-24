import React, { useState } from 'react';
import { Users, AlertTriangle, CheckCircle2, Clock, Copy, Check } from 'lucide-react';
import { useSplit } from './SplitContext';
import { getAvatarColor, getInitials } from './splitUtils';
import { formatCurrency } from '../../utils/formatCurrency';
import { SplitCalculationResult } from './splitTypes';

interface SplitSummaryCardProps {
  calculation: SplitCalculationResult;
  interactivePaid?: boolean;
  className?: string;
  title?: string;
  showBreakdownItems?: boolean;
}

/**
 * SplitSummaryCard displays the group bill split breakdown:
 * - Each person's avatar, assigned items, and individual share.
 * - Prominent warning for any unassigned items.
 * - Optional interactive settle-up toggles for Payment step.
 */
export const SplitSummaryCard: React.FC<SplitSummaryCardProps> = ({
  calculation,
  interactivePaid = false,
  className = '',
  title = 'Group Bill Split Breakdown',
  showBreakdownItems = true,
}) => {
  const { togglePaid } = useSplit();
  const [copied, setCopied] = useState<boolean>(false);

  const { personSplits, unassignedItems, unassignedTotal, isFullyAssigned, grandTotal } =
    calculation;

  const paidCount = personSplits.filter((p) => p.isPaid).length;
  const totalPeople = personSplits.length;

  const handleCopySummary = () => {
    const lines = [
      `🍕 Ember & Crust - Split Bill (${personSplits.length} people)`,
      `Grand Total: ${formatCurrency(grandTotal)}`,
      '',
      ...personSplits.map((p) => {
        const itemNames =
          p.assignedItems.map((i) => i.name).join(', ') || 'Shared overhead';
        const status = p.isPaid ? ' [PAID]' : ' [PENDING]';
        return `• ${p.name}: ${formatCurrency(p.total)} (${itemNames})${interactivePaid ? status : ''}`;
      }),
    ];

    if (unassignedItems.length > 0) {
      lines.push('');
      lines.push(
        `⚠️ ${unassignedItems.length} unassigned item(s): ${formatCurrency(unassignedTotal)} not yet split.`
      );
    }

    navigator.clipboard?.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="split-summary-card"
      className={`rounded-xl border border-[#262626] bg-[#141414] p-4 space-y-4 anim-fade-in ${className}`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#222222] pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFD60A]/10 border border-[#FFD60A]/30 text-[#FFD60A]">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-sora text-sm font-bold text-[#F5F5F5]">{title}</h3>
            <span className="font-mono text-[10px] text-[#A3A3A3]">
              Split evenly per dish &bull; Equal tax &amp; delivery sharing
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopySummary}
          className="press-scale flex items-center gap-1.5 rounded-lg border border-[#333333] bg-[#1A1A1A] px-2.5 py-1 font-mono text-[11px] text-[#A3A3A3] hover:text-[#FFD60A] hover:border-[#FFD60A]/40 transition-colors"
          title="Copy breakdown to clipboard"
        >
          {copied ? (
            <Check className="h-3 w-3 text-emerald-400" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
        </button>
      </div>

      {/* Settle-up Progress Banner (If interactive paid enabled) */}
      {interactivePaid && totalPeople > 0 && (
        <div className="flex items-center justify-between rounded-lg bg-[#0A0A0A] p-2.5 border border-[#222222] font-mono text-xs">
          <span className="text-[#A3A3A3]">Settle-Up Status:</span>
          <div className="flex items-center gap-2">
            <span
              className={`font-semibold ${
                paidCount === totalPeople ? 'text-emerald-400' : 'text-[#FFD60A]'
              }`}
            >
              {paidCount} of {totalPeople} Settled
            </span>
            <span className="text-[10px] text-[#737373]">
              ({Math.round((paidCount / totalPeople) * 100)}%)
            </span>
          </div>
        </div>
      )}

      {/* Unassigned Items Warning */}
      {!isFullyAssigned && unassignedItems.length > 0 && (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/40 bg-[#1A1505] p-3 text-xs font-mono text-[#FFD60A]">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">
              {unassignedItems.length} item{unassignedItems.length > 1 ? 's' : ''}{' '}
              unassigned ({formatCurrency(unassignedTotal)})
            </p>
            <p className="text-[11px] text-[#D4B000] leading-relaxed">
              Unassigned dishes are excluded from individual shares until participants are
              selected in the cart.
            </p>
          </div>
        </div>
      )}

      {/* Per-Person List */}
      <ul role="list" className="space-y-3">
        {personSplits.map((person) => {
          const color = getAvatarColor(person.colorIndex);
          const initials = getInitials(person.name);

          return (
            <li
              key={person.personId}
              className="rounded-xl border border-[#222222] bg-[#0E0E0E] p-3 transition-colors hover:border-[#333333] space-y-2"
            >
              {/* Top Row: Person Avatar, Name & Total Share */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-bold ring-1"
                    style={{
                      backgroundColor: color.bg,
                      color: color.text,
                      borderColor: color.border,
                    }}
                  >
                    {initials}
                  </div>
                  <div>
                    <h4 className="font-sora text-xs font-bold text-[#F5F5F5]">
                      {person.name}
                    </h4>
                    <span className="font-mono text-[10px] text-[#737373]">
                      {person.assignedItems.length === 0
                        ? 'No dishes assigned'
                        : `${person.assignedItems.length} dish${
                            person.assignedItems.length > 1 ? 'es' : ''
                          }`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Interactive Paid Toggle or Read-Only Status */}
                  {interactivePaid ? (
                    <button
                      type="button"
                      onClick={() => togglePaid(person.personId)}
                      aria-label={`Toggle paid status for ${person.name}`}
                      className={`press-scale flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold transition-all ${
                        person.isPaid
                          ? 'border border-emerald-500/40 bg-emerald-500/15 text-emerald-400'
                          : 'border border-[#383838] bg-[#1A1A1A] text-[#A3A3A3] hover:border-[#FFD60A]/50 hover:text-[#F5F5F5]'
                      }`}
                    >
                      {person.isPaid ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Paid</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 text-[#737373]" />
                          <span>Pending</span>
                        </>
                      )}
                    </button>
                  ) : (
                    person.isPaid && (
                      <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Paid</span>
                      </span>
                    )
                  )}

                  {/* Share Amount */}
                  <span className="font-bebas text-lg text-[#FFD60A] tracking-wider">
                    {formatCurrency(person.total)}
                  </span>
                </div>
              </div>

              {/* Breakdown details */}
              {showBreakdownItems && person.assignedItems.length > 0 && (
                <div className="border-t border-[#1F1F1F] pt-2 space-y-1 font-mono text-[11px] text-[#A3A3A3]">
                  {person.assignedItems.map((item) => (
                    <div
                      key={item.itemId}
                      className="flex items-center justify-between text-[#737373]"
                    >
                      <span className="truncate pr-2">
                        {item.name}{' '}
                        {item.isShared && (
                          <span className="text-[#525252]">
                            (shared 1/{item.assignedCount})
                          </span>
                        )}
                      </span>
                      <span className="text-[#A3A3A3] shrink-0">
                        {formatCurrency(item.shareAmount)}
                      </span>
                    </div>
                  ))}

                  <div className="flex items-center justify-between text-[10px] text-[#525252] pt-0.5">
                    <span>Tax &amp; Delivery Share</span>
                    <span>+{formatCurrency(person.overheadShare)}</span>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
