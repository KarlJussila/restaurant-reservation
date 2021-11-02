import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function NewReservation() {
    const history = useHistory();

    const [tableName, setTableName] = useState("");
    const handleTableNameChange = (event) => setTableName(event.target.value);

    const [capacity, setCapacity] = useState("");
    const handleCapacityChange = (event) => setCapacity(event.target.value);

    const [errors, setErrors] = useState([]);
    const [showError, setShowError] = useState(false);

    const [backendError, setBackendError] = useState(null);

    function sendTable(table) {
        const abortController = new AbortController();
        setBackendError(null);
        createTable({ data: table }, abortController.signal)
            .then((response) => {
                console.log(response);
                history.push({
                    pathname: '/dashboard'
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
        if (capacity < 1) {
            errorList.push("Table must have a capacity of at least one");
        }
        if (!tableName) {
            errorList.push("Table Name field is required");
        }

        if (errorList.length) {
            setShowError(true);
            return setErrors(errorList);
        }

        const table = {
            table_name: tableName,
            capacity: parseInt(capacity)
        }
        console.log(table);
        sendTable(table);
    }

    return (
        <>
            <div className="d-md-flex">
                <h4 className="mb-0">New Table</h4>
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
                        <label htmlFor="tableName" className="form-label">Table Name</label>
                        <input
                            name="table_name"
                            type="text"
                            className="form-control"
                            id="tableName"
                            placeholder="Table Name"
                            onChange={handleTableNameChange}
                            value={tableName}
                        />
                    </div>
                    <div className="mb-3 col">
                        <label htmlFor="capacity" className="form-label">Capacity</label>
                        <input
                            name="capacity"
                            type="number"
                            className="form-control"
                            id="capacity"
                            onChange={handleCapacityChange}
                            value={capacity}
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
