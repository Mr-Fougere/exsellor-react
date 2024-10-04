import { useForm } from "react-hook-form";
import {
  DocType,
  ExportEstimation,
  ExportInputs,
} from "../interfaces/export.interface";
import DateFormatter from "../libs/DateFormatter";
import { useState } from "react";
import SellsyClient from "../services/sellsy";

type ExportFormProps = {
  setExportInputs: Function;
};

const ExportForm = ({ setExportInputs }: ExportFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExportInputs>();

  const sellsy = new SellsyClient();

  const [estimating, setEstimating] = useState<boolean>(false);

  const dateFormatter = DateFormatter;

  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth());
  const formattedFirstDay = dateFormatter.formatInputDate(firstDayOfMonth);
  const formattedToday = dateFormatter.formatInputDate(today);

  const onSubmit = async (data: ExportInputs) => {
    const formattedData: ExportInputs = {
      ...data,
      periodStartDate: new Date(data.periodStartDate),
      periodEndDate: new Date(data.periodEndDate),
    };

    setEstimating(true);
    await estimateExport(formattedData)
      .then((estimation) => {
        formattedData.estimatedTime = estimation.estimatedTime;
        formattedData.docCount = estimation.docCount;
        setExportInputs(formattedData);
        setEstimating(false);
      })
      .catch((error) => {
        setEstimating(false);
        console.error(error);
      });
  };

  const estimateExport = (data: ExportInputs): Promise<ExportEstimation> => {
    return new Promise((resolve, reject) => {
      sellsy
        .getDocumentsInfos(data)
        .then((infos) => {
          const docCount = infos.nbtotal;
          resolve({ docCount, estimatedTime: docCount * 2 });
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 w-full">
      <div>
        <label
          htmlFor="choix"
          className="block text-sm font-medium text-gray-700"
        >
          Choisissez un type de document
        </label>
        <select
          id="choix"
          {...register("docType", { required: "Ce champ est requis" })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {Object.entries(DocType).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
        {errors.docType && (
          <span className="text-red-500 text-sm">{errors.docType.message}</span>
        )}
      </div>

      <div>
        <label
          htmlFor="start-date"
          className="block text-sm font-medium text-gray-700"
        >
          Sélectionnez une date de début
        </label>
        <input
          defaultValue={formattedFirstDay}
          type="date"
          id="start-date"
          {...register("periodStartDate", { required: "Ce champ est requis" })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.periodStartDate && (
          <span className="text-red-500 text-sm">
            {errors.periodStartDate.message}
          </span>
        )}
      </div>

      <div>
        <label
          htmlFor="end-date"
          className="block text-sm font-medium text-gray-700"
        >
          Sélectionnez une date de fin
        </label>
        <input
          max={formattedToday}
          defaultValue={formattedToday} //
          type="date"
          id="end-date"
          {...register("periodEndDate", { required: "Ce champ est requis" })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.periodEndDate && (
          <span className="text-red-500 text-sm">
            {errors.periodEndDate.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {estimating && <i className="fa-solid fa-spinner fa-spin mr-2"></i>}
        <span>{estimating ? "Lancement de l'export" : "Lancer l'export"}</span>
      </button>
    </form>
  );
};

export default ExportForm;
