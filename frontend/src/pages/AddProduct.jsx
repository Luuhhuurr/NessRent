import { useState } from 'react';
import { Link } from 'react-router-dom';

const categories = ['Elektronik', 'Kendaraan', 'Alat Tulis', 'Musik', 'Hobi'];
const conditions = ['Sangat Baik', 'Baik', 'Cukup'];

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Elektronik',
    condition: 'Sangat Baik',
    pricePerDay: '',
    stock: '1',
    description: '',
    specifications: '',
  });
  const [uploadedImages, setUploadedImages] = useState([
    {
      id: 1,
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLhlAjr8vE08BaV6mpLA0rziZMRA_NgpvhjztJzpb9hr90fJeP0M2yHNvAeiPFj8QAAhlTW6Ex4VTMkQ4ec3H8_LWdHmAnEAswB9trhl2wuwE3OlwSIZBhbNMnCyxWFdG7-ftVPWB8pHbEAydrE1qltunXr7f0Ra3OGe9ic8_utb2BTQvEfatxyp2c5Zz3dsIgGnB4JmYSSwf8He41ilwsuk3lG-LQoeh0yy4A-SliswnQy3pDCeYMaUgHk24A9ql2bExo7eY67_QA',
      isMain: true,
    },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Product data:', formData, uploadedImages);
  };

  const progress = 75; // Mock progress

  return (
    <>
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-[var(--spacing-md)] py-[var(--spacing-md)] max-w-[1280px] mx-auto shadow-sm bg-surface">
        <div className="flex items-center gap-[var(--spacing-xl)]">
          <Link to="/" className="font-heading text-h2 text-primary">NesRent</Link>
        </div>
        <div className="flex items-center gap-[var(--spacing-md)]">
          <button className="bg-primary-container text-on-primary-container text-label-md px-[var(--spacing-md)] py-[var(--spacing-xs)] rounded-[var(--radius-xl)] font-bold active:scale-95 duration-150">
            Add Product
          </button>
          <span className="material-symbols-outlined text-secondary cursor-pointer hover:text-primary transition-colors">notifications</span>
          <span className="material-symbols-outlined text-secondary cursor-pointer hover:text-primary transition-colors">account_circle</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1280px] mx-auto pt-[100px] pb-[var(--spacing-xl)] px-[var(--spacing-md)]">
        <header className="mb-[var(--spacing-lg)]">
          <h1 className="font-heading text-h1 text-on-surface">Tambah Barang Sewaan</h1>
          <p className="text-body-lg text-secondary">Bagikan barangmu dan bantu sesama mahasiswa.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-lg)] items-start">
          {/* Left Form Content */}
          <div className="lg:col-span-8 bg-surface-container-lowest p-[var(--spacing-md)] md:p-[var(--spacing-lg)] rounded-[var(--radius-xl)] shadow-[0px_4px_20px_rgba(31,41,55,0.04)]">
            <form className="space-y-[var(--spacing-md)]">
              <div>
                <label className="block text-label-md mb-[var(--spacing-xs)] text-on-surface-variant">Nama Barang</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border-outline-variant rounded-[var(--radius-lg)] focus:ring-2 focus:ring-primary-container focus:border-primary border-opacity-50 p-[var(--spacing-xs)] text-body-md"
                  placeholder="Contoh: Kamera Canon EOS 800D"
                  type="text"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-md)]">
                <div>
                  <label className="block text-label-md mb-[var(--spacing-xs)] text-on-surface-variant">Kategori</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border-outline-variant rounded-[var(--radius-lg)] focus:ring-2 focus:ring-primary-container focus:border-primary border-opacity-50 p-[var(--spacing-xs)] text-body-md appearance-none bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-label-md mb-[var(--spacing-xs)] text-on-surface-variant">Kondisi</label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full border-outline-variant rounded-[var(--radius-lg)] focus:ring-2 focus:ring-primary-container focus:border-primary border-opacity-50 p-[var(--spacing-xs)] text-body-md appearance-none bg-white"
                  >
                    {conditions.map((cond) => (
                      <option key={cond} value={cond}>{cond}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-md)]">
                <div>
                  <label className="block text-label-md mb-[var(--spacing-xs)] text-on-surface-variant">Harga per Hari</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-[var(--spacing-xs)] flex items-center pointer-events-none">
                      <span className="text-secondary text-body-md">Rp</span>
                    </div>
                    <input
                      name="pricePerDay"
                      value={formData.pricePerDay}
                      onChange={handleChange}
                      className="w-full pl-[40px] border-outline-variant rounded-[var(--radius-lg)] focus:ring-2 focus:ring-primary-container focus:border-primary border-opacity-50 p-[var(--spacing-xs)] text-body-md"
                      placeholder="0"
                      type="number"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-label-md mb-[var(--spacing-xs)] text-on-surface-variant">Stok</label>
                  <input
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full border-outline-variant rounded-[var(--radius-lg)] focus:ring-2 focus:ring-primary-container focus:border-primary border-opacity-50 p-[var(--spacing-xs)] text-body-md"
                    placeholder="1"
                    type="number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-label-md mb-[var(--spacing-xs)] text-on-surface-variant">Deskripsi</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border-outline-variant rounded-[var(--radius-lg)] focus:ring-2 focus:ring-primary-container focus:border-primary border-opacity-50 p-[var(--spacing-xs)] text-body-md"
                  placeholder="Jelaskan detail barangmu..."
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-label-md mb-[var(--spacing-xs)] text-on-surface-variant">Spesifikasi</label>
                <textarea
                  name="specifications"
                  value={formData.specifications}
                  onChange={handleChange}
                  className="w-full border-outline-variant rounded-[var(--radius-lg)] focus:ring-2 focus:ring-primary-container focus:border-primary border-opacity-50 p-[var(--spacing-xs)] text-body-md"
                  placeholder="Contoh: Resolusi 24MP, WiFi Built-in, Lensa Kit 18-55mm"
                  rows={3}
                />
              </div>

              <div className="flex flex-col md:flex-row gap-[var(--spacing-md)] pt-[var(--spacing-md)]">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="flex-1 bg-primary-container text-on-primary-container font-heading text-[18px] py-[var(--spacing-md)] rounded-[var(--radius-xl)] shadow-sm hover:brightness-95 transition-all active:scale-[0.98]"
                >
                  Simpan & Publikasikan
                </button>
                <Link
                  to="/admin/products"
                  className="px-[var(--spacing-xl)] border border-outline text-secondary font-heading text-[18px] py-[var(--spacing-md)] rounded-[var(--radius-xl)] hover:bg-surface-container-low transition-all text-center"
                >
                  Batal
                </Link>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-[var(--spacing-lg)]">
            {/* Image Upload */}
            <div className="bg-surface-container-lowest p-[var(--spacing-md)] rounded-[var(--radius-xl)] shadow-[0px_4px_20px_rgba(31,41,55,0.04)]">
              <h3 className="font-heading text-h3 mb-[var(--spacing-md)]">Unggah Gambar</h3>
              <div className="border-2 border-dashed border-outline-variant rounded-[var(--radius-xl)] p-[var(--spacing-lg)] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary-container hover:bg-opacity-5 transition-all">
                <span className="material-symbols-outlined text-[48px] text-primary mb-[var(--spacing-xs)]">cloud_upload</span>
                <p className="text-label-md text-on-surface">Klik atau seret foto ke sini</p>
                <p className="text-caption text-secondary mt-[var(--spacing-xs)]">Maksimal 5MB per foto (JPG, PNG)</p>
              </div>
              <div className="grid grid-cols-3 gap-[var(--spacing-xs)] mt-[var(--spacing-md)]">
                {uploadedImages.map((img) => (
                  <div key={img.id} className="aspect-square rounded-[var(--radius-lg)] bg-surface-container overflow-hidden relative group">
                    <img src={img.src} alt="Product" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="material-symbols-outlined text-white cursor-pointer">delete</span>
                    </div>
                  </div>
                ))}
                <div className="aspect-square rounded-[var(--radius-lg)] bg-surface-container border border-outline-variant flex items-center justify-center border-dashed">
                  <span className="material-symbols-outlined text-outline">add_a_photo</span>
                </div>
                <div className="aspect-square rounded-[var(--radius-lg)] bg-surface-container border border-outline-variant flex items-center justify-center border-dashed">
                  <span className="material-symbols-outlined text-outline">add_a_photo</span>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-primary-container bg-opacity-10 p-[var(--spacing-md)] rounded-[var(--radius-xl)] border border-primary-container">
              <div className="flex items-center gap-[var(--spacing-xs)] mb-[var(--spacing-md)]">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                <h3 className="font-heading text-[20px] text-on-primary-container">Tips Menambah Barang</h3>
              </div>
              <ul className="space-y-[var(--spacing-xs)]">
                <li className="flex items-start gap-[var(--spacing-xs)]">
                  <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                  <span className="text-body-md text-on-secondary-container"><strong>Gunakan foto asli:</strong> Calon penyewa lebih percaya pada barang dengan foto nyata.</span>
                </li>
                <li className="flex items-start gap-[var(--spacing-xs)]">
                  <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                  <span className="text-body-md text-on-secondary-container"><strong>Berikan deskripsi detail:</strong> Tuliskan kelengkapan dan kondisi minus jika ada.</span>
                </li>
                <li className="flex items-start gap-[var(--spacing-xs)]">
                  <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                  <span className="text-body-md text-on-secondary-container"><strong>Tetapkan harga kompetitif:</strong> Riset harga barang serupa di kampusmu.</span>
                </li>
              </ul>
            </div>

            {/* Progress/Status */}
            <div className="bg-surface-container-lowest p-[var(--spacing-md)] rounded-[var(--radius-xl)] shadow-[0px_4px_20px_rgba(31,41,55,0.04)]">
              <h4 className="text-label-md text-on-surface mb-[var(--spacing-xs)]">Kelengkapan Data</h4>
              <div className="w-full bg-surface-container rounded-full h-[var(--spacing-base)] mb-[var(--spacing-xs)]">
                <div className="bg-primary-container h-[var(--spacing-base)] rounded-full" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-right text-caption text-primary">{progress}% Selesai</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}