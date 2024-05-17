
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
import ProjectCard from "./components/ProjectCard";
import ProjectDetail from "./pages/ProjectDetail"
import CreateProject from "./components/CreateProject"






export default function App() {
  const [session, setSession] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userType, setUserType] = useState('')



  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkRegistration(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkRegistration(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkRegistration = (userId) => {
    // Query both users and organizations tables
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
    return (
      <UserTypeProvider>
        <Router>
          <Routes>
            <Route path="/" element={isRegistered ? <Home/> : <Registration />} />
            {/*<Route path="/profile/:id" element={userType === 'dev' ? <ProfileDev/> : <ProfileOrg/>} /> */}
            <Route path="/profile/:id" element={userType === 'dfsfkmal' ? <ProfileDev/> : <ProfileOrg/>} />
            <Route path="/project/:id" element= {<ProjectDetail />} />
            <Route path="/createproject" element= {<CreateProject />} />
          </Routes>
        </Router>
      </UserTypeProvider>
    );
  }
}