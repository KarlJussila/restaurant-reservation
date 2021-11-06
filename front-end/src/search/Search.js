import React, { useState, useEffect } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationCard from "../dashboard/ReservationCard";

function Search() {
    const [search, setSearch] = useState("");
    const handleSearchChange = (event) => setSearch(event.target.value);

    const [errors, setErrors] = useState([]);
    const [showError, setShowError] = useState(false);

    const [reservations, setReservations] = useState([]);
    const [backendError, setBackendError] = useState(null);

    useEffect(() => console.log(errors), [errors]);

    function loadReservations(searchParams) {
        const abortController = new AbortController();
        setBackendError(null);
        listReservations(searchParams, abortController.signal)
            .then((res) => {
                console.log(res);
                setReservations(res);
                if (!res.length) {
                    setBackendError({message: "No reservations found"});
                }
            })
            .catch(setBackendError);
        return () => abortController.abort();
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setErrors([]);
        setShowError(false);
        const errorList = []
        if (!search) {
            errorList.push("Search box is empty");
        }

        if (errorList.length) {
            setShowError(true);
            return setErrors(errorList);
        }

        const searchParams = {
            mobile_number: search
        }
        console.log(searchParams);
        loadReservations(searchParams);
    }

    return (
        <>
            <div className="d-md-flex">
                <h4 className="mb-2">Search by Phone Number</h4>
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

                <div className="input-group mb-5">
                    <input
                        name="mobile_number"
                        type="text"
                        className="form-control"
                        id="search"
                        placeholder="Enter a customer's phone number"
                        onChange={handleSearchChange}
                        value={search}
                    />
                <div className="input-group-append">
                        <button className="btn btn-secondary" type="submit">Find</button>
                    </div>
                </div>
            </form>

            <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                {reservations.map(res => {
                    return (
                        <li key={res.reservation_id} style={{ paddingBottom: "1em" }}>
                            <ReservationCard reservation={res} loadReservations={() => loadReservations({mobile_phone: search})} />
                        </li>
                    );
                })}
            </ul>
        </>
    );
}

export default Search;
