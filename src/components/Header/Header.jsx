import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { icons } from "../../assets/icons/icons";
import "./Header.css";
import Hambermenuoptions from "../Hambermenuoptions/Hambermenuoptions";
import { useTableNum } from "../context/TableNumContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Header({ onSearchChange, isMenu, isAddpage }) {
  const { tableNum } = useTableNum();
  const navigate = useNavigate();
  const [option, setOption] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [reservation, setReservation] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    persons: "",
  });

  const handleMenuoption = () => {
    setOption(true);
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleReservationChange = (e) => {
    const { name, value } = e.target;

    if (name === "date") {
      const selectedDate = new Date(value);
      if (selectedDate.getDay() === 3) { // 3 = Wednesday
        toast.error("Reservations are not allowed on Wednesdays.", { position: "top-right" });
        return;
      }
    }

    setReservation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormComplete = Object.values(reservation).every((value) => value.trim() !== "");

  const sendReservationData = async () => {
    try {
      const response = await fetch("https://server3-server3.gofastapi.com/reserveTable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservation),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("Reservation successful!", { position: "top-right" });
      } else {
        toast.error("Failed to reserve. Please try again.", { position: "top-right" });
      }
    } catch (error) {
      console.error("Error sending reservation:", error);
      toast.error("An error occurred. Please try again later.", { position: "top-right" });
    }
  };

  const handleReservationSubmit = () => {
    if (!isFormComplete) {
      toast.error("Please fill in all the details before submitting.", { position: "top-right" });
      return;
    }

    sendReservationData();
    setReservation({ name: "", phone: "", date: "", time: "", persons: "" });
    setIsFormVisible(false);
  };

  // Function to check if it's Wednesday
  const isWednesday = () => {
    const today = new Date();
    return today.getDay() === 3; // 3 = Wednesday
  };

  return (
    <>
      {option && <Hambermenuoptions setopt={setOption} />}

      <div className="header">
        <img
          src={icons.menuicon}
          alt="Menu"
          onClick={handleMenuoption}
          className="menu-icon"
          style={{ opacity: option ? 0 : 1 }}
        />

        {!isMenu && (
          <div className="welcome">
            <h2>SURAJ☀️</h2>
          </div>
        )}

        {isMenu && (
          <div className="welcome">
            <h2>SURAJ☀️</h2>
          </div>
        )}

        {isAddpage ? (
          <img
            src={icons.home_icon}
            onClick={() => navigate("/")}
            alt="Home"
            className="home-icon"
          />
        ) : (
          <img
            src={icons.pallet_icon}
            onClick={() => navigate("/added-items")}
            alt="Pallet"
            className="pallet-icon"
          />
        )}
      </div>

      {/* Conditional container for Wednesday */}
      {isWednesday() && (
        <div className="wednesday-message">
          <h3>We are not serving on Wednesdays</h3>
        </div>
      )}

      {!isAddpage && !isMenu && tableNum === 0 && (
        <>
          <button
            onClick={toggleFormVisibility}
            className="toggle-form-btn"
          >
            {isFormVisible ? "Close Reservation Form" : "APPUYEZ POUR RÉSERVER UNE TABLE"}
          </button>

          {isFormVisible && (
            <div className="reservation-form">
              {/* Reservation timing notice */}
                  <p className="reservation-timing-notice">
                    Reserve between <br></br> 10:30 AM to 2:00 PM and 6:30 PM to 10:00 PM  
                  </p>
              <form className="reservation-row">
                <div className="reservation-input">
                  <input
                    type="text"
                    name="name"
                    value={reservation.name}
                    onChange={handleReservationChange}
                    required
                    placeholder="Name"
                    className="reservation-name"
                  />
                </div>

                <div className="reservation-input">
                  <input
                    type="tel"
                    name="phone"
                    value={reservation.phone}
                    onChange={handleReservationChange}
                    required
                    placeholder="Phone"
                    className="reservation-phone"
                  />
                </div>

                <div className="reservation-input">
                  <input
                    type="date"
                    name="date"
                    value={reservation.date}
                    onChange={handleReservationChange}
                    required
                    className="reservation-date"
                  />
                </div>

                <div className="reservation-input">
                  <input
                    type="time"
                    name="time"
                    value={reservation.time}
                    onChange={handleReservationChange}
                    required
                    className="reservation-time"
                  />
                </div>

                <div className="reservation-input">
                  <select
                    name="persons"
                    value={reservation.persons}
                    onChange={handleReservationChange}
                    required
                    className="reservation-persons"
                  >
                    <option value="" disabled>
                      Persons
                    </option>
                    {[...Array(20).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>
                        {num + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleReservationSubmit}
                  className="reservation-btn"
                  disabled={!isFormComplete}
                >
                  Reserve
                </button>
              </form>
            </div>
          )}
        </>
      )}

      {!isAddpage && !isMenu && tableNum === 0 && (
        <>
          <h3 className="order-heading">cliquez et récupérez</h3>
        </>
      )}

      <ToastContainer />
    </>
  );
}

export default Header;

