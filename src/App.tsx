import { useState } from "react";
import ExportForm from "./components/ExportForm";
import ExportRecap from "./components/ExportRecap";
import Header from "./components/Header";
import { ExportInformations } from "./interfaces/export.interface";
import ExportArchives from "./components/ExportArchives";

function App() {
  const [exportInformations, setExportInformations] =
    useState<ExportInformations>();

  return (
    <>
      <Header></Header>
      <main className="mx-auto p-4 bg-white rounded-lg relative flex justify-center items-start select-none space-x-4 px-">
        <ExportArchives></ExportArchives>
        {exportInformations ? (
          <ExportRecap
            exportInformations={exportInformations}
            setExportInputs={setExportInformations}
          />
        ) : (
          <ExportForm setExportInputs={setExportInformations} />
        )}
        <div className="w-1/5"
        ></div>
      </main>
    </>
  );
}

export default App;
