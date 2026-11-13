'use client';

import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, Clock } from 'lucide-react';

interface PassProps {
  eventTitle: string;
  venue: string;
  studentName: string;
  rollNo: string;
  qrToken: string;
  checkedIn: boolean;
}

export default function EventPassCard({
  eventTitle,
  venue,
  studentName,
  rollNo,
  qrToken,
  checkedIn,
}: PassProps) {
  return (
    <div className="max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-100 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Official Entry Pass
          </span>
          <h3 className="mt-1 text-lg font-bold">{eventTitle}</h3>
          <p className="text-sm text-slate-400">Venue: {venue}</p>
        </div>
        {checkedIn ? (
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <CheckCircle2 className="h-4 w-4" /> Checked In
          </span>
        ) : (
          <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
            <Clock className="h-4 w-4" /> Pending
          </span>
        )}
      </div>

      <div className="my-6 flex flex-col items-center justify-center rounded-xl bg-white p-4">
        <QRCodeSVG value={qrToken} size={160} level="H" />
      </div>

      <div className="flex justify-between text-sm">
        <div>
          <p className="text-slate-400">Participant</p>
          <p className="font-medium">{studentName}</p>
        </div>
        <div className="text-right">
          <p className="text-slate-400">Roll Number</p>
          <p className="font-mono font-medium">{rollNo}</p>
        </div>
      </div>
    </div>
  );
}