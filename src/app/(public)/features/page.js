'use client';

import { motion } from 'framer-motion';
import { ChefHat, Share2, BarChart3, Filter, ShieldCheck, Zap, Globe, Smartphone } from 'lucide-react';

const FEATURES = [
    {
        icon: <ChefHat className="text-orange-600" size={32} />,
        title: '150+ Desi Dishes',
        desc: 'Curated list of South Asian meals built for local kitchens, not generic recipes.'
    },
    {
        icon: <Share2 className="text-orange-600" size={32} />,
        title: 'Family Broadcast',
        desc: 'One-click menu updates to all family members across devices instantly.'
    },
    {
        icon: <Filter className="text-orange-600" size={32} />,
        title: 'Smart Filtering',
        desc: 'Filter by time, ingredient, or occasion. Find fits for your fridge instantly.'
    },
    {
        icon: <BarChart3 className="text-orange-600" size={32} />,
        title: 'Consumption Insights',
        desc: 'See patterns in your eating habits. Rotate dishes and keep variety up.'
    },
    {
        icon: <ShieldCheck className="text-orange-600" size={32} />,
        title: 'Role-Based Access',
        desc: 'Admins (Ammi/Abba) plan and broadcast; members track and confirm.'
    },
    {
        icon: <Zap className="text-orange-600" size={32} />,
        title: 'Lightning Performance',
        desc: 'Optimized for mobile use in kitchens with slow internet connections.'
    },
    {
        icon: <Globe className="text-orange-600" size={32} />,
        title: 'Multilingual Support',
        desc: 'Seamless transition between English and Urdu names for all dishes.'
    },
    {
        icon: <Smartphone className="text-orange-600" size={32} />,
        title: 'Mobile-First Design',
        desc: 'A web app that feels native on your phone for quick kitchen access.'
    }
];

export default function FeaturesPage() {
    return (
        <div className="bg-white min-h-screen pt-24 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
                        Everything your <br /><span className="text-orange-600">kitchen needs.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Built from the ground up to handle the specific dynamics of South Asian households. No fluff, just functionality.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {FEATURES.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="group p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:border-orange-100 transition-all cursor-default"
                        >
                            <div className="bg-white p-4 rounded-2xl inline-block shadow-sm mb-6 group-hover:bg-orange-50 transition-colors">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
                            <p className="text-slate-500 leading-relaxed text-sm">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
