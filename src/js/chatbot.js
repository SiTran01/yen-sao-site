/* ============================================================
   chatbot.js — Trợ Lý AI Tám Thủy
   Dùng n8n làm proxy  OpenAI API (GPT-4o-mini)
   ============================================================ */

/* ── Config — paste n8n webhook URL vào đây ─────────────────
   Cách tạo n8n workflow:
   1. Tạo workflow mới trong n8n
   2. Thêm node "Webhook"  method POST, path /ai-chat
   3. Thêm node "OpenAI"  model gpt-4o-mini, input: {{ $json.messages }}
   4. Thêm node "Respond to Webhook"  trả về { reply: ... }
   5. Copy URL webhook vào N8N_AI_WEBHOOK_URL bên dưới
   ─────────────────────────────────────────────────────────── */
const CHATBOT_CONFIG = {
    // Lấy config từ config.js & .env
    n8nWebhookUrl: window.SITE_CONFIG?.webhooks?.chatbot || '',
    maxHistoryLength: window.SITE_CONFIG?.chatbot?.maxHistory || 12,
    typingDelay: window.SITE_CONFIG?.chatbot?.typingDelay || { min: 600, max: 1500 },
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
5. Viết tiếng Việt có dấu, câu ngắn, không quá 3 đoạn mỗi lần trả lời
6. QUAN TRỌNG: Tám Thủy CHỈ BÁN 4 loại yến sào nguyên bản (Yến Thô, Yến Tinh Chế, Yến Tươi, Yến Chưng). TUYỆT ĐỐI KHÔNG BÁN yến huyết, yến hồng hay các loại yến khác. Nếu khách hỏi mua yến huyết/hồng, hãy lịch sự từ chối và giới thiệu sang 4 sản phẩm của shop.`;

/* ── State ──────────────────────────────────────────────────── */
let chatHistory = []; // [{ role: 'user'|'assistant', content: '...' }]
let isTyping = false;
const notifSound = new Audio('./assets/notification-sound.mp3');
notifSound.volume = 0.6; // Giảm âm lượng xuống mức vừa phải (60%)

function playNotificationSound() {
    try {
        notifSound.play().catch(e => console.log('Audio play error:', e));
    } catch (e) {}
}

/* ── DOM refs (resolve sau khi HTML đã inject) ──────────────── */
let dom = {};

/* ── Khởi tạo ───────────────────────────────────────────────── */
function initChatbot() {
    if (window.SITE_CONFIG && window.SITE_CONFIG.features && window.SITE_CONFIG.features.chatbot === false) {
        document.getElementById('ai-chat-trigger')?.remove();
        document.getElementById('ai-chat-panel')?.remove();
        return;
    }

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

    // Handle Name Capture Overlay
    const nameOverlay = document.getElementById('ai-name-overlay');
    const nameInput = document.getElementById('ai-guest-name-input');
    const nameSubmitBtn = document.getElementById('ai-name-submit-btn');
    const savedName = localStorage.getItem('tamthuy_guest_name');

    if (nameOverlay && nameInput && nameSubmitBtn) {
        if (!savedName) {
            // Chưa có tên, hiện overlay và ẩn thanh chat
            nameOverlay.classList.remove('is-hidden');
            dom.input.disabled = true;
            
            nameSubmitBtn.addEventListener('click', () => {
                const val = nameInput.value.trim();
                if (val.length > 0) {
                    localStorage.setItem('tamthuy_guest_name', val);
                    nameOverlay.classList.add('is-hidden');
                    dom.input.disabled = false;
                    dom.input.focus();
                    
                    if (chatHistory.length === 0) {
                        appendBotMessage(`Dạ chào anh/chị ${val}, em có thể giúp gì cho anh/chị ạ?`);
                        chatHistory.push({ role: 'assistant', content: `Dạ chào anh/chị ${val}, em có thể giúp gì cho anh/chị ạ?` });
                        saveSession();
                    }
                }
            });
            
            nameInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') nameSubmitBtn.click();
            });
        } else {
            nameOverlay.classList.add('is-hidden');
            if (chatHistory.length > 0) {
                renderHistory();
            }
        }
    } else {
        if (chatHistory.length > 0) {
            renderHistory();
        }
    }

    // --- PROACTIVE GREETING BUBBLE ---
    const greetingBubble = document.getElementById('ai-chat-greeting');
    const greetingText = document.getElementById('ai-greeting-text');
    
    const isAutoGreetingEnabled = window.SITE_CONFIG?.chatbot?.autoGreeting !== false;

    if (isAutoGreetingEnabled && greetingBubble && greetingText && chatHistory.length === 0 && !sessionStorage.getItem('ai_greeting_shown')) {
        const messages = [
            "Xin chào! ",
            "Mình là Trợ Lý Tám Thủy. Bạn cần tư vấn về yến sào ạ? "
        ];
        
        let step = 0;
        
        const showNextMessage = () => {
            if (dom.panel.classList.contains('is-open') || step >= messages.length) {
                greetingBubble.classList.remove('show-greeting');
                return;
            }
            
            greetingBubble.classList.remove('show-greeting');
            
            setTimeout(() => {
                if (dom.panel.classList.contains('is-open')) return;
                
                greetingText.innerText = messages[step];
                greetingBubble.classList.add('show-greeting');
                playNotificationSound();
                
                if (step === messages.length - 1) {
                    // Nếu là tin nhắn cuối cùng, chỉ ẩn nếu greetingTimeout > 0
                    if (window.SITE_CONFIG?.chatbot?.greetingTimeout > 0) {
                        setTimeout(() => {
                            greetingBubble.classList.remove('show-greeting');
                            step++; // Đánh dấu đã xong
                        }, window.SITE_CONFIG.chatbot.greetingTimeout);
                    }
                } else {
                    // Nếu chưa phải tin nhắn cuối, chuyển sang tin nhắn tiếp theo sau 3 giây
                    setTimeout(() => {
                        step++;
                        showNextMessage();
                    }, 3000);
                }
            }, 500);
        };
        
        const startGreeting = () => {
            // Xoá event listener để chỉ chạy 1 lần
            document.removeEventListener('click', startGreeting);
            document.removeEventListener('scroll', startGreeting);
            document.removeEventListener('touchstart', startGreeting);
            document.removeEventListener('keydown', startGreeting);
            
            const delayTime = window.SITE_CONFIG?.chatbot?.greetingDelay ?? 1000;
            setTimeout(() => {
                showNextMessage();
            }, delayTime); // Đợi theo config sau khi khách tương tác mới bắt đầu hiện
        };
        
        // Chờ khách hàng tương tác với trang web rồi mới hiện lời chào để trình duyệt cho phép phát âm thanh
        document.addEventListener('click', startGreeting);
        document.addEventListener('scroll', startGreeting, { once: true });
        document.addEventListener('touchstart', startGreeting, { once: true });
        document.addEventListener('keydown', startGreeting, { once: true });
        
        greetingBubble.addEventListener('click', () => {
            greetingBubble.classList.remove('show-greeting');
            step = messages.length;
            openPanel();
        });
        
        sessionStorage.setItem('ai_greeting_shown', 'true');
    }

    // Initialize contextual proactive triggers based on scroll position
    initContextualTriggers();

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
    const greetingBubble = document.getElementById('ai-chat-greeting');
    if (greetingBubble) greetingBubble.classList.remove('show-greeting');
    
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
window.closeChatPanel = closePanel;

/* ── Welcome message ────────────────────────────────────────── */
function appendWelcome() {
    appendBotMessage('Xin chào!  Tôi là Thanh Thủy, trợ lý AI của Yến Sào Tám Thủy.\n\nBạn đang tìm hiểu về yến sào hoặc cần tư vấn sản phẩm? Hỏi tôi bất cứ điều gì nhé! ');
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
        appendErrorMessage('Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại hoặc liên hệ Zalo để được hỗ trợ nhé! ');
        console.error('[Chatbot]', err);
    }
}

/* ── Call AI via n8n proxy ──────────────────────────────────── */
async function callAI(messages) {
    // Nếu chưa có webhook URL  dùng mock response (để test UI)
    if (!CHATBOT_CONFIG.n8nWebhookUrl) {
        return await mockResponse(messages[messages.length - 1].content);
    }

    const payload = {
        sessionId: getSessionId(), // Gửi session ID cho n8n để quản lý bộ nhớ
        guestName: localStorage.getItem('tamthuy_guest_name') || 'Khách',
        systemPrompt: SYSTEM_PROMPT, // Truyền system prompt chứa thông tin sản phẩm sang n8n
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
        return 'Giá yến sào biến động theo thị trường và loại sản phẩm. Bạn nhắn Zalo để mình báo giá chính xác và mới nhất nhé! Thường mình phản hồi trong vòng 5 phút ';
    }
    if (lower.includes('tác dụng') || lower.includes('lợi ích') || lower.includes('sức khỏe')) {
        return 'Yến sào Tám Thủy có nhiều lợi ích tuyệt vời:\n\n Tăng cường miễn dịch, chống oxy hóa\n Hỗ trợ hô hấp, phổi khỏe\n Đẹp da, cải thiện độ ẩm\n Rất tốt cho trẻ em, người cao tuổi và phụ nữ sau sinh\n\nBạn muốn tìm hiểu thêm sản phẩm nào cụ thể không?';
    }
    if (lower.includes('đặt hàng') || lower.includes('mua') || lower.includes('order')) {
        return 'Đặt hàng rất đơn giản! Bạn có thể:\n\n Điền form trên website (phần Đặt Hàng) — mình phản hồi trong 15 phút\n Nhắn Zalo trực tiếp để được tư vấn 1:1\n Gọi hotline để đặt ngay\n\nBạn muốn đặt sản phẩm nào?';
    }
    if (lower.includes('loại') || lower.includes('sản phẩm') || lower.includes('có gì')) {
        return 'Tám Thủy chuyên cung cấp 4 dòng sản phẩm chính:\n\n Yến Thô — nguyên tổ 100% tự nhiên\n Yến Tinh Chế — đã làm sạch, định hình đẹp\n Yến Tươi — làm sạch trong ngày, cực tiện lợi\n Hũ Yến Chưng — tiện lợi, ăn liền\n\nBạn quan tâm loại nào nhất?';
    }
    return `️ Lỗi Demo: WEBHOOK_CHATBOT trong ENV HTML là "${window.ENV?.WEBHOOK_CHATBOT}", trong SITE_CONFIG là "${window.SITE_CONFIG?.webhooks?.chatbot}"`;
}

/* ── Render functions ───────────────────────────────────────── */
function appendUserMessage(text) {
    const el = document.createElement('div');
    el.className = 'ai-msg user';
    const savedName = localStorage.getItem('tamthuy_guest_name') || 'Bạn';
    el.innerHTML = `
        <div class="ai-msg-content" style="align-items: flex-end; max-width: 85%;">
            <div class="ai-msg-name" style="font-size: 11.5px; color: rgba(255,255,255,0.5); font-weight: 500; margin-bottom: -4px; margin-right: 4px;">${escapeHtml(savedName)}</div>
            <div class="ai-msg-bubble">${escapeHtml(text)}</div>
        </div>
    `;
    dom.messages.appendChild(el);
    scrollToBottom();
}

function appendBotMessage(text) {
    playNotificationSound();
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
            <div class="ai-msg-name" style="font-size: 11.5px; color: rgba(197, 160, 89, 0.9); font-weight: 600; margin-bottom: -4px; margin-left: 4px;">Thanh Thủy (Trợ lý AI)</div>
            ${bubbleContent ? `<div class="ai-msg-bubble">${bubbleContent}</div>` : ''}
            ${genUIHtml}
        </div>
    `;
    dom.messages.appendChild(el);
    scrollToBottom();
}

