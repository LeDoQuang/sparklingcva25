// === Tạo background với bg1 loop ===
(function() {
  const img = new Image();
  
  img.onload = function() {
    // Apply bg1 to body - loop bình thường
    document.body.style.backgroundImage = `url(${img.src})`;
    document.body.style.backgroundRepeat = 'repeat';
    document.body.style.backgroundPosition = 'top center';
    document.body.style.backgroundSize = '100% auto';
  };

  img.src = 'photo/bg1.png';
})();

// === IntersectionObserver cho hiệu ứng reveal ===
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal');
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

// Áp dụng observer cho tất cả section và timeline items
document.querySelectorAll('section, .timeline-item, .fade-in-left, .fade-in-right, .scale-in, .rotate-in').forEach(el => {
  revealObserver.observe(el);
});

// === Navbar scroll effect ===
const nav = document.querySelector('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  // Add solid background after scrolling 100px
  if (currentScroll > 100) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// Removed hero parallax transform for performance

// === Smooth scroll with offset for sticky nav ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// === Navigation highlight khi scroll ===
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 100) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// === Countdown đến 19/11/2025 ===
const targetDate = new Date('2025-11-19T00:00:00').getTime();
const countdownElement = document.getElementById('mainCountdown');

function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;
  
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  
  if (days >= 0) {
    countdownElement.textContent = `D - ${days.toString().padStart(2, '0')}`;
  } else {
    countdownElement.textContent = 'D - DAY!';
  }
}

// Cập nhật ngay và mỗi giờ
updateCountdown();
setInterval(updateCountdown, 3600000); // Mỗi giờ

// === House Points Counter Animation ===
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16); // 60fps
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, 16);
}

// Quan sát khi section houses xuất hiện
const housesObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Animate all counters
      const counters = entry.target.querySelectorAll('.points-value');
      counters.forEach((counter, index) => {
        const target = parseInt(counter.getAttribute('data-target'));
        // Stagger animation
        setTimeout(() => {
          animateCounter(counter, target, 2000);
        }, index * 150);
      });
      
      // Only animate once
      housesObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

const housesSection = document.getElementById('houses');
if (housesSection) {
  housesObserver.observe(housesSection);
}

// Removed legacy card click/particle effects

// Removed random floating animation for old grid icons

