// Data Menu Awal (Restoran Padang)
let menuRestoran = JSON.parse(localStorage.getItem('menu_padang')) || [
    { id: 1, nama: "Nasi Padang", kategori: "Makanan Utama", harga: 25000, gambar: "https://images.mediadirhub.com/vibe/steamed-rice-with-beef-rendang-fried-egg-and-sambal-on-ceramic-plate.png" },
    { id: 2, nama: "Rendang", kategori: "Makanan Utama", harga: 22000, gambar: "https://images.mediadirhub.com/vibe/slow-cooked-beef-in-dark-coconut-gravy-with-aromatic-spices.png" },
    { id: 3, nama: "Gulai Ayam", kategori: "Makanan Utama", harga: 20000, gambar: "https://images.mediadirhub.com/vibe/chicken-pieces-in-thick-golden-coconut-curry-sauce-with-herbs.png" },
    { id: 4, nama: "Sate Padang", kategori: "Makanan Utama", harga: 23000, gambar: "https://images.mediadirhub.com/vibe/grilled-beef-skewers-with-rich-peanut-sauce-in-small-ceramic-bowl.png" },
    { id: 5, nama: "Telur Balado", kategori: "Lauk Pendamping", harga: 7000, gambar: "https://images.mediadirhub.com/vibe/boiled-eggs-in-vibrant-red-chili-sauce-with-fried-shallots.png" },
    { id: 6, nama: "Perkedel Kentang", kategori: "Lauk Pendamping", harga: 5000, gambar: "https://images.mediadirhub.com/vibe/golden-brown-potato-patties-with-crispy-edges-on-white-plate.png" },
    { id: 7, nama: "Daun Singkong", kategori: "Sayur & Lalapan", harga: 6000, gambar: "https://images.mediadirhub.com/vibe/cassava-leaves-in-creamy-coconut-milk-with-chili-and-lemongrass.png" },
    { id: 8, nama: "Es Jeruk", kategori: "Minuman Tradisional", harga: 8000, gambar: "https://images.mediadirhub.com/vibe/fresh-orange-juice-in-tall-glass-with-ice-cubes-and-citrus-slice.png" },
    { id: 9, nama: "Teh Tarik", kategori: "Minuman Tradisional", harga: 10000, gambar: "https://images.mediadirhub.com/vibe/sweet-tea-poured-between-two-glasses-creating-foam-and-steam.png" }
];

let keranjang = [];
let riwayatTransaksi = JSON.parse(localStorage.getItem('riwayat_transaksi_padang')) || [];
let kategoriAktif = 'Semua';

// Inisialisasi Aplikasi
document.addEventListener('DOMContentLoaded', () => {
    tampilkanMenu();
    perbaruiTampilanKeranjang();
});

// Format Rupiah
function formatRupiah(angka) {
    return 'Rp ' + angka.toLocaleString('id-ID');
}

