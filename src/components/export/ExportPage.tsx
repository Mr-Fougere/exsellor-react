import ExportArchives from "./ExportArchives";
import ExportForm from "./ExportForm";
import { ExportInformations } from "../../interfaces/export.interface";
import CredentialKeeper from "../../services/CredentialKeeper";
import { useEffect, useState } from "react";
import SellsyClient from "../../services/SellsyClient";
import ExportRecap from "./ExportRecap";
import { PeriodDates } from "../../interfaces/sellsy.interface";

type Props = {
  credentialKeeper: CredentialKeeper;
  sellsyClient: SellsyClient
};

export const ExportPage = ({ credentialKeeper, sellsyClient}: Props) => {
  const [exportInformations, setExportInformations] =
    useState<ExportInformations>();
  const [docTypePeriodDates, setDocTypePeriodDates] = useState<{
    [key: string]: PeriodDates;
  }>();

  useEffect(() => {
    credentialKeeper.decryptedCredentials().then((credentials) => {
      sellsyClient.setup(credentials);
      sellsyClient.getAllDocTypesPeriodDates().then((periodDates) => {
        setDocTypePeriodDates(periodDates);
      });
    });
  }, []);

  return (
    <main className="mx-auto p-4 flex justify-center items-start select-none space-x-4">
      {docTypePeriodDates ? (
        <>
          <ExportArchives
            exportInformations={exportInformations}
          ></ExportArchives>
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
          <div className="w-1/5"></div>
        </>
      ) : (
        <div><i className="fa-solid fa-spinner fa-spin mr-2"></i>Chargement ...</div>
      )}
    </main>
  );
};
