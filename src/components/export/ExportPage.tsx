import ExportArchives from "./ExportArchives";
import ExportForm from "./ExportForm";
import { ExportInformations } from "../../interfaces/export.interface";
import CredentialKeeper from "../../services/CredentialKeeper";
import { useEffect, useRef, useState } from "react";
import SellsyClient from "../../services/SellsyClient";
import ExportRecap from "./ExportRecap";
import { PeriodDates } from "../../interfaces/sellsy.interface";

type Props = {
  credentialKeeper: CredentialKeeper;
};

export const ExportPage = ({ credentialKeeper }: Props) => {
  const [exportInformations, setExportInformations] =
    useState<ExportInformations>();
  const sellsyClient = useRef<SellsyClient>(new SellsyClient());
  const [docTypePeriodDates, setDocTypePeriodDates] = useState<{
    [key: string]: PeriodDates;
  }>();

  useEffect(() => {
    credentialKeeper.decryptedCredentials().then((credentials) => {
      sellsyClient.current.setup(credentials);
      sellsyClient.current.getAllDocTypesPeriodDates().then((periodDates) => {
        setDocTypePeriodDates(periodDates);
      });
    });
  }, []);

  return (
    <main className="mx-auto p-4 flex justify-center items-start select-none space-x-4">
      <ExportArchives exportInformations={exportInformations}></ExportArchives>
      {docTypePeriodDates ? (
        <>
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
              docTypePeriodDates={docTypePeriodDates}
            />
          )}
        </>
      ) : (
        <div>Chargement ...</div>
      )}
      <div className="w-1/5"></div>
    </main>
  );
};
