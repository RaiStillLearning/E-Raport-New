import { useState, useEffect } from 'react';
import axios from 'axios';

interface SiswaFormatif {
  _id?: string;
  nama_siswa: string;
  tp1_kktp: string;
  tp1_tampil: boolean;
  tp2_kktp: string;
  tp2_tampil: boolean;
  tp3_kktp: string;
  tp3_tampil: boolean;
  deskripsi_tertinggi: string;
  deskripsi_terendah: string;
  kelas: string;
}

const AsesmenFormatif = () => {
  const [kelas, setKelas] = useState<string>('X');
  const [data, setData] = useState<SiswaFormatif[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (kelasParam: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/AsesmenFormatif?kelas=${kelasParam}`);
      setData(res.data);
    } catch (err) {
      console.log('Error saat fetch data', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(kelas);
  }, [kelas]);

  const handleAddRow = async () => {
    const newRow: Partial<SiswaFormatif> = {
      nama_siswa: 'Siswa Baru',
      tp1_kktp: '0',
      tp1_tampil: false,
      tp2_kktp: '0',
      tp2_tampil: false,
      tp3_kktp: '0',
      tp3_tampil: false,
      deskripsi_tertinggi: '0',
      deskripsi_terendah: '0',
      kelas,
    };

    try {
      const response = await axios.post('http://localhost:5000/AsesmenFormatif', newRow);
      if (response.status === 201 || response.status === 200) {
        await fetchData(kelas);
      }
    } catch (err: any) {
      console.error('Gagal tambah data:', err);
      alert('Gagal menambahkan data: ' + (err?.response?.data?.message || ''));
    }
  };

  const handleChange = (index: number, field: keyof SiswaFormatif, value: any) => {
    setData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleUpdateRow = async (row: SiswaFormatif) => {
    if (!row._id) return;

    try {
      const response = await axios.patch(`http://localhost:5000/AsesmenFormatif/${row._id}`, row);
      if (response.status === 200) {
        console.log('Berhasil update data');
        await fetchData(kelas);
      }
    } catch (err) {
      console.error('Gagal update data:', err);
      alert('Gagal update data');
    }
  };

  const handleDeleteRow = async (id: string | undefined) => {
    if (!id) return;

    const konfirmasi = confirm('Yakin ingin menghapus data ini?');
    if (!konfirmasi) return;

    try {
      const response = await axios.delete(`http://localhost:5000/AsesmenFormatif/${id}`);
      if (response.status === 200) {
        console.log('Berhasil hapus data');
        await fetchData(kelas);
      }
    } catch (err) {
      console.error('Gagal hapus data:', err);
      alert('Gagal hapus data');
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
        <select className="form-select w-auto" value={kelas} onChange={(e) => setKelas(e.target.value)}>
          <option value="X">X</option>
          <option value="XI">XI</option>
          <option value="XII">XII</option>
        </select>
        <button className="btn btn-success" onClick={handleAddRow}>
          Tambah
        </button>
      </div>

      <div className="responsive-table-wrapper">
        {loading ? (
          <p>Loading data...</p>
        ) : (
          <table className="table table-bordered text-center align-middle w-100">
            <thead className="table-light">
              <tr>
                <th rowSpan={2}>No.</th>
                <th rowSpan={2}>Nama Siswa</th>
                <th colSpan={2}>TP 1</th>
                <th colSpan={2}>TP 2</th>
                <th colSpan={2}>TP 3</th>
                <th rowSpan={2}>Deskripsi Tertinggi</th>
                <th rowSpan={2}>Deskripsi Terendah</th>
                <th rowSpan={2}>Aksi</th>
              </tr>
              <tr>
                <th>KKTP</th>
                <th>Tampil</th>
                <th>KKTP</th>
                <th>Tampil</th>
                <th>KKTP</th>
                <th>Tampil</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={11}>Belum ada data</td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr key={row._id || `${i}-${kelas}`}>
                    <td>{i + 1}</td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={row.nama_siswa}
                        onChange={(e) => handleChange(i, 'nama_siswa', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={row.tp1_kktp}
                        onChange={(e) => handleChange(i, 'tp1_kktp', e.target.value)}
                      />
                    </td>
                    <td>
                     <input
  type="checkbox"
  checked={row.tp1_tampil}
  onChange={async (e) => {
    const checked = e.target.checked;
    handleChange(i, 'tp1_tampil', checked);
    if (row._id) {
      await axios.patch(`http://localhost:5000/AsesmenFormatif/${row._id}`, {
        tp1_tampil: checked,
      });
    }
  }}
/>

                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={row.tp2_kktp}
                        onChange={(e) => handleChange(i, 'tp2_kktp', e.target.value)}
                      />
                    </td>
                    <td>
                    <input
  type="checkbox"
  checked={row.tp2_tampil}
  onChange={async (e) => {
    const checked = e.target.checked;
    handleChange(i, 'tp2_tampil', checked);
    if (row._id) {
      await axios.patch(`http://localhost:5000/AsesmenFormatif/${row._id}`, {
        tp2_tampil: checked,
      });
    }
  }}
/>

                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={row.tp3_kktp}
                        onChange={(e) => handleChange(i, 'tp3_kktp', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
  type="checkbox"
  checked={row.tp3_tampil}
  onChange={async (e) => {
    const checked = e.target.checked;
    handleChange(i, 'tp3_tampil', checked);
    if (row._id) {
      await axios.patch(`http://localhost:5000/AsesmenFormatif/${row._id}`, {
        tp3_tampil: checked,
      });
    }
  }}
/>

                    </td>
                  <td>
  <textarea
    className="form-control"
    style={{ minWidth: '200px', minHeight: '60px', resize: 'vertical', overflowY: 'auto' }}
    value={row.deskripsi_tertinggi}
    onChange={(e) => handleChange(i, 'deskripsi_tertinggi', e.target.value)}
  />
</td>
<td>
  <textarea
    className="form-control"
    style={{ minWidth: '200px', minHeight: '60px', resize: 'vertical', overflowY: 'auto' }}
    value={row.deskripsi_terendah}
    onChange={(e) => handleChange(i, 'deskripsi_terendah', e.target.value)}
  />
</td>

                    <td>
                      <div className="d-flex gap-1 justify-content-center">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleUpdateRow(row)}
                        >
                          Simpan
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteRow(row._id)}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AsesmenFormatif;
