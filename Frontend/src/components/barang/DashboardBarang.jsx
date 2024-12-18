import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useTable, usePagination, useFilters } from "react-table";
import AddBarangModal from "./AddBarangModal";
import { AuthContext } from "../../context/AuthContect";
import EditBarangModal from "./EditBarangModal";
import { FaFileExcel } from "react-icons/fa";
import { BiPlusCircle } from "react-icons/bi";
import { data } from "react-router-dom";
import { FaFilePdf } from "react-icons/fa6";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const DashboardBarang = () => {
  const [barang, setBarang] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    namaBarang: "",
    kategori: "",
    stok: 0,
    hargaBeli: 0,
    hargaJual: 0,
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [barangToEdit, setBarangToEdit] = useState(null);
  const [errorAdd, setErrorAdd] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [barangToDelete, setBarangToDelete] = useState(null);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [showAddSuccessModal, setShowAddSuccessModal] = useState(false);
  const [errorCSV, setErrorCSV] = useState("");
  const [showEditSuccessModal, setShowEditSuccessModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importSuccess, setImportSuccess] = useState(false); 

  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const token = user?.token;
  console.log(user.role);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/barang/all"
        );
        setBarang(response.data.barang);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);


  const handleAddBarang = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/barang/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setShowModal(false);
      setFormData({
        namaBarang: "",
        kategori: "",
        stok: 0,
        hargaBeli: 0,
        hargaJual: 0,
      });
      setBarang((prev) => [...prev, response.data.barang]);
      setShowAddSuccessModal(true);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setErrorAdd(err.response.data.message); 
      } else {
        setErrorAdd("Terjadi kesalahan, coba lagi nanti.");
      }
    }
  };
  const styles = StyleSheet.create({
    page: {
      padding: 20,
      fontSize: 12,
    },
    title: {
      fontSize: 18,
      textAlign: "center",
      marginBottom: 20,
    },
    table: {
      display: "table",
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#000",
    },
    tableRow: {
      flexDirection: "row",
    },
    tableCell: {
      flex: 1,
      borderWidth: 1,
      borderColor: "#000",
      padding: 5,
    },
  });

  const BarangPDF = ({ data }) => (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Daftar Barang</Text>
 
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Kode Barang</Text>
          <Text style={styles.tableCell}>Nama Barang</Text>
          <Text style={styles.tableCell}>Kategori</Text>
          <Text style={styles.tableCell}>Stok</Text>
          <Text style={styles.tableCell}>Harga Jual</Text>
        </View>

        {data.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.kodeBarang}</Text>
            <Text style={styles.tableCell}>{item.namaBarang}</Text>
            <Text style={styles.tableCell}>{item.kategori}</Text>
            <Text style={styles.tableCell}>{item.stok}</Text>
            <Text style={styles.tableCell}>{item.hargaJual}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );

  // Handle deleting barang
  const handleImportBarang = async () => {
    if (!importFile) {
      alert("Pilih file CSV terlebih dahulu!");
      return;
    }

    const formData = new FormData();
    formData.append("file", importFile);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/barang/import",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBarang((prev) => [...prev, ...response.data.data]); 
      setImportFile(null);
      setImportSuccess(true);
      set
      window.location.reload(); 
    } catch (error) {
      setErrorCSV(error.response.data.message);
      console.error("Error importing data:", error);
    }
  };


  const columns = React.useMemo(() => {
    const baseColumns = [
      {
        Header: "Kode Barang",
        accessor: "kodeBarang",
      },
      {
        Header: "Nama Barang",
        accessor: "namaBarang",
        filter: "includes",
      },
      {
        Header: "Kategori",
        accessor: "kategori",
      },
      {
        Header: "Stok",
        accessor: "stok",
      },
      {
        Header: "Harga Beli",
        accessor: (row) =>
          new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(row.hargaBeli),
      },
      {
        Header: "Harga Jual",
        accessor: (row) =>
          new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(row.hargaJual),
      },
      {
        Header: "Tanggal Masuk",
        accessor: (row) => {
          const date = new Date(row.date);
          return date.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          });
        },
      },
    ];

 
    if (user.role == "admin") {
      baseColumns.push({
        Header: "Aksi",
        Cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={() => {
                setBarangToEdit(row.original); 
                setShowEditModal(true); 
              }}
            >
              Edit
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              onClick={() => {
                setBarangToDelete(row.original._id);
                setShowDeleteModal(true);
              }}
            >
              Hapus
            </button>
          </div>
        ),
      });
    }

    return baseColumns;
  }, [user.role, barang]); 

  const handleDeleteBarang = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/barang/delete/${barangToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setBarang(barang.filter((item) => item._id !== barangToDelete));

      setShowDeleteModal(false); // Close modal after deletion
      setShowDeleteSuccessModal(true); // Show delete success modal
    } catch (error) {
      console.error("Error deleting barang:", error);
      alert("Gagal menghapus barang");
      console.log("Halo", barangToDelete);
    }
  };
  const filteredBarang = React.useMemo(() => {
    return barang.filter((item) =>
      item.namaBarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kategori.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [barang, searchTerm]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { pageIndex, pageSize },
    canPreviousPage,
    canNextPage,
    pageOptions,
    page,
    nextPage,
    previousPage,
  } = useTable(
    {
      columns,
      data: filteredBarang, // Gunakan data yang sudah difilter
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useFilters,
    usePagination
  );
  const maintTableData = page;
  const remainingData = barang.slice((pageIndex + 1) * pageSize);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  return (
    <div className="dashboard-barang-container">
      <div className="header flex justify-between items-center mt-4 mb-4">
        <div className=" flex gap-2 items-center">
          <h1 className="text-xl font-bold">Daftar Barang</h1>
          {user.role === "admin" && (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={() => setShowModal(true)}
            >
              Tambah Barang
            </button>
          )}
        </div>
        {user.role === "admin" && (
          <div className="flex flex-col sm:flex-row  items-center gap-12">
            {/* Tambah Barang Button */}

            {/* Upload CSV Section */}
            <div className="flex items-center gap-3">
              <label
                htmlFor="upload-file"
                className="bg-green-400 text-white px-4 py-2 rounded-md cursor-pointer flex items-center gap-2 hover:bg-green-500"
              >
                <FaFileExcel /> Unggah CSV
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setImportFile(e.target.files[0])}
                className="hidden"
                id="upload-file"
              />

              {importFile && (
                <span className="text-sm text-gray-600">
                  File: {importFile.name}
                </span>
              )}

              <button
                className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ${
                  !importFile ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleImportBarang}
                disabled={!importFile}
              >
                Import Barang
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table for barang */}
      <div className="table-container overflow-x-auto">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Cari nama barang..."
          className="border px-4 py-2 rounded-md mb-3"
        />
        <PDFDownloadLink
          document={<BarangPDF data={barang} />}
          fileName="Daftar_Barang.pdf"
          className="bg-red-500 ml-2 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          {({ loading }) => (loading ? "Generating PDF..." : "Download PDF")}
        </PDFDownloadLink>
        <table
          {...getTableProps()}
          className="table-auto border-collapse w-full"
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                className="bg-gray-200"
              >
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    className="border px-4 py-2 text-left"
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className="hover:bg-gray-100 bg-white"
                >
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="border px-4 py-2">
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex items-center justify-center gap-4 mt-6">
          {filteredBarang.length > 0 && (
            <div className="pagination-controls flex justify-between items-center mt-4 px-4">
              <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
              >
                Previous
              </button>
              <span className="text-lg">
                Page <strong>{pageIndex + 1}</strong> of {pageOptions.length}
              </span>
              <button
                onClick={() => nextPage()}
                disabled={!canNextPage}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Add Barang */}
      <AddBarangModal
        errorAdd={errorAdd}
        showModal={showModal}
        setShowModal={setShowModal}
        formData={formData}
        setFormData={setFormData}
        handleAddBarang={handleAddBarang}
      />
      {/* Modal Edit Barang */}
      <EditBarangModal
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        barangToEdit={barangToEdit}
        setBarangToEdit={setBarangToEdit}
        setBarang={setBarang} // Update data barang setelah diedit
        setShowEditSuccessModal={setShowEditSuccessModal}
      />

      {/* Modal Add Success */}
      {showAddSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-green-500 bg-opacity-75 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4 text-green-600">
              Barang Berhasil Ditambahkan!
            </h2>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              onClick={() => setShowAddSuccessModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
      {errorCSV && (
        <div className="fixed inset-0 flex items-center justify-center bg-red-500 bg-opacity-75 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4 text-red-600">Error!</h2>
            <p>{errorCSV}</p>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              onClick={() => setErrorCSV("")}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Modal Delete Success */}
      {showDeleteSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-green-500 bg-opacity-75 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4 text-green-600">
              Barang Berhasil Dihapus!
            </h2>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              onClick={() => setShowDeleteSuccessModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Modal Delete Confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Konfirmasi Penghapusan</h2>
            <p>Apakah Anda yakin ingin menghapus barang ini?</p>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={() => setShowDeleteModal(false)}
              >
                Batal
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                onClick={handleDeleteBarang}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
      {showEditSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-green-500 bg-opacity-75 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4 text-green-600">
              Barang Berhasil Di Updated!
            </h2>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              onClick={() => setShowEditSuccessModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
      {importSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-green-500 bg-opacity-75 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4 text-green-600">
              Data Barang Berhasil Diimpor!
            </h2>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              onClick={() => setImportSuccess(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardBarang;
