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

const getProfileComponent = (userType) => {
  if (userType === 'dev') {
    return <ProfileDev />;
  } else {
    return <ProfileOrg />;
  }
};

export default function App() {
  const [session, setSession] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userType, setUserType] = useState(null)
  const [profile, setProfile] = useState(null)


//supabase handling auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        supabase
        .from('profiles')
        .select('*')
        .eq('uuid', session.user.id)
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching profile:', error);
          } else {
            setProfile(data);
            checkRegistration(data[0].id); // Also corrected to use data.id directly
          }
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        supabase
        .from('profiles')
        .select('*')
        .eq('uuid', session.user.id)
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching profile:', error);
          } else {
            setProfile(data);
            checkRegistration(data[0].id); // Also corrected to use data.id directly
          }
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []); // Ensures the useEffect hook is properly closed

  const checkRegistration = (userId) => {
    const userQuery = supabase
      .from('users')
      .select('*')
      .eq('profile_id', userId)
      .maybeSingle();

    const organizationQuery = supabase
      .from('organizations')
      .select('*')
      .eq('profile_id', userId)
      .maybeSingle();

    Promise.all([userQuery, organizationQuery]).then(results => {
      const [userResult, organizationResult] = results;
      const userExists = !userResult.error && userResult.data !== null;
      const organizationExists = !organizationResult.error && organizationResult.data !== null;
      setIsRegistered(userExists || organizationExists);
      if (userExists) {
        setUserType('dev')
      }
      else if (organizationExists) {
        setUserType('org')
      }
    });
  };

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
  } else {
    if (!userType) {
      return <div>Loading user type...</div>; // Show loading until userType is determined
    }

    return (
        <Router>
          <Routes>
            <Route path="/" element={isRegistered ? <Home/> : <Registration />} />
            <Route path="/profile/:id" element={getProfileComponent(userType)} />
            <Route path="/project/:id" element= {<ProjectDetail />} />
            <Route path="/createproject" element= {<CreateProject />} />
            <Route path="/notifications/:id" element= {<Notification />} />
          </Routes>
        </Router>
    );
  }
}
