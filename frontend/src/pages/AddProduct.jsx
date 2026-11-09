import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productService from '../services/productService';

const categories = ['Elektronik', 'Kendaraan', 'Fashion', 'Alat Camping'];
const conditions = ['Sangat Baik', 'Baik', 'Cukup'];

const inputClass =
  'w-full bg-surface-container border border-outline-variant rounded-[var(--radius-md)] px-3 py-2.5 text-body-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none transition-colors';

export default function AddProduct() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    product_name: '',
    category: 'Elektronik',
    condition: 'Baik',
    price: '',
    description: '',
  });

  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      setError('Format file harus JPG, PNG, atau WEBP.');
      return;
    }

    if (file.size > maxSize) {
      setError('Ukuran file maksimal 5MB.');
      return;
    }

    setSelectedFile(file);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => setPreview(event.target?.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.product_name.trim()) {
      setError('Nama barang wajib diisi.');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Harga per hari wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append('product_name', formData.product_name.trim());
      payload.append('category', formData.category);
      payload.append('condition', formData.condition);
      payload.append('price', parseFloat(formData.price));
      payload.append('description', formData.description || '');

      if (selectedFile) payload.append('image', selectedFile);

      await productService.createProduct(payload);
      navigate('/products');
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Gagal menyimpan barang. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const requiredFields = ['product_name', 'price'];
  const filled = requiredFields.filter((field) => String(formData[field] ?? '').trim()).length;
  const progress = Math.round((filled / requiredFields.length) * 100);

  return (
    <div className="w-full max-w-[1280px] mx-auto px-[var(--spacing-md)] py-[var(--spacing-lg)]">
      <div className="mb-[var(--spacing-lg)]">
        <h1 className="font-heading text-h2 text-on-surface">Tambah barang sewa</h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Bagikan barangmu dan bantu sesama mahasiswa.
        </p>
      </div>

      {error && (
        <div className="rounded-[var(--radius-md)] bg-error-container/40 border border-error/30 p-3 mb-[var(--spacing-md)] flex items-center gap-2">
          <span className="material-symbols-outlined text-error text-[20px]">error</span>
          <p className="text-body-sm text-on-error-container">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-lg)] items-start">
        <div className="lg:col-span-8 panel p-[var(--spacing-lg)]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-[var(--spacing-md)]">
            <div className="flex flex-col gap-[var(--spacing-xs)]">
              <label className="text-label-md text-on-surface-variant" htmlFor="product_name">
                Nama barang <span className="text-error">*</span>
              </label>
              <input
                id="product_name"
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                className={inputClass}
                placeholder="Contoh: Kamera Canon EOS 800D"
                type="text"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-md)]">
              <div className="flex flex-col gap-[var(--spacing-xs)]">
                <label className="text-label-md text-on-surface-variant" htmlFor="category">
                  Kategori
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`${inputClass} cursor-pointer`}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-[var(--spacing-xs)]">
                <label className="text-label-md text-on-surface-variant" htmlFor="condition">
                  Kondisi
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className={`${inputClass} cursor-pointer`}
                >
                  {conditions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-[var(--spacing-xs)]">
              <label className="text-label-md text-on-surface-variant" htmlFor="price">
                Harga per hari <span className="text-error">*</span>
              </label>
              <input
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={inputClass}
                placeholder="50"
                type="number"
                min="0"
              />
              <p className="text-caption text-on-surface-variant">
                Dalam ribuan rupiah (contoh: 50 = Rp 50.000 per hari).
              </p>
            </div>

            <div className="flex flex-col gap-[var(--spacing-xs)]">
              <label className="text-label-md text-on-surface-variant" htmlFor="description">
                Deskripsi
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`${inputClass} resize-none`}
                placeholder="Jelaskan detail barangmu..."
                rows={4}
              />
            </div>

            <div className="flex flex-col gap-[var(--spacing-xs)]">
              <label className="text-label-md text-on-surface-variant" htmlFor="image">
                Unggah foto
              </label>
              <input
                ref={fileInputRef}
                id="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-outline-variant rounded-[var(--radius-md)] p-[var(--spacing-lg)] flex flex-col items-center justify-center text-center hover:border-primary hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[32px] text-primary mb-2">cloud_upload</span>
                <span className="text-label-md text-on-surface">Klik untuk memilih foto</span>
                <span className="text-caption text-on-surface-variant mt-1">
                  Maksimal 5MB (JPG, PNG, WEBP)
                </span>
              </button>

              {preview && (
                <div className="w-28 h-28 rounded-[var(--radius-md)] overflow-hidden bg-surface-container relative group">
                  <img src={preview} alt="Pratinjau" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    aria-label="Hapus foto"
                    className="absolute top-1 right-1 p-1 rounded-full bg-error text-on-error transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-[var(--spacing-md)] pt-[var(--spacing-sm)]">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary text-on-primary text-label-md font-semibold py-3 rounded-[var(--radius-md)] hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    Menyimpan...
                  </>
                ) : (
                  'Simpan & publikasikan'
                )}
              </button>
              <Link
                to="/products"
                className="px-6 border border-outline text-on-surface text-label-md font-semibold py-3 rounded-[var(--radius-md)] hover:bg-surface-container transition-colors text-center"
              >
                Batal
              </Link>
            </div>
          </form>
        </div>

        <aside className="lg:col-span-4 flex flex-col gap-[var(--spacing-lg)]">
          <div className="rounded-[var(--radius-lg)] bg-primary-container/40 border border-primary/25 p-[var(--spacing-md)]">
            <div className="flex items-center gap-2 mb-[var(--spacing-sm)]">
              <span className="material-symbols-outlined text-primary text-[20px]">lightbulb</span>
              <h3 className="text-label-md text-on-surface">Tips menambahkan barang</h3>
            </div>
            <ul className="flex flex-col gap-2">
              {[
                'Gunakan foto asli — calon penyewa lebih percaya barang dengan foto nyata.',
                'Tuliskan kelengkapan dan kondisi minus jika ada.',
                'Riset harga barang sejenis di kampus agar Kompetitif.',
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                  <span className="text-body-sm text-on-surface-variant">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel p-[var(--spacing-md)]">
            <h4 className="text-label-md text-on-surface mb-[var(--spacing-sm)]">Kelengkapan data</h4>
            <div className="w-full bg-surface-container rounded-full h-1.5 mb-2">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-right text-caption text-on-surface-variant">{progress}% selesai</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
