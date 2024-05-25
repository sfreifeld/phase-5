import { useState, useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "./supabaseClient";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Home from "./components/Home";
import Registration from "./pages/Registration";

import ProfileDev from "./components/ProfileDev";
import ProfileOrg from "./components/ProfileOrg"
import ProjectDetail from "./pages/ProjectDetail"
import CreateProject from "./components/CreateProject"
import Notification from "./pages/Notification"
import About from "./pages/About"

import { useSession } from './components/SessionContext'; // Import useSession

const getProfileComponent = (userType) => {
  if (userType === 'dev') {
    return <ProfileDev />;
  } else {
    return <ProfileOrg />;
  }
};

export default function App() {
  const { session, userType, isLoading } = useSession(); // Use the useSession hook

  if (!session) {
    return (
      <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={["google"]}
          />
        </div>
      </div>
    );
  } else if (isLoading) { // Check isLoading instead of !userType
    return <div>Loading...</div>; // Unified loading message
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={userType ? <Home/> : <Registration />} />
        <Route path="/profile/:id" element={getProfileComponent(userType)} />
        <Route path="/project/:id" element= {<ProjectDetail />} />
        <Route path="/createproject" element= {<CreateProject />} />
        <Route path="/notifications/:id" element= {<Notification />} />
        <Route path="/about" element= {<About/>} />
      </Routes>
    </Router>
  );
}

