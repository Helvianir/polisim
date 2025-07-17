
import React from 'react';
import { useParliamentStore } from '../hooks/useParliamentStore';

const Header: React.FC = () => {
    const { view, setView } = useParliamentStore(state => ({ view: state.view, setView: state.setView }));

    const navItems = [
        { name: 'Parliament', key: 'parliament' },
        { name: 'Elections', key: 'election' },
        { name: 'Help', key: 'help' },
    ];

    return (
        <header className="bg-white border-b border-nyt-border sticky top-0 z-10">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <h1 className="text-2xl font-serif font-bold text-nyt-primary">PoliSim</h1>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {navItems.map((item) => (
                            <button
                                key={item.key}
                                onClick={() => setView(item.key as 'parliament' | 'election' | 'help')}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                    view === item.key
                                        ? 'bg-nyt-subtle text-nyt-primary'
                                        : 'text-gray-600 hover:bg-nyt-subtle'
                                }`}
                                aria-current={view === item.key ? 'page' : undefined}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
