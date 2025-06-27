import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface SiswaData {
  _id?: string;
  nama_siswa: string;
  sumatif1: number;
  sumatif2: number;
  sumatif3: number;
  pts: number;
  pas: number;
  kelas: string;
}

const AsesmenSumatif: React.FC = () => {
  const [kelas, setKelas] = useState<string>('X');
  const [data, setData] = useState<SiswaData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (kelasParam: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/AsesmenSumatif?kelas=${kelasParam}`);
      setData(res.data);
    } catch (err) {
      console.error('Gagal ambil data:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(kelas);
  }, [kelas]);

  const handleChange = async (index: number, field: keyof SiswaData, value: string) => {
  const updatedValue = ['sumatif1', 'sumatif2', 'sumatif3', 'pts', 'pas'].includes(field)
    ? Number(value) || 0
    : value;

  const updatedRow = { ...data[index], [field]: updatedValue };
  const updatedData = [...data];
  updatedData[index] = updatedRow;
  setData(updatedData); // ⬅️ ini harus dipanggil dengan updated clone

  try {
    if (updatedRow._id) {
      // PATCH jika data sudah ada (_id tersedia)
      await axios.patch(`http://localhost:5000/AsesmenSumatif/${updatedRow._id}`, updatedRow);
    } else {
      // POST jika data belum punya _id
      const res = await axios.post(`http://localhost:5000/AsesmenSumatif`, updatedRow);
      updatedData[index]._id = res.data._id;
      setData([...updatedData]); // simpan ulang biar _id ke-save
    }
  } catch (err: any) {
    console.error("Update gagal:", err.response?.data || err.message);
  }
};


  const handleAddRow = async () => {
    const newRow: Partial<SiswaData> = {
      nama_siswa: 'Siswa Baru',
      sumatif1: 0,
      sumatif2: 0,
      sumatif3: 0,
      pts: 0,
      pas: 0,
      kelas,
    };

    try {
      const response = await axios.post('http://localhost:5000/AsesmenSumatif', newRow);
      if (response.status === 201 || response.status === 200) {
        await fetchData(kelas); // refresh data
      }
    } catch (error: any) {
      console.error('Gagal tambah data:', error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
        <select
          className="form-select w-auto"
          value={kelas}
          onChange={(e) => setKelas(e.target.value)}
        >
          <option value="X">X</option>
          <option value="XI">XI</option>
          <option value="XII">XII</option>
        </select>
        <button className="btn btn-success" onClick={handleAddRow}>
          Tambah
        </button>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <table className="table table-bordered text-center align-middle w-100">
          <thead className="table-light">
            <tr>
              <th rowSpan={2}>No.</th>
              <th rowSpan={2}>Nama Siswa</th>
              <th colSpan={3}>Sumatif Akhir Lingkup Materi (Wajib)</th>
              <th rowSpan={2}>NA Lingkup (70%)</th>
              <th colSpan={3}>Sumatif PTS/PAS</th>
              <th rowSpan={2}>Nilai Rapor</th>
            </tr>
            <tr>
              <th>Sumatif 1</th>
              <th>Sumatif 2</th>
              <th>Sumatif 3</th>
              <th>PTS (10%)</th>
              <th>PAS (20%)</th>
              <th>JML</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={10}>Belum ada data</td>
              </tr>
            ) : (
              data.map((row, i) => {
                const { sumatif1 = 0, sumatif2 = 0, sumatif3 = 0, pts = 0, pas = 0 } = row;
                const na = ((sumatif1 + sumatif2 + sumatif3) / 3) * 0.7;
                const jml = pts * 0.1 + pas * 0.2;
                const nilaiRapor = na + jml;

                return (
                  <tr key={row._id || i}>
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
                        type="number"
                        className="form-control"
                        value={sumatif1}
                        onChange={(e) => handleChange(i, 'sumatif1', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={sumatif2}
                        onChange={(e) => handleChange(i, 'sumatif2', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={sumatif3}
                        onChange={(e) => handleChange(i, 'sumatif3', e.target.value)}
                      />
                    </td>
                    <td>{na.toFixed(2)}</td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={pts}
                        onChange={(e) => handleChange(i, 'pts', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={pas}
                        onChange={(e) => handleChange(i, 'pas', e.target.value)}
                      />
                    </td>
                    <td>{jml.toFixed(2)}</td>
                    <td>{nilaiRapor.toFixed(2)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AsesmenSumatif;
