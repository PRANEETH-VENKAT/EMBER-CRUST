import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { calculateSplit, getAvatarColor, getInitials } from './splitUtils';
import type {
  SplitPerson,
  CartItemRef,
  SplitCalculationResult,
  CalculateSplitParams,
} from './splitTypes';

interface SplitState {
  isSplitMode: boolean;
  people: SplitPerson[];
  assignments: Record<string, string[]>;
  paidStatus: Record<string, boolean>;
}

type SplitAction =
  | { type: 'TOGGLE_SPLIT_MODE' }
  | { type: 'SET_SPLIT_MODE'; payload: boolean }
  | { type: 'ADD_PERSON'; payload: { name: string } }
  | { type: 'REMOVE_PERSON'; payload: { personId: string } }
  | { type: 'TOGGLE_ASSIGNMENT'; payload: { itemId: string; personId: string } }
  | { type: 'ASSIGN_TO_PERSON'; payload: { itemId: string; personId: string } }
  | { type: 'ASSIGN_TO_ALL'; payload: { itemId: string } }
  | { type: 'SET_ASSIGNMENT'; payload: { itemId: string; personIds: string[] } }
  | { type: 'TOGGLE_PAID'; payload: { personId: string } }
  | { type: 'RESET_SPLIT' };

export interface SplitContextValue {
  isSplitMode: boolean;
  people: SplitPerson[];
  assignments: Record<string, string[]>;
  paidStatus: Record<string, boolean>;
  toggleSplitMode: () => void;
  setSplitMode: (enabled: boolean) => void;
  addPerson: (name: string) => void;
  removePerson: (personId: string) => void;
  toggleAssignment: (itemId: string, personId: string) => void;
  assignToPerson: (itemId: string, personId: string) => void;
  assignToAll: (itemId: string) => void;
  setAssignment: (itemId: string, personIds: string[]) => void;
  togglePaid: (personId: string) => void;
  resetSplit: () => void;
  computeSplit: (
    items: CartItemRef[],
    extraCharges?: CalculateSplitParams['extraCharges']
  ) => SplitCalculationResult;
  getAvatarColor: typeof getAvatarColor;
  getInitials: typeof getInitials;
}

const STORAGE_KEY = 'ec_split_state';

const DEFAULT_PERSON: SplitPerson = {
  id: 'person_you',
  name: 'You',
  colorIndex: 0,
  isYou: true,
};

const INITIAL_STATE: SplitState = {
  isSplitMode: false,
  people: [DEFAULT_PERSON],
  assignments: {},
  paidStatus: {},
};

/**
 * Loads persistent split state from localStorage safely.
 */
function loadPersistedState(): SplitState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw);
    return {
      isSplitMode: Boolean(parsed.isSplitMode),
      people:
        Array.isArray(parsed.people) && parsed.people.length > 0
          ? parsed.people
          : [DEFAULT_PERSON],
      assignments:
        typeof parsed.assignments === 'object' && parsed.assignments !== null
          ? parsed.assignments
          : {},
      paidStatus:
        typeof parsed.paidStatus === 'object' && parsed.paidStatus !== null
          ? parsed.paidStatus
          : {},
    };
  } catch {
    return INITIAL_STATE;
  }
}

/**
 * Split feature reducer.
 */
