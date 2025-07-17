
import { create } from 'zustand';
import { toast } from 'react-toastify';
import { Party, ElectoralSystem, Ideology, Scenario, State } from '../types';
import { generatePartyColor } from '../lib/utils';
import { calculateDhondt, calculateSainteLague, calculateFptp } from '../lib/electoralCalculators';

type View = 'parliament' | 'election' | 'help';

interface ParliamentState {
  view: View;
  totalSeats: number;
  parties: Party[];
  coalition: string[]; // array of party IDs
  election: {
    eligibleVoters: number;
    turnout: number; // percentage
    threshold: number; // percentage
    system: ElectoralSystem;
    spoiledBallots: number;
  };
  scenarios: Scenario[];
  completedScenarioIds: string[];
  setView: (view: View) => void;
  setTotalSeats: (seats: number) => void;
  addParty: () => void;
  updateParty: (id: string, updates: Partial<Omit<Party, 'id'>>) => void;
  removeParty: (id: string) => void;
  toggleCoalitionMember: (id: string) => void;
  clearCoalition: () => void;
  setElectionConfig: (config: Partial<ParliamentState['election']>) => void;
  runElection: () => void;
  loadPreset: (preset: 'dutch' | 'us_senate') => void;
  completeScenarios: (ids: string[]) => void;
}

const initialParties: Party[] = [
    { id: 'p1', name: 'Sunrise Party', seats: 45, color: 'hsl(45, 85%, 60%)', ideology: Ideology.CenterLeft },
    { id: 'p2', name: 'Blue Wave Alliance', seats: 35, color: 'hsl(210, 80%, 65%)', ideology: Ideology.CenterRight },
    { id: 'p3', name: 'Green Growth', seats: 25, color: 'hsl(120, 70%, 50%)', ideology: Ideology.Left },
    { id: 'p4', name: 'Tradition Union', seats: 20, color: 'hsl(0, 60%, 55%)', ideology: Ideology.Right },
    { id: 'p5', name: 'Central Path', seats: 15, color: 'hsl(300, 50%, 60%)', ideology: Ideology.Center },
    { id: 'p6', name: 'Independents', seats: 10, color: 'hsl(0, 0%, 50%)', ideology: Ideology.Center },
];

const scenarios: Scenario[] = [
    {
        id: 's1',
        title: 'Simple Majority',
        description: 'Form a coalition with more than 50% of the seats.',
        isCompleted: (state: State) => {
            const coalitionSeats = state.coalition.reduce((sum, partyId) => {
                const party = state.parties.find(p => p.id === partyId);
                return sum + (party?.seats || 0);
            }, 0);
            return coalitionSeats > state.totalSeats / 2;
        }
    },
    {
        id: 's2',
        title: 'Two-Thirds Majority',
        description: 'Form a super-majority coalition with over 2/3 of the seats. This is often needed for constitutional changes.',
        isCompleted: (state: State) => {
            const coalitionSeats = state.coalition.reduce((sum, partyId) => {
                const party = state.parties.find(p => p.id === partyId);
                return sum + (party?.seats || 0);
            }, 0);
            return coalitionSeats >= state.totalSeats * (2/3);
        }
    },
];

