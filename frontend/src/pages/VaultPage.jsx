import React from 'react';
import Navbar from '../components/Navbar';
import VaultUpload from '../components/VaultUpload';
import PageTransition from '../components/PageTransition';

const VaultPage = () => {
    return (
        <PageTransition>
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <main className="pt-24 px-6 lg:px-12 max-w-7xl mx-auto py-8">
                    <div className="flex justify-center items-center h-full">
                        <VaultUpload />
                    </div>
                </main>
            </div>
        </PageTransition>
    );
};

export default VaultPage;
