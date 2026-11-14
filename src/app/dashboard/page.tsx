'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import EventPassCard from '@/components/EventPassCard';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push('/login');

    const { data: userData } = await supabase.from('users').select('*').eq('id', user.id).single();
    setProfile(userData);

    const { data: eventsData } = await supabase.from('events').select('*');
    setEvents(eventsData || []);

    const { data: regData } = await supabase
      .from('registrations')
      .select('*, events(title, venue)')
      .eq('user_id', user.id);
    setRegistrations(regData || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRegister = async (eventId: string) => {
    if (!profile) return;
    const { error } = await supabase.from('registrations').insert({
      event_id: eventId,
      user_id: profile.id,
    });
    if (!error) loadData();
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {profile?.name}</h1>
            <p className="font-mono text-sm text-emerald-400">{profile?.roll_no}</p>
          </div>
          <button
            onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
          >
            Sign Out
          </button>
        </header>

        <section>
          <h2 className="mb-4 text-xl font-semibold">My Event Passes</h2>
          {registrations.length === 0 ? (
            <p className="text-sm text-slate-400">No passes yet. Register for an event below.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {registrations.map((reg) => (
                <EventPassCard
                  key={reg.id}
                  eventTitle={reg.events.title}
                  venue={reg.events.venue}
                  studentName={profile.name}
                  rollNo={profile.roll_no}
                  qrToken={reg.qr_token}
                  checkedIn={reg.checked_in}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">Available Events</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {events.map((ev) => {
              const alreadyRegistered = registrations.some((r) => r.event_id === ev.id);
              return (
                <div key={ev.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-4">
                  <div>
                    <h3 className="font-bold">{ev.title}</h3>
                    <p className="text-xs text-slate-400">{ev.category.toUpperCase()} • {ev.venue}</p>
                  </div>
                  <button
                    disabled={alreadyRegistered}
                    onClick={() => handleRegister(ev.id)}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium disabled:bg-slate-800 disabled:text-slate-500"
                  >
                    {alreadyRegistered ? 'Registered' : 'Register'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}