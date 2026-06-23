/* ═══════════════════════════════════════════════════════
   EMPYREAN SPIRITS — Lotte-Style Interactions
   ═══════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ── Age Gate ──
  var ageGate = document.getElementById('ageGate');
  var ageYes = document.getElementById('ageYes');
  var ageNo = document.getElementById('ageNo');

  if (sessionStorage.getItem('empyrean_age') === '1') {
    document.documentElement.classList.add('age-verified');
    if (ageGate) ageGate.classList.add('hidden');
  }

  if (ageYes) {
    ageYes.addEventListener('click', function () {
      document.documentElement.classList.add('age-verified');
      ageGate.classList.add('hidden');
      sessionStorage.setItem('empyrean_age', '1');
      if (typeof playHeroVideo === 'function') playHeroVideo();
      if (typeof ScrollTrigger !== 'undefined') {
        setTimeout(function () { ScrollTrigger.refresh(); }, 100);
      }
    });
  }

  if (ageNo) {
    ageNo.addEventListener('click', function () {
      window.location.href = 'https://www.google.com';
    });
  }

  // ── Connect form (EmailJS) ──
  initConnectForm();

  // ── Hero scroll sequence (GSAP + ScrollTrigger) ──
  initHeroSequence();

  // ── Smooth scroll for anchor links ──
  function getHeaderOffset() {
    var root = document.documentElement;
    var subnav = document.body.classList.contains('has-subnav');
    var prop = subnav ? '--header-height-sub' : '--header-height';
    return parseInt(getComputedStyle(root).getPropertyValue(prop), 10) || (subnav ? 152 : 116);
  }

  function scrollToTarget(target, behavior) {
    if (!target) return;
    var top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
    window.scrollTo({ top: Math.max(0, top), behavior: behavior || 'smooth' });
  }

  function normalizePageName(path) {
    var name = (path || '').split('/').pop() || 'index.html';
    if (!name || name === '/') return 'index';
    return name.replace(/\.html$/i, '').toLowerCase();
  }

  document.querySelectorAll('a[href*="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var raw = this.getAttribute('href');
      if (!raw || raw === '#') return;

      var hashIndex = raw.indexOf('#');
      if (hashIndex === -1) return;

      var path = raw.slice(0, hashIndex);
      var hash = raw.slice(hashIndex);
      var target = document.querySelector(hash);
      if (!target) return;

      var currentName = normalizePageName(window.location.pathname);
      var linkName = normalizePageName(path || window.location.pathname);
      if (linkName !== currentName) return;

      e.preventDefault();
      scrollToTarget(target, 'smooth');
      if (hash.length > 1) {
        history.pushState(null, '', hash);
      }
      closeMobileNav();
    });
  });

  function scrollToInitialHash() {
    if (!window.location.hash || window.location.hash === '#') return;
    var target = document.querySelector(window.location.hash);
    if (!target) return;
    requestAnimationFrame(function () {
      scrollToTarget(target, 'auto');
    });
  }

  window.addEventListener('load', scrollToInitialHash);
  window.addEventListener('hashchange', function () {
    scrollToInitialHash();
  });

  // ── Mobile nav drawer ──
  var navToggle = document.getElementById('navToggle');
  var navDrawer = document.getElementById('navDrawer');
  var navClose = document.getElementById('navClose');

  function closeMobileNav() {
    if (navDrawer) {
      navDrawer.classList.remove('is-open');
      navDrawer.setAttribute('aria-hidden', 'true');
    }
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-nav-open');
  }

  function openMobileNav() {
    if (!navDrawer) return;
    navDrawer.classList.add('is-open');
    navDrawer.setAttribute('aria-hidden', 'false');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-nav-open');
  }

  if (navToggle && navDrawer) {
    navToggle.addEventListener('click', function () {
      if (navDrawer.classList.contains('is-open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    if (navClose) {
      navClose.addEventListener('click', closeMobileNav);
    }

    navDrawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navDrawer.classList.contains('is-open')) {
        closeMobileNav();
        navToggle.focus();
      }
    });
  }

  // ── Header scroll state ──
  var siteHeader = document.getElementById('siteHeader');
  if (siteHeader) {
    var scrollThreshold = 48;
    function updateHeaderScroll() {
      siteHeader.classList.toggle('is-scrolled', window.scrollY > scrollThreshold);
    }
    updateHeaderScroll();
    window.addEventListener('scroll', updateHeaderScroll, { passive: true });
  }

  // ── Share button ──
  var shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', function () {
      var url = window.location.href;
      if (navigator.share) {
        navigator.share({ title: 'Empyrean Spirits', url: url }).catch(function () {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function () {
          var original = shareBtn.getAttribute('aria-label');
          shareBtn.setAttribute('aria-label', 'Link copied!');
          setTimeout(function () {
            shareBtn.setAttribute('aria-label', original);
          }, 2000);
        });
      }
    });
  }

  // ── Curator's Pick — expanding bottle carousel ──
  (function () {
    var cpTrack   = document.getElementById('curatorsTrack');
    var cpInfo    = document.getElementById('curatorsInfo');
    var cpDots    = document.getElementById('carouselDots');
    var cpCounter = document.getElementById('carouselCounter');
    var cpPrev    = document.getElementById('carouselPrev');
    var cpNext    = document.getElementById('carouselNext');

    if (!cpTrack || typeof gsap === 'undefined') return;

    var bottles  = Array.from(cpTrack.querySelectorAll('.cp-bottle'));
    var infos    = cpInfo  ? Array.from(cpInfo.querySelectorAll('.cp-info'))                    : [];
    var dots     = cpDots  ? Array.from(cpDots.querySelectorAll('.curators-pick__dot'))         : [];
    var N        = bottles.length; // 4
    var active   = 0;
    var busy     = false;

    function syncInfoWrapHeight() {
      if (!cpInfo) return;
      cpInfo.style.height = '';
    }

    // ── Position state → GSAP vars ──
    function stageW() { return cpTrack.offsetWidth || 700; }
    function sideX()  { return Math.min(stageW() * (window.innerWidth <= 600 ? 0.22 : 0.3), window.innerWidth <= 600 ? 120 : 230); }

    var POS = {
      center:      function () { return { x: 0,             scale: 1,    autoAlpha: 1,    zIndex: 3 }; },
      left:        function () { return { x: -sideX(),      scale: 0.58, autoAlpha: 0.42, zIndex: 2 }; },
      right:       function () { return { x:  sideX(),      scale: 0.58, autoAlpha: 0.42, zIndex: 2 }; },
      'off-left':  function () { return { x: -sideX() * 2,  scale: 0.35, autoAlpha: 0,    zIndex: 1 }; },
      'off-right': function () { return { x:  sideX() * 2,  scale: 0.35, autoAlpha: 0,    zIndex: 1 }; },
    };

    // Named position of bottle[i] given a center index
    function posName(i, center) {
      var diff = (i - center + N) % N;
      if (diff === 0)     return 'center';
      if (diff === 1)     return 'right';
      if (diff === N - 1) return 'left';
      return null; // hidden
    }

    // Shortest direction between two indices
    function direction(from, to) {
      var fwd = (to - from + N) % N;
      return fwd <= N / 2 ? 'next' : 'prev';
    }

    // ── Sync counter + dots (no animation) ──
    function syncUI(idx) {
      if (cpCounter) cpCounter.textContent = (idx + 1 < 10 ? '0' : '') + (idx + 1) + ' / 0' + N;
      dots.forEach(function (d, i) {
        var a = i === idx;
        d.classList.toggle('is-active', a);
        d.setAttribute('aria-selected', a ? 'true' : 'false');
      });
    }

    // ── Place bottles at initial positions (instant) ──
    function init() {
      bottles.forEach(function (b, i) {
        var pos = posName(i, active);
        // The one hidden bottle starts off-right so it can enter from the right on first "next"
        var vars = Object.assign({ transformOrigin: 'bottom center' }, POS[pos || 'off-right']());
        gsap.set(b, vars);
        b.classList.toggle('is-center', pos === 'center');
      });
      // Show first info panel
      if (infos.length) {
        infos.forEach(function (p, i) {
          gsap.set(p, { autoAlpha: i === active ? 1 : 0, y: 0 });
          p.classList.toggle('is-active', i === active);
        });
      }
      syncUI(active);
      syncInfoWrapHeight();
    }

    // ── Main transition — all bottles move in lockstep ──
    var MOVE_DUR  = isMobileLite() ? 0.42 : 0.62;
    var MOVE_EASE = 'power2.inOut';

    function goTo(next) {
      if (busy || next === active) return;
      busy = true;

      var prev = active;
      var dir  = direction(prev, next);
      active   = next;

      var tl = gsap.timeline({
        onComplete: function () {
          bottles.forEach(function (b, i) {
            var pos = posName(i, next);
            b.classList.toggle('is-center', pos === 'center');
            if (pos) gsap.set(b, { zIndex: POS[pos]().zIndex });
          });
          syncInfoWrapHeight();
          busy = false;
        }
      });

      bottles.forEach(function (b, i) {
        var fromName = posName(i, prev);
        var toName   = posName(i, next);
        var actualFrom, actualTo;

        if (fromName === null) {
          actualFrom = dir === 'next' ? 'off-right' : 'off-left';
          gsap.set(b, Object.assign({ transformOrigin: 'bottom center' }, POS[actualFrom]()));
        }

        if (toName === null) {
          if (fromName === 'left')       actualTo = 'off-left';
          else if (fromName === 'right') actualTo = 'off-right';
          else actualTo = dir === 'next' ? 'off-left' : 'off-right';
        } else {
          actualTo = toName;
        }

        b.classList.remove('is-center');

        // Stack incoming center above outgoing center during the cross-move
        var startZ = 2;
        if (actualTo === 'center')        startZ = 4;
        else if (fromName === 'center')   startZ = 3;
        gsap.set(b, { zIndex: startZ });

        var target = POS[actualTo]();
        tl.to(b, {
          x: target.x,
          scale: target.scale,
          autoAlpha: target.autoAlpha,
          transformOrigin: 'bottom center',
          duration: MOVE_DUR,
          ease: MOVE_EASE,
          overwrite: 'auto'
        }, 0);
      });

      // Info panel — fade in sync with bottles
      if (infos.length) {
        var outInfo = infos[prev];
        var inInfo  = infos[next];

        outInfo.classList.remove('is-active');
        inInfo.classList.add('is-active');
        syncInfoWrapHeight();

        tl.to(outInfo, {
          autoAlpha: 0,
          duration: MOVE_DUR * 0.45,
          ease: 'power2.in'
        }, 0);

        gsap.set(inInfo, { autoAlpha: 0 });
        tl.to(inInfo, { autoAlpha: 1, duration: MOVE_DUR * 0.55, ease: 'power2.out' }, MOVE_DUR * 0.35);
      }

      syncUI(next);
    }

    // Boot after layout so stage dimensions are correct
    function boot() {
      init();
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }
    if (document.readyState === 'complete') {
      requestAnimationFrame(function () { requestAnimationFrame(boot); });
    } else {
      window.addEventListener('load', function () {
        requestAnimationFrame(function () { requestAnimationFrame(boot); });
      });
    }

    if (cpNext) cpNext.addEventListener('click', function () { goTo((active + 1) % N); });
    if (cpPrev) cpPrev.addEventListener('click', function () { goTo((active - 1 + N) % N); });
    dots.forEach(function (d) {
      d.addEventListener('click', function () { goTo(parseInt(this.getAttribute('data-slide'), 10)); });
    });

    // Swipe on bottle stage (touch)
    var cpStage = document.querySelector('.curators-pick__stage');
    if (cpStage) {
      var swipeStartX = 0;
      var swipeStartY = 0;
      cpStage.addEventListener('touchstart', function (e) {
        if (!e.changedTouches[0]) return;
        swipeStartX = e.changedTouches[0].clientX;
        swipeStartY = e.changedTouches[0].clientY;
      }, { passive: true });
      cpStage.addEventListener('touchend', function (e) {
        if (!e.changedTouches[0]) return;
        var dx = e.changedTouches[0].clientX - swipeStartX;
        var dy = e.changedTouches[0].clientY - swipeStartY;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.2) {
          if (dx < 0) goTo((active + 1) % N);
          else goTo((active - 1 + N) % N);
        }
      }, { passive: true });
    }

    // Refresh positions on resize
    window.addEventListener('resize', function () {
      bottles.forEach(function (b, i) {
        var pos = posName(i, active);
        if (!pos) return;
        gsap.set(b, Object.assign({ transformOrigin: 'bottom center' }, POS[pos]()));
      });
      syncInfoWrapHeight();
    });
  }());

  // ── Collection track — native touch scroll + desktop drag ──
  (function () {
    var track    = document.getElementById('collectionTrack');
    var prevBtn  = document.getElementById('collectionPrev');
    var nextBtn  = document.getElementById('collectionNext');
    var progress = document.getElementById('collectionProgress');

    if (!track) return;

    var isCoarsePointer = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    var isDown = false;
    var startX = 0;
    var scrollLeft = 0;

    function scrollStep(dir) {
      var card = track.querySelector('.collection__card');
      if (!card) return;
      var gap = parseFloat(getComputedStyle(track).gap) || 24;
      track.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: 'smooth' });
    }

    function updateProgress() {
      if (!progress) return;
      var max = track.scrollWidth - track.clientWidth;
      progress.style.width = max > 0 ? ((track.scrollLeft / max) * 100) + '%' : '100%';
    }

    if (!isCoarsePointer) {
      function pointerDown(clientX) {
        isDown = true;
        track.style.cursor = 'grabbing';
        startX = clientX;
        scrollLeft = track.scrollLeft;
      }

      function pointerUp() {
        isDown = false;
        track.style.cursor = 'grab';
      }

      function pointerMove(clientX) {
        if (!isDown) return;
        track.scrollLeft = scrollLeft - (clientX - startX);
        updateProgress();
      }

      track.addEventListener('mousedown', function (e) {
        pointerDown(e.pageX);
      });

      track.addEventListener('mouseleave', pointerUp);
      track.addEventListener('mouseup', pointerUp);

      track.addEventListener('mousemove', function (e) {
        if (!isDown) return;
        e.preventDefault();
        pointerMove(e.pageX);
      });
    } else {
      track.style.cursor = 'default';
    }

    track.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    if (prevBtn) prevBtn.addEventListener('click', function () { scrollStep(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { scrollStep(1); });

    updateProgress();
  }());

  // ── Philosophy stats count-up ──
  (function () {
    var statsEl = document.getElementById('philosophyStats');
    if (!statsEl) return;

    var nums = statsEl.querySelectorAll('.philosophy__stat-num[data-count]');
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var done = false;

    function setFinal() {
      nums.forEach(function (el) {
        el.textContent = el.getAttribute('data-count');
      });
    }

    function animateStats() {
      if (done) return;
      done = true;
      if (reduced || typeof gsap === 'undefined') {
        setFinal();
        return;
      }
      nums.forEach(function (el, i) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        var obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.4,
          delay: i * 0.08,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = Math.round(obj.val);
          }
        });
      });
    }

    if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.create({
        trigger: statsEl,
        start: 'top 88%',
        once: true,
        onEnter: animateStats
      });
    } else if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          animateStats();
          obs.disconnect();
        }
      }, { threshold: 0.25 });
      obs.observe(statsEl);
    } else {
      setFinal();
    }
  }());

  // ── Page scroll animations (GSAP) ──
  initPageAnimations();

  // ── Broken image fallback: hide img, show placeholder gradient ──
  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('error', function () {
      this.style.display = 'none';
    });
  });

  function isSlowConnection() {
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!conn) return false;
    if (conn.saveData) return true;
    var slow = ['slow-2g', '2g', '3g'];
    return slow.indexOf(conn.effectiveType) !== -1;
  }

  function isMobileLite() {
    return window.matchMedia('(max-width: 900px), (hover: none) and (pointer: coarse)').matches;
  }

  function withoutBlur(vars) {
    if (!isMobileLite()) return vars;
    var copy = Object.assign({}, vars);
    delete copy.filter;
    if (copy.duration) copy.duration = Math.min(copy.duration, 0.55);
    return copy;
  }

  function setHeroFallback(hero) {
    if (!hero) return;
    hero.classList.add('hero--fallback');
  }

  function playHeroVideo() {
    var video = document.getElementById('heroVideo');
    if (!video) return;
    video.muted = true;
    video.playsInline = true;
    var playPromise = video.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(function () {});
    }
  }

  function initHeroSequence() {
    var hero = document.getElementById('hero');
    var video = document.getElementById('heroVideo');
    if (!hero) return;

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (video) {
      // Only stream the hero video where it autoplays reliably and the bytes
      // are worth it: capable desktops on a decent connection. Mobile, touch,
      // slow networks, save-data and reduced-motion all fall back to the
      // instant poster background — no wasted download, no iOS play button.
      var useVideo = !reduced && !isMobileLite() && !isSlowConnection();

      if (!useVideo) {
        hero.classList.add('hero--poster-only');
        video.removeAttribute('autoplay');
        video.preload = 'none';
      } else {
        video.muted = true;
        video.playsInline = true;
        video.loop = true;
        video.preload = 'auto';

        var src = video.getAttribute('data-src');
        if (src && !video.querySelector('source')) {
          var source = document.createElement('source');
          source.src = src;
          source.type = 'video/mp4';
          video.appendChild(source);
          video.load();
        }

        var fallbackTimer = setTimeout(function () {
          if (video.readyState < 2) setHeroFallback(hero);
        }, 5000);

        video.addEventListener('canplay', function () {
          clearTimeout(fallbackTimer);
        }, { once: true });

        video.addEventListener('error', function () {
          clearTimeout(fallbackTimer);
          setHeroFallback(hero);
        });

        playHeroVideo();

        document.addEventListener('visibilitychange', function () {
          if (!document.hidden) playHeroVideo();
        });
      }
    }

    if (typeof gsap === 'undefined') return;

    var eyebrow = hero.querySelector('.hero__eyebrow');
    var title = hero.querySelector('.hero__title');
    var sub = hero.querySelector('.hero__sub');
    var actions = hero.querySelector('.hero__actions');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power3.out' } });
    if (eyebrow) tl.from(eyebrow, { y: 16, opacity: 0, duration: 0.65 }, 0);
    if (title) tl.from(title, { y: 40, opacity: 0, duration: 0.95 }, 0.08);
    if (sub) tl.from(sub, { y: 24, opacity: 0, duration: 0.8 }, 0.22);
    if (actions) tl.from(actions, { y: 20, opacity: 0, duration: 0.7 }, 0.34);
  }

  // ── Scroll-triggered section animations ──
  function parseRevealDelay(el) {
    var d = el.getAttribute('data-reveal');
    if (!d || d === '') return 0;
    if (d.indexOf('delay-') === 0) return parseFloat(d.replace('delay-', '')) * 0.12;
    return 0;
  }

  function fallbackScrollReveal() {
    var reveals = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
      reveals.forEach(function (el) { observer.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add('visible'); });
    }
  }

  function prepareLineReveal(heading, lineClass) {
    lineClass = lineClass || 'reveal-line';
    if (!heading || heading.dataset.linesReady) {
      return heading ? heading.querySelectorAll('.' + lineClass) : [];
    }
    var parts = heading.innerHTML.split(/<br\s*\/?>/i);
    heading.innerHTML = '';
    var lines = [];
    parts.forEach(function (part) {
      var wrap = document.createElement('span');
      wrap.className = 'reveal-line-wrap';
      var inner = document.createElement('span');
      inner.className = lineClass;
      inner.innerHTML = part.trim();
      wrap.appendChild(inner);
      heading.appendChild(wrap);
      lines.push(inner);
    });
    heading.dataset.linesReady = '1';
    return lines;
  }

  function revealBlur(targets, opts) {
    opts = opts || {};
    return gsap.from(targets, {
      autoAlpha: 0,
      y: opts.y || 32,
      filter: 'blur(12px)',
      duration: opts.duration || 1,
      stagger: opts.stagger || 0.1,
      ease: opts.ease || 'power3.out',
      scrollTrigger: Object.assign({ once: true }, opts.scrollTrigger || {}),
      clearProps: 'filter'
    });
  }

  function revealClip(target, opts) {
    opts = opts || {};
    return gsap.from(target, {
      clipPath: opts.from || 'inset(0 100% 0 0)',
      autoAlpha: opts.fade === false ? undefined : 0,
      duration: opts.duration || 1.1,
      ease: opts.ease || 'power4.out',
      scrollTrigger: Object.assign({ once: true }, opts.scrollTrigger || {})
    });
  }

  function initCollectionPageAnimations() {
    var EASE_OUT = 'power3.out';
    var EASE_POWER4 = 'power4.out';

    var collHero = document.getElementById('collHero');
    if (collHero) {
      var heroTl = gsap.timeline({ defaults: { ease: EASE_OUT } });
      var eyebrow = collHero.querySelector('.coll-hero__eyebrow');
      var title = collHero.querySelector('.coll-hero__title');
      var sub = collHero.querySelector('.coll-hero__sub');
      var scrollCue = collHero.querySelector('.coll-hero__scroll-cue');

      if (eyebrow) heroTl.from(eyebrow, { y: 20, autoAlpha: 0, duration: 0.7 });
      if (title) heroTl.from(title, { y: 36, autoAlpha: 0, duration: 0.95 }, eyebrow ? '-=0.4' : 0);
      if (sub) heroTl.from(sub, { y: 24, autoAlpha: 0, duration: 0.8 }, '-=0.55');
      if (scrollCue) heroTl.from(scrollCue, { autoAlpha: 0, duration: 0.5 }, '-=0.35');
    }

    initCollectionVertical();
  }

  function initCollectionVertical() {
    var section = document.getElementById('collSpirits');
    if (!section) return;

    var panels = section.querySelectorAll('.coll-panel');
    if (!panels.length) return;

    var sidenav = document.getElementById('collSidenav');
    var navItems = sidenav ? Array.prototype.slice.call(sidenav.querySelectorAll('.coll-sidenav__item')) : [];

    function setActive(index) {
      navItems.forEach(function (item, i) {
        item.classList.toggle('is-active', i === index);
      });
    }

    // Side nav dot click → smooth scroll to panel
    if (sidenav) {
      sidenav.querySelectorAll('.coll-sidenav__dot').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var target = document.getElementById(btn.dataset.target);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
    }

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    panels.forEach(function (panel, i) {
      var meta    = panel.querySelector('.coll-panel__meta');
      var name    = panel.querySelector('.coll-panel__name');
      var desc    = panel.querySelector('.coll-panel__desc');
      var tags    = panel.querySelector('.coll-panel__tags');
      var cta     = panel.querySelector('.coll-panel__cta');
      var bottle  = panel.querySelector('.coll-panel__bottle');
      var ghost   = panel.querySelector('.coll-panel__ghost');

      // Update side nav active dot as panel enters center of viewport
      ScrollTrigger.create({
        trigger: panel,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: function () { setActive(i); },
        onEnterBack: function () { setActive(i); }
      });

      // Staggered text reveal
      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top 76%',
          once: true
        }
      });
      if (meta)   tl.from(meta,   { y: 28, autoAlpha: 0, duration: 0.65, ease: 'power3.out' });
      if (name)   tl.from(name,   { y: 44, autoAlpha: 0, duration: 0.9,  ease: 'power3.out' }, '-=0.38');
      if (desc)   tl.from(desc,   { y: 30, autoAlpha: 0, duration: 0.72, ease: 'power3.out' }, '-=0.48');
      if (tags)   tl.from(tags,   { y: 20, autoAlpha: 0, duration: 0.55, ease: 'power3.out' }, '-=0.42');
      if (cta)    tl.from(cta,    { y: 16, autoAlpha: 0, duration: 0.45, ease: 'power3.out' }, '-=0.38');

      // Bottle entrance
      if (bottle) {
        gsap.from(bottle, {
          y: isMobileLite() ? 40 : 70,
          autoAlpha: 0,
          duration: isMobileLite() ? 0.75 : 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: panel, start: 'top 74%', once: true }
        });

        if (!isMobileLite()) {
          gsap.to(bottle, {
            y: -50,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.4
            }
          });
        }
      }

      if (ghost && !isMobileLite()) {
        gsap.to(ghost, {
          y: -90,
          ease: 'none',
          scrollTrigger: {
            trigger: panel,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.8
          }
        });
      }
    });

    ScrollTrigger.refresh();
  }

  function initCraftPageAnimations() {
    var EASE_OUT = 'power3.out';
    var EASE_EXPO = 'expo.out';
    var EASE_POWER4 = 'power4.out';
    var lite = isMobileLite();

    var hero = document.querySelector('.craft-hero');
    if (hero) {
      var heroBg = hero.querySelector('.craft-hero__bg img');
      var heroTitle = hero.querySelector('.craft-hero__title');
      var heroLines = prepareLineReveal(heroTitle);
      var heroRule = hero.querySelector('.craft-hero__rule');

      var heroTl = gsap.timeline({ defaults: { ease: EASE_OUT } });
      if (heroRule) {
        heroTl.from(heroRule, { scaleX: 0, duration: 0.9, ease: EASE_POWER4 });
      }
      heroTl
        .from(hero.querySelector('.craft-hero__label'), withoutBlur({
          y: 20, autoAlpha: 0, filter: 'blur(8px)', duration: 0.8, clearProps: 'filter'
        }), '-=0.5')
        .from(heroLines.length ? heroLines : heroTitle, {
          yPercent: 115, autoAlpha: 0, stagger: lite ? 0.08 : 0.13, duration: lite ? 0.75 : 1.05, ease: EASE_POWER4
        }, '-=0.55')
        .from(hero.querySelector('.craft-hero__lead'), withoutBlur({
          y: 24, autoAlpha: 0, filter: 'blur(10px)', duration: 0.85, clearProps: 'filter'
        }), '-=0.6')
        .from(hero.querySelector('.craft-hero__scroll'), { autoAlpha: 0, duration: 0.55 }, '-=0.35');

      if (heroBg && !lite) {
        gsap.fromTo(heroBg, { scale: 1.18 }, {
          scale: 1,
          yPercent: 14,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.85 }
        });
      }
    }

    var manifesto = document.querySelector('.craft-manifesto');
    if (manifesto) {
      gsap.from(manifesto.querySelector('.craft-manifesto__ghost'), {
        scale: 0.88,
        autoAlpha: 0,
        duration: 1.4,
        ease: EASE_OUT,
        scrollTrigger: { trigger: manifesto, start: 'top 85%', once: true }
      });
      gsap.from(manifesto.querySelector('.craft-manifesto__quote'), withoutBlur({
        y: 40, autoAlpha: 0, filter: 'blur(12px)', duration: 1.1, ease: EASE_POWER4, clearProps: 'filter',
        scrollTrigger: { trigger: manifesto, start: 'top 78%', once: true }
      }));
      gsap.from(manifesto.querySelector('.craft-manifesto__note'), {
        y: 28, autoAlpha: 0, duration: 0.9, ease: EASE_OUT,
        scrollTrigger: { trigger: manifesto, start: 'top 72%', once: true }
      });
      if (!lite) {
        gsap.to(manifesto.querySelector('.craft-manifesto__ghost'), {
          y: 40,
          ease: 'none',
          scrollTrigger: { trigger: manifesto, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
        });
      }
    }

    var actsSection = document.getElementById('craftActs');
    if (actsSection) {
      var panels = gsap.utils.toArray('.craft-act-panel');
      var tabs = gsap.utils.toArray('.craft-act-tab');
      var meter = document.getElementById('craftActsMeter');
      var actCount = panels.length;

      function setActiveAct(index) {
        tabs.forEach(function (tab, i) {
          tab.classList.toggle('is-active', i === index);
        });
        panels.forEach(function (panel, i) {
          panel.classList.toggle('is-active', i === index);
        });
        if (meter) {
          meter.style.width = ((index + 1) / actCount * 100) + '%';
        }
      }

      gsap.set(panels, { autoAlpha: 0 });
      gsap.set(panels[0], { autoAlpha: 1 });
      setActiveAct(0);

      gsap.from(actsSection.querySelector('.craft-acts__masthead'), withoutBlur({
        y: 28, autoAlpha: 0, filter: 'blur(8px)', duration: 0.95, ease: EASE_POWER4, clearProps: 'filter',
        scrollTrigger: { trigger: actsSection, start: 'top 88%', once: true }
      }));

      gsap.matchMedia().add('(min-width: 901px)', function () {
        var actsTl = gsap.timeline({
          scrollTrigger: {
            trigger: actsSection,
            start: 'top top',
            end: '+=' + (window.innerHeight * (actCount - 1) * 0.85),
            pin: '.craft-acts__pin',
            scrub: 0.75,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: function (self) {
              var idx = Math.min(actCount - 1, Math.floor(self.progress * actCount));
              setActiveAct(idx);
            }
          }
        });

        for (var i = 1; i < actCount; i++) {
          actsTl
            .to(panels[i - 1], {
              autoAlpha: 0,
              scale: 0.98,
              duration: 0.4,
              ease: 'power2.inOut'
            }, i - 0.4)
            .fromTo(panels[i], {
              autoAlpha: 0,
              scale: 1.03
            }, {
              autoAlpha: 1,
              scale: 1,
              duration: 0.4,
              ease: 'power2.inOut'
            }, i - 0.4);
        }

        panels.forEach(function (panel) {
          var img = panel.querySelector('.craft-act-panel__figure img');
          if (!img) return;
          gsap.fromTo(img, { scale: 1.1 }, {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: actsSection,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2
            }
          });
        });
      });

      gsap.matchMedia().add('(max-width: 900px)', function () {
        panels.forEach(function (panel, i) {
          gsap.set(panel, { autoAlpha: 1, clearProps: 'filter,transform' });
          panel.classList.toggle('is-active', true);

          gsap.from(panel.querySelector('.craft-act-panel__figure'), {
            clipPath: 'inset(100% 0 0 0)',
            scale: 1.06,
            duration: 1.05,
            ease: EASE_POWER4,
            scrollTrigger: { trigger: panel, start: 'top 82%', once: true }
          });

          gsap.from(panel.querySelectorAll('.craft-act-panel__detail > *'), {
            y: 24, autoAlpha: 0, filter: 'blur(8px)', stagger: 0.1, duration: 0.85, ease: EASE_OUT, clearProps: 'filter',
            scrollTrigger: { trigger: panel, start: 'top 75%', once: true },
            delay: i * 0.04
          });
        });
      });
    }

    var craftStats = document.getElementById('craftStats');
    if (craftStats) {
      var statNums = craftStats.querySelectorAll('.craft-measures__val[data-count]');
      var statsDone = false;

      function formatStat(n) {
        return n >= 1000 ? n.toLocaleString() : String(n);
      }

      function runCraftStats() {
        if (statsDone) return;
        statsDone = true;
        statNums.forEach(function (el, i) {
          var target = parseInt(el.getAttribute('data-count'), 10);
          var obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 1.6,
            delay: i * 0.1,
            ease: 'power2.out',
            onUpdate: function () {
              el.textContent = formatStat(Math.round(obj.val));
            }
          });
        });
      }

      gsap.from(craftStats.querySelectorAll('.craft-measures__item'), {
        y: 24, autoAlpha: 0, stagger: 0.08, duration: 0.8, ease: EASE_EXPO,
        scrollTrigger: { trigger: craftStats, start: 'top 82%', once: true }
      });

      ScrollTrigger.create({
        trigger: craftStats,
        start: 'top 82%',
        once: true,
        onEnter: runCraftStats
      });
    }

    var salon = document.querySelector('.craft-salon');
    if (salon) {
      var salonTitle = salon.querySelector('.craft-salon__title');
      var salonLines = prepareLineReveal(salonTitle);
      var salonImg = salon.querySelector('.craft-salon__media img');

      var salonTl = gsap.timeline({
        scrollTrigger: { trigger: salon, start: 'top 68%', once: true }
      });

      salonTl
        .from(salon.querySelector('.craft-salon__label'), {
          y: 18, autoAlpha: 0, duration: 0.65, ease: EASE_OUT
        })
        .from(salonLines.length ? salonLines : salonTitle, {
          yPercent: 105, autoAlpha: 0, stagger: 0.11, duration: 0.95, ease: EASE_POWER4
        }, '-=0.45')
        .from(salon.querySelector('.craft-salon__body'), withoutBlur({
          y: 22, autoAlpha: 0, filter: 'blur(8px)', duration: 0.85, ease: EASE_OUT, clearProps: 'filter'
        }), '-=0.55')
        .from(salon.querySelectorAll('.craft-salon__marks li'), {
          x: -16, autoAlpha: 0, stagger: 0.09, duration: 0.7, ease: EASE_OUT
        }, '-=0.45');

      if (salonImg && !lite) {
        gsap.fromTo(salonImg, { scale: 1.12 }, {
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: salon, start: 'top bottom', end: 'bottom top', scrub: 0.9 }
        });
      }
    }

    var invite = document.querySelector('.craft-invite');
    if (invite) {
      gsap.from(invite.querySelectorAll('.craft-invite__inner > *'), withoutBlur({
        y: 30, autoAlpha: 0, filter: 'blur(8px)', stagger: 0.11, duration: 0.9, ease: EASE_OUT, clearProps: 'filter',
        scrollTrigger: { trigger: invite, start: 'top 85%', once: true }
      }));
    }

    window.addEventListener('load', function () {
      ScrollTrigger.refresh();
    });
  }

  function initInnerPageReveals() {
    var handled = new Set();
    var EASE_OUT = 'power3.out';
    var EASE_EXPO = 'expo.out';
    var EASE_POWER4 = 'power4.out';

    var pageHero = document.querySelector('.page-hero');
    if (pageHero) {
      handled.add(pageHero);
      var heroLabel = pageHero.querySelector('.page-hero__label');
      var heroTitle = pageHero.querySelector('.page-hero__title');
      var heroLines = prepareLineReveal(heroTitle);
      var heroTl = gsap.timeline({
        scrollTrigger: { trigger: pageHero, start: 'top 80%', once: true },
        defaults: { ease: EASE_OUT }
      });

      if (heroLabel) {
        heroTl.from(heroLabel, withoutBlur({
          y: 22, autoAlpha: 0, filter: 'blur(6px)', duration: 0.75, clearProps: 'filter'
        }));
      }
      if (heroLines.length) {
        heroTl.from(heroLines, {
          yPercent: 105, autoAlpha: 0, stagger: 0.11, duration: 0.95, ease: EASE_POWER4
        }, heroLabel ? '-=0.45' : 0);
      }
    }

    gsap.utils.toArray('[data-reveal]').forEach(function (el) {
      if (handled.has(el)) {
        el.classList.add('visible');
        return;
      }
      gsap.from(el, withoutBlur({
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        y: isMobileLite() ? 24 : 36,
        autoAlpha: 0,
        filter: 'blur(8px)',
        duration: isMobileLite() ? 0.65 : 1,
        delay: parseRevealDelay(el),
        ease: EASE_OUT,
        clearProps: 'filter',
        onComplete: function () { el.classList.add('visible'); }
      }));
    });
  }

  function initHomeScrollAnimations() {
    var EASE_OUT    = 'power3.out';
    var EASE_EXPO   = 'expo.out';
    var EASE_POWER4 = 'power4.out';
    var lite        = isMobileLite();

    // ── Scroll progress bar ──
    var progressBar = document.getElementById('scrollProgress');
    if (progressBar) {
      window.addEventListener('scroll', function () {
        var max  = document.documentElement.scrollHeight - window.innerHeight;
        var pct  = max > 0 ? (window.scrollY / max) * 100 : 0;
        progressBar.style.width = pct + '%';
      }, { passive: true });
    }

    // ── Categories — entrance reveal ──
    var categories = document.querySelector('.categories');
    if (categories) {
      var catItems = categories.querySelectorAll('.categories__item');
      gsap.from(catItems, {
        y: 36,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: categories,
          start: 'top 82%',
          once: true
        }
      });
    }

    // ── Collection cards — staggered GSAP reveal ──
    var collCards = document.querySelectorAll('#collection .collection__card');
    if (collCards.length) {
      gsap.from(collCards, withoutBlur({
        y: lite ? 32 : 50,
        autoAlpha: 0,
        filter: 'blur(8px)',
        stagger: lite ? 0.05 : 0.08,
        duration: lite ? 0.6 : 0.9,
        ease: EASE_POWER4,
        clearProps: 'filter',
        scrollTrigger: { trigger: '#collection', start: 'top 78%', once: true }
      }));
      // Collection header reveal
      var collHeader = document.querySelector('.collection__header');
      if (collHeader) {
        gsap.from(collHeader, {
          y: 28, autoAlpha: 0, duration: 0.85, ease: EASE_OUT,
          scrollTrigger: { trigger: collHeader, start: 'top 88%', once: true }
        });
      }
    }

    // ── Curator's Pick — entrance + parallax ──
    var cp = document.getElementById('curatorsPick');
    if (cp) {
      var cpTl = gsap.timeline({
        scrollTrigger: { trigger: cp, start: 'top 82%', once: true }
      });

      cpTl
        .from(cp.querySelector('.curators-pick__eyebrow'), withoutBlur({
          y: 18, autoAlpha: 0, filter: 'blur(6px)', duration: 0.75, ease: EASE_OUT, clearProps: 'filter'
        }))
        .from(cp.querySelector('.curators-pick__heading'), {
          y: 30, autoAlpha: 0, duration: lite ? 0.65 : 0.9, ease: EASE_POWER4
        }, '-=0.5')
        .from(cp.querySelector('.curators-pick__counter'), {
          y: 14, autoAlpha: 0, duration: 0.65, ease: EASE_EXPO
        }, '-=0.65')
        .from(cp.querySelector('.curators-pick__watermark'), {
          scale: lite ? 1 : 1.1, autoAlpha: 0, duration: lite ? 0.7 : 1.3, ease: 'power2.out'
        }, '-=0.85');

      if (!lite) {
        cpTl
          .from(cp.querySelector('.curators-pick__info-wrap'), {
            clipPath: 'inset(0 0 0 100%)', duration: 1, ease: EASE_POWER4
          }, '-=0.8')
          .from(cp.querySelectorAll('.curators-pick__arrow'), {
            autoAlpha: 0, scale: 0.7, rotation: -40, stagger: 0.09, duration: 0.6, ease: EASE_EXPO
          }, '-=0.5');
      } else {
        cpTl.from(cp.querySelector('.curators-pick__info-wrap'), {
          autoAlpha: 0, duration: 0.55, ease: EASE_OUT
        }, '-=0.5');
      }

      cpTl.from(cp.querySelectorAll('.curators-pick__dot'), {
        scaleX: 0, transformOrigin: 'left center', stagger: 0.06, duration: 0.5, ease: EASE_OUT
      }, '-=0.4');

      if (!lite) {
        gsap.to(cp.querySelector('.curators-pick__watermark'), {
          y: 55, ease: 'none',
          scrollTrigger: { trigger: cp, start: 'top bottom', end: 'bottom top', scrub: 1.2 }
        });
        gsap.to(cp.querySelector('.curators-pick__stage'), {
          y: -28, ease: 'none',
          scrollTrigger: { trigger: cp, start: 'top bottom', end: 'bottom top', scrub: 1.4 }
        });
      }
    }

    // ── Philosophy — clip image + lines + COUNTER ──
    var philosophy = document.querySelector('.philosophy');
    if (philosophy) {
      var philHeading = philosophy.querySelector('.philosophy__heading');
      var philLines   = prepareLineReveal(philHeading);
      var philFrame   = philosophy.querySelector('.philosophy__frame');

      var philTl = gsap.timeline({
        scrollTrigger: { trigger: philosophy, start: 'top 72%', once: true }
      });

      philTl
        .from(philFrame, {
          clipPath: 'inset(100% 0 0 0)',
          scale: 1.07,
          autoAlpha: 0,
          duration: 1.15,
          ease: EASE_POWER4
        })
        .from(philosophy.querySelector('.philosophy__frame-line'), {
          scaleX: 0, transformOrigin: 'left center', duration: 0.75, ease: EASE_OUT
        }, '-=0.5')
        .from(philosophy.querySelector('.philosophy__label'), withoutBlur({
          y: 18, autoAlpha: 0, filter: 'blur(5px)', duration: 0.65, ease: EASE_OUT, clearProps: 'filter'
        }), '-=0.8')
        .from(philLines, {
          yPercent: 108, autoAlpha: 0, stagger: lite ? 0.08 : 0.12, duration: lite ? 0.65 : 0.9, ease: EASE_POWER4
        }, '-=0.6')
        .from(philosophy.querySelector('.philosophy__body'), withoutBlur({
          y: 26, autoAlpha: 0, filter: 'blur(7px)', duration: 0.8, ease: EASE_OUT, clearProps: 'filter'
        }), '-=0.5')
        .from(philosophy.querySelectorAll('.philosophy__stat'), {
          y: 22, autoAlpha: 0, scale: 0.88, stagger: 0.08, duration: 0.65, ease: EASE_EXPO
        }, '-=0.4');

      // Counter animation for stats
      philosophy.querySelectorAll('.philosophy__stat-num').forEach(function (el) {
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        var obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: function () { el.textContent = Math.round(obj.val); },
          scrollTrigger: { trigger: el, start: 'top 82%', once: true }
        });
      });

      if (!lite) {
        gsap.to(philFrame, {
          y: -38, ease: 'none',
          scrollTrigger: { trigger: philosophy, start: 'top bottom', end: 'bottom top', scrub: 1.2 }
        });
      }
    }

    // ── Craft — ken burns + content reveal ──
    var craft = document.querySelector('.craft');
    if (craft) {
      var craftBg = craft.querySelector('.craft__bg img');
      var craftHeadingEl = craft.querySelector('.craft__heading');
      var craftLines = prepareLineReveal(craftHeadingEl);

      var craftTl = gsap.timeline({
        scrollTrigger: { trigger: craft, start: 'top 78%', once: true }
      });

      craftTl
        .from(craft.querySelector('.craft__label'), {
          y: 18, autoAlpha: 0, duration: 0.65, ease: EASE_OUT
        })
        .from(craftLines.length ? craftLines : craftHeadingEl, {
          yPercent: 110, autoAlpha: 0, stagger: 0.1, duration: 0.9, ease: EASE_POWER4
        }, '-=0.4')
        .from(craft.querySelector('.craft__body'), withoutBlur({
          y: 28, autoAlpha: 0, filter: 'blur(7px)', duration: 0.85, ease: EASE_OUT, clearProps: 'filter'
        }), '-=0.5')
        .from(craft.querySelector('.craft__cta'), {
          y: 18, autoAlpha: 0, scale: 0.93, duration: 0.7, ease: EASE_EXPO
        }, '-=0.4');

      if (craftBg && !lite) {
        gsap.fromTo(craftBg, { scale: 1.18 }, {
          scale: 1, yPercent: 16, ease: 'none',
          scrollTrigger: { trigger: craft, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
        });
      }
    }

    // ── Footer CTA ──
    var footerCta = document.querySelector('.footer-cta');
    if (footerCta) {
      gsap.from(footerCta.querySelectorAll('.footer-cta__eyebrow, .footer-cta__title, .footer-cta__btn'), {
        y: 30, autoAlpha: 0, stagger: 0.1, duration: 0.85, ease: EASE_POWER4,
        scrollTrigger: { trigger: footerCta, start: 'top 82%', once: true }
      });
    }

    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  function initConnectPageAnimations() {
    var EASE_OUT = 'power3.out';
    var EASE_EXPO = 'expo.out';
    var EASE_POWER4 = 'power4.out';
    var lite = isMobileLite();

    var hero = document.querySelector('.connect-hero');
    if (hero) {
      var heroBg = hero.querySelector('.connect-hero__bg img');
      var heroTitle = hero.querySelector('.connect-hero__title');
      var heroLines = prepareLineReveal(heroTitle);
      var heroRule = hero.querySelector('.connect-hero__rule');

      var heroTl = gsap.timeline({ defaults: { ease: EASE_OUT } });
      if (heroRule) heroTl.from(heroRule, { scaleX: 0, duration: 0.85, ease: EASE_POWER4 });
      heroTl
        .from(hero.querySelector('.connect-hero__label'), withoutBlur({
          y: 20, autoAlpha: 0, filter: 'blur(8px)', duration: 0.8, clearProps: 'filter'
        }), '-=0.45')
        .from(heroLines.length ? heroLines : heroTitle, {
          yPercent: 110, autoAlpha: 0, stagger: lite ? 0.08 : 0.12, duration: lite ? 0.75 : 1, ease: EASE_POWER4
        }, '-=0.5')
        .from(hero.querySelector('.connect-hero__lead'), withoutBlur({
          y: 24, autoAlpha: 0, filter: 'blur(8px)', duration: 0.85, clearProps: 'filter'
        }), '-=0.6');

      if (heroBg && !lite) {
        gsap.fromTo(heroBg, { scale: 1.14 }, {
          scale: 1,
          yPercent: 10,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.85 }
        });
      }
    }

    var intro = document.querySelector('.connect-intro');
    if (intro) {
      gsap.from(intro.querySelector('.connect-intro__text'), withoutBlur({
        y: 36, autoAlpha: 0, filter: 'blur(10px)', duration: 1, ease: EASE_POWER4, clearProps: 'filter',
        scrollTrigger: { trigger: intro, start: 'top 78%', once: true }
      }));
      if (!lite) {
        gsap.to(intro.querySelector('.connect-intro__ghost'), {
          y: 30,
          ease: 'none',
          scrollTrigger: { trigger: intro, start: 'top bottom', end: 'bottom top', scrub: 1.4 }
        });
      }
    }

    gsap.from('.connect-path', withoutBlur({
      x: -24, autoAlpha: 0, filter: 'blur(8px)', stagger: 0.12, duration: 0.9, ease: EASE_EXPO, clearProps: 'filter',
      scrollTrigger: { trigger: '.connect-paths', start: 'top 82%', once: true }
    }));

    var reach = document.getElementById('connectReach');
    if (reach) {
      gsap.from(reach.querySelectorAll('.connect-reach__details > *'), withoutBlur({
        y: 28, autoAlpha: 0, filter: 'blur(8px)', stagger: 0.1, duration: 0.85, ease: EASE_OUT, clearProps: 'filter',
        scrollTrigger: { trigger: reach, start: 'top 78%', once: true }
      }));
      gsap.from(reach.querySelectorAll('.connect-form > *'), withoutBlur({
        y: 32, autoAlpha: 0, filter: 'blur(8px)', stagger: 0.08, duration: 0.8, ease: EASE_OUT, clearProps: 'filter',
        scrollTrigger: { trigger: reach.querySelector('.connect-form'), start: 'top 85%', once: true }
      }));
    }
  }

  function initConnectForm() {
    var form = document.getElementById('connectForm');
    var note = document.getElementById('connectFormNote');
    if (!form) return;

    if (typeof emailjs !== 'undefined') {
      emailjs.init('ZnZGcLpxgGxsGdvsb');
    }

    var subjectLabels = {
      visit: 'Distillery Visit',
      trade: 'Trade Enquiry',
      press: 'Press & Media',
      general: 'General'
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = form.querySelector('.connect-form__submit');
      var nameEl = document.getElementById('connectName');
      var emailEl = document.getElementById('connectEmail');
      var subjectEl = document.getElementById('connectSubject');
      var messageEl = document.getElementById('connectMessage');

      if (!nameEl.value.trim() || !emailEl.value.trim() || !subjectEl.value || !messageEl.value.trim()) {
        if (note) note.textContent = 'Please fill in all fields before sending.';
        return;
      }

      if (typeof emailjs === 'undefined') {
        if (note) note.textContent = 'Unable to send — please email us at info@mngoverseas.com.';
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }
      if (note) note.textContent = '';

      emailjs.send('service_6hlbtnk', 'template_kj49ldf', {
        from_name: nameEl.value.trim(),
        from_email: emailEl.value.trim(),
        reply_to: emailEl.value.trim(),
        subject: subjectLabels[subjectEl.value] || subjectEl.value,
        message: messageEl.value.trim()
      }).then(function () {
        if (note) note.textContent = 'Thank you — your enquiry has been received. We will respond shortly.';
        form.reset();
      }).catch(function () {
        if (note) note.textContent = 'Something went wrong. Please try again or email info@mngoverseas.com directly.';
      }).finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Enquiry';
        }
      });
    });
  }

  function initProductPageAnimations() {
    var hero = document.getElementById('productHero');
    if (!hero || typeof gsap === 'undefined') return;

    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    var visual = hero.querySelector('.product-hero__visual');
    var content = hero.querySelector('.product-hero__content');

    if (visual) {
      tl.from(visual, { x: -32, autoAlpha: 0, duration: 1, ease: 'power3.out' });
    }
    if (content) {
      tl.from(content.children, {
        y: 28,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 0.85
      }, visual ? '-=0.65' : 0);
    }

    var notes = document.querySelector('.product-notes');
    if (notes) {
      gsap.from(notes.querySelectorAll('.product-notes__item'), {
        y: 24,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: notes, start: 'top 82%', once: true }
      });
    }

    var related = document.querySelector('.product-related');
    if (related) {
      gsap.from(related.querySelectorAll('.product-related__card'), {
        y: 30,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: related, start: 'top 85%', once: true }
      });
    }
  }

  function initPageAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      fallbackScrollReveal();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    var mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: reduce)', function () {
      gsap.set('[data-reveal], .col-piece, .col-piece *, .coll-hero, .coll-hero *, .coll-panel, .coll-panel *, .product-page, .product-page *, .craft-page, .craft-page *, .connect-page, .connect-page *', { autoAlpha: 1, y: 0, x: 0, clearProps: 'transform,filter' });
      document.querySelectorAll('[data-reveal]').forEach(function (el) {
        el.classList.add('visible');
      });
    });

    mm.add('(prefers-reduced-motion: no-preference)', function () {
      if (document.getElementById('hero')) {
        initHomeScrollAnimations();
      } else if (document.querySelector('.connect-page')) {
        initConnectPageAnimations();
      } else if (document.querySelector('.craft-page')) {
        initCraftPageAnimations();
      } else if (document.querySelector('.collection-page') || document.getElementById('collSpirits')) {
        initCollectionPageAnimations();
      } else if (document.querySelector('.product-page')) {
        initProductPageAnimations();
      } else {
        initInnerPageReveals();
      }
      ScrollTrigger.refresh();
    });
  }

})();
