import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationCard from "./ReservationCard";
import TableCard from "./TableCard";

/**
 * Defines the dashboard page.
 * @param date
 *    the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, setDate }) {
    const history = useHistory();

    const [reservations, setReservations] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);

    const [tables, setTables] = useState([]);
    const [tablesError, setTablesError] = useState(null);

    useEffect(loadDashboard, [date]);

    function nextDay() {
        let newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 1);
        newDate = newDate.toISOString().split('T')[0]
        setDate(newDate);
        history.push({
            pathname: '/dashboard',
            search: `?date=${newDate}`
        })
    }

    function previousDay() {
        let newDate = new Date(date);
        newDate.setDate(newDate.getDate() - 1);
        newDate = newDate.toISOString().split('T')[0]
        setDate(newDate);
        history.push({
            pathname: '/dashboard',
            search: `?date=${newDate}`
        })
    }

    function today() {
        let newDate = new Date();
        newDate = newDate.toISOString().split('T')[0]
        setDate(newDate);
        history.push({
            pathname: '/dashboard',
            search: `?date=${newDate}`
        })
    }

    function loadTables() {
        const abortController = new AbortController();
        setTablesError(null);
        listTables(abortController.signal)
            .then(setTables)
            .catch(setTablesError);
        return () => abortController.abort();
    }

    function loadReservations() {
        const abortController = new AbortController();
        setReservationsError(null);
        listReservations({ date }, abortController.signal)
            .then(setReservations)
            .catch(setReservationsError);
        return () => abortController.abort();
    }

    function loadDashboard() {
        loadReservations();
        loadTables();
    }

    return (
        <main>
            <h1>Dashboard</h1>

            <div className="container">
                <div className="row">
                    <div className="col" style={{borderRight: "1px solid grey"}}>

                        <div className="d-md-flex mb-3">
                            <h4 className="mb-0">Reservations for {date}</h4>
                        </div>
                        <ErrorAlert error={reservationsError} onClose={null} />
                        <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                            {reservations.filter(res => res.status !== "finished" && res.status !== "cancelled").map(res => {
                                return (
                                    <li key={res.reservation_id} style={{ paddingBottom: "1em" }}>
                                        <ReservationCard reservation={res} loadReservations={loadReservations} />
                                    </li>
                                );
                            })}
                        </ul>

                        <div style={{float: "left"}}>
                            <button onClick={previousDay} className="btn btn-secondary mr-2">{"< Previous Day"}</button>
                            <button onClick={nextDay} className="btn btn-secondary mr-2">{"Next Day >"}</button>
                        </div>
                        <div style={{float: "right"}}>
                            <button onClick={today} className="btn btn-secondary">Today</button>
                        </div>

                    </div>
                    <div className="col-auto">
                        <div className="d-md-flex mb-3">
                            <h4 className="mb-0">Tables</h4>
                        </div>
                        <ErrorAlert error={tablesError} onClose={null} />
                        <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                            {tables.map(table => {
                                return (
                                    <li key={table.table_id} style={{ paddingBottom: "1em" }}>
                                        <TableCard table={table} loadTables={loadTables} loadReservations={loadReservations} />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Dashboard;