export const useParliamentStore = create<ParliamentState>((set, get) => ({
  view: 'parliament',
  totalSeats: 150,
  parties: initialParties,
  coalition: [],
  election: {
    eligibleVoters: 10000000,
    turnout: 75,
    threshold: 5,
    system: ElectoralSystem.DHondt,
    spoiledBallots: 0,
  },
  scenarios,
  completedScenarioIds: [],
  
  setView: (view) => set({ view }),
  setTotalSeats: (seats) => {
    if (seats >= 1) {
        set({ totalSeats: seats });
    }
  },
  addParty: () => set(state => ({
    parties: [...state.parties, { id: `p${Date.now()}`, name: `New Party ${state.parties.length + 1}`, seats: 0, color: generatePartyColor(), ideology: Ideology.Center, votePercentage: 0 }]
  })),
  updateParty: (id, updates) => {
    set(state => ({
      parties: state.parties.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  },
  removeParty: (id) => set(state => ({
    parties: state.parties.filter(p => p.id !== id),
    coalition: state.coalition.filter(partyId => partyId !== id)
  })),
  toggleCoalitionMember: (id) => {
    set(state => ({
        coalition: state.coalition.includes(id)
            ? state.coalition.filter(partyId => partyId !== id)
            : [...state.coalition, id]
    }));
  },
  clearCoalition: () => set({ coalition: [] }),
  setElectionConfig: (config) => set(state => ({ election: { ...state.election, ...config } })),
  runElection: () => {
    const { election, parties, totalSeats } = get();
    const totalPartyPercentage = parties.reduce((sum, p) => sum + (p.votePercentage || 0), 0);
    
    if (totalPartyPercentage > 100) {
        toast.error("Total vote percentage cannot exceed 100%. Please adjust party votes.");
        return;
    }
    
    const votesCast = election.eligibleVoters * (election.turnout / 100);
    
    const unassignedVotePercentage = 100 - totalPartyPercentage;
    const spoiledVotes = votesCast * (unassignedVotePercentage / 100);
    const validVotes = votesCast - spoiledVotes;
    
    const partyVotes = parties.map(p => ({
      id: p.id,
      votes: Math.round(validVotes * ((p.votePercentage || 0) / (totalPartyPercentage || 1))) || 0,
    }));
    
    let seatDistribution: Record<string, number>;
    switch (election.system) {
        case ElectoralSystem.SainteLague:
            seatDistribution = calculateSainteLague(partyVotes, totalSeats, election.threshold);
            break;
        case ElectoralSystem.FPTP:
            seatDistribution = calculateFptp(partyVotes, totalSeats, election.threshold);
            break;
        case ElectoralSystem.DHondt:
        default:
            seatDistribution = calculateDhondt(partyVotes, totalSeats, election.threshold);
    }
    
    set(state => ({
        parties: state.parties.map(p => ({
            ...p,
            seats: seatDistribution[p.id] || 0,
            votes: partyVotes.find(pv => pv.id === p.id)?.votes || 0,
        })),
        election: { ...state.election, spoiledBallots: Math.round(spoiledVotes) }
    }));
    toast.success("Election simulation complete!");
  },
  loadPreset: (preset) => {
    if (preset === 'dutch') {
        set({
            totalSeats: 150,
            parties: [
                { id: 'p1', name: 'VVD', seats: 24, color: 'hsl(210, 100%, 45%)', ideology: Ideology.CenterRight, votePercentage: 15.2 },
                { id: 'p2', name: 'GroenLinks-PvdA', seats: 25, color: 'hsl(120, 60%, 40%)', ideology: Ideology.Left, votePercentage: 15.8 },
                { id: 'p3', name: 'PVV', seats: 37, color: 'hsl(50, 100%, 50%)', ideology: Ideology.Right, votePercentage: 23.5 },
                { id: 'p4', name: 'NSC', seats: 20, color: 'hsl(30, 90%, 50%)', ideology: Ideology.Center, votePercentage: 12.9 },
                { id: 'p5', name: 'D66', seats: 9, color: 'hsl(150, 80%, 45%)', ideology: Ideology.CenterLeft, votePercentage: 6.2 },
            ],
            election: {
                ...get().election,
                system: ElectoralSystem.DHondt,
                threshold: 0.67
            },
            coalition: [],
        });
    } else if (preset === 'us_senate') {
        set({
            totalSeats: 100,
            parties: [
                { id: 'p1', name: 'Democrats', seats: 51, color: 'hsl(220, 80%, 60%)', ideology: Ideology.CenterLeft, votePercentage: 49 },
                { id: 'p2', name: 'Republicans', seats: 49, color: 'hsl(0, 80%, 60%)', ideology: Ideology.CenterRight, votePercentage: 48 },
            ],
            election: {
                ...get().election,
                system: ElectoralSystem.FPTP,
                threshold: 0
            },
            coalition: [],
        });
    }
  },
  completeScenarios: (ids: string[]) => {
        if (ids.length > 0) {
            set(state => ({
                completedScenarioIds: [...new Set([...state.completedScenarioIds, ...ids])]
            }));
        }
    },
}));
