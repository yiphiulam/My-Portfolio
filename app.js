/* ==========================================================================
   Yuri Yip Portfolio JavaScript Logic - Robust Version
   Includes: Preloader, Custom Cursor, Canvas Waves, GSAP Scroll Trigger,
             Magnetic Buttons, Project Modals, Mobile Menu
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const preloader = document.getElementById('preloader');
  const preloaderBar = document.getElementById('preloader-bar');
  const preloaderPercent = document.getElementById('preloader-percent');
  const preloaderLogo = document.querySelector('.preloader-logo');
  const mainContent = document.getElementById('main-content');

  // ==========================================================================
  // 1. Preloader Logic
  // ==========================================================================
  // Fade logo in first (Defensive check for GSAP)
  if (window.gsap) {
    gsap.to(preloaderLogo, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.2 });
  } else {
    // Fail-safe fallback if GSAP is blocked/offline
    if (preloaderLogo) {
      preloaderLogo.style.opacity = '1';
      preloaderLogo.style.transform = 'translateY(0)';
    }
  }

  let progress = 0;
  const loadDuration = 1500; // 1.5 seconds for a snappy load
  const intervalTime = 20;
  const increment = 100 / (loadDuration / intervalTime);

  const loadingInterval = setInterval(() => {
    progress += increment;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);
      
      // End Loading Animation
      setTimeout(() => {
        // Slide preloader up
        if (preloader) {
          preloader.style.transform = 'translateY(-100%)';
        }
        
        // Init Hero Entrance Animations after preloader slides away
        setTimeout(() => {
          initHeroEntrance();
          if (window.ScrollTrigger) {
            ScrollTrigger.refresh();
          }
        }, 600);
      }, 300);
    }
    
    const displayVal = Math.floor(progress);
    if (preloaderPercent) preloaderPercent.innerText = displayVal;
    if (preloaderBar) preloaderBar.style.width = `${displayVal}%`;
  }, intervalTime);


  // ==========================================================================
  // 2. Custom Inertial Cursor
  // ==========================================================================
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = window.innerWidth / 2;
  let ringY = window.innerHeight / 2;

  // Track mouse coordinates
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Position dot instantly
    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }
  });

  // Smooth lerp (linear interpolation) for cursor ring lag
  function updateCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    
    if (cursorRing) {
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
    }
    
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  // Handle Interactive Hover Elements
  const setupCursorHovers = () => {
    const hoverElements = document.querySelectorAll('a, button, .project-card, .mobile-toggle, .modal-close');
    const marqueeTexts = document.querySelectorAll('.cursor-marquee-text');
    
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (cursorRing) cursorRing.classList.add('cursor-active');
        
        // Custom logic for project cards (Pill Marquee)
        if (el.classList.contains('project-card')) {
          const titleText = 'VIEW PROJECT';
          
          if (cursorRing) cursorRing.classList.add('cursor-project-hover');
          if (marqueeTexts) {
            marqueeTexts.forEach(span => {
               // Repeat text so the marquee fills seamlessly
               span.innerText = `${titleText} \u00A0\u00A0\u00A0 ${titleText} \u00A0\u00A0\u00A0 ${titleText} \u00A0\u00A0\u00A0 ${titleText} \u00A0\u00A0\u00A0 `;
            });
          }
        } else {
          // Standard custom cursor text logic
          const cursorText = el.getAttribute('data-cursor-text');
          if (cursorText && cursorRing) {
            cursorRing.classList.add('cursor-hover-text');
            cursorRing.setAttribute('data-text', cursorText);
          }
        }
      });
      
      el.addEventListener('mouseleave', () => {
        if (cursorRing) {
          cursorRing.classList.remove('cursor-active');
          cursorRing.classList.remove('cursor-hover-text');
          cursorRing.classList.remove('cursor-project-hover');
          cursorRing.removeAttribute('data-text');
        }
      });
    });
  };
  
  setupCursorHovers();




  // ==========================================================================
  // 4. GSAP Scroll Trigger Entrance Animations (with Fallback)
  // ==========================================================================
  
  // Entrance animations for Hero Section
  function initHeroEntrance() {
    if (window.gsap) {
      const tl = gsap.timeline();
      tl.to('.header', { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' })
        .from('.hero-label', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.4')
        .from('.hero-name', { opacity: 0, y: 40, duration: 1, ease: 'power3.out' }, '-=0.6')
        .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.7')
        .from('.hero-quote-wrapper', { opacity: 0, x: -30, duration: 1, ease: 'power3.out' }, '-=0.6')
        .from('.hero-actions', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, '-=0.8');
    } else {
      // Direct CSS fallback if GSAP is blocked
      const headerEl = document.querySelector('.header');
      if (headerEl) {
        headerEl.style.transform = 'translateY(0)';
        headerEl.style.opacity = '1';
      }
      document.querySelectorAll('.reveal-text, .hero-quote-wrapper, .hero-actions').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }
  }

  // Setup scroll trigger reveals if GSAP is loaded
  if (window.gsap && window.ScrollTrigger) {
    try {
      gsap.registerPlugin(ScrollTrigger);

      gsap.utils.toArray('.scroll-reveal').forEach((sec) => {
        gsap.from(sec.querySelector('.section-header'), {
          scrollTrigger: {
            trigger: sec,
            start: 'top 80%',
          },
          opacity: 0,
          y: 40,
          duration: 1,
          ease: 'power3.out'
        });
      });

      if (document.querySelector('.timeline-track')) {
        document.querySelectorAll('.timeline-item').forEach(item => {
          gsap.from(item, {
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
            },
            opacity: 0,
            x: -20,
            duration: 0.8,
            ease: 'power2.out'
          });
        });
      }

      // Add a global load listener to refresh triggers once all images load
      window.addEventListener('load', () => {
        if (window.ScrollTrigger) {
          ScrollTrigger.refresh();
        }
      });

      if (document.querySelector('.contact-grid')) {
        gsap.from('.contact-info-col', {
          scrollTrigger: {
            trigger: '.contact-grid',
            start: 'top 80%',
          },
          opacity: 0,
          x: -40,
          duration: 1,
          ease: 'power3.out'
        });
        
        gsap.from('.contact-form-col', {
          scrollTrigger: {
            trigger: '.contact-grid',
            start: 'top 80%',
          },
          opacity: 0,
          x: 40,
          duration: 1,
          ease: 'power3.out'
        });
      }
    } catch (e) {
      console.warn("ScrollTrigger execution failed, fallback to defaults:", e);
    }
  } else {
    // If GSAP is not loaded, make everything visible immediately
    document.querySelectorAll('.scroll-reveal, .timeline-item, .contact-info-col, .contact-form-col').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  // Intersection Observer for Bento and Project Cards (Resilient Animation)
  const cards = document.querySelectorAll('.bento-card, .project-card');
  if ('IntersectionObserver' in window) {
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          cardObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.05
    });
    
    cards.forEach(card => cardObserver.observe(card));
  } else {
    // Fallback for older browsers
    cards.forEach(card => card.classList.add('in-view'));
  }

  // Active Navigation link updates based on scroll sections
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY || window.pageYOffset;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollPos >= (sectionTop - 150)) {
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


  // ==========================================================================
  // 5. Magnetic Button Hover Effect
  // ==========================================================================
  const magnetics = document.querySelectorAll('.magnetic');
  
  magnetics.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const bound = btn.getBoundingClientRect();
      const x = e.clientX - bound.left - bound.width / 2;
      const y = e.clientY - bound.top - bound.height / 2;
      
      if (window.gsap) {
        gsap.to(btn, {
          x: x * 0.35,
          y: y * 0.35,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      }
    });

    btn.addEventListener('mouseleave', () => {
      if (window.gsap) {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.4)'
        });
      } else {
        btn.style.transform = 'none';
      }
    });
  });


  // ==========================================================================
  // 6. Project Modal Popup Details & Data Map
  // ==========================================================================
  
    const projectData = {
    tax_redesign: {
      title: '台中市地方稅務局網站重設',
      category: 'UI/UX Redesign',
      image: 'assets/tax_redesign.png',
      context: '實習期間為期兩週的精實專案',
      role: 'User Interface Designer | Intern',
      tech: ['Figma', 'Grid Layout', 'Responsive Design', 'Accessibility'],
      desc: '<strong>專案簡介 (Project Brief)</strong><br>' +
            '此專案為實習期間進行之兩週改造計畫。我們受命重設台中市地方稅務局官網的主要頁面：載入頁、首頁及申辦查詢頁。核心目標在於改善無障礙設計、增進使用者體驗、現代化視覺語言並優化多行動裝置的響應性。<br><br>' +
            '<strong>痛點分析 (Problem Statement)</strong><br>' +
            '舊版網站的架構繁雜，且缺乏對使用者申辦進度的友善引引導及無障礙友善設計，既有的視覺編排過於老舊，容易令造訪的使用者感到困惑。同時，缺乏針對核心稅務（如地價稅、使用牌照稅等）的直覺指引，對公共服務體驗造成不便。<br><br>' +
            '<strong>設計成果 (Solution)</strong><br>' +
            '重設後的新介面巧妙將系統功能性與現代美學結合，創造親切且清晰的政府公共服務體驗：<br>' +
            '• <strong>品牌色彩</strong>：運用「橘色（服務熱忱、城市活力）」與「黃色（透明開放、光明未來）」的明快對比。<br>' +
            '• <strong>載入頁</strong>：首創精簡的入口引導，引導使用者依特定稅種和申辦目的快速進入分流下載。<br>' +
            '• <strong>首頁架構</strong>：整合頂部導覽列、快捷圖示服務專區、最新稅務消息看板、多媒體宣導影音區以及完整的線上便民工具，打造一致、系統化的首頁。<br>' +
            '• <strong>申辦頁面</strong>：建立步驟清晰的表格，支援分類篩選並提供一目了然的「送出、下載、追蹤」按鈕，大幅消弭申辦流程的繁瑣阻力。',
      gallery: [
        { src: 'assets/tax_redesign_loading.png', title: '01 / 載入分流頁 (Loading Page)', desc: '提供精確入口，引導使用者依特定稅種（如地價稅、牌照稅）及申辦目的分流。' },
        { src: 'assets/tax_redesign_home.png', title: '02 / 首頁整合重設 (Homepage Redesign)', desc: '重整資訊層次與視覺對比，整合快捷服務、最新消息看板、宣導影音與線上工具。' },
        { src: 'assets/tax_redesign_app.png', title: '03 / 線上申辦進度查詢頁 (Application & Query Page)', desc: '步驟化表單設計，支援多重分類篩選並提供直覺的「送出、下載、追蹤」功能按鈕。' }
      ]
    },
    uxi_agency: {
      title: 'UXI DESIGN 官方網站重設與改版',
      category: 'Web Design & Icons',
      image: 'assets/uxi_agency_icons.png',
      context: 'UXI Design 品牌形象與服務體驗再造',
      role: 'UI Designer Intern',
      tech: ['Figma', 'Iconography', 'Vector Art', 'Brand Guidelines'],
      desc: '<strong>專案簡介 (Project Brief)</strong><br>' +
            '本專案重塑了 UXI DESIGN 整合設計諮詢公司的官方網站，旨在建立其專業的品牌形象、吸引商業潛在客戶並傳遞設計核心價值。設計強調傳遞對使用者的「同理心」，打造觸動人心的端到端服務體驗。<br><br>' +
            '<strong>設計執行 (Execution & Work Involvement)</strong><br>' +
            '設計團隊於專案初期深度參與風格探討。在公司內部針對兩套視覺提案投票後，定案以靈動的不規則漸變圖形及流暢導覽作為主視覺方向。網站劃分為首頁、精選案例、關於 UXI DESIGN、服務項目、設計洞察及聯絡我們等板塊。<br><br>' +
            '我主要負責<strong>「設計洞察 (Design Insights)」</strong>板塊的 UI 頁面設計，並為改版後的官網設計與繪製了全套核心 icons。成功突出了品牌可信度與客戶至上的設計思維。',
      gallery: [
        { src: 'assets/uxi_agency.png', title: '01 / UXI DESIGN 官方形象與品牌識別標誌 (Official Brand Identity)', desc: '展示 UXI DESIGN 重新設計之紅底白字品牌形象識別標誌與視覺載體應用。' },
        { src: 'assets/uxi_agency_mockup.png', title: '02 / 設計洞察 (Design Insights) 頁面與視覺提案', desc: '融入品牌同理心設計語彙，結合不規則漸變與流暢版面，加深客戶信任度。' }
      ]
    },
    hkt_redesign: {
      title: 'HKT Teleservices 官網重設',
      category: 'Web Design',
      image: 'assets/hkt_redesign_detail2.png',
      context: 'HKT Teleservices 品牌網站改版',
      role: 'Web UI Designer',
      tech: ['Figma', 'Web Layout', 'Brand Strategy', 'Visual Identity'],
      desc: '<strong>專案簡介 (Project Brief)</strong><br>' +
            '本專案為 HKT Teleservices 官方網站進行視覺與結構重設，旨在打造創新、充滿活力且乾淨的視覺美學，展現其全球化顧客關係管理與商業流程委外（BPO）的領先定位。<br><br>' +
            '<strong>設計執行 (Execution)</strong><br>' +
            '• <strong>視覺重塑</strong>：導入活潑且富有現代感的不規則漸變形狀與流暢的曲線設計，直覺呼應企業核心精神。<br>' +
            '• <strong>色彩體系</strong>：採用白色與高雅的冷灰色調作為主基調，呈現洗練與高科技的現代質感。<br>' +
            '• <strong>架構優化</strong>：重整原本擁擠、零散且缺乏系統性導覽的舊版介面，建立一致的設計系統，全方位提升跨平台互動易用性與品牌美感，吸引年輕群體與商業潛在客戶。',
      gallery: [
        { src: 'assets/hkt_redesign_detail1.jpg', title: '首頁主視覺佈局', desc: '結合漸變圖形，提升視覺亮點並優化品牌認同度。' },
        { src: 'assets/hkt_redesign_detail2.png', title: '細部功能與板塊引導', desc: '系統化排版，強化核心商業服務介紹與資訊階層。' }
      ]
    },
        weather_app: {
      title: '天氣預報 App 設計',
      category: 'Mobile App Design',
      image: 'assets/weather_app_main.png',
      context: '天氣預報 App 介面重設專案',
      role: 'UI/UX Designer',
      tech: ['Figma', 'UI/UX Design', 'User Interface', 'Mobile App'],
      desc: '<strong>設計概述 (Project Brief)</strong><br>' +
            '本專案旨在重新設計現有的天氣預報 App 介面。針對一般大眾而言，許多現有天氣軟體的資訊呈現過於繁雜，導致使用者難以快速獲取核心氣象資訊。因此，本設計對複雜的系統與功能進行了大幅度的簡化，將最關鍵的天氣資訊（如即時溫度、降雨機率、即時警告）置於首頁最顯眼處，提供直覺且易用的操作體驗。<br><br>' +
            '<strong>設計執行 (Execution & Usability)</strong><br>' +
            '• <strong>主頁面簡化</strong>：將即時天氣狀態、目前溫度、體感溫度與當日降雨預測進行整合，使用戶一目了然。<br>' +
            '• <strong>警告通知整合</strong>：在首頁置入顯眼的「天氣提醒」下拉選單，自動整合酷熱天氣、強烈季候風、黃色暴雨等各類氣象警告，提升防災警覺。<br>' +
            '• <strong>多城市與預報</strong>：直覺的左右滑動切換或多城市清單，並搭配圖形化的七天溫度走勢與簡潔的風向儀面板。<br>' +
            '• <strong>客製化通知設定</strong>：側邊欄選單提供高度客製化的通知設定，使用者可自由選擇開啟或關閉自動定位、七天天氣預報、日出日落、颱風或地震警報等。',
      gallery: [
        { src: 'assets/weather_app_detail1.png', title: '01 / 天氣預報 App 主介面與氣象警告狀態', desc: '展示香港地區的即時溫度（27°C）、感體溫度、降雨機率預估，以及酷熱天氣、強烈季候風、黃色暴雨等即時警告下拉選單。' },
        { src: 'assets/weather_app_detail2.png', title: '02 / 多城市天氣與七天預報介面', desc: '包含台北市與香港的即時天氣切換，以及簡潔的一週（七天）溫度區間與天氣趨勢預報。' },
        { src: 'assets/weather_app_detail3.png', title: '03 / 側邊欄選單與詳細通知設定', desc: '展示包含天氣資訊、通知設定、重要公告、使用說明等的側邊導覽選單，以及自動定位、警特報（地震/颱風/熱帶低壓特報）等開關設定。' },
        { src: 'assets/weather_app_detail4.png', title: '04 / 氣象圖標與視覺元件集', desc: '精心設計的一整套天氣視覺圖標，包含晴天、多雲、陰天、雨天、打雷、降雪等各種氣象狀態的圖示組。' }
      ]
    },
    water_app: {
      title: '省水智慧 App 設計 (SDG 6/12/13)',
      category: 'Mobile App Design',
      image: 'assets/water_app_details.png',
      context: '聯合國永續發展指標學術專案',
      role: 'Interaction Designer',
      tech: ['Figma', 'User Research', 'Interactive Prototype', 'SDG Indicators'],
      sdgs: [
        'assets/sdg_6.png',
        'assets/sdg_12.png',
        'assets/sdg_13.png'
      ],
      desc: '<strong>設計概念 (Design Concept)</strong><br>' +
            '本專案旨在設計一款幫助家庭監測與管理日常用水的行動 App，推動水資源節約並降低不必要的水費支出。許多家庭對每日的實質耗水毫無概念，且容易忽視高耗水家電的影響。此 App 讓使用者可即時追蹤水資源消耗、識別異常耗水來源並建立永續的用水習慣。符合聯合國永續發展指標 SDG 6（乾淨水質與衛生）與 SDG 12（責任消費與生產）。<br><br>' +
            '<strong>設計美學 (Design & Usability)</strong><br>' +
            'App 的標誌與介面主打極簡與高可用性。圖示設計上，水滴象徵用水量，波浪象徵省水措施成效，錢幣符號則指代水費估算功能。採用象徵純淨與永續的藍、白二色，營造簡潔易用的視覺氛圍。<br><br>' +
            '<strong>核心功能 (Key Features)</strong><br>' +
            '• 針對特定家電及家庭整體用水的<strong>即時追蹤</strong>功能。<br>' +
            '• 基於目前用水模式的<strong>水費預估</strong>功能。<br>' +
            '• 提供個性化的<strong>省水任務與提醒</strong>，培養省水自律習慣。',
      gallery: [
        { src: 'assets/water_app_ui_mockup.png', title: '01 / 省水智慧 App 介面設計與耗電/水量分析', desc: '包含登入頁面、主控制面板、UV洗菜機控制模組與耗電量/用水量統計分析圖表，展示完整的產品互動流程。' }
      ]
    },
    marketing_ads: {
      title: 'Facebook 廣告與行銷數據分析',
      category: 'Digital Marketing',
      image: 'assets/marketing_ads_new.png',
      context: '品牌社群投放與成效優化專案',
      role: 'Marketing Analyst & Designer',
      tech: ['Facebook Ads Manager', 'A/B Testing', 'Ad Design', 'Data Analytics'],
      desc: '<strong>廣告策略 (Why Social Media Ads?)</strong><br>' +
            'Facebook 廣告是數位行銷中不可或缺的精準媒介。藉由平台的強大數據分析，能精準依據目標受眾的興趣、行為、地理位置和人口統計特徵，進行客製化廣告推送。我們在此專案中以臉書廣告為主體，設計多組視覺吸睛、痛點明確的廣告圖文。<br><br>' +
            '<strong>數據驅動與成效 (Data-Driven Optimizations)</strong><br>' +
            '除了廣告視覺設計外，行銷的核心在於數據的反饋與監控：<br>' +
            '• <strong>指標監控</strong>：持續追蹤廣告點擊率（CTR）、曝光數（Impressions）與轉換率（Conversion Rate）。<br>' +
            '• <strong>轉換提升</strong>：根據實時回傳的數據，即時優化與調整受眾定位及視覺素材，藉由 A/B testing 實現更高的 ROI 轉換價值。<br>' +
            '• <strong>行銷優化</strong>：有效率且精確地調整行銷方向，最大化品牌的投資回報率並提高轉換效能。',
      gallery: [
        { src: 'assets/marketing_ads.png', title: '01 / 原始投放與數據分析圖表 (Original Ad Performance Data)', desc: '品牌實際投放之點擊率 (CTR) 及轉換率分析數據看版，展示 A/B 測試實時數據反饋。' },
        { src: 'assets/marketing_ads_facebook_post.png', title: '02 / Facebook 熱門廣告文案與視覺設計', desc: '新北捷運 A3 站「本格明水」六級耐震建案之 Facebook 實體社群投放廣告與互動設計。' },
        { src: 'assets/marketing_ads_manager_results.png', title: '03 / Facebook 廣告投放成效與關鍵數據', desc: '後台數據顯示單日高覆蓋率與精準連結點擊次數，評估單次轉換成本。' },
        { src: 'assets/marketing_ads_target_audience.png', title: '04 / 編輯目標對象與區域精準投放', desc: '鎖定大台北地區特定座標進行半徑範圍覆蓋投放，最大化行銷預算效能。' },
        { src: 'assets/marketing_ads_visual_designs.jpg', title: '05 / Facebook 廣告創意與視覺設計提案', desc: '包括燙金店面宣傳、國際地產大獎肯定、生活圈與轉運站配套、以及結構耐震與防水保固等四組社群廣告視覺設計圖。' }
      ]
    },
    marketing_shortvideo: {
      title: 'Genuine Minzui 社群短影音行銷',
      category: 'Video Marketing',
      image: 'assets/marketing_shortvideo_detail1.png',
      context: '社群短影音擴散與品牌生態系建構',
      role: 'Video Content Creator & Analyst',
      tech: ['CapCut', 'TikTok Ads', 'Content Strategy', 'Engagement Metrics'],
      desc: '<strong>行銷概念 (Why Short Videos?)</strong><br>' +
            '短影音已成為當今數位行銷中最具影響力的利器之一。現代消費者偏好快速、易消化且具娛樂性的內容。短影音能在短短數秒內有效傳達品牌理念、產品特色或故事張力。<br><br>' +
            '<strong>行銷成果 (Marketing Ecosystem)</strong><br>' +
            '• <strong>吸引破碎注意力</strong>：切合行動裝置與碎片化時間的閱聽習慣，快速引發情感共鳴，引導閱聽者點擊連結、分享內容或進行購買。<br>' +
            '• <strong>生態系整合</strong>：將短影音與臉書廣告、社群互動相整合，構建多管齊下的全方位數位行銷策略，最大化宣傳效益。',
      gallery: [
        { src: 'assets/marketing_shortvideo_detail2.png', title: '01 / 短影音視覺畫面與字幕剪輯 (Video Edit & Captions)', desc: '精心排版的手機直式短影音畫面，突出吸睛字幕與動態節奏。' },
        { src: 'assets/marketing_ads_shortvideo.png', title: '02 / 短影音作品 QR Code A (Scan to Watch)', desc: '掃描二維碼即可於線上直接觀看第一支實際發佈之社群短影音創作。' },
        { src: 'assets/marketing_shortvideo_detail3.png', title: '03 / 短影音作品 QR Code B (Scan to Watch)', desc: '掃描二維碼即可於線上直接觀看第二支實際發佈之社群短影音創作。' }
      ]
    },
    poster_consumption: {
      title: '永續消費與生產海報 (SDG 12)',
      category: 'Graphic Design',
      image: 'assets/poster_responsible_consumption.png',
      context: '永續發展與社會宣傳海報設計',
      role: 'Graphic Designer',
      tech: ['Illustrator', 'Poster Layout', 'Color Theory', 'SDGs Strategy'],
      sdgs: [
        'assets/sdg_12.png'
      ],
      desc: '<strong>設計理念 (Design Concept)</strong><br>' +
            '本海報專案專注於聯合國永續發展指標 SDG 12（責任消費與生產），旨在喚起社會大眾對資源節約與永續生活方式的重視。<br><br>' +
            '<strong>視覺與設計執行</strong><br>' +
            '設計融合了鮮明大膽的排版語彙與現代漸變色塊，使嚴肅的社會永續議題轉化為具視覺張力且易於引起共鳴的設計海報，在公共空間中發揮強烈的視覺引導與記憶效果。'
    },
        poster_minzui: {
      title: '「本格明水」建案海報設計',
      category: 'Graphic Design',
      image: 'assets/poster_minzui_main.jpg',
      context: '「本格明水」房地產建案宣傳海報與實體展示',
      role: 'Graphic Designer & Brand Designer',
      tech: ['Illustrator', 'Photoshop', 'Brand Strategy', 'Print Layout'],
      desc: '<strong>設計概念 (Design Concept)</strong><br>' +
            '本專案為新北市新莊區精品住宅建案「本格明水」設計的系列宣傳海報。海報設計結合了極簡現代美學與高端地產定位，第一款以新北產業園區站 A3 捷運地標、六級耐震結構以及室內空間（臥室、廚房、衛浴）實景照片為核心；第二款則以公共大廳的雅致裝潢實景、嚴謹施工工法與歷年國際獲獎榮譽（英國IPA房產大獎、法國設計獎、MUSE設計獎等）為主軸，傳遞建案的極致品質與美學生活。<br><br>' +
            '<strong>設計執行 (Execution & Typography)</strong><br>' +
            '• <strong>視覺層次與排版</strong>：採用深藍色與土褐色作為主色調，金色文字點綴其間，營造高端、沉穩的尊榮感。文字排版使用大氣的粗體標題與規整的細體規格說明，建立清晰的視覺階層。<br>' +
            '• <strong>資訊與圖表設計</strong>：將複雜的建材規格（#11號鋼筋、SA級續接器、力泰混凝土等）與廚衛品牌（DAIKIN、Panasonic、hansgrohe 等）以簡潔的圖標與文字排列，讓消費者能一目了然獲取核心價值。<br>' +
            '• <strong>實體樣機呈現</strong>：特別製作實體樣機（Mockup）展示，將海報呈現於真實的紙張與印刷質地中，展示最終的宣傳張力。',
      gallery: [
        { src: 'assets/poster_minzui_detail1.jpg', title: '01 / 「本格明水」建案特色海報', desc: '聚焦於新北產業園區站 A3 地標、六級耐震規格、混凝土與連續壁強度，並搭配臥室、廚房與衛浴的室內實景圖。' },
        { src: 'assets/poster_minzui_detail2.jpg', title: '02 / 「本格明水」施工品質與獲獎海報', desc: '展現大廳公設的雅致景觀、嚴謹的防水與結構保固承諾、廚衛知名品牌列表以及國際地產大獎的獲獎榮譽。' }
      ]
    },
    fellowship_graphics: {
      title: '大專團契與社團視覺設計集',
      category: 'Graphic Design',
      image: 'assets/fellowship_graphics_main.jpg',
      context: '大專基督徒團契與社團宣傳海報、傳單及社群卡片',
      role: 'Graphic Designer & Illustrator',
      tech: ['Illustrator', 'Photoshop', 'Visual Layout', 'Illustration'],
      desc: '<strong>設計概念 (Design Concept)</strong><br>' +
            '本專案為大專基督徒團契、聖經研究社與光鹽唱詩社設計的宣傳視覺包，包含學術講座海報、靈修福音傳單以及社群宣傳小卡。設計旨在以溫馨、平易近人的插畫風格與清晰的排版，打破宗教活動的傳統嚴肅刻板印象，吸引更多大學生參與社團與座談會。<br><br>' +
            '<strong>設計執行 (Execution & Layout)</strong><br>' +
            '• <strong>學術聖經講座海報</strong>：針對「沒有指引 怎能明白？」專題講座，設計掛畫展示海報。主體以開啟的聖經、翱翔的白鴿以及耶穌手繪插畫相結合，搭配溫暖漸層的天空背景與端莊的標題粗體字，傳遞求知與平安的意象。<br>' +
            '• <strong>「安穩的住處」福音宣傳摺頁</strong>：排版採用左右雙欄佈局，左欄探討在動盪世局中的人心尋求，右欄藉由聖經經文給予安慰。搭配溫馨的耶穌抱羊卡通插圖，建立親切、療癒的視覺基調。<br>' +
            '• <strong>社群宣傳小卡設計</strong>：包含「聖經研究社期末社遊」與「光鹽唱詩社社課（福音小排）」兩款 1:1 社群正方形卡片。採用活潑的手繪山林、行李箱與美食插圖，搭配對比鮮明的黃色與粉橘色塊，極適合在 Instagram 與 LINE 群組中傳播發送。',
      gallery: [
        { src: 'assets/fellowship_graphics_detail1.jpg', title: '01 / 「沒有指引 怎能明白？」聖經講座宣傳海報', desc: '講座活動平面海報，結合手繪耶穌與白鴿插圖，排版清晰且具備極佳的資訊傳達度。' },
        { src: 'assets/fellowship_graphics_detail2.jpg', title: '02 / 「安穩的住處」福音傳單摺頁', desc: '精緻的宣傳單頁，雙欄排版與手繪插圖，提供舒適流暢的文字閱讀動線。' },
        { src: 'assets/fellowship_graphics_detail3.jpg', title: '03 / 聖經研究社期末社遊社群卡片', desc: '以手繪高山與行李箱為元素的 1:1 社群推廣小卡，營造令人嚮往的社遊氛圍。' },
        { src: 'assets/fellowship_graphics_detail4.jpg', title: '04 / 光鹽唱詩社福音小排社群卡片', desc: '以美食翻炒與美味餐點為插圖的社群宣傳卡，宣傳小排聚餐與歡唱詩歌活動。' },
        { src: 'assets/fellowship_graphics_detail5.jpg', title: '05 / 團契社群小卡實物樣機 Mockup', desc: '展示兩款正方形社群宣傳小卡印刷於厚卡紙上的實物擺樣，呈現簡約文青的質感。' }
      ]
    },
    spa_poster: {
      title: 'MMMM SPA 週年慶宣傳海報設計',
      category: 'Graphic Design',
      image: 'assets/spa_poster_main.jpg',
      context: 'MMMM SPA 護理中心週年慶優惠宣傳海報與實體展示',
      role: 'Graphic Designer & Layout Designer',
      tech: ['Illustrator', 'Photoshop', 'Print Layout', 'Visual Marketing'],
      desc: '<strong>設計概念 (Design Concept)</strong><br>' +
            '本專案為高端美容護理中心「MMMM SPA」設計的週年慶優惠宣傳海報。海報設計旨在傳遞放鬆、舒適與奢華的護理體驗。採用柔和溫慢的大地色與玫瑰金作為主色調，主體視覺配置了三張精緻的護理實景照片（臉部護理、背部精油按摩與頭部釋壓），傳達專業與細緻的服務品質。標題「SPA保養 週年慶優惠方案」使用優雅的襯線字體（Serif），增添高貴的品牌質感。<br><br>' +
            '<strong>設計執行 (Execution & Layout)</strong><br>' +
            '• <strong>視覺層次與字體排版</strong>：排版強調簡潔與平衡。下半部將六大限定課程（臉部RF緊緻拉提、七彩LED光子保養、植萃薰衣草保養、腿部排水體刷、上背精油按摩、暖宮溫罐頭療）以清晰的兩欄列表排列，搭配溫馨的手繪細線太陽光芒背景，營造療癒與舒心的視覺體驗。<br>' +
            '• <strong>價格與呼籲行動（CTA）</strong>：以圓角矩形突出「$10000 NTD」的價格亮點，並在左下角配置「馬上預約」按鈕與精確的服務地址（台中市博館路），建立完整的視覺焦點引導。<br>' +
            '• <strong>實體樣機呈現</strong>：特別製作實體掛畫樣機（Mockup）展示，將海報呈現於真實的紙張、懸掛掛軸與陰影折射中，展現最終在實體店面櫥窗或室內裝飾中的精緻宣傳張力。',
      gallery: [
        { src: 'assets/spa_poster_detail1.jpg', title: '01 / 「MMMM SPA」週年慶優惠海報平面配置', desc: '高解析度的海報平面設計圖，展示優雅的襯線字體設計、溫暖柔和的玫瑰金色彩搭配、三欄式實景照片與底部清晰的限定課程列表。' }
      ]
    },
    logo_taoyuan: {
      title: '桃園市徽標誌重設',
      category: 'Logo Design',
      image: 'assets/logo_taoyuan.png',
      context: '城市視覺形象再造設計',
      role: 'Brand Designer',
      tech: ['Illustrator', 'Brand Identity', 'Geometric Construction'],
      desc: '<strong>設計理念 (Design Concept)</strong><br>' +
            '本專案針對桃園市市徽進行現代化的重設計畫。市徽重新演繹了桃園充滿活力與多元包容的都市精神。幾何「T」字造型既代表桃園 (Taoyuan)，也象徵著匯聚與交通樞紐。<br><br>' +
            '<strong>色彩隱喻 (Color Theory)</strong><br>' +
            '• <strong>橘色</strong>：象徵桃園市民的熱情與城市的無限生機。<br>' +
            '• <strong>黃色</strong>：展現對未來的樂觀期待與透明開放。<br>' +
            '• <strong>綠色</strong>：體現城市永續綠能與豐富的自然生態。<br>' +
            '• <strong>藍色</strong>：指代科技創新與智慧大門的開啟。<br>' +
            '整體十字交叉設計傳達了桃園作為商業與交通網絡核心的戰略地位，象徵著不同背景文化在桃園這片土地的包容共榮。',
      gallery: [
        { src: 'assets/logo_taoyuan_detail.png', title: '幾何結構與色塊配置', desc: '以黃、橘、綠、藍幾何色塊相互交織，詮釋桃園作為多元樞紐的交界隱喻。' }
      ]
    },
    logo_collection: {
      title: '品牌 Logo 與標誌設計集',
      category: 'Logo Design',
      image: 'assets/logo_daily_gradient.png',
      context: '個人原創品牌識別設計',
      role: 'Brand Designer',
      tech: ['Illustrator', 'Typography', 'Visual Identity'],
      desc: '<strong>專案簡介 (Project Brief)</strong><br>' +
            '本作品集收錄了多款針對不同虛擬與實體品牌所作的 Logo 與商標識別設計，展現對字體造型與品牌定位的綜合把控能力。<br><br>' +
            '<strong>精選商標說明</strong><br>' +
            '• <strong>Daily Gradient</strong>：核心概念源於「生活中細微的變化往往如同色彩漸變般，使生活更加豐盈」。字體結構融合圓形與矩形幾何，輔以粉白漸變，呈現純淨極簡的美感。<br>' +
            '• <strong>天府食堂 (Tianfu Canteen)</strong>：專為餐飲品牌設計，字體傳遞出溫馨與人情味。<br>' +
            '• <strong>BETRUE / Prince of patisserie / Medical</strong>：分別針對生活風格、法式甜點與醫學專業品牌進行客製化字型與標誌設計，以精確的視覺語言傳遞品牌價值。',
      gallery: [
        { src: 'assets/logo_daily_gradient_detail.png', title: 'Daily Gradient 品牌視覺延伸', desc: '展示漸變幾何圖形在海報與產品包裝上的排版應用。' },
        { src: 'assets/logo_tianfu.png', title: '天府食堂 (Tianfu Canteen) 標誌設計', desc: '融合傳統與現代排版，展現精緻、溫慢的餐飲定位。' },
        { src: 'assets/logo_betrue.png', title: 'BETRUE / Prince of patisserie 品牌標誌', desc: '運用法式線條與簡約無襯線排版，演繹品牌核心精神。' }
      ]
    },
    magazine_wolfs: {
      title: '雜誌排版 - 歌手「五堅情」',
      category: 'Editorial Design',
      image: 'assets/magazine_wolfs_v3.png',
      context: '流行文化雜誌編排與排版練習',
      role: 'Editorial Designer',
      tech: ['InDesign', 'Grid Systems', 'Typography Layout'],
      desc: '<strong>設計理念 (Design Concept)</strong><br>' +
            '本專案為針對台灣知名男子偶像團體「五堅情 (WOLFS)」進行的雜誌專題頁面編排設計。旨在結合流行音樂人的獨特個性，打造具備視覺衝擊力與舒適閱讀節奏的網格佈局。<br><br>' +
            '<strong>設計亮點</strong><br>' +
            '大膽運用字體字重變化，靈活的文字框組合以及精確的多欄排版系統，讓影像與文字在空間中產生流暢的對話，增強時尚與雜誌的感官層次。',
      gallery: [
        { src: 'assets/magazine_wolfs_v3.png', title: '01 / 歌手「五堅情」雜誌跨頁設計封面與內頁', desc: '展示流行歌手「五堅情」網格佈局與文字排版，結合靈活的網格與欄位設計。' }
      ]
    },
    magazine_japan: {
      title: '雜誌排版 - 日本建築特色',
      category: 'Editorial Design',
      image: 'assets/magazine_japan_building.png',
      context: '建築專題 Editorial 編排設計',
      role: 'Editorial Designer',
      tech: ['InDesign', 'Grid Layout', 'Architectural Photo Editorial'],
      desc: '<strong>設計概念 (Design Concept)</strong><br>' +
            '此專案針對「日本建築 (Japan Building)」進行雜誌版面編排。排版吸取了日本建築結構的「留白 (Ma)」與「線條感」特質。<br><br>' +
            '<strong>設計執行</strong><br>' +
            '追求乾淨、洗練的排版架構，刻意放寬行高與邊界，將視覺重心留給宏偉的建築影像。透過無襯線標題與幾何區塊，烘托出日本傳統與現代交融的結構美感。',
      gallery: [
        { src: 'assets/magazine_japan_building.png', title: '01 / 日本建築專題雜誌內頁編排 (Japan Architecture Editorial Spreads)', desc: '雜誌內頁中，結合日本現代建築寫真與留白線條結構之多欄編排設計。' }
      ]
    },
    magazine_art: {
      title: '當代工藝雜誌排版',
      category: 'Editorial Design',
      image: 'assets/magazine_art.png',
      context: '當代工藝專題雜誌設計',
      role: 'Editorial Designer',
      tech: ['InDesign', 'Grid Layout', 'Editorial Layout', 'Typography'],
      desc: '<strong>設計理念 (Design Concept)</strong><br>' +
            '本專案為針對「當代工藝 (Contemporary Craft)」進行之雜誌專案頁面編排設計。旨在透過精緻的排版與影像組合，呈現傳統工藝在現代美學視角下的獨特張力。<br><br>' +
            '<strong>設計特色</strong><br>' +
            '採用嚴謹而具彈性的網格系統（Grid System），精確規範圖文版面率。透過現代無襯線字體與大膽的留白設計，強調工藝品本身的手作溫度與細節結構。影像與文字的交錯排列引導讀者進行深度的視覺閱讀，展現簡約、精緻且具深度的工藝文化質感。',
      gallery: [
        { src: 'assets/magazine_art_detail1.png', title: '01 / 當代工藝主題雜誌內頁編排 (Contemporary Craft Editorial Layout)', desc: '雜誌內頁展示，結合工藝品精細特寫影像與流暢的文字網格排版設計，彰顯手工藝的細節與溫度。' }
      ]
    },
    lonely_island: {
      title: '《孤島》MV 創作與自我探索',
      category: 'Video Editing',
      image: 'assets/lonely_island.png',
      context: '獨立短片與 MV 視覺創作',
      role: 'MV Director & Video Editor',
      tech: ['Video Editing', 'Premiere Pro', 'Storyboarding', 'Visual Rhythm'],
      desc: '<strong>影片概念 (MV Concept)</strong><br>' +
            '「生活不是完全可怕的，但總有困惑 and 微小的失望。」<br><br>' +
            '<strong>自我對話與都市孤獨 (Lonely Island)</strong><br>' +
            '生活在資訊繁雜、社交標籤化的現代都市中，人們往往習慣隱藏在人群的陰影之下，戴上虛假的面具掩蓋內心的疲憊。本影片以詩意的畫面與文字，探討欲望與現實間的拉扯，引導讀者卸下防備，傾聽心底的聲音，開啟一段探尋真實自我的旅程。<br><br>' +
            '<strong>設計亮點</strong><br>' +
            '藉由意象式的剪輯手法與色彩對比，呈現現代人在標籤社會中的面具社交與內心孤獨。影片結合強烈的冷色調與溫慢黃光交織，烘托自我對話的情感深度。',
      gallery: [
        { src: 'assets/lonely_island_mv_details.png', title: '01 / 《孤島》MV 剪輯與畫面細節', desc: '展示《孤島》MV 的剪輯分鏡與多角度畫面，呈現都市寂靜與自我對話的視覺張力。' }
      ]
    },
    children_book: {
      title: '兒童繪本設計',
      category: 'Book Design',
      image: 'assets/children_book_main.png',
      context: '聯合國永續發展指標學術專案',
      role: 'Illustrator & Storywriter',
      tech: ['Digital Painting', 'Storyboarding', 'Editorial Layout', 'SDGs Strategy'],
      desc: '<strong>專案簡介 (Project Brief)</strong><br>' +
            '本繪本專案旨在以溫暖、療癒的視覺插畫，傳遞家庭陪伴與心理健康的關懷。符合聯合國永續發展指標之健康與福祉理念。<br><br>' +
            '<strong>繪本故事大綱 (Akiko\'s Family)</strong><br>' +
            'The story follows Akiko\'s family. Akiko’s father is away for work, leaving her mother to handle everything at home while also managing her job. With little time to rest, her mother’s health gradually deteriorates, yet she continues without taking a break. Eventually, one day, she collapses from exhaustion. Akiko is at a loss and doesn’t know what to do. Thankfully, her father rushes back home and takes her mother to the hospital. After an examination, the doctor diagnoses her with chronic fatigue. Following this event, Akiko\'s mother begins to prioritize her health. From then on, Akiko’s family lives happily together.',
      gallery: [
        { src: 'assets/children_book_detail.png', title: '01 / 兒童繪本內頁設計與故事插圖', desc: '繪本內頁插圖，刻畫家庭成員間的情感拉扯與健康平衡的心路歷程。' }
      ]
    },
    package_design: {
      title: '紙質燈泡包裝創新結構',
      category: 'Package Design',
      image: 'assets/package_lightbulb.png',
      context: '環保與創新結構包裝設計',
      role: 'Structural Package Designer',
      tech: ['Structural Layout', 'Folding Design', 'Paper Prototyping'],
      desc: '<strong>設計概念 (Design Concept)</strong><br>' +
            '本案設計了一款完全不使用塑膠、僅採用紙板一體摺疊成型的創新環保燈泡包裝結構。<br><br>' +
            '<strong>結構創新 (Structural Features)</strong><br>' +
            '• <strong>打孔底座 (Base with Holes)</strong>：底座部分設有精準的孔洞，可以穩固卡入燈泡底座或連接部件，提供支撐並利於空氣對流散熱。<br>' +
            '• <strong>摺疊防護翼 (Folding Wings)</strong>：側翼翼片採用向內折疊的幾何結構。組裝時，側翼鎖合可以增加包裝的結構剛性，防止外部衝擊擠壓變形，無需任何膠水即能將脆弱的玻璃燈泡緊密、安全地鎖定在包裝內部。',
      gallery: [
        { src: 'assets/package_lightbulb_detail1.png', title: '包裝平面展開與折線圖', desc: '展示無膠一體成型的環保折線與打孔卡位構造設計。' },
        { src: 'assets/package_lightbulb_detail2.jpg', title: '包裝摺疊裝配實物樣機', desc: '折疊鎖合後的實體效果，展現極簡且兼顧防撞剛性的包裝外觀。' }
      ]
    },
    modeling_livingroom: {
      title: '3D 室內建模 - 現代客廳',
      category: '3D Modeling',
      image: 'assets/modeling_livingroom.png',
      context: 'Blender 擬真室內空間建模',
      role: '3D Environment Modeler',
      tech: ['Blender', 'Lighting Rendering', 'Texture Mapping'],
      desc: '<strong>專案簡介 (Project Brief)</strong><br>' +
            '本專案使用 Blender 進行擬真現代客廳 (Modern Living Room) 的 3D 建置與渲染。旨在探索精細材質貼圖與擬真光源投射對空間氛圍的形塑。<br><br>' +
            '<strong>設計執行 (Execution)</strong><br>' +
            '合理配置沙發、茶几、地毯與綠植等室內陳設，並進行精確的紋理貼圖映射。運用漫反射與聚光燈等光源模擬日光穿透百葉窗射入室內的自然光影，呈現極具現代簡約質感的空間層次與視覺深度。',
      gallery: [
        { src: 'assets/modeling_livingroom_detail1.jpg', title: '01 / Blender 現代客廳 3D 渲染圖', desc: '展示客廳的等距視角（Isometric View）渲染，包含木質牆面、懸空電視櫃、L型布藝沙發、落地燈以及大片採光落地窗，呈現現代簡約風格。' }
      ]
    },
    building_model: {
      title: '3D 建模與 Blender 動畫創作',
      category: '3D Animation & Modeling',
      image: 'assets/building_model_blender.png',
      context: 'Blender 綜合 3D 場景與短片創作',
      role: '3D Modeler & Animator',
      tech: ['Blender', '3D Modeling', 'Character Animation'],
      desc: '<strong>專案簡介 (Project Brief)</strong><br>' +
            'Exploring the features of Blender, I designed several models, with a 3D animation on the left and a modeling prototype on the right. This experience gave me a strong sense of accomplishment.<br><br>' +
            '<strong>設計與執行</strong><br>' +
            '深入探索 Blender 的多樣化建模與動畫工具，設計了多款富有趣味性與探索感的 3D 模型與幾何場景。網頁版面上，左側配置了極富故事性的 3D 渲染動畫，右側則搭配了白模原型，呈現出完整的從無到有的建模歷程。',
      gallery: [
        { src: 'assets/building_model_blender.png', title: '01 / Blender 建模視圖與網格構造 (Blender Modeling Wireframe)', desc: '展示 3D 原型建模網格、結構佈線與三維建模視圖。' },
        { src: 'assets/building_model_qrcode.png', title: '02 / Blender 建模動畫作品 QR Code (Scan to Watch)', desc: '掃描二維碼即可於線上直接播放 3D 渲染與建模動畫創作展示短片。' }
      ]
    },
            photography: {
      title: '攝影作品集',
      category: 'Photography',
      image: 'assets/photography_main.jpg',
      context: '日本藝術祭與空間攝影專題',
      role: 'Photographer',
      tech: ['Sony Alpha', 'Lightroom', 'Composition', 'Visual Storytelling'],
      desc: '<strong>攝影概念 (Photography Concept)</strong><br>' +
            '本專案為日本直島（Naoshima）藝術祭、小豆島（Shodoshima）及京都/岡山等地的攝影專題集。透過相機鏡頭記錄安藤忠雄清水混凝土建築的幾何光影，與草間彌生著名的黃色南瓜在瀨戶內海畔的靜謐對話，並走訪古剎與庭園，展現空間、自然與人文藝術的融合。<br><br>' +
            '<strong>攝影執行 (Themes & Execution)</strong><br>' +
            '• <strong>地景藝術與空間幾何</strong>：記錄瀨戶內海畔的藝術裝置，與地中美術館內清水混凝土牆面與幾何光影的極致美感。<br>' +
            '• <strong>自然與日常人文</strong>：透過小豆島橄欖園的綠葉、瀨戶內海懸崖的展翅飛鳥及大自然環境，探討人與環境的和諧。<br>' +
            '• <strong>歷史古剎與祈福文化</strong>：記錄京都清水寺、勝尾寺的紅色鳥居、三重塔及無數祈福達摩玩偶，展現濃厚的日式宗教禪意與規律之美。',
      gallery: [
        { src: 'assets/photography_detail1.jpg', title: '01 / 直島海岸線與松樹景緻', desc: '捕捉瀨戶內海畔的青翠松樹與遠方的海港，呈現自然與人文建築的邊界。' },
        { src: 'assets/photography_detail2.jpg', title: '02 / 地中美術館清水混凝土建築結構', desc: '展示安藤忠雄設計的地中美術館中，冷冽清水混凝土牆面與幾何梯級交錯的空間感。' },
        { src: 'assets/photography_detail3.jpg', title: '03 / Bruce Nauman 霓虹燈裝置藝術', desc: '近距離捕捉《Live and Die》霓虹裝置在暗處閃爍的繽紛文字色彩，與混凝土背景形成強烈反差。' },
        { src: 'assets/photography_detail4.jpg', title: '04 / 地中美術館地下採光中庭', desc: '俯瞰地下天井的幾何線條，底部種植的綠色植被與斑駁光影呈現出靜謐的禪意。' },
        { src: 'assets/photography_detail5.jpg', title: '05 / 瀨戶內海懸崖與展翅飛鳥', desc: '捕捉一隻飛鳥掠過嶙峋懸崖海角的瞬間，藍天白雲下展現大自然的動態美感。' },
        { src: 'assets/photography_detail6.jpg', title: '06 / 小豆島橄欖園俯瞰村落', desc: '透過橄欖樹葉的邊框視角，遠眺山腳下寧靜的小豆島村落與蜿蜒道路，呈現日常的純樸。' },
        { src: 'assets/photography_detail7.jpg', title: '07 / 岡山後樂園大片綠地與池塘', desc: '記錄日本三大名園之一後樂園的廣闊草坪、小徑、拱橋與池塘，樹影倒映於水中展現禪意。' },
        { src: 'assets/photography_detail8.jpg', title: '08 / 岡山城天守閣全景', desc: '拍攝別名「烏城」的岡山城天守閣，黑漆木板外牆與金色裝飾在藍天下顯得十分莊嚴。' },
        { src: 'assets/photography_detail9.jpg', title: '09 / 岡山深夜小巷街景', desc: '捕捉日式深夜街道的靜謐氛圍，黃色燈籠光芒、停放的自行車與日式居酒屋門簾，充滿日常煙火氣。' },
        { src: 'assets/photography_detail10.jpg', title: '10 / 勝尾寺雙達摩偶', desc: '近距離拍攝一對精緻的祈福紅達摩偶，背景虛化突出玩偶憨態可掬的表情與字跡。' },
        { src: 'assets/photography_detail11.jpg', title: '11 / 勝尾寺紅鳥居與山泉瀑布', desc: '記錄隱於繁茂林木間的紅色鳥居與人工飛瀑，水流與綠意相得益彰。' },
        { src: 'assets/photography_detail12.jpg', title: '12 / 達摩奉納棚架細節', desc: '展示寺廟木格置物架上整齊排列的無數祈福達摩，木紋質感與紅白色達摩形成規律美感。' },
        { src: 'assets/photography_detail13.jpg', title: '13 / 京都清水寺舞台與三重塔遠眺', desc: '從高處俯瞰京都清水寺天際線，古樸的清水舞台、朱紅色三重塔與繁茂樹冠勾勒出經典的京都意象。' },
        { src: 'assets/photography_detail14.jpg', title: '14 / 蔚藍天空中翱翔的蒼鷹', desc: '記錄一隻雄鷹在高空中展開雙翼、自由滑翔的英姿，乾淨的藍色背景突出飛行的張力。' }
      ]
    },
    mrt_ad: {
      title: '機場捷運 A4 站柱體包柱廣告',
      category: 'OOH / Graphic Design',
      image: 'assets/mrt_ad.png',
      context: '機捷副都心站大眾運輸廣告視覺設計',
      role: 'Graphic Designer',
      tech: ['Photoshop', 'Typography', 'Outdoor Print Layout', 'Spatial Design'],
      desc: '<strong>專案簡介 (Project Brief)</strong><br>' +
            '本專案為機場捷運 A4 新莊副都心站橋下精華地段柱體包柱廣告設計。該區位處新北大道，車流量大，具有極高的戶外曝光率。<br><br>' +
            '<strong>視覺策略 (Visual Strategy)</strong><br>' +
            '廣告的核心目標在於利用通勤族每日高頻率經過的包柱，建立反覆的視覺接觸，加深大眾對建案品牌的認知。在設計上，著力於短時間內高效、清晰傳達核心賣點，包含建案名稱、聯絡電話、鄰近機捷站的位置，以及周邊公園等便利生活機能。排版強調粗壯醒目的字體與清晰的空間配置，確保車行速度下依然具有絕佳的可讀性。',
      gallery: [
        { src: 'assets/mrt_ad.png', title: '捷運包柱廣告模擬配置圖', desc: '新北大道捷運柱體廣告，視覺排版著力於短時間內高效、清晰傳達核心建案賣點與地理優勢。' }
      ]
    },
        billboard_myfirstbook: {
      title: 'My First Book 戶外廣告看板設計',
      category: 'OOH / Graphic Design',
      image: 'assets/billboard_myfirstbook_main.jpg',
      context: '「My First Book」誠品書店戶外廣告看板與視覺設計',
      role: 'Graphic Designer & OOH Layout Designer',
      tech: ['Illustrator', 'Photoshop', 'OOH Design', 'Marketing Layout'],
      desc: '<strong>設計概念 (Design Concept)</strong><br>' +
            '本專案為蒙特梭利布書品牌「My First Book」於誠品書店（Eslite Bookstore）推廣活動設計的戶外大型宣傳看板。廣告設計採用綠色毛呢質感作為背景，呼應布書的織品溫暖質地與自然生態主題。畫面中央展示了品牌主打的三款可愛動物包包（柴犬、貓咪、狐狸）與啟蒙布書，並搭配節慶紅綠三角旗、椰子樹與大象等卡通貼紙元素，營造活潑、溫馨且富教育意義的童趣氛圍。<br><br>' +
            '<strong>設計執行 (Execution & Typography)</strong><br>' +
            '• <strong>品牌整合與版面配置</strong>：在左上角配置「My First Book」恐龍商標，右上角結合誠品書店商標，藉由雙品牌聯名提升活動信譽。廣告語「My First Book 蒙特梭利布書」與副標題採用圓潤的幼線字體搭配紅白色邊框，使其在綠色背景上具備極佳的識讀性與親和力。<br>' +
            '• <strong>促銷資訊強化</strong>：在底部規劃清晰的白色虛線區塊，突出「布書9折優惠」與「滿額贈益智拼圖」等行銷訊息，並結合 QR Code 引導家長掃描前往線上活動頁。<br>' +
            '• <strong>實景模擬配置</strong>：透過公園綠蔭環境下的戶外大型廣告牌樣機（Mockup）展示，模擬真實陽光與陰影折射下的印刷質感，確認廣告在戶外自然環境中的視覺衝擊力。',
      gallery: [
        { src: 'assets/billboard_myfirstbook_detail1.jpg', title: '01 / 「My First Book」廣告視覺平面配置圖', desc: '完整的廣告看板平面設計圖，展示圓潤童趣的字體排版、聯名商標配置、精緻的布書與包包視覺以及底部優惠訊息區塊。' }
      ]
    },
    gradient_font: {
      title: 'Gradient Kids 字體與海報設計',
      category: 'Typography Design',
      image: 'assets/gradient_font.png',
      context: '裝飾字體與視覺海報創作',
      role: 'Type Designer',
      tech: ['Illustrator', '3D Typography', 'Poster Design'],
      desc: '<strong>字體設計 (Font Design)</strong><br>' +
            '我設計了一套包含 26 個英文字母的專屬裝飾字體，命名為「Gradient Kids Fonts」。字體採用靈活拼接的圓角與矩形結構，以亮天藍色與溫暖鵝黃色相互漸變，提供立體 3D 版與扁平 flat 雙重版本。<br><br>' +
            '<strong>字體應用</strong><br>' +
            '此款字體非常適合作為引人注目的標題字、海報文字或裝飾性圖案。為了展示這款漸變字體在實務上的視覺延展度，我另外繪製了兩款專屬海報，以大膽的版面與色彩碰撞，呈現出字體充滿童真、歡樂且極具設計張力的特質。'
    },
    snowman_art: {
      title: '氣候變遷短片 - 雪人先生',
      category: '3D Modeler & Animator',
      image: 'assets/snowman_art.png',
      context: '全球暖化宣導 3D 動畫短片',
      role: '3D Modeler & Animator',
      tech: ['Blender', '3D Animation', 'Character Design', 'After Effects'],
      sdgs: [
        'assets/sdg_13.png'
      ],
      desc: '<strong>影片概念 (Video Concept)</strong><br>' +
            '本片講述一位活潑可愛的「雪人先生」幽默又悲壯的健身之旅。故事開始於他滿懷熱情地出發鍛鍊，嘗試跑步、舉重 and 跳繩等各種運動。然而，隨著他在健身房中揮灑汗水，他的身體卻因運動產生的體熱而開始不受控制地融化——每一滴落下的雪水，都無聲折射出全球暖化對冰雪世界的威脅。<br><br>' +
            '<strong>設計亮點</strong><br>' +
            '影片結尾，融化成迷你版的雪人先生落寞地看著自己化作一灘雪水的倒影。影片以看似輕鬆詼諧的語調開頭，實則傳遞出全球變暖與氣候變遷對我們生存環境的警示。短片旨在兼具娛樂性的同時喚醒大眾環保意識，表明日常細微的行為也能為地球環境保護貢獻一份心力。',
      gallery: [
        { src: 'assets/snowman_art_detail1.png', title: '01 / 雪人健身運動動作設計 (Fitness Actions Design)', desc: '設計雪人先生進行跑步、舉重與跳繩等多項健身運動之角色動作設計與 3D 渲染視圖。' },
        { src: 'assets/snowman_art_detail2.png', title: '02 / 融化動畫場景與全球暖化宣導 (Melting Scenarios & Global Warming)', desc: '雪人因健身熱量融化之結尾畫面與全球氣候變暖宣導說明字樣。' }
      ]
    },
    recognition_mask: {
      title: '面部識別口罩與防疫海報',
      category: 'Product Design & Animation',
      image: 'assets/recognition_mask.png',
      context: 'COVID-19 防疫期間生活痛點改善提案',
      role: 'Multimedia Designer',
      tech: ['Illustrator', '2D Animation', 'Character Design', 'Creative Branding'],
      desc: '<strong>設計背景 (Design Concept)</strong><br>' +
            '本專案著眼於疫情期間大眾面臨的日常痛點：長期佩戴口罩造成人臉無法解鎖手機、ATM 面部識別失敗，以及公共場合中人與人之間的隔閡感。<br><br>' +
            '<strong>設計執行 (Execution)</strong><br>' +
            '為了解決解鎖不便，我設計了「客製化面部識別口罩」製作概念：將使用者的下半部五官比例印製於口罩外部，恢復手機人臉解鎖功能。此外，我設計了一系列以活潑角色為主角的防疫教導海報及說明動畫，用繽紛色彩和俏皮的角色形象提醒人們保護自我、保持警惕，將沉悶無趣的防疫教導轉化為具有親和力、好玩且寓教於樂的溝通體驗。',
      gallery: [
        { src: 'assets/recognition_mask_detail2.jpg', title: '01 / 防疫教導宣傳海報與角色設計 (Epidemic Prevention Poster)', desc: '設計可愛活潑的吉祥物角色，以親和的視覺引導提醒防疫守則，增添趣味溝通體驗。' },
        { src: 'assets/recognition_mask_qrcode.png', title: '02 / 口罩製作說明動畫 QR Code (Scan to Watch)', desc: '掃描二維碼即可線上觀看關於面部識別口罩製作步驟與改善方案之宣導說明動畫。' }
      ]
    }
  };

  const projectModal = document.getElementById('project-modal');
  const modalDetailsContainer = document.getElementById('modal-project-details');
  const modalCloseBtn = document.querySelector('.modal-close');
  const modalBackdrop = document.querySelector('.modal-backdrop');

  // Open Modal logic
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.getAttribute('data-project');
      const data = projectData[projectId];
      
      if (!data) return;

      let techTagsHtml = data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
      
      // Dynamic SDGs Logos HTML Injection
      let sdgsHtml = '';
      if (data.sdgs && data.sdgs.length > 0) {
        sdgsHtml = `
          <h4 class="modal-section-title">SDGs Alignments / 符合聯合國永續發展指標</h4>
          <div class="modal-sdgs" style="display: flex; gap: 15px; margin-top: 15px; margin-bottom: 25px; flex-wrap: wrap;">
            ${data.sdgs.map(src => `<img src="${src}" class="sdg-logo-img" alt="SDG Logo" style="width: 80px; height: 80px; border-radius: 8px; transition: transform 0.3s ease; cursor: pointer;">`).join('')}
          </div>
        `;
      }

      // Dynamic Gallery HTML Injection
      let galleryHtml = '';
      if (data.gallery && data.gallery.length > 0) {
        galleryHtml = `
          <h4 class="modal-section-title">Design Details & Interfaces / 介面與設計細節展示</h4>
          <div class="modal-gallery">
            ${data.gallery.map(item => `
              <div class="gallery-item">
                <div class="gallery-img-wrapper">
                  <img src="${item.src}" alt="${item.title}" loading="lazy">
                </div>
                <div class="gallery-caption">
                  <h5 class="gallery-item-title outfit">${item.title}</h5>
                  <p class="gallery-item-desc">${item.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }

      if (modalDetailsContainer) {
        modalDetailsContainer.innerHTML = `
          <span class="modal-category outfit">${data.category}</span>
          <h3 class="modal-title">${data.title}</h3>
          
          <div class="modal-img-wrapper">
            <img src="${data.image}" alt="${data.title}">
          </div>

          <div class="modal-meta-grid">
            <div class="meta-item">
              <h5>Context</h5>
              <p>${data.context}</p>
            </div>
            <div class="meta-item">
              <h5>Role</h5>
              <p>${data.role}</p>
            </div>
            <div class="meta-item">
              <h5>Focus</h5>
              <p>${data.category}</p>
            </div>
          </div>

          <h4 class="modal-section-title">Project Overview / 專案簡介</h4>
          <p class="modal-desc">${data.desc}</p>

          ${sdgsHtml}

          ${galleryHtml}

          <h4 class="modal-section-title">Tools & Frameworks / 技術與工具</h4>
          <div class="modal-tech">
            ${techTagsHtml}
          </div>
        `;
      }

      if (projectModal) {
        projectModal.classList.add('active');
      }
      
      setTimeout(() => {
        setupCursorHovers();
      }, 100);
    });
  });

  const closeModal = () => {
    if (projectModal) {
      projectModal.classList.remove('active');
    }
  };

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);


  // ==========================================================================
  // 7. Mobile Navigation Toggle
  // ==========================================================================
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinksContainer = document.querySelector('.nav-links');
  const navLinksItems = document.querySelectorAll('.nav-link');

  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinksContainer.style.display === 'flex';
      if (isOpen) {
        navLinksContainer.style.display = 'none';
        mobileToggle.classList.remove('open');
      } else {
        navLinksContainer.style.display = 'flex';
        navLinksContainer.style.flexDirection = 'column';
        navLinksContainer.style.position = 'absolute';
        navLinksContainer.style.top = '100%';
        navLinksContainer.style.left = '0';
        navLinksContainer.style.width = '100%';
        navLinksContainer.style.backgroundColor = 'rgba(10, 11, 13, 0.95)';
        navLinksContainer.style.padding = '20px';
        navLinksContainer.style.borderBottom = '1px solid var(--border-color)';
        mobileToggle.classList.add('open');
      }
    });
  }

  navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 768 && navLinksContainer && mobileToggle) {
        navLinksContainer.style.display = 'none';
        mobileToggle.classList.remove('open');
      }
    });
  });

});
