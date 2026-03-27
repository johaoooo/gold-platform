'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User, Mail, Phone, Save, ArrowLeft, Loader2, Camera } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { getProfile, authFetch } from '@/lib/api';

const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://127.0.0.1:8000/api'
  : 'https://backend-gold-iubc.onrender.com/api';

export default function ProfilPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
    first_name: '',
    last_name: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) { router.push('/connexion'); return; }
    setUser(JSON.parse(storedUser));
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      setForm({
        username:   data.username   || '',
        email:      data.email      || '',
        phone:      data.phone      || '',
        first_name: data.first_name || '',
        last_name:  data.last_name  || '',
      });
      if (data.avatar) setAvatar(data.avatar);
    } catch {
      toast.error('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 2 Mo');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/auth/profile/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setAvatar(data.avatar);
      toast.success('Photo de profil mise à jour !');
    } catch {
      toast.error('Erreur lors du téléchargement');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/auth/profile/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(data));

      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...storedUser, username: form.username }));

      toast.success('Profil mis à jour !');
    } catch {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-green-500" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg pt-28 pb-20 px-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href={user?.role === 'investisseur' ? '/dashboard/investisseur' : '/dashboard/porteur'}
            className="text-text-2 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>
            Mon Profil
          </h1>
        </div>

        {/* Avatar avec upload */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-500/30 to-green-600/10 border-2 border-green-500/40 flex items-center justify-center overflow-hidden">
              {avatar ? (
                <Image
                  src={avatar}
                  alt="Avatar"
                  width={112}
                  height={112}
                  className="object-cover w-full h-full"
                />
              ) : (
                <User size={48} className="text-green-500" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-all shadow-lg"
            >
              {uploading ? (
                <Loader2 size={14} className="animate-spin text-white" />
              ) : (
                <Camera size={14} className="text-white" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Prénom</label>
              <input
                type="text"
                value={form.first_name}
                onChange={e => setForm({ ...form, first_name: e.target.value })}
                className="w-full mt-1 bg-bg/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500/50"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Nom</label>
              <input
                type="text"
                value={form.last_name}
                onChange={e => setForm({ ...form, last_name: e.target.value })}
                className="w-full mt-1 bg-bg/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500/50"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold flex items-center gap-1">
              <User size={10} /> Nom d'utilisateur
            </label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              className="w-full mt-1 bg-bg/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500/50"
              required
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold flex items-center gap-1">
              <Mail size={10} /> Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full mt-1 bg-bg/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500/50"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold flex items-center gap-1">
              <Phone size={10} /> Téléphone
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full mt-1 bg-bg/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500/50"
            />
          </div>

          <div className="pt-2 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-text-2 mb-4">
              <span className="px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] uppercase tracking-wider font-bold">
                {user?.role}
              </span>
              <span>Compte {user?.role === 'investisseur' ? 'investisseur' : 'porteur de projet'}</span>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Enregistrement...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
