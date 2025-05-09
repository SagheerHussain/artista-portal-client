import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Listbox } from "@headlessui/react";
import { useSelector } from "react-redux";

import {
  getMonthlyExpenseData,
  getMonthlySalaryData,
  getMonthlySalesData,
  getYearlyExpenseData,
  getYearlySalaryData,
  getYearlySalesData,
} from "../../../services/analyticsService";

const options = [
  { label: "Monthly Sales", key: "monthlySales" },
  { label: "Yearly Sales", key: "yearlySales" },
  { label: "Monthly Salary", key: "monthlySalary" },
  { label: "Yearly Salary", key: "yearlySalary" },
  { label: "Monthly Expense", key: "monthlyExpense" },
  { label: "Yearly Expense", key: "yearlyExpense" },
  { label: "Monthly Tax", key: "monthlyTax" },
  { label: "Yearly Tax", key: "yearlyTax" },
];

const MultiBarChart = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const { tax } = useSelector((state) => state.analytics);

  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [monthlySalaryData, setMonthlySalaryData] = useState([]);
  const [monthlyExpenseData, setMonthlyExpenseData] = useState([]);
  const [yearlySalaryData, setYearlySalaryData] = useState([]);
  const [yearlySalesData, setYearlySalesData] = useState([]);
  const [yearlyExpenseData, setYearlyExpenseData] = useState([]);

  // Tax Data from Redux
  const monthlyTaxData =
    tax?.data?.currentYear?.monthlyBreakdown?.map((item) => ({
      name: item.month,
      value: parseFloat(item.totalPercentage),
    })) || [];

  const yearlyTaxData =
    tax?.data?.yearlyAverageTax?.map((item) => ({
      name: `${item.year}`,
      value: parseFloat(item.averageTax),
    })) || [];

  // Fetch & Transform Data (except tax, which is from Redux)
  const fetchingData = async () => {
    try {
      const monthlySales = await getMonthlySalesData();
      const monthlySalaries = await getMonthlySalaryData();
      const monthlyExpenses = await getMonthlyExpenseData(token);
      const yearlySalaries = await getYearlySalaryData();
      const yearlySales = await getYearlySalesData();
      const yearlyExpenses = await getYearlyExpenseData(token);

      setMonthlySalesData(
        monthlySales.data.map((item) => ({
          name: item.month,
          value: item.totalReceived,
        }))
      );

      setYearlySalesData(
        yearlySales.data.map((item) => ({
          name: item.year,
          value: item.totalReceived,
        }))
      );

      setMonthlySalaryData(
        monthlySalaries.data.map((item) => ({
          name: item.month,
          value: item.totalSalaries,
        }))
      );

      setYearlySalaryData(
        yearlySalaries.data.map((item) => ({
          name: item.year,
          value: item.totalSalaries,
        }))
      );

      setMonthlyExpenseData(
        monthlyExpenses.data.map((item) => ({
          name: item.month,
          value: item.totalExpenses,
        }))
      );

      setYearlyExpenseData(
        yearlyExpenses.data.map((item) => ({
          name: item.year,
          value: item.totalExpenses,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchingData();
  }, []);

  const getData = () => {
    switch (selectedOption.key) {
      case "monthlySales":
        return monthlySalesData;
      case "yearlySales":
        return yearlySalesData;
      case "monthlySalary":
        return monthlySalaryData;
      case "yearlySalary":
        return yearlySalaryData;
      case "monthlyExpense":
        return monthlyExpenseData;
      case "yearlyExpense":
        return yearlyExpenseData;
      case "monthlyTax":
        return monthlyTaxData;
      case "yearlyTax":
        return yearlyTaxData;
      default:
        return monthlySalesData;
    }
  };

  return (
    <div className="w-full rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <Listbox value={selectedOption} onChange={setSelectedOption}>
          <div className="relative">
            <Listbox.Button className="bg-zinc-900 px-4 py-2 rounded-lg shadow text-white">
              {selectedOption.label}
            </Listbox.Button>
            <Listbox.Options className="absolute mt-2 bg-zinc-900 shadow rounded-lg z-10">
              {options.map((option) => (
                <Listbox.Option
                  key={option.key}
                  value={option}
                  className="cursor-pointer px-4 py-2 hover:bg-zinc-700 text-white"
                >
                  {option.label}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={getData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value) =>
                selectedOption.key.includes("Tax")
                  ? [`${value.toFixed(2)}%`, "Tax"]
                  : [`${value.toLocaleString()} PKR`, "Amount"]
              }
              contentStyle={{
                backgroundColor: "#1F2937",
                borderRadius: "8px",
                border: "none",
                color: "#fff",
              }}
              itemStyle={{ color: "#4FA0FF" }}
              labelStyle={{ color: "#C96FFE " }}
              cursor={{ fill: "#212121" }}
            />
            <Legend />
            <Bar dataKey="value" fill={"#C96FFE"} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MultiBarChart;
