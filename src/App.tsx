import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import { ExportInformations } from "./interfaces/export.interface";
import CredentialKeeper from "./services/CredentialKeeper";
import { CredentialForm } from "./components/CredentialForm";
import { CredentialKeeperStatus } from "./interfaces/credential.interface";
import { ExportPage } from "./components/ExportPage";
import { PinForm } from "./components/PinForm";

function App() {
  const credentialKeeper = useMemo(() => new CredentialKeeper(), []);
  
  const [exportInformations, setExportInformations] =
    useState<ExportInformations>();
  const [currentPage, setCurrentPage] = useState<JSX.Element>();
  const [status, setStatus] = useState<CredentialKeeperStatus>();

  const switchCurrentPage = () => {
    switch (status) {
      case CredentialKeeperStatus.ready:
        setCurrentPage(
          <ExportPage
            setExportInformations={setExportInformations}
            exportInformations={exportInformations}
          />
        );
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
    credentialKeeper.fetchCredentials();
  }, []);

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
