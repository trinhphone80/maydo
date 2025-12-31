
import React from 'react';
import { IMAGES, CONTACT } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={IMAGES.logo} alt="Đức Phương Medical" className="h-10 md:h-14 object-contain" />
          <div className="hidden md:block">
            <h1 className="font-black text-xl text-gray-900 tracking-tighter leading-none uppercase">ĐỨC PHƯƠNG</h1>
            <p className="text-[9px] font-black text-blue-600 tracking-[0.3em] uppercase mt-1">Medical Solutions</p>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hỗ trợ 24/7:</span>
            <a href={`tel:${CONTACT.phone.replace(/\./g, '')}`} className="text-lg font-black text-gray-900 hover:text-red-600 transition tracking-tighter">
              {CONTACT.phone}
            </a>
          </div>
          <a href="#order-form" className="bg-red-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-red-700 transition shadow-xl shadow-red-100 uppercase tracking-widest active:scale-95">
            ĐĂNG KÝ NGAY
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
