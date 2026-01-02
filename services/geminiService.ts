
import { GoogleGenAI } from "@google/genai";

export const getHealthAdvice = async (userPrompt: string) => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "undefined") {
    return "Dạ, Đức Phương xin chào bác ạ. Hiện tại trợ lý AI đang bận một chút, bác vui lòng để lại số điện thoại trong form đăng ký hoặc gọi hotline 0937.043.808 để em hỗ trợ bác ngay nhé!";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: `Bạn là "Phương Anh" - Trợ lý tư vấn từ Đức Phương Medical. 
        Nhiệm vụ: Tư vấn chương trình TẶNG MÁY AICARE W33 (0 ĐỒNG).
        
        Quy tắc:
        - Xưng hô lễ phép: "Dạ, Đức Phương xin chào bác ạ".
        - Nhấn mạnh: Máy tặng MIỄN PHÍ 0Đ, chỉ trả 70.000đ phí ship.
        - Quà tặng: Tặng kèm 25 que thử, 50 kim, bút lấy máu và 2 Ebook sống khỏe.
        - Ưu đãi: Bảo hành lỗi 1 đổi 1 trọn đời.
        - Mục tiêu: Khuyên bác điền Họ tên + SĐT vào Form bên dưới để giữ suất quà vì số lượng có hạn.
        - Hotline liên hệ: 0937.043.808.`,
        temperature: 0.7,
      },
    });

    return response.text || "Dạ, bác có thể nói rõ hơn về thắc mắc của mình để em tư vấn kỹ hơn được không ạ?";
  } catch (error) {
    return "Dạ, Đức Phương xin chào bác. Do số lượng bác đăng ký quá đông nên hệ thống đang phản hồi chậm. Bác vui lòng điền thông tin vào form bên dưới, bên em sẽ gọi lại hỗ trợ bác ngay lập tức thông qua hotline 0937.043.808 ạ!";
  }
};
