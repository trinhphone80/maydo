
import React, { useState } from 'react';
import { Order, AppConfig } from '../types';
import { CONTACT } from '../constants';

interface Props {
  onOrderSuccess: (order: Order) => void;
  thumbUrl: string;
  config: AppConfig;
}

const OrderForm: React.FC<Props> = ({ onOrderSuccess, thumbUrl, config }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    note: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const productInfo = 'MÁY AICARE W33 (TẶNG 0Đ)';
    // Tạo mã đơn hàng ngắn gọn dễ nhìn trên sao kê ngân hàng
    const orderId = 'DP' + Math.floor(100000 + Math.random() * 900000);
    const timestamp = new Date().toLocaleString('vi-VN');
    
    // GỬI LÊN GOOGLE SHEET VÀ TẠO LINK PAYOS
    let paymentUrl = '';
    if (config.googleSheetUrl) {
      const payload = {
        action: 'CREATE_ORDER',
        timestamp: timestamp,
        orderId: orderId,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        note: formData.note,
        product: productInfo,
        amount: 70000,
        status: 'PENDING',
        // Gửi kèm thông tin cấu hình PayOS nếu có để Script xử lý tạo link
        payosConfig: config.payosClientId ? {
          clientId: config.payosClientId,
          apiKey: config.payosApiKey,
          checksumKey: config.payosChecksumKey
        } : null
      };

      try {
        // Chúng ta dùng GET/POST kết hợp để đảm bảo vượt CORS
        const res = await fetch(config.googleSheetUrl, {
          method: 'POST',
          mode: 'no-cors', 
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(payload)
        });
        
        // Mặc dù no-cors không đọc được response, nhưng chúng ta vẫn gán link thanh toán 
        // dự phòng hoặc link được trả về từ một endpoint khác nếu cần.
        // Ở đây em mặc định khách có thể bấm link PayOS dự phòng trong constants nếu link động chưa có.
        paymentUrl = config.paymentLink; 
        
      } catch (error) {
        console.error('Lỗi khi gửi đơn hàng:', error);
      }
    }

    const newOrder: Order = {
      id: orderId,
      ...formData,
      product: productInfo,
      createdAt: Date.now(),
      status: 'PENDING',
      paymentUrl: paymentUrl
    };

    onOrderSuccess(newOrder);
    setIsSubmitting(false);
    setFormData({ name: '', phone: '', address: '', note: '' });
  };

  return (
    <div id="order-form" className="max-w-4xl mx-auto flex flex-col lg:flex-row bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.12)] overflow-hidden border border-gray-100 animate-fadeIn">
      
      {/* Cột trái: Thông tin sản phẩm */}
      <div className="w-full lg:w-2/5 bg-blue-600 p-10 lg:p-12 text-white flex flex-col justify-between">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Ưu đãi <br/>độc quyền</h2>
            <div className="h-1.5 w-12 bg-red-500 rounded-full"></div>
          </div>

          <div className="p-6 bg-white/10 rounded-[2.5rem] border border-white/20 backdrop-blur-sm space-y-6">
            <div className="flex gap-5">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-xl p-1 shrink-0 rotate-[-3deg]">
                <img src={thumbUrl} alt="AICARE W33" className="w-full h-full object-cover rounded-xl" />
              </div>
              <div className="flex-1">
                <div className="font-black text-sm uppercase leading-tight tracking-tighter">Máy đo đường huyết AICARE W33</div>
                <div className="inline-block bg-yellow-400 text-blue-900 text-[9px] font-black px-2 py-0.5 rounded mt-2 uppercase">Suất Tặng 0đ</div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="opacity-70">Giá niêm yết:</span>
                <span className="line-through opacity-50 font-black">499.000đ</span>
              </div>
              <div className="flex justify-between items-center text-lg font-black">
                <span>Ưu đãi:</span>
                <span className="text-red-500 bg-white px-3 py-1 rounded-xl shadow-lg animate-pulse">0Đ</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold pt-2 text-yellow-300">
                <span>Phí ship toàn quốc:</span>
                <span className="font-black text-xl">70.000đ</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 p-5 bg-red-600 rounded-3xl text-center shadow-lg border-2 border-red-500/50">
           <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-80">Đang giữ suất cho bác:</div>
           <div className="text-3xl font-black font-mono tracking-widest text-white">14:59</div>
        </div>
      </div>

      {/* Cột phải: Form nhập liệu */}
      <div className="w-full lg:w-3/5 p-10 lg:p-14 bg-white">
        <h3 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tighter border-l-8 border-blue-600 pl-4">Thông tin giao máy</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Họ tên của bác *</label>
              <input 
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition font-bold placeholder:text-gray-300" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="Ví dụ: Nguyễn Văn A" 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Số điện thoại *</label>
              <input 
                type="tel" 
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition font-black placeholder:text-gray-300" 
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})} 
                placeholder="09xxx..." 
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Địa chỉ nhận máy *</label>
            <textarea 
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition font-bold placeholder:text-gray-300" 
              value={formData.address} 
              onChange={e => setFormData({...formData, address: e.target.value})} 
              rows={2} 
              placeholder="Số nhà, tên đường, phường, quận/huyện..." 
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Ghi chú (Nếu có)</label>
            <input 
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition font-bold placeholder:text-gray-300" 
              value={formData.note} 
              onChange={e => setFormData({...formData, note: e.target.value})} 
              placeholder="Ví dụ: Giao buổi chiều..." 
            />
          </div>

          <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
             <div className="text-2xl mt-1">💡</div>
             <p className="text-[11px] font-bold text-blue-900 leading-relaxed italic">
                Sau khi bấm nút, hệ thống sẽ tự động đăng ký suất quà cho bác. Bác vui lòng thanh toán phí ship 70k để Đức Phương xuất kho ngay nhé!
             </p>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-blue-600 text-white font-black py-6 rounded-[1.5rem] text-xl shadow-2xl shadow-blue-200 transform transition active:scale-95 disabled:opacity-50 uppercase tracking-widest group"
          >
            {isSubmitting ? "Đang ghi danh..." : (
              <span className="flex items-center justify-center gap-3">
                XÁC NHẬN NHẬN MÁY 0Đ 
                <span className="group-hover:translate-x-2 transition-transform">➔</span>
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
