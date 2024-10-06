import { useEffect, useMemo, useRef, useState } from "react";
import { ExportInformations } from "../../interfaces/export.interface";
import SellsyClient from "../../services/SellsyClient";
import CSVGenerator from "../../services/CSVGenerator";
import { updateTabInformation } from "../../libs/Helpers";
import { DocType } from "../../interfaces/enum";
import { InformationBanner } from "../reusable/InformationBanner";
import { RecapInformation } from "../reusable/RecapInformation";
import ProgressBar from "../reusable/ProgressBar";
import { formatDispayedDate, formatDisplayedTime } from "../../libs/DateFormatter";

type ExportRecapProps = {
  exportInformations: ExportInformations;
  setExportInputs: Function;
  sellsyClient: React.MutableRefObject<SellsyClient>;
};

const ExportRecap = ({
  exportInformations,
  setExportInputs,
  sellsyClient,
}: ExportRecapProps) => {
  const [exporting, setExporting] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const csvGenerator = useRef(new CSVGenerator(sellsyClient.current));

  const handleCancel = () => {
    csvGenerator.current.cancelExport();
    updateTabInformation("Exsellor", "./assets/favicon.ico");
    setExportInputs(null);
    clearInterval(intervalRef.current!);
  };

  const docType = () => {
    const entry = Object.entries(DocType).find(
      ([key]) => key === exportInformations.docType
    );
    return entry ? entry[1] : "";
  };

  useEffect(() => {
    if (!exportInformations) return;

    updateTabInformation("Export en cours ...", "./assets/progress.png");
    setExporting(true);

    const timeInterval = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);

    csvGenerator.current
      .generateCSV(exportInformations)
      .then(({ downloaded }) => {
        if (!downloaded) return;
        updateTabInformation("Export terminé", "./assets/done.png");
        clearInterval(intervalRef.current!);
        clearInterval(timeInterval);
        setExporting(false);
      });

    intervalRef.current = setInterval(() => {
      const currentProgress = csvGenerator.current.progress;
      setProgress(currentProgress * 100);
    }, 500);

    return () => {
      csvGenerator.current.cancelExport();
      clearInterval(intervalRef.current!);
      clearInterval(timeInterval);
    };
  }, [exportInformations]);

  const formattedElapsedTime = useMemo(() => {
    return formatDisplayedTime(elapsedTime);
  }, [elapsedTime]);

  const buttonStyle = () => {
    if (exporting) {
      return "px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500";
    }
    return "px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500";
  };

  return (
    <div className="space-y-2 w-2/5">
      <InformationBanner backgroundColor="green">
        Pas besoin de rester sur la page le temps de l'export
        <i className="fa-solid fa-thumbs-up ml-2"></i>
      </InformationBanner>

      <RecapInformation title="Type de document" value={docType()} />
      <RecapInformation
        title="Date de début"
        value={formatDispayedDate(
          exportInformations.periodStartDate
        )}
      />
      <RecapInformation
        title="Date de fin"
        value={formatDispayedDate(
          exportInformations.periodEndDate
        )}
      />
      <RecapInformation
        title="Temps estimé"
        value={formatDisplayedTime(
          exportInformations.estimatedTime || 0
        )}
      />
      <RecapInformation title="Temps passé" value={formattedElapsedTime} />
      <ProgressBar progress={progress} />

      <div className="flex flex-row justify-between items-center">
        <div className="text-center ml-4">
          <i
            className={`fa-solid ${
              exporting ? "fa-spinner  fa-spin" : "fa-circle-check"
            } mr-1`}
          ></i>
          {exporting ? "Export en cours" : "Export terminé"}
        </div>
        <button onClick={handleCancel} type="button" className={buttonStyle()}>
          {exporting ? "Annuler l'export" : "Faire un autre export"}
        </button>
      </div>
    </div>
  );
};

export default ExportRecap;
