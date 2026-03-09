'use client';

import { motion } from 'framer-motion';
import { Calendar, Send, ClipboardCheck, ArrowDown } from 'lucide-react';

const STEPS = [
    {
        step: '1',
        icon: <Calendar className="text-orange-600" size={40} />,
        title: 'Pick Your Menu',
        desc: 'Browse through 150+ authentic dishes or add your own recipes to build a daily or weekly schedule in minutes.'
    },
    {
        step: '2',
        icon: <Send className="text-orange-600" size={40} />,
        title: 'Broadcast instantly',
        desc: "With one tap, share tonight's menu with the entire family. Every member gets an instant notification on their phone."
    },
    {
        step: '3',
        icon: <ClipboardCheck className="text-orange-600" size={40} />,
        title: 'Log and Confirm',
        desc: 'Family members confirm what they actually ate. GharKaKhana tracks everything automatically for future insights.'
    }
];

export default function HowItWorks() {
    return (
        <div className="bg-slate-50 min-h-screen pt-24 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
                        Plan. Broadcast. <br /><span className="text-orange-600">Enjoy.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed italic border-l-4 border-orange-500 pl-4 py-2 bg-white rounded-r-xl inline-block mt-4">
                        Simplifying the "Kya pakaaein aaj?" problem for households across South Asia.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-20">
                    {STEPS.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group`}
                        >
                            <div className="w-full md:w-1/2 flex justify-center">
                                <div className="w-32 h-32 md:w-48 md:h-48 rounded-[2.5rem] bg-orange-50 flex items-center justify-center group-hover:rotate-6 transition-transform">
                                    {step.icon}
                                    <span className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                                        {step.step}
                                    </span>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 text-center md:text-left">
                                <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-1 underline underline-offset-4 decoration-2">Step {step.step}</span>
                                <h3 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">{step.title}</h3>
                                <p className="text-lg text-slate-500 leading-relaxed font-medium">{step.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Closing Callout */}
                <div className="mt-20 text-center bg-slate-900 text-white rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.2),transparent)] -z-0" />
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight relative z-10">Stop the daily mental drain.</h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium relative z-10">Plan your kitchen, coordinate your family, and reclaim late afternoons with a system built specifically for home food lovers.</p>
                    <button className="bg-orange-600 text-white px-10 py-4 rounded-2xl font-bold text-xl hover:bg-white hover:text-orange-600 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-orange-900/40 relative z-10">
                        Join the Families
                    </button>
                </div>
            </div>
        </div>
    );
}
