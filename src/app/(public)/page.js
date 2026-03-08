'use client';

import { useState } from 'react';
import Link from 'next/link';

// ─── Dish data ────────────────────────────────────────────────────────────────

const DISHES = [
  { name: 'Biryani', urdu: 'بریانی', emoji: '🍛', tags: ['Rice', 'Festive'], desc: 'Fragrant basmati layered with spiced meat' },
  { name: 'Chicken Karahi', urdu: 'چکن کڑاہی', emoji: '🥘', tags: ['Chicken', 'Quick'], desc: 'Tomato-based wok-cooked street favourite' },
  { name: 'Dal Makhani', urdu: 'دال مکھنی', emoji: '🫕', tags: ['Vegetarian', 'Lentils'], desc: 'Slow-cooked black lentils in buttery gravy' },
  { name: 'Haleem', urdu: 'حلیم', emoji: '🍲', tags: ['Beef', 'Winter'], desc: 'Slow-braised wheat and meat stew' },
  { name: 'Nihari', urdu: 'نہاری', emoji: '🥣', tags: ['Beef', 'Breakfast'], desc: 'Rich slow-cooked morning curry' },
  { name: 'Pulao', urdu: 'پلاؤ', emoji: '🍚', tags: ['Rice', 'Mild'], desc: 'Delicately spiced one-pot rice with meat' },
];

// ─── Features ─────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: '🍽️',
    title: '150+ South Asian Dishes',
    desc: 'A curated list of Desi meals built for Pakistani and Indian kitchens — not generic global recipes.',
  },
  {
    icon: '📢',
    title: 'Family Broadcast',
    desc: "Post tonight's menu once. Every family member sees it instantly — no more repeated phone calls to Ammi.",
  },
  {
    icon: '🔍',
    title: 'Smart Filters',
    desc: 'Filter by time, ingredient, occasion, or dietary need. Find what fits your fridge right now.',
  },
  {
    icon: '📊',
    title: 'Weekly Insights',
    desc: 'See patterns in your family's eating habits. Rotate dishes you've over-relied on.',
  },
];

// ─── Pain Points ──────────────────────────────────────────────────────────────

const PROBLEMS = [
  {
    emoji: '😩',
    title: '"Kya pakaaein aaj?"',
    urdu: 'کیا پکائیں آج؟',
    desc: 'The daily question that drains mental energy before the day even starts.',
  },
  {
    emoji: '💸',
    title: 'Ordering out — again',
    urdu: 'باہر کا کھانا',
    desc: 'When there's no plan, the family falls back on expensive takeout that nobody really wanted.',
  },
  {
    emoji: '🤷',
    title: 'Everyone wants something different',
    urdu: 'سب کی پسند الگ',
    desc: 'Kids want biryani, Abba wants nihari, and Ammi just wants someone to decide.',
  },
];

// ─── Steps ────────────────────────────────────────────────────────────────────

