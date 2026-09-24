export interface SplitPerson {
  id: string;
  name: string;
  colorIndex: number;
  isYou?: boolean;
}

export interface AssignedItemDetail {
  itemId: string;
  name: string;
  lineTotal: number;
  shareAmount: number;
  assignedCount: number;
  isShared: boolean;
}

export interface PersonSplitResult {
  personId: string;
  name: string;
  colorIndex: number;
  assignedItems: AssignedItemDetail[];
  itemSubtotal: number;
  overheadShare: number;
  total: number;
  isPaid: boolean;
}

export interface CartItemRef {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CalculateSplitParams {
  items?: CartItemRef[];
  people?: SplitPerson[];
  assignments?: Record<string, string[]>;
  extraCharges?: {
    tax?: number;
    deliveryFee?: number;
    saucesSubtotal?: number;
  };
  paidStatus?: Record<string, boolean>;
}

export interface SplitCalculationResult {
  personSplits: PersonSplitResult[];
  unassignedItems: CartItemRef[];
  unassignedTotal: number;
  isFullyAssigned: boolean;
  itemsGrandTotal: number;
  overheadTotal: number;
  grandTotal: number;
  assignedGrandTotal: number;
}
