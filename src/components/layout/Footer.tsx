import { Heart } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="w-full py-8 mt-auto border-t border-white/10 bg-black/20 backdrop-blur-sm relative z-20">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 w-full">
                    <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-lg shadow-cyan-500/5">
                            <img src="/favicon.png" alt="Logo" className="w-5 h-5 object-contain" />
                        </span>
                        <span className="font-display font-semibold tracking-wide text-foreground">NEXUS <span className="text-muted-foreground font-normal">Education</span></span>
                    </div>

                    <div className="text-xs text-muted-foreground/60 font-light tracking-wider">
                        © 2025 NEXUS SYSTEMS. ALL RIGHTS RESERVED
                    </div>

                    <div className="flex flex-col items-center gap-1 text-sm backdrop-blur-md px-6 py-2.5 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium uppercase tracking-wider">
                            <span>Made with</span>
                            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" />
                            <span>by</span>
                        </div>
                        <span className="font-display font-semibold text-cyan-400 tracking-wide text-base">
                            Mausam, Komal, Annu, Shreya
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
