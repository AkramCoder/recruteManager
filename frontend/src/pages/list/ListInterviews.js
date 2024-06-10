import Sidebar from "../../components/sidebar/Sidebar";

import Navbar from "../../components/navbar/Navbar";
import "./list.scss";
import Interviews from "../../components/datatable/Interviews";

const ListEvents = ({ title }) => {
    return (
        <div className="list">
            <Sidebar />
            <div className="tableContainer">
                <Navbar />
                <Interviews />
            </div>
        </div>
    )
}
export default ListEvents;