// Tampilkan Daftar Menu Berdasarkan Kategori
function tampilkanMenu() {
    const container = document.getElementById('daftar-menu');
    container.innerHTML = '';

    // Saring menu berdasarkan filter yang dipilih
    let menuDisaring = menuRestoran;
    if (kategoriAktif === 'Makanan') {
        menuDisaring = menuRestoran.filter(m => m.kategori !== 'Minuman Tradisional');
    } else if (kategoriAktif === 'Minuman') {
        menuDisaring = menuRestoran.filter(m => m.kategori === 'Minuman Tradisional');
    }

    if (menuDisaring.length === 0) {
        container.innerHTML = `<p class="text-slate-400 text-center col-span-2 py-8 text-sm">Tidak ada menu pada kategori ini.</p>`;
        return;
    }

    menuDisaring.forEach((menu) => {
        container.innerHTML += `
            <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col justify-between hover:shadow-md transition">
                <div>
                    <img src="${menu.gambar}" alt="${menu.nama}" class="w-full h-40 object-cover" onerror="this.src='https://images.mediadirhub.com/vibe/steamed-rice-with-beef-rendang-fried-egg-and-sambal-on-ceramic-plate.png'">
                    <div class="p-4">
                        <span class="text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">${menu.kategori}</span>
                        <h4 class="font-bold text-slate-800 text-base mt-2">${menu.nama}</h4>
                        <p class="text-amber-600 font-bold text-sm mt-1">${formatRupiah(menu.harga)}</p>
                    </div>
                </div>
                <div class="p-4 pt-0 flex space-x-2">
                    <button onclick="tambahKeKeranjang(${menu.id})" class="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 rounded-lg transition shadow-sm">
                        <i class="fa-solid fa-plus mr-1"></i> Pesan
                    </button>
                    <button onclick="hapusMenu(${menu.id})" class="bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-2 rounded-lg text-xs transition" title="Hapus Menu">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
}

// Fungsi Filter Kategori
function filterKategori(kategori) {
    kategoriAktif = kategori;

    // Ubah status visual tombol aktif
    const btnSemua = document.getElementById('btn-semua');
    const btnMakanan = document.getElementById('btn-makanan');
    const btnMinuman = document.getElementById('btn-minuman');

    const aktifClass = 'px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 text-white transition shadow-sm';
    const pasifClass = 'px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition';

    btnSemua.className = kategori === 'Semua' ? aktifClass : pasifClass;
    btnMakanan.className = kategori === 'Makanan' ? aktifClass : pasifClass;
    btnMinuman.className = kategori === 'Minuman' ? aktifClass : pasifClass;

    tampilkanMenu();
}

// Tambah Item ke Keranjang
function tambahKeKeranjang(id) {
    const itemMenu = menuRestoran.find(m => m.id === id);
    if (!itemMenu) return;

    const adaDiKeranjang = keranjang.find(item => item.id === id);
    if (adaDiKeranjang) {
        adaDiKeranjang.qty += 1;
    } else {
        keranjang.push({ ...itemMenu, qty: 1 });
    }
    perbaruiTampilanKeranjang();
}

// Ubah Jumlah Item di Keranjang
function ubahQty(id, jumlah) {
    const item = keranjang.find(i => i.id === id);
    if (!item) return;
    
    item.qty += jumlah;
    if (item.qty <= 0) {
        keranjang = keranjang.filter(i => i.id !== id);
    }
    perbaruiTampilanKeranjang();
}

// Perbarui Tampilan Keranjang
function perbaruiTampilanKeranjang() {
    const container = document.getElementById('item-keranjang');
    const badge = document.getElementById('jumlah-item-badge');
    const subtotalEl = document.getElementById('subtotal-harga');
    const totalEl = document.getElementById('total-harga');

    container.innerHTML = '';
    if (keranjang.length === 0) {
        container.innerHTML = `<p class="text-slate-400 text-center py-6 text-sm">Keranjang masih kosong.<br>Silakan pilih menu di samping.</p>`;
        badge.innerText = `0 item`;
        subtotalEl.innerText = formatRupiah(0);
        totalEl.innerText = formatRupiah(0);
        return;
    }

    let totalItemCount = 0;
    let subtotal = 0;

    keranjang.forEach(item => {
        totalItemCount += item.qty;
        subtotal += item.harga * item.qty;

        container.innerHTML += `
            <div class="flex justify-between items-center py-2">
                <div class="flex-1 pr-2">
                    <h5 class="text-xs font-bold text-slate-800">${item.nama}</h5>
                    <p class="text-xs text-amber-600 font-semibold">${formatRupiah(item.harga)}</p>
                </div>
                <div class="flex items-center space-x-2">
                    <button onclick="ubahQty(${item.id}, -1)" class="w-6 h-6 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 font-bold text-xs">-</button>
                    <span class="text-xs font-bold w-4 text-center">${item.qty}</span>
                    <button onclick="ubahQty(${item.id}, 1)" class="w-6 h-6 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 font-bold text-xs">+</button>
                </div>
            </div>
        `;
    });

    badge.innerText = `${totalItemCount} item`;
    subtotalEl.innerText = formatRupiah(subtotal);
    totalEl.innerText = formatRupiah(subtotal);
}

function kosongkanKeranjang() {
    keranjang = [];
    perbaruiTampilanKeranjang();
}

// Proses Transaksi
function prosesPembayaran() {
    if (keranjang.length === 0) {
        alert('Keranjang masih kosong! Silakan pilih menu terlebih dahulu.');
        return;
    }

    const subtotal = keranjang.reduce((sum, item) => sum + (item.harga * item.qty), 0);
    const transaksiBaru = {
        id: 'TRX-' + Date.now().toString().slice(-6),
        waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        tanggal: new Date().toLocaleDateString('id-ID'),
        items: [...keranjang],
        total: subtotal
    };

    riwayatTransaksi.push(transaksiBaru);
    localStorage.setItem('riwayat_transaksi_padang', JSON.stringify(riwayatTransaksi));

    alert(`Pembayaran Berhasil! Total: ${formatRupiah(subtotal)}`);
    keranjang = [];
    perbaruiTampilanKeranjang();
}

// Modal Tambah Menu
function bukaModalTambahMenu() {
    document.getElementById('modal-tambah-menu').classList.remove('hidden');
}

function tutupModalTambahMenu() {
    document.getElementById('modal-tambah-menu').classList.add('hidden');
    document.getElementById('form-tambah-menu').reset();
}

function tambahkanMenuBaru(event) {
    event.preventDefault();
    const nama = document.getElementById('input-nama').value;
    const kategori = document.getElementById('input-kategori').value;
    const harga = parseInt(document.getElementById('input-harga').value);
    const gambar = document.getElementById('input-gambar').value;

    const menuBaru = { id: Date.now(), nama, kategori, harga, gambar };

    menuRestoran.push(menuBaru);
    localStorage.setItem('menu_padang', JSON.stringify(menuRestoran));
    tampilkanMenu();
    tutupModalTambahMenu();
    alert('Menu baru berhasil ditambahkan!');
}

function hapusMenu(id) {
    if (confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
        menuRestoran = menuRestoran.filter(m => m.id !== id);
        localStorage.setItem('menu_padang', JSON.stringify(menuRestoran));
        tampilkanMenu();
    }
}

// Modal Laporan Harian
function bukaModalLaporan() {
    document.getElementById('tanggal-laporan').innerText = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    const totalOmzet = riwayatTransaksi.reduce((sum, t) => sum + t.total, 0);
    const jumlahTx = riwayatTransaksi.length;
    const rataRata = jumlahTx > 0 ? Math.round(totalOmzet / jumlahTx) : 0;

    document.getElementById('laporan-total-omzet').innerText = formatRupiah(totalOmzet);
    document.getElementById('laporan-jumlah-transaksi').innerText = jumlahTx;
    document.getElementById('laporan-rata-rata').innerText = formatRupiah(rataRata);

    const containerRiwayat = document.getElementById('riwayat-transaksi-container');
    containerRiwayat.innerHTML = '';

    if (jumlahTx === 0) {
        containerRiwayat.innerHTML = `<p class="text-slate-400 text-center py-4 text-xs">Belum ada transaksi tercatat hari ini.</p>`;
    } else {
        riwayatTransaksi.slice().reverse().forEach(tx => {
            containerRiwayat.innerHTML += `
                <div class="bg-slate-50 p-3 rounded-lg border text-xs flex justify-between items-center">
                    <div>
                        <span class="font-bold text-slate-800">${tx.id}</span>
                        <span class="text-slate-500 ml-2">${tx.waktu}</span>
                        <p class="text-slate-600 mt-1">${tx.items.map(i => `${i.qty}x ${i.nama}`).join(', ')}</p>
                    </div>
                    <span class="font-bold text-amber-700">${formatRupiah(tx.total)}</span>
                </div>
            `;
        });
    }

    document.getElementById('modal-laporan').classList.remove('hidden');
}

function tutupModalLaporan() {
    document.getElementById('modal-laporan').classList.add('hidden');
}

function cetakLaporanHarian() {
    window.print();
}

function resetLaporanHarian() {
    if (confirm('Yakin ingin mereset seluruh data riwayat transaksi hari ini?')) {
        riwayatTransaksi = [];
        localStorage.removeItem('riwayat_transaksi_padang');
        bukaModalLaporan();
        alert('Laporan harian telah direset.');
    }
}

// Modal Install
function bukaModalInstall() {
    document.getElementById('modal-install').classList.remove('hidden');
}

function tutupModalInstall() {
    document.getElementById('modal-install').classList.add('hidden');
}