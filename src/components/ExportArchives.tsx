import { useEffect, useState } from "react";
import ExportArchivist from "../services/ExportArchivist";
import { ExportInformations } from "../interfaces/export.interface";
import { DocType } from "../interfaces/enum";

const ExportArchives = () => {
  const exportArchivist = new ExportArchivist();
  const [availableArchives, setAvailableArchives] = useState<string[]>([]);

  useEffect(() => {
    const loadArchives = () => {
      const archives = exportArchivist.availableArchives;
      setAvailableArchives(archives);
    };

    loadArchives();
  }, []);

  const handleClearArchives = () => {
    exportArchivist.clearArchives();
    setAvailableArchives([]);
  };

  const parseArchiveInformations = (
    archiveName: string
  ): ExportInformations => {
    const [name, _extension] = archiveName.split(".");
    const [_sellsy, docType, startDate, endDate] = name.split("_");

    return {
      docType: DocType[docType as keyof typeof DocType],
      periodStartInputDate: startDate,
      periodEndInputDate: endDate,
      periodEndDate: new Date(endDate),
      periodStartDate: new Date(startDate),
    };
  };

  return (
    <div className="w-1/5">
      <h1 className="block text-sm font-bold text-gray-700">Archives</h1>
      <ul className="space-y-2 mt-2">
        {availableArchives.length > 0 ? (
          availableArchives.map((archive, index) => {
            const exportInformations = parseArchiveInformations(archive);
            return (
              <li
                key={index}
                className="flex flex-row items-center bg-gray-100 p-2 rounded space-x-2 w-fit"
              >
                <a
                  href={exportArchivist.archiveUrl(archive)}
                  download={archive}
                >
                  <i className="fa-solid fa-file-arrow-down text-3xl hover:text-gray-500"></i>
                </a>
                <div className="flex flex-col w-max">
                  <div className="font-bold">{exportInformations.docType}</div>
                  <div className="font-italic">
                    <span>{exportInformations.periodStartInputDate} </span>
                    <i className="fa-solid fa-arrow-right"></i>
                    <span> {exportInformations.periodEndInputDate}</span>
                  </div>
                </div>
              </li>
            );
          })
        ) : (
          <li>Aucune archive disponible.</li>
        )}
      </ul>
      <button onClick={handleClearArchives}>Tout supprimer</button>
    </div>
  );
};

export default ExportArchives;
