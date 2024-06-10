import React, { Component } from 'react';
import "./home.scss"

import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Widget from "../../components/widget/Widget";
import Managerstable from "../../components/datatable/Managerstable";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";

const Home = () => {
	return (
        <div className="home">
            <Sidebar />
            <div className="homeContainer">
                <Navbar />
                <div className="widgets">
                    <Widget type="user" />
                </div>
                {/*<div className="charts">*/}
                {/*    <Featured />*/}
                {/*</div>*/}
                <div className="listContainer">
                    <div className="listTitle">Latest Transactions</div>
                    <Managerstable />
                </div>
            </div>
        </div>
	)
}
export default Home