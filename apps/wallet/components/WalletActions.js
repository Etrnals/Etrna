import BridgePanel from './bridge/BridgePanel';
import SwapPanel from './swap/SwapPanel';
import IdentityPanel from './identity/IdentityPanel';

export default function WalletActions() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <BridgePanel />
      <SwapPanel />
      <IdentityPanel />
    </div>
  );
}
