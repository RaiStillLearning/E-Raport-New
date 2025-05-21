// src/components/AsesmenSumatif.jsx
import React, { useState } from 'react';
import axios from 'axios';

const AsesmenSumatif = () => {
  const [kelas, setKelas] = useState('XII');
  const [data, setData] = useState([]);

  const handleAddRow = async () => {
    const newRow = {
      nama: '',
      sumatif1: '',
      sumatif2: '',
      sumatif3: '',
      pts: '',
      pas: '',
      kelas,
    };

    try {
      const response = await axios.post('http://localhost:8000/Asesmensumatif', newRow);
      console.log('Data berhasil dikirim:', response.data);

      // Gunakan data dari response kalau tersedia, atau newRow sebagai fallback
      setData((prev) => [...prev, response.data || newRow]);
    } catch (error) {
      console.error('Gagal mengirim data:', error);
    }
  };

  const handleChange = (index, field, value) => {
    setData((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  return (
    <div className="container mt-4">
      {/* Header: Kelas dan Tombol Tambah */}
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

      {/* Tabel Asesmen */}
      <div className="responsive-table-wrapper">
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
      <td colSpan={10} data-label="Info">Belum ada data</td>
    </tr>
  ) : (
    data.map((row, i) => {
      const s1 = parseFloat(row.sumatif1) || 0;
      const s2 = parseFloat(row.sumatif2) || 0;
      const s3 = parseFloat(row.sumatif3) || 0;
      const pts = parseFloat(row.pts) || 0;
      const pas = parseFloat(row.pas) || 0;

      const na = ((s1 + s2 + s3) / 3) * 0.7;
      const ptsScore = pts * 0.1;
      const pasScore = pas * 0.2;
      const jml = ptsScore + pasScore;
      const nilaiRapor = na + jml;

      return (
        <tr key={i}>
          <td data-label="No.">{i + 1}</td>
          <td data-label="Nama Siswa">
            <input
              type="text"
              className="form-control"
              value={row.nama}
              onChange={(e) => handleChange(i, 'nama', e.target.value)}
            />
          </td>
          <td data-label="Sumatif 1">
            <input
              type="number"
              className="form-control"
              value={row.sumatif1}
              onChange={(e) => handleChange(i, 'sumatif1', e.target.value)}
            />
          </td>
          <td data-label="Sumatif 2">
            <input
              type="number"
              className="form-control"
              value={row.sumatif2}
              onChange={(e) => handleChange(i, 'sumatif2', e.target.value)}
            />
          </td>
          <td data-label="Sumatif 3">
            <input
              type="number"
              className="form-control"
              value={row.sumatif3}
              onChange={(e) => handleChange(i, 'sumatif3', e.target.value)}
            />
          </td>
          <td data-label="NA Lingkup (70%)">{na.toFixed(2)}</td>
          <td data-label="PTS (10%)">
            <input
              type="number"
              className="form-control"
              value={row.pts}
              onChange={(e) => handleChange(i, 'pts', e.target.value)}
            />
          </td>
          <td data-label="PAS (20%)">
            <input
              type="number"
              className="form-control"
              value={row.pas}
              onChange={(e) => handleChange(i, 'pas', e.target.value)}
            />
          </td>
          <td data-label="JML">{jml.toFixed(2)}</td>
          <td data-label="Nilai Rapor">{nilaiRapor.toFixed(2)}</td>
        </tr>
      );
    })
  )}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default AsesmenSumatif;
