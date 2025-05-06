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

      console.log("Profit", item.totalReceived);

      // 🔥 Get correct monthly tax percentage
      const taxInfo = tax?.data?.currentYear?.monthlyBreakdown.find(
        (t) => t.month === item.month
      );

      const taxPercent = taxInfo
        ? parseFloat(taxInfo.totalPercentage.replace("%", ""))
        : 0;

      const taxAmount = item.totalReceived * (taxPercent / 100);
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

      const taxAmount = item.totalReceived * (averageTaxPercent / 100);
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
  // Added By Sagheer
  const currentMonthName = new Date().toLocaleString("default", {
    month: "long",
  });
  const currentYear = new Date().getFullYear().toString();

  const currentData =
    viewType === "Monthly View"
      ? getMonthlyData().find((item) => item.name === currentMonthName)
      : getYearlyData().find((item) => item.name === currentYear);

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
            <Bar dataKey="recieved" fill="#C96FFE" radius={[8, 8, 0, 0]} />
            <Bar dataKey="expense" fill="#ef9b20" radius={[8, 8, 0, 0]} />
            <Bar dataKey="salary" fill="#00bfa0" radius={[8, 8, 0, 0]} />
            <Bar dataKey="totalExpense" fill="#b30000" radius={[8, 8, 0, 0]} />
            <Bar dataKey="tax" fill="#fd7f6f" radius={[8, 8, 0, 0]} />
            <Bar dataKey="taxPercent" fill="#fd7f6f" radius={[8, 8, 0, 0]} />
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
      {/* Added By Sagheer */}
      <div className="mt-4 text-sm text-gray-500 flex flex-wrap gap-4 justify-between">
        {[
          { label: "Received", color: "#C96FFE", value: currentData?.recieved },
          { label: "Expense", color: "#ef9b20", value: currentData?.expense },
          { label: "Salary", color: "#00bfa0", value: currentData?.salary },
          {
            label: "Total Expense",
            color: "#b30000",
            value: currentData?.totalExpense,
          },
          { label: "Tax", color: "#fd7f6f", value: currentData?.tax },
          { label: "Profit", color: "#108900", value: currentData?.profit },
        ].map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 min-w-[45%] sm:min-w-[30%] md:min-w-[18%]"
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
            <span>{item.label}</span>
            <span>{Math.round(item.value || 0).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfitLossChart;
