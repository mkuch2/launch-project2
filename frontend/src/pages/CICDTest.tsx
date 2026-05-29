import { useState, useEffect, useContext } from "react"; // unused imports

export default async function CICDTest() {
    try {
        const response = await fetch("http://localhost:5005/api/users", {
          credentials: "include",
        });
        const data : any = await response.json(); // unused data and any type
    }
    catch (err) {
        throw new Error("Error in CICDTest: "+err); // no cause set for error
    }
    return <>
    </>
}