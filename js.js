const loginPage = document.getElementById('loginPage');
const dashboardPage = document.getElementById('dashboardPage');
const pageContent = document.getElementById('pageContent');

// --- DATA SIMULASI (Pengganti Database) ---
// Menggunakan localStorage untuk menyimpan data agar tidak hilang saat navigasi.
let dataDokter = JSON.parse(localStorage.getItem('dataDokter')) || [
    { id: 1, nama: "Johan", spesialis: "Hati", alamat: "Karawang", telp: "08987654321" },
];
let dataRekamMedis = JSON.parse(localStorage.getItem('dataRekamMedis')) || [
    { id: 101, tglPeriksa: "2023-03-04", namaPemilik: "Siti", nomorHpPemilik: "0812...", alamatPemilik: "Karawang", namaHewan: "Puss", jenisHewan: "Kucing", rasHewan: "Persia", jenisKelamin: "Betina", umurHewan: "2 th", anamnesa: "Demam tinggi 2 hari.", hr: "120", rr: "40", suhu: "40.1", bb: "3.5", crt: "<2s", mukosa: "Pink pucat", turgor: "Normal", tandaKlinis: "Tidak nafsu makan", diagnosaPasien: "Infeksi virus", keteranganTambahan: "Rawat inap 3 hari.", namaDokter: "Johan", obat: "Bodrex, Dosis: 1/2 tablet", ruang: "Melati 01" },
];
const dataRuang = ["Melati 01", "Melati 02", "Anggrek 01"];

function saveData() {
    localStorage.setItem('dataDokter', JSON.stringify(dataDokter));
    localStorage.setItem('dataRekamMedis', JSON.stringify(dataRekamMedis));
}

// --- Logika Login/Logout ---
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const loginMessage = document.getElementById('loginMessage');

    if (usernameInput === 'kelompok3' && passwordInput === 'satuduatiga') {
        loginPage.style.display = 'none';
        dashboardPage.style.display = 'block';
        renderDashboard(); 
    } else {
        loginMessage.style.display = 'block';
    }
});

window.logout = function() {
    if(confirm('Apakah Anda yakin ingin logout?')) {
        dashboardPage.style.display = 'none';
        loginPage.style.display = 'flex';
        document.getElementById('loginForm').reset();
        document.getElementById('loginMessage').style.display = 'none';
    }
}

// --- UTILITY FUNCTIONS ---
function setActiveLink(page) {
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === page) {
            link.classList.add('active');
        }
    });
}

// B. Dashboard
window.renderDashboard = function() {
    const totalPasien = dataRekamMedis.length; 
    const totalDokter = dataDokter.length;
    const totalRuang = dataRuang.length;

    const content = `
        <h2>Dashboard</h2>
        <hr>
        <div class="row">
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="card card-info p-3">
                    <div class="d-flex align-items-center">
                        <i class="bi bi-person-badge display-4 text-primary me-3"></i>
                        <div>
                            <h4 class="mb-0">${totalDokter}</h4>
                            <p class="text-muted mb-0">Dokter</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="card card-info p-3">
                    <div class="d-flex align-items-center">
                        <i class="bi bi-person display-4 text-success me-3"></i>
                        <div>
                            <h4 class="mb-0">${totalPasien}</h4>
                            <p class="text-muted mb-0">Pasien Terdaftar</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="card card-info p-3">
                    <div class="d-flex align-items-center">
                        <i class="bi bi-hospital display-4 text-warning me-3"></i>
                        <div>
                            <h4 class="mb-0">${totalRuang}</h4>
                            <p class="text-muted mb-0">Ruang</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="card card-info p-3">
                    <div class="d-flex align-items-center">
                        <i class="bi bi-prescription2 display-4 text-danger me-3"></i>
                        <div>
                            <h4 class="mb-0">${totalPasien}</h4>
                            <p class="text-muted mb-0">Jumlah Tindakan/Terapi</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="alert alert-info mt-4">
            Selamat datang kembali di sistem administrasi PET+CLINIC. Data di dashboard disinkronkan.
        </div>
    `;
    pageContent.innerHTML = content;
    setActiveLink('dashboard');
}

