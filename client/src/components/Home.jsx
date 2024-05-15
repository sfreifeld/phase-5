import { supabase } from "../supabaseClient"
import NavBarMain from "./NavBar";
import ProjectCard from "./ProjectCard"
import React, { useState, useEffect } from 'react';


function Home( { session }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching projects:', error);
        } else {
          setProjects(data);
        }
      });
  }, []);




  return (
    <div className="vh-100 vw-100">
        <NavBarMain className="fixed-top" session={session}></NavBarMain>

        {projects.map(project => (
        <ProjectCard key={project.id} project={project} session={session}/>
      ))}
    </div>
  );
}

export default Home;