import { useEffect, useMemo, useState } from "react";
import Header from "./components/reusable/Header";
import CredentialKeeper from "./services/CredentialKeeper";
import { CredentialKeeperStatus } from "./interfaces/credential.interface";
import { ExportPage } from "./components/export/ExportPage";
import { PinForm } from "./components/credential/PinForm";
import { CredentialForm } from "./components/credential/CredentialForm";

function App() {
  const credentialKeeper = useMemo(() => new CredentialKeeper(), []);
  const [currentPage, setCurrentPage] = useState<JSX.Element>();
  const [status, setStatus] = useState<CredentialKeeperStatus>();  

  const switchCurrentPage = () => {
    switch (status) {
      case CredentialKeeperStatus.ready:
        setCurrentPage(<ExportPage credentialKeeper={credentialKeeper} />);
        break;
      case CredentialKeeperStatus.requirePin:
        setCurrentPage(<PinForm credentialKeeper={credentialKeeper}></PinForm>);
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
