import React, { useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useParliamentStore } from '../hooks/useParliamentStore';
import { State } from '../types';
import { toast } from 'react-toastify';

const ScenarioTracker: React.FC = () => {
    const { 
        scenarios, 
        completedScenarioIds, 
        completeScenarios,
        parties,
        coalition,
        totalSeats 
    } = useParliamentStore(useShallow(state => ({
        scenarios: state.scenarios,
        completedScenarioIds: state.completedScenarioIds,
        completeScenarios: state.completeScenarios,
        parties: state.parties,
        coalition: state.coalition,
        totalSeats: state.totalSeats,
    })));

    // This effect is the new source of truth for checking scenarios.
    // It runs only when the data it depends on changes.
    useEffect(() => {
        const stateSnapshot: State = { parties, coalition, totalSeats };
        
        const newlyCompleted = scenarios.filter(s => 
            !completedScenarioIds.includes(s.id) && s.isCompleted(stateSnapshot)
        );

        if (newlyCompleted.length > 0) {
            const newlyCompletedIds = newlyCompleted.map(s => s.id);
            completeScenarios(newlyCompletedIds);
            
            newlyCompleted.forEach(s => {
                toast.success(`Challenge Completed: ${s.title}!`);
            });
        }
    }, [parties, coalition, totalSeats, scenarios, completedScenarioIds, completeScenarios]);

    const { completedScenarios, incompleteScenarios } = useMemo(() => {
        const completed = scenarios.filter(s => completedScenarioIds.includes(s.id));
        const incomplete = scenarios.filter(s => !completedScenarioIds.includes(s.id));
        return { completedScenarios: completed, incompleteScenarios: incomplete };
    }, [scenarios, completedScenarioIds]);

    if (scenarios.length === 0) return null;

    return (
        <div className="bg-white border border-nyt-border rounded-lg p-4 shadow-sm">
            <h3 className="font-serif text-xl font-bold mb-3">Challenges</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h4 className="font-semibold mb-2">To-Do</h4>
                    {incompleteScenarios.length > 0 ? (
                        <ul className="space-y-2">
                            {incompleteScenarios.map(s => (
                                <li key={s.id} className="text-sm text-gray-700 p-2 bg-nyt-subtle rounded-md">
                                    <strong className="block text-nyt-primary">{s.title}</strong>
                                    {s.description}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">All challenges completed!</p>
                    )}
                </div>
                <div>
                    <h4 className="font-semibold mb-2 text-green-600">Completed</h4>
                     {completedScenarios.length > 0 ? (
                        <ul className="space-y-2">
                            {completedScenarios.map(s => (
                                <li key={s.id} className="text-sm text-gray-500 p-2 bg-green-50 border border-green-200 rounded-md">
                                    <span className="line-through">
                                        <strong>{s.title}</strong>
                                    </span>
                                    <span role="img" aria-label="check mark" className="ml-2">✅</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">No challenges completed yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default React.memo(ScenarioTracker);