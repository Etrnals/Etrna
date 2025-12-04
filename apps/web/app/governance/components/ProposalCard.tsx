interface ProposalCardProps {
  title: string;
  status: string;
  category: string;
  description: string;
  href: string;
}

export function ProposalCard({ title, status, category, description, href }: ProposalCardProps) {
  return (
    <a className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 hover:border-slate-500 block" href={href}>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="uppercase tracking-wide">{category}</span>
        <span className="rounded-full bg-slate-800 px-2 py-1 text-[11px]">{status}</span>
      </div>
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-slate-300 line-clamp-2">{description}</p>
    </a>
  );
}
