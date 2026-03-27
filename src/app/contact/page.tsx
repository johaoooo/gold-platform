'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <main className="pt-32 pb-20 bg-bg">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Nous <span className="text-green-500">contacter</span>
          </h1>
          <p className="text-text-2 text-sm max-w-lg mx-auto">
            Une question ? Notre équipe est à votre écoute.
          </p>
        </div>

        {/* Contact info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-surface/50 rounded-xl p-6 text-center border border-white/5">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
              <Phone size={18} className="text-green-500" />
            </div>
            <p className="text-white text-sm font-medium">+229 97 00 00 00</p>
            <p className="text-text-2 text-xs">Ligne directe</p>
          </div>
          
          <div className="bg-surface/50 rounded-xl p-6 text-center border border-white/5">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
              <Mail size={18} className="text-green-500" />
            </div>
            <p className="text-white text-sm font-medium">contact@golden-invest.com</p>
            <p className="text-text-2 text-xs">Email</p>
          </div>
          
          <div className="bg-surface/50 rounded-xl p-6 text-center border border-white/5">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
              <MapPin size={18} className="text-green-500" />
            </div>
            <p className="text-white text-sm font-medium">Cotonou & Porto-Novo</p>
            <p className="text-text-2 text-xs">Bénin</p>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-surface/50 rounded-xl border border-white/5 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs text-text-2 mb-1 block">Nom complet</label>
                <input
                  type="text"
                  required
                  placeholder="Votre nom"
                  className="w-full bg-bg border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="text-xs text-text-2 mb-1 block">Email</label>
                <input
                  type="email"
                  required
                  placeholder="nom@exemple.com"
                  className="w-full bg-bg border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500"
                />
              </div>
            </div>
            
            <div>
              <label className="text-xs text-text-2 mb-1 block">Service concerné</label>
              <select className="w-full bg-bg border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500">
                <option>Investissement</option>
                <option>Audit de Projet</option>
                <option>Conseil Stratégique</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs text-text-2 mb-1 block">Message</label>
              <textarea
                rows={4}
                required
                placeholder="Votre message..."
                className="w-full bg-bg border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={sent}
              className="w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold text-sm uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sent ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle size={16} />
                  Message envoyé
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Send size={14} />
                  Envoyer
                </span>
              )}
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}
