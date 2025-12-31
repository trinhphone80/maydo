
import React, { useState } from 'react';

interface Props {
  images: string[];
}

const ProductGallery: React.FC<Props> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-block bg-red-100 text-red-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-200">
            Hình ảnh thực tế
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">
            CẬN CẢNH <span className="text-blue-600">AICARE W33</span>
          </h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto text-sm md:text-base">
            Hình ảnh thật 100% được chụp tại showroom Đức Phương Medical. Nhấn vào ảnh để xem chi tiết sắc nét hơn.
          </p>
        </div>

        {/* Horizontal Slider with Scroll Snap */}
        <div className="relative group">
          <div className="flex gap-4 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing">
            {images.map((url, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 w-[280px] md:w-[400px] snap-center"
                onClick={() => setSelectedImage(url)}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] shadow-lg border-4 border-gray-50 group/item transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                  <img 
                    src={url} 
                    alt={`Thực tế AICARE W33 ${index + 1}`} 
                    className="w-full h-full object-cover transition duration-700 group-hover/item:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-md p-4 rounded-full shadow-2xl scale-50 group-hover/item:scale-100 transition-transform duration-500">
                      <span className="text-2xl">🔍</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Slider Hints (Visible on Desktop) */}
          <div className="hidden lg:flex justify-center gap-2 mt-4">
            {images.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
            ))}
          </div>
          <div className="text-center lg:hidden mt-2 text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">
            Vuốt sang để xem thêm ➔
          </div>
        </div>
      </div>

      {/* Premium Lightbox Overlay */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/20 z-[210]"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>
          
          <div className="relative max-w-5xl w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <img 
              src={selectedImage} 
              alt="Detail view" 
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-scaleUp"
            />
            <div className="absolute bottom-[-40px] left-0 w-full text-center">
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Đức Phương Medical - Hình ảnh bản quyền</p>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
};

export default ProductGallery;
