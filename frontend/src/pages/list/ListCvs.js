import Sidebar from "../../components/sidebar/Sidebar";

import Navbar from "../../components/navbar/Navbar";
import Cvs from "../../components/datatable/Cvs";
import "./list.scss";

const ListCvs = ({ title }) => {
    return (
        <div className="list">
            <Sidebar />
            <div className="tableContainer">
                <Navbar />
                <Cvs />
            </div>
        </div>
    )
}
export default ListCvs;