const STEPS = [
  { step: '1', icon: '📅', title: 'Plan your week', desc: 'Pick meals from the South Asian dish list or add your own. Build a 7-day meal schedule in minutes.' },
  { step: '2', icon: '📤', title: 'Broadcast to family', desc: 'Share today's menu with one tap. Family members see it on their own devices — no group chat clutter.' },
  { step: '3', icon: '✅', title: 'Log and learn', desc: 'Track what you actually cooked. GharKaKhana shows you patterns and suggests variety over time.' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-amber-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🍛</span>
            <span className="font-bold text-lg text-amber-800 leading-tight">
              GharKaKhana
              <span className="block text-xs text-amber-500 font-normal leading-none urdu">گھر کا کھانا</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600 font-medium">
            <a href="#features" className="hover:text-amber-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-amber-600 transition-colors">How it works</a>
            <a href="#dishes" className="hover:text-amber-600 transition-colors">Dishes</a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 hover:text-amber-700 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Get started free
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-amber-700"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-amber-100 bg-white px-4 pb-4 pt-2 space-y-3">
            <a href="#features" className="block text-sm text-gray-700 hover:text-amber-600 py-1" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="block text-sm text-gray-700 hover:text-amber-600 py-1" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#dishes" className="block text-sm text-gray-700 hover:text-amber-600 py-1" onClick={() => setMenuOpen(false)}>Dishes</a>
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/login" className="block text-sm text-center border border-amber-600 text-amber-700 px-4 py-2 rounded-lg font-medium">Sign in</Link>
              <Link href="/signup" className="block text-sm text-center bg-amber-600 text-white px-4 py-2 rounded-lg font-medium">Get started free</Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-b border-amber-100">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28 text-center">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full mb-6 border border-amber-200">
            🏠 Built for South Asian families
          </span>

          {/* Urdu headline */}
          <p className="urdu text-4xl sm:text-5xl font-bold text-amber-700 mb-2">
            آج کیا پکائیں؟
          </p>

          {/* English headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-5">
            Your family's meals,{' '}
            <span className="text-amber-600 relative">
              planned together.
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <path d="M0 6 Q50 2 100 6 Q150 10 200 6" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              </svg>
            </span>
          </h1>

          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-10">
            GharKaKhana helps Ammi plan the week, broadcast tonight's menu to the whole family,
            and track home-cooked meals — all in one place.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-semibold text-base px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              Start for free →
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto bg-white border border-amber-200 hover:border-amber-400 text-gray-700 font-medium text-base px-7 py-3.5 rounded-xl transition-all"
            >
              See how it works
            </a>
          </div>

          {/* Social proof micro-copy */}
          <p className="mt-6 text-xs text-gray-400">No credit card · Works on mobile · 150+ Desi dishes included</p>
        </div>
      </section>

      {/* ── Problem ────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              The daily struggle is real
            </h2>
            <p className="mt-2 text-gray-500 text-base">Every South Asian household lives this, every day.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROBLEMS.map((p) => (
              <div key={p.title} className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-3">{p.emoji}</div>
                <p className="urdu text-lg text-amber-700 mb-1">{p.urdu}</p>
                <h3 className="font-semibold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section id="features" className="py-16 md:py-20 bg-amber-50/60 border-y border-amber-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">Features</span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900">
              Everything your kitchen needs
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white border border-amber-100 rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2 text-base">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">How it works</span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900">Three steps to a stress-free kitchen</h2>
          </div>

          <div className="relative">
            {/* Connector line — desktop only */}
            <div className="hidden md:block absolute top-10 left-[16.66%] right-[16.66%] h-px bg-amber-200 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {STEPS.map((s) => (
                <div key={s.step} className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-3xl mb-4 shadow-md">
                    {s.icon}
                  </div>
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">Step {s.step}</span>
                  <h3 className="font-bold text-gray-900 text-base mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Dish Preview ───────────────────────────────────────────────────── */}
      <section id="dishes" className="py-16 md:py-20 bg-gradient-to-b from-amber-50/60 to-white border-t border-amber-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">Dish Library</span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900">150+ Desi dishes, ready to plan</h2>
            <p className="mt-2 text-gray-500 text-sm">Real meals, real names — in English and Urdu.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DISHES.map((dish) => (
              <div
                key={dish.name}
                className="bg-white border border-amber-100 rounded-2xl p-5 flex items-start gap-4 hover:shadow-md hover:border-amber-200 transition-all"
              >
                <span className="text-4xl leading-none">{dish.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900">{dish.name}</h3>
                    <span className="urdu text-amber-600 text-sm">{dish.urdu}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{dish.desc}</p>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {dish.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-400 mt-8">
            + scores more: Aloo Gosht, Saag, Chapli Kabab, Sheer Khurma, and many more
          </p>
        </div>
      </section>

      {/* ── Positioning Strip ──────────────────────────────────────────────── */}
      <section className="bg-amber-700 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="urdu text-2xl text-amber-200 mb-4">گھر کا کھانا — صرف گھر والوں کے لیے</p>
          <p className="text-white text-lg sm:text-xl font-medium leading-relaxed">
            Not a calorie counter.&nbsp; Not a recipe app.&nbsp; Not a grocery planner.
          </p>
          <p className="mt-3 text-amber-200 text-base">
            GharKaKhana is a <strong className="text-white">family meal coordination system</strong> built around
            how South Asian households actually cook — and who actually decides.
          </p>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <p className="urdu text-3xl text-amber-700 mb-3">آج ہی شروع کریں</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">
            Start your family's meal journey today
          </h2>
          <p className="text-gray-500 mb-8 text-sm leading-relaxed">
            Join families who plan smarter, cook more at home, and stress less about the
            daily question: <em>"کیا پکائیں؟"</em>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-semibold text-base px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              Create your free account →
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto border border-gray-300 hover:border-amber-400 text-gray-700 font-medium text-base px-8 py-4 rounded-xl transition-all"
            >
              Already have an account?
            </Link>
          </div>
          <p className="mt-5 text-xs text-gray-400">Free to use · No credit card required · Mobile-friendly</p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <span className="text-xl">🍛</span>
              <div>
                <p className="text-white font-bold text-sm">GharKaKhana</p>
                <p className="urdu text-amber-400 text-xs">گھر کا کھانا</p>
              </div>
            </div>

            {/* Links */}
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
              <a href="#dishes" className="hover:text-white transition-colors">Dishes</a>
              <Link href="/login" className="hover:text-white transition-colors">Login</Link>
              <Link href="/signup" className="hover:text-white transition-colors">Sign up</Link>
            </nav>

            {/* Copy */}
            <p className="text-xs text-gray-600 text-center">
              © {new Date().getFullYear()} GharKaKhana. Built with ❤️ for Desi families.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
