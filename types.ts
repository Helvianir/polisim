export enum ElectoralSystem {
  DHondt = "D'Hondt",
  SainteLague = "Sainte-Laguë",
  FPTP = "First-Past-The-Post",
}

export enum Ideology {
  Left = "Left",
  CenterLeft = "Center-Left",
  Center = "Center",
  CenterRight = "Center-Right",
  Right = "Right",
}

export interface Party {
  id: string;
  name: string;
  seats: number;
  color: string;
  ideology: Ideology;
  votes?: number;
  votePercentage?: number;
}

export interface VoteResult {
  partyId: string;
  vote: 'yes' | 'no' | 'abstain';
}

export interface ElectionResult {
  partyId: string;
  votes: number;
  percentage: number;
  seats: number;
}

/**
 * Defines the portion of the application state that scenarios need to access
 * to check for completion conditions.
 */
export interface State {
    parties: Party[];
    coalition: string[];
    totalSeats: number;
}

export interface Scenario {
    id: string;
    title: string;
    description: string;
    isCompleted: (state: State) => boolean;
}