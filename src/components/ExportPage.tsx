import ExportArchives from "./ExportArchives";
import ExportRecap from "./ExportRecap";
import ExportForm from "./ExportForm";
import { ExportInformations } from "../interfaces/export.interface";

type Props = {
  exportInformations: ExportInformations | undefined;
  setExportInformations: (exportInformations: ExportInformations) => void;
};

export const ExportPage = ({ exportInformations, setExportInformations }: Props) => {
  return (
    <main className="mx-auto p-4 flex justify-center items-start select-none space-x-4">
      <ExportArchives></ExportArchives>
      {exportInformations ? (
        <ExportRecap
          exportInformations={exportInformations}
          setExportInputs={setExportInformations}
        />
      ) : (
        <ExportForm setExportInputs={setExportInformations} />
      )}
      <div className="w-1/5"></div>
    </main>
  );
};
