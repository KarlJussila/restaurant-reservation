import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { today } from "../utils/date-time";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";

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
                history.push(`/dashboard?date=${reservation.reservation_date}`);
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
            if (new Date(`${date}T${time}`) < new Date(`${date}T10:30`)) {
                errorList.push("Reservations are not available before 10:30 AM");
            } else if (new Date(`${date}T${time}`) > new Date(`${date}T21:30`)) {
                errorList.push("Reservations are not available after 9:30 PM");
            }
        }
        if (!mobileNumber) {
            errorList.push("Mobile Number field is required");
        }
        if ((new Date(`${date}T${time}`)).getDay() === 2) {
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
            <ReservationForm
                    handleSubmit={handleSubmit}
                    handleFirstNameChange={handleFirstNameChange}
                    firstName={firstName}
                    handleLastNameChange={handleLastNameChange}
                    lastName={lastName}
                    handleDateChange={handleDateChange}
                    date={date}
                    handleTimeChange={handleTimeChange}
                    time={time}
                    handleMobileNumberChange={handleMobileNumberChange}
                    mobileNumber={mobileNumber}
                    handlePeopleChange={handlePeopleChange}
                    people={people}
                    history={history}
            />
        </>
    );
}

export default NewReservation;
