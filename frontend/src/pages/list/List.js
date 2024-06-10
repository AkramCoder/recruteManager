import Sidebar from "../../components/sidebar/Sidebar";

import Navbar from "../../components/navbar/Navbar";
import Offers from "../../components/datatable/Offres";
import "./list.scss";

const List = ({ title}) => {
    return (
        <div className="list">
            <Sidebar />
            <div className="tableContainer">
                <Navbar />
                <Offers />
            </div>
        </div>
    )
}
export default List;