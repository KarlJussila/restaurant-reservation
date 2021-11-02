import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { seatTable, listTables, getReservation } from "../utils/api";
import formatReservationDate from "../utils/format-reservation-date";
import formatReservationTime from "../utils/format-reservation-date";
import ErrorAlert from "../layout/ErrorAlert";

function SeatReservation(props) {
    const history = useHistory();
    const params = useParams();

    const [tables, setTables] = useState([]);
    const [tablesError, setTablesError] = useState(null);

    const [reservation, setReservation] = useState([]);
    const [reservationError, setReservationError] = useState(null);

    const [tableId, setTableId] = useState("");
    const handleTableIdChange = (event) => setTableId(event.target.value);

    const [errors, setErrors] = useState([]);
    const [showError, setShowError] = useState(false);

    const [backendError, setBackendError] = useState(null);

    useEffect(loadData, []);
    useEffect(() => console.log(errors), [errors]);

    function loadData() {
        const abortController = new AbortController();
        setReservationError(null);
        getReservation(params.reservationId, abortController.signal)
            .then((res) => {
                formatReservationTime(res);
                formatReservationDate(res);
                setReservation(res);
            })
            .catch(setReservationError);
        setTablesError(null);
        listTables(abortController.signal)
            .then(setTables)
            .catch(setTablesError);
        return () => abortController.abort();
    }

    function sendTable(table) {
        const abortController = new AbortController();
        setBackendError(null);
        seatTable(table, abortController.signal)
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
        if (!tableId) {
            errorList.push("Table field is required");
        } else if (tables.find(table => parseInt(tableId) === table.table_id).capacity < reservation.people) {
            errorList.push("Table has insufficient capacity");
        }

        if (errorList.length) {
            setShowError(true);
            return setErrors(errorList);
        }

        const table = {
            table_id: tableId,
            reservation_id: parseInt(params.reservationId)
        }
        console.log(table);
        sendTable(table);
    }

    return (
        <>
            <div className="d-md-flex">
                <h4 className="mb-0">Seat {`${reservation.first_name} ${reservation.last_name}`}</h4>
            </div>
            <ErrorAlert error={reservationError} onClose={null} />
            <ErrorAlert error={tablesError} onClose={null} />
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
                        <label htmlFor="tableId" className="form-label" style={{paddingRight: "0.5em"}}>Table</label>
                        <select id="tableId" value={tableId} onChange={handleTableIdChange} name="table_id">
                            <option value={null}> -- select an option -- </option>
                            {
                                tables.map(table => {
                                    return <option key={table.table_id} value={table.table_id}>{`${table.table_name} - ${table.capacity}`}</option>
                                })
                            }
                        </select>
                    </div>
                </div>

                <button onClick={() => history.goBack()} className="btn btn-secondary mr-1">Cancel</button>
                <button type="submit" className="btn btn-primary">Submit</button>

            </form>
        </>
    );
}

export default SeatReservation;
