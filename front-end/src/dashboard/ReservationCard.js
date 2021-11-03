import { Link } from "react-router-dom";
import { updateReservationStatus } from "../utils/api";

function ReservationCard({ reservation, loadReservations }) {

    function cancelReservation() {
        if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
            updateStatus("cancelled");
        }
    }

    function updateStatus(status="seated") {
        const abortController = new AbortController();
        const newReservation = { reservation_id: reservation.reservation_id, status }
        console.log(newReservation);
        updateReservationStatus(newReservation, abortController.signal)
            .then((res) => {
                console.log(res);
                loadReservations();
            })
            .catch(console.log);

        return () => abortController.abort();
    }

    console.log(reservation);
    return (
        <div className="card">
            <div className="card-header">
                <div style={{float: "left"}}>{reservation.first_name} {reservation.last_name} ({reservation.people} {reservation.people === 1 ? "person" : "people"})</div>
                <div style={{float: "right"}}>{reservation.reservation_date} at {reservation.reservation_time}</div>
            </div>
            <div className="card-body">
                <h5 className="card-title" data-reservation-id-status={reservation.reservation_id}>
                    {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                </h5>
                <p className="card-text">Mobile Phone: {reservation.mobile_number}</p>
                {
                    reservation.status === "booked" ? (
                        <Link onClick={() => updateStatus("seated")} to={`/reservations/${reservation.reservation_id}/seat`} href={`/reservations/${reservation.reservation_id}/seat`} className="btn btn-outline-primary" style={{float: "left"}}>Seat</Link>
                    ) : <div></div>
                }
                {
                    reservation.status === "booked" ? (
                        <Link to={{pathname: `/reservations/${reservation.reservation_id}/edit`, state: { reservation }}} href={`/reservations/${reservation.reservation_id}/edit`} className="btn btn-outline-primary" style={{float: "Right"}}>Edit</Link>
                    ) : <div></div>
                }
                {
                    reservation.status !== "cancelled" ? (
                        <button data-reservation-id-cancel={reservation.reservation_id} onClick={cancelReservation} className="btn btn-outline-primary mr-1" style={{float: "Right"}}>Cancel</button>
                    ) : <div></div>
                }
            </div>
        </div>
    );
}

export default ReservationCard;
