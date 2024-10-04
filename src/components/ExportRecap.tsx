import { useEffect, useState } from "react";
import { DocType, ExportInputs } from "../interfaces/export.interface";
import DateFormatter from "../libs/DateFormatter";
import CSVGenerator from "../services/CSVGenerator";
import changeFavicon from "../libs/Helpers";

type ExportRecapProps = {
  exportInputs: ExportInputs;
  setExportInputs: Function;
};

const ExportRecap = ({ exportInputs, setExportInputs }: ExportRecapProps) => {
  const [currentExport, setCurrentExport] = useState<Promise<void>>();
  const [exporting, setExporting] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number | null>(null);

  console.log(exportInputs);

  const csvGenerator = new CSVGenerator();
  const dateFormatter = DateFormatter;

  const handleCancel = () => {
    setCurrentExport(undefined);
    setExportInputs(null);
    document.title = "Exsellor"
    changeFavicon("/favicon.ico");
  };

  const docType = () => {
    return Object.entries(DocType).map(([key, value]) => {
      if (key === exportInputs.docType) {
        return value;
      }
    });
  };

  currentExport
    ?.then(() => {
      document.title = "Export terminé";
      changeFavicon("/done.png");
      if (startTime) {
        const endTime = new Date();
        const timeDiff = Math.abs(endTime.getTime() - startTime.getTime());
        const diffSeconds = Math.floor(timeDiff / 1000); // En secondes

        setElapsedTime(diffSeconds);
      }
    })
    .finally(() => {
      setExporting(false);
    });

  useEffect(() => {
    document.title = "Export en cours ...";
    changeFavicon("/progress.png");
    setExporting(true);
    setStartTime(new Date()); // Enregistrer le moment de début
    setCurrentExport(csvGenerator.generateCSV(exportInputs));
  }, []);

  return (
    <div className="recap-container space-y-2 w-full">
      <div className="flex p-2 bg-green-100 items-center rounded text-xs w-full">
        <i className="fa-solid fa-circle-info mr-2 text-sm"></i>
        Pas besoin de rester sur la page le temps de l'export
        <i className="fa-solid fa-thumbs-up ml-2"></i>
      </div>
      <div className="flex justify-between bg-gray-100 p-2 rounded w-full">
        Type de document
        <span className="ml-1 font-bold">{docType()}</span>
      </div>
      <div className="flex justify-between bg-gray-100 p-2 rounded w-full">
        Date de début
        <span className="font-bold">
          {dateFormatter.formatDispayedDate(exportInputs.periodStartDate)}
        </span>
      </div>
      <div className="flex justify-between bg-gray-100 p-2 rounded w-full">
        Date de fin
        <span className="font-bold">
          {dateFormatter.formatDispayedDate(exportInputs.periodEndDate)}
        </span>
      </div>

      {elapsedTime ? (
        <div className="flex justify-between bg-gray-100 p-2 rounded w-full">
          Durée export
          <span className="font-bold">
            {dateFormatter.formatDisplayedTime(elapsedTime)}
          </span>
        </div>
      ) : (
        <div className="flex justify-between bg-gray-100 p-2 rounded w-full">
          Temps estimé
          <span className="font-bold">
            {dateFormatter.formatDisplayedTime(exportInputs.estimatedTime || 0)}
          </span>
        </div>
      )}

      <div className="flex justify-between bg-gray-100 p-2 rounded w-full">
        Début export{" "}
        <span className="font-bold">
          {new Date().toLocaleTimeString("fr-FR")}
        </span>
      </div>

      {exporting ? (
        <div className="flex flex-row justify-between items-center">
          <div className="text-center ml-4">
            <i className="fa-solid fa-spinner fa-spin mr-1"></i>
            Export en cours
          </div>
          <button
            onClick={handleCancel}
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Annuler l'export
          </button>
        </div>
      ) : (
        <div className="flex flex-row justify-between items-center">
          <div className="text-center ml-4">
            <i className="fa-solid fa-circle-check mr-1"></i>
            Export terminé
          </div>
          <button
            onClick={handleCancel}
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Faire un autre export
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportRecap;
