import React, { useEffect, useState } from "react";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line,
  ComposedChart,
} from "recharts";
import { Listbox } from "@headlessui/react";
import {
  getMonthlyExpenseData,
  getMonthlySalaryData,
  getMonthlySalesData,
  getYearlyExpenseData,
  getYearlySalaryData,
  getYearlySalesData,
} from "../../../services/analyticsService";
import { useSelector } from "react-redux";

const YearlyOptions = ["2025"]; // You can dynamically generate this

const ProfitLossChart = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const { tax } = useSelector((state) => state.analytics);

  const [viewType, setViewType] = useState("Yearly View");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [monthlySalaryData, setMonthlySalaryData] = useState([]);
  const [monthlyExpenseData, setMonthlyExpenseData] = useState([]);
  const [yearlySalesData, setYearlySalesData] = useState([]);
  const [yearlySalaryData, setYearlySalaryData] = useState([]);
  const [yearlyExpenseData, setYearlyExpenseData] = useState([]);

  // Fetch Monthly Data
  const fetchingMonthlyData = async () => {
    try {
      const monthlySales = await getMonthlySalesData();
      const monthlySalaries = await getMonthlySalaryData();
      const monthlyExpenses = await getMonthlyExpenseData(token);
      setMonthlySalesData(monthlySales.data);
      setMonthlySalaryData(monthlySalaries.data);
      setMonthlyExpenseData(monthlyExpenses.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch Yearly Data
  const fetchingYearlyData = async () => {
    try {
      const yearlySales = await getYearlySalesData();
      const yearlySalaries = await getYearlySalaryData();
      const yearlyExpenses = await getYearlyExpenseData(token);
      setYearlySalesData(yearlySales.data);
      setYearlySalaryData(yearlySalaries.data);
      setYearlyExpenseData(yearlyExpenses.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchingMonthlyData();
    fetchingYearlyData();
  }, []);

  // Monthly Profit Calculation with Tax
  const getMonthlyData = () => {
    return monthlySalesData.map((item, index) => {
      const salary = monthlySalaryData[index]?.totalSalaries || 0;
      const expense = monthlyExpenseData[index]?.totalExpenses || 0;
      const totalExpense = salary + expense;
      const profit = item.totalReceived - totalExpense;
  
      // 🔥 Get correct monthly tax percentage
      const taxInfo = tax?.data?.currentYear?.monthlyBreakdown.find(
        (t) => t.month === item.month
      );
  
      const taxPercent = taxInfo
        ? parseFloat(taxInfo.totalPercentage.replace("%", ""))
        : 0;
  
      const taxAmount = profit * (taxPercent / 100);
      const netProfit = profit - taxAmount;
  
      return {
        name: item.month,
        recieved: item.totalReceived,
        expense,
        salary,
        totalExpense,
        profit: netProfit,
        tax: taxAmount,
        taxPercent: taxPercent,
      };
    });
  };

  // Yearly Profit Calculation with Year-Specific Tax
  const getYearlyData = () => {
    return yearlySalesData.map((item, index) => {
      const salary = yearlySalaryData[index]?.totalSalaries || 0;
      const expense = yearlyExpenseData[index]?.totalExpenses || 0;
      const totalExpense = salary + expense;
      const profit = item.totalReceived - salary - expense;

      const yearTax = tax?.data?.yearlyAverageTax?.find(
        (t) => parseInt(t.year) === parseInt(item.year)
      );
      const averageTaxPercent = yearTax
        ? parseFloat(yearTax.averageTax.replace("%", ""))
        : 0;

      const taxAmount = profit * (averageTaxPercent / 100);
      const netProfit = profit - taxAmount;

      return {
        name: item.year.toString(),
        recieved: item.totalReceived,
        expense,
        salary,
        totalExpense,
        profit: netProfit,
        tax: taxAmount,
        taxPercent: averageTaxPercent,
      };
    });
  };

  return (
    <div className="w-full rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Profit & Loss Overview</h2>

        <div className="flex gap-4">
          <Listbox value={viewType} onChange={setViewType}>
            <div className="relative">
              <Listbox.Button className="bg-zinc-900 px-4 py-2 rounded-lg shadow text-white">
                {viewType}
              </Listbox.Button>
              <Listbox.Options className="absolute mt-2 bg-zinc-900 shadow rounded-lg z-10 text-white">
                <Listbox.Option
                  value="Yearly View"
                  className="cursor-pointer px-4 py-2 hover:bg-zinc-700"
                >
                  Yearly View
                </Listbox.Option>
                <Listbox.Option
                  value="Monthly View"
                  className="cursor-pointer px-4 py-2 hover:bg-zinc-700"
                >
                  Monthly View
                </Listbox.Option>
              </Listbox.Options>
            </div>
          </Listbox>

          {viewType === "Monthly View" && (
            <Listbox value={selectedYear} onChange={setSelectedYear}>
              <div className="relative">
                <Listbox.Button className="bg-zinc-900 px-4 py-2 rounded-lg shadow text-white">
                  {selectedYear}
                </Listbox.Button>
                <Listbox.Options className="absolute mt-2 bg-zinc-900 shadow rounded-lg z-10 text-white">
                  {YearlyOptions.map((year) => (
                    <Listbox.Option
                      key={year}
                      value={year}
                      className="cursor-pointer px-4 py-2 hover:bg-zinc-700"
                    >
                      {year}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          )}
        </div>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={
              viewType === "Yearly View" ? getYearlyData() : getMonthlyData()
            }
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
               formatter={(value, name, props) => {
                if (name === "taxPercent") {
                  return [`${value.toFixed(2)}%`, name];
                } else {
                  return [`${value.toLocaleString()} PKR`, name];
                }
              }}
              contentStyle={{
                backgroundColor: "#1F2937",
                borderRadius: "8px",
                border: "none",
                color: "#fff",
              }}
              itemStyle={{ color: "#4FA0FF" }}
              labelStyle={{ color: "#C96FFE" }}
              cursor={{ fill: "#212121" }}
            />
            <Legend />
            <Bar dataKey="recieved" fill="#C96FFE" radius={[8, 8, 0, 0]} />
            <Bar dataKey="expense" fill="#4FA0FF" radius={[8, 8, 0, 0]} />
            <Bar dataKey="salary" fill="#4FA000" radius={[8, 8, 0, 0]} />
            <Bar dataKey="totalExpense" fill="#4FA099" radius={[8, 8, 0, 0]} />
            <Bar dataKey="tax" fill="#ff0000" radius={[8, 8, 0, 0]} />
            <Bar dataKey="taxPercent" fill="#F59E0B" radius={[8, 8, 0, 0]} />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#108900"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProfitLossChart;

