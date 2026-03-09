'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChefHat, Share2, Filter, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="bg-[#FAF9F6]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-200/40 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-[-5%] w-[400px] h-[400px] bg-amber-200/30 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-600/10 text-orange-700 text-[10px] font-black mb-10 border border-orange-200 uppercase tracking-[0.2em]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            Premium Family Coordination
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-8xl font-[1000] text-slate-900 tracking-tighter leading-[0.95] mb-8"
          >
            Flavor meets<br />
            <span className="text-orange-600 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">Pure Clarity.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl md:text-2xl text-slate-600/80 max-w-3xl mx-auto mb-14 leading-relaxed font-medium"
          >
            GharKaKhana isn't just an app; it's the new operating system for your kitchen.
            Designed for households that breathe food.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-xl hover:bg-orange-600 transition-all hover:shadow-[0_20px_50px_rgba(249,115,22,0.3)] active:scale-95 flex items-center justify-center gap-3 group"
            >
              Get Started <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/dishes"
              className="w-full sm:w-auto bg-white/50 backdrop-blur-sm border-2 border-slate-200 text-slate-900 px-10 py-5 rounded-[2rem] font-black text-xl hover:bg-white transition-all active:scale-95"
            >
              Explore Library
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Feature Stripe - Deep Vibe */}
      <section className="py-32 bg-slate-900 text-white px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.1),transparent)]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { icon: <ChefHat className="text-orange-500" size={40} />, title: "The Curator", desc: "150+ dishes mapped to South Asian flavor profiles, updated monthly." },
              { icon: <Share2 className="text-orange-500" size={40} />, title: "The Broadcaster", desc: "One-tap sync across all family devices. No more repeated questions." },
              { icon: <BarChart3 className="text-orange-500" size={40} />, title: "The Strategist", desc: "Deep insights into consumption patterns to help rotate your menu responsibly." }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col gap-6 group">
                <div className="bg-white/5 p-5 rounded-[2rem] w-fit group-hover:bg-orange-600/20 transition-colors border border-white/10">{feature.icon}</div>
                <h3 className="text-2xl font-black tracking-tight">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-lg font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contrast Statement */}
      <section className="py-40 bg-[#FFFBF0] px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-orange-600 font-black tracking-[0.3em] uppercase text-xs mb-8 block">Revolutionary Simplicity</span>
          <h2 className="text-4xl md:text-7xl font-black text-slate-900 mb-10 tracking-tighter leading-none italic">"Kya pakaaein aaj?"</h2>
          <p className="text-2xl md:text-3xl text-slate-500 mb-16 leading-tight font-bold max-w-2xl mx-auto">
            We solved the most exhausting daily question in the South Asian household.
          </p>
          <div className="flex flex-wrap justify-center gap-10 text-[10px] font-black text-slate-300 uppercase tracking-[0.25em]">
            <span className="flex items-center gap-2 border-b-2 border-orange-600/20 pb-2"><CheckCircle2 size={12} className="text-orange-600" /> Mobile First Architecture</span>
            <span className="flex items-center gap-2 border-b-2 border-orange-600/20 pb-2"><CheckCircle2 size={12} className="text-orange-600" /> Real-time Data Sync</span>
            <span className="flex items-center gap-2 border-b-2 border-orange-600/20 pb-2"><CheckCircle2 size={12} className="text-orange-600" /> Deep Flavor Profiles</span>
          </div>
        </div>
      </section>

      {/* CTA Strip - High Contrast Burned Orange */}
      <section className="py-32 bg-gradient-to-br from-orange-600 to-orange-700 text-white text-center px-6 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">Elevate your<br />family's table.</h2>
          <p className="text-orange-100 text-xl md:text-2xl mb-14 max-w-xl mx-auto font-bold opacity-80 leading-relaxed">Join the next generation of planned households. Free, forever.</p>
          <Link
            href="/signup"
            className="inline-block bg-slate-900 text-white px-14 py-6 rounded-[2.5rem] font-black text-2xl hover:bg-white hover:text-slate-900 transition-all hover:scale-105 active:scale-95 shadow-2xl"
          >
            Initialize Now
          </Link>
        </div>
      </section>
    </div>
  );
}
