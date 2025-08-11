class AIAssistant {
  constructor() {
    this.apiBase = 'https://api.openai.com/v1';
    this.mediaRecorder = null;
    this.chunks = [];
    this.bindUI();
  }

  get key() {
    return sessionStorage.getItem('openai_key') || localStorage.getItem('openai_key') || '';
  }

  setKey(k, remember = false) {
    sessionStorage.removeItem('openai_key');
    localStorage.removeItem('openai_key');
    if (remember) localStorage.setItem('openai_key', k);
    else sessionStorage.setItem('openai_key', k);
  }

  async testKey() {
    try {
      const r = await fetch(`${this.apiBase}/models`, {
        headers: { Authorization: `Bearer ${this.key}` }
      });
      return r.ok;
    } catch { return false; }
  }

  openModal() { const el = document.getElementById('aiModal'); if (el) el.style.display = 'flex'; }
  closeModal() { const el = document.getElementById('aiModal'); if (el) el.style.display = 'none'; }

  bindUI() {
    const card = document.querySelector('.contractor-service[data-service="ai"]');
    if (card) card.addEventListener('click', (e) => { e.stopPropagation(); this.openModal(); });

    document.getElementById('aiCloseBtn')?.addEventListener('click', () => this.closeModal());

    const saveBtn = document.getElementById('saveKeyBtn');
    const clearBtn = document.getElementById('clearKeyBtn');
    const keyInput = document.getElementById('openaiKey');
    const keyStatus = document.getElementById('keyStatus');

    if (keyInput && this.key) keyInput.value = this.key.replace(/^(.{3}).+(.{3})$/, '$1•••$2');

    saveBtn?.addEventListener('click', async () => {
      const raw = (document.getElementById('openaiKey').value || '').trim();
      if (!raw) return;
      const remember = confirm('Keep the key on this device? OK = yes (localStorage), Cancel = session only');
      this.setKey(raw, remember);
        if (keyStatus) {
        keyStatus.textContent = 'Checking key...';
        keyStatus.style.color = '#6c757d';
      }
      const ok = await this.testKey();
      if (keyStatus) {
        keyStatus.textContent = ok ? 'Key is valid ✅' : 'Invalid key or access denied ❌';
        keyStatus.style.color = ok ? '#28a745' : '#dc3545';
      }
    });

    clearBtn?.addEventListener('click', () => {
      sessionStorage.removeItem('openai_key'); localStorage.removeItem('openai_key');
      if (keyInput) keyInput.value = '';
      if (keyStatus) { keyStatus.textContent = 'Key cleared.'; keyStatus.style.color = '#6c757d'; }
    });

    // Tabs
    document.querySelectorAll('.ai-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        document.querySelectorAll('.ai-tab-pane').forEach(p => p.setAttribute('style', 'display:none;'));
        const target = document.getElementById(`ai${tab.charAt(0).toUpperCase()+tab.slice(1)}Tab`);
        if (target) target.setAttribute('style', '');
      });
    });

    // Chat
    document.getElementById('chatForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const prompt = (document.getElementById('chatInput').value || '').trim();
      const model = document.getElementById('chatModel').value;
      if (!prompt) return;
      const out = document.getElementById('chatOutput');
      if (out) out.textContent = 'Processing...';
      const res = await this.chat(prompt, model);
      if (out) out.textContent = res || 'Error receiving response';
    });

    // Voice
    document.getElementById('recBtn')?.addEventListener('click', async () => {
      try {
        if (this.mediaRecorder?.state === 'recording') {
          this.mediaRecorder.stop();
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.chunks = [];
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = e => this.chunks.push(e.data);
        this.mediaRecorder.onstop = async () => {
          const blob = new Blob(this.chunks, { type: this.mediaRecorder.mimeType || 'audio/webm' });
          const out = document.getElementById('sttOutput');
           if (out) out.textContent = 'Sending audio...';
          const model = document.getElementById('sttModel').value;
          const text = await this.transcribe(blob, model);
           if (out) out.textContent = text || 'Error transcribing audio';
        };
        this.mediaRecorder.start();
        const rb = document.getElementById('recBtn');
        if (rb) rb.textContent = 'Stop recording';
        this.mediaRecorder.addEventListener('stop', () => {
          const btn = document.getElementById('recBtn');
           if (btn) btn.innerHTML = '<i class="fas fa-microphone"></i> Record';
        });
      } catch (e) {
        const out = document.getElementById('sttOutput');
        if (out) out.textContent = 'No microphone access or unsupported browser.';
      }
    });

    // Image
    document.getElementById('analyzeBtn')?.addEventListener('click', async () => {
      const file = document.getElementById('imageFile').files?.[0];
      const prompt = (document.getElementById('imagePrompt').value || 'Please analyze the image').trim();
      const out = document.getElementById('imageOutput');
      if (!file) { if (out) out.textContent = 'Please select an image first.'; return; }
      if (out) out.textContent = 'Analyzing image...';
      const res = await this.analyzeImage(file, prompt);
      if (out) out.textContent = res || 'Error analyzing image';
    });
  }

  async chat(prompt, model='gpt-4o-mini') {
    try {
      const r = await fetch(`${this.apiBase}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.key}` },
        body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }] })
      });
      if (!r.ok) return null;
      const j = await r.json();
      return j.choices?.[0]?.message?.content?.trim();
    } catch (e) { return null; }
  }

  async transcribe(blob, model='whisper-1') {
    try {
      const fd = new FormData();
      fd.append('file', blob, 'audio.webm');
      fd.append('model', model);
      const r = await fetch(`${this.apiBase}/audio/transcriptions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.key}` },
        body: fd
      });
      if (!r.ok) return null;
      const j = await r.json();
      return j.text;
    } catch (e) { return null; }
  }

  async analyzeImage(file, prompt, model='gpt-4o-mini') {
    try {
      const b64 = await this.fileToBase64(file);
      const r = await fetch(`${this.apiBase}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.key}` },
        body: JSON.stringify({
          model,
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: b64 } }
            ]
          }]
        })
      });
      if (!r.ok) return null;
      const j = await r.json();
      return j.choices?.[0]?.message?.content?.trim();
    } catch (e) { return null; }
  }

  fileToBase64(file) {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => { window.aiAssistant = new AIAssistant(); });


