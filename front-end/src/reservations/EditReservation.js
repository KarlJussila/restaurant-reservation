import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { today } from "../utils/date-time";
import { updateReservation, getReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";

function EditReservation(props) {
    const history = useHistory();
    const params = useParams();

    const [reservation, setReservation] = useState({});

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

    useEffect(() => {
        loadReservation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    function loadReservation() {
        if (props.location) {
            setReservation(props.location.state.reservation);
        } else {
            const abortController = new AbortController();
            getReservation(params.reservationId, abortController.signal)
                .then(setReservation)
                .catch(setBackendError);
            return () => abortController.abort();
        }
    }

    useEffect(() => {
        if (reservation.first_name) setFirstName(reservation.first_name);
        if (reservation.last_name) setLastName(reservation.last_name);
        if (reservation.mobile_number) setMobileNumber(reservation.mobile_number);
        if (reservation.reservation_date) setDate(reservation.reservation_date);
        if (reservation.reservation_time) setTime(reservation.reservation_time);
        if (reservation.people) setPeople(reservation.people);
    }, [reservation]);

    function sendReservation(newReservation) {
        const abortController = new AbortController();
        setBackendError(null);
        updateReservation(newReservation, abortController.signal)
            .then((response) => {
                console.log(response);
                history.push(`/dashboard?date=${newReservation.reservation_date}`);
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

        const newReservation = {
            reservation_id: parseInt(params.reservationId),
            first_name: firstName,
            last_name: lastName,
            mobile_number: mobileNumber,
            reservation_date: date,
            reservation_time: time + ":00",
            people: parseInt(people)
        }
        console.log(newReservation);
        sendReservation(newReservation);
    }

    return (
        <>
            <div className="d-md-flex">
                <h4 className="mb-0">Edit Reservation</h4>
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

export default EditReservation;
