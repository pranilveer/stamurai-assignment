import React, { useState, useEffect } from 'react';

const CitiesTable = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=100&refine=timezone%3A%22Asia%22&refine=cou_name_en%3A%22India%22');
        if (!response.ok) {
          throw new Error('Failed to fetch cities');
        }
        const data = await response.json();
        console.log("Response data:", data); // Log response data to inspect it
        setCities(data.results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
  }, []);

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const handleSort = columnName => {
    if (sortedColumn === columnName) {
      setSortDirection(prevDirection =>
        prevDirection === 'asc' ? 'desc' : 'asc'
      );
    } else {
      setSortedColumn(columnName);
      setSortDirection('asc');
    }
  };

  const sortedCities = sortedColumn
    ? [...cities].sort((a, b) => {
        const columnA = a[sortedColumn].toLowerCase();
        const columnB = b[sortedColumn].toLowerCase();

        if (columnA < columnB) {
          return sortDirection === 'asc' ? -1 : 1;
        }
        if (columnA > columnB) {
          return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      })
    : cities;

  const filteredCities = sortedCities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search city..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>City Name</th>
              <th onClick={() => handleSort('cou_name_en')}>Country</th>
              <th onClick={() => handleSort('timezone')}>Timezone</th>
            </tr>
          </thead>
          <tbody>
            {filteredCities.map(city => (
              <tr key={city.geoname_id}>
                <td>{city.name}</td>
                <td>{city.cou_name_en}</td>
                <td>{city.timezone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CitiesTable;
