
import React from 'react';
import Card from './common/Card';

const HelpView: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="font-serif text-3xl font-bold text-center">Help & Documentation</h2>
            
            <Card title="Welcome to PoliSim!">
                <p>
                    PoliSim is a tool for simulating parliamentary democracy. You can set up a parliament,
                    form coalitions, run elections with different voting systems, and see how outcomes change.
                    It's designed for educational and entertainment purposes to help understand complex political mechanics.
                </p>
            </Card>

            <Card title="The Parliament View">
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold font-serif">Configuration</h4>
                        <p>
                            Start by setting the <strong>Total Seats</strong> in your parliament. Use the <strong>Presets</strong> to load real-world examples like the Dutch Parliament or US Senate. You can also <strong>Export</strong> your current setup as a JSON or CSV file.
                        </p>
                    </div>
                     <div>
                        <h4 className="font-semibold font-serif">Party Management</h4>
                        <p>
                            Add, remove, and edit political parties. For each party, you can set its name, color, starting number of seats, and ideology. The total allocated seats cannot exceed the parliament's total seats.
                        </p>
                    </div>
                     <div>
                        <h4 className="font-semibold font-serif">Seat Visualization</h4>
                        <p>
                            The hemicycle (semi-circular chart) shows the current composition of the parliament. Each colored segment represents a party's seats. Hover over a segment to see the party's name.
                        </p>
                    </div>
                     <div>
                        <h4 className="font-semibold font-serif">Coalition Builder</h4>
                        <p>
                           Select parties to form a coalition. The builder tracks the total seats of your chosen parties and shows your progress towards key majority thresholds (Simple Majority, 2/3, etc.). Complete scenarios to get achievements!
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold font-serif">Voting Simulator</h4>
                        <p>
                            Enter a title for a fictional law and click "Simulate Vote." Parties will vote based on a simplified model of their ideology. The bar chart shows the result and whether the motion passed or failed.
                        </p>
                    </div>
                </div>
            </Card>

            <Card title="The Election View">
                 <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold font-serif">Election Simulator</h4>
                        <p>
                           Configure and run a national election. Set parameters like <strong>Eligible Voters</strong>, <strong>Voter Turnout</strong>, and an <strong>Electoral Threshold</strong> (the minimum % of votes a party needs to be eligible for seats).
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold font-serif">Electoral Systems</h4>
                        <p>
                           Choose a system to allocate seats based on votes:
                        </p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                            <li><strong>D'Hondt:</strong> A method that slightly favors larger parties.</li>
                            <li><strong>Sainte-Laguë:</strong> A method known for producing very proportional results.</li>
                            <li><strong>First-Past-The-Post (FPTP):</strong> In this simulation, this is a winner-takes-all system where the party with the most votes wins all seats.</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold font-serif">Running the Election</h4>
                        <p>
                           Assign a percentage of the vote to each party. The total cannot exceed 100%; any unassigned percentage is considered "spoiled" votes. Click "Run Election" to see the seat allocation and detailed results on the dashboard.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default HelpView;
