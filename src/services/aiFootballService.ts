import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/appConfig";
import { getBestAvailableModel } from "../utils/geminiModelTest";

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: "text" | "analysis" | "suggestion";
  imageUri?: string;
}

export interface FootballContext {
  playerName?: string;
  playerPosition?: string;
  playerTeam?: string;
  topic?: string;
}

class AIFootballService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private conversationHistory: ChatMessage[] = [];
  private isInitializing: boolean = false;
  private initializationPromise: Promise<void> | null = null;

  constructor() {
    // Don't await here, let components handle initialization
  }

  private async initialize() {
    if (config.GEMINI_API_KEY && config.GEMINI_API_KEY !== "") {
      try {
        this.genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

        // Try to get the best available model
        let modelName = "gemini-1.5-flash"; // Default fallback
        try {
          modelName = await getBestAvailableModel();
          console.log(`✅ Using Gemini model: ${modelName}`);
        } catch (modelError) {
          console.warn(
            "⚠️  Could not determine best model, using default:",
            modelError
          );
        }

        this.model = this.genAI.getGenerativeModel({ model: modelName });
      } catch (error) {
        console.error("Failed to initialize Gemini AI:", error);
        throw new Error(
          "Không thể khởi tạo AI service. Vui lòng kiểm tra API key."
        );
      }
    } else {
      throw new Error(
        "API key không được cấu hình. Vui lòng kiểm tra file .env"
      );
    }
  }

  public async ensureInitialized(): Promise<void> {
    if (this.isInitialized()) {
      return;
    }

    if (this.isInitializing && this.initializationPromise) {
      return this.initializationPromise;
    }

    this.isInitializing = true;
    this.initializationPromise = this.initialize();

    try {
      await this.initializationPromise;
    } finally {
      this.isInitializing = false;
    }
  }

  public isInitialized(): boolean {
    return this.genAI !== null && this.model !== null;
  }

  public addToHistory(message: ChatMessage) {
    this.conversationHistory.push(message);
    // Keep only last 10 messages to avoid token limit
    if (this.conversationHistory.length > 10) {
      this.conversationHistory = this.conversationHistory.slice(-10);
    }
  }

  public getConversationHistory(): ChatMessage[] {
    return this.conversationHistory;
  }

  private buildPrompt(userQuestion: string, context?: FootballContext): string {
    let systemPrompt = `Bạn là một chuyên gia bóng đá AI thông minh và hiểu biết sâu sắc. 

Nhiệm vụ của bạn:
1. Trả lời các câu hỏi về bóng đá bằng tiếng Việt
2. Cung cấp thông tin chính xác, chi tiết và thú vị
3. Phân tích chiến thuật, kỹ thuật, cầu thủ, đội bóng, giải đấu
4. Đưa ra lời khuyên và dự đoán có căn cứ
5. Nếu câu hỏi không liên quan đến bóng đá, hãy lịch sự chuyển hướng

Phong cách trả lời:
- Thân thiện, chuyên nghiệp
- Sử dụng thuật ngữ bóng đá phù hợp
- Đưa ra ví dụ cụ thể khi có thể
- Tránh thông tin sai lệch hoặc chưa được xác thực
- QUAN TRỌNG: Trả lời bằng văn bản thuần túy, KHÔNG sử dụng markdown format (**, *, #, etc.)
- Sử dụng emoji để làm nổi bật thay vì markdown
- Cấu trúc câu văn rõ ràng với xuống dòng và khoảng trắng

`;

    // Add context if available
    if (context) {
      if (context.playerName) {
        systemPrompt += `\nBối cảnh hiện tại: Đang thảo luận về cầu thủ ${context.playerName}`;
        if (context.playerPosition) {
          systemPrompt += ` (vị trí: ${context.playerPosition})`;
        }
        if (context.playerTeam) {
          systemPrompt += ` (đội: ${context.playerTeam})`;
        }
        systemPrompt += ".\n";
      }
      if (context.topic) {
        systemPrompt += `Chủ đề: ${context.topic}\n`;
      }
    }

    // Add conversation history for context
    if (this.conversationHistory.length > 0) {
      systemPrompt += "\nLịch sử hội thoại gần đây:\n";
      this.conversationHistory.slice(-3).forEach((msg, index) => {
        const role = msg.isUser ? "Người dùng" : "AI";
        systemPrompt += `${role}: ${msg.text}\n`;
      });
    }

    systemPrompt += `\nCâu hỏi mới của người dùng: ${userQuestion}

Hãy trả lời một cách chi tiết và hữu ích:`;

    return systemPrompt;
  }

  public async generateResponse(
    userQuestion: string,
    context?: FootballContext
  ): Promise<string> {
    await this.ensureInitialized();

    try {
      const prompt = this.buildPrompt(userQuestion, context);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const aiText = response.text();

      if (!aiText || aiText.trim() === "") {
        throw new Error("AI không thể tạo phản hồi");
      }

      return aiText.trim();
    } catch (error: any) {
      console.error("Error generating AI response:", error);

      if (error.message?.includes("API_KEY")) {
        throw new Error("API key không hợp lệ. Vui lòng kiểm tra cấu hình.");
      } else if (error.message?.includes("quota")) {
        throw new Error(
          "Đã vượt quá giới hạn sử dụng API. Vui lòng thử lại sau."
        );
      } else if (error.message?.includes("network")) {
        throw new Error("Lỗi kết nối mạng. Vui lòng kiểm tra internet.");
      } else if (
        error.message?.includes("404") ||
        error.message?.includes("not found")
      ) {
        throw new Error("Model AI không khả dụng. Vui lòng cập nhật ứng dụng.");
      } else if (error.message?.includes("models/")) {
        throw new Error(
          "Phiên bản AI model không được hỗ trợ. Vui lòng liên hệ hỗ trợ."
        );
      } else {
        throw new Error(
          "Xin lỗi, tôi gặp sự cố khi xử lý câu hỏi. Vui lòng thử lại."
        );
      }
    }
  }

  public async analyzePlayer(playerData: any): Promise<string> {
    await this.ensureInitialized();

    try {
      const analysisPrompt = `Phân tích chi tiết cầu thủ bóng đá với dữ liệu sau:

Tên: ${playerData.playerName || "Không rõ"}
Vị trí: ${playerData.position || "Không rõ"}
Đội: ${playerData.team || "Không rõ"}
Năm sinh: ${playerData.YoB || "Không rõ"}
Thời gian thi đấu: ${playerData.MinutesPlayed || 0} phút
Độ chính xác chuyền bóng: ${playerData.PassingAccuracy || 0}%
Là đội trưởng: ${playerData.isCaptain ? "Có" : "Không"}

Hãy đưa ra:
1. Đánh giá tổng quan về cầu thủ
2. Phân tích điểm mạnh và điểm cần cải thiện
3. So sánh với các cầu thủ cùng vị trí
4. Lời khuyên để phát triển kỹ năng
5. Dự đoán về tiềm năng và tương lai

QUAN TRỌNG: Trả lời bằng văn bản thuần túy, KHÔNG sử dụng markdown format (**, *, #, etc.). Sử dụng emoji và xuống dòng để tổ chức nội dung. Trả lời bằng tiếng Việt, chi tiết và chuyên nghiệp.`;

      const result = await this.model.generateContent(analysisPrompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error: any) {
      console.error("Error analyzing player:", error);

      if (
        error.message?.includes("404") ||
        error.message?.includes("not found")
      ) {
        throw new Error("Model AI không khả dụng. Vui lòng cập nhật ứng dụng.");
      } else if (error.message?.includes("models/")) {
        throw new Error(
          "Phiên bản AI model không được hỗ trợ. Vui lòng liên hệ hỗ trợ."
        );
      } else {
        throw new Error("Không thể phân tích cầu thủ. Vui lòng thử lại.");
      }
    }
  }

  public async suggestTactics(
    formation: string,
    opponent?: string
  ): Promise<string> {
    await this.ensureInitialized();

    try {
      let tacticsPrompt = `Hãy đưa ra gợi ý chiến thuật bóng đá cho đội hình ${formation}.`;

      if (opponent) {
        tacticsPrompt += ` Đối thủ là ${opponent}.`;
      }

      tacticsPrompt += `

Bao gồm:
1. Cách bố trí cầu thủ
2. Chiến thuật tấn công
3. Chiến thuật phòng ngự
4. Các tình huống cố định
5. Điểm mạnh và yếu của đội hình
6. Cách ứng phó với các đội hình phổ biến khác

QUAN TRỌNG: Trả lời bằng văn bản thuần túy, KHÔNG sử dụng markdown format (**, *, #, etc.). Sử dụng emoji và xuống dòng để tổ chức nội dung rõ ràng. Trả lời chi tiết bằng tiếng Việt.`;

      const result = await this.model.generateContent(tacticsPrompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error: any) {
      console.error("Error suggesting tactics:", error);

      if (
        error.message?.includes("404") ||
        error.message?.includes("not found")
      ) {
        throw new Error("Model AI không khả dụng. Vui lòng cập nhật ứng dụng.");
      } else if (error.message?.includes("models/")) {
        throw new Error(
          "Phiên bản AI model không được hỗ trợ. Vui lòng liên hệ hỗ trợ."
        );
      } else {
        throw new Error(
          "Không thể đưa ra gợi ý chiến thuật. Vui lòng thử lại."
        );
      }
    }
  }

  public clearHistory() {
    this.conversationHistory = [];
  }
}

// Export singleton instance
export const aiFootballService = new AIFootballService();
export default aiFootballService;
