/* ============================================================
   chatbot.js — Trợ Lý AI Tám Thủy
   Dùng n8n làm proxy → OpenAI API (GPT-4o-mini)
   ============================================================ */

/* ── Config — paste n8n webhook URL vào đây ─────────────────
   Cách tạo n8n workflow:
   1. Tạo workflow mới trong n8n
   2. Thêm node "Webhook" → method POST, path /ai-chat
   3. Thêm node "OpenAI" → model gpt-4o-mini, input: {{ $json.messages }}
   4. Thêm node "Respond to Webhook" → trả về { reply: ... }
   5. Copy URL webhook vào N8N_AI_WEBHOOK_URL bên dưới
   ─────────────────────────────────────────────────────────── */
const CHATBOT_CONFIG = {
    n8nWebhookUrl: 'http://localhost:5678/webhook/tamthuy-chat',  // 👈 PASTE n8n webhook URL của bạn vào đây
    maxHistoryLength: 12,         // số lượng tin nhắn giữ trong bộ nhớ (6 cặp hỏi/đáp)
    typingDelay: { min: 600, max: 1500 }, // giả lập delay tự nhiên
};

// Tự động tạo danh sách sản phẩm từ database chung
const productsPrompt = YEN_SAO_DB.products.map(p => `- ${p.name}: ${p.description}`).join('\n');

const SYSTEM_PROMPT = `Bạn là "Thủy" — trợ lý tư vấn thông minh của Yến Sào Tám Thủy, một thương hiệu yến sào cao cấp tại Đầm Thị Nại, Bình Định.

TÍNH CÁCH: Thân thiện, am hiểu, chuyên nghiệp. Viết ngắn gọn, dễ hiểu. Không dùng markdown phức tạp.

SẢN PHẨM:
${productsPrompt}

LỢI ÍCH: Tăng cường miễn dịch, hỗ trợ hô hấp, đẹp da, bổ dưỡng cho trẻ em/người lớn tuổi/phụ nữ sau sinh.

ĐẶT HÀNG: Khách điền form trên website, hoặc liên hệ Zalo/hotline. Phản hồi trong 15 phút. Giao toàn quốc.

QUY TẮC:
1. Chỉ tư vấn về yến sào và các chủ đề liên quan (sức khỏe, dinh dưỡng, cách dùng, giá cả)
2. Nếu bị hỏi ngoài chủ đề, nhẹ nhàng hướng về yến sào
3. Không đưa ra giá cụ thể (vì giá theo thị trường) — hướng khách nhắn Zalo để báo giá
4. Luôn kết thúc bằng lời mời đặt hàng hoặc gợi ý tiếp theo
5. Viết tiếng Việt có dấu, câu ngắn, không quá 3 đoạn mỗi lần trả lời`;

/* ── State ──────────────────────────────────────────────────── */
let chatHistory = []; // [{ role: 'user'|'assistant', content: '...' }]
let isTyping = false;

/* ── DOM refs (resolve sau khi HTML đã inject) ──────────────── */
let dom = {};

/* ── Khởi tạo ───────────────────────────────────────────────── */
function initChatbot() {
    dom = {
        trigger:    document.getElementById('ai-chat-trigger'),
        panel:      document.getElementById('ai-chat-panel'),
        messages:   document.getElementById('ai-chat-messages'),
        input:      document.getElementById('ai-chat-input'),
        sendBtn:    document.getElementById('ai-send-btn'),
        closeBtn:   document.getElementById('ai-close-btn'),
        clearBtn:   document.getElementById('ai-clear-btn'),
        quickReps:  document.getElementById('ai-quick-replies'),
        statusText: document.getElementById('ai-status-text'),
    };

    if (!dom.trigger || !dom.panel) return;

    // Khởi tạo hoặc lấy sessionId
    initSessionId();

    // Restore session history
    restoreSession();

    // Show welcome message nếu chưa có lịch sử
    if (chatHistory.length === 0) {
        appendWelcome();
    } else {
        renderHistory();
    }

    // Events
    dom.trigger.addEventListener('click', togglePanel);
    dom.closeBtn.addEventListener('click', closePanel);
    dom.sendBtn.addEventListener('click', handleSend);
    dom.clearBtn.addEventListener('click', clearChat);

    dom.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });

    // Auto resize textarea
    dom.input.addEventListener('input', () => {
        dom.input.style.height = 'auto';
        dom.input.style.height = Math.min(dom.input.scrollHeight, 100) + 'px';
    });

    // Quick reply chips
    document.querySelectorAll('.ai-quick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const msg = btn.getAttribute('data-msg');
            if (msg) sendMessage(msg);
        });
    });
}

/* ── Panel toggle ───────────────────────────────────────────── */
function togglePanel() {
    const isOpen = dom.panel.classList.contains('is-open');
    isOpen ? closePanel() : openPanel();
}

