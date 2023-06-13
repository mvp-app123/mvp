import React, { useContext, useEffect, useState } from 'react';
import CodeFinder from '../apis/CodeFinder';
import { CodeContext } from '../context/CodeContext';
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import html2pdf from 'html2pdf.js';





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
    fbr: '',
    mbr: '',
    my: ''
  });
  const [filteredData, setFilteredData] = useState([]);
  const [partsList, setPartsList] = useState([]);

  const handleOptionChange = (event) => {
    const { name, value } = event.target;
  
    setSelectedOptions((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  
    if (name === "fbr") {
      const filteredMbrOptions = typen
        .filter((item) => item.fbr === value)
        .map((item) => item.mbr.toString());
      setUniqueMbr([...new Set(filteredMbrOptions)]);
  
      // Check if the currently selected "mbr" is available in the filtered options
      if (!filteredMbrOptions.includes(selectedOptions.mbr)) {
        setSelectedOptions((prevState) => ({
          ...prevState,
          mbr: "",
        }));
      }
  
      const filteredMyOptions = typen
        .filter((item) => item.fbr === value)
        .map((item) => item.my.toString());
      setUniqueMy([...new Set(filteredMyOptions)]);
  
      // Check if the currently selected "my" is available in the filtered options
      if (!filteredMyOptions.includes(selectedOptions.my)) {
        setSelectedOptions((prevState) => ({
          ...prevState,
          my: "",
        }));
      }
    } else if (name === "mbr") {
      const filteredFbrOptions = typen
        .filter((item) => item.mbr === value)
        .map((item) => item.fbr.toString());
      setUniqueFbr([...new Set(filteredFbrOptions)]);
  
      // Check if the currently selected "fbr" is available in the filtered options
      if (!filteredFbrOptions.includes(selectedOptions.fbr)) {
        setSelectedOptions((prevState) => ({
          ...prevState,
          fbr: "",
        }));
      }
  
      const filteredMyOptions = typen
        .filter((item) => item.mbr === value)
        .map((item) => item.my.toString());
      setUniqueMy([...new Set(filteredMyOptions)]);
  
      // Check if the currently selected "my" is available in the filtered options
      if (!filteredMyOptions.includes(selectedOptions.my)) {
        setSelectedOptions((prevState) => ({
          ...prevState,
          my: "",
        }));
      }
    } else if (name === "my") {
      const filteredFbrOptions = typen
        .filter((item) => item.my === value)
        .map((item) => item.fbr.toString());
      setUniqueFbr([...new Set(filteredFbrOptions)]);
  
      // Check if the currently selected "fbr" is available in the filtered options
      if (!filteredFbrOptions.includes(selectedOptions.fbr)) {
        setSelectedOptions((prevState) => ({
          ...prevState,
          fbr: "",
        }));
      }
  
      const filteredMbrOptions = typen
        .filter((item) => item.my === value)
        .map((item) => item.mbr.toString());
      setUniqueMbr([...new Set(filteredMbrOptions)]);
  
      // Check if the currently selected "mbr" is available in the filtered options
      if (!filteredMbrOptions.includes(selectedOptions.mbr)) {
        setSelectedOptions((prevState) => ({
          ...prevState,
          mbr: "",
        }));
      }
    }
  };
  

  const sortOptions = (options) => {
    return options.sort((a, b) => a - b);
  };

  const handleSubmit = () => {
    const { fbr, mbr, my } = selectedOptions;
  
    if (fbr === "" && mbr === "" && my === "") {
      // No options selected, handle it accordingly (e.g., show an error message)
      console.log("Please select options before displaying results");
      return;
    }
  
    if (!fbr && !mbr && !my) {
      setFilteredData(typen);
    } else {
      const filtered = typen.filter((item) => {
        return (
          Number(item.fbr) === Number(fbr) &&
          Number(item.mbr) === Number(mbr) &&
          Number(item.my) === Number(my)
        );
      });
  
      setFilteredData(filtered);
    }
  
    setPartsList([]);
  };

  const handleReset = () => {
    setSelectedOptions({
      fbr: "",
      mbr: "",
      my: ""
    });
    setFilteredData([]);
    setUniqueFbr([...new Set(typen.map(item => item.fbr))]);
    setUniqueMbr([...new Set(typen.map(item => item.mbr.toString()))]);
    setUniqueMy([...new Set(typen.map(item => item.my.toString()))]);
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

  const partCheckListRef = useRef(null);

  const handleExport = () => {
    if (partCheckListRef.current) {
      const input = partCheckListRef.current;
  
      html2pdf()
        .set({ filename: 'part-check-list.pdf', html2canvas: { scale: 2 } })
        .from(input)
        .save();
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
                <option value="">-- Select FBR --</option>
                {sortOptions(uniqueFbr).map((option) => (
                  <option key={option} value={option}>{option}</option>
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
                <option value="">-- Select MBR --</option>
                {sortOptions(uniqueMbr).map((option) => (
                  <option key={option} value={option}>{option}</option>
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
                <option value="">-- Select My --</option>
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
              <button className='btn btn-danger ml-3' onClick={handleReset}>Reset</button>
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
          
          <button  className="btn btn-success ml-2"onClick={handleExport}>Export to PDF  </button>
          {partsList.length > 0 && (
           
          
           <div ref={partCheckListRef}>
           {/* Part Check List component */}
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
                    <th scope="col">O.k.</th>
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
                      <td contentEditable="true"></td>
                      <td contentEditable="true"></td>
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
