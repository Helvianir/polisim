
import React, { useMemo, useCallback } from 'react';
import { useParliamentStore } from '../hooks/useParliamentStore';
import { Ideology, Party } from '../types';
import Button from './common/Button';
import Input from './common/Input';
import Select from './common/Select';
import { Trash2 } from 'lucide-react';

const PartyManager: React.FC = () => {
    const { parties, addParty, updateParty, removeParty, totalSeats } = useParliamentStore();

    const currentTotalSeats = useMemo(() => {
        return parties.reduce((sum, p) => sum + p.seats, 0);
    }, [parties]);

    const handleSeatChange = useCallback((party: Party, value: string) => {
        const newSeats = Number(value);
        const otherSeats = currentTotalSeats - party.seats;
        if (newSeats >= 0 && (otherSeats + newSeats <= totalSeats)) {
            updateParty(party.id, { seats: newSeats });
        }
    }, [currentTotalSeats, totalSeats, updateParty]);

    return (
        <div className="space-y-4">
            <div className="max-h-96 overflow-y-auto pr-2 space-y-3">
            {parties.map(party => (
                <div key={party.id} className="p-3 bg-nyt-subtle rounded-lg border border-nyt-border space-y-2">
                    <div className="flex items-center space-x-2">
                        <input
                            type="color"
                            value={party.color.startsWith('hsl') ? `#${hslToHex(party.color)}` : party.color}
                            onChange={(e) => updateParty(party.id, { color: e.target.value })}
                            className="w-8 h-8 rounded-full border-none cursor-pointer"
                            aria-label={`Color for ${party.name}`}
                        />
                         <Input
                            aria-label={`Name for party ${party.name}`}
                            type="text"
                            value={party.name}
                            onChange={(e) => updateParty(party.id, { name: e.target.value })}
                            className="flex-grow"
                        />
                        <Button variant="danger" onClick={() => removeParty(party.id)} className="p-2 h-10 w-10 flex-shrink-0 flex items-center justify-center">
                           <Trash2 className="w-4 h-4"/>
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                         <Input
                            label="Seats"
                            aria-label={`Seats for ${party.name}`}
                            type="number"
                            min="0"
                            max={totalSeats - (currentTotalSeats - party.seats)}
                            value={party.seats}
                            onChange={(e) => handleSeatChange(party, e.target.value)}
                        />
                         <Select
                            label="Ideology"
                            id={`ideology-${party.id}`}
                            value={party.ideology}
                            onChange={(e) => updateParty(party.id, { ideology: e.target.value as Ideology })}
                        >
                            {Object.values(Ideology).map(ideo => (
                                <option key={ideo} value={ideo}>{ideo}</option>
                            ))}
                        </Select>
                    </div>
                </div>
            ))}
            </div>
            <div className="text-sm text-gray-600 border-t pt-2 mt-2">
                Allocated Seats: <span className="font-bold">{currentTotalSeats}</span> / {totalSeats}
            </div>
            <Button onClick={addParty} className="w-full">Add New Party</Button>
        </div>
    );
};

// Helper to convert HSL string to HEX for color input compatibility
function hslToHex(hslStr: string) {
    if (!hslStr || !hslStr.includes('hsl')) return '000000';
    const match = hslStr.match(/(\d+)/g);
    if (!match || match.length < 3) return '000000'; // Fallback for invalid format
    
    let [h, s, l] = match.map(Number);
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) { [r,g,b] = [c,x,0]; } 
    else if (60 <= h && h < 120) { [r,g,b] = [x,c,0]; } 
    else if (120 <= h && h < 180) { [r,g,b] = [0,c,x]; } 
    else if (180 <= h && h < 240) { [r,g,b] = [0,x,c]; } 
    else if (240 <= h && h < 300) { [r,g,b] = [x,0,c]; } 
    else if (300 <= h && h < 360) { [r,g,b] = [c,0,x]; }
    
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    
    return [r,g,b].map(cVal => cVal.toString(16).padStart(2, '0')).join('');
}

export default React.memo(PartyManager);