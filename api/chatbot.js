import { generateText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { messages, systemPrompt, guestName } = req.body;

        if (!process.env.OPENAI_API_KEY) {
            console.error("Missing OPENAI_API_KEY");
            return res.status(500).json({ reply: 'Lỗi hệ thống: Chưa cấu hình OpenAI API Key.' });
        }

        const fullSystemPrompt = `
${systemPrompt}

LƯU Ý DÀNH CHO AI (RAG CONTEXT):
- Bạn đang nói chuyện với khách hàng tên là: ${guestName || 'Khách'}.
- Nếu khách muốn mua hàng hoặc chốt đơn, hãy sử dụng công cụ "taoDonHang" để ghi nhận đơn hàng.
- Nếu khách hỏi về cẩm nang yến sào, hãy trả lời dựa trên kiến thức được cung cấp trong SẢN PHẨM.
`;

        const result = await generateText({
            model: openai('gpt-4o-mini'),
            system: fullSystemPrompt,
            messages: messages.map(m => ({
                role: m.role,
                content: m.content
            })),
            tools: {
                taoDonHang: tool({
                    description: 'Gọi công cụ này khi khách hàng đồng ý chốt đơn hoặc yêu cầu đặt hàng. Sẽ hiển thị form cho khách điền thông tin.',
                    parameters: z.object({
                        product: z.string().describe('Tên hoặc loại yến sào khách muốn mua (vd: Yến thô, Yến tinh chế)'),
                        quantity: z.string().describe('Số lượng (vd: 1 lạng, 10 tổ, 1 hộp)').optional()
                    }),
                    execute: async ({ product, quantity }) => {
                        return `Đã ghi nhận yêu cầu đặt mua ${quantity || '1'} ${product}. Đang hiển thị form...`;
                    }
                })
            },
            maxSteps: 3, 
        });

        let finalReply = result.text;
        
        const orderToolCall = result.toolCalls?.find(call => call.toolName === 'taoDonHang');
        if (orderToolCall) {
            const args = orderToolCall.args || orderToolCall.input || orderToolCall.parameters || {};
            const genUI = {
                action: 'render_order_form',
                data: {
                    product: args.product || 'Yến sào',
                    quantity: args.quantity || '1',
                    name: guestName !== 'Khách' ? guestName : ''
                }
            };
            finalReply += `\n\n\`\`\`json\n${JSON.stringify(genUI)}\n\`\`\``;
        }

        return res.status(200).json({ reply: finalReply });

    } catch (error) {
        console.error("Lỗi khi xử lý chatbot:", error);
        return res.status(500).json({ reply: 'Xin lỗi, hệ thống AI đang quá tải. Vui lòng thử lại sau giây lát!' });
    }
}
