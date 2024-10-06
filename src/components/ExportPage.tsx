import ExportArchives from "./ExportArchives";
import ExportRecap from "./ExportRecap";
import ExportForm from "./ExportForm";
import { ExportInformations } from "../interfaces/export.interface";
import CredentialKeeper from "../services/CredentialKeeper";
import { useEffect, useRef, useState } from "react";
import SellsyClient from "../services/SellsyClient";

type Props = {
  credentialKeeper: CredentialKeeper;
};

export const ExportPage = ({
  credentialKeeper,
}: Props) => {
  const [exportInformations, setExportInformations] =
    useState<ExportInformations>();
  const sellsyClient = useRef<SellsyClient>(new SellsyClient());

  useEffect(() => {
    credentialKeeper.decryptedCredentials().then((credentials) => {
      sellsyClient.current.setup(credentials);
    });
  }, []);

  return (
    <main className="mx-auto p-4 flex justify-center items-start select-none space-x-4">
      <ExportArchives></ExportArchives>
      {exportInformations ? (
        <ExportRecap
          sellsyClient={sellsyClient}
          exportInformations={exportInformations}
          setExportInputs={setExportInformations}
        />
      ) : (
        <ExportForm
          setExportInputs={setExportInformations}
          sellsyClient={sellsyClient}
        />
      )}
      <div className="w-1/5"></div>
    </main>
  );
};
