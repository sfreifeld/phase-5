import { supabase } from "../supabaseClient"
import NavBarMain from "./NavBar";
import ProjectCard from "./ProjectCard"
import React, { useState, useEffect } from 'react';
import SearchBar from "./SearchBar";
import HomeHero from "./HomeHero";

function Home( ) {
  const [projects, setProjects] = useState([]); // Original fetched projects
  const [displayedProjects, setDisplayedProjects] = useState([]); // Projects to display (sorted)
  const [sortType, setSortType] = useState('')
  const lengthSortOrder = {
    '1-3 Weeks': 1,
    '4-6 Weeks': 2,
    '7+ Weeks': 3
  };

  // Fetch projects
  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching projects:', error);
        } else {
          setProjects(data);
          setDisplayedProjects(data); // Initially set displayed projects as fetched
        }
      });
  }, []);

  // Sort and filter projects
  useEffect(() => {

    // Apply sort
    if (sortType === 'Posted Date') {
      projects.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortType === 'Project Length') {
      projects.sort((a, b) => lengthSortOrder[a.project_length] - lengthSortOrder[b.project_length]);
    }

    setDisplayedProjects(projects);
  }, [sortType, projects]);

  return (
    <div className="min-vh-100 vw-100 background">
        <NavBarMain className="fixed-top"></NavBarMain>
        <HomeHero className=""></HomeHero>
        <SearchBar setSortType={setSortType} className=""/>
        {displayedProjects.map(project => (
        <ProjectCard key={project.id} project={project}/>
      ))}

    </div>
  );
}

export default Home;
