// public/js/app.js

// --------------------------
// Toast helper
// --------------------------
window.toast = (function(){
  function push({ type = 'success', title = '' } = {}) {
    const id = 'toast_' + Date.now();
    const container = getContainer();
    const el = document.createElement('div');
    el.className = 'card';
    el.style.minWidth = '220px';
    el.style.padding = '.5rem .75rem';
    el.style.borderLeft = type === 'error' ? '4px solid #ef4444' : '4px solid #10B981';
    el.innerHTML = `<div style="font-size:0.95rem">${title}</div>`;
    container.appendChild(el);
    setTimeout(()=>{ el.remove(); }, 3800);
  }
  function getContainer() {
    let c = document.getElementById('toast-container');
    if (!c) {
      c = document.createElement('div');
      c.id = 'toast-container';
      c.style.position = 'fixed';
      c.style.top = '1rem';
      c.style.right = '1rem';
      c.style.zIndex = 9999;
      c.style.display = 'flex';
      c.style.flexDirection = 'column';
      c.style.gap = '.5rem';
      document.body.appendChild(c);
    }
    return c;
  }
  return { push };
})();

// --------------------------
// Auth helpers
// --------------------------
const AUTH_KEY = 'ticketapp_session';

window.auth = {
  login: async (email, password) => {
    // simulated check
    if (email === 'test.user@example.com' && password === 'Password123!') {
      const token = 'token_' + Date.now();
      localStorage.setItem(AUTH_KEY, token);
      return { ok: true, token };
    }
    return { ok: false, message: 'Invalid credentials' };
  },
  signup: async (email, password) => {
    // just issue token
    const token = 'token_' + Date.now();
    localStorage.setItem(AUTH_KEY, token);
    return { ok: true, token };
  },
  logout: () => {
    localStorage.removeItem(AUTH_KEY);
  },
  token: () => localStorage.getItem(AUTH_KEY),
};

// --------------------------
// Ticket service
// --------------------------
(function(){
  const STORAGE_KEY = 'ticketapp_tickets_v1';
  const VALID_STATUSES = ['open','in_progress','closed'];

  function readAll() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }
  function writeAll(t) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(t));
  }

  window.ticketService = {
    VALID_STATUSES,
    validateTicketInput(ticket) {
      const errors = {};
      if (!ticket.title || ticket.title.trim().length < 3) {
        errors.title = 'Title is required (min 3 characters).';
      } else if (ticket.title.length > 150) {
        errors.title = 'Title too long (max 150).';
      }
      if (!ticket.status || !VALID_STATUSES.includes(ticket.status)) {
        errors.status = 'Status must be one of: open, in_progress, closed.';
      }
      if (ticket.description && ticket.description.length > 2000) {
        errors.description = 'Description too long (max 2000).';
      }
      if (ticket.priority !== undefined && ticket.priority !== null && ticket.priority !== '') {
        const p = Number(ticket.priority);
        if (!Number.isInteger(p) || p < 1 || p > 5) {
          errors.priority = 'Priority must be an integer between 1 and 5.';
        }
      }
      return errors;
    },
    async getTickets() {
      return new Promise((res) => setTimeout(()=> res(readAll()), 200));
    },
    async createTicket(ticket) {
      const all = readAll();
      const now = new Date().toISOString();
      const newT = {
        id: Date.now().toString(),
        title: ticket.title.trim(),
        description: ticket.description || '',
        status: ticket.status,
        priority: ticket.priority ? Number(ticket.priority) : null,
        reporter: ticket.reporter || 'test.user@example.com',
        createdAt: now,
        updatedAt: now,
      };
      all.unshift(newT);
      writeAll(all);
      return newT;
    },
    async updateTicket(id, changes) {
      const all = readAll();
      const idx = all.findIndex(t => t.id === id);
      if (idx === -1) throw new Error('Ticket not found');
      all[idx] = { ...all[idx], ...changes, updatedAt: new Date().toISOString() };
      writeAll(all);
      return all[idx];
    },
    async deleteTicket(id) {
      const all = readAll();
      const filtered = all.filter(t => t.id !== id);
      writeAll(filtered);
      return true;
    }
  };
})();

