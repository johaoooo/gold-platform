'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <main className="pt-32 pb-24 bg-bg min-h-screen font-syne">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Nous <span className="text-green-400">contacter</span>
          </h1>
          <div className="h-0.5 w-16 bg-green-400 mx-auto opacity-60"></div>
        </div>

        <section className="max-w-lg mx-auto mb-24">
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="bg-surface/60 backdrop-blur-md border border-green-500/10 p-10 rounded-xl shadow-2xl space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-green-400 font-bold">Identité complète</label>
                <input type="text" required placeholder="Votre nom" className="bg-bg border border-white/10 rounded-md px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/60 transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-green-400 font-bold">Email de contact</label>
                <input type="email" required placeholder="nom@exemple.com" className="bg-bg border border-white/10 rounded-md px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/60 transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-green-400 font-bold">Service concerné</label>
                <select className="bg-bg border border-white/10 rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-green-500/60 transition-all cursor-pointer">
                  <option>Investissement</option>
                  <option>Audit de Projet</option>
                  <option>Conseil Stratégique</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-green-400 font-bold">Votre demande</label>
                <textarea rows={4} required placeholder="Expliquez votre besoin..." className="bg-bg border border-white/10 rounded-md px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/60 transition-all resize-none"></textarea>
              </div>
            </div>
            <Button variant="gold" type="submit" size="sm" className="w-full py-5 text-[11px] uppercase tracking-[0.4em] font-bold">
              {sent ? "✓ Demande transmise" : "Envoyer le formulaire"}
            </Button>
          </form>
        </section>

        <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 pt-16 border-t border-green-500/10">
          <div className="text-center md:text-left">
            <h4 className="text-green-400 uppercase tracking-[0.3em] text-[10px] mb-3 font-bold">Bénin — Cotonou</h4>
            <p className="text-white text-xs leading-relaxed font-medium uppercase tracking-wider">Immeuble Golden, Haie Vive</p>
          </div>
          <div className="text-center">
            <h4 className="text-green-400 uppercase tracking-[0.3em] text-[10px] mb-3 font-bold">Bénin — Porto-Novo</h4>
            <p className="text-white text-xs leading-relaxed font-medium uppercase tracking-wider">Zone Administrative</p>
          </div>
          <div className="text-center md:text-right">
            <h4 className="text-green-400 uppercase tracking-[0.3em] text-[10px] mb-3 font-bold">Ligne Directe</h4>
            <p className="text-white text-sm font-bold tracking-widest">+229 97 00 00 00</p>
          </div>
        </section>
      </div>
    </main>
  );
}
