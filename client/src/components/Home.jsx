import { supabase } from "../supabaseClient"
import NavBarMain from "./NavBar";
import ProjectCard from "./ProjectCard"
import React, { useState, useEffect } from 'react';
import SearchBar from "./SearchBar";
import { Button } from 'react-bootstrap';
import HomeHero from "./HomeHero";

function Home( ) {
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
    <div className="min-vh-100 vw-100 background">
        <NavBarMain className="fixed-top"></NavBarMain>
        <HomeHero className=""></HomeHero>
        <SearchBar className=""/>
        {projects.map(project => (
        <ProjectCard key={project.id} project={project}/>
      ))}

    </div>
  );
}

export default Home;