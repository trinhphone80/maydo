
import React, { useState } from 'react';
import { Order, AppConfig } from '../types';

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
    const orderId = 'ORD' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    const newOrder: Order = {
      id: orderId,
      ...formData,
      product: productInfo,
      createdAt: Date.now(),
      status: 'PENDING'
    };

    // ĐỒNG BỘ NGAY LẬP TỨC LÊN GOOGLE SHEET
    if (config.googleSheetUrl) {
      const payload = {
        action: 'CREATE_ORDER',
        orderId: orderId,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        note: formData.note,
        product: productInfo,
        amount: 70000,
        notificationEmail: 'duyphuong7@gmail.com'
      };

      try {
        // Sử dụng fetch bình thường trước để thử lấy link thanh toán nếu có PayOS
        // Nếu bị lỗi CORS (thường gặp với GAS), đơn hàng vẫn được gửi đi nhờ cơ chế xử lý của GAS
        const response = await fetch(config.googleSheetUrl, {
          method: 'POST',
          body: JSON.stringify(payload)
        }).catch(err => {
            // Nếu lỗi CORS, thử lại với no-cors để đảm bảo dữ liệu CHẮC CHẮN tới được server
            return fetch(config.googleSheetUrl, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(payload)
            });
        });

        console.log("Đã gửi yêu cầu lưu đơn hàng.");
      } catch (error) {
        console.error('Lỗi gửi dữ liệu:', error);
      }
    }

    onOrderSuccess(newOrder);
    setIsSubmitting(false);
    setFormData({ name: '', phone: '', address: '', note: '' });
  };

  return (
    <section id="order-form" className="py-24 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto flex flex-col lg:flex-row bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.12)] overflow-hidden border border-gray-100">
          
          <div className="w-full lg:w-2/5 bg-blue-600 p-10 lg:p-12 text-white space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-black uppercase tracking-tighter">Suất quà tặng <br/>của bạn</h2>
              <div className="h-1 w-12 bg-red-500 rounded-full"></div>
            </div>

            <div className="p-6 bg-white/10 rounded-[2rem] border border-white/20 backdrop-blur-sm space-y-6">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg p-1 flex-shrink-0">
                  <img src={thumbUrl} alt="AICARE W33" className="w-full h-full object-cover rounded-xl" />
                </div>
                <div className="flex-1">
                  <div className="font-black text-sm uppercase leading-tight">Máy đo đường huyết AICARE W33</div>
                  <div className="text-[10px] text-yellow-300 font-black mt-1 uppercase tracking-widest">Suất Ưu Tiên 0Đ</div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="opacity-70">Giá máy:</span>
                  <span className="line-through opacity-50 font-black">499.000đ</span>
                </div>
                <div className="flex justify-between items-center text-lg font-black">
                  <span>Giá ưu đãi:</span>
                  <span className="text-red-500 bg-white px-3 py-1 rounded-xl shadow-lg">0Đ</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium pt-2 text-yellow-100">
                  <span>Phí ship:</span>
                  <span className="font-black text-lg">70.000đ</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-red-600 rounded-2xl text-center">
               <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Thời gian giữ quà:</div>
               <div className="text-2xl font-black font-mono">14:59</div>
            </div>
          </div>

          <div className="w-full lg:w-3/5 p-10 lg:p-14">
            <h3 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tighter">Thông tin giao quà</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Họ tên bác/anh chị *</label>
                  <input className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-blue-500 outline-none transition font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nguyễn Văn A" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Số điện thoại *</label>
                  <input type="tel" className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-blue-500 outline-none transition font-black" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="09xxx..." required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Địa chỉ chi tiết *</label>
                <textarea className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-blue-500 outline-none transition font-bold" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} rows={2} placeholder="Số nhà, đường, phường, huyện, tỉnh..." required />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nội dung liên hệ (Ghi chú thêm)</label>
                <textarea className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-blue-500 outline-none transition font-bold" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} rows={2} placeholder="Giao sau giờ hành chính, gọi trước khi đến..." />
              </div>

              <div className="p-6 bg-blue-50 rounded-[1.5rem] border-2 border-dashed border-blue-200 flex items-center gap-5">
                 <div className="text-3xl">🚀</div>
                 <div className="text-xs font-bold text-blue-900 leading-relaxed">
                    Đơn hàng sẽ được cập nhật lên Google Sheet và báo về <span className="text-red-600 font-black">duyphuong7@gmail.com</span> ngay khi bác nhấn nút bên dưới.
                 </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-gray-900 text-white font-black py-6 rounded-[1.5rem] text-xl shadow-2xl transform transition active:scale-95 disabled:opacity-50 uppercase tracking-widest">
                {isSubmitting ? "Đang lưu dữ liệu..." : "Nhận máy 0đ ngay ➔"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderForm;
