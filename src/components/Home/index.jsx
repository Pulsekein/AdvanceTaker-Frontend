import React, { useEffect, useState } from "react";
import "./style.css";
import Booking from "../Booking";
import Card from "../Card";

function Home() {
  const [bookings, setBookings] = useState([]);
  const [amount, setAmount] = useState({});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("https://tight-adorne-pulsekein-43f4bedf.koyeb.app/home");
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    const fetchAmount = async () => {
      try {
        const res = await fetch("https://tight-adorne-pulsekein-43f4bedf.koyeb.app/fetchAmount"); 
        const data = await res.json();
        setAmount(data);
      } catch (err) {
        console.error("Error fetching amounts:", err);
      }
    };

    fetchAmount();
  }, []);

  return (
    <div className="home-container">
      <h3 className="home-title">🍽 Baban Ji Khaja Dukan</h3>

      <div className="booking-section">
        <Booking />
      </div>

      <div className="cards-section">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <Card
              key={booking._id}
              id={booking._id}
              name={booking.name}
              date={booking.date}
              amount={booking.totalAmount}
            />
          ))
        ) : (
          <p className="loading">No bookings found in the last 20 days.</p>
        )}
      </div>

      <div className="total-earnings-container">
            <h3>Total Earning ₹</h3>
            <a href="/history">history</a>
            <p><strong>Week:</strong> <span className="earnings-value earnings-value-week">₹{amount.totalWeekMoney}</span></p>
            <p><strong>Month:</strong> <span className="earnings-value earnings-value-month">₹{amount.totalMonthMoney}</span></p>
            <p><strong>Year:</strong> <span className="earnings-value earnings-value-year">₹{amount.totalYearMoney}</span></p>
      </div>

    </div>
  );
}

export default Home;
