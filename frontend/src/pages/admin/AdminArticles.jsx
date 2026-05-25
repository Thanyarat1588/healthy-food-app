import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Upload, Eye } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import Modal from '../../components/shared/Modal';

const categoryOptions = [
  { value: 'nutrition', label: 'โภชนาการ' },
  { value: 'exercise', label: 'การออกกำลังกาย' },
  { value: 'wellness', label: 'สุขภาพองค์รวม' },
  { value: 'recipe', label: 'สูตรอาหาร' },
  { value: 'tips', label: 'เคล็ดลับ' },
];

const defaultForm = { title: '', excerpt: '', content: '', category: 'nutrition', tags: '', isPublished: true };

export default function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.set('search', search);
      const res = await api.get(`/articles?${params}`);
      setArticles(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchArticles(); }, [page]);

  const openAdd = () => {
    setEditing(null); setForm(defaultForm);
    setImageFile(null); setImagePreview(''); setModalOpen(true);
  };

  const openEdit = (article) => {
    setEditing(article);
    setForm({
      title: article.title || '', excerpt: article.excerpt || '',
      content: article.content || '', category: article.category || 'nutrition',
      tags: (article.tags || []).join(', '), isPublished: article.isPublished !== false
    });
    setImageFile(null); setImagePreview(article.image || '');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
      toast.error('กรุณากรอกข้อมูลที่จำเป็น'); return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('excerpt', form.excerpt);
      fd.append('content', form.content);
      fd.append('category', form.category);
      fd.append('isPublished', form.isPublished);
      const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      fd.append('tags', JSON.stringify(tags));
      if (imageFile) fd.append('image', imageFile);

      if (editing) {
        await api.put(`/articles/${editing._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('แก้ไขบทความสำเร็จ');
      } else {
        await api.post('/articles', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('เพิ่มบทความสำเร็จ');
      }
      setModalOpen(false); fetchArticles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('ยืนยันการลบบทความนี้?')) return;
    try {
      await api.delete(`/articles/${id}`);
      toast.success('ลบบทความสำเร็จ');
      fetchArticles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 font-display">จัดการบทความ</h1>
          <p className="text-gray-500 text-sm">ทั้งหมด {pagination.total || 0} บทความ</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> เพิ่มบทความ
        </button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchArticles(); }} className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 text-sm" placeholder="ค้นหาบทความ..." />
        </div>
        <button type="submit" className="btn-primary text-sm px-4">ค้นหา</button>
      </form>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">บทความ</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">หมวดหมู่</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">วันที่</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">สถานะ</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="h-10 bg-gray-100 rounded animate-pulse"></div></td></tr>
                ))
              ) : articles.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">ไม่พบบทความ</td></tr>
              ) : articles.map(article => (
                <tr key={article._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-10 rounded-lg overflow-hidden bg-gray-100 flex-none flex items-center justify-center">
                        {article.image ? <img src={article.image} alt="" className="w-full h-full object-cover" /> : <span className="text-lg">📰</span>}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm line-clamp-1">{article.title}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1"><Eye size={10} /> {article.viewCount || 0}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="badge bg-primary-50 text-primary-700 text-xs">
                      {categoryOptions.find(c => c.value === article.category)?.label || article.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">
                    {new Date(article.createdAt).toLocaleDateString('th-TH')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge text-xs ${article.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {article.isPublished ? 'เผยแพร่' : 'ฉบับร่าง'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(article)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(article._id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-50">← ก่อนหน้า</button>
            <span className="flex items-center px-3 text-xs text-gray-500">หน้า {page}/{pagination.pages}</span>
            <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-50">ถัดไป →</button>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'แก้ไขบทความ' : 'เพิ่มบทความ'} size="xl">
        <div className="space-y-4">
          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">รูปภาพปก</label>
            <div className="flex items-start gap-4">
              <div className="w-28 h-20 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center flex-none">
                {imagePreview ? <img src={imagePreview} alt="" className="w-full h-full object-cover" /> : <Upload size={20} className="text-gray-300" />}
              </div>
              <label className="flex-1 flex flex-col items-center justify-center h-20 border-2 border-dashed border-gray-200 rounded-xl hover:border-primary-400 cursor-pointer transition-colors">
                <Upload size={16} className="text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">คลิกเพื่ออัปโหลด</span>
                <input type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if(f){setImageFile(f);setImagePreview(URL.createObjectURL(f));} }} className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">หัวข้อบทความ *</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="หัวข้อบทความ" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">สรุปย่อ * (ไม่เกิน 300 ตัวอักษร)</label>
            <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} className="input-field resize-none" rows={2} maxLength={300} placeholder="สรุปย่อบทความ..." />
            <p className="text-xs text-gray-400 mt-1">{form.excerpt.length}/300</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">เนื้อหาบทความ * (รองรับ HTML)</label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="input-field resize-none font-mono text-sm" rows={10} placeholder="<h2>หัวข้อ</h2><p>เนื้อหา...</p>" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">หมวดหมู่</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field">
                {categoryOptions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">แท็ก (คั่นด้วยจุลภาค)</label>
              <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="input-field" placeholder="สุขภาพ, โภชนาการ" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="published" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} className="w-4 h-4 accent-primary-600" />
            <label htmlFor="published" className="text-sm text-gray-700">เผยแพร่ทันที</label>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">ยกเลิก</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">{saving ? 'กำลังบันทึก...' : 'บันทึก'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
