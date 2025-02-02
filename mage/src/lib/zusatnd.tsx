import create from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// Define types for state and actions
type FieldType = 'text' | 'dropdown' | 'range';

type Card = {
  id:string;
  title?:string;
  special?:string;
  name: string;
  requiredFields: { 
    fieldName: string;
    fieldType?: FieldType;
    isDropdown?: boolean; 
    options?: string[]; 
    min?: number;
    max?: number;
    step?: number;
    value?: string; // We'll update these with actual input values
  }[];
};

type CardStore = {
  card: Card[]; // Store a single card (null by default)
  removeCard: (id: string) => void; // Action to remove a card by ID
  addCard: (card: Card) => void; // Action to set a single card
  clearCard: () => void;  // Define the action to clear cards
};

// Create the Zustand store with the defined state and action types
export const useCardStore = create<CardStore>((set) => ({
  card: [],
  addCard: (card: Card) => 
    set((state) => ({ card: [...state.card, { ...card, id:uuidv4() }] })),
  removeCard: (id: string) => 
    set((state) => ({ card: state.card.filter((c) => c.id !== id) })),
  clearCard: () => set({ card: [] }),  // Reset the card array
}));
