import { ProposalCreator } from '../../components/ProposalCreator';

export default function NewProposalPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <header>
        <p className="text-xs uppercase tracking-wide text-slate-400">New proposal</p>
        <h1 className="text-3xl font-semibold">Author a governance action</h1>
        <p className="text-sm text-slate-300">Draft proposals route to on-chain execution via EtrnaGovernor timelock.</p>
      </header>
      <ProposalCreator />
    </div>
  );
}
