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
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      var target = document.querySelector(href);
      if (target) {
        var headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 128;
        var top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
      closeMobileNav();
    });
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
    var MOVE_DUR  = 0.62;
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

  function initHeroSequence() {
    var hero = document.getElementById('hero');
    var canvas = document.getElementById('heroCanvas');
    if (!hero || !canvas || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    var ctx = canvas.getContext('2d');
    var media = hero.querySelector('.hero__media');
    var text1 = document.getElementById('heroText1');
    var text2 = document.getElementById('heroText2');
    var text3 = document.getElementById('heroText3');
    var text4 = document.getElementById('heroText4');
    var scrollHint = hero.querySelector('.hero__scroll-hint');

    var SEQUENCES = {
      desktop: {
        count: 596,
        path: function (i) {
          return 'images/sequences/intro/frame_' + String(i + 1).padStart(5, '0') + '.jpg';
        }
      },
      mobile: {
        count: 600,
        path: function (i) {
          return 'images/sequences/mobile/frame_' + String(i + 1).padStart(5, '0') + '.jpg';
        }
      }
    };

    function setupHeroSequence(sequenceKey) {
      var config = SEQUENCES[sequenceKey];
      var FRAME_COUNT = config.count;
      var images = [];
      var imagesLoaded = 0;
      var started = false;
      var dpr = 1;
      var heroScrollTrigger;
      var heroTimeline;
      var resizeHandler;
      var refreshHandler;

      hero.style.height = '';

      function framePath(i) {
        return config.path(i);
      }

    function canvasSize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w: rect.width, h: rect.height };
    }

    function drawFrame(index) {
      var img = images[index];
      if (!img || !img.complete || !img.naturalWidth) {
        for (var j = index; j >= 0; j--) {
          img = images[j];
          if (img && img.complete && img.naturalWidth) break;
          img = null;
        }
        if (!img) return;
      }

      var size = canvasSize();
      var w = size.w;
      var h = size.h;
      var imgRatio = img.naturalWidth / img.naturalHeight;
      var canvasRatio = w / h;
      var drawW, drawH, offsetX, offsetY;

      if (imgRatio > canvasRatio) {
        drawW = w;
        drawH = w / imgRatio;
        offsetX = 0;
        offsetY = (h - drawH) / 2;
      } else {
        drawH = h;
        drawW = h * imgRatio;
        offsetX = (w - drawW) / 2;
        offsetY = 0;
      }

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    }

    function maybeStart(callback) {
      if (started) return;
      if (!images[0] || !images[0].complete || !images[0].naturalWidth) return;
      started = true;
      drawFrame(0);
      callback();
    }

    function preloadFrames(callback) {
      for (var i = 0; i < FRAME_COUNT; i++) {
        (function (index) {
          var img = new Image();
          img.decoding = 'async';
          img.onload = img.onerror = function () {
            imagesLoaded++;
            if (index === 0) maybeStart(callback);
          };
          img.src = framePath(index);
          images[index] = img;
        })(i);
      }
    }

    function buildTimeline() {
      var isMobile = sequenceKey === 'mobile';

      gsap.set([text1, text2, text3, text4], { autoAlpha: 0 });
      gsap.set(text1, { xPercent: -50, yPercent: -50, y: 40 });
      gsap.set(text4, { xPercent: -50, yPercent: -50, y: 40, scale: 0.92 });

      if (isMobile) {
        gsap.set(text2, { xPercent: -50, yPercent: -50, y: 30, x: 0 });
        gsap.set(text3, { xPercent: -50, yPercent: -50, y: 30, x: 0 });
      } else {
        gsap.set(text2, { xPercent: 0, yPercent: -50, x: -80 });
        gsap.set(text3, { xPercent: 0, yPercent: -50, x: 80 });
      }

      gsap.set(media, { scale: 1, transformOrigin: '50% 50%' });
      if (scrollHint) gsap.set(scrollHint, { autoAlpha: 1 });

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom bottom',
          scrub: isMobile ? 0.35 : 0.6,
          pin: '.hero__sticky',
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            var frame = Math.min(FRAME_COUNT - 1, Math.round(self.progress * (FRAME_COUNT - 1)));
            drawFrame(frame);
          }
        }
      });

      heroScrollTrigger = tl.scrollTrigger;
      heroTimeline = tl;

      if (scrollHint) {
        tl.to(scrollHint, { autoAlpha: 0, duration: 0.04, ease: 'power1.in' }, 0.03);
      }

      // 1 — centered text in, then out
      tl.to(text1, { autoAlpha: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.04)
        .to(text1, { autoAlpha: 0, y: -30, duration: 0.06, ease: 'power2.in' }, 0.16);

      if (isMobile) {
        tl.to(text2, { autoAlpha: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.22)
          .to(text2, { autoAlpha: 0, y: -24, duration: 0.06, ease: 'power2.in' }, 0.34)
          .to(text3, { autoAlpha: 1, y: 0, duration: 0.07, ease: 'power3.out' }, 0.40)
          .to(text3, { autoAlpha: 0, y: -24, duration: 0.06, ease: 'power2.in' }, 0.52);
      } else {
        tl.to(text2, { autoAlpha: 1, x: 0, duration: 0.07, ease: 'power3.out' }, 0.22)
          .to(text2, { autoAlpha: 0, x: -50, duration: 0.06, ease: 'power2.in' }, 0.34)
          .to(text3, { autoAlpha: 1, x: 0, duration: 0.07, ease: 'power3.out' }, 0.40)
          .to(text3, { autoAlpha: 0, x: 50, duration: 0.06, ease: 'power2.in' }, 0.52);
      }

      tl

        // 4 — final centered text, holds to end
        .to(text4, { autoAlpha: 1, y: 0, scale: 1, duration: 0.09, ease: 'power3.out' }, 0.58)
        .to({}, { duration: 0.33 }, 0.67);
    }

    function refreshFrame() {
      if (!heroScrollTrigger) return;
      var frame = Math.min(FRAME_COUNT - 1, Math.round(heroScrollTrigger.progress * (FRAME_COUNT - 1)));
      drawFrame(frame);
    }

    refreshHandler = refreshFrame;
    resizeHandler = refreshFrame;
    window.addEventListener('resize', resizeHandler);

    preloadFrames(function () {
      buildTimeline();
      ScrollTrigger.addEventListener('refresh', refreshHandler);
    });

    return function cleanup() {
      window.removeEventListener('resize', resizeHandler);
      ScrollTrigger.removeEventListener('refresh', refreshHandler);
      if (heroTimeline) heroTimeline.kill();
      if (heroScrollTrigger) heroScrollTrigger.kill();
      images.length = 0;
      imagesLoaded = 0;
      started = false;
      heroScrollTrigger = null;
      heroTimeline = null;
    };
    }

    var mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: reduce)', function () {
      hero.style.height = '100dvh';
      gsap.set(media, { scale: 1 });
      gsap.set([text1, text2, text3], { autoAlpha: 0 });
      gsap.set(text4, { autoAlpha: 1, xPercent: -50, yPercent: -50, y: 0, scale: 1 });
      if (scrollHint) gsap.set(scrollHint, { autoAlpha: 0 });
      return function () {};
    });

    mm.add('(max-width: 900px) and (prefers-reduced-motion: no-preference)', function () {
      return setupHeroSequence('mobile');
    });

    mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', function () {
      return setupHeroSequence('desktop');
    });
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
    var EASE_EXPO = 'expo.out';
    var EASE_POWER4 = 'power4.out';

    var pageHero = document.querySelector('.page-hero');
    if (pageHero) {
      var heroLabel = pageHero.querySelector('.page-hero__label');
      var heroTitle = pageHero.querySelector('.page-hero__title');
      var heroLines = prepareLineReveal(heroTitle);
      var heroTl = gsap.timeline({ defaults: { ease: EASE_OUT } });

      if (heroLabel) {
        heroTl.from(heroLabel, {
          y: 24, autoAlpha: 0, filter: 'blur(8px)', duration: 0.85, clearProps: 'filter'
        });
      }
      if (heroLines.length) {
        heroTl.from(heroLines, {
          yPercent: 110, autoAlpha: 0, stagger: 0.13, duration: 1, ease: EASE_POWER4
        }, heroLabel ? '-=0.5' : 0);
      }
    }

    gsap.utils.toArray('.col-piece').forEach(function (piece) {
      var flip = piece.classList.contains('col-piece--flip');
      var pieceTl = gsap.timeline({
        scrollTrigger: { trigger: piece, start: 'top 82%', once: true }
      });

      pieceTl
        .from(piece.querySelector('.col-piece__index'), {
          x: flip ? 28 : -28, autoAlpha: 0, duration: 0.7, ease: EASE_OUT
        })
        .from(piece.querySelector('.col-piece__watermark'), {
          x: flip ? -70 : 70, autoAlpha: 0, filter: 'blur(10px)', duration: 1.15, ease: EASE_OUT, clearProps: 'filter'
        }, '-=0.4')
        .from(piece.querySelector('.col-piece__glow'), {
          scale: 0.55, autoAlpha: 0, duration: 1.05, ease: EASE_OUT
        }, '-=0.95')
        .from(piece.querySelector('.col-piece__bottle'), {
          y: 80, autoAlpha: 0, scale: 0.88, duration: 1.1, ease: EASE_EXPO
        }, '-=0.9')
        .from(piece.querySelectorAll('.col-piece__meta > *'), {
          y: 32, autoAlpha: 0, filter: 'blur(8px)', stagger: 0.09, duration: 0.8, ease: EASE_OUT, clearProps: 'filter'
        }, '-=0.6');

      gsap.to(piece.querySelector('.col-piece__watermark'), {
        x: flip ? -16 : 16,
        ease: 'none',
        scrollTrigger: { trigger: piece, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
      });

      gsap.to(piece.querySelector('.col-piece__bottle'), {
        y: -18,
        ease: 'none',
        scrollTrigger: { trigger: piece, start: 'top bottom', end: 'bottom top', scrub: 1.2 }
      });
    });

    window.addEventListener('load', function () {
      ScrollTrigger.refresh();
    });
  }

  function initCraftPageAnimations() {
    var EASE_OUT = 'power3.out';
    var EASE_EXPO = 'expo.out';
    var EASE_POWER4 = 'power4.out';

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
        .from(hero.querySelector('.craft-hero__label'), {
          y: 20, autoAlpha: 0, filter: 'blur(8px)', duration: 0.8, clearProps: 'filter'
        }, '-=0.5')
        .from(heroLines.length ? heroLines : heroTitle, {
          yPercent: 115, autoAlpha: 0, stagger: 0.13, duration: 1.05, ease: EASE_POWER4
        }, '-=0.55')
        .from(hero.querySelector('.craft-hero__lead'), {
          y: 24, autoAlpha: 0, filter: 'blur(10px)', duration: 0.85, clearProps: 'filter'
        }, '-=0.6')
        .from(hero.querySelector('.craft-hero__scroll'), { autoAlpha: 0, duration: 0.55 }, '-=0.35');

      if (heroBg) {
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
      gsap.from(manifesto.querySelector('.craft-manifesto__quote'), {
        y: 40, autoAlpha: 0, filter: 'blur(12px)', duration: 1.1, ease: EASE_POWER4, clearProps: 'filter',
        scrollTrigger: { trigger: manifesto, start: 'top 78%', once: true }
      });
      gsap.from(manifesto.querySelector('.craft-manifesto__note'), {
        y: 28, autoAlpha: 0, duration: 0.9, ease: EASE_OUT,
        scrollTrigger: { trigger: manifesto, start: 'top 72%', once: true }
      });
      gsap.to(manifesto.querySelector('.craft-manifesto__ghost'), {
        y: 40,
        ease: 'none',
        scrollTrigger: { trigger: manifesto, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
      });
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

      gsap.from(actsSection.querySelector('.craft-acts__masthead'), {
        y: 28, autoAlpha: 0, filter: 'blur(8px)', duration: 0.95, ease: EASE_POWER4, clearProps: 'filter',
        scrollTrigger: { trigger: actsSection, start: 'top 88%', once: true }
      });

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
        .from(salon.querySelector('.craft-salon__body'), {
          y: 22, autoAlpha: 0, filter: 'blur(8px)', duration: 0.85, ease: EASE_OUT, clearProps: 'filter'
        }, '-=0.55')
        .from(salon.querySelectorAll('.craft-salon__marks li'), {
          x: -16, autoAlpha: 0, stagger: 0.09, duration: 0.7, ease: EASE_OUT
        }, '-=0.45');

      if (salonImg) {
        gsap.fromTo(salonImg, { scale: 1.12 }, {
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: salon, start: 'top bottom', end: 'bottom top', scrub: 0.9 }
        });
      }
    }

    var invite = document.querySelector('.craft-invite');
    if (invite) {
      gsap.from(invite.querySelectorAll('.craft-invite__inner > *'), {
        y: 30, autoAlpha: 0, filter: 'blur(8px)', stagger: 0.11, duration: 0.9, ease: EASE_OUT, clearProps: 'filter',
        scrollTrigger: { trigger: invite, start: 'top 85%', once: true }
      });
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
        heroTl.from(heroLabel, { y: 22, autoAlpha: 0, filter: 'blur(6px)', duration: 0.75, clearProps: 'filter' });
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
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        y: 36,
        autoAlpha: 0,
        filter: 'blur(8px)',
        duration: 1,
        delay: parseRevealDelay(el),
        ease: EASE_OUT,
        clearProps: 'filter',
        onComplete: function () { el.classList.add('visible'); }
      });
    });
  }

  function initHomeScrollAnimations() {
    var EASE_OUT = 'power3.out';
    var EASE_EXPO = 'expo.out';
    var EASE_POWER4 = 'power4.out';

    // Collection — static (no scroll animations)
    var collectionSection = document.querySelector('#collection');
    if (collectionSection) {
      collectionSection.querySelectorAll('[data-reveal]').forEach(function (el) {
        el.classList.add('visible');
      });
    }

    // ── Categories — blur reveal on scroll ──
    var categories = document.querySelector('.categories');
    if (categories) {
      var catItems = categories.querySelectorAll('.categories__item');
      gsap.from(catItems, {
        yPercent: 60,
        autoAlpha: 0,
        filter: 'blur(14px)',
        stagger: 0.14,
        ease: 'none',
        clearProps: 'filter',
        scrollTrigger: {
          trigger: categories,
          start: 'top 90%',
          end: 'top 35%',
          scrub: 0.65
        }
      });
    }

    // ── Curator's Pick — entrance + parallax (carousel handles bottles) ──
    var cp = document.getElementById('curatorsPick');
    if (cp) {
      var cpTl = gsap.timeline({
        scrollTrigger: { trigger: cp, start: 'top 80%', once: true },
        onComplete: function () {
          window.dispatchEvent(new Event('resize'));
        }
      });

      cpTl
        .from(cp.querySelector('.curators-pick__eyebrow'), {
          y: 20, autoAlpha: 0, filter: 'blur(6px)', duration: 0.8, ease: EASE_OUT, clearProps: 'filter'
        })
        .from(cp.querySelector('.curators-pick__heading'), {
          y: 32, autoAlpha: 0, duration: 0.95, ease: EASE_POWER4
        }, '-=0.5')
        .from(cp.querySelector('.curators-pick__counter'), {
          y: 16, autoAlpha: 0, duration: 0.7, ease: EASE_EXPO
        }, '-=0.7')
        .from(cp.querySelector('.curators-pick__watermark'), {
          scale: 1.12, autoAlpha: 0, filter: 'blur(4px)', duration: 1.4, ease: 'power2.out', clearProps: 'filter'
        }, '-=0.9')
        .from(cp.querySelector('.curators-pick__info-wrap'), {
          clipPath: 'inset(0 0 0 100%)', duration: 1, ease: EASE_POWER4
        }, '-=0.85')
        .from(cp.querySelectorAll('.curators-pick__arrow'), {
          autoAlpha: 0, scale: 0.7, rotation: -45, stagger: 0.1, duration: 0.65, ease: EASE_EXPO
        }, '-=0.55')
        .from(cp.querySelectorAll('.curators-pick__dot'), {
          scaleX: 0, transformOrigin: 'left center', stagger: 0.07, duration: 0.55, ease: EASE_OUT
        }, '-=0.45');

      gsap.to(cp.querySelector('.curators-pick__watermark'), {
        y: 50,
        ease: 'none',
        scrollTrigger: { trigger: cp, start: 'top bottom', end: 'bottom top', scrub: 1.2 }
      });

      gsap.to(cp.querySelector('.curators-pick__stage'), {
        y: -30,
        ease: 'none',
        scrollTrigger: { trigger: cp, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
      });
    }

    // ── Philosophy — clip image + line heading + stat scale ──
    var philosophy = document.querySelector('.philosophy');
    if (philosophy) {
      var philHeading = philosophy.querySelector('.philosophy__heading');
      var philLines = prepareLineReveal(philHeading);
      var philFrame = philosophy.querySelector('.philosophy__frame');

      var philTl = gsap.timeline({
        scrollTrigger: { trigger: philosophy, start: 'top 70%', once: true }
      });

      philTl
        .from(philFrame, {
          clipPath: 'inset(100% 0 0 0)',
          scale: 1.08,
          autoAlpha: 0,
          duration: 1.2,
          ease: EASE_POWER4
        })
        .from(philosophy.querySelector('.philosophy__frame-line'), {
          scaleX: 0, transformOrigin: 'left center', duration: 0.8, ease: EASE_OUT
        }, '-=0.5')
        .from(philosophy.querySelector('.philosophy__label'), {
          y: 20, autoAlpha: 0, filter: 'blur(6px)', duration: 0.7, ease: EASE_OUT, clearProps: 'filter'
        }, '-=0.85')
        .from(philLines, {
          yPercent: 105, autoAlpha: 0, stagger: 0.13, duration: 0.95, ease: EASE_POWER4
        }, '-=0.65')
        .from(philosophy.querySelector('.philosophy__body'), {
          y: 28, autoAlpha: 0, filter: 'blur(8px)', duration: 0.85, ease: EASE_OUT, clearProps: 'filter'
        }, '-=0.55')
        .from(philosophy.querySelectorAll('.philosophy__stat'), {
          y: 24, autoAlpha: 0, scale: 0.9, stagger: 0.09, duration: 0.7, ease: EASE_EXPO
        }, '-=0.45');

      gsap.to(philFrame, {
        y: -40,
        ease: 'none',
        scrollTrigger: { trigger: philosophy, start: 'top bottom', end: 'bottom top', scrub: 1.2 }
      });
    }

    // ── Craft — ken burns + content reveal ──
    var craft = document.querySelector('.craft');
    if (craft) {
      var craftHeading = craft.querySelector('.craft__heading');
      var craftBg = craft.querySelector('.craft__bg img');

      var craftTl = gsap.timeline({
        scrollTrigger: { trigger: craft, start: 'top 75%', once: true }
      });

      craftTl
        .from(craft.querySelector('.craft__label'), {
          y: 20, autoAlpha: 0, duration: 0.7, ease: EASE_OUT
        })
        .from(craftHeading, {
          y: 36, autoAlpha: 0, duration: 0.95, ease: EASE_POWER4
        }, '-=0.45')
        .from(craft.querySelector('.craft__body'), {
          y: 30, autoAlpha: 0, filter: 'blur(8px)', duration: 0.9, ease: EASE_OUT, clearProps: 'filter'
        }, '-=0.55')
        .from(craft.querySelector('.craft__cta'), {
          y: 20, autoAlpha: 0, scale: 0.92, duration: 0.75, ease: EASE_EXPO
        }, '-=0.45');

      if (craftBg) {
        gsap.fromTo(craftBg, { scale: 1.18 }, {
          scale: 1,
          yPercent: 18,
          ease: 'none',
          scrollTrigger: {
            trigger: craft,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8
          }
        });
      }
    }

    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  function initConnectPageAnimations() {
    var EASE_OUT = 'power3.out';
    var EASE_EXPO = 'expo.out';
    var EASE_POWER4 = 'power4.out';

    var hero = document.querySelector('.connect-hero');
    if (hero) {
      var heroBg = hero.querySelector('.connect-hero__bg img');
      var heroTitle = hero.querySelector('.connect-hero__title');
      var heroLines = prepareLineReveal(heroTitle);
      var heroRule = hero.querySelector('.connect-hero__rule');

      var heroTl = gsap.timeline({ defaults: { ease: EASE_OUT } });
      if (heroRule) heroTl.from(heroRule, { scaleX: 0, duration: 0.85, ease: EASE_POWER4 });
      heroTl
        .from(hero.querySelector('.connect-hero__label'), {
          y: 20, autoAlpha: 0, filter: 'blur(8px)', duration: 0.8, clearProps: 'filter'
        }, '-=0.45')
        .from(heroLines.length ? heroLines : heroTitle, {
          yPercent: 110, autoAlpha: 0, stagger: 0.12, duration: 1, ease: EASE_POWER4
        }, '-=0.5')
        .from(hero.querySelector('.connect-hero__lead'), {
          y: 24, autoAlpha: 0, filter: 'blur(8px)', duration: 0.85, clearProps: 'filter'
        }, '-=0.6');

      if (heroBg) {
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
      gsap.from(intro.querySelector('.connect-intro__text'), {
        y: 36, autoAlpha: 0, filter: 'blur(10px)', duration: 1, ease: EASE_POWER4, clearProps: 'filter',
        scrollTrigger: { trigger: intro, start: 'top 78%', once: true }
      });
      gsap.to(intro.querySelector('.connect-intro__ghost'), {
        y: 30,
        ease: 'none',
        scrollTrigger: { trigger: intro, start: 'top bottom', end: 'bottom top', scrub: 1.4 }
      });
    }

    gsap.from('.connect-path', {
      x: -24, autoAlpha: 0, filter: 'blur(8px)', stagger: 0.12, duration: 0.9, ease: EASE_EXPO, clearProps: 'filter',
      scrollTrigger: { trigger: '.connect-paths', start: 'top 82%', once: true }
    });

    var reach = document.getElementById('connectReach');
    if (reach) {
      gsap.from(reach.querySelectorAll('.connect-reach__details > *'), {
        y: 28, autoAlpha: 0, filter: 'blur(8px)', stagger: 0.1, duration: 0.85, ease: EASE_OUT, clearProps: 'filter',
        scrollTrigger: { trigger: reach, start: 'top 78%', once: true }
      });
      gsap.from(reach.querySelectorAll('.connect-form > *'), {
        y: 32, autoAlpha: 0, filter: 'blur(8px)', stagger: 0.08, duration: 0.8, ease: EASE_OUT, clearProps: 'filter',
        scrollTrigger: { trigger: reach.querySelector('.connect-form'), start: 'top 85%', once: true }
      });
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

  function initPageAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      fallbackScrollReveal();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    var mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: reduce)', function () {
      gsap.set('[data-reveal], .col-piece, .col-piece *, .craft-page, .craft-page *, .connect-page, .connect-page *', { autoAlpha: 1, y: 0, x: 0, clearProps: 'transform,filter' });
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
      } else if (document.querySelector('.col-showcase')) {
        initCollectionPageAnimations();
      } else {
        initInnerPageReveals();
      }
      ScrollTrigger.refresh();
    });
  }

})();
