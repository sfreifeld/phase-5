import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"
import { Dropdown } from 'react-bootstrap';
import { useSession } from './SessionContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark   } from '@fortawesome/free-solid-svg-icons';

function SearchBar({ setSortType, setSearchQuery, setFilterType, filterType, sortType, className }) {
  const { userType } = useSession();
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setSearchQuery(inputValue);
    }
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  }

  const handleSearchClick = () => {
    setSearchQuery(inputValue);
  }

  const handleClearFilters = () => {
    setFilterType(''); // Reset filter type to default state
  }

  useEffect(() => {
    if (userType === 'dev') {
      setFilterType('open');
    }
  }, [userType]);

  useEffect(() => {
    console.log('Sort Type in SearchBar:', sortType);
  }, [sortType]);

  return (
    <div className={`${className} search container-fluid border-bottom`}>
      <div className="row height d-flex justify-content-start align-items-center">
        <div className="col-md-6">
          <div className="form d-flex flex-row">
            <input
              type="text"
              className="form-control form-input"
              placeholder="Search by keyword"
              onKeyDown={handleKeyDown}
              onChange={handleInputChange}
              value={inputValue}
            />
            <Button onClick={handleSearchClick} className="me-3 pe-4  ps-4 rounded negative-margin"> Search </Button>

            <Dropdown className='me-3'>
              <Dropdown.Toggle>Sort By</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => { setSortType('postedDate'); console.log('Sort set to Posted Date'); }}>
                  Posted Date {sortType === 'postedDate' && '✓'}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => { setSortType('projectLength'); console.log('Sort set to Project Length'); }}>
                  Project Length {sortType === 'projectLength' && '✓'}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown className='me-3'>
              <Dropdown.Toggle> Filter By </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setFilterType('open')}>Open {filterType === 'open' && '✓'}</Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterType('inProgress')}>In Progress {filterType === 'inProgress' && '✓'}</Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterType('closed')}>Closed {filterType === 'closed' && '✓'}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <div onClick={handleClearFilters} className="mt-2" style={{ width: '100%' }}>
              <FontAwesomeIcon  icon={faCircleXmark} style={{ color: "#6495ed" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchBar

