/**
 * @file splitUtils.ts
 * Pure utility functions for group order bill splitting calculations.
 * Unit-testable, with zero UI or React component dependencies.
 */

import type {
  CartItemRef,
  AssignedItemDetail,
  PersonSplitResult,
  SplitCalculationResult,
  CalculateSplitParams,
} from './splitTypes';

/**
 * Fixed color palette for group avatars.
 * Cycles cleanly for any number of participants.
 * Designed to meet contrast standards against #0A0A0A / #141414 dark backgrounds.
 */
export const AVATAR_PALETTE = [
  {
    id: 'amber',
    bg: 'rgba(255, 214, 10, 0.15)',
    text: '#FFD60A',
    border: 'rgba(255, 214, 10, 0.6)',
    badgeBg: '#2A2000',
    hex: '#FFD60A',
  },
  {
    id: 'emerald',
    bg: 'rgba(52, 211, 153, 0.15)',
    text: '#34D399',
    border: 'rgba(52, 211, 153, 0.6)',
    badgeBg: '#064E3B',
    hex: '#34D399',
  },
  {
    id: 'sky',
    bg: 'rgba(56, 189, 248, 0.15)',
    text: '#38BDF8',
    border: 'rgba(56, 189, 248, 0.6)',
    badgeBg: '#082F49',
    hex: '#38BDF8',
  },
  {
    id: 'rose',
    bg: 'rgba(251, 113, 133, 0.15)',
    text: '#FB7185',
    border: 'rgba(251, 113, 133, 0.6)',
    badgeBg: '#4C0519',
    hex: '#FB7185',
  },
  {
    id: 'purple',
    bg: 'rgba(192, 132, 252, 0.15)',
    text: '#C084FC',
    border: 'rgba(192, 132, 252, 0.6)',
    badgeBg: '#3B0764',
    hex: '#C084FC',
  },
  {
    id: 'orange',
    bg: 'rgba(251, 146, 60, 0.15)',
    text: '#FB923C',
    border: 'rgba(251, 146, 60, 0.6)',
    badgeBg: '#431407',
    hex: '#FB923C',
  },
  {
    id: 'teal',
    bg: 'rgba(45, 212, 191, 0.15)',
    text: '#2DD4BF',
    border: 'rgba(45, 212, 191, 0.6)',
    badgeBg: '#042F2C',
    hex: '#2DD4BF',
  },
  {
    id: 'indigo',
    bg: 'rgba(129, 140, 248, 0.15)',
    text: '#818CF8',
    border: 'rgba(129, 140, 248, 0.6)',
    badgeBg: '#1E1B4B',
    hex: '#818CF8',
  },
];

/**
 * Returns the color configuration for a given index by cycling through AVATAR_PALETTE.
 *
 * @param {number} index
 * @returns {typeof AVATAR_PALETTE[number]}
 */
export function getAvatarColor(index: number) {
  const safeIndex = Math.abs(index || 0);
  return AVATAR_PALETTE[safeIndex % AVATAR_PALETTE.length];
}

/**
 * Extracts 1-2 letter uppercase initials from a name string.
 * Examples: "You" -> "YOU" or "Y", "Meera" -> "M", "Alex Kumar" -> "AK"
 */