// === House Orbit: build from ttin.txt ===
(function setupHouseOrbit() {
  const orbitRing = document.getElementById('orbit-ring');
  const centerImg = document.getElementById('house-center-img');
  const centerFrame = document.querySelector('.center-frame');
  const centerName = document.getElementById('house-center-name');
  const centerPoints = document.getElementById('house-center-points');
  const infoPanel = document.getElementById('house-info');
  const infoClose = document.getElementById('house-info-close');
  const infoImg = document.getElementById('house-info-img');
  const infoName = document.getElementById('house-info-name');
  const infoPoints = document.getElementById('house-info-points');
  const infoRank = document.getElementById('house-info-rank');
  const infoText = document.getElementById('house-info-text');
  const centerPointsEl = document.getElementById('house-center-points');

  if (!orbitRing) return;
  // Helper to sample average color from an image element (small 8x8)
  function sampleAvgColor(imgEl) {
    try {
      const c = document.createElement('canvas');
      const ctx = c.getContext('2d');
      c.width = 8; c.height = 8;
      ctx.drawImage(imgEl, 0, 0, 8, 8);
      const data = ctx.getImageData(0, 0, 8, 8).data;
      let r=0,g=0,b=0,count=0;
      for (let i=0;i<data.length;i+=4){ r+=data[i]; g+=data[i+1]; b+=data[i+2]; count++; }
      r=Math.round(r/count); g=Math.round(g/count); b=Math.round(b/count);
      const avg=(r+g+b)/3; r=r+(r-avg)*0.2; g=g+(g-avg)*0.2; b=b+(b-avg)*0.2;
      r=Math.max(0,Math.min(255,Math.round(r)));
      g=Math.max(0,Math.min(255,Math.round(g)));
      b=Math.max(0,Math.min(255,Math.round(b)));
      return { r, g, b };
    } catch (e) { return null; }
  }

  const fallback = [
    { code:'a', name:'Nhà A', points: 450, rank: 1, info: 'Nhà A mạnh về học thuật và sáng tạo.', image:'photo/a.png' },
    { code:'p', name:'Nhà P', points: 420, rank: 2, info: 'Tinh thần đồng đội và tiên phong.', image:'photo/p.png' },
    { code:'e', name:'Nhà E', points: 395, rank: 3, info: 'Năng lượng và nhiệt huyết.', image:'photo/e.png' },
    { code:'i', name:'Nhà I', points: 380, rank: 4, info: 'Bản lĩnh và kiên định.', image:'photo/i.png' },
    { code:'s', name:'Nhà S', points: 365, rank: 5, info: 'Sáng suốt và sẻ chia.', image:'photo/s.png' },
    { code:'m', name:'Nhà M', points: 340, rank: 6, info: 'Mạnh mẽ và trách nhiệm.', image:'photo/m.png' },
    { code:'v', name:'Nhà V', points: 315, rank: 7, info: 'Vượt trội theo cách riêng.', image:'photo/v.png' },
    { code:'d', name:'Nhà D', points: 290, rank: 8, info: 'Đoàn kết là sức mạnh.', image:'photo/d.png' },
  ];

  function safeJSON(text) {
    try { return JSON.parse(text); } catch { return null; }
  }

  // Parse custom prose format in ttin.txt where sections start with "NHÀ X:"
  function parseHouseProseDetailed(text) {
    const lines = text.split(/\r?\n/);
    const dataByCode = {};
    let current = null;
    let buffer = [];
    // Header looks like: "𝄞 NHÀ A: #ADETIS - SÁO MÈO KÉP - SỰ LINH HOẠT"
    const headerRe = /NHÀ\s+([A-Z]):\s*(.*)$/i;

    function parseHeaderTail(tail) {
      // tail example: "#ADETIS - SÁO MÈO KÉP - SỰ LINH HOẠT"
      const parts = tail.split(' - ').map(s => s.trim()).filter(Boolean);
      let displayName = undefined, instrument = undefined, trait = undefined;
      if (parts.length) {
        displayName = parts[0].replace(/^#/, '').trim();
        if (parts.length > 1) instrument = parts[1];
        if (parts.length > 2) trait = parts[2];
      }
      return { displayName, instrument, trait };
    }

    function flush() {
      if (current) {
        const info = buffer.join(' ').replace(/\s+/g, ' ').trim();
        dataByCode[current.code] = { ...current, info };
      }
      current = null;
      buffer = [];
    }

    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i];
      const line = raw.trim();
      const m = line.match(headerRe);
      if (m) {
        flush();
        const code = m[1].toLowerCase();
        const tail = m[2] || '';
        const { displayName, instrument, trait } = parseHeaderTail(tail);
        current = { code, displayName, instrument, trait };
        continue;
      }
      if (current) buffer.push(line);
    }
    flush();
    return dataByCode; // e.g., { a: {displayName, instrument, trait, info}, ... }
  }

  async function loadData() {
    let text = '';
    let proseDetailed = {};
    let parsedArr = null;
    try {
      const res = await fetch('ttin.txt', { cache: 'no-store' });
      if (res.ok) {
        text = await res.text();
        parsedArr = safeJSON(text);
        proseDetailed = parseHouseProseDetailed(text) || {};
      }
    } catch (e) {
      console.warn('Không thể tải ttin.txt, dùng fallback + points nếu có.', e);
    }

    // Base list from JSON in ttin.txt or prose+fallback
    let base = [];
    if (Array.isArray(parsedArr) && parsedArr.length) {
      base = parsedArr.map(h => {
        const extra = proseDetailed[h.code] || {};
        return {
          ...h,
          displayName: extra.displayName || h.displayName || h.name,
          instrument: extra.instrument || h.instrument,
          trait: extra.trait || h.trait,
          info: extra.info || h.info
        };
      });
    } else if (proseDetailed && Object.keys(proseDetailed).length) {
      base = fallback.map(h => ({
        ...h,
        displayName: proseDetailed[h.code]?.displayName || h.name,
        instrument: proseDetailed[h.code]?.instrument,
        trait: proseDetailed[h.code]?.trait,
        info: proseDetailed[h.code]?.info || h.info
      }));
    } else {
      base = [...fallback];
    }

    // Try to load weekly points override from points.json
    try {
      const res2 = await fetch('points.json', { cache: 'no-store' });
      if (res2.ok) {
        const pointsPayload = await res2.json();
        let pointsArr = [];
        if (Array.isArray(pointsPayload)) {
          pointsArr = pointsPayload;
        } else if (pointsPayload && Array.isArray(pointsPayload.points)) {
          pointsArr = pointsPayload.points;
        }
        const byCode = Object.create(null);
        for (const p of pointsArr) {
          if (!p || !p.code) continue;
          byCode[String(p.code).toLowerCase()] = Number(p.points) || 0;
        }
        if (Object.keys(byCode).length) {
          // Override points in base list; add any missing codes if present in points
          const codeSet = new Set(base.map(h => h.code));
          base = base.map(h => ({ ...h, points: byCode[h.code] != null ? byCode[h.code] : (h.points || 0) }));
          for (const code in byCode) {
            if (!codeSet.has(code)) {
              base.push({
                code,
                name: `Nhà ${code.toUpperCase()}`,
                displayName: `Nhà ${code.toUpperCase()}`,
                points: byCode[code],
                image: `photo/${code}.png`,
                info: '',
              });
            }
          }
        }
      }
    } catch (e) {
      console.warn('Không thể tải points.json (không bắt buộc).', e);
    }

    return base;
  }

  function showInfo(h) {
    if (!h) return;
    infoImg.src = h.image;
    infoImg.alt = h.name;
    const displayName = h.displayName || h.name;
    infoName.textContent = displayName;
    infoPoints.textContent = `${h.points} điểm`;
    infoRank.textContent = `#${h.rank}`;
    // Badge
    const badgeEl = document.getElementById('house-info-badge');
    const badgeText = [h.instrument, h.trait].filter(Boolean).join(' • ');
    if (badgeEl) {
      badgeEl.textContent = badgeText || '';
      badgeEl.style.display = badgeText ? 'inline-block' : 'none';
      // Reset previous inline tints (in case of re-open)
      badgeEl.style.borderColor = '';
      badgeEl.style.background = '';
      badgeEl.style.color = '';
    }

    // Short/Long text toggle (2 câu đầu)
    const full = (h.info || '').trim();
    const sentences = full.split(/(?<=[.!?])\s+(?=[A-ZÀ-Ỵ])/u); // tách câu đơn giản
    const short = sentences.slice(0, 2).join(' ');
    const isShorter = short.length < full.length;
    infoText.textContent = isShorter ? short : full;
    const toggle = document.getElementById('house-info-toggle');
    if (toggle) {
      if (isShorter) {
        toggle.hidden = false;
        toggle.textContent = 'Xem thêm';
        toggle.setAttribute('aria-expanded', 'false');
        let expanded = false;
        toggle.onclick = () => {
          expanded = !expanded;
          infoText.textContent = expanded ? full : short;
          toggle.textContent = expanded ? 'Thu gọn' : 'Xem thêm';
          toggle.setAttribute('aria-expanded', String(expanded));
        };
      } else {
        toggle.hidden = true;
      }
    }
    infoPanel.hidden = false;
    // Tint the badge to follow avatar color once the image is ready
    const tintBadge = () => {
      if (!badgeEl) return;
      const rgb = sampleAvgColor(infoImg);
      if (rgb) {
        const { r, g, b } = rgb;
        const accent = `rgb(${r}, ${g}, ${b})`;
        // Match orbit label convention: colored text + border, dark translucent background
        badgeEl.style.borderColor = accent;
        badgeEl.style.color = accent;
        badgeEl.style.background = 'rgba(0,0,0,0.35)';
      }
    };
    if (infoImg.complete) {
      // If already loaded from cache
      requestAnimationFrame(tintBadge);
    } else {
      infoImg.addEventListener('load', tintBadge, { once: true });
    }
    // Smooth scroll to the info panel like menu behavior so users see the content
    requestAnimationFrame(() => {
      const navOffset = 80;
      const rect = infoPanel.getBoundingClientRect();
      const targetTop = rect.top + window.scrollY - navOffset;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  }

  infoClose?.addEventListener('click', () => { infoPanel.hidden = true; });

  function render(data) {
  // Compute rank fresh every time based on points (ignore any pre-existing rank)
  const sorted = [...data].sort((a,b) => (b.points||0) - (a.points||0));
  sorted.forEach((h, i) => { h.rank = i + 1; });
    const top = sorted[0];
    let ringHouses = sorted.slice(1); // 7 houses exactly

    // Ensure exactly 7 items on ring (in case data length differs)
    ringHouses = ringHouses.slice(0, 7);

    // center
  centerImg.src = top.image; centerImg.alt = top.displayName || top.name;
  centerImg.title = (top.displayName || top.name) + (top.instrument ? ` • ${top.instrument}` : '');
  centerName.textContent = top.displayName || top.name;
    centerPoints.textContent = `${top.points} điểm • #${top.rank}`;
  centerImg.style.cursor = 'pointer';
  centerImg.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); showInfo(top); });
    // Apply accent color to center points badge based on center image
    centerImg.addEventListener('load', () => {
      const rgb = sampleAvgColor(centerImg);
      if (rgb && centerPointsEl) {
        const {r,g,b} = rgb;
        const accent = `rgb(${r}, ${g}, ${b})`;
        // Match ring label style: colored text + border, dark translucent background
        centerPointsEl.style.borderColor = accent;
        centerPointsEl.style.color = accent;
        centerPointsEl.style.background = 'rgba(0,0,0,0.35)';
        // Also tint the center frame to match ring item backgrounds
        if (centerFrame) {
          centerFrame.style.borderColor = `rgba(${r}, ${g}, ${b}, 0.35)`;
          centerFrame.style.background = `rgba(${r}, ${g}, ${b}, 0.08)`;
        }
      }
    });

    // ring placement function (responsive)
    function placeRingItems() {
      orbitRing.innerHTML = '';
      const N = ringHouses.length; // expect 7
      // container width fallback
      const container = document.querySelector('.houses-orbit');
      const containerW = (orbitRing.clientWidth || container?.clientWidth || 720);
      const itemRadius = 56; // half of 112px (avatar container)
      const edgePadding = 8; // keep inside the ring
      // Larger radius => further from center; subtract minimal padding
      let radius = Math.max(100, Math.floor(containerW / 2 - (itemRadius + edgePadding)));
      // Desktop: bring houses closer to center as requested
      if (window.innerWidth >= 1024) {
        radius = Math.max(80, Math.floor(radius * 0.82));
      }
      const nodes = [];
      for (let i = 0; i < N; i++) {
        const h = ringHouses[i];
        const deg = (i / N) * 360;
  const btn = document.createElement('button');
        btn.className = 'orbit-item';
  btn.type = 'button'; // avoid any default submit/scroll behavior
        // JS will move each item via translate(x,y); store base angle
        const baseRad = (deg * Math.PI) / 180;
        btn.title = `${h.name} — ${h.points} điểm (#${h.rank})`;
        const sprite = document.createElement('span');
        sprite.className = 'orbit-sprite';
        const figure = document.createElement('span');
        figure.className = 'orbit-figure';
        const img = document.createElement('img');
        img.src = h.image; img.alt = h.name;
        // Performance-friendly image hints
        img.loading = 'lazy';
        img.decoding = 'async';
        // randomize subtle delays so motion feels organic
        const delay1 = (Math.random() * 1.2).toFixed(2) + 's';
        const delay2 = (Math.random() * 1.2).toFixed(2) + 's';
        img.style.animationDelay = `${delay1}, ${delay2}`;
        // Label under each rotating avatar: points + rank
        const label = document.createElement('span');
        label.className = 'orbit-label';
        label.textContent = `${h.points} • #${h.rank}`;
        // Accent color by image content (fallback to code map)
        const accentByCode = { a:'#8a63ff', p:'#ff66c4', e:'#ff4d4f', i:'#2ec5ff', s:'#7cffb2', m:'#ffd166', v:'#7a7cff', d:'#ff8a3d' };
        let accent = accentByCode[h.code] || '#6ae3ff';
        function hexToRgb(hex){ const m=hex.replace('#',''); const n=parseInt(m,16); return {r:(n>>16)&255,g:(n>>8)&255,b:n&255}; }
        function rgbToRgba({r,g,b}, a){ return `rgba(${r}, ${g}, ${b}, ${a})`; }
        function getAccentFromImage(image){
          try{
            const c=document.createElement('canvas'); const ctx=c.getContext('2d');
            c.width=8; c.height=8; ctx.drawImage(image,0,0,8,8);
            let r=0,g=0,b=0,count=0; const data=ctx.getImageData(0,0,8,8).data;
            for(let i=0;i<data.length;i+=4){ r+=data[i]; g+=data[i+1]; b+=data[i+2]; count++; }
            r=Math.round(r/count); g=Math.round(g/count); b=Math.round(b/count);
            // Boost saturation slightly
            const avg=(r+g+b)/3; r=r+(r-avg)*0.2; g=g+(g-avg)*0.2; b=b+(b-avg)*0.2;
            r=Math.max(0,Math.min(255,Math.round(r))); g=Math.max(0,Math.min(255,Math.round(g))); b=Math.max(0,Math.min(255,Math.round(b)));
            return `rgb(${r}, ${g}, ${b})`;
          }catch(e){ return null; }
        }
        function applyAccent(color){
          label.style.borderColor = color;
          label.style.color = color;
          btn.style.borderColor = color;
          const rgb = hexToRgb(color.startsWith('#')?color:'#6ae3ff');
          btn.style.background = rgbToRgba(rgb, 0.08);
        }
        applyAccent(accent);
        img.addEventListener('load', () => {
          const c = getAccentFromImage(img);
          if (c) {
            // Use sampled color directly for label and border
            label.style.borderColor = c;
            label.style.color = c;
            btn.style.borderColor = c;
            // Create semi-transparent background from sampled color
            const m = c.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (m) {
              const r=+m[1], g=+m[2], b=+m[3];
              btn.style.background = `rgba(${r}, ${g}, ${b}, 0.08)`;
            }
          }
        });

        figure.appendChild(img);
        figure.appendChild(label);
        sprite.appendChild(figure);
        btn.appendChild(sprite);
  // Prevent any default scrolling/jumping; only show info
  btn.addEventListener('mousedown', (e) => { e.preventDefault(); });
  btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); showInfo(h); });
        orbitRing.appendChild(btn);
        nodes.push({ el: btn, base: baseRad });
      }
      // Animate items around circle without rotating the images
      let start = null;
      const omega = (2 * Math.PI) / 50; // one revolution per 50s
      function frame(ts) {
        if (!start) start = ts;
        const t = (ts - start) / 1000;
        const contW = (orbitRing.clientWidth || container?.clientWidth || 720);
        let r = Math.max(100, Math.floor(contW / 2 - (itemRadius + edgePadding)));
        if (window.innerWidth >= 1024) r = Math.max(80, Math.floor(r * 0.82));
        const cos = Math.cos, sin = Math.sin;
        for (const n of nodes) {
          const ang = n.base + omega * t;
          const x = r * cos(ang);
          const y = r * sin(ang);
          n.el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        }
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    placeRingItems();
    // Recalculate on resize to keep spacing
    window.addEventListener('resize', placeRingItems);

    // Do not pause on hover (as requested)
  }

  // Build on reveal of section for smoothness
  const housesSection = document.getElementById('houses');
  if (housesSection) {
    const once = new IntersectionObserver((entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          const data = await loadData();
          render(data);
          once.disconnect();
        }
      });
    }, { threshold: 0.2 });
    once.observe(housesSection);
  }
})();
