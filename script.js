// ============================================
// Ternary Computing — Interactive Scripts
// ============================================

// --- Mobile Nav Toggle ---
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// Close nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// --- Balanced Ternary Converter ---

function decimalToBalancedTernary(n) {
  if (n === 0) return '0';
  const digits = [];
  let num = n;
  while (num !== 0) {
    let remainder = num % 3;
    num = Math.floor(num / 3);
    if (remainder === 2) {
      remainder = -1;
      num += 1;
    } else if (remainder === -2) {
      remainder = 1;
      num -= 1;
    } else if (remainder === -1 && num < 0) {
      // handle negative remainders properly
    }
    digits.push(remainder);
  }
  return digits.reverse().map(d => d === -1 ? 'T' : d.toString()).join('');
}

function balancedTernaryToDecimal(s) {
  const cleaned = s.replace(/\s/g, '').toUpperCase();
  if (!/^[01T]+$/.test(cleaned)) return null;
  let result = 0;
  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    const digit = char === 'T' ? -1 : parseInt(char, 10);
    result = result * 3 + digit;
  }
  return result;
}

function updateVisualizer(n) {
  const barsContainer = document.getElementById('tritBars');
  if (!barsContainer) return;
  barsContainer.innerHTML = '';

  if (n === 0) {
    const bar = createTritBar(0, '0');
    barsContainer.appendChild(bar);
    return;
  }

  const bt = decimalToBalancedTernary(n);
  for (const char of bt) {
    const val = char === 'T' ? -1 : parseInt(char, 10);
    const bar = createTritBar(val, char);
    barsContainer.appendChild(bar);
  }
}

function createTritBar(value, label) {
  const bar = document.createElement('div');
  bar.className = 'trit-bar';

  const track = document.createElement('div');
  track.className = 'trit-bar-track';

  const fill = document.createElement('div');
  fill.className = 'trit-bar-fill';

  // Height based on value: -1 = 33%, 0 = 50%, +1 = 100%
  const heights = { '-1': '33%', '0': '50%', '1': '100%' };
  const colors = { '-1': '#ef4444', '0': '#6b7280', '1': '#22c55e' };

  fill.style.height = heights[value] || '50%';
  fill.style.background = colors[value] || '#6b7280';

  track.appendChild(fill);

  const labelEl = document.createElement('span');
  labelEl.className = 'trit-bar-label';
  labelEl.textContent = label;
  labelEl.style.color = colors[value] || '#6b7280';

  bar.appendChild(track);
  bar.appendChild(labelEl);

  return bar;
}

// --- Converter Event Listeners ---
const decimalInput = document.getElementById('decimalInput');
const ternaryInput = document.getElementById('ternaryInput');
const converterNote = document.getElementById('converterNote');

function handleDecimalChange() {
  const val = parseInt(decimalInput.value, 10);
  if (isNaN(val)) {
    if (converterNote) converterNote.textContent = 'Enter a valid integer.';
    return;
  }
  if (val < -364 || val > 364) {
    if (converterNote) converterNote.textContent = 'Range: -364 to 364 (6 trits).';
    return;
  }
  const bt = decimalToBalancedTernary(val);
  ternaryInput.value = bt;
  if (converterNote) converterNote.textContent = `${val}₁₀ = ${bt}₃ (balanced ternary)`;
  updateVisualizer(val);
}

function handleTernaryChange() {
  const val = ternaryInput.value.trim();
  if (!val) return;
  const dec = balancedTernaryToDecimal(val);
  if (dec === null) {
    if (converterNote) converterNote.textContent = 'Invalid balanced ternary. Use only 0, 1, and T.';
    return;
  }
  decimalInput.value = dec;
  if (converterNote) converterNote.textContent = `${val}₃ = ${dec}₁₀ (decimal)`;
  updateVisualizer(dec);
}

if (decimalInput) {
  decimalInput.addEventListener('input', handleDecimalChange);
}

if (ternaryInput) {
  ternaryInput.addEventListener('input', handleTernaryChange);
}

// Initialize visualizer
updateVisualizer(42);

// --- Nav scroll effect ---
const nav = document.getElementById('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > 100) {
    nav.style.background = 'rgba(10, 10, 15, 0.95)';
  } else {
    nav.style.background = 'rgba(10, 10, 15, 0.85)';
  }
  lastScroll = currentScroll;
});

// --- Intersection Observer for scroll animations ---
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Apply to cards and sections
document.querySelectorAll('.card, .logic-card, .balanced-card, .future-card, .timeline-item, .converter, .trit-visualizer').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});
