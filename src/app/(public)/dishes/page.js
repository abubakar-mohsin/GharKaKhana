'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChefHat, Timer, Flame, PlusCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DishesPage() {
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState({
        baseType: 'ALL',
        dietaryType: 'ALL',
        spiceLevel: 'ALL',
        isQuick: false,
        isHealthy: false,
    });

    const fetchDishes = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                q: query,
                baseType: filters.baseType,
                dietaryType: filters.dietaryType,
                spiceLevel: filters.spiceLevel,
                isQuick: filters.isQuick,
                isHealthy: filters.isHealthy,
            });
            const res = await fetch(`/api/dishes?${params}`);
            const data = await res.json();
            setDishes(data);
        } catch (error) {
            console.error('FETCH_DISHES_ERROR:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => fetchDishes(), 300);
        return () => clearTimeout(timer);
    }, [query, filters]);

    const baseTypes = ['ALL', 'RICE_BASED', 'ROTI_BASED', 'STANDALONE', 'BOTH'];
    const dietaryTypes = ['ALL', 'VEG', 'NON_VEG', 'VEGAN'];
    const spiceLevelsArr = ['ALL', 'MILD', 'MEDIUM', 'HOT', 'EXTRA_HOT'];

    return (
        <div className="bg-slate-50 min-h-screen pt-24 pb-20 px-6">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-4">
                        Dish <span className="text-orange-600">Library.</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-xl mx-auto md:mx-0 leading-relaxed">
                        Exploration of South Asian home cooking. Search and filter through 150+ authentic dishes.
                    </p>
                </div>

                {/* Filter Controls - Mobile first scrollable or stacked */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-8 mb-12">

                    {/* Search Bar */}
                    <div className="relative w-full max-w-2xl mx-auto flex items-center group">
                        <Search className="absolute left-4 text-slate-400 group-focus-within:text-orange-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search by dish name or ingredient..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full bg-slate-50 border border-transparent rounded-2xl py-4 pl-12 pr-6 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-orange-600/10 focus:bg-white focus:border-orange-600/20 transition-all text-lg"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                        {/* Dropdown Filters */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Base Source</label>
                            <select
                                value={filters.baseType}
                                onChange={(e) => setFilters({ ...filters, baseType: e.target.value })}
                                className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-orange-600/10 focus:outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                            >
                                {baseTypes.map(type => (
                                    <option key={type} value={type}>{type.replace('_', ' ')}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Dietary Preference</label>
                            <select
                                value={filters.dietaryType}
                                onChange={(e) => setFilters({ ...filters, dietaryType: e.target.value })}
                                className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-orange-600/10 focus:outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                            >
                                {dietaryTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Spice Level</label>
                            <select
                                value={filters.spiceLevel}
                                onChange={(e) => setFilters({ ...filters, spiceLevel: e.target.value })}
                                className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-orange-600/10 focus:outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                            >
                                {spiceLevelsArr.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Toggle Switches */}
                    <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-50">
                        <button
                            onClick={() => setFilters({ ...filters, isQuick: !filters.isQuick })}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all text-sm",
                                filters.isQuick
                                    ? "bg-orange-600 text-white shadow-lg shadow-orange-200"
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            )}
                        >
                            <Timer size={16} /> Quick Prep
                        </button>
                        <button
                            onClick={() => setFilters({ ...filters, isHealthy: !filters.isHealthy })}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all text-sm",
                                filters.isHealthy
                                    ? "bg-green-600 text-white shadow-lg shadow-green-200"
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            )}
                        >
                            <CheckCircle size={16} /> Healthy Option
                        </button>
                    </div>
                </div>

                {/* Results Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 animate-pulse text-slate-300">
                        <ChefHat size={64} strokeWidth={1} />
                        <p className="mt-4 font-semibold">Tasting the inventory...</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        <AnimatePresence>
                            {dishes.length > 0 ? (
                                dishes.map((dish) => (
                                    <motion.div
                                        key={dish.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="group bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer relative overflow-hidden"
                                    >
                                        {/* Background Accent */}
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 -z-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="flex justify-between items-start mb-6">
                                            <div className="bg-slate-50 p-4 rounded-[1.5rem] group-hover:bg-orange-50 transition-colors">
                                                <ChefHat size={28} className="text-slate-400 group-hover:text-orange-600 transition-colors" />
                                            </div>
                                            <div className="flex gap-1.5 flex-wrap justify-end">
                                                {dish.isQuick && <div title="Quick Prep" className="bg-amber-100 p-1.5 rounded-full text-amber-600"><Timer size={14} /></div>}
                                                {dish.isHealthy && <div title="Healthy" className="bg-emerald-100 p-1.5 rounded-full text-emerald-600"><CheckCircle size={14} /></div>}
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                                            {dish.name}
                                        </h3>
                                        <p className="text-sm text-slate-400 font-medium mb-4">{dish.baseType?.replace('_', ' ')}</p>

                                        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-6">
                                            {dish.description || `Delightful ${dish.name} prepared with authentic ingredients.`}
                                        </p>

                                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full">
                                                <Flame size={14} className={cn(
                                                    dish.spiceLevel === 'HOT' || dish.spiceLevel === 'EXTRA_HOT' ? "text-red-500" : "text-orange-400"
                                                )} />
                                                <span className="text-[10px] uppercase font-extrabold text-slate-500">{dish.spiceLevel}</span>
                                            </div>
                                            <button className="p-2 rounded-full bg-slate-900 text-white hover:bg-orange-600 transition-all hover:rotate-90">
                                                <PlusCircle size={20} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-40 text-center">
                                    <p className="text-slate-400 text-lg font-medium">No dishes found matching these filters.</p>
                                    <button
                                        onClick={() => setFilters({ baseType: 'ALL', dietaryType: 'ALL', spiceLevel: 'ALL', isQuick: false, isHealthy: false })}
                                        className="mt-4 text-orange-600 font-bold underline"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
