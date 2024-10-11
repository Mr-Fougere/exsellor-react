import { useEffect, useMemo, useState } from "react";
import Header from "./components/reusable/Header";
import CredentialKeeper from "./services/CredentialKeeper";
import { CredentialKeeperStatus } from "./interfaces/credential.interface";
import { ExportPage } from "./components/export/ExportPage";
import { PinForm } from "./components/credential/PinForm";
import { CredentialForm } from "./components/credential/CredentialForm";
import SellsyClient from "./services/SellsyClient";

function App() {
  const [currentPage, setCurrentPage] = useState<JSX.Element>();
  const [status, setStatus] = useState<CredentialKeeperStatus>();
  const sellsyClient =  useMemo(() => new SellsyClient(),[])
  const credentialKeeper = useMemo(() => new CredentialKeeper(), []);

  const switchCurrentPage = () => {
    switch (status) {
      case CredentialKeeperStatus.Ready:
        setCurrentPage(<ExportPage credentialKeeper={credentialKeeper} sellsyClient={sellsyClient} />);
        break;
      case CredentialKeeperStatus.RequirePin:
        setCurrentPage(<PinForm credentialKeeper={credentialKeeper} />);
        break;
      default:
        setCurrentPage(<CredentialForm credentialKeeper={credentialKeeper} />);
        break;
    }
  };

  credentialKeeper.setOnStatusChangeCallback((newStatus) => {
    setStatus(newStatus);
  });

  useEffect(() => {
    switchCurrentPage();
  }, [status]);

  return (
    <>
      <Header></Header>
      {currentPage}
    </>
  );
}

export default App;
