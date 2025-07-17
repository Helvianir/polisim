
import React from 'react';
import Card from './common/Card';
import ElectionSimulator from './ElectionSimulator';
import ResultsDashboard from './ResultsDashboard';

const ElectionView: React.FC = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1 space-y-8">
                <Card title="Election Simulator">
                    <ElectionSimulator />
                </Card>
            </div>
            <div className="lg:col-span-2">
                 <Card title="Election Results">
                    <ResultsDashboard />
                </Card>
            </div>
        </div>
    );
};

export default React.memo(ElectionView);