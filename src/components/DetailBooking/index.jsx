import React, { useEffect, useState } from "react";
import "./style.css";
import { useParams, useNavigate } from "react-router-dom";

function Details() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`https://tight-adorne-pulsekein-43f4bedf.koyeb.app/booking/${id}`);
        const data = await response.json();
        setBooking(data);
      } catch (error) {
        console.error("Error fetching booking:", error);
      }
    };

    fetchBooking();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBooking({ ...booking, [name]: value });
  };

  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...booking.item];
    updatedItems[index][name] = value;
    setBooking({ ...booking, item: updatedItems });
  };

  const handleUpdate = async () => {
    const updatedBookingData = {
      ...booking,
      paidAmount: Number(booking.paidAmount),
      totalAmount: Number(booking.totalAmount),
      item: booking.item.map(item => ({
        ...item,
        weight: Number(item.weight),
        amount: Number(item.amount)
      }))
    };

    try {
      const response = await fetch(`https://tight-adorne-pulsekein-43f4bedf.koyeb.app/booking/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBookingData),
      });

      if (response.ok) {
        const result = await response.json();
        setBooking(result.data);
        alert("Booking updated successfully!");
        setEditMode(false);
        window.location.reload();
      } else {
        alert("Failed to update the booking.");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Error updating booking");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this booking?");
    if (!confirmed) return;

    try {
      const response = await fetch(`https://tight-adorne-pulsekein-43f4bedf.koyeb.app/booking/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Booking deleted successfully!");
        navigate("/");
      } else {
        alert("Failed to delete the booking.");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Error deleting booking");
    }
  };

  const markAsComplete = async () => {
    try {
      const response = await fetch(`https://tight-adorne-pulsekein-43f4bedf.koyeb.app/completeBooking/${id}`);
      if (response.ok) {
        alert("Booking marked as complete!");
        window.location.reload();
      } else {
        alert("Failed to complete the booking.");
      }
    } catch (error) {
      console.error("Error completing booking:", error);
      alert("Error completing booking.");
    }
  };

  if (!booking) {
    return <div className="loading">Loading booking details...</div>;
  }

  return (
    <div className="details-container">
      <h2 className="details-title">Booking Details</h2>

      <p><strong>Date:</strong> {formatDate(booking.date)}</p>

      <p>
        <strong>नाम:</strong>{" "}
        {editMode ? (
          <input type="text" name="name" value={booking.name} onChange={handleChange} />
        ) : (
          booking.name
        )}
      </p>

      <p>
        <strong>Contact:</strong>{" "}
        {editMode ? (
          <input type="text" name="contact" value={booking.contact} onChange={handleChange} />
        ) : (
          booking.contact
        )}
      </p>

      <h3>समान:</h3>
      <table className="items-table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Weight (kg)</th>
            <th>Amount per Kg (₹)</th>
            <th>Total (₹)</th>
          </tr>
        </thead>
        <tbody>
          {booking.item.map((item, index) => (
            <tr key={index}>
              <td>
                {editMode ? (
                  <input
                    type="text"
                    name="name"
                    value={item.name}
                    onChange={(e) => handleItemChange(e, index)}
                  />
                ) : (
                  item.name
                )}
              </td>
              <td>
                {editMode ? (
                  <input
                    type="number"
                    name="weight"
                    value={item.weight}
                    onChange={(e) => handleItemChange(e, index)}
                  />
                ) : (
                  item.weight
                )}
              </td>
              <td>
                {editMode ? (
                  <input
                    type="number"
                    name="amount"
                    value={item.amount}
                    onChange={(e) => handleItemChange(e, index)}
                  />
                ) : (
                  `₹${item.amount}`
                )}
              </td>
              <td>₹{item.weight * item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        <strong>Total Amount:</strong>{" "}
        {editMode ? (
          <input
            type="number"
            name="totalAmount"
            value={booking.totalAmount}
            onChange={handleChange}
          />
        ) : (
          `₹${booking.totalAmount}`
        )}
      </p>

      <p>
        <strong>जमा राशी :</strong>{" "}
        {editMode ? (
          <input
            type="number"
            name="paidAmount"
            value={booking.paidAmount}
            onChange={handleChange}
          />
        ) : (
          `₹${booking.paidAmount}`
        )}
      </p>

      <p>
        <strong>बाकी राशी:</strong> ₹{booking.totalAmount - booking.paidAmount}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        {booking.isComplete ? <span className="completed-label">✅ Completed</span> : "❌ Incomplete"}
      </p>

      <div className="buttons-container">
        {editMode ? (
          <>
            <button className="update-button" onClick={handleUpdate}>
              Save Changes
            </button>
            <button className="cancel-button" onClick={() => setEditMode(false)}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button className="update-button" onClick={() => setEditMode(true)}>
              Update Booking
            </button>
            <button className="delete-button" onClick={handleDelete}>
              Delete Booking
            </button>
          </>
        )}
        <button
          className="complete-button"
          onClick={markAsComplete}
          disabled={booking.isComplete}
        >
          {booking.isComplete ? "Completed" : "Mark as Complete"}
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

export default Details;
