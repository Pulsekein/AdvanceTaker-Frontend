import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

function Card({ name, date, amount, id }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/details/${id}`);
  };

  return (
    <div className="card">
      <div className="card-header">
         <h3>📅 {formatDate(date)}</h3>
      </div>
      <div className="card-body">
        <p className="card-date"> {name}</p>
        <p className="card-amount"> ₹{amount}</p>
      </div>
      <div className="card-footer">
        <button className="card-button" onClick={handleClick}>
          View Details
        </button>
      </div>
    </div>
  );
}

const formatDate = (dateString) => {
  const dateObj = new Date(dateString);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString("default", { month: "long" });
  const year = dateObj.getFullYear();
  return `${day} ${month} ${year}`;
};


export default Card;
