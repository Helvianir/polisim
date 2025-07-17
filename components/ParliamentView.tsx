
import React, { useCallback } from 'react';
import Card from './common/Card';
import PartyManager from './PartyManager';
import SeatVisualization from './SeatVisualization';
import CoalitionBuilder from './CoalitionBuilder';
import VotingSimulator from './VotingSimulator';
import ScenarioTracker from './ScenarioTracker';
import { useParliamentStore } from '../hooks/useParliamentStore';
import Button from './common/Button';
import Input from './common/Input';
import { exportToJson, exportToCsv } from '../lib/utils';


const ParliamentView: React.FC = () => {
    const { totalSeats, setTotalSeats, parties, loadPreset } = useParliamentStore(state => ({
        totalSeats: state.totalSeats,
        setTotalSeats: state.setTotalSeats,
        parties: state.parties,
        loadPreset: state.loadPreset,
    }));

    const handleExportJson = useCallback(() => {
        exportToJson({ parties, totalSeats });
    }, [parties, totalSeats]);
    
    const handleExportCsv = useCallback(() => {
        exportToCsv(parties);
    }, [parties]);
    
    return (
        <div className="space-y-8">
            <ScenarioTracker />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card title="Parliament Chamber">
                        <SeatVisualization parties={parties} totalSeats={totalSeats} />
                    </Card>
                    <Card title="Voting Simulator">
                        <VotingSimulator />
                    </Card>
                </div>
                <div className="space-y-8">
                    <Card title="Configuration">
                        <div className="space-y-4">
                            <div>
                                <Input 
                                    label="Total Seats in Parliament"
                                    type="number"
                                    id="total-seats"
                                    value={totalSeats}
                                    onChange={(e) => setTotalSeats(Number(e.target.value))}
                                    min="1"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Presets</label>
                                <div className="flex space-x-2">
                                     <Button variant="secondary" onClick={() => loadPreset('dutch')}>Dutch Parliament</Button>
                                     <Button variant="secondary" onClick={() => loadPreset('us_senate')}>US Senate</Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Export</label>
                                <div className="flex space-x-2">
                                     <Button variant="secondary" onClick={handleExportJson}>Export JSON</Button>
                                     <Button variant="secondary" onClick={handleExportCsv}>Export CSV</Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card title="Coalition Builder">
                        <CoalitionBuilder />
                    </Card>
                     <Card title="Party Management">
                        <PartyManager />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ParliamentView);