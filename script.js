// === Tạo background với bg1 loop ===
(function() {
  // Prefer WebP background if supported; fallback to PNG
  try {
    const isWebpSupported = (function() {
      try {
        const c = document.createElement('canvas');
        if (!c.getContext) return false;
        return c.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      } catch { return false; }
    })();
    const bg = isWebpSupported
      ? 'image-set(url("photo/bg1.webp") type("image/webp"), url("photo/bg1.webp") type("image/webp"))'
      : 'url("photo/bg1.webp")';
    document.body.style.backgroundImage = bg;
    document.body.style.backgroundRepeat = 'repeat';
    document.body.style.backgroundPosition = 'top center';
    document.body.style.backgroundSize = '100% auto';
  } catch {
    // Fallback to the same WebP (png not provided in repo)
    document.body.style.backgroundImage = 'url("photo/bg1.webp")';
  }
})();

// === Safari softening: detect Safari and add a class to reduce heavy effects ===
(function() {
  try {
    const ua = navigator.userAgent;
    const isSafari = /Safari\//.test(ua) && !/Chrome\//.test(ua) && !/Chromium\//.test(ua);
    if (isSafari) {
      document.documentElement.classList.add('safari-soft');
    }
  } catch {}
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

// === Countdown đến 19/11/2025 (tính theo ngày lịch, bỏ qua giờ phút) ===
(function setupCountdown() {
  const countdownElement = document.getElementById('mainCount');
  if (!countdownElement) return;

  // Dùng ngày theo lịch địa phương để tránh lệch D- do giờ phút trong ngày
  const targetMidnight = new Date(2025, 10, 19); // 10 = Tháng 11 (0-based)
  targetMidnight.setHours(0, 0, 0, 0);

  function updateCountdown() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Dùng round để an toàn qua DST (23h/25h); chênh lệch vẫn tính theo số ngày lịch
    const diffDays = Math.round((targetMidnight.getTime() - today.getTime()) / 86400000);

    if (diffDays > 0) {
      countdownElement.textContent = `D - ${String(diffDays).padStart(2, '0')}`;
    } else if (diffDays === 0) {
      countdownElement.textContent = 'D - DAY!';
    } else {
      countdownElement.textContent = 'D - DAY!';
    }
  }

  // Cập nhật ngay và mỗi giờ
  updateCountdown();
  setInterval(updateCountdown, 3600000); // Mỗi giờ
})();

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
  // Helper: set image to WebP if available, else fallback to original
  function setImageWithWebp(imgEl, originalPath) {
    if (!imgEl || !originalPath) return;
    const dot = originalPath.lastIndexOf('.');
    let webp = originalPath;
    if (dot > -1) webp = originalPath.slice(0, dot) + '.webp';
    // Try webp first
    imgEl.onerror = function onErr() {
      imgEl.onerror = null;
      imgEl.src = originalPath;
    };
    imgEl.src = webp;
  }

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
    { code:'a', name:'Nhà A', points: 450, rank: 1, info: 'Nhà A mạnh về học thuật và sáng tạo.', image:'photo/a.webp' },
    { code:'p', name:'Nhà P', points: 420, rank: 2, info: 'Tinh thần đồng đội và tiên phong.', image:'photo/p.webp' },
    { code:'e', name:'Nhà E', points: 395, rank: 3, info: 'Năng lượng và nhiệt huyết.', image:'photo/e.webp' },
    { code:'i', name:'Nhà I', points: 380, rank: 4, info: 'Bản lĩnh và kiên định.', image:'photo/i.webp' },
    { code:'s', name:'Nhà S', points: 365, rank: 5, info: 'Sáng suốt và sẻ chia.', image:'photo/s.webp' },
    { code:'m', name:'Nhà M', points: 340, rank: 6, info: 'Mạnh mẽ và trách nhiệm.', image:'photo/m.webp' },
    { code:'v', name:'Nhà V', points: 315, rank: 7, info: 'Vượt trội theo cách riêng.', image:'photo/v.webp' },
    { code:'d', name:'Nhà D', points: 290, rank: 8, info: 'Đoàn kết là sức mạnh.', image:'photo/d.webp' },
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
                image: `photo/${code}.webp`,
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
  setImageWithWebp(infoImg, h.image);
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
    // Compute rank with ties: houses with equal points share the same rank
    const sorted = [...data].sort((a, b) => (b.points || 0) - (a.points || 0));
    let currentRank = 0;
    let lastPoints = null;
    for (let i = 0; i < sorted.length; i++) {
      const pts = sorted[i].points || 0;
      if (i === 0) {
        currentRank = 1;
      } else if (pts !== lastPoints) {
        // competition ranking: 1,1,3 when top tie of 2
        currentRank = i + 1;
      }
      sorted[i].rank = currentRank;
      lastPoints = pts;
    }

    // Group top houses (may be >1 if tie for first)
    const topPoints = sorted.length ? (sorted[0].points || 0) : 0;
    const topGroup = sorted.filter(h => (h.points || 0) === topPoints);
    let ringHouses = sorted.filter(h => (h.points || 0) !== topPoints);

    // Ensure max 7 on ring (layout assumption); extra get truncated
    ringHouses = ringHouses.slice(0, 7);

    // Render center area
    const housesCenter = document.querySelector('.houses-center');
    const labelWrap = document.querySelector('.house-center-label');
    // Reset center area to default single layout first
    if (topGroup.length === 1) {
      const top = topGroup[0];
      // Restore single center DOM if needed
      if (housesCenter && !housesCenter.querySelector('#house-center-img')) {
        housesCenter.innerHTML = `
          <div class="center-glow"></div>
          <div class="center-frame">
            <img id="house-center-img" src="" alt="House Center" />
          </div>
          <div class="house-center-label">
            <div id="house-center-name" class="house-center-name"></div>
            <div id="house-center-points" class="house-center-points"></div>
          </div>`;
      }
      const centerImgNow = document.getElementById('house-center-img');
      const centerNameNow = document.getElementById('house-center-name');
      const centerPointsNow = document.getElementById('house-center-points');
      const centerFrameNow = document.querySelector('.center-frame');
      if (centerImgNow) {
        setImageWithWebp(centerImgNow, top.image);
        centerImgNow.alt = top.displayName || top.name;
        centerImgNow.title = (top.displayName || top.name) + (top.instrument ? ` • ${top.instrument}` : '');
        centerImgNow.style.cursor = 'pointer';
        centerImgNow.onclick = (e) => { e.preventDefault(); e.stopPropagation(); showInfo(top); };
        centerImgNow.addEventListener('load', () => {
          const rgb = sampleAvgColor(centerImgNow);
          if (rgb && centerPointsNow) {
            const { r, g, b } = rgb;
            const accent = `rgb(${r}, ${g}, ${b})`;
            centerPointsNow.style.borderColor = accent;
            centerPointsNow.style.color = accent;
            centerPointsNow.style.background = 'rgba(0,0,0,0.35)';
            if (centerFrameNow) {
              centerFrameNow.style.borderColor = `rgba(${r}, ${g}, ${b}, 0.35)`;
              centerFrameNow.style.background = `rgba(${r}, ${g}, ${b}, 0.08)`;
            }
          }
        }, { once: true });
      }
      if (centerNameNow) centerNameNow.textContent = top.displayName || top.name;
      if (centerPointsNow) centerPointsNow.textContent = `${top.points} điểm • #${top.rank}`;
    } else {
      // Multi-center: display all top houses in a small cluster at center
      if (housesCenter) {
        housesCenter.innerHTML = `<div class="center-glow"></div><div class="center-cluster"></div>`;
  const cluster = housesCenter.querySelector('.center-cluster');
  const count = topGroup.length;
  // On desktop, make 2-3 center avatars large; shrink only from 5+
  const shrink = count >= 5;
  const isMobile = window.innerWidth <= 768;
  // Base size corresponds to CSS: desktop large=112, mobile=64
  const baseSize = isMobile ? (shrink ? 64 : 64) : (shrink ? 64 : 112);
  // Compute dynamic radius so items have at least ~14px spacing on arc
  const spacing = isMobile ? 8 : 18;
  let radius = Math.ceil(((baseSize + spacing) * count) / (2 * Math.PI));
  // Clamp radius to fit within the center container
  const centerW = housesCenter.clientWidth || 192;
  const centerR = centerW / 2;
  const halfItem = baseSize / 2;
  const edgeMargin = 6;
  const maxR = Math.max(0, Math.floor(centerR - halfItem - edgeMargin));
  // also keep a sensible minimum for layout: at least half item to avoid overlap for 2 items
  // Push ties slightly farther apart on desktop
  const minR = isMobile ? Math.max(halfItem, 32) : Math.max(halfItem + 8, 64);
  // Special case for 2 ties: ensure center-to-center distance > diameter
  if (count === 2) {
    const clearance = isMobile ? 4 : 12; // extra gap beyond exact diameter
    const desired = Math.ceil((baseSize + clearance) / 2);
    radius = Math.min(maxR, Math.max(desired, minR));
  } else {
    radius = Math.max(minR, Math.min(radius, maxR));
  }
        topGroup.forEach((h, idx) => {
          const angle = (idx / count) * 2 * Math.PI;
          const dx = Math.cos(angle) * radius;
          const dy = Math.sin(angle) * radius;
          const btn = document.createElement('button');
          // On desktop when not shrink, use default .mini-center (112px); otherwise .small
          btn.className = shrink ? 'mini-center small' : 'mini-center';
          btn.type = 'button';
          btn.style.transform = `translate(-50%, -50%) translate(${dx}px, ${dy}px)`;
          const img = document.createElement('img');
          setImageWithWebp(img, h.image); img.alt = h.displayName || h.name;
          img.decoding = 'async'; img.loading = 'eager';
          btn.appendChild(img);
          // Small label with points and rank
          const label = document.createElement('span');
          label.className = 'mini-label';
          label.textContent = `${h.points} • #${h.rank}`;
          btn.appendChild(label);
          // Tint borders/labels based on avatar colors
          const applyTint = () => {
            const rgb = sampleAvgColor(img);
            if (!rgb) return;
            const { r, g, b } = rgb;
            const accent = `rgb(${r}, ${g}, ${b})`;
            btn.style.borderColor = accent;
            label.style.borderColor = accent;
            label.style.color = accent;
          };
          if (img.complete) { requestAnimationFrame(applyTint); }
          else { img.addEventListener('load', applyTint, { once: true }); }

          btn.title = `${h.name} — ${h.points} điểm (#${h.rank})`;
          btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); showInfo(h); });
          cluster.appendChild(btn);
        });
      }
    }

    // ring placement function (responsive)
    function placeRingItems() {
      orbitRing.innerHTML = '';
      const N = ringHouses.length; // typically 7; fewer if multi-center
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
  setImageWithWebp(img, h.image); img.alt = h.name;
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

