
import React from 'react';
import { ToastContainer } from 'react-toastify';
import { useParliamentStore } from './hooks/useParliamentStore';
import Header from './components/Header';
import ParliamentView from './components/ParliamentView';
import ElectionView from './components/ElectionView';
import HelpView from './components/HelpView';
import ErrorBoundary from './components/common/ErrorBoundary';

const App: React.FC = () => {
    const view = useParliamentStore(state => state.view);

    const renderView = () => {
        switch (view) {
            case 'parliament':
                return <ParliamentView />;
            case 'election':
                return <ElectionView />;
            case 'help':
                return <HelpView />;
            default:
                return <ParliamentView />;
        }
    };

    return (
        <div className="bg-nyt-bg min-h-screen font-sans text-nyt-text">
            <Header />
            <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
                <ErrorBoundary>
                    {renderView()}
                </ErrorBoundary>
            </main>
            <footer className="text-center p-4 text-xs text-gray-500 border-t border-nyt-border mt-8">
                <p>Parliament & Election Simulator. A Fictional Tool for Educational Purposes.</p>
            </footer>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default App;