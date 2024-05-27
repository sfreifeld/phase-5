import { supabase } from "../supabaseClient"
import NavBarMain from "./NavBar";
import ProjectCard from "./ProjectCard"
import React, { useState, useEffect } from 'react';
import SearchBar from "./SearchBar";
import HomeHero from "./HomeHero";
import { useSession } from './SessionContext'

function Home( ) {
  const { user } = useSession()
  const [projects, setProjects] = useState([]); // Original fetched projects
  const [displayedProjects, setDisplayedProjects] = useState([]); // Projects to display (sorted)
  const [sortType, setSortType] = useState('')
  const [filterType, setFilterType] = useState('')
  const lengthSortOrder = {
    '1-3 Weeks': 1,
    '4-6 Weeks': 2,
    '7+ Weeks': 3
  };
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch projects
  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .not('status', 'eq', 'deleted') // Add this line to filter out 'deleted' projects
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
    let filteredProjects = projects;
    if (searchQuery) {
      filteredProjects = filteredProjects.filter(project =>
        project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (filterType == 'open') {
      filteredProjects = filteredProjects.filter(project => project.status == 'open')
    }  else if (filterType == 'inProgress') {
      filteredProjects = filteredProjects.filter(project => project.status == 'in progress')
    }  else if (filterType == 'closed') {
      filteredProjects = filteredProjects.filter(project => project.status == 'closed')
    }

    // Apply sort
    if (sortType === 'Posted Date') {
      filteredProjects.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortType === 'Project Length') {
      filteredProjects.sort((a, b) => lengthSortOrder[a.project_length] - lengthSortOrder[b.project_length]);
    }

    setDisplayedProjects(filteredProjects);
  }, [sortType, searchQuery, projects, filterType]);

  return (
    <div className="min-vh-100 vw-100 background">
        <NavBarMain className="fixed-top"></NavBarMain>
        <HomeHero className=""></HomeHero>
        <SearchBar setSortType={setSortType} setSearchQuery={setSearchQuery} setFilterType={setFilterType}className=""/>
        {displayedProjects.map(project => (
        <ProjectCard key={project.id} project={project}/>
      ))}

    </div>
  );
}

export default Home;