function splitReducer(state: SplitState, action: SplitAction): SplitState {
  switch (action.type) {
    case 'TOGGLE_SPLIT_MODE': {
      return {
        ...state,
        isSplitMode: !state.isSplitMode,
      };
    }

    case 'SET_SPLIT_MODE': {
      return {
        ...state,
        isSplitMode: Boolean(action.payload),
      };
    }

    case 'ADD_PERSON': {
      const trimmedName = (action.payload?.name || '').trim();
      if (!trimmedName) return state;

      // Prevent exact duplicate names
      const existing = state.people.find(
        (p) => p.name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (existing) return state;

      const newPerson = {
        id: `person_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: trimmedName,
        colorIndex: state.people.length,
        isYou: false,
      };

      return {
        ...state,
        people: [...state.people, newPerson],
      };
    }

    case 'REMOVE_PERSON': {
      const personIdToRemove = action.payload?.personId;
      if (!personIdToRemove) return state;

      // Don't allow removing if only 1 person remains
      if (state.people.length <= 1) return state;

      const updatedPeople = state.people.filter((p) => p.id !== personIdToRemove);

      // Clean up assignments for the removed person
      const updatedAssignments: Record<string, string[]> = {};
      Object.entries(state.assignments).forEach(([itemId, assignedIds]) => {
        updatedAssignments[itemId] = (assignedIds || []).filter(
          (id) => id !== personIdToRemove
        );
      });

      const updatedPaidStatus = { ...state.paidStatus };
      delete updatedPaidStatus[personIdToRemove];

      return {
        ...state,
        people: updatedPeople,
        assignments: updatedAssignments,
        paidStatus: updatedPaidStatus,
      };
    }

    case 'TOGGLE_ASSIGNMENT': {
      const { itemId, personId } = action.payload || {};
      if (!itemId || !personId) return state;

      const rawCurrent = state.assignments[itemId];
      const defaultPersonId = state.people[0]?.id || 'person_you';
      const currentAssigned = rawCurrent !== undefined ? rawCurrent : [defaultPersonId];
      const isCurrentlyAssigned = currentAssigned.includes(personId);

      const nextAssigned = isCurrentlyAssigned
        ? currentAssigned.filter((id) => id !== personId)
        : [...currentAssigned, personId];

      return {
        ...state,
        assignments: {
          ...state.assignments,
          [itemId]: nextAssigned,
        },
      };
    }

    case 'ASSIGN_TO_PERSON': {
      const { itemId, personId } = action.payload || {};
      if (!itemId || !personId) return state;

      return {
        ...state,
        assignments: {
          ...state.assignments,
          [itemId]: [personId],
        },
      };
    }

    case 'ASSIGN_TO_ALL': {
      const { itemId } = action.payload || {};
      if (!itemId) return state;

      return {
        ...state,
        assignments: {
          ...state.assignments,
          [itemId]: state.people.map((p) => p.id),
        },
      };
    }

    case 'SET_ASSIGNMENT': {
      const { itemId, personIds } = action.payload || {};
      if (!itemId) return state;

      return {
        ...state,
        assignments: {
          ...state.assignments,
          [itemId]: Array.isArray(personIds) ? personIds : [],
        },
      };
    }

    case 'TOGGLE_PAID': {
      const personId = action.payload?.personId;
      if (!personId) return state;

      return {
        ...state,
        paidStatus: {
          ...state.paidStatus,
          [personId]: !state.paidStatus[personId],
        },
      };
    }

    case 'RESET_SPLIT': {
      return INITIAL_STATE;
    }

    default:
      return state;
  }
}

const SplitContext = createContext<SplitContextValue | null>(null);

export function SplitProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(splitReducer, undefined, loadPersistedState);

  // Synchronize with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage write errors
    }
  }, [state]);

  const toggleSplitMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_SPLIT_MODE' });
  }, []);

  const setSplitMode = useCallback((enabled: boolean) => {
    dispatch({ type: 'SET_SPLIT_MODE', payload: enabled });
  }, []);

  const addPerson = useCallback((name: string) => {
    dispatch({ type: 'ADD_PERSON', payload: { name } });
  }, []);

  const removePerson = useCallback((personId: string) => {
    dispatch({ type: 'REMOVE_PERSON', payload: { personId } });
  }, []);

  const toggleAssignment = useCallback((itemId: string, personId: string) => {
    dispatch({ type: 'TOGGLE_ASSIGNMENT', payload: { itemId, personId } });
  }, []);

  const assignToPerson = useCallback((itemId: string, personId: string) => {
    dispatch({ type: 'ASSIGN_TO_PERSON', payload: { itemId, personId } });
  }, []);

  const assignToAll = useCallback((itemId: string) => {
    dispatch({ type: 'ASSIGN_TO_ALL', payload: { itemId } });
  }, []);

  const setAssignment = useCallback((itemId: string, personIds: string[]) => {
    dispatch({ type: 'SET_ASSIGNMENT', payload: { itemId, personIds } });
  }, []);

  const togglePaid = useCallback((personId: string) => {
    dispatch({ type: 'TOGGLE_PAID', payload: { personId } });
  }, []);

  const resetSplit = useCallback(() => {
    dispatch({ type: 'RESET_SPLIT' });
  }, []);

  /**
   * Computes split calculation using the pure calculateSplit function.
   */
  const computeSplit = useCallback(
    (items: CartItemRef[], extraCharges?: CalculateSplitParams['extraCharges']) => {
      return calculateSplit({
        items,
        people: state.people,
        assignments: state.assignments,
        extraCharges,
        paidStatus: state.paidStatus,
      });
    },
    [state.people, state.assignments, state.paidStatus]
  );

  const value = useMemo<SplitContextValue>(
    () => ({
      isSplitMode: state.isSplitMode,
      people: state.people,
      assignments: state.assignments,
      paidStatus: state.paidStatus,
      toggleSplitMode,
      setSplitMode,
      addPerson,
      removePerson,
      toggleAssignment,
      assignToPerson,
      assignToAll,
      setAssignment,
      togglePaid,
      resetSplit,
      computeSplit,
      getAvatarColor,
      getInitials,
    }),
    [
      state.isSplitMode,
      state.people,
      state.assignments,
      state.paidStatus,
      toggleSplitMode,
      setSplitMode,
      addPerson,
      removePerson,
      toggleAssignment,
      assignToPerson,
      assignToAll,
      setAssignment,
      togglePaid,
      resetSplit,
      computeSplit,
    ]
  );

  return <SplitContext.Provider value={value}>{children}</SplitContext.Provider>;
}

export function useSplit(): SplitContextValue {
  const context = useContext(SplitContext);
  if (!context) {
    throw new Error('useSplit must be used within a SplitProvider');
  }
  return context;
}
