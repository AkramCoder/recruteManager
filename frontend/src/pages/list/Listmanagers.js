import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Managerstable from "../../components/datatable/Managerstable";
import "./list.scss";

const Listmanagers =  () => {
    return (
        <div className="list">
            <Sidebar />
            <div className="tableContainer">
                <Navbar />
                <Managerstable />
            </div>
        </div>
    )
}
export default Listmanagers;