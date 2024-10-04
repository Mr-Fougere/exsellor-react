import { useState } from "react";
import ExportForm from "./components/ExportForm";
import ExportRecap from "./components/ExportRecap";
import Header from "./components/Header";
import { ExportInputs } from "./interfaces/export.interface";

function App() {
  const [exportInputs, setExportInputs] = useState<ExportInputs>();

  return (
    <>
      <Header></Header>
      <main className="max-w-xl mx-auto p-4 bg-white rounded-lg relative flex justify-center items-center select-none">
        {exportInputs ? (
          <ExportRecap
            exportInputs={exportInputs}
            setExportInputs={setExportInputs}
          />
        ) : (
          <ExportForm setExportInputs={setExportInputs} />
        )}
      </main>
    </>
  );
}

export default App;
