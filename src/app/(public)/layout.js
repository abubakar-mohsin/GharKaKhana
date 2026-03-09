import Navbar from "@/components/shared/Navbar";

export default function PublicLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50">
            <Navbar />
            <main className="flex-grow pt-16 md:pt-0">
                {children}
            </main>

            {/* Footer can also be a shared component later */}
            <footer className="bg-slate-900 text-slate-400 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                    <div>
                        <span className="font-bold text-xl text-white tracking-tight">GharKaKhana</span>
                        <p className="mt-2 text-sm max-w-xs">Connecting South Asian families through the love of home-cooked meals.</p>
                    </div>
                    <div className="flex gap-8 text-sm font-medium">
                        <a href="/features" className="hover:text-white transition-colors">Features</a>
                        <a href="/how-it-works" className="hover:text-white transition-colors">How it works</a>
                        <a href="/dishes" className="hover:text-white transition-colors">Dishes</a>
                    </div>
                    <p className="text-xs">© {new Date().getFullYear()} GharKaKhana. Inspired by traditions.</p>
                </div>
            </footer>
        </div>
    );
}
