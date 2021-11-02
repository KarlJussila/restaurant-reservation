import { unseatTable, updateReservationStatus } from "../utils/api";

function TableCard({ table, loadTables, loadReservations }) {

    function finishTable() {
        if (!window.confirm("Is this table ready to seat new guests? This cannot be undone.")) return;
        const abortController = new AbortController();

        unseatTable(table, abortController.signal)
            .then((res) => {
                console.log(res);
                loadTables();
            })
            .catch(console.log);

        const reservation = { reservation_id: table.reservation_id, status: "finished" }
        updateReservationStatus(reservation, abortController.signal)
            .then((res) => {
                console.log(res);
                loadReservations();
            })
            .catch(console.log);

        return () => abortController.abort();
    }

    return (
        <div className="card">
            <div className="card-header">
                {table.table_name}
            </div>
            <div className="card-body">
                <h5 className="card-title" data-table-id-status={table.table_id}>{table.reservation_id ? "Occupied" : "Free"}</h5>
                <p className="card-text">Capacity: {table.capacity}</p>
                {table.reservation_id ? <button data-table-id-finish={table.table_id} onClick={finishTable} className="btn btn-primary">Finish</button> : <div></div>}
            </div>
        </div>
    );
}

export default TableCard;
