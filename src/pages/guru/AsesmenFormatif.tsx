import React, {useState, useEffect} from 'react'
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
    const [data, setData] = useState<SiswaData[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async (kelasParam: string) => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/AsesmenFormatif?kelas=${kelasParam}`);
            setData(res.data);

        }
        catch (err) {
            console.log("error saat fetch data", err)
            setData([]);

        }
        finally {
            setLoading(false);
        }
    }
     useEffect(() => {
    fetchData(kelas);
  }, [kelas]);

  const handleAddRow = async () => {
    const newRow: Partial<SiswaFormatif> = {
      nama_siswa: 'Siswa Baru',
      tp1_kktp: '',
      tp1_tampil: false,
      tp2_kktp: '',
      tp2_tampil: false,
      tp3_kktp: '',
      tp3_tampil: false,
      deskripsi_tertinggi: '',
      deskripsi_terendah: '',
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
        <button className="btn btn-success" onClick={handleAddRow}>Tambah</button>
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
                <tr><td colSpan={10}>Belum ada data</td></tr>
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
                        onChange={(e) => handleChange(i, 'tp1_tampil', e.target.checked)}
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
                        onChange={(e) => handleChange(i, 'tp2_tampil', e.target.checked)}
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
                        onChange={(e) => handleChange(i, 'tp3_tampil', e.target.checked)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={row.deskripsi_tertinggi}
                        onChange={(e) => handleChange(i, 'deskripsi_tertinggi', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={row.deskripsi_terendah}
                        onChange={(e) => handleChange(i, 'deskripsi_terendah', e.target.value)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default AsesmenFormatif
