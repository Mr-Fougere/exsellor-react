import { useEffect, useRef, useState } from "react";
import ExportArchivist from "../../services/ExportArchivist";
import { ExportInformations } from "../../interfaces/export.interface";
import { DocumentType } from "../../interfaces/enum";

type ExportArchivesProps = {
  exportInformations: ExportInformations | undefined;
};

const ExportArchives = ({ exportInformations }: ExportArchivesProps) => {
  const exportArchivist = useRef<ExportArchivist>(new ExportArchivist());
  const [availableArchives, setAvailableArchives] = useState<string[]>([]);

  useEffect(() => {
    const loadArchives = () => {
      const archives = exportArchivist.current.availableArchives;
      setAvailableArchives(archives);
    };

    loadArchives();
  }, [exportInformations, exportArchivist]);

  const parseArchiveInformations = (
    archiveName: string
  ): ExportInformations => {
    const [name, _extension] = archiveName.split(".");
    const [_sellsy, documentType, startDate, endDate] = name.split("_");

    return {
      documentType: documentType as DocumentType,
      periodStartInputDate: startDate,
      periodEndInputDate: endDate,
      periodEndDate: new Date(endDate),
      periodStartDate: new Date(startDate)
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
                  href={exportArchivist.current.archiveUrl(archive)}
                  download={archive}
                >
                  <i className="fa-solid fa-file-arrow-down text-3xl hover:text-gray-500"></i>
                </a>
                <div className="flex flex-col w-max">
                  <div className="font-bold">{exportInformations.documentType}</div>
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
    </div>
  );
};

export default ExportArchives;