// C. Dokter (List & CRUD Logic)
window.renderDokter = function() {
    const content = `
        <div id="dokterList">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h2>Dokter</h2>
                <button class="btn btn-primary-custom" onclick="renderTambahDokter()">
                    <i class="bi bi-plus-lg me-1"></i> Tambah Dokter
                </button>
            </div>
            <hr>
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nama</th>
                            <th>Spesialis</th>
                            <th>Alamat</th>
                            <th>Nomor Telepon</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${dataDokter.map((d, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${d.nama}</td>
                                <td>${d.spesialis}</td>
                                <td>${d.alamat}</td>
                                <td>${d.telp}</td>
                                <td>
                                    <button class="btn btn-sm btn-info text-white" onclick="renderTambahDokter(${d.id})"><i class="bi bi-pencil"></i> Edit</button>
                                    <button class="btn btn-sm btn-danger" onclick="deleteDokter(${d.id})"><i class="bi bi-trash"></i> Hapus</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    pageContent.innerHTML = content;
    setActiveLink('dokter');
}

window.renderTambahDokter = function(idToEdit = null) {
    const dokter = idToEdit ? dataDokter.find(d => d.id === idToEdit) : {};
    const isEdit = !!idToEdit;

    const form = `
        <h2>${isEdit ? 'Edit' : 'Tambah'} Dokter</h2>
        <hr>
        <form id="formDokter" onsubmit="handleDokterSubmit(event, ${idToEdit})">
            <div class="mb-3">
                <label for="namaDokter" class="form-label">Nama</label>
                <input type="text" class="form-control" id="namaDokter" value="${dokter.nama || ''}" required>
            </div>
            <div class="mb-3">
                <label for="nomorHpDokter" class="form-label">Nomor HP</label>
                <input type="tel" class="form-control" id="nomorHpDokter" value="${dokter.telp || ''}" required>
            </div>
            <div class="mb-3">
                <label for="alamatDokter" class="form-label">Alamat</label>
                <textarea class="form-control" id="alamatDokter" rows="3" required>${dokter.alamat || ''}</textarea>
            </div>
            <div class="mb-4">
                <label for="spesialisDokter" class="form-label">Spesialis</label>
                <input type="text" class="form-control" id="spesialisDokter" value="${dokter.spesialis || ''}" required>
            </div>
            
            <button type="submit" class="btn btn-primary-custom me-2">${isEdit ? 'Simpan Perubahan' : 'Simpan'}</button>
            <button type="button" class="btn btn-secondary" onclick="renderDokter()">Kembali</button>
        </form>
    `;
    pageContent.innerHTML = form;
}

window.handleDokterSubmit = function(event, idToEdit) {
    event.preventDefault();
    const nama = document.getElementById('namaDokter').value;
    const telp = document.getElementById('nomorHpDokter').value;
    const alamat = document.getElementById('alamatDokter').value;
    const spesialis = document.getElementById('spesialisDokter').value;

    if (idToEdit) {
        // Edit
        const index = dataDokter.findIndex(d => d.id === idToEdit);
        if (index !== -1) {
            dataDokter[index] = { ...dataDokter[index], nama, telp, alamat, spesialis };
        }
        alert("Data Dokter berhasil diubah!");
    } else {
        // Tambah Baru
        const newId = dataDokter.length > 0 ? Math.max(...dataDokter.map(d => d.id)) + 1 : 1;
        dataDokter.push({ id: newId, nama, telp, alamat, spesialis });
        alert("Data Dokter berhasil ditambahkan!");
    }
    
    saveData();
    renderDokter(); // Kembali ke daftar
}

window.deleteDokter = function(id) {
    if (confirm("Apakah Anda yakin ingin menghapus data Dokter ini?")) {
        dataDokter = dataDokter.filter(d => d.id !== id);
        saveData();
        renderDokter();
        renderDashboard(); // Sinkronkan dashboard
        alert("Data Dokter berhasil dihapus.");
    }
}


// D. Input Rekam Medis (Pasien)
window.renderPasien = function() {
    const content = `
        <h2>Input Rekam Medis Baru</h2>
        <hr>
        <form id="formTambahRekamMedis" onsubmit="handleRekamMedisSubmit(event)">
            
            <h4 class="mt-4 mb-3">Data Pemilik & Jadwal</h4>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="namaPemilik" class="form-label">Nama Pemilik</label>
                    <input type="text" class="form-control" id="namaPemilik" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="nomorHpPemilik" class="form-label">Nomor HP</label>
                    <input type="tel" class="form-control" id="nomorHpPemilik" required>
                </div>
                <div class="col-12 mb-3">
                    <label for="alamatPemilik" class="form-label">Alamat</label>
                    <textarea class="form-control" id="alamatPemilik" rows="2" required></textarea>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="tanggalPeriksa" class="form-label">Tanggal Hewan Periksa</label>
                    <input type="date" class="form-control" id="tanggalPeriksa" value="${new Date().toISOString().substring(0, 10)}" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="namaDokter" class="form-label">Dokter Pemeriksa</label>
                    <select class="form-select" id="namaDokter" required>
                        <option value="">Pilih Dokter</option>
                        ${dataDokter.map(d => `<option value="${d.nama}">${d.nama} (${d.spesialis})</option>`).join('')}
                    </select>
                </div>
            </div>

            <h4 class="mt-4 mb-3">Data Hewan</h4>
            <div class="row">
                <div class="col-md-4 mb-3">
                    <label for="namaHewan" class="form-label">Nama Hewan</label>
                    <input type="text" class="form-control" id="namaHewan" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label for="jenisHewan" class="form-label">Jenis Hewan</label>
                    <input type="text" class="form-control" id="jenisHewan" placeholder="Contoh: Kucing/Anjing" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label for="rasHewan" class="form-label">Ras Hewan</label>
                    <input type="text" class="form-control" id="rasHewan">
                </div>
                <div class="col-md-4 mb-3">
                    <label for="jenisKelamin" class="form-label">Jenis Kelamin</label>
                    <select class="form-select" id="jenisKelamin" required>
                        <option value="">Pilih...</option>
                        <option>Jantan</option>
                        <option>Betina</option>
                    </select>
                </div>
                <div class="col-md-4 mb-3">
                    <label for="umurHewan" class="form-label">Umur Hewan</label>
                    <input type="text" class="form-control" id="umurHewan" placeholder="Contoh: 1 tahun 3 bulan">
                </div>
                <div class="col-12 mb-3">
                    <label for="anamnesa" class="form-label">Anamnesa (Keluhan Utama)</label>
                    <textarea class="form-control" id="anamnesa" rows="3" required></textarea>
                </div>
            </div>

            <h4 class="mt-4 mb-3">Pemeriksaan Fisik</h4>
            <div class="row">
                <div class="col-md-3 mb-3"> <label for="hr" class="form-label">Heart Rate (HR)</label> <input type="text" class="form-control" id="hr"> </div>
                <div class="col-md-3 mb-3"> <label for="rr" class="form-label">Respiration Rate (RR)</label> <input type="text" class="form-control" id="rr"> </div>
                <div class="col-md-3 mb-3"> <label for="suhu" class="form-label">Suhu (°C)</label> <input type="number" step="0.1" class="form-control" id="suhu"> </div>
                <div class="col-md-3 mb-3"> <label for="bb" class="form-label">Berat Badan (BB) (kg)</label> <input type="number" step="0.1" class="form-control" id="bb"> </div>
                <div class="col-md-3 mb-3"> <label for="crt" class="form-label">CRT (Capillary Refill Time)</label> <input type="text" class="form-control" id="crt"> </div>
                <div class="col-md-3 mb-3"> <label for="mukosa" class="form-label">Mukosa</label> <input type="text" class="form-control" id="mukosa"> </div>
                <div class="col-md-3 mb-3"> <label for="turgor" class="form-label">Turgor Kulit</label> <input type="text" class="form-control" id="turgor"> </div>
                <div class="col-md-3 mb-3"> <label for="tandaKlinis" class="form-label">Tanda Klinis Lain</label> <input type="text" class="form-control" id="tandaKlinis"> </div>
            </div>

            <h4 class="mt-4 mb-3">Diagnosa & Tindakan</h4>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="diagnosaPasien" class="form-label">Diagnosa</label>
                    <textarea class="form-control" id="diagnosaPasien" rows="2" required></textarea>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="obatPasien" class="form-label">Obat/Terapi yang Diberikan (Dosis & Keterangan)</label>
                    <textarea class="form-control" id="obatPasien" rows="2"></textarea>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="ruangRawat" class="form-label">Ruang Rawat (Jika Perlu)</label>
                    <select class="form-select" id="ruangRawat">
                        <option value="">Tidak Dirawat</option>
                        ${dataRuang.map(r => `<option value="${r}">${r}</option>`).join('')}
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="keteranganTambahan" class="form-label">Keterangan Tambahan</label>
                    <textarea class="form-control" id="keteranganTambahan" rows="2"></textarea>
                </div>
            </div>

            <button type="submit" class="btn btn-primary-custom me-2 mt-3">Simpan Rekam Medis</button>
        </form>
    `;
    pageContent.innerHTML = content;
    setActiveLink('pasien');
}

window.handleRekamMedisSubmit = function(event) {
    event.preventDefault();

    const form = event.target;
    const newRecord = {
        id: dataRekamMedis.length > 0 ? Math.max(...dataRekamMedis.map(r => r.id)) + 1 : 101,
        tglPeriksa: form.tanggalPeriksa.value,
        namaPemilik: form.namaPemilik.value,
        nomorHpPemilik: form.nomorHpPemilik.value,
        alamatPemilik: form.alamatPemilik.value,
        namaHewan: form.namaHewan.value,
        jenisHewan: form.jenisHewan.value,
        rasHewan: form.rasHewan.value,
        jenisKelamin: form.jenisKelamin.value,
        umurHewan: form.umurHewan.value,
        anamnesa: form.anamnesa.value,
        hr: form.hr.value,
        rr: form.rr.value,
        suhu: form.suhu.value,
        bb: form.bb.value,
        crt: form.crt.value,
        mukosa: form.mukosa.value,
        turgor: form.turgor.value,
        tandaKlinis: form.tandaKlinis.value,
        diagnosaPasien: form.diagnosaPasien.value,
        keteranganTambahan: form.keteranganTambahan.value,
        namaDokter: form.namaDokter.value,
        obat: form.obatPasien.value,
        ruang: form.ruangRawat.value,
    };

    dataRekamMedis.push(newRecord);
    saveData();
    renderDashboard(); // Sinkronkan Dashboard
    form.reset();
    alert("Rekam Medis baru berhasil disimpan!");
    renderRekamMedis(); // Tampilkan data rekam medis
}

// E. Data Rekam Medis (List & CRUD Logic)
window.renderRekamMedis = function() {
    const content = `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h2>Data Rekam Medis</h2>
            <button class="btn btn-primary-custom" onclick="renderPasien()">
                <i class="bi bi-plus-lg me-1"></i> Tambah Rekam Medis
            </button>
        </div>
        <hr>
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Tgl Periksa</th>
                        <th>Nama Pemilik</th>
                        <th>Nama Hewan</th>
                        <th>Jenis Hewan</th>
                        <th>Diagnosa</th>
                        <th>Dokter</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    ${dataRekamMedis.map((rm) => `
                        <tr>
                            <td>${rm.tglPeriksa}</td>
                            <td>${rm.namaPemilik}</td>
                            <td>${rm.namaHewan}</td>
                            <td>${rm.jenisHewan}</td>
                            <td>${rm.diagnosaPasien}</td>
                            <td>${rm.namaDokter}</td>
                            <td>
                                <button class="btn btn-sm btn-info text-white" onclick="viewRekamMedisDetail(${rm.id}, true)"><i class="bi bi-pencil"></i> Edit</button>
                                <button class="btn btn-sm btn-secondary" onclick="viewRekamMedisDetail(${rm.id}, false)"><i class="bi bi-eye"></i> Detail</button>
                                <button class="btn btn-sm btn-danger" onclick="deleteRekamMedis(${rm.id})"><i class="bi bi-trash"></i> Hapus</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    pageContent.innerHTML = content;
    setActiveLink('rekam-medis');
}

window.viewRekamMedisDetail = function(id, isEdit) {
    const record = dataRekamMedis.find(r => r.id === id);
    if (!record) return alert("Data tidak ditemukan.");

    const doctorOptions = dataDokter.map(d => 
        `<option value="${d.nama}" ${record.namaDokter === d.nama ? 'selected' : ''}>${d.nama} (${d.spesialis})</option>`
    ).join('');
    const ruangOptions = dataRuang.map(r => 
        `<option value="${r}" ${record.ruang === r ? 'selected' : ''}>${r}</option>`
    ).join('');
    
    const disabled = isEdit ? '' : 'disabled';

    // Konten Modal (HTML Form yang sama dengan input pasien, tapi diisi data)
    const modalBodyContent = `
        <form id="formEditRekamMedis" data-id="${id}">
            <h5 class="mt-2 mb-3 text-primary">${isEdit ? 'Mode Edit' : 'Mode Lihat Detail'}</h5>
            
            <h6>Data Umum</h6>
            <div class="row">
                <div class="col-md-6 mb-3"><label class="form-label">Tanggal Periksa</label><input type="date" class="form-control" id="modal_tglPeriksa" value="${record.tglPeriksa}" ${disabled}></div>
                <div class="col-md-6 mb-3"><label class="form-label">Dokter</label><select class="form-select" id="modal_namaDokter" ${disabled}><option value="">Pilih Dokter</option>${doctorOptions}</select></div>
                <div class="col-md-6 mb-3"><label class="form-label">Nama Pemilik</label><input type="text" class="form-control" id="modal_namaPemilik" value="${record.namaPemilik}" ${disabled}></div>
                <div class="col-md-6 mb-3"><label class="form-label">Nomor HP</label><input type="tel" class="form-control" id="modal_nomorHpPemilik" value="${record.nomorHpPemilik}" ${disabled}></div>
                <div class="col-12 mb-3"><label class="form-label">Alamat Pemilik</label><textarea class="form-control" id="modal_alamatPemilik" rows="2" ${disabled}>${record.alamatPemilik}</textarea></div>
            </div>

            <h6>Data Hewan & Anamnesa</h6>
            <div class="row">
                <div class="col-md-4 mb-3"><label class="form-label">Nama Hewan</label><input type="text" class="form-control" id="modal_namaHewan" value="${record.namaHewan}" ${disabled}></div>
                <div class="col-md-4 mb-3"><label class="form-label">Jenis Hewan</label><input type="text" class="form-control" id="modal_jenisHewan" value="${record.jenisHewan}" ${disabled}></div>
                <div class="col-md-4 mb-3"><label class="form-label">Ras Hewan</label><input type="text" class="form-control" id="modal_rasHewan" value="${record.rasHewan}" ${disabled}></div>
                <div class="col-md-4 mb-3"><label class="form-label">J. Kelamin</label><input type="text" class="form-control" id="modal_jenisKelamin" value="${record.jenisKelamin}" ${disabled}></div>
                <div class="col-md-4 mb-3"><label class="form-label">Umur Hewan</label><input type="text" class="form-control" id="modal_umurHewan" value="${record.umurHewan}" ${disabled}></div>
                <div class="col-12 mb-3"><label class="form-label">Anamnesa (Keluhan)</label><textarea class="form-control" id="modal_anamnesa" rows="3" ${disabled}>${record.anamnesa}</textarea></div>
            </div>
            
            <h6>Pemeriksaan Fisik</h6>
            <div class="row">
                <div class="col-md-3 mb-3"><label class="form-label">HR</label><input type="text" class="form-control" id="modal_hr" value="${record.hr}" ${disabled}></div>
                <div class="col-md-3 mb-3"><label class="form-label">RR</label><input type="text" class="form-control" id="modal_rr" value="${record.rr}" ${disabled}></div>
                <div class="col-md-3 mb-3"><label class="form-label">Suhu</label><input type="text" class="form-control" id="modal_suhu" value="${record.suhu}" ${disabled}></div>
                <div class="col-md-3 mb-3"><label class="form-label">BB</label><input type="text" class="form-control" id="modal_bb" value="${record.bb}" ${disabled}></div>
                <div class="col-md-3 mb-3"><label class="form-label">CRT</label><input type="text" class="form-control" id="modal_crt" value="${record.crt}" ${disabled}></div>
                <div class="col-md-3 mb-3"><label class="form-label">Mukosa</label><input type="text" class="form-control" id="modal_mukosa" value="${record.mukosa}" ${disabled}></div>
                <div class="col-md-3 mb-3"><label class="form-label">Turgor</label><input type="text" class="form-control" id="modal_turgor" value="${record.turgor}" ${disabled}></div>
                <div class="col-md-3 mb-3"><label class="form-label">Tanda Klinis</label><input type="text" class="form-control" id="modal_tandaKlinis" value="${record.tandaKlinis}" ${disabled}></div>
            </div>

            <h6>Diagnosa & Tindakan</h6>
            <div class="row">
                <div class="col-md-6 mb-3"><label class="form-label">Diagnosa</label><textarea class="form-control" id="modal_diagnosaPasien" rows="2" ${disabled}>${record.diagnosaPasien}</textarea></div>
                <div class="col-md-6 mb-3"><label class="form-label">Obat/Terapi</label><textarea class="form-control" id="modal_obatPasien" rows="2" ${disabled}>${record.obat}</textarea></div>
                <div class="col-md-6 mb-3"><label class="form-label">Ruang Rawat</label><select class="form-select" id="modal_ruangRawat" ${disabled}><option value="">Tidak Dirawat</option>${ruangOptions}</select></div>
                <div class="col-md-6 mb-3"><label class="form-label">Keterangan Tambahan</label><textarea class="form-control" id="modal_keteranganTambahan" rows="2" ${disabled}>${record.keteranganTambahan}</textarea></div>
            </div>
        </form>
    `;

    document.getElementById('rekamMedisModalLabel').textContent = isEdit ? 'Edit Rekam Medis #' + id : 'Detail Rekam Medis #' + id;
    document.getElementById('rekamMedisModalBody').innerHTML = modalBodyContent;
    document.getElementById('modalSaveBtn').style.display = isEdit ? 'block' : 'none';

    // Event Listener untuk tombol Simpan di modal
    if (isEdit) {
        document.getElementById('modalSaveBtn').onclick = () => saveRekamMedisEdit(id);
    }

    const modal = new bootstrap.Modal(document.getElementById('rekamMedisModal'));
    modal.show();
}

window.saveRekamMedisEdit = function(id) {
    const index = dataRekamMedis.findIndex(r => r.id === id);
    if (index === -1) return;

    const form = document.getElementById('formEditRekamMedis');
    
    // Update data dari form modal
    dataRekamMedis[index] = {
        ...dataRekamMedis[index],
        tglPeriksa: form.modal_tglPeriksa.value,
        namaPemilik: form.modal_namaPemilik.value,
        nomorHpPemilik: form.modal_nomorHpPemilik.value,
        alamatPemilik: form.modal_alamatPemilik.value,
        namaHewan: form.modal_namaHewan.value,
        jenisHewan: form.modal_jenisHewan.value,
        rasHewan: form.modal_rasHewan.value,
        jenisKelamin: form.modal_jenisKelamin.value,
        umurHewan: form.modal_umurHewan.value,
        anamnesa: form.modal_anamnesa.value,
        hr: form.modal_hr.value,
        rr: form.modal_rr.value,
        suhu: form.modal_suhu.value,
        bb: form.modal_bb.value,
        crt: form.modal_crt.value,
        mukosa: form.modal_mukosa.value,
        turgor: form.modal_turgor.value,
        tandaKlinis: form.modal_tandaKlinis.value,
        diagnosaPasien: form.modal_diagnosaPasien.value,
        keteranganTambahan: form.modal_keteranganTambahan.value,
        namaDokter: form.modal_namaDokter.value,
        obat: form.modal_obatPasien.value,
        ruang: form.modal_ruangRawat.value,
    };

    saveData();
    bootstrap.Modal.getInstance(document.getElementById('rekamMedisModal')).hide();
    renderRekamMedis();
    alert("Perubahan Rekam Medis berhasil disimpan!");
}

window.deleteRekamMedis = function(id) {
    if (confirm("Apakah Anda yakin ingin menghapus Rekam Medis ini?")) {
        dataRekamMedis = dataRekamMedis.filter(r => r.id !== id);
        saveData();
        renderRekamMedis();
        renderDashboard(); // Sinkronkan dashboard
        alert("Rekam Medis berhasil dihapus.");
    }
}

// F. Ruang
window.renderRuang = function() {
    const content = `
        <h2>Data Ruangan Klinik</h2>
        <hr>
        <p>Menu ini hanya menampilkan data ruangan yang tersedia.</p>
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nama Ruangan</th>
                        <th>Status (Simulasi)</th>
                    </tr>
                </thead>
                <tbody>
                    ${dataRuang.map((r, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${r}</td>
                            <td>${index % 2 === 0 ? '<span class="badge bg-success">Tersedia</span>' : '<span class="badge bg-warning text-dark">Terisi</span>'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        <button class="btn btn-primary-custom mt-3"><i class="bi bi-plus-lg me-1"></i> Tambah Ruangan (Simulasi)</button>
    `;
    pageContent.innerHTML = content;
    setActiveLink('ruang');
}

// G. Laporan
window.renderLaporan = function() {
    const content = `
        <h2>Laporan Rekam Medis</h2>
        <hr>
        <p>Pilih rentang waktu untuk mengunduh laporan Rekam Medis:</p>
        <div class="row g-3">
            <div class="col-md-4">
                <label for="startDate" class="form-label">Tanggal Mulai</label>
                <input type="date" class="form-control" id="startDate">
            </div>
            <div class="col-md-4">
                <label for="endDate" class="form-label">Tanggal Akhir</label>
                <input type="date" class="form-control" id="endDate">
            </div>
            <div class="col-md-4 align-self-end">
                <button class="btn btn-success w-100" onclick="downloadReport()">
                    <i class="bi bi-download me-2"></i> Unduh Laporan
                </button>
            </div>
        </div>
        <div class="mt-4">
            <button class="btn btn-outline-primary me-2" onclick="setReportRange(7)">1 Minggu Terakhir</button>
            <button class="btn btn-outline-primary me-2" onclick="setReportRange(30)">1 Bulan Terakhir</button>
        </div>
        <p class="text-muted mt-4">Catatan: Proses unduhan ini adalah simulasi. Dalam aplikasi nyata, ini akan menghasilkan file PDF/Excel.</p>
    `;
    pageContent.innerHTML = content;
    setActiveLink('laporan');
}

window.setReportRange = function(days) {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - days);

    document.getElementById('endDate').value = today.toISOString().substring(0, 10);
    document.getElementById('startDate').value = start.toISOString().substring(0, 10);
    alert(`Rentang waktu diatur ke ${days} hari terakhir.`);
}

window.downloadReport = function() {
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;
    
    if (!start || !end) {
        return alert("Mohon pilih tanggal mulai dan tanggal akhir.");
    }

    const filteredData = dataRekamMedis.filter(r => 
        r.tglPeriksa >= start && r.tglPeriksa <= end
    );

    alert(`Simulasi Unduh Laporan:\nRentang: ${start} sampai ${end}\nJumlah Data Ditemukan: ${filteredData.length} entri.\n\n(Laporan akan diunduh dalam format PDF/Excel di sistem nyata.)`);
}

// --- Inisialisasi Navigasi ---
const pageMap = {
    'dashboard': renderDashboard,
    'dokter': renderDokter,
    'pasien': renderPasien,
    'ruang': renderRuang,
    'rekam-medis': renderRekamMedis,
    'laporan': renderLaporan
};

document.querySelectorAll('.sidebar .nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const page = this.getAttribute('data-page');
        pageMap[page]();
    });
});