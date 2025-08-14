"use client";
import { useState } from "react";
import Home from "./home/page";
import { useAuthSocket } from "./login/use.authocket";


export default function Index() {
    useAuthSocket();
  return (
   <Home/>
  );
}
