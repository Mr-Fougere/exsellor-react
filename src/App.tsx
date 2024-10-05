import { useEffect, useState } from "react";
import Header from "./components/Header";
import { ExportInformations } from "./interfaces/export.interface";
import CredentialKeeper from "./services/CredentialKeeper";
import { CredentialForm } from "./components/CredentialForm";
import { CredentialKeeperStatus } from "./interfaces/credential.interface";
import { ExportPage } from "./components/ExportPage";
import { PinForm } from "./components/PinForm";

function App() {
  const credentialKeeper = new CredentialKeeper();

  const [exportInformations, setExportInformations] =
    useState<ExportInformations>();
  const [currentPage, setCurrentPage] = useState<JSX.Element>();

  const switchCurrentPage = () => {
    switch (credentialKeeper.status) {
      case CredentialKeeperStatus.ready:
        return (
          <ExportPage
            setExportInformations={setExportInformations}
            exportInformations={exportInformations}
          />
        );
      case CredentialKeeperStatus.waitingPin:
        return <PinForm credentialKeeper={credentialKeeper}></PinForm>;
      default:
        return <CredentialForm credentialKeeper={credentialKeeper} />;
    }
  };

  useEffect(() => {
    credentialKeeper.fetchCredentials().then(() => {
      setCurrentPage(switchCurrentPage());
    });
  }, []);

  return (
    <>
      <Header></Header>
      {currentPage}
    </>
  );
}

export default App;
