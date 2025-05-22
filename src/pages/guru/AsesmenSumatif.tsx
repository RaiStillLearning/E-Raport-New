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

 const handleAddRow = async () => {
  const newRow: Partial<SiswaData> = {
    nama_siswa: 'Siswa Baru', // <- Ganti dari 'masukkan nama siswa' ke string yang valid
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
      await fetchData(kelas);
    }
  } catch (error: any) {
    console.error('Gagal mengirim data:', error);
    alert('Gagal tambah data, coba lagi.\n' + (error?.response?.data?.message || ''));
  }
};


  const handleChange = (index: number, field: keyof SiswaData, value: string) => {
    setData((prev) => {
      const updated = [...prev];
      const updatedValue = ['sumatif1', 'sumatif2', 'sumatif3', 'pts', 'pas'].includes(field)
        ? Number(value)
        : value;
      updated[index] = { ...updated[index], [field]: updatedValue };
      return updated;
    });
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
        <button className="btn btn-primary" onClick={handleAddRow}>
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
                  const s1 = row.sumatif1 || 0;
                  const s2 = row.sumatif2 || 0;
                  const s3 = row.sumatif3 || 0;
                  const pts = row.pts || 0;
                  const pas = row.pas || 0;

                  const na = ((s1 + s2 + s3) / 3) * 0.7;
                  const ptsScore = pts * 0.1;
                  const pasScore = pas * 0.2;
                  const jml = ptsScore + pasScore;
                  const nilaiRapor = na + jml;

                  return (
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
                          type="number"
                          className="form-control"
                          value={row.sumatif1}
                          onChange={(e) => handleChange(i, 'sumatif1', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={row.sumatif2}
                          onChange={(e) => handleChange(i, 'sumatif2', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={row.sumatif3}
                          onChange={(e) => handleChange(i, 'sumatif3', e.target.value)}
                        />
                      </td>
                      <td>{na.toFixed(2)}</td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={row.pts}
                          onChange={(e) => handleChange(i, 'pts', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={row.pas}
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
    </div>
  );
};

export default AsesmenSumatif;
