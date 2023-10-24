import React from "react";
import NavBar from "../Components/NavBar";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Grades } from "../Components/Screens/Grades";
import { Attendace } from "../Components/Screens/Attendance";

export function GradesAttendance() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate replace to="/grades"/>}></Route>
                <Route path="/grades" element={<Grades/>}></Route>
                <Route path="/attendance" element={<Attendace/>}></Route>
            </Routes>
        </BrowserRouter>
    )
}