import React from "react";
import Sidebar from "../components/layout/Sidebar";
export const Call=({isMobile})=>{
    return(
        <div className="flex flex-row">
            {!isMobile && <Sidebar />}
            <h1 className="h-44 w-84 bg-slate-500 p-20">

            Call page
            </h1>
        </div>
    );
}
export default Call;
