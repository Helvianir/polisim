
import { Party } from '../types';

interface PartyVote {
  id: string;
  votes: number;
}

/**
 * Filters parties by an electoral threshold.
 * @param parties - Array of parties with their vote counts.
 * @param totalVotes - The total number of valid votes cast.
 * @param threshold - The minimum percentage of votes required to be eligible for seats.
 * @returns An array of parties that meet the threshold.
 */
const applyThreshold = (parties: PartyVote[], totalVotes: number, threshold: number): PartyVote[] => {
  if (totalVotes === 0) return [];
  return parties.filter(p => (p.votes / totalVotes) * 100 >= threshold);
};

/**
 * Calculates seat allocation using the D'Hondt method.
 * @param parties - Array of parties with their vote counts.
 * @param totalSeats - The total number of seats to allocate.
 * @param threshold - The electoral threshold percentage.
 * @returns A record mapping party IDs to their allocated seat count.
 */
export const calculateDhondt = (parties: PartyVote[], totalSeats: number, threshold: number): Record<string, number> => {
  const totalVotes = parties.reduce((sum, p) => sum + p.votes, 0);
  const eligibleParties = applyThreshold(parties, totalVotes, threshold);
  
  const seats: Record<string, number> = {};
  eligibleParties.forEach(p => seats[p.id] = 0);

  for (let i = 0; i < totalSeats; i++) {
    let maxQuotient = -1;
    let partyToGetSeat: string | null = null;

    eligibleParties.forEach(party => {
      const quotient = party.votes / ((seats[party.id] || 0) + 1);
      if (quotient > maxQuotient) {
        maxQuotient = quotient;
        partyToGetSeat = party.id;
      }
    });

    if (partyToGetSeat) {
      seats[partyToGetSeat]++;
    }
  }

  return seats;
};

/**
 * Calculates seat allocation using the Sainte-Laguë method.
 * @param parties - Array of parties with their vote counts.
 * @param totalSeats - The total number of seats to allocate.
 * @param threshold - The electoral threshold percentage.
 * @returns A record mapping party IDs to their allocated seat count.
 */
export const calculateSainteLague = (parties: PartyVote[], totalSeats: number, threshold: number): Record<string, number> => {
    const totalVotes = parties.reduce((sum, p) => sum + p.votes, 0);
    const eligibleParties = applyThreshold(parties, totalVotes, threshold);

    const seats: Record<string, number> = {};
    eligibleParties.forEach(p => seats[p.id] = 0);

    for (let i = 0; i < totalSeats; i++) {
        let maxQuotient = -1;
        let partyToGetSeat: string | null = null;

        eligibleParties.forEach(party => {
            const quotient = party.votes / (2 * (seats[party.id] || 0) + 1);
            if (quotient > maxQuotient) {
                maxQuotient = quotient;
                partyToGetSeat = party.id;
            }
        });

        if (partyToGetSeat) {
            seats[partyToGetSeat]++;
        }
    }

    return seats;
};


/**
 * Calculates seat allocation using the First-Past-The-Post method.
 * In this national simulation, it's interpreted as the party with the most votes winning all seats.
 * @param parties - Array of parties with their vote counts.
 * @param totalSeats - The total number of seats to allocate.
 * @param threshold - The electoral threshold (not typically used in pure FPTP, but included for consistency).
 * @returns A record mapping party IDs to their allocated seat count.
 */
export const calculateFptp = (parties: PartyVote[], totalSeats: number, threshold: number): Record<string, number> => {
    const totalVotes = parties.reduce((sum, p) => sum + p.votes, 0);
    const eligibleParties = applyThreshold(parties, totalVotes, threshold);
    
    const seats: Record<string, number> = {};
    parties.forEach(p => seats[p.id] = 0);

    if(eligibleParties.length === 0) {
        return seats;
    }

    let winner: PartyVote | null = null;
    let maxVotes = -1;

    eligibleParties.forEach(party => {
        if (party.votes > maxVotes) {
            maxVotes = party.votes;
            winner = party;
        }
    });

    if (winner) {
        seats[winner.id] = totalSeats;
    }

    return seats;
};
