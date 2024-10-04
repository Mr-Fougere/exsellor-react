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
      <main className="max-w-3xl mx-auto p-4 bg-white rounded-lg relative flex justify-center items-center select-none">
        <ExportArchives></ExportArchives>
        {exportInformations ? (
          <ExportRecap
            exportInformations={exportInformations}
            setExportInputs={setExportInformations}
          />
        ) : (
          <ExportForm setExportInputs={setExportInformations} />
        )}
      </main>
    </>
  );
}

export default App;
