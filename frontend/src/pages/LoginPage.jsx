import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Leaf, Eye, EyeOff, Mail, Lock } from 'lucide-react';

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('เข้าสู่ระบบสำเร็จ!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-50 to-white">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Leaf size={24} className="text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-forest">ยินดีต้อนรับกลับ</h1>
            <p className="text-gray-500 text-sm mt-1">เข้าสู่ระบบเพื่อใช้งาน HealthyFood</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">อีเมล</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="input-field pl-10"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">รหัสผ่าน</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input-field pl-10 pr-10"
                  placeholder="รหัสผ่าน"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Demo credentials */}
            <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 space-y-1">
              <p className="font-semibold">บัญชีทดสอบ:</p>
              <p>Admin: admin@healthyfood.com / admin123</p>
              <p>User: user@example.com / user123</p>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            ยังไม่มีบัญชี?{' '}
            <Link to="/register" className="text-primary-600 font-medium hover:underline">สมัครสมาชิก</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('รหัสผ่านไม่ตรงกัน'); return; }
    if (form.password.length < 6) { toast.error('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('สมัครสมาชิกสำเร็จ!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-50 to-white">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Leaf size={24} className="text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-forest">สมัครสมาชิก</h1>
            <p className="text-gray-500 text-sm mt-1">สร้างบัญชีเพื่อเริ่มต้นสุขภาพที่ดี</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name', label: 'ชื่อ-นามสกุล', type: 'text', placeholder: 'ชื่อของคุณ' },
              { key: 'email', label: 'อีเมล', type: 'email', placeholder: 'your@email.com' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  className="input-field"
                  placeholder={f.placeholder}
                  required
                />
              </div>
            ))}
            {[
              { key: 'password', label: 'รหัสผ่าน', placeholder: 'อย่างน้อย 6 ตัวอักษร' },
              { key: 'confirm', label: 'ยืนยันรหัสผ่าน', placeholder: 'กรอกรหัสผ่านอีกครั้ง' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={form[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    className="input-field pr-10"
                    placeholder={f.placeholder}
                    required
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            ))}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            มีบัญชีแล้ว?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">เข้าสู่ระบบ</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
