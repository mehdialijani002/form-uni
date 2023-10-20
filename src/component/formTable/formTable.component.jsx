import React, { useEffect, useState } from "react";
import qs from "qs";
import { Table, Button } from "antd";
import { saveAs } from "file-saver";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import logo from "../../asset/images/UniversityPicture.png";

const columns = [
  {
    title: " کد ملی",
    dataIndex: "name",
    sorter: true,
    render: (name) => `${name.first} ${name.last}`,
  },
  {
    title: "نام",
    dataIndex: "name",
    sorter: true,
    render: (name) => `${name.first} `,
  },
  {
    title: "نام خانوادگی",
    dataIndex: "name",
    sorter: true,
    render: (name) => ` ${name.last}`,
  },
  {
    title: "شماره تماس",
    dataIndex: "name",
    sorter: true,
    render: (name) => ` ${name.last}`,
  },
  {
    title: "ایمیل",
    dataIndex: "email",
  },
  {
    title: "رشته و مقطع ",
    dataIndex: "name",
    sorter: true,
    render: (name) => ` ${name.last}`,
  },
  {
    title: "اخرین مدرک تحصیلی ",
    dataIndex: "name",
    sorter: true,
    render: (name) => ` ${name.last}`,
  },
  {
    title: "شغل ",
    dataIndex: "name",
    sorter: true,
    render: (name) => ` ${name.last}`,
  },
  {
    title: "محل کار",
    dataIndex: "name",
    sorter: true,
    render: (name) => ` ${name.last}`,
  },
];

const getRandomuserParams = (params) => ({
  results: params.pagination?.pageSize,
  page: params.pagination?.current,
  ...params,
});

const App = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const tableRef = React.createRef();

  const fetchData = () => {
    setLoading(true);
    fetch(
      `https://randomuser.me/api?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then(({ results }) => {
        setData(results);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: 200,
          },
        });
      });
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams)]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const handlePDFDownload = () => {
    printTable(data);
  };

  const handleExcelDownload = () => {
    exportToExcel(data);
  };

  const printTable = useReactToPrint({
    content: () => tableRef.current,
  });

  const exportToExcel = (exportData) => {
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveExcelFile(excelBuffer, "table_data.xlsx");
  };

  const saveExcelFile = (buffer, fileName) => {
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, fileName);
  };

  return (
    <div>
      <div ref={tableRef}>
        <h1 className="text-center table-header mb-3 mt-3">
          <img src={logo} className="table-logo" alt="University Logo" />
          اطلاعات دانشجویان فارغ التحصیل
        </h1>
        <Table
          className="data-table "
          columns={columns}
          rowKey={(record) => record.login.uuid}
          dataSource={data}
          pagination={tableParams.pagination}
          loading={loading}
          onChange={handleTableChange}
        />
      </div>
      <div className="table-buttons">
        <Button className="download-button px-4 " onClick={handlePDFDownload}>
          دانلود PDF
        </Button>
        <Button className="download-button px-4" onClick={handleExcelDownload}>
          دانلود Excel
        </Button>
      </div>
    </div>
  );
};

export default App;
