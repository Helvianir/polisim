
import React, { useState, useMemo, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useParliamentStore } from '../hooks/useParliamentStore';
import Button from './common/Button';
import Input from './common/Input';
import { VoteResult, Ideology } from '../types';

// Custom tooltip to prevent rendering errors and provide better formatting.
const CustomVoteTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const total = payload.reduce((sum, entry) => sum + entry.value, 0);
        return (
            <div className="bg-nyt-bg p-3 border border-nyt-border shadow-lg rounded-md text-sm">
                <p className="font-bold font-serif text-nyt-primary mb-1">Total Votes: {total.toLocaleString()}</p>
                <div className="space-y-1">
                    {payload.slice().reverse().map((pld: any) => (
                        <div key={pld.dataKey} style={{ color: pld.fill }}>
                            {`${pld.name}: ${pld.value.toLocaleString()}`}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

const VotingSimulator: React.FC = () => {
    const { parties, totalSeats } = useParliamentStore();
    const [lawTitle, setLawTitle] = useState('Climate Action Bill');
    const [voteResults, setVoteResults] = useState<VoteResult[]>([]);

    const simulateVote = useCallback(() => {
        const results: VoteResult[] = parties.map(party => {
            const randomFactor = Math.random();
            let vote: 'yes' | 'no' | 'abstain';

            switch (party.ideology) {
                case Ideology.Left:
                case Ideology.CenterLeft:
                    vote = randomFactor < 0.85 ? 'yes' : (randomFactor < 0.95 ? 'no' : 'abstain');
                    break;
                case Ideology.Right:
                case Ideology.CenterRight:
                    vote = randomFactor < 0.85 ? 'no' : (randomFactor < 0.95 ? 'yes' : 'abstain');
                    break;
                case Ideology.Center:
                default:
                    vote = randomFactor < 0.5 ? 'yes' : (randomFactor < 0.9 ? 'no' : 'abstain');
                    break;
            }
            return { partyId: party.id, vote };
        });
        setVoteResults(results);
    }, [parties]);

    const voteCounts = useMemo(() => {
        const counts = { yes: 0, no: 0, abstain: 0 };
        voteResults.forEach(result => {
            const party = parties.find(p => p.id === result.partyId);
            if (party) {
                counts[result.vote] += party.seats;
            }
        });
        return counts;
    }, [voteResults, parties]);

    const chartData = useMemo(() => [
        { name: 'Votes', Yes: voteCounts.yes, No: voteCounts.no, Abstain: voteCounts.abstain },
    ], [voteCounts]);

    const votePassed = voteCounts.yes > voteCounts.no;
    const majorityThreshold = Math.floor(totalSeats / 2) + 1;

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
                <Input
                    label="Law / Motion Title"
                    id="law-title"
                    value={lawTitle}
                    onChange={(e) => setLawTitle(e.target.value)}
                    className="flex-grow"
                />
                <Button onClick={simulateVote} className="self-end h-10 mt-1 sm:mt-0">Simulate Vote</Button>
            </div>

            {voteResults.length > 0 && (
                <div className="space-y-4 pt-4 border-t">
                    <div className="text-center">
                        <h4 className="font-serif text-lg font-bold">Vote Outcome</h4>
                        <p className={`text-xl font-bold ${votePassed ? 'text-green-600' : 'text-red-600'}`}>
                           {voteCounts.yes > voteCounts.no ? 'PASSED' : 'FAILED'}
                        </p>
                        <p className="text-sm text-gray-600">
                           Simple Majority required: {majorityThreshold} 'Yes' votes.
                        </p>
                    </div>
                    <div style={{ width: '100%', height: 200 }}>
                        <ResponsiveContainer>
                            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" domain={[0, totalSeats]} />
                                <YAxis type="category" dataKey="name" hide />
                                <Tooltip content={<CustomVoteTooltip />} cursor={{fill: 'rgba(241, 241, 241, 0.5)'}}/>
                                <Legend />
                                <Bar dataKey="Yes" name="Yes" stackId="a" fill="#22c55e" />
                                <Bar dataKey="No" name="No" stackId="a" fill="#ef4444" />
                                <Bar dataKey="Abstain" name="Abstain" stackId="a" fill="#a1a1aa" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(VotingSimulator);