window.scrollToProduct = function(productId) {
    console.log('[Tám Thủy Chatbot] Clicked product link:', productId);
    
    if (!productId || productId.trim() === '' || productId === 'NOT_FOUND') {
        // Fix tuyệt đối cho trường hợp DOM cũ chưa update (Vite HMR không load lại trang)
        const links = document.querySelectorAll('.ai-product-link');
        if (links.length > 0) {
            const rawName = links[links.length - 1].innerText;
            const searchStr = rawName.toLowerCase().normalize('NFC').trim();
            const searchStrNoTones = searchStr.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
            
            if (searchStr.includes('tinh') || searchStrNoTones.includes('tinh') || searchStr.includes('ép') || searchStrNoTones.includes('ep')) productId = 'yen-tinh-che';
            else if (searchStr.includes('tươi') || searchStrNoTones.includes('tuoi')) productId = 'yen-tuoi';
            else if (searchStr.includes('thô') || searchStrNoTones.includes('tho') || searchStr.includes('nguyên bản')) productId = 'yen-tho';
            else if (searchStr.includes('chưng') || searchStrNoTones.includes('chung') || searchStr.includes('hũ') || searchStrNoTones.includes('hu') || searchStr.includes('sẵn') || searchStrNoTones.includes('san')) productId = 'yen-chung-san';
        }
        
        if (!productId || productId.trim() === '' || productId === 'NOT_FOUND') {
            alert('Bot không nhận diện được chính xác sản phẩm. Vui lòng chat tên sản phẩm rõ hơn ạ.');
            console.warn('[Tám Thủy Chatbot] Invalid or empty productId, aborting scroll');
            return;
        }
    }
    
    let targetSelector = '#v-' + productId;
    let el = document.querySelector(targetSelector);
    
    if (!el) {
        el = document.getElementById('v-' + productId);
    }
    
    if (el) {
        console.log('[Tám Thủy Chatbot] Lenis scrolling to:', el);
        if (typeof window.luxuryScrollTo === 'function') {
            window.luxuryScrollTo(el);
        } else {
            el.scrollIntoView({behavior: 'smooth'});
        }
    }
};

