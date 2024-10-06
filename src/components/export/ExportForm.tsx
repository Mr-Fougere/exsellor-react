import { useForm } from "react-hook-form";
import {
  ExportEstimation,
  ExportInformations,
  ExportInputs,
} from "../../interfaces/export.interface";
import DateFormatter from "../../libs/DateFormatter";
import { useState } from "react";
import SellsyClient from "../../services/SellsyClient";
import DocTypeRadioGroup from "../reusable/DocTypeRadioGroup";
import MonthSelector from "../reusable/MonthSelector";

type ExportFormProps = {
  setExportInputs: Function;
  sellsyClient: React.MutableRefObject<SellsyClient>
};

const ExportForm = ({ setExportInputs, sellsyClient }: ExportFormProps) => {
  const { register, handleSubmit, setValue, watch } = useForm<ExportInputs>();

  const [estimating, setEstimating] = useState<boolean>(false);

  const dateFormatter = DateFormatter;
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth());
  const formattedFirstDay = dateFormatter.formatInputDate(firstDayOfMonth);
  const formattedToday = dateFormatter.formatInputDate(today);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(event.target.value);
    const endOfMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0
    );
    const firstOfMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1
    );

    if (
      selectedDate.getDate() === endOfMonth.getDate() &&
      event.target.id == "end-date"
    ) {
      setValue(
        "periodStartInputDate",
        dateFormatter.formatInputDate(firstOfMonth)
      );
    } else if (
      selectedDate.getDate() === 1 &&
      event.target.id == "start-date"
    ) {
      setValue("periodEndInputDate", dateFormatter.formatInputDate(endOfMonth));
    }
  };

  const onSubmit = async (data: ExportInputs) => {
    const formattedData: ExportInformations = {
      ...data,
      periodStartDate: new Date(data.periodStartInputDate),
      periodEndDate: new Date(data.periodEndInputDate),
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

  const estimateExport = (
    data: ExportInformations
  ): Promise<ExportEstimation> => {
    return new Promise((resolve, reject) => {
      sellsyClient.current
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

  const periodStartInputDate = watch("periodStartInputDate", formattedFirstDay);
  const periodEndInputDate = watch("periodEndInputDate", formattedToday);

  const setDates = ({ start, end }: { start: Date; end: Date }) => {
    setValue("periodStartInputDate", dateFormatter.formatInputDate(start));
    setValue("periodEndInputDate", dateFormatter.formatInputDate(end));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 w-2/5">
      <div>
        <label
          htmlFor="choix"
          className="block text-sm font-bold text-gray-700"
        >
          Choisissez un type de document
        </label>
        <DocTypeRadioGroup
          name="docType"
          id="doc-type"
          requiredMessage="required"
          register={register}
          watch={watch}
        ></DocTypeRadioGroup>
      </div>

      <div>
        <label
          htmlFor="choix"
          className="block text-sm font-bold text-gray-700"
        >
          Choisissez une période
        </label>
        <MonthSelector
          setDates={setDates}
          selectedDates={{
            start: new Date(periodStartInputDate),
            end: new Date(periodEndInputDate),
          }}
        />
      </div>

      <div className="flex flex-row space-x-2 px-4">
        <div className="flex-1">
          <label
            htmlFor="start-date"
            className="block text-sm font-medium text-gray-700"
          >
            Date de début
          </label>
          <input
            defaultValue={formattedFirstDay}
            type="date"
            id="start-date"
            {...register("periodStartInputDate", {
              required: "Ce champ est requis",
              onChange: handleDateChange,
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="end-date"
            className="block text-sm font-medium text-gray-700"
          >
            Date de fin
          </label>
          <input
            max={formattedToday}
            defaultValue={formattedToday}
            type="date"
            id="end-date"
            {...register("periodEndInputDate", {
              required: "Ce champ est requis",
              onChange: handleDateChange,
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={estimating}
        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4 "
      >
        {estimating && <i className="fa-solid fa-spinner fa-spin mr-2"></i>}
        <span>{estimating ? "Lancement de l'export" : "Lancer l'export"}</span>
      </button>
    </form>
  );
};

export default ExportForm;
