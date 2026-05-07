import React from 'react';
import Navbar from '../components/Navbar';
import VaultUpload from '../components/VaultUpload';
import { motion } from 'framer-motion';

const VaultPage = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="min-h-screen bg-slate-50"
        >
            <Navbar />
            <main className="pt-24 px-6 lg:px-12 max-w-7xl mx-auto py-8">
                <div className="flex justify-center items-center h-full">
                    <VaultUpload />
                </div>
            </main>
        </motion.div>
    );
};

export default VaultPage;
