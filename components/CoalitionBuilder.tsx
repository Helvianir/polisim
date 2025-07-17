
import React, { useMemo } from 'react';
import { useParliamentStore } from '../hooks/useParliamentStore';
import Button from './common/Button';

const CoalitionBuilder: React.FC = () => {
  const { parties, coalition, toggleCoalitionMember, clearCoalition, totalSeats } = useParliamentStore();

  const coalitionSeats = useMemo(() => {
    return coalition.reduce((sum, partyId) => {
      const party = parties.find(p => p.id === partyId);
      return sum + (party?.seats || 0);
    }, 0);
  }, [coalition, parties]);

  const majorities = useMemo(() => ({
    'Simple Majority': Math.floor(totalSeats / 2) + 1,
    'Two-Thirds': Math.ceil(totalSeats * (2 / 3)),
    'Three-Quarters': Math.ceil(totalSeats * (3 / 4)),
  }), [totalSeats]);

  const getProgress = (target: number) => {
    if (target === 0) return 0;
    return Math.min((coalitionSeats / target) * 100, 100);
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-lg">Coalition Total: <span className="font-bold">{coalitionSeats}</span> / {totalSeats} seats</h4>
      </div>
      <div className="space-y-3">
        {Object.entries(majorities).map(([name, value]) => (
          <div key={name}>
            <div className="flex justify-between items-center text-sm mb-1">
              <span>{name} ({value} seats)</span>
              <span className={`font-semibold ${coalitionSeats >= value ? 'text-green-600' : 'text-gray-600'}`}>
                {coalitionSeats >= value ? 'Achieved' : 'Needed'}
              </span>
            </div>
            <div className="w-full bg-nyt-subtle rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${getProgress(value)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2 border-t border-b py-2 my-2">
        <h5 className="font-semibold">Select Parties</h5>
        {parties.map(party => (
          <div key={party.id} className="flex items-center justify-between p-2 rounded-md hover:bg-nyt-subtle">
            <label htmlFor={`coalition-${party.id}`} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                id={`coalition-${party.id}`}
                checked={coalition.includes(party.id)}
                onChange={() => toggleCoalitionMember(party.id)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                style={{ accentColor: party.color }}
              />
              <span className="font-medium">{party.name}</span>
            </label>
            <span className="text-sm font-bold">{party.seats}</span>
          </div>
        ))}
      </div>
      <Button onClick={clearCoalition} variant="secondary" className="w-full">
        Clear Coalition
      </Button>
    </div>
  );
};

export default React.memo(CoalitionBuilder);