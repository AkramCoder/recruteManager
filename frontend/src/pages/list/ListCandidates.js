import Sidebar from "../../components/sidebar/Sidebar";

import Navbar from "../../components/navbar/Navbar";
import Candidates from "../../components/datatable/Candidates";
import "./list.scss";

const List = ({ title }) => {
    return (
        <div className="list">
            <Sidebar />
            <div className="tableContainer">
                <Navbar />
                <Candidates />
            </div>
        </div>
    )
}
export default List;