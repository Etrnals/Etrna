'use client';

import { useState } from 'react';

interface ProposalCreatorProps {
  onSubmit?: (data: { title: string; description: string; category: string }) => void;
}

export function ProposalCreator({ onSubmit }: ProposalCreatorProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('ecosystem');

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 space-y-3">
      <h3 className="text-lg font-semibold">Create Proposal</h3>
      <input
        className="w-full rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-sm"
        placeholder="Proposal title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-sm"
        placeholder="Describe the change"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex gap-3 text-sm">
        <label className="space-x-2">
          <span>Category</span>
          <select
            className="rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="ecosystem">Ecosystem</option>
            <option value="verse">Verse</option>
            <option value="music">Music</option>
            <option value="treasury">Treasury</option>
            <option value="uef">UEF</option>
            <option value="vibecheck">VibeCheck</option>
          </select>
        </label>
        <button
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-400"
          onClick={() => onSubmit?.({ title, description, category })}
        >
          Publish
        </button>
      </div>
    </div>
  );
}
