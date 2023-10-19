import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import logo from "../../asset/images/UniversityPicture.png";

const DataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState(""); // State to store the sorting key
  const tableRef = useRef(null);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleSortChange = (e) => {
    setSortKey(e.target.value);
  };

  const handleDownloadPDF = () => {
    if (tableRef.current) {
      html2canvas(tableRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a3");
        pdf.addImage(imgData, "PNG", 2, 0, 290, 150);
        pdf.save("اطلاعات دانشجویان فارغ التحصیل.pdf");
      });
    }
  };

  const handleDownloadExcel = () => {
    if (data.length > 0) {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data");
      XLSX.writeFile(wb, "اطلاعات دانشجویان فارغ التحصیل.xlsx");
    }
  };

  const sortData = (dataToSort, key) => {
    return [...dataToSort].sort((a, b) => {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    });
  };

  const sortedData = sortKey ? sortData(data, sortKey) : data;

  if (loading) {
    return (
      <div className="table-loading text-center ">
        در حال بارگزاری اطلاعات ...
        <Spinner className="mx-3" animation="grow" variant="primary" />
      </div>
    );
  }

  return (
    <div>
      <div ref={tableRef}>
        <h1 className="text-center table-header mb-3 mt-3">
          <img src={logo} className="table-logo" alt="University Logo" />
          اطلاعات دانشجویان فارغ التحصیل
        </h1>
        <div className="table-responsive table-container">
          <select onChange={handleSortChange} className=" table-sort">
            <option value="">مرتب سازی بر اساس</option>
            <option value="id">ID</option>
            <option value="name">Name</option>
            <option value="username">نام</option>
            <option value="email">ایمیل</option>
            <option value="phone">شماره تماس</option>
            <option value="address.city">محل کار</option>
          </select>
          <table className="table">
            <thead>
              <tr>
                <th className="bold-header"> # </th>
                <th className="bold-header"> کد ملی </th>
                <th className="bold-header"> نام </th>
                <th className="bold-header"> نام خانوادگی </th>
                <th className="bold-header"> شماره تماس </th>
                <th className="bold-header"> ایمیل </th>
                <th className="bold-header"> رشته و مقطع </th>
                <th className="bold-header"> آخرین مدرک تحصیلی </th>
                <th className="bold-header"> شغل </th>
                <th className="bold-header"> محل کار </th>
              </tr>
            </thead>
            <tbody className="table-body">
              {sortedData.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? "even-row" : "odd-row"}
                >
                  <td className="td">{item.id}</td>
                  <td className="td">{item.name}</td>
                  <td className="td">{item.username}</td>
                  <td className="td">{item.email}</td>
                  <td className="td">{item.phone}</td>
                  <td className="td">{item.phone}</td>
                  <td className="td">{item.phone}</td>
                  <td className="td">{item.phone}</td>
                  <td className="td">{item.phone}</td>
                  <td className="td">{item.address.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="info-btn mb-5">
        <button className="mx-3" onClick={handleDownloadPDF}>
          دانلود Pdf
        </button>
        <button className="mx-3" onClick={handleDownloadExcel}>
          دانلود Excel
        </button>
      </div>
    </div>
  );
};

export default DataTable;
