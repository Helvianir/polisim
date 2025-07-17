
import React, { useCallback, useMemo } from 'react';
import { useParliamentStore } from '../hooks/useParliamentStore';
import { ElectoralSystem, Party, Ideology } from '../types';
import Button from './common/Button';
import Input from './common/Input';
import Select from './common/Select';

const ElectionSimulator: React.FC = () => {
    const { election, setElectionConfig, parties, updateParty, runElection } = useParliamentStore();

    const handleVotePercentageChange = useCallback((partyId: string, value: string) => {
        const percentage = Number(value);
        if (percentage >= 0 && percentage <= 100) {
            updateParty(partyId, { votePercentage: percentage });
        }
    }, [updateParty]);
    
    const randomizeVotes = useCallback(() => {
        let remainingPercentage = 100;
        const shuffledParties = [...parties].sort(() => Math.random() - 0.5);

        shuffledParties.forEach((party, index) => {
            if (index === shuffledParties.length - 1) {
                updateParty(party.id, { votePercentage: Math.round(remainingPercentage * 10) / 10 });
            } else {
                const isExtreme = party.ideology === Ideology.Left || party.ideology === Ideology.Right;
                const maxShare = isExtreme ? 0.4 : 0.25;
                const randomShare = Math.random() * Math.min(remainingPercentage, remainingPercentage * maxShare);
                const share = Math.round(randomShare);
                remainingPercentage -= share;
                updateParty(party.id, { votePercentage: share });
            }
        });
    }, [parties, updateParty]);

    const totalVotePercentage = useMemo(() => {
        return parties.reduce((sum, p) => sum + (p.votePercentage || 0), 0);
    }, [parties]);

    return (
        <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold">Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <Input
                    label="Eligible Voters"
                    id="eligible-voters"
                    type="number"
                    value={election.eligibleVoters}
                    onChange={(e) => setElectionConfig({ eligibleVoters: Number(e.target.value) })}
                />
                 <Input
                    label="Voter Turnout (%)"
                    id="voter-turnout"
                    type="number"
                    min="0" max="100"
                    value={election.turnout}
                    onChange={(e) => setElectionConfig({ turnout: Number(e.target.value) })}
                />
            </div>
             <Input
                label="Electoral Threshold (%)"
                id="electoral-threshold"
                type="number"
                min="0" max="100"
                value={election.threshold}
                onChange={(e) => setElectionConfig({ threshold: Number(e.target.value) })}
            />
             <Select
                label="Electoral System"
                id="electoral-system"
                value={election.system}
                onChange={(e) => setElectionConfig({ system: e.target.value as ElectoralSystem })}
            >
                {Object.values(ElectoralSystem).map(sys => (
                    <option key={sys} value={sys}>{sys}</option>
                ))}
            </Select>

            <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-serif text-lg font-bold">Party Votes</h3>
                    <Button variant="secondary" onClick={randomizeVotes}>Randomize</Button>
                </div>
                 <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                    {parties.map(party => (
                        <div key={party.id} className="flex items-center space-x-2">
                            <label htmlFor={`vote-${party.id}`} className="w-2/3 truncate" title={party.name}>{party.name}</label>
                            <Input
                                id={`vote-${party.id}`}
                                type="number"
                                min="0" max="100"
                                value={party.votePercentage || 0}
                                onChange={(e) => handleVotePercentageChange(party.id, e.target.value)}
                                className="w-1/3"
                                aria-label={`Vote percentage for ${party.name}`}
                            />
                            <span>%</span>
                        </div>
                    ))}
                </div>
                <div className={`mt-2 text-sm font-semibold ${totalVotePercentage > 100 ? 'text-red-600' : 'text-gray-600'}`}>
                    Total Assigned: {totalVotePercentage.toFixed(1)}% / 100%
                </div>
            </div>

            <Button onClick={runElection} className="w-full mt-4" disabled={totalVotePercentage > 100}>
                Run Election Simulation
            </Button>
        </div>
    );
};

export default React.memo(ElectionSimulator);