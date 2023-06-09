import React, { useContext, useEffect, useState } from 'react';
import CodeFinder from '../apis/CodeFinder';
import { CodeContext } from '../context/CodeContext';

const CodesList = (props) => {
  const { typen, setTypen } = useContext(CodeContext);
  const [uniqueFbr, setUniqueFbr] = useState([]);
  const [uniqueMbr, setUniqueMbr] = useState([]);
  const [uniqueMy, setUniqueMy] = useState([]);



  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const response = await CodeFinder.get("/");
        setTypen(response.data.data.typen);

      } catch (err) {
        console.log(err);
      }
    };
   
    fetchData();
  }, [setTypen]);

  

  useEffect(() => {
    if (typen && typen.length > 0) {
      const uniqueFbrValues = [...new Set(typen.map((el) => el.fbr.toString()))];
      const uniqueMbrValues = [...new Set(typen.map((el) => el.mbr.toString()))];
      const uniqueMyValues = [...new Set(typen.map((el) => el.my.toString()))];

      setUniqueFbr(uniqueFbrValues);
      setUniqueMbr(uniqueMbrValues);
      setUniqueMy(uniqueMyValues);
      
    }
  }, [typen]);

  const [selectedOptions, setSelectedOptions] = useState({
    fbr: '111',
    mbr: '100',
    my: '21'
  });
  const [filteredData, setFilteredData] = useState([]);
  const [partsList, setPartsList] = useState([]);


  

  const handleOptionChange = (event) => {
    const { name, value } = event.target;
    setSelectedOptions((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  


  const sortOptions = (options) => {


    return options.sort((a, b) => a - b);
  };




  
  const handleSubmit = () => {
    const { fbr, mbr, my } = selectedOptions;
    console.log(typen);
    console.log(fbr, mbr, my);
  
    const filtered = typen.filter((item) => {
      return (
        Number(item.fbr) === Number(fbr) &&
        Number(item.mbr) === Number(mbr) &&
        Number(item.my) === Number(my)
      );
    });
  
    console.log(filtered);
    console.log(selectedOptions);
    setFilteredData(filtered);
    setPartsList([]);
  };
  

  const handlePartsList = async () => {
    try {
      if (filteredData.length === 0) {
        // No COP Typ-Bezeichnung selected
        return;
      }

      const selectedCOP = filteredData[0].cop_typ_bezeichnung;
      // Reset the partsList state to an empty array
      setPartsList([]);

      console.log(selectedCOP);
      // Fetch the parts list from the SNR table based on the selected COP Typ-Bezeichnung
      const response = await CodeFinder.get(`/snr/${encodeURIComponent(selectedCOP)}`);
      console.log(response.data);
      setPartsList(response.data.data.snr);
    } catch (error) {
      console.log(error);
    }
  };








  return (
    <div className='list-group'>
      <table className='table table-hover table-dark'>
        <thead>
          <tr className="bg-primary">
            <th scope="col">FBR</th>
            <th scope="col">MBR</th>
            <th scope="col">MY</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <select
                className="form-select"
                aria-label="Default select example"
                name="fbr"
                value={selectedOptions.fbr}
                onChange={handleOptionChange}
              >
                {sortOptions(uniqueFbr).map((option) => (
                  <option key={option.id} value={option}>{option}</option>

                ))}
              </select>
            </td>
            <td>
              <select
                className="form-select"
                aria-label="Default select example"
                name="mbr"
                value={selectedOptions.mbr}
                onChange={handleOptionChange}
              >
                {sortOptions(uniqueMbr).map((option) => (
                 <option key={option.id} value={option}>{option}</option>

                ))}
              </select>
            </td>
            <td>
              <select
                className="form-select"
                aria-label="Default select example"
                name="my"
                value={selectedOptions.my}
                onChange={handleOptionChange}
              >
                {sortOptions(uniqueMy).map((option) => (
                  <option key={option.id} value={option}>{option}</option>

                ))}
              </select>
            </td>
            <td>
              <button
                onClick={handleSubmit}
                type="button"
                className="btn btn-warning"
              >
                Typen anzeigen
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {filteredData.length > 0 && (
        <div>
          <h2>COP Typ-Bezeichnung:</h2>
          <select className="form-select" aria-label="Default select example">
            {filteredData.map((item) => (
              <option key={item.id}>{item.cop_typ_bezeichnung}</option>
            ))}
          </select>
          <button onClick={handlePartsList} type="button" className="btn btn-warning ml-2">

            Parts List
          </button>
          {partsList.length > 0 && (
            <div>
              <h2>Parts Check List:</h2>
              <td>
                {filteredData.map((item) => (
                  <h3 key={item.id}>{item.cop_typ_bezeichnung}</h3>
                ))}
              </td>
              <h3>{new Date().toLocaleDateString()}</h3>
              <table className="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th scope="col">FNR</th>
                    <th scope="col">Part</th>
                    <th scope="col">Code</th>
                    <th scope="col">SachnummerSNR</th>
                    <th scope="col">O.k</th>
                    <th scope="col">Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {partsList.map((part) => (
                    <tr key={part.id}>
                      <td>{part.fnr}</td>
                      <td>{part.benennung_english}</td>
                      <td>{part.code}</td>
                      <td>{part.sachnummersnr}</td>
                      <td contenteditable="true"></td>
                       <td contenteditable="true"></td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      )}
    </div>

  );



};

export default CodesList;