export function getInitials(name: string): string {
  if (!name || typeof name !== 'string') return '?';
  const trimmed = name.trim();
  if (trimmed.toLowerCase() === 'you') return 'You';

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/**
 * Pure calculation function for splitting an order among a group of people.
 *
 * Rules implemented:
 * 1. Each item's total (price * quantity) is split evenly across everyone assigned to it.
 * 2. Unassigned items are strictly excluded from all per-person totals and grouped into unassignedItems.
 * 3. Overhead (GST + Delivery fee + Sauces) is split evenly across all members of the group.
 * 4. Per-person totals are rounded sensibly, with the final person absorbing any rounding discrepancy,
 *    ensuring the sum of all person totals matches the assigned grand total down to the single rupee.
 */
export function calculateSplit({
  items = [],
  people = [],
  assignments = {},
  extraCharges = {},
  paidStatus = {},
}: CalculateSplitParams): SplitCalculationResult {
  const tax = Number(extraCharges?.tax) || 0;
  const deliveryFee = Number(extraCharges?.deliveryFee) || 0;
  const saucesSubtotal = Number(extraCharges?.saucesSubtotal) || 0;
  const overheadTotal = tax + deliveryFee + saucesSubtotal;

  const peopleCount = people.length;

  // Calculate items total and separate assigned vs unassigned
  const unassignedItems: CartItemRef[] = [];
  let unassignedTotal = 0;
  let itemsGrandTotal = 0;

  const personItemsMap: Record<string, AssignedItemDetail[]> = {};
  const personItemSubtotalMap: Record<string, number> = {};

  people.forEach((p) => {
    personItemsMap[p.id] = [];
    personItemSubtotalMap[p.id] = 0;
  });

  const defaultPersonId = people[0]?.id || 'person_you';

  items.forEach((item) => {
    const lineTotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);
    itemsGrandTotal += lineTotal;

    const rawAssigned = assignments[item.id];
    const candidatePersonIds =
      rawAssigned !== undefined ? rawAssigned : [defaultPersonId];

    const assignedPersonIds = candidatePersonIds.filter((pid) =>
      people.some((p) => p.id === pid)
    );

    if (assignedPersonIds.length === 0) {
      unassignedItems.push(item);
      unassignedTotal += lineTotal;
    } else {
      const sharePerPerson = lineTotal / assignedPersonIds.length;
      assignedPersonIds.forEach((pid) => {
        if (personItemsMap[pid]) {
          personItemsMap[pid].push({
            itemId: item.id,
            name: item.name,
            lineTotal,
            shareAmount: sharePerPerson,
            assignedCount: assignedPersonIds.length,
            isShared: assignedPersonIds.length > 1,
          });
          personItemSubtotalMap[pid] += sharePerPerson;
        }
      });
    }
  });

  const grandTotal = itemsGrandTotal + overheadTotal;
  const assignedGrandTotal = Math.max(0, grandTotal - unassignedTotal);

  if (peopleCount === 0) {
    return {
      personSplits: [],
      unassignedItems,
      unassignedTotal,
      isFullyAssigned: unassignedItems.length === 0,
      itemsGrandTotal,
      overheadTotal,
      grandTotal,
      assignedGrandTotal,
    };
  }

  // Calculate overhead share per person
  const baseOverheadPerPerson = overheadTotal / peopleCount;

  // Compute rounded shares with last person absorbing rounding remainder
  let runningSum = 0;

  const personSplits: PersonSplitResult[] = people.map((person, index) => {
    const isLast = index === peopleCount - 1;
    const itemSubtotal = personItemSubtotalMap[person.id] || 0;
    const rawTotal = itemSubtotal + baseOverheadPerPerson;

    const finalTotal = isLast
      ? Math.max(0, assignedGrandTotal - runningSum)
      : Math.round(rawTotal);

    if (!isLast) {
      runningSum += finalTotal;
    }

    const overheadShare = Math.max(0, finalTotal - Math.round(itemSubtotal));

    return {
      personId: person.id,
      name: person.name,
      colorIndex: person.colorIndex ?? index,
      assignedItems: personItemsMap[person.id] || [],
      itemSubtotal: Math.round(itemSubtotal),
      overheadShare,
      total: finalTotal,
      isPaid: Boolean(paidStatus[person.id]),
    };
  });

  return {
    personSplits,
    unassignedItems,
    unassignedTotal,
    isFullyAssigned: unassignedItems.length === 0,
    itemsGrandTotal,
    overheadTotal,
    grandTotal,
    assignedGrandTotal,
  };
}