function renderMiniOrderForm(data) {
    let productName = data.product;
    let productId = '';
    if (window.YEN_SAO_DB) {
        const searchStr = (data.product || '').toLowerCase().normalize('NFC').trim();
        const searchStrNoTones = searchStr.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
        
        let bestMatch = null;
        if (searchStr.includes('tinh') || searchStrNoTones.includes('tinh') || searchStr.includes('ép') || searchStrNoTones.includes('ep')) bestMatch = 'yen-tinh-che';
        else if (searchStr.includes('tươi') || searchStrNoTones.includes('tuoi')) bestMatch = 'yen-tuoi';
        else if (searchStr.includes('thô') || searchStrNoTones.includes('tho') || searchStr.includes('nguyên bản')) bestMatch = 'yen-tho';
        else if (searchStr.includes('chưng') || searchStrNoTones.includes('chung') || searchStr.includes('hũ') || searchStrNoTones.includes('hu') || searchStr.includes('sẵn') || searchStrNoTones.includes('san')) bestMatch = 'yen-chung-san';

        const p = window.YEN_SAO_DB.products.find(x => {
            const dbId = x.id.toLowerCase().normalize('NFC');
            if (bestMatch) return dbId === bestMatch;
            const dbName = x.name.toLowerCase().normalize('NFC');
            return dbId === searchStr || dbName.includes(searchStr) || searchStr.includes(dbName) || searchStr.includes(dbId.replace('yen-', ''));
        });
        if (p) {
            productName = p.name;
            productId = p.id;
        }
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
                <span class="ai-mf-value">
                    <a href="${productId ? '#v-'+productId : '#'}" class="ai-product-link" onclick="event.preventDefault(); event.stopPropagation(); window.scrollToProduct('${productId}');">${escapeHtml(productName || data.product || 'Yến Sào')}</a>
                </span>
            </div>
            <div class="ai-mf-input-group" style="margin-top: 12px;">
                <label>Số lượng (Có thể ghi rõ: tổ, lạng) *</label>
                <input type="text" id="${uniqueId}-qty" value="${escapeHtml(String(data.quantity || '1'))}" placeholder="VD: 10 tổ, 1 lạng...">
            </div>
            <div class="ai-mf-input-group">
                <label>Họ & Tên *</label>
                <input type="text" id="${uniqueId}-name" value="${escapeHtml(localStorage.getItem('tamthuy_guest_name') || data.name || '')}" placeholder="Nguyễn Văn A">
            </div>
            <div class="ai-mf-input-group">
                <label>Số điện thoại liên hệ *</label>
                <input type="tel" id="${uniqueId}-phone" value="${escapeHtml(data.phone || '')}" placeholder="09xx xxx xxx">
            </div>
            <div class="ai-mf-input-group">
                <label>Địa chỉ nhận hàng *</label>
                <input type="text" id="${uniqueId}-address" value="${escapeHtml(data.address || '')}" placeholder="Số nhà, đường, phường/xã...">
            </div>
            <button class="ai-mf-btn" onclick="submitMiniOrder('${escapeHtml(data.product)}', '${escapeHtml(String(data.quantity))}', '${uniqueId}', this)">
                Chốt Đơn Ngay
            </button>
        </div>
    </div>
    `;
}

window.submitMiniOrder = async function(productId, originalQty, formId, btnEl) {
    const name = document.getElementById(`${formId}-name`)?.value?.trim();
    const phone = document.getElementById(`${formId}-phone`)?.value?.trim();
    const address = document.getElementById(`${formId}-address`)?.value?.trim();
    const qtyInput = document.getElementById(`${formId}-qty`);
    const qty = qtyInput ? qtyInput.value.trim() : originalQty;

    if (!name || !phone || !address || !qty) {
        alert('Vui lòng điền đầy đủ thông tin để shop giao hàng ạ!');
        return;
    }

    btnEl.disabled = true;
    btnEl.innerText = 'Đang xử lý...';

    const payload = {
        name: name,
        phone: phone,
        address: address,
        product: productId,
        qty: qty,
        note: 'Đơn hàng tự động chốt từ AI Agent (Generative UI)',
        source: 'ai-agent',
        payment: 'COD',
        isGift: 'Không',
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
        
        btnEl.innerText = ' Đã gửi đơn thành công';
        btnEl.style.background = '#16a34a';
        btnEl.style.color = '#fff';
        btnEl.style.borderColor = '#16a34a';
        
        setTimeout(() => {
            appendBotMessage('Tuyệt vời! Em đã gửi thông tin đơn hàng cho bộ phận sale. Sẽ có nhân viên gọi điện cho anh/chị qua số ' + phone + ' trong ít phút nữa ạ! ');
        }, 600);

    } catch (e) {
        btnEl.disabled = false;
        btnEl.innerText = 'Lỗi. Thử lại';
        alert('Hệ thống đang bận, anh/chị thử lại sau nhé!');
    }
}

function appendErrorMessage(text) {
    const el = document.createElement('div');
    el.className = 'ai-msg assistant';
    el.innerHTML = `
        <div class="ai-msg-avatar">
            <img src="./assets/images/avt-svg.svg" alt="AI">
        </div>
        <div class="ai-msg-content">
            <div class="ai-msg-name" style="font-size: 11.5px; color: rgba(197, 160, 89, 0.9); font-weight: 600; margin-bottom: -4px; margin-left: 4px;">Thanh Thủy (Trợ lý AI)</div>
            <div class="ai-msg-bubble" style="border: 1px solid rgba(255,0,0,0.3);">${escapeHtml(text)}</div>
        </div>
    `;
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

/* ── Contextual Triggers ────────────────────────────────────── */
function initContextualTriggers() {
    if (window.SITE_CONFIG?.chatbot?.autoContextual === false) return;

    const greetingBubble = document.getElementById('ai-chat-greeting');
    const greetingText = document.getElementById('ai-greeting-text');
    if (!greetingBubble || !greetingText) return;

    const triggers = window.SITE_CONFIG?.chatbot?.contextualTriggers || [];
    if (triggers.length === 0) return;

    let activeTriggerTimer = null;
    let currentTriggerId = null;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const triggerId = entry.target.getAttribute('data-trigger-id');
            const config = triggers.find(t => t.id === triggerId);
            if (!config) return;

            if (entry.isIntersecting) {
                // Skip if already shown in this session
                if (sessionStorage.getItem(`ai_ctx_${triggerId}`)) return;
                
                currentTriggerId = triggerId;
                activeTriggerTimer = setTimeout(() => {
                    // Don't show if panel is already open
                    if (dom.panel.classList.contains('is-open')) return;
                    
                    // Hide any currently visible greeting
                    greetingBubble.classList.remove('show-greeting');
                    
                    setTimeout(() => {
                        greetingText.innerText = config.message;
                        greetingBubble.classList.add('show-greeting');
                        playNotificationSound();
                        
                        // Tự động ẩn theo greetingTimeout chung
                        if (window.SITE_CONFIG?.chatbot?.greetingTimeout > 0) {
                            setTimeout(() => {
                                if (greetingText.innerText.trim() === config.message.trim()) {
                                    greetingBubble.classList.remove('show-greeting');
                                }
                            }, window.SITE_CONFIG.chatbot.greetingTimeout);
                        }
                    }, 500); // Wait for fade out
                    
                    sessionStorage.setItem(`ai_ctx_${triggerId}`, 'true');
                }, config.delay);
                
            } else {
                // If user scrolls away before delay finishes, cancel timer
                if (currentTriggerId === triggerId && activeTriggerTimer) {
                    clearTimeout(activeTriggerTimer);
                    activeTriggerTimer = null;
                }
            }
        });
    }, {
        threshold: 0.6 // Trigger when element is 60% visible
    });

    // Start observing after a short delay
    setTimeout(() => {
        triggers.forEach(config => {
            const el = document.querySelector(config.selector);
            if (el) {
                el.setAttribute('data-trigger-id', config.id);
                observer.observe(el);
            }
        });
    }, 1000);
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
        sessionStorage.setItem('ai-chat-history-v2', JSON.stringify(chatHistory));
    } catch (_) {}
}

function restoreSession() {
    try {
        const saved = sessionStorage.getItem('ai-chat-history-v2');
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
