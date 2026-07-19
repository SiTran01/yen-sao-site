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
    // 🔧 CẤU HÌNH WEBHOOK
    n8nWebhookUrl: `http://${window.location.hostname}:5678/webhook/tamthuy-chat`,
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
        return 'Tám Thủy chuyên cung cấp 4 dòng sản phẩm chính:\n\n🥚 Yến Thô — nguyên tổ 100% tự nhiên\n💎 Yến Tinh Chế — đã làm sạch, định hình đẹp\n🌿 Yến Tươi — làm sạch trong ngày, cực tiện lợi\n🍯 Hũ Yến Chưng — tiện lợi, ăn liền\n\nBạn quan tâm loại nào nhất?';
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
    
    let bubbleContent = escapeHtml(text);
    let genUIHtml = '';

    // Parse Generative UI actions (JSON)
    try {
        const actionMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
        let parsed = null;
        let cleanText = text;
        
        if (actionMatch) {
            parsed = JSON.parse(actionMatch[1]);
            cleanText = text.replace(/```(?:json)?\s*[\s\S]*?\s*```/i, '').trim();
        } else if (text.trim().startsWith('{') && text.trim().endsWith('}')) {
            parsed = JSON.parse(text);
            cleanText = parsed.message || '';
        }

        // Fallback robust search if the above fails
        if (!parsed) {
            const rawMatch = text.match(/\{\s*"action"\s*:\s*"render_order_form"[\s\S]*?\}/i);
            if (rawMatch) {
                parsed = JSON.parse(rawMatch[0]);
                cleanText = text.replace(rawMatch[0], '').trim();
            }
        }

        if (parsed && parsed.action === 'render_order_form') {
            bubbleContent = cleanText ? escapeHtml(cleanText) : 'Mời anh/chị xác nhận thông tin đơn hàng bên dưới ạ:';
            genUIHtml = renderMiniOrderForm(parsed.data);
        }
    } catch (e) {
        console.error("GenUI Parse Error", e);
    }

    el.innerHTML = `
        <div class="ai-msg-avatar">
            <img src="./assets/images/avt-svg.svg" alt="Thủy">
        </div>
        <div class="ai-msg-content">
            ${bubbleContent ? `<div class="ai-msg-bubble">${bubbleContent}</div>` : ''}
            ${genUIHtml}
        </div>
    `;
    dom.messages.appendChild(el);
    scrollToBottom();
}

function renderMiniOrderForm(data) {
    let productName = data.product;
    if (window.YEN_SAO_DB) {
        const p = window.YEN_SAO_DB.products.find(x => x.id === data.product);
        if (p) productName = p.name;
    }
    const uniqueId = 'mini-form-' + Date.now();
    
    return `
    <div class="ai-mini-form">
        <div class="ai-mf-header">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
            <span>Phiếu Đặt Hàng Nhanh</span>
        </div>
        <div class="ai-mf-body">
            <div class="ai-mf-row">
                <span class="ai-mf-label">Sản phẩm:</span>
                <span class="ai-mf-value">${escapeHtml(productName || data.product || 'Yến Sào')}</span>
            </div>
            <div class="ai-mf-row">
                <span class="ai-mf-label">Số lượng:</span>
                <span class="ai-mf-value">${escapeHtml(String(data.quantity || 1))}</span>
            </div>
            <div class="ai-mf-input-group">
                <label>Số điện thoại liên hệ *</label>
                <input type="tel" id="${uniqueId}-phone" value="${escapeHtml(data.phone || '')}" placeholder="09xx xxx xxx">
            </div>
            <button class="ai-mf-btn" onclick="submitMiniOrder('${escapeHtml(data.product)}', '${escapeHtml(String(data.quantity))}', '${uniqueId}-phone', this)">
                Chốt Đơn Ngay
            </button>
        </div>
    </div>
    `;
}

window.submitMiniOrder = async function(productId, qty, phoneId, btnEl) {
    const phone = document.getElementById(phoneId)?.value?.trim();
    if (!phone) {
        alert('Vui lòng nhập số điện thoại để shop liên hệ xác nhận ạ!');
        return;
    }

    btnEl.disabled = true;
    btnEl.innerText = 'Đang xử lý...';

    const payload = {
        name: 'Khách Chat AI',
        phone: phone,
        product: productId,
        qty: qty,
        note: 'Đơn hàng tự động chốt từ AI Agent (Generative UI)',
        source: 'ai-agent',
        utm: window.location.search || ''
    };

    try {
        // Gọi thẳng hàm sendToN8N bên script.js nếu có
        if (window.sendToN8N) {
            await window.sendToN8N(payload);
        } else {
            console.log("Mock submit:", payload);
            await new Promise(r => setTimeout(r, 800));
        }
        
        btnEl.innerText = '✓ Đã gửi đơn thành công';
        btnEl.style.background = '#16a34a';
        btnEl.style.color = '#fff';
        btnEl.style.borderColor = '#16a34a';
        
        setTimeout(() => {
            appendBotMessage('Tuyệt vời! Em đã gửi thông tin đơn hàng cho bộ phận sale. Sẽ có nhân viên gọi điện cho anh/chị qua số ' + phone + ' trong ít phút nữa ạ! 🍃');
        }, 600);

    } catch (e) {
        btnEl.disabled = false;
        btnEl.innerText = 'Lỗi. Thử lại';
        alert('Hệ thống đang bận, anh/chị thử lại sau nhé!');
    }
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