function openPanel() {
    dom.panel.classList.add('is-open');
    dom.panel.setAttribute('aria-hidden', 'false');
    dom.trigger.classList.add('is-open');
    dom.input.focus();
    scrollToBottom();
}

function closePanel() {
    dom.panel.classList.remove('is-open');
    dom.panel.setAttribute('aria-hidden', 'true');
    dom.trigger.classList.remove('is-open');
}

/* ── Welcome message ────────────────────────────────────────── */
function appendWelcome() {
    appendBotMessage('Xin chào! 👋 Tôi là Thủy, trợ lý AI của Yến Sào Tám Thủy.\n\nBạn đang tìm hiểu về yến sào hoặc cần tư vấn sản phẩm? Hỏi tôi bất cứ điều gì nhé! 🍃');
}

/* ── Handle send ────────────────────────────────────────────── */
async function handleSend() {
    const text = dom.input.value.trim();
    if (!text || isTyping) return;

    dom.input.value = '';
    dom.input.style.height = 'auto';
    sendMessage(text);
}

async function sendMessage(text) {
    if (isTyping) return;

    // Ẩn quick replies sau lần chat đầu tiên
    if (dom.quickReps) dom.quickReps.classList.add('is-hidden');

    // Render user message
    appendUserMessage(text);

    // Add to history
    chatHistory.push({ role: 'user', content: text });
    trimHistory();

    // Show typing indicator
    isTyping = true;
    dom.sendBtn.disabled = true;
    setStatus('Đang trả lời...');
    const typingEl = showTypingIndicator();

    try {
        const reply = await callAI(chatHistory);

        // Remove typing indicator
        typingEl.remove();
        isTyping = false;
        dom.sendBtn.disabled = false;
        setStatus('Đang hoạt động');

        // Render assistant reply
        appendBotMessage(reply);
        chatHistory.push({ role: 'assistant', content: reply });
        trimHistory();
        saveSession();

    } catch (err) {
        typingEl.remove();
        isTyping = false;
        dom.sendBtn.disabled = false;
        setStatus('Đang hoạt động');
        appendErrorMessage('Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại hoặc liên hệ Zalo để được hỗ trợ nhé! 💬');
        console.error('[Chatbot]', err);
    }
}

