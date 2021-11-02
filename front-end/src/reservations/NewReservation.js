import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { today } from "../utils/date-time";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function NewReservation() {
    const history = useHistory();

    const [firstName, setFirstName] = useState("");
    const handleFirstNameChange = (event) => setFirstName(event.target.value);

    const [lastName, setLastName] = useState("");
    const handleLastNameChange = (event) => setLastName(event.target.value);

    const [mobileNumber, setMobileNumber] = useState("");
    const handleMobileNumberChange = (event) => setMobileNumber(event.target.value);

    const [date, setDate] = useState(today());
    const handleDateChange = (event) => setDate(event.target.value);

    const [time, setTime] = useState("18:00");
    const handleTimeChange = (event) => setTime(event.target.value);

    const [people, setPeople] = useState("");
    const handlePeopleChange = (event) => setPeople(event.target.value);

    const [errors, setErrors] = useState([]);
    const [showError, setShowError] = useState(false);

    const [backendError, setBackendError] = useState(null);

    function sendReservation(reservation) {
        const abortController = new AbortController();
        setBackendError(null);
        createReservation({ data: reservation }, abortController.signal)
            .then((response) => {
                console.log(response);
                history.push({
                    pathname: '/dashboard',
                    search: `?date=${reservation.reservation_date}`
                });
            })
            .catch(setBackendError);
        return () => abortController.abort();
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setErrors([]);
        setShowError(false);
        const errorList = []
        if (people < 1) {
            errorList.push("Reservation must have a party size of at least one");
        }
        if (!firstName) {
            errorList.push("First Name field is required");
        }
        if (!lastName) {
            errorList.push("Last Name field is required");
        }
        if (!date) {
            errorList.push("Date field is required");
        }
        if (!time) {
            errorList.push("Time field is required");
        } else {
            const timeInt = parseInt(time.replace(":", ""));
            if (parseInt(timeInt) < 1030) {
                errorList.push("Reservations are not available before 10:30 AM");
            } else if (timeInt > 2130) {
                errorList.push("Reservations are not after before 9:30 PM");
            }
        }
        if (!mobileNumber) {
            errorList.push("Mobile Number field is required");
        }
        if ((new Date(date)).getDay() === 1) {
            errorList.push("Reservations are not available on Tuesdays");
        }
        if (new Date(date + " " + time + ":00") < new Date()) {
            errorList.push("Reservations cannot be in the past");
        }

        if (errorList.length) {
            setShowError(true);
            return setErrors(errorList);
        }

        const reservation = {
            first_name: firstName,
            last_name: lastName,
            mobile_number: mobileNumber,
            reservation_date: date,
            reservation_time: time + ":00",
            people: parseInt(people)
        }
        console.log(reservation);
        sendReservation(reservation);
    }

    return (
        <>
            <div className="d-md-flex">
                <h4 className="mb-0">New Reservation</h4>
            </div>
            <ErrorAlert error={backendError} />
            <ul style={{ paddingTop: "1em", listStyleType: "none", paddingLeft: 0 }}>
                {
                    showError ? errors.map((error) => {
                        return (
                            <li key={error}>
                                <ErrorAlert error={{message: error}} onClose={() => setShowError(false)} />
                            </li>
                        )
                    }) : <div></div>
                }
            </ul>
            <form onSubmit={handleSubmit} className="container">

                <div className="row">
                    <div className="mb-3 col">
                        <label htmlFor="firstName" className="form-label">First Name</label>
                        <input
                            name="first_name"
                            type="text"
                            className="form-control"
                            id="firstName"
                            placeholder="First Name"
                            onChange={handleFirstNameChange}
                            value={firstName}
                        />
                    </div>
                    <div className="mb-3 col">
                        <label htmlFor="lastName" className="form-label">Last Name</label>
                        <input
                            name="last_name"
                            type="text"
                            className="form-control"
                            id="lastName"
                            placeholder="Last Name"
                            onChange={handleLastNameChange}
                            value={lastName}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="mb-3 col">
                        <label htmlFor="date" className="form-label">Date</label>
                        <input
                            name="reservation_date"
                            type="date"
                            className="form-control"
                            id="date"
                            placeholder={today()}
                            onChange={handleDateChange}
                            value={date}
                        />
                    </div>
                    <div className="mb-3 col">
                        <label htmlFor="time" className="form-label">Time</label>
                        <input
                            name="reservation_time"
                            type="time"
                            className="form-control"
                            id="time"
                            onChange={handleTimeChange}
                            value={time}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="mb-3 col">
                        <label htmlFor="mobileNumber" className="form-label">Mobile Number</label>
                        <input
                            name="mobile_number"
                            type="text"
                            className="form-control"
                            id="mobileNumber"
                            placeholder="555-555-5555"
                            onChange={handleMobileNumberChange}
                            value={mobileNumber}
                        />
                    </div>
                    <div className="mb-3 col">
                        <label htmlFor="people" className="form-label">Party Size</label>
                        <input
                            name="people"
                            type="number"
                            className="form-control"
                            id="people"
                            onChange={handlePeopleChange}
                            value={people}
                        />
                    </div>
                </div>

                <button onClick={() => history.goBack()} className="btn btn-secondary mr-1">Cancel</button>
                <button type="submit" className="btn btn-primary">Submit</button>

            </form>
        </>
    );
}

export default NewReservation;
