import React from 'react';
import Navbar from '../components/Navbar';
import LiveWorkspace from '../components/LiveWorkspace';
import PageTransition from '../components/PageTransition';
import Footer from '../components/Footer';

const ResearchPage = () => {
    return (
        <PageTransition>
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <main className="pt-20">
                    <LiveWorkspace />
                </main>
                <Footer />
            </div>
        </PageTransition>
    );
};

export default ResearchPage;
