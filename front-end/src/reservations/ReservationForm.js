import React from "react";
import { today } from "../utils/date-time";

function ReservationForm({handleSubmit, handleFirstNameChange, firstName, handleLastNameChange, lastName, handleDateChange, date, handleTimeChange, time, handleMobileNumberChange, mobileNumber, handlePeopleChange, people, history}) {

    return (
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

            <button onClick={() => history.goBack()} type="button" className="btn btn-secondary mr-1">Cancel</button>
            <button type="submit" className="btn btn-primary">Submit</button>

        </form>
    );
}

export default ReservationForm;
