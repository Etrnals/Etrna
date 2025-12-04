const notifications = [
  { title: 'New perk unlocked', body: 'Bridge 3 assets to unlock +1.2x multiplier.' },
  { title: 'Swap reward', body: 'You earned +10 $ETR vibes from your last swap.' },
  { title: 'NFT drop', body: 'Exclusive Etrnal skin available for EtrnaPass holders.' }
];

export default function Notifications() {
  return (
    <div className="bg-slate-800 rounded-xl p-4 space-y-3">
      <h2 className="text-xl font-semibold">Notifications</h2>
      <div className="space-y-2">
        {notifications.map((note) => (
          <div key={note.title} className="bg-slate-900 rounded-lg p-3">
            <p className="font-semibold text-sm">{note.title}</p>
            <p className="text-xs text-slate-400">{note.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
