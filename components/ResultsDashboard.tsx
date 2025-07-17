
import React, { useMemo } from 'react';
import { Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useParliamentStore } from '../hooks/useParliamentStore';

// Custom tooltip component to ensure stable rendering and consistent styling.
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-nyt-bg p-3 border border-nyt-border shadow-lg rounded-md text-sm">
                <p className="font-bold font-serif text-nyt-primary">{label}</p>
                {payload.map((pld: any) => (
                    <div key={pld.dataKey} style={{ color: pld.fill }}>
                        {`${pld.name}: ${pld.value.toLocaleString()}`}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const ResultsDashboard: React.FC = () => {
    const { parties, election, totalSeats } = useParliamentStore();

    const electionRun = useMemo(() => parties.some(p => p.votes !== undefined), [parties]);

    const { validVotes, totalVotesCast } = useMemo(() => {
        const valid = parties.reduce((sum, p) => sum + (p.votes || 0), 0);
        const total = valid + election.spoiledBallots;
        return { validVotes: valid, totalVotesCast: total };
    }, [parties, election.spoiledBallots]);

    const stats = useMemo(() => [
        { label: 'Total Seats', value: totalSeats.toLocaleString() },
        { label: 'Eligible Voters', value: election.eligibleVoters.toLocaleString() },
        { label: 'Votes Cast', value: totalVotesCast.toLocaleString() },
        { label: 'Turnout', value: `${election.turnout}%` },
        { label: 'Valid Votes', value: validVotes.toLocaleString() },
        { label: 'Spoiled Ballots', value: election.spoiledBallots.toLocaleString() },
    ], [totalSeats, election.eligibleVoters, election.turnout, election.spoiledBallots, totalVotesCast, validVotes]);
    
    const resultsData = useMemo(() => parties
        .map(p => ({
            ...p,
            percentage: validVotes > 0 ? (((p.votes || 0) / validVotes) * 100).toFixed(2) : '0.00',
        }))
        .sort((a, b) => b.seats - a.seats), [parties, validVotes]);

    if (!electionRun) {
        return (
            <div className="flex items-center justify-center h-96 text-gray-500">
                <p>Run an election simulation to see the results here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {stats.map(stat => (
                    <div key={stat.label} className="bg-nyt-subtle p-3 rounded-lg text-center">
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="font-bold font-serif text-xl">{stat.value}</p>
                    </div>
                ))}
            </div>

             <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={resultsData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={80} tick={{fontSize: 12}}/>
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241,241,241,0.1)' }} />
                        <Legend />
                        <Bar dataKey="seats" name="Seats Won" fill="#333333" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div>
                <h4 className="font-serif text-lg font-bold mb-2">Detailed Results</h4>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-nyt-subtle">
                            <tr>
                                <th className="p-2 font-semibold">Party</th>
                                <th className="p-2 font-semibold text-right">Votes</th>
                                <th className="p-2 font-semibold text-right">Vote %</th>
                                <th className="p-2 font-semibold text-right">Seats Won</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultsData.map(party => (
                                <tr key={party.id} className="border-b border-nyt-border">
                                    <td className="p-2 flex items-center space-x-2">
                                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: party.color }}></div>
                                        <span>{party.name}</span>
                                    </td>
                                    <td className="p-2 text-right">{(party.votes || 0).toLocaleString()}</td>
                                    <td className="p-2 text-right">{party.percentage}%</td>
                                    <td className="p-2 text-right font-bold">{party.seats}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ResultsDashboard);