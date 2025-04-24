import React, { useState } from "react";
import "./style.css";

function Booking() {
  const [items, setItems] = useState([
    { name: "", weight: "", amountPerKg: "", total: 0 },
  ]);

  const [paidAmount, setPaidAmount] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [date, setDate] = useState("");

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    const weight = parseFloat(updatedItems[index].weight) || 0;
    const amountPerKg = parseFloat(updatedItems[index].amountPerKg) || 0;
    updatedItems[index].total = weight * amountPerKg;

    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { name: "", weight: "", amountPerKg: "", total: 0 }]);
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const getGrandTotal = () =>
    items.reduce((sum, item) => sum + (item.total || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const invalidItem = items.find(
      (item) =>
        !item.name.trim() ||
        item.weight === "" ||
        item.amountPerKg === ""
    );

    if (invalidItem) {
      alert("Please fill out all fields for each item before submitting.");
      return;
    }

    const data = {
      name,
      contact,
      date,
      item: items.map(({ name, weight, amountPerKg }) => ({
        name,
        weight,
        amount: amountPerKg,
      })),
      paidAmount,
      totalAmount: getGrandTotal().toFixed(2),
    };

    try {
      const response = await fetch("https://tight-adorne-pulsekein-43f4bedf.koyeb.app/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const resData = await response.json();
        alert("Booking successful!");
        console.log("Response:", resData);

        setName("");
        setContact("");
        setDate("");
        setPaidAmount("");
        setItems([{ name: "", weight: "", amountPerKg: "", total: 0 }]);
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert("Booking failed: " + errorData.message);
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="booking-container">
      <h2 className="booking-title">Advance Booking </h2>

      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>नाम:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Contact Details:</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>समान:</label>
          {items.map((item, index) => (
            <div className="item-entry" key={index}>
              <select
                value={item.name}
                onChange={(e) =>
                  handleItemChange(index, "name", e.target.value)
                }
                required
              >
                <option value="">Select Item</option>
                <option value="खाजा">खाजा</option>
                <option value="गाजा">गाजा</option>
                <option value="लड्डू">लड्डू
                </option>
                <option value="गटैरी">गटैरी</option>
                <option value="बुंदिया">बुंदिया</option>
                <option value="पियाओ">पियाओ</option>
                <option value="निम्की">निम्की
                </option>
                <option value="मठी">मठी</option>
                <option value="माठ">माठ</option>
              </select>

              <input
                type="number"
                placeholder="Weight (kg)"
                value={item.weight}
                onChange={(e) =>
                  handleItemChange(index, "weight", e.target.value)
                }
                required
              />
              <input
                type="number"
                placeholder="Rs per kg"
                value={item.amountPerKg}
                onChange={(e) =>
                  handleItemChange(index, "amountPerKg", e.target.value)
                }
                required
              />
              <span className="item-total">₹{item.total.toFixed(2)}</span>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="remove-btn"
                >
                  <i className="fas fa-trash"></i>
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addItem} className="add-btn">
            ➕ Add Item
          </button>
        </div>

        <div className="form-group">
          <label>जमा राशी :</label>
          <input
            type="number"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-group total-display">
          <strong>Total Amount: ₹{getGrandTotal().toFixed(2)}</strong>
        </div>

        <button type="submit" className="submit-btn">
          Book Now
        </button>
      </form>
    </div>
  );
}

export default Booking;
