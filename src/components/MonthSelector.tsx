import { useEffect, useState } from "react";

type MonthSelectorProps = {
  setDates: Function;
  selectedDates?: {
    start: Date;
    end: Date;
  };
};

const MonthSelector = ({ setDates, selectedDates }: MonthSelectorProps) => {
  const [months, setMonths] = useState<{ [key: number]: string }>({});
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const getFirstAndLastDays = (month: number) => {
    const firstDay = new Date(selectedYear, month, 1);
    const lastDay = new Date(
      selectedYear,
      month + (month === currentMonth && selectedYear === currentYear ? 0 : 1),
      month === currentMonth && selectedYear === currentYear
        ? today.getDate()
        : 0
    );
    return { start: firstDay, end: lastDay };
  };

  const isSelected = (month: number) => {
    if (!selectedDates) return false;

    const { start, end } = getFirstAndLastDays(month);

    const areStartTimesEqual =
      selectedDates.start.getDate() === start.getDate() &&
      selectedDates.start.getMonth() === start.getMonth() &&
      selectedDates.start.getFullYear() === selectedYear;

    const areEndTimesEqual =
      selectedDates.end.getDate() === end.getDate() &&
      selectedDates.end.getMonth() === end.getMonth() &&
      selectedDates.end.getFullYear() === selectedYear;

    return areStartTimesEqual && areEndTimesEqual;
  };

  useEffect(() => {
    const availableMonths: Record<string, string> = {};
    for (
      let i = 0;
      i < (currentYear === selectedYear ? currentMonth + 1 : 12);
      i++
    ) {
      availableMonths[i] = monthNames[i];
    }
    setMonths(availableMonths);
  }, [selectedYear]); // Update months when the selected year changes

  const handlePrevYear = () => {
    console.log(selectedYear, currentYear);

    if (selectedYear > 2013) {
      console.log(selectedYear - 1);

      setSelectedYear(selectedYear - 1);
    }
  };

  const handleNextYear = () => {
    if (selectedYear < currentYear) {
      setSelectedYear(selectedYear + 1);
    }
  };

  return (
    <div className="flex flex-row items-center">
      <div
        onClick={handlePrevYear}
        className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-200 cursor:pointer"
      >
        <i className="fa-solid fa-chevron-left"></i>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 px-2">
        {Object.entries(months).map(([monthIndex, monthName]) => (
          <button
            type="button"
            key={monthIndex}
            onClick={() => setDates(getFirstAndLastDays(Number(monthIndex)))}
            className={`rounded px-4 py-2 hover:bg-sky-200 border border-gray-300 rounded ${
              isSelected(Number(monthIndex))
                ? "bg-cyan-600 text-white"
                : "bg-sky-50 text-black"
            }`}
          >
            {monthName} {selectedYear}
          </button>
        ))}
      </div>

      <div
        onClick={handleNextYear}
        className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-200 cursor:pointer"
      >
        <i className="fa-solid fa-chevron-right"></i>
      </div>
    </div>
  );
};

export default MonthSelector;
