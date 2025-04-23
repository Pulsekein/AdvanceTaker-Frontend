import React, { useEffect, useState } from "react";
import "./style.css";

function History() {
  const [historyData, setHistoryData] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("https://tight-adorne-pulsekein-43f4bedf.koyeb.app/history");
        const data = await response.json();
        setHistoryData(data);
      } catch (error) {
        console.error("Error fetching history data:", error);
      }
    };

    fetchHistory();
  }, []);

  if (!historyData) {
    return <div className="loading">Loading history...</div>;
  }

  return (
    <div className="history-container">
      <h2>Transaction History</h2>
      
      <div className="yearly-history">
        <h3>Yearly Totals</h3>
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Total Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {historyData.yearlyTotals.map((yearData, index) => (
              <tr key={index}>
                <td>{yearData._id}</td>
                <td>₹{yearData.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="monthly-history">
        <h3>Monthly Totals for {new Date().getFullYear()}</h3>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Total Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {historyData.monthlyTotals.map((monthData, index) => (
              <tr key={index}>
                <td>{getMonthName(monthData._id)}</td>
                <td>₹{monthData.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


const getMonthName = (monthIndex) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[monthIndex - 1];
};

export default History;