/* ── Call AI via n8n proxy ──────────────────────────────────── */
async function callAI(messages) {
    // Nếu chưa có webhook URL → dùng mock response (để test UI)
    if (!CHATBOT_CONFIG.n8nWebhookUrl) {
        return await mockResponse(messages[messages.length - 1].content);
    }

    const payload = {
        sessionId: getSessionId(), // Gửi session ID cho n8n để quản lý bộ nhớ
        messages: messages,
        model: 'gpt-4o-mini',
        max_tokens: 500,
        temperature: 0.75,
    };

    const res = await fetch(CHATBOT_CONFIG.n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    // n8n trả về { reply: '...' } hoặc { choices: [{ message: { content: '...' } }] }
    return data.reply
        || data?.choices?.[0]?.message?.content
        || data?.output
        || 'Xin lỗi, tôi không nhận được phản hồi rõ ràng. Bạn thử lại nhé!';
}

/* ── Mock response khi chưa có n8n URL ─────────────────────── */
async function mockResponse(userMsg) {
    const delay = Math.random() * (CHATBOT_CONFIG.typingDelay.max - CHATBOT_CONFIG.typingDelay.min) + CHATBOT_CONFIG.typingDelay.min;
    await new Promise(r => setTimeout(r, delay));

    const lower = userMsg.toLowerCase();
    if (lower.includes('giá') || lower.includes('bao nhiêu') || lower.includes('tiền')) {
        return 'Giá yến sào biến động theo thị trường và loại sản phẩm. Bạn nhắn Zalo để mình báo giá chính xác và mới nhất nhé! Thường mình phản hồi trong vòng 5 phút 😊';
    }
    if (lower.includes('tác dụng') || lower.includes('lợi ích') || lower.includes('sức khỏe')) {
        return 'Yến sào Tám Thủy có nhiều lợi ích tuyệt vời:\n\n✅ Tăng cường miễn dịch, chống oxy hóa\n✅ Hỗ trợ hô hấp, phổi khỏe\n✅ Đẹp da, cải thiện độ ẩm\n✅ Rất tốt cho trẻ em, người cao tuổi và phụ nữ sau sinh\n\nBạn muốn tìm hiểu thêm sản phẩm nào cụ thể không?';
    }
    if (lower.includes('đặt hàng') || lower.includes('mua') || lower.includes('order')) {
        return 'Đặt hàng rất đơn giản! Bạn có thể:\n\n📝 Điền form trên website (phần Đặt Hàng) — mình phản hồi trong 15 phút\n💬 Nhắn Zalo trực tiếp để được tư vấn 1:1\n📞 Gọi hotline để đặt ngay\n\nBạn muốn đặt sản phẩm nào?';
    }
    if (lower.includes('loại') || lower.includes('sản phẩm') || lower.includes('có gì')) {
        return 'Tám Thủy có 6 dòng sản phẩm chính:\n\n🥚 Yến Thô — nguyên tổ 100% tự nhiên\n💎 Yến Tinh Chế — đã làm sạch, định hình đẹp\n🌿 Yến Tươi — thu hoạch đóng gói trong ngày\n🍯 Hũ Yến Chưng — tiện lợi, ăn liền\n❤️ Hồng Yến Đảo — loại quý hiếm nhất\n🎁 Bộ Quà Hoàng Gia — phù hợp biếu tặng\n\nBạn quan tâm loại nào nhất?';
    }
    return '⚠️ Lưu ý: Chatbot đang chạy ở chế độ demo (chưa kết nối n8n). Paste webhook URL vào CHATBOT_CONFIG.n8nWebhookUrl trong file chatbot.js để bật AI thật nhé!';
}

/* ── Render functions ───────────────────────────────────────── */
function appendUserMessage(text) {
    const el = document.createElement('div');
    el.className = 'ai-msg user';
    el.innerHTML = `<div class="ai-msg-bubble">${escapeHtml(text)}</div>`;
    dom.messages.appendChild(el);
    scrollToBottom();
}

function appendBotMessage(text) {
    const el = document.createElement('div');
    el.className = 'ai-msg assistant';
    el.innerHTML = `
        <div class="ai-msg-avatar">
            <img src="./assets/images/avt-svg.svg" alt="Thủy">
        </div>
        <div class="ai-msg-bubble">${escapeHtml(text)}</div>
    `;
    dom.messages.appendChild(el);
    scrollToBottom();
}

function appendErrorMessage(text) {
    const el = document.createElement('div');
    el.className = 'ai-msg assistant ai-msg-error';
    el.innerHTML = `<div class="ai-msg-bubble">${escapeHtml(text)}</div>`;
    dom.messages.appendChild(el);
    scrollToBottom();
}

function showTypingIndicator() {
    const el = document.createElement('div');
    el.className = 'ai-msg assistant';
    el.id = 'ai-typing-indicator';
    el.innerHTML = `
        <div class="ai-msg-avatar">
            <img src="./assets/images/avt-svg.svg" alt="Thủy">
        </div>
        <div class="ai-typing-dots">
            <span class="ai-typing-dot"></span>
            <span class="ai-typing-dot"></span>
            <span class="ai-typing-dot"></span>
        </div>
    `;
    dom.messages.appendChild(el);
    scrollToBottom();
    return el;
}

function renderHistory() {
    dom.messages.innerHTML = '';
    chatHistory.forEach(msg => {
        if (msg.role === 'user') appendUserMessage(msg.content);
        else if (msg.role === 'assistant') appendBotMessage(msg.content);
    });
    if (dom.quickReps) dom.quickReps.classList.add('is-hidden');
}

/* ── Helpers ────────────────────────────────────────────────── */
function scrollToBottom() {
    requestAnimationFrame(() => {
        dom.messages.scrollTop = dom.messages.scrollHeight;
    });
}

function setStatus(text) {
    if (dom.statusText) dom.statusText.textContent = text;
}

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/\n/g, '<br>');
}

function trimHistory() {
    if (chatHistory.length > CHATBOT_CONFIG.maxHistoryLength) {
        chatHistory = chatHistory.slice(-CHATBOT_CONFIG.maxHistoryLength);
    }
}

function clearChat() {
    chatHistory = [];
    sessionStorage.removeItem('ai-chat-history');
    sessionStorage.removeItem('ai-session-id'); // Xóa luôn session ID
    initSessionId(); // Tạo ID mới
    dom.messages.innerHTML = '';
    appendWelcome();
    if (dom.quickReps) dom.quickReps.classList.remove('is-hidden');
}

function saveSession() {
    try {
        sessionStorage.setItem('ai-chat-history', JSON.stringify(chatHistory));
    } catch (_) {}
}

function restoreSession() {
    try {
        const saved = sessionStorage.getItem('ai-chat-history');
        if (saved) {
            chatHistory = JSON.parse(saved);
            renderHistory();
        } else {
            appendWelcome();
        }
    } catch (e) {
        appendWelcome();
    }
}

function initSessionId() {
    if (!sessionStorage.getItem('ai-session-id')) {
        const randomId = 'session_' + Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('ai-session-id', randomId);
    }
}

function getSessionId() {
    return sessionStorage.getItem('ai-session-id') || 'default_session';
}

/* ── Auto-init khi DOM ready ────────────────────────────────── */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
} else {
    initChatbot();
}
