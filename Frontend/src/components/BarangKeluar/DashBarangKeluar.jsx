import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useTable, useFilters, usePagination } from "react-table";
import AddBarangKeluarModal from "./AddBarangKeluarModal";
import EditBarangKeluarModal from "./EditBarangKeluarModal";
import { AuthContext } from "../../context/AuthContect";
import DetailBarangKeluar from "./DetailBarangKeluar";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
const DashBarangKeluar = () => {
  const [barangMasuk, setBarangMasuk] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddBarangSucces, setAddBarangSucces] = useState(false);
  const [barangMasukToEdit, setBarangMasukToEdit] = useState(null);
  const [showEditMasukModal, setShowEditMasukModal] = useState(false);
  const [showEditSuccessModal, setShowEditSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [barangToDelete, setBarangToDelete] = useState(null);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useContext(AuthContext);

  const [barangDetail, setBarangDetail] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/barangKeluar/all"
        );
        setBarangMasuk(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddSuccess = (newBarangMasuk) => {
    setBarangMasuk((prev) => [newBarangMasuk, ...prev]);
  };

  const columns = React.useMemo(() => {
    const baseColums = [
      {
        Header: "Kode Barang",
        accessor: "kodeBarang",
      },
      {
        Header: "Nama Barang",
        accessor: "namaBarang",
      },
      {
        Header: "Stok",
        accessor: "quantity",
      },
      {
        Header: "Profit",
        accessor: (row) =>
          new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(row.profit),
      },
      {
        Header: "Costumer",
        accessor: "customer",
      },
      {
        Header: "Tanggal Keluar",
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

    if (user.role === "admin") {
      baseColums.push({
        Header: "Aksi",
        Cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={() => {
                setBarangMasukToEdit(row.original);
                setShowEditMasukModal(true);
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
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              onClick={() => {
                setBarangDetail(row.original); // Set barang detail
                setIsDetailModalOpen(true); // Open modal
              }}
            >
              Lihat
            </button>
          </div>
        ),
      });
    }

    return baseColums;
  }, [user.role, barangMasuk]);

  const handleDeleteBarang = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/barangKeluar/delete/${barangToDelete}`
      );
      setBarangMasuk(barangMasuk.filter((item) => item._id !== barangToDelete));

      setShowDeleteModal(false); // Close modal after deletion
      setShowDeleteSuccessModal(true); // Show delete success modal
    } catch (error) {
      console.error("Error deleting barang:", error);
      alert("Gagal menghapus barang");
      console.log("Halo", barangToDelete);
    }
  };
  const filteredBarang = React.useMemo(() => {
    return barangMasuk.filter((item) =>
      item.namaBarang.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, barangMasuk]);

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
      data: filteredBarang, 
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useFilters,
    usePagination
  );
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

  // Komponen untuk membuat PDF
  const BarangPDF = ({ data }) => (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Daftar Barang Keluar</Text>
        {/* Header tabel */}
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Kode Barang</Text>
          <Text style={styles.tableCell}>Nama Barang</Text>
          <Text style={styles.tableCell}>quantity</Text>
          <Text style={styles.tableCell}>customer</Text>
          <Text style={styles.tableCell}>profit</Text>
          <Text style={styles.tableCell}>Date</Text>
        </View>
        {/* Data tabel */}
        {data.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.kodeBarang}</Text>
            <Text style={styles.tableCell}>{item.namaBarang}</Text>
            <Text style={styles.tableCell}>{item.quantity}</Text>
            <Text style={styles.tableCell}>{item.customer}</Text>
            <Text style={styles.tableCell}>{item.profit}</Text>
            <Text style={styles.tableCell}>{item.date}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );

  return (
    <div className="dashboard-barang-container">
      <div className="header flex justify-between items-center mt-4 mb-4">
        <div className="flex gap-2 items-center">
          <h1 className="text-xl font-bold">Daftar Barang Keluar</h1>
          {user.role === "admin" && (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={() => setIsModalOpen(true)}
            >
              Tambah Barang
            </button>
          )}
        </div>
      </div>
      <div className="table-container overflow-x-auto">
        <input
          type="text"
          placeholder="Cari barang..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 mb-4"
        />
        <PDFDownloadLink
          document={<BarangPDF data={barangMasuk} />}
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
            <div className="pagination-controls gap-4 flex justify-between items-center mt-4 px-4">
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
      <DetailBarangKeluar
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        barangDetail={barangDetail}
      />
      <AddBarangKeluarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddSuccess}
        setAddBarangSucces={setAddBarangSucces}
      />
      <EditBarangKeluarModal
        showModal={showEditMasukModal}
        setShowModal={setShowEditMasukModal}
        barangMasukToEdit={barangMasukToEdit}
        setBarangMasukToEdit={setBarangMasukToEdit}
        setBarangMasuk={setBarangMasuk}
        setShowEditSuccessModal={setShowEditSuccessModal}
      />
      {showEditSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-green-500 bg-opacity-75 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4 text-green-600">
              Barang Masuk Berhasil Di edit!
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

      {showAddBarangSucces && (
        <div className="fixed inset-0 flex items-center justify-center bg-green-500 bg-opacity-75 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4 text-green-600">
              Barang Keluar Berhasil Ditambahkan!
            </h2>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              onClick={() => setAddBarangSucces(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
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
    </div>
  );
};

export default DashBarangKeluar;
