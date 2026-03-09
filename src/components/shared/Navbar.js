'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChefHat, LogIn, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const navLinks = [
        { name: 'Features', href: '/features' },
        { name: 'How it works', href: '/how-it-works' },
        { name: 'Dish Library', href: '/dishes' },
    ];

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            <div className="fixed top-0 w-full z-[100] px-6 py-4 pointer-events-none">
                <nav
                    className={cn(
                        'max-w-7xl mx-auto pointer-events-auto transition-all duration-500 ease-in-out',
                        'rounded-[2rem] border border-transparent px-6 py-2',
                        scrolled
                            ? 'bg-amber-50/80 backdrop-blur-xl border-amber-200/50 shadow-[0_20px_40px_-15px_rgba(245,158,11,0.15)] mt-4'
                            : 'bg-transparent mt-0'
                    )}
                >
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2.5 rounded-2xl group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-orange-200">
                                <ChefHat size={20} className="text-white" />
                            </div>
                            <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
                                GharKaKhana
                            </span>
                        </Link>

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        'text-sm font-bold px-4 py-2 rounded-xl transition-all duration-300',
                                        pathname === link.href
                                            ? 'text-orange-600 bg-orange-50'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="h-4 w-px bg-slate-200 mx-4" />
                            <Link
                                href="/login"
                                className="text-sm font-bold text-slate-700 hover:text-orange-600 px-4 py-2 transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/signup"
                                className="ml-2 bg-slate-900 text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-orange-600 hover:shadow-[0_8px_20px_-6px_rgba(249,115,22,0.6)] transition-all active:scale-95"
                            >
                                Get started
                            </Link>
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            onClick={toggleMenu}
                            className="md:hidden p-2.5 rounded-2xl bg-slate-900/5 text-slate-900 hover:bg-slate-900/10 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </nav>
            </div>

            {/* Mobile Menu Backdrop */}
            <AnimatePresence mode="wait">
                {isOpen && (
                    <div className="fixed inset-0 z-[110] md:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleMenu}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute top-0 right-0 h-[100dvh] w-[280px] bg-white p-8 shadow-2xl overflow-y-auto"
                        >
                            <div className="flex flex-col h-full">
                                <div className="flex justify-between items-center mb-10">
                                    <span className="font-bold text-xl text-slate-900">Menu</span>
                                    <button
                                        onClick={toggleMenu}
                                        className="p-2 rounded-full hover:bg-slate-50 text-slate-800"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="flex flex-col gap-6">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            onClick={toggleMenu}
                                            className={cn(
                                                'text-lg font-medium transition-colors',
                                                pathname === link.href ? 'text-orange-600' : 'text-slate-600'
                                            )}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>

                                <div className="mt-auto pt-10 border-t border-slate-100 flex flex-col gap-4">
                                    <Link
                                        href="/login"
                                        onClick={toggleMenu}
                                        className="flex items-center justify-center gap-2 bg-slate-50 text-slate-800 py-3.5 rounded-2xl font-semibold hover:bg-slate-100 transition-colors"
                                    >
                                        <LogIn size={18} />
                                        Log in
                                    </Link>
                                    <Link
                                        href="/signup"
                                        onClick={toggleMenu}
                                        className="flex items-center justify-center gap-2 bg-orange-600 text-white py-3.5 rounded-2xl font-semibold shadow-lg shadow-orange-200 hover:bg-orange-700 transition-colors"
                                    >
                                        <UserPlus size={18} />
                                        Get started
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
