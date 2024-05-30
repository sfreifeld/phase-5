import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
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
import ProfileOrg from "./components/ProfileOrg";
import ProjectDetail from "./pages/ProjectDetail";
import CreateProject from "./components/CreateProject";
import Notification from "./pages/Notification";
import About from "./pages/About";

import { useSession } from './components/SessionContext'; // Import useSession

const getProfileComponent = async (profileId) => {
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('profile_id', profileId)
    .single();

  if (userData) {
    return <ProfileDev />;
  }

  const { data: orgData, error: orgError } = await supabase
    .from('organizations')
    .select('*')
    .eq('profile_id', profileId)
    .single();

  if (orgData) {
    return <ProfileOrg />;
  }

  return <div>Profile not found</div>; // Handle case where profile is not found in either table
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
  } else if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={userType ? <Home/> : <Registration />} />
        <Route path="/profile/:id" element={<ProfileComponentWrapper />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/createproject" element={<CreateProject />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/about" element={<About/>} />
      </Routes>
    </Router>
  );
}

function ProfileComponentWrapper() {
  const { id } = useParams(); // React Router hook to get URL params
  const [component, setComponent] = useState(null);

  useEffect(() => {
    const fetchComponent = async () => {
      const comp = await getProfileComponent(id);
      setComponent(comp);
    };

    fetchComponent();
  }, [id]);

  return component || <div>Loading profile...</div>;
}

