import Sidebar from "../../components/sidebar/Sidebar";

import Navbar from "../../components/navbar/Navbar";
import Events from "../../components/datatable/Events";
import "./list.scss";

const ListEvents = ({ title }) => {
    return (
        <div className="list">
            <Sidebar />
            <div className="tableContainer">
                <Navbar />
                <Events />
            </div>
        </div>
    )
}
export default ListEvents;