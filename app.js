/* ==========================================================================
   Thursday Gathering — prototype logic
   Static/mock data + localStorage for "your" edits (profile, bookmarks,
   registrations, messages, group follows). No backend — this is a UI
   prototype to validate the concept before building the real thing.
   ========================================================================== */

(() => {
  "use strict";

  const STORAGE_KEY = "thursdayGathering.v1";

  /* ---------------- date helpers ---------------- */

  function nextThursday(offsetWeeks = 0) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    const diff = (4 - day + 7) % 7;
    d.setDate(d.getDate() + diff + offsetWeeks * 7);
    return d;
  }
  const fmtDateLong = (d, lang) => d.toLocaleDateString(lang === "ja" ? "ja-JP" : undefined, { weekday: "long", month: "long", day: "numeric" });
  const fmtDateShort = (d, lang) => d.toLocaleDateString(lang === "ja" ? "ja-JP" : undefined, { month: "short", day: "numeric" });

  /* ---------------- mock data ---------------- */

  const ATTENDEES = [
    { id: "a1", name: "Maya Chen", category: "Founder", affiliation: "Verdant Energy", interests: ["Climate Tech", "Hardware", "Fundraising"], bio: "Building modular battery storage for microgrids.", bioJa: "マイクログリッド向けのモジュール式バッテリーストレージを開発中。", linkedin: "https://linkedin.com/in/mayachen", website: "https://verdant.energy", languages: [{ lang: "English", level: 5 }, { lang: "Mandarin", level: 5 }] },
    { id: "a2", name: "Diego Alvarez", category: "Investor", affiliation: "Northbound Capital", interests: ["Fintech", "SaaS", "Climate Tech"], bio: "Early-stage checks, mostly pre-seed and seed.", bioJa: "主にプレシード・シード期のアーリーステージ投資を行う。", linkedin: "https://linkedin.com/in/diegoalvarez", website: "https://northbound.vc", languages: [{ lang: "Spanish", level: 5 }, { lang: "English", level: 4 }] },
    { id: "a3", name: "Priya Nandakumar", category: "Mentor", affiliation: "Independent", interests: ["Product", "UX", "Career Growth"], bio: "Ex-Head of Product, now coaching first-time PMs.", bioJa: "元プロダクト責任者。現在は初めてのPMをコーチング中。", linkedin: "https://linkedin.com/in/priyan", website: "", languages: [{ lang: "English", level: 5 }, { lang: "Hindi", level: 5 }, { lang: "Tamil", level: 3 }] },
    { id: "a4", name: "Sam O'Brien", category: "Student", affiliation: "State University, CS", interests: ["AI", "Robotics", "Open Source"], bio: "Final-year CS student, into applied robotics.", bioJa: "コンピュータサイエンス専攻の最終学年。応用ロボティクスに関心あり。", linkedin: "https://linkedin.com/in/samobrien", website: "", languages: [{ lang: "English", level: 5 }] },
    { id: "a5", name: "Wei Ling", category: "Speaker", affiliation: "Hearth Systems", interests: ["Infra", "DevOps", "AI"], bio: "Speaking this week on scaling infra without losing your mind.", bioJa: "今週、正気を保ちながらインフラをスケールする方法について登壇。", linkedin: "https://linkedin.com/in/weiling", website: "https://hearthsystems.io", languages: [{ lang: "Mandarin", level: 5 }, { lang: "English", level: 5 } ] },
    { id: "a6", name: "Fatima Rahman", category: "Founder", affiliation: "Clarity Health", interests: ["HealthTech", "Biotech", "Fundraising"], bio: "Building diagnostics tools for rural clinics.", bioJa: "地方の診療所向けの診断ツールを開発中。", linkedin: "https://linkedin.com/in/fatimarahman", website: "https://clarityhealth.co", languages: [{ lang: "Bengali", level: 5 }, { lang: "English", level: 4 }, { lang: "Urdu", level: 3 }] },
    { id: "a7", name: "Tom Richter", category: "Investor", affiliation: "Bluepeak Growth", interests: ["SaaS", "Fintech", "Marketplaces"], bio: "Growth-stage, writes about GTM on the side.", bioJa: "グロースステージ投資家。副業でGTMについて執筆。", linkedin: "https://linkedin.com/in/tomrichter", website: "https://bluepeak.vc", languages: [{ lang: "German", level: 5 }, { lang: "English", level: 5 }] },
    { id: "a8", name: "Aiko Tanaka", category: "Speaker", affiliation: "Studio Kanso", interests: ["Design", "UX", "Product"], bio: "Speaking next week on design systems that scale with the team.", bioJa: "来週、チームと共にスケールするデザインシステムについて登壇。", linkedin: "https://linkedin.com/in/aikotanaka", website: "https://studiokanso.design", languages: [{ lang: "Japanese", level: 5 }, { lang: "English", level: 4 }] },
    { id: "a9", name: "Noah Kim", category: "Student", affiliation: "Tech Institute", interests: ["AI", "Data Science", "Open Source"], bio: "Curious about applied ML, building a thesis on retrieval.", bioJa: "応用機械学習に関心があり、検索技術についての卒論に取り組み中。", linkedin: "https://linkedin.com/in/noahkim", website: "", languages: [{ lang: "Korean", level: 5 }, { lang: "English", level: 4 }] },
    { id: "a10", name: "Grace Osei", category: "Mentor", affiliation: "Independent", interests: ["Marketing", "Growth", "Branding"], bio: "Growth marketing, 12 years across B2B and B2C.", bioJa: "グロースマーケティング歴12年、B2BとB2C両方を経験。", linkedin: "https://linkedin.com/in/graceosei", website: "", languages: [{ lang: "English", level: 5 }, { lang: "French", level: 2 }] },
    { id: "a11", name: "Lucas Ferreira", category: "Professional", affiliation: "Orbital Cloud", interests: ["Infra", "DevOps", "Leadership"], bio: "Engineering manager, platform team.", bioJa: "プラットフォームチームのエンジニアリングマネージャー。", linkedin: "https://linkedin.com/in/lucasferreira", website: "https://orbitalcloud.com", languages: [{ lang: "Portuguese", level: 5 }, { lang: "English", level: 5 }, { lang: "Spanish", level: 3 }] },
    { id: "a12", name: "Hana Suzuki", category: "Founder", affiliation: "Lumen Learning", interests: ["EdTech", "Product", "Fundraising"], bio: "Building adaptive learning tools for high schools.", bioJa: "高校生向けのアダプティブラーニングツールを開発中。", linkedin: "https://linkedin.com/in/hanasuzuki", website: "https://lumenlearning.app", languages: [{ lang: "Japanese", level: 5 }, { lang: "English", level: 5 }] },
    { id: "a13", name: "Omar Haddad", category: "Investor", affiliation: "Seedline", interests: ["Climate Tech", "HealthTech", "Hardware"], bio: "Seed fund, deep-tech leaning.", bioJa: "ディープテック志向のシードファンド。", linkedin: "https://linkedin.com/in/omarhaddad", website: "https://seedline.vc", languages: [{ lang: "Arabic", level: 5 }, { lang: "English", level: 4 }, { lang: "French", level: 3 }] },
    { id: "a14", name: "Ines Moreau", category: "Speaker", affiliation: "Here/There Collective", interests: ["Community", "Marketing", "Branding"], bio: "Speaking in three weeks on community that outlasts the hype.", bioJa: "3週間後、ブームを超えて続くコミュニティについて登壇。", linkedin: "https://linkedin.com/in/inesmoreau", website: "https://heretherecollective.com", languages: [{ lang: "French", level: 5 }, { lang: "English", level: 5 }] },
  ];

  const CATEGORIES = ["Student", "Investor", "Founder", "Mentor", "Speaker", "Professional"];

  const EVENTS = [
    {
      id: "e1", offsetWeeks: 0,
      title: "Scaling Infrastructure Without Losing Your Mind",
      titleJa: "正気を保ちながらインフラをスケールする方法",
      tags: ["Infra", "DevOps", "AI"],
      desc: "War stories and hard-won lessons on scaling infra from 10 to 10,000 requests a second.",
      descJa: "秒間10リクエストから10,000リクエストまでインフラをスケールさせた、実体験に基づく教訓の数々。",
      speakerIds: ["a5", "a11"],
      rundown: [
        { time: "16:00", item: "Registration & networking", itemJa: "受付・ネットワーキング" },
        { time: "18:00", item: "Opening remarks", itemJa: "オープニングリマークス" },
        { time: "18:15", item: "Talk — Scaling infra without losing your mind", itemJa: "トーク — 正気を保ちながらインフラをスケールする" },
        { time: "19:00", item: "Panel: what actually breaks first", itemJa: "パネル：実際に最初に壊れるもの" },
        { time: "19:45", item: "Open networking", itemJa: "オープンネットワーキング" },
        { time: "21:00", item: "Doors close", itemJa: "終了" },
      ],
    },
    {
      id: "e2", offsetWeeks: 1,
      title: "Design Systems That Scale With Your Team",
      titleJa: "チームと共にスケールするデザインシステム",
      tags: ["Design", "UX", "Product"],
      desc: "How to build a design system that survives contact with a growing team.",
      descJa: "成長するチームの中でも生き残るデザインシステムの作り方。",
      speakerIds: ["a8", "a3"],
      rundown: [
        { time: "16:00", item: "Registration & networking", itemJa: "受付・ネットワーキング" },
        { time: "18:00", item: "Opening remarks", itemJa: "オープニングリマークス" },
        { time: "18:15", item: "Talk — Design systems at scale", itemJa: "トーク — 大規模なデザインシステム" },
        { time: "19:00", item: "Fireside: product & design coaching", itemJa: "座談会：プロダクト＆デザインコーチング" },
        { time: "19:45", item: "Open networking", itemJa: "オープンネットワーキング" },
        { time: "21:00", item: "Doors close", itemJa: "終了" },
      ],
    },
    {
      id: "e3", offsetWeeks: 2,
      title: "Raising in a Tighter Market",
      titleJa: "厳しい市場での資金調達",
      tags: ["Fundraising", "Investing", "Founders"],
      desc: "Founder and investor perspectives on what's actually getting funded right now.",
      descJa: "今まさに資金提供されているものについて、創業者と投資家の視点から語る。",
      speakerIds: ["a2", "a6", "a13"],
      rundown: [
        { time: "16:00", item: "Registration & networking", itemJa: "受付・ネットワーキング" },
        { time: "18:00", item: "Opening remarks", itemJa: "オープニングリマークス" },
        { time: "18:15", item: "Panel: founders & investors on the current market", itemJa: "パネル：現在の市場について語る創業者と投資家" },
        { time: "19:15", item: "Office hours with investors", itemJa: "投資家とのオフィスアワー" },
        { time: "19:45", item: "Open networking", itemJa: "オープンネットワーキング" },
        { time: "21:00", item: "Doors close", itemJa: "終了" },
      ],
    },
    {
      id: "e4", offsetWeeks: 3,
      title: "Building Community That Outlasts the Hype",
      titleJa: "ブームを超えて続くコミュニティの作り方",
      tags: ["Community", "Marketing", "Branding"],
      desc: "What keeps a community alive after the launch buzz fades.",
      descJa: "立ち上げの盛り上がりが落ち着いた後もコミュニティを存続させるもの。",
      speakerIds: ["a14", "a10"],
      rundown: [
        { time: "16:00", item: "Registration & networking", itemJa: "受付・ネットワーキング" },
        { time: "18:00", item: "Opening remarks", itemJa: "オープニングリマークス" },
        { time: "18:15", item: "Talk — Community that outlasts the hype", itemJa: "トーク — ブームを超えて続くコミュニティ" },
        { time: "19:00", item: "Roundtables by topic", itemJa: "テーマ別ラウンドテーブル" },
        { time: "19:45", item: "Open networking", itemJa: "オープンネットワーキング" },
        { time: "21:00", item: "Doors close", itemJa: "終了" },
      ],
    },
  ].map((e) => ({ ...e, date: nextThursday(e.offsetWeeks) }));

  const GROUPS_SEED = [
    { id: "g1", name: "Climate Tech Founders", category: "Topic", members: 42, desc: "Trading notes on hardware, grants, and the fundraising slog.", descJa: "ハードウェア、助成金、資金調達の苦労について情報交換。", following: true },
    { id: "g2", name: "Early-Career in Tech", category: "Topic", members: 58, desc: "Students and new grads figuring out what's next.", descJa: "次のキャリアを模索する学生と新卒者のグループ。", following: false },
    { id: "g3", name: "Weekend Hikers", category: "Social", members: 21, desc: "Trail plans, gear talk, and Saturday meetups.", descJa: "トレイル計画、ギアの話、土曜日の集まり。", following: false },
    { id: "g4", name: "AI Builders Circle", category: "Topic", members: 76, desc: "Shipping with LLMs — prompts, evals, and what breaks in prod.", descJa: "LLMを使ったリリース — プロンプト、評価、本番で壊れるもの。", following: true },
    { id: "g5", name: "Board Games & Chill", category: "Social", members: 15, desc: "Low-key game nights, all skill levels welcome.", descJa: "気軽なゲームナイト、どんなレベルでも歓迎。", following: false },
    { id: "g6", name: "Women in VC", category: "Topic", members: 33, desc: "Peer support and deal-flow sharing.", descJa: "ピアサポートとディールフロー共有。", following: false },
  ];
  const GROUP_POSTS_SEED = {
    g1: [
      { author: "Maya Chen", text: "Anyone found a decent grant database for battery storage pilots?", time: "Mon 09:14" },
      { author: "Omar Haddad", text: "DM'd you one — also happy to intro to two portfolio founders doing similar.", time: "Mon 11:02" },
    ],
    g4: [
      { author: "Wei Ling", text: "Eval tooling recs for a RAG pipeline? Ragas vs. rolling our own.", time: "Sun 20:41" },
    ],
  };

  const CONVERSATIONS_SEED = {
    a5: [
      { from: "them", text: "Hey! Saw you registered for the infra talk Thursday.", time: "Tue 14:02" },
      { from: "me", text: "Yep, really looking forward to it. Curious how you handled the migration you mentioned.", time: "Tue 14:20" },
      { from: "them", text: "Happy to walk through it after — grab me at the networking bit.", time: "Tue 14:24" },
    ],
    a1: [
      { from: "them", text: "Great meeting you at the last gathering! Still up for a coffee chat about microgrids?", time: "Sun 18:11" },
    ],
  };

  const TESTIMONIALS = [
    { attendeeId: "a1", quote: "Best two hours of my week — I've met three co-founders here.", quoteJa: "毎週いちばん充実した2時間。ここで3人の共同創業者候補に出会いました。" },
    { attendeeId: "a5", quote: "Speaking here connected me with people I still work with a year later.", quoteJa: "ここで登壇したことがきっかけで、1年経った今も一緒に仕事をしている人たちと出会えました。" },
    { attendeeId: "a3", quote: "No pitch decks, no small talk pressure — just good conversations that go somewhere.", quoteJa: "ピッチ資料も無理な社交辞令もない。ただ意味のある会話ができる場所です。" },
    { attendeeId: "a12", quote: "I've hired two people I met at this exact gathering.", quoteJa: "この集まりで出会った2人を、実際に採用しました。" },
    { attendeeId: "a9", quote: "As a student, this is the one room where nobody makes you feel junior.", quoteJa: "学生の自分でも、ここでは誰も見下したりしない。そんな場所です。" },
  ];

  /* ---------------- state ---------------- */

  const defaultProfile = {
    name: "You",
    affiliation: "",
    category: "Professional",
    email: "",
    background: "",
    interests: ["AI", "Product"],
    businessTopics: [],
    linkedin: "",
    website: "",
    languages: [{ lang: "English", level: 5 }],
    photo: "",
  };

  function defaultState() {
    return {
      profile: JSON.parse(JSON.stringify(defaultProfile)),
      bookmarks: ["a5", "a2"],
      registeredEvents: ["e1"],
      conversations: JSON.parse(JSON.stringify(CONVERSATIONS_SEED)),
      groups: JSON.parse(JSON.stringify(GROUPS_SEED)),
      groupPosts: JSON.parse(JSON.stringify(GROUP_POSTS_SEED)),
      uiLang: "en",
    };
  }

  let state;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    state = raw ? Object.assign(defaultState(), JSON.parse(raw)) : defaultState();
  } catch (e) {
    state = defaultState();
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
  }

  /* ---------------- small utils ---------------- */

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function initials(name) {
    return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  }
  const AVATAR_STYLES = [
    { bg: "var(--text)", fg: "var(--bg)" },
    { bg: "var(--accent)", fg: "var(--accent-contrast)" },
    { bg: "var(--border)", fg: "var(--text)" },
  ];
  function avatarStyleFor(id) {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
    return AVATAR_STYLES[h % AVATAR_STYLES.length];
  }
  function avatarHTML(id, name, size) {
    const s = avatarStyleFor(id);
    const style = size ? `width:${size}px;height:${size}px;font-size:${Math.round(size * 0.34)}px;` : "";
    return `<div class="avatar" style="background:${s.bg};color:${s.fg};${style}">${esc(initials(name))}</div>`;
  }

  /* ---------------- message auto-translate: JA <-> EN, auto-detected ----------------
     Calls Google Translate's free "gtx" web client endpoint — the same one
     translate.google.com's own frontend uses, no API key or billing involved.
     It's unofficial (not a documented public API), so it can be rate-limited or
     blocked without notice; on any failure this falls back to the small local
     dictionary below so the thread never breaks. */

  const EN_JA_DICT = {
    hey: "やあ", hi: "こんにちは", hello: "こんにちは", great: "素晴らしい",
    good: "良い", nice: "素敵", meeting: "会うこと", you: "あなた",
    your: "あなたの", at: "で", the: "その", last: "前回の",
    gathering: "集まり", still: "まだ", up: "準備ができて", for: "のために",
    a: "一つの", coffee: "コーヒー", chat: "チャット", about: "について",
    saw: "見た", registered: "登録した", thursday: "木曜日", yep: "うん",
    yes: "はい", no: "いいえ", really: "本当に", looking: "楽しみにしている",
    forward: "前へ", to: "に", it: "それ", curious: "興味がある",
    how: "どうやって", handled: "対処した", migration: "移行", mentioned: "言及した",
    happy: "嬉しい", walk: "案内する", through: "を通して", after: "後で",
    grab: "つかまえる", me: "私", networking: "ネットワーキング", bit: "時間",
    thanks: "ありがとう", thank: "ありがとう", please: "お願いします", sure: "もちろん",
    see: "会う", soon: "すぐに", today: "今日", tomorrow: "明日",
    week: "週", time: "時間", what: "何", when: "いつ",
    where: "どこ", why: "なぜ", can: "できる", will: "だろう",
    would: "でしょう", want: "欲しい", need: "必要", love: "大好き",
    think: "思う", know: "知っている", talk: "話", infra: "インフラ",
    join: "参加する", sounds: "そう聞こえる", microgrids: "マイクログリッド",
  };

  // Longest-Japanese-value-first, so greedy matching prefers whole words over substrings.
  const JA_EN_PAIRS = Object.entries(EN_JA_DICT).sort((a, b) => b[1].length - a[1].length);

  const JP_CHAR_RE = /[぀-ヿ一-鿿]/;

  function translateEnToJa(text) {
    return text.replace(/[A-Za-z']+/g, (word) => {
      const ja = EN_JA_DICT[word.toLowerCase()];
      return ja || word;
    });
  }

  function translateJaToEn(text) {
    let out = "";
    let i = 0;
    while (i < text.length) {
      const hit = JA_EN_PAIRS.find(([, ja]) => text.startsWith(ja, i));
      if (hit) {
        if (out && !/[\s、。！？]$/.test(out)) out += " ";
        out += hit[0];
        i += hit[1].length;
      } else {
        out += text[i];
        i++;
      }
    }
    return out.trim().replace(/\s+/g, " ");
  }

  function mockTranslate(text) {
    return JP_CHAR_RE.test(text)
      ? { lang: "EN", text: translateJaToEn(text) }
      : { lang: "JA", text: translateEnToJa(text) };
  }

  const gTranslateCache = new Map(); // `${targetLang}:${text}` -> Promise<string>

  function fetchGoogleTranslation(text, targetLang) {
    const cacheKey = `${targetLang}:${text}`;
    if (gTranslateCache.has(cacheKey)) return gTranslateCache.get(cacheKey);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const promise = fetch(url)
      .then((res) => { if (!res.ok) throw new Error(`translate request failed: ${res.status}`); return res.json(); })
      .then((data) => {
        const translated = data[0].map((segment) => segment[0]).join("");
        if (!translated) throw new Error("empty translation");
        return translated;
      })
      .catch(() => (targetLang === "ja" ? translateEnToJa(text) : translateJaToEn(text)));
    gTranslateCache.set(cacheKey, promise);
    return promise;
  }

  // Real translation is async; callers get the fast local-dictionary guess
  // immediately (so something shows right away) and onReady when the real
  // translation lands, which is usually within a couple hundred ms.
  function translateMessage(text, onReady) {
    const guess = mockTranslate(text);
    const targetLang = guess.lang === "JA" ? "ja" : "en";
    fetchGoogleTranslation(text, targetLang).then((translated) => onReady({ lang: guess.lang, text: translated }));
    return guess;
  }

  /* ---------------- whole-page language: EN / JA (UI chrome + mock content) ---------------- */

  const UI_STRINGS = {
    "nav.home": { en: "Home", ja: "ホーム" },
    "nav.events": { en: "Events", ja: "イベント" },
    "nav.attendees": { en: "Attendees", ja: "参加者" },
    "nav.messages": { en: "Messages", ja: "メッセージ" },
    "nav.community": { en: "Community", ja: "コミュニティ" },

    "home.eyebrow": { en: "Weekly · Every Thursday", ja: "毎週木曜日開催" },
    "home.slogan": { en: "Connecting people through innovation", ja: "イノベーションで人をつなぐ" },
    "home.detailsEyebrow": { en: "What to expect", ja: "どんな夜か" },
    "home.detailsTitle": { en: "A weekly evening, done the same easy way every time", ja: "毎週開催、いつも同じ気軽な形式で" },
    "home.heroDesc": { en: "A recurring evening for people building things — a short talk, a panel discussion, and plenty of unstructured time to actually talk to each other. Every week brings a new topic, a new lineup of speakers, and a fresh mix of founders, investors, students, mentors, and specialists from across the industry. The format stays the same each time: show up, learn something useful, meet someone you wouldn't have otherwise, and stick around for the part that matters most — the conversations that happen after the talks end.", ja: "ものづくりをする人たちのための、毎週開催の定期イベントです。短いトークとパネルディスカッション、そしてお互いにじっくり話せる自由な時間をたっぷりと用意しています。毎週テーマが変わり、登壇者も入れ替わり、創業者や投資家、学生、メンター、各分野の専門家など、多様な顔ぶれが集まります。形式はいつも同じで気軽に参加できます — 会場に来て、何か学びを持ち帰り、これまで出会えなかった人と知り合い、そして何より大切な「トークが終わったあとの会話」までゆっくり楽しんでいってください。" },
    "home.seeLineup": { en: "See the lineup", ja: "ラインナップを見る" },
    "home.nextTimeDetail": { en: "16:00 – 21:00 · West Atrium, 6th Floor", ja: "16:00 – 21:00 ・ 西アトリウム、6階" },
    "home.upcomingEyebrow": { en: "Coming up", ja: "次回以降" },
    "home.upcomingTitle": { en: "Three gatherings ahead", ja: "今後の3回" },
    "home.testimonialEyebrow": { en: "In their words", ja: "参加者の声" },

    "events.title": { en: "Events", ja: "イベント" },
    "events.sub": { en: "Browse upcoming sessions or check what you're already registered for.", ja: "今後のセッションを閲覧するか、すでに登録済みのイベントを確認しましょう。" },
    "events.discover": { en: "Discover", ja: "見つける" },
    "events.mine": { en: "My events", ja: "登録済みイベント" },
    "events.emptyMine": { en: "You haven't registered for anything yet.", ja: "まだ何も登録していません。" },
    "events.discoverBtn": { en: "Discover events", ja: "イベントを探す" },
    "events.rundown": { en: "Rundown", ja: "進行表" },
    "events.speakers": { en: "Speakers", ja: "登壇者" },

    "attendees.title": { en: "Attendees", ja: "参加者" },
    "attendees.sub": { en: "See who's coming, who you might want to meet, and who you've bookmarked.", ja: "誰が参加するか、会ってみたい人、ブックマークした人をチェックしましょう。" },
    "attendees.recommended": { en: "Recommended", ja: "おすすめ" },
    "attendees.bookmarked": { en: "Bookmarked", ja: "ブックマーク済み" },
    "attendees.emptyGeneric": { en: "Nothing here yet.", ja: "まだ何もありません。" },
    "attendees.emptyRecommended": { en: "Add some interests to your profile to get matches.", ja: "プロフィールに興味関心を追加すると、おすすめが表示されます。" },
    "attendees.emptyBookmarked": { en: "Bookmark people you want to talk to and they'll show up here.", ja: "話したい人をブックマークすると、ここに表示されます。" },

    "common.all": { en: "All", ja: "すべて" },
    "common.category": { en: "Category", ja: "カテゴリー" },
    "common.message": { en: "Message", ja: "メッセージ" },
    "common.register": { en: "Register", ja: "登録する" },
    "common.registered": { en: "Registered ✓", ja: "登録済み ✓" },

    "messages.title": { en: "Messages", ja: "メッセージ" },
    "messages.sub": { en: "Direct conversations with attendees and speakers.", ja: "参加者や登壇者との個別メッセージ。" },
    "messages.emptyConvList": { en: "No conversations yet — message someone from Events or Attendees.", ja: "まだ会話がありません — イベントか参加者ページから誰かにメッセージを送ってみましょう。" },
    "messages.selectConv": { en: "Select a conversation to start messaging.", ja: "会話を選択してメッセージを始めましょう。" },
    "messages.inputPlaceholder": { en: "Write a message…", ja: "メッセージを入力…" },
    "messages.send": { en: "Send", ja: "送信" },
    "messages.sayHello": { en: "Say hello 👋", ja: "挨拶してみましょう 👋" },
    "messages.sayHelloPreview": { en: "Say hello", ja: "挨拶してみましょう" },

    "icebreaker.sharedInterest": { en: "Hi {name}! I saw we're both into {interest}, let's connect and have a valuable conversation.", ja: "こんにちは、{name}さん！{interest}に興味があるとのことで、ぜひお話ししたいです。" },
    "icebreaker.sharedInterestMulti": { en: "Hi {name}! Looks like we're both into {interest} and more let's connect and have a valuable conversation.", ja: "こんにちは、{name}さん！{interest}など共通の興味がありそうですね。集まりでぜひお話ししたいです。" },
    "icebreaker.generic": { en: "Hi {name}! Looking forward to meeting you at the gathering.", ja: "こんにちは、{name}さん！集まりでお会いできるのを楽しみにしています。" },

    "community.title": { en: "Community", ja: "コミュニティ" },
    "community.sub": { en: "Topic and social groups — the hallway conversation that keeps going after Thursday.", ja: "テーマ別・交流グループ — 木曜日が終わった後も続く廊下での会話。" },
    "community.newGroup": { en: "+ New group", ja: "＋ 新しいグループ" },
    "community.following": { en: "Following", ja: "フォロー中" },
    "community.startGroup": { en: "Start a group", ja: "グループを作成" },
    "community.groupName": { en: "Group name", ja: "グループ名" },
    "community.groupNamePh": { en: "e.g. Climate Tech Founders", ja: "例：気候テック創業者" },
    "community.categoryPh": { en: "e.g. Topic, Social", ja: "例：トピック、交流" },
    "community.whatsAbout": { en: "What's it about", ja: "どんなグループか" },
    "community.whatsAboutPh": { en: "Short description for people deciding whether to join", ja: "参加を検討する人向けの簡単な説明" },
    "community.create": { en: "Create group", ja: "グループを作成" },
    "community.cancel": { en: "Cancel", ja: "キャンセル" },
    "community.membersCount": { en: "{n} members", ja: "メンバー{n}人" },
    "community.join": { en: "Join", ja: "参加する" },
    "community.joinGroup": { en: "Join group", ja: "グループに参加" },
    "community.openGroup": { en: "Open group", ja: "グループを開く" },
    "community.emptyFollowing": { en: "Not following any groups yet.", ja: "まだフォロー中のグループはありません。" },
    "community.discussion": { en: "Discussion", ja: "ディスカッション" },
    "community.noPosts": { en: "No posts yet — start the conversation.", ja: "まだ投稿がありません — 会話を始めましょう。" },
    "community.postPlaceholder": { en: "Post something to the group…", ja: "グループに投稿する…" },
    "community.post": { en: "Post", ja: "投稿" },
    "community.giveNameFirst": { en: "Give the group a name first", ja: "まずグループ名を入力してください" },

    "profile.title": { en: "My profile", ja: "マイプロフィール" },
    "profile.edit": { en: "Edit profile", ja: "プロフィールを編集" },
    "profile.photo": { en: "Profile photo", ja: "プロフィール写真" },
    "profile.uploadPhoto": { en: "Upload photo", ja: "写真をアップロード" },
    "profile.removePhoto": { en: "Remove photo", ja: "写真を削除" },
    "profile.photoHint": { en: "JPG or PNG — it'll be resized automatically.", ja: "JPGまたはPNG形式 — 自動的にリサイズされます。" },
    "profile.sub": { en: "Keep this up to date so people can find and message you.", ja: "最新の状態に保つと、他の人があなたを見つけてメッセージを送りやすくなります。" },
    "profile.name": { en: "Name", ja: "名前" },
    "profile.affiliation": { en: "Affiliation", ja: "所属" },
    "profile.email": { en: "Email", ja: "メールアドレス" },
    "profile.background": { en: "Background", ja: "経歴" },
    "profile.backgroundPh": { en: "A couple of sentences about your background", ja: "経歴について簡単に記入してください" },
    "profile.interests": { en: "Interests", ja: "興味関心" },
    "profile.interestsPh": { en: "Type an interest and press Enter", ja: "興味関心を入力してEnterを押してください" },
    "profile.businessTopics": { en: "Business topics", ja: "ビジネストピック" },
    "profile.businessTopicsPh": { en: "Type a topic and press Enter", ja: "トピックを入力してEnterを押してください" },
    "profile.linkedin": { en: "LinkedIn", ja: "LinkedIn" },
    "profile.website": { en: "Company website", ja: "会社のウェブサイト" },
    "profile.languagesSpoken": { en: "Languages spoken", ja: "話せる言語" },
    "profile.languagePlaceholder": { en: "Language", ja: "言語" },
    "profile.addLanguage": { en: "+ Add language", ja: "＋ 言語を追加" },
    "profile.languageHint": { en: "Click the dots to set proficiency, 1 (basic) to 5 (fluent).", ja: "ドットをクリックして習熟度を設定（1：初級 〜 5：流暢）。" },
    "profile.save": { en: "Save profile", ja: "プロフィールを保存" },

    "toast.registered": { en: "Registered — see you Thursday", ja: "登録しました — 木曜日にお会いしましょう" },
    "toast.regRemoved": { en: "Registration removed", ja: "登録を取り消しました" },
    "toast.bookmarked": { en: "Bookmarked", ja: "ブックマークしました" },
    "toast.bookmarkRemoved": { en: "Removed bookmark", ja: "ブックマークを解除しました" },
    "toast.joinedGroup": { en: "Joined {name}", ja: "{name}に参加しました" },
    "toast.leftGroup": { en: "Left {name}", ja: "{name}を退出しました" },
    "toast.groupCreated": { en: "Group created", ja: "グループを作成しました" },
    "toast.profileSaved": { en: "Profile saved", ja: "プロフィールを保存しました" },

    "category.Student": { en: "Student", ja: "学生" },
    "category.Investor": { en: "Investor", ja: "投資家" },
    "category.Founder": { en: "Founder", ja: "創業者" },
    "category.Mentor": { en: "Mentor", ja: "メンター" },
    "category.Speaker": { en: "Speaker", ja: "スピーカー" },
    "category.Professional": { en: "Professional", ja: "専門家" },

    "groupCategory.Topic": { en: "Topic", ja: "トピック" },
    "groupCategory.Social": { en: "Social", ja: "交流" },

    "tag.Climate Tech": { en: "Climate Tech", ja: "気候テック" },
    "tag.Hardware": { en: "Hardware", ja: "ハードウェア" },
    "tag.Fundraising": { en: "Fundraising", ja: "資金調達" },
    "tag.Fintech": { en: "Fintech", ja: "フィンテック" },
    "tag.SaaS": { en: "SaaS", ja: "SaaS" },
    "tag.Product": { en: "Product", ja: "プロダクト" },
    "tag.UX": { en: "UX", ja: "UX" },
    "tag.Career Growth": { en: "Career Growth", ja: "キャリア成長" },
    "tag.AI": { en: "AI", ja: "AI" },
    "tag.Robotics": { en: "Robotics", ja: "ロボティクス" },
    "tag.Open Source": { en: "Open Source", ja: "オープンソース" },
    "tag.Infra": { en: "Infra", ja: "インフラ" },
    "tag.DevOps": { en: "DevOps", ja: "DevOps" },
    "tag.HealthTech": { en: "HealthTech", ja: "ヘルステック" },
    "tag.Biotech": { en: "Biotech", ja: "バイオテック" },
    "tag.Marketplaces": { en: "Marketplaces", ja: "マーケットプレイス" },
    "tag.Design": { en: "Design", ja: "デザイン" },
    "tag.Data Science": { en: "Data Science", ja: "データサイエンス" },
    "tag.Marketing": { en: "Marketing", ja: "マーケティング" },
    "tag.Growth": { en: "Growth", ja: "グロース" },
    "tag.Branding": { en: "Branding", ja: "ブランディング" },
    "tag.Leadership": { en: "Leadership", ja: "リーダーシップ" },
    "tag.EdTech": { en: "EdTech", ja: "エドテック" },
    "tag.Community": { en: "Community", ja: "コミュニティ" },
    "tag.Investing": { en: "Investing", ja: "投資" },
    "tag.Founders": { en: "Founders", ja: "創業者" },
  };

  function t(key) {
    const entry = UI_STRINGS[key];
    if (!entry) return key;
    return entry[state.uiLang] || entry.en;
  }
  function trFmt(key, vars) {
    let s = t(key);
    Object.keys(vars || {}).forEach((k) => { s = s.replace(`{${k}}`, vars[k]); });
    return s;
  }
  function trTag(tag) { return t(`tag.${tag}`) === `tag.${tag}` ? tag : t(`tag.${tag}`); }
  function trCategory(cat) { return t(`category.${cat}`) === `category.${cat}` ? cat : t(`category.${cat}`); }
  function trGroupCategory(cat) { return t(`groupCategory.${cat}`) === `groupCategory.${cat}` ? cat : t(`groupCategory.${cat}`); }
  function trBio(a) { return state.uiLang === "ja" && a.bioJa ? a.bioJa : a.bio; }
  function trEventTitle(ev) { return state.uiLang === "ja" && ev.titleJa ? ev.titleJa : ev.title; }
  function trEventDesc(ev) { return state.uiLang === "ja" && ev.descJa ? ev.descJa : ev.desc; }
  function trRundownItem(r) { return state.uiLang === "ja" && r.itemJa ? r.itemJa : r.item; }
  function trGroupDesc(g) { return state.uiLang === "ja" && g.descJa ? g.descJa : g.desc; }

  function firstName(fullName) { return fullName.trim().split(/\s+/)[0]; }

  function sharedInterests(a) {
    const mine = new Set(state.profile.interests.map((s) => s.toLowerCase()));
    return a.interests.filter((i) => mine.has(i.toLowerCase()));
  }

  function icebreakerFor(a) {
    const shared = sharedInterests(a);
    const name = firstName(a.name);
    if (shared.length > 1) return trFmt("icebreaker.sharedInterestMulti", { name, interest: trTag(shared[0]) });
    if (shared.length === 1) return trFmt("icebreaker.sharedInterest", { name, interest: trTag(shared[0]) });
    return trFmt("icebreaker.generic", { name });
  }

  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("show"), 1800);
  }

  function attendeeById(id) { return ATTENDEES.find((a) => a.id === id); }
  function eventById(id) { return EVENTS.find((e) => e.id === id); }
  function groupById(id) { return state.groups.find((g) => g.id === id); }

  /* ---------------- tabs ---------------- */

  function setActiveTab(tab) {
    $$(".view").forEach((v) => v.classList.toggle("active", v.id === `view-${tab}`));
    $$(".tab-btn").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === tab)));
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    if (tab === "home") { const sh = $("#storyHome"); if (sh && sh._resetStory) sh._resetStory(); }
    $("#tabnav").classList.remove("is-receded");
    $(".app-header").classList.remove("is-receded");
  }
  $$(".tab-btn").forEach((b) => b.addEventListener("click", () => setActiveTab(b.dataset.tab)));
  $$("[data-goto]").forEach((b) => b.addEventListener("click", () => setActiveTab(b.dataset.goto)));
  $("#brandHomeBtn").addEventListener("click", () => setActiveTab("home"));

  /* ---------------- modals ---------------- */

  function openModal(id) { $(`#${id}`).classList.add("open"); }
  function closeModal(id) { $(`#${id}`).classList.remove("open"); }
  $$("[data-close-modal]").forEach((b) => b.addEventListener("click", () => closeModal(b.dataset.closeModal)));
  $$(".modal-backdrop").forEach((bd) => bd.addEventListener("click", (e) => { if (e.target === bd) bd.classList.remove("open"); }));

  /* ---------------- HOME ---------------- */

  let testimonialIndex = null;

  function renderHome() {
    $("#homeDescription").textContent = t("home.heroDesc");
    const nextEvent = EVENTS[0];
    $("#nextDate").textContent = fmtDateLong(nextEvent.date, state.uiLang);
    $("#nextTime").textContent = t("home.nextTimeDetail");

    $("#storyEventsGrid").innerHTML = EVENTS.slice(0, 3).map((ev) => `
      <div class="event-story-card" data-view-event="${ev.id}" role="button" tabindex="0">
        <span class="event-date-badge mono">${esc(fmtDateShort(ev.date, state.uiLang))}</span>
        <h3>${esc(trEventTitle(ev))}</h3>
        <p>${esc(trEventDesc(ev))}</p>
      </div>
    `).join("");
    $$("#storyEventsGrid [data-view-event]").forEach((el) => {
      el.addEventListener("click", () => openEventDetail(el.dataset.viewEvent, el));
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openEventDetail(el.dataset.viewEvent, el); }
      });
    });

    if (testimonialIndex === null) testimonialIndex = Math.floor(Math.random() * TESTIMONIALS.length);
    const tm = TESTIMONIALS[testimonialIndex];
    const person = attendeeById(tm.attendeeId);
    $("#testimonialCard").innerHTML = `
      <p class="testimonial-quote">${esc(state.uiLang === "ja" ? tm.quoteJa : tm.quote)}</p>
      <div class="testimonial-person">
        ${avatarHTML(person.id, person.name, 40)}
        <div style="text-align:left;">
          <div class="testimonial-name">${esc(person.name)}</div>
          <div class="testimonial-aff">${esc(person.affiliation)}</div>
        </div>
      </div>
    `;
  }

  /* ---------------- EVENTS: one page (event) visible at a time, paged horizontally ---------------- */

  let eventsSubtab = "discover";
  let eventsList = [];
  let eventsCurrent = 0;
  let eventsTransitioning = false;

  // Read the actual rendered node width (set in CSS, and narrower under the
  // mobile breakpoint) rather than hardcoding it, so the two never drift out
  // of sync.
  function timelineNodeWidth() {
    const node = document.querySelector(".timeline-node");
    return node ? node.getBoundingClientRect().width : 240;
  }

  function eventDetailCardHTML(ev) {
    const registered = state.registeredEvents.includes(ev.id);
    return `
      <div class="card event-card" id="eventsDetailCard" data-event-id="${ev.id}">
        <span class="event-date-badge mono">${esc(fmtDateShort(ev.date, state.uiLang))} · 17:30</span>
        <h2 class="event-title-link" data-view-event="${ev.id}" role="button" tabindex="0">${esc(trEventTitle(ev))}</h2>
        <div class="topic-tags">${ev.tags.map((tg) => `<span class="tag">${esc(trTag(tg))}</span>`).join("")}</div>
        <p class="desc">${esc(trEventDesc(ev))}</p>
        <div class="row">
          <button class="btn btn-sm ${registered ? "btn-outline" : "btn-primary"}" data-register="${ev.id}">${registered ? t("common.registered") : t("common.register")}</button>
        </div>
      </div>`;
  }

  function renderEventsDetail() {
    const detailWrap = $("#eventsDetail");
    const ev = eventsList[eventsCurrent];
    if (!ev) { detailWrap.innerHTML = ""; return; }
    detailWrap.innerHTML = eventDetailCardHTML(ev);
    bindEventCardActions();
    requestAnimationFrame(() => { $("#eventsDetailCard")?.classList.add("is-shown"); });
  }

  function renderEventsTimelineNodes() {
    const timeline = $("#eventsTimeline");
    timeline.innerHTML = eventsList.map((ev, i) => `
      <button type="button" class="timeline-node ${i === eventsCurrent ? "active" : ""}" data-idx="${i}" aria-label="${esc(trEventTitle(ev))}">
        <span class="timeline-dot"></span>
        <span class="timeline-date mono">${esc(fmtDateShort(ev.date, state.uiLang))}</span>
      </button>
    `).join("");
    $$(".timeline-node", timeline).forEach((btn) => {
      btn.addEventListener("click", () => goToEvent(Number(btn.dataset.idx)));
    });
  }

  function updateTimelineActiveState() {
    $$(".timeline-node", $("#eventsTimeline")).forEach((el, idx) => {
      el.classList.toggle("active", idx === eventsCurrent);
    });
  }

  function positionTimeline(instant) {
    const timeline = $("#eventsTimeline");
    const nodeW = timelineNodeWidth();
    const offset = eventsCurrent * nodeW + nodeW / 2;
    if (instant) {
      const prev = timeline.style.transition;
      timeline.style.transition = "none";
      timeline.style.transform = `translate(${-offset}px, -50%)`;
      timeline.offsetHeight; // force reflow so the "none" transition actually applies
      timeline.style.transition = prev;
    } else {
      timeline.style.transform = `translate(${-offset}px, -50%)`;
    }
  }

  function applyEventsOrb(i) {
    const orbEl = $("#eventsOrb");
    if (!orbEl || !EVENTS_ORB_STOPS.length) return;
    const stop = EVENTS_ORB_STOPS[i % EVENTS_ORB_STOPS.length];
    orbEl.style.setProperty("--orb-x", stop.x);
    orbEl.style.setProperty("--orb-y", stop.y);
    orbEl.style.setProperty("--orb-scale", stop.scale);
  }

  function goToEvent(i) {
    if (eventsTransitioning || !eventsList.length) return;
    const clamped = Math.max(0, Math.min(eventsList.length - 1, i));
    if (clamped === eventsCurrent) return;
    eventsTransitioning = true;
    eventsCurrent = clamped;
    renderEventsDetail();
    updateTimelineActiveState();
    positionTimeline();
    applyEventsOrb(eventsCurrent);
    setTimeout(() => { eventsTransitioning = false; }, 650);
  }

  function renderEvents() {
    const emptyEl = $("#eventsEmptyState");
    const keepId = eventsList[eventsCurrent]?.id || null;
    const list = eventsSubtab === "discover" ? EVENTS : EVENTS.filter((e) => state.registeredEvents.includes(e.id));
    const isFirstRender = eventsList.length === 0 && eventsCurrent === 0 && !$("#eventsDetailCard");
    eventsList = list;

    if (!list.length) {
      $("#eventsDetail").innerHTML = "";
      $("#eventsTimeline").innerHTML = "";
      $("#eventsVerticalList").innerHTML = "";
      $("#eventsConnector").style.display = "none";
      emptyEl.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17"/></svg>
        <div>${esc(t("events.emptyMine"))}</div>
        <button class="btn btn-outline btn-sm" data-events-tab="discover">${esc(t("events.discoverBtn"))}</button>
      `;
      emptyEl.style.display = "flex";
      $$("#eventsEmptyState [data-events-tab]").forEach((b) => b.addEventListener("click", () => {
        eventsSubtab = b.dataset.eventsTab;
        $$("#eventsSubnav .chip").forEach((c) => c.classList.toggle("active", c.dataset.eventsTab === eventsSubtab));
        renderEvents();
      }));
      return;
    }

    emptyEl.style.display = "none";
    $("#eventsConnector").style.display = "";
    const found = keepId ? list.findIndex((e) => e.id === keepId) : -1;
    eventsCurrent = found !== -1 ? found : 0;
    renderEventsTimelineNodes();
    renderEventsDetail();
    positionTimeline(isFirstRender);
    applyEventsOrb(eventsCurrent);
    renderEventsVerticalList();
  }

  function eventRowHTML(ev) {
    const registered = state.registeredEvents.includes(ev.id);
    return `
      <div class="ev-row">
        <div class="ev-row-rail" aria-hidden="true">
          <span class="ev-row-dot"></span>
          <span class="ev-row-line"></span>
        </div>
        <div class="ev-row-body card event-card" data-event-id="${ev.id}">
          <span class="event-date-badge mono">${esc(fmtDateShort(ev.date, state.uiLang))} · 17:30</span>
          <h3 class="event-title-link" data-view-event="${ev.id}" role="button" tabindex="0">${esc(trEventTitle(ev))}</h3>
          <div class="topic-tags">${ev.tags.map((tg) => `<span class="tag">${esc(trTag(tg))}</span>`).join("")}</div>
          <p class="desc">${esc(trEventDesc(ev))}</p>
          <div class="row">
            <button class="btn btn-sm ${registered ? "btn-outline" : "btn-primary"}" data-register="${ev.id}">${registered ? t("common.registered") : t("common.register")}</button>
          </div>
        </div>
      </div>`;
  }

  function renderEventsVerticalList() {
    const list = $("#eventsVerticalList");
    list.innerHTML = eventsList.map(eventRowHTML).join("");
    $$("#eventsVerticalList [data-register]").forEach((b) => b.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = b.dataset.register;
      const i = state.registeredEvents.indexOf(id);
      if (i === -1) { state.registeredEvents.push(id); toast(t("toast.registered")); }
      else { state.registeredEvents.splice(i, 1); toast(t("toast.regRemoved")); }
      save(); renderEvents();
    }));
    $$("#eventsVerticalList [data-view-event]").forEach((el) => {
      const card = el.closest(".event-card") || el;
      el.addEventListener("click", () => openEventDetail(el.dataset.viewEvent, card));
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openEventDetail(el.dataset.viewEvent, card); }
      });
    });
  }

  function bindEventCardActions() {
    const card = $("#eventsDetailCard");
    if (!card) return;
    const registerBtn = card.querySelector("[data-register]");
    if (registerBtn) registerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = registerBtn.dataset.register;
      const i = state.registeredEvents.indexOf(id);
      if (i === -1) { state.registeredEvents.push(id); toast(t("toast.registered")); }
      else { state.registeredEvents.splice(i, 1); toast(t("toast.regRemoved")); }
      save(); renderEvents();
    });
    const titleLink = card.querySelector("[data-view-event]");
    if (titleLink) {
      titleLink.addEventListener("click", () => openEventDetail(titleLink.dataset.viewEvent, card));
      titleLink.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openEventDetail(titleLink.dataset.viewEvent, card); }
      });
    }
  }
  $$("#eventsSubnav [data-events-tab]").forEach((b) => b.addEventListener("click", () => {
    eventsSubtab = b.dataset.eventsTab;
    $$("#eventsSubnav .chip").forEach((c) => c.classList.toggle("active", c.dataset.eventsTab === eventsSubtab));
    renderEvents();
  }));

  let eventDetailReturnTab = "events";
  let currentOpenEventId = null;

  /* Shared-element (card-morphs-into-page) transitions, via the View
     Transitions API where supported. `sourceEl` is the card that was
     clicked — it carries a temporary view-transition-name so the browser
     morphs its old snapshot into the detail page's hero card instead of
     just cutting to the new view. Falls back to an instant swap when the
     API isn't available or there's no card to morph from. */
  function runCardTransition(sourceEl, heroSelector, updateFn) {
    if (!sourceEl || !document.startViewTransition) { updateFn(); return; }
    sourceEl.classList.add("vt-hero");
    const vt = document.startViewTransition(() => {
      sourceEl.classList.remove("vt-hero");
      updateFn();
      const hero = $(heroSelector);
      if (hero) hero.classList.add("vt-hero");
      // The browser's own crossfade already handles the page change — skip the
      // CSS fade-in so it doesn't double up with the hero morph.
      const activeView = $(".view.active");
      if (activeView) activeView.classList.add("vt-skip-anim");
    });
    // The browser can legitimately skip a transition (e.g. a slide's own CSS
    // transition was still settling) — that's a silent no-animation fallback,
    // not an error, but its promises reject and each needs a handler or the
    // rejection surfaces as unhandled.
    vt.ready.catch(() => {});
    vt.updateCallbackDone.catch(() => {});
    vt.finished.catch(() => {}).finally(() => {
      const hero = $(heroSelector);
      if (hero) hero.classList.remove("vt-hero");
      const activeView = $(".view.active");
      if (activeView) activeView.classList.remove("vt-skip-anim");
    });
  }

  function openEventDetail(id, sourceEl) {
    const ev = eventById(id);
    if (!ev) return;
    const current = $(".view.active")?.id.replace("view-", "") || "events";
    if (current !== "event-detail") eventDetailReturnTab = current;
    currentOpenEventId = id;

    runCardTransition(sourceEl, "#eventDetailBody .card", () => renderEventDetail(ev, id));
  }

  function renderEventDetail(ev, id) {
    $("#eventDetailTitle").textContent = trEventTitle(ev);
    $("#eventDetailDate").textContent = fmtDateLong(ev.date, state.uiLang);
    const registered = state.registeredEvents.includes(ev.id);
    $("#eventDetailBody").innerHTML = `
      <div class="two-col" style="align-items:start;">
        <div class="card">
          <span class="event-date-badge mono">${esc(fmtDateLong(ev.date, state.uiLang))}</span>
          <div class="topic-tags" style="margin-top:8px;">${ev.tags.map((tg) => `<span class="tag">${esc(trTag(tg))}</span>`).join("")}</div>
          <p class="desc" style="margin-top:10px;">${esc(trEventDesc(ev))}</p>
          <button class="btn ${registered ? "btn-outline" : "btn-primary"} btn-sm" style="margin-top:12px;" data-register="${ev.id}">${registered ? t("common.registered") : t("common.register")}</button>
        </div>
        <div class="card">
          <div class="section-title" style="margin-bottom:8px;">${esc(t("events.rundown"))}</div>
          <div class="timeline">${ev.rundown.map((r, i) => `
            <div class="timeline-item">
              <div class="timeline-time mono">${esc(r.time)}</div>
              <div class="timeline-dot-col"><div class="timeline-dot"></div>${i < ev.rundown.length - 1 ? '<div class="timeline-line"></div>' : ""}</div>
              <div class="timeline-body"><strong>${esc(trRundownItem(r))}</strong></div>
            </div>`).join("")}
          </div>
        </div>
      </div>
      <div class="card">
        <div class="section-title" style="margin-bottom:4px;">${esc(t("events.speakers"))}</div>
        ${ev.speakerIds.map((sid) => {
          const p = attendeeById(sid);
          return `<div class="speaker-row">
            ${avatarHTML(p.id, p.name, 46)}
            <div class="speaker-info">
              <div class="attendee-name" data-view-attendee="${p.id}" role="button" tabindex="0" style="cursor:pointer;">${esc(p.name)}</div>
              <div class="attendee-aff">${esc(p.affiliation)}</div>
              <div class="bio">${esc(trBio(p))}</div>
              <button class="btn btn-outline btn-sm" style="margin-top:8px;" data-message-person="${p.id}">${esc(t("common.message"))}</button>
            </div>
          </div>`;
        }).join("")}
      </div>
    `;
    setActiveTab("event-detail");
    $$("#eventDetailBody [data-register]").forEach((b) => b.addEventListener("click", () => {
      const i = state.registeredEvents.indexOf(id);
      if (i === -1) { state.registeredEvents.push(id); toast(t("toast.registered")); }
      else { state.registeredEvents.splice(i, 1); toast(t("toast.regRemoved")); }
      save(); renderEvents(); openEventDetail(id);
    }));
    $$("#eventDetailBody [data-message-person]").forEach((b) => b.addEventListener("click", () => {
      openConversationWith(b.dataset.messagePerson);
    }));
    $$("#eventDetailBody [data-view-attendee]").forEach((el) => {
      el.addEventListener("click", () => openAttendeeDetail(el.dataset.viewAttendee));
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openAttendeeDetail(el.dataset.viewAttendee); }
      });
    });
  }
  $("#eventDetailBackBtn").addEventListener("click", () => {
    // Symmetric morph back into the originating card — only when returning to
    // the events timeline, where the detail card is guaranteed present; other
    // return tabs (e.g. home) just get the normal instant switch.
    const heroCard = $("#eventDetailBody .card");
    const returnSelector = "#eventsDetailCard";
    const canMorph = eventDetailReturnTab === "events" && $(returnSelector);
    runCardTransition(canMorph ? heroCard : null, returnSelector, () => {
      setActiveTab(eventDetailReturnTab);
    });
  });

  /* ---------------- ATTENDEES ---------------- */

  let attendeesSubtab = "all";
  let categoryFilter = null;

  function computeRecommended() {
    const mine = new Set(state.profile.interests.map((s) => s.toLowerCase()));
    return ATTENDEES
      .map((a) => ({ a, score: a.interests.filter((i) => mine.has(i.toLowerCase())).length }))
      .filter((x) => x.score > 0)
      .sort((x, y) => y.score - x.score)
      .map((x) => x.a);
  }

  function attendeeCardHTML(a) {
    const bookmarked = state.bookmarks.includes(a.id);
    return `
      <div class="card attendee-card" data-attendee-id="${a.id}">
        <div class="attendee-top" data-view-attendee="${a.id}" role="button" tabindex="0">
          ${avatarHTML(a.id, a.name, 46)}
          <div>
            <div class="attendee-name">${esc(a.name)}</div>
            <div class="attendee-aff">${esc(a.affiliation)}</div>
            <span class="tag" style="margin-top:6px;display:inline-block;">${esc(trCategory(a.category))}</span>
          </div>
        </div>
        <div class="topic-tags">${a.interests.slice(0, 3).map((tg) => `<span class="tag">${esc(trTag(tg))}</span>`).join("")}</div>
        <div class="attendee-actions">
          <button class="btn btn-outline btn-sm" style="flex:1" data-message-person="${a.id}">${esc(t("common.message"))}</button>
          <button class="bookmark-btn ${bookmarked ? "active" : ""}" data-bookmark="${a.id}" aria-label="Bookmark ${esc(a.name)}" title="Bookmark">
            <svg viewBox="0 0 24 24" fill="${bookmarked ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.8"><path d="M6 3.5h12a1 1 0 011 1V21l-7-4-7 4V4.5a1 1 0 011-1z"/></svg>
          </button>
        </div>
      </div>`;
  }

  let attendeeDetailReturnTab = "attendees";
  let currentOpenAttendeeId = null;

  function openAttendeeDetail(id) {
    const a = attendeeById(id);
    if (!a) return;
    const current = $(".view.active")?.id.replace("view-", "") || "attendees";
    if (current !== "attendee-detail") attendeeDetailReturnTab = current;
    currentOpenAttendeeId = id;

    const bookmarked = state.bookmarks.includes(a.id);
    $("#attendeeDetailTitle").textContent = a.name;
    $("#attendeeDetailBody").innerHTML = `
      <div class="profile-view-head">
        ${avatarHTML(a.id, a.name, 64)}
        <div class="profile-view-heading">
          <div class="attendee-name" style="font-size:20px;">${esc(a.name)}</div>
          <div class="attendee-aff">${esc(a.affiliation)}</div>
          <span class="tag" style="margin-top:8px;display:inline-block;">${esc(trCategory(a.category))}</span>
        </div>
        <button class="bookmark-btn ${bookmarked ? "active" : ""}" id="attendeeDetailBookmarkBtn" aria-label="Bookmark ${esc(a.name)}" title="Bookmark" style="flex-shrink:0;">
          <svg viewBox="0 0 24 24" fill="${bookmarked ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.8"><path d="M6 3.5h12a1 1 0 011 1V21l-7-4-7 4V4.5a1 1 0 011-1z"/></svg>
        </button>
      </div>
      <p class="desc">${esc(trBio(a))}</p>
      <div>
        <div class="section-title" style="margin-bottom:8px;">${esc(t("profile.interests"))}</div>
        <div class="topic-tags">${a.interests.map((tg) => `<span class="tag">${esc(trTag(tg))}</span>`).join("")}</div>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        ${a.linkedin ? `<a href="${esc(a.linkedin)}" target="_blank" rel="noopener" class="btn btn-outline btn-sm">${esc(t("profile.linkedin"))}</a>` : ""}
        ${a.website ? `<a href="${esc(a.website)}" target="_blank" rel="noopener" class="btn btn-outline btn-sm">${esc(t("profile.website"))}</a>` : ""}
      </div>
      ${(a.languages && a.languages.length) ? `
      <div>
        <div class="section-title" style="margin-bottom:8px;">${esc(t("profile.languagesSpoken"))}</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${a.languages.map((l) => `
            <div class="lang-row">
              <span class="lang-row-name">${esc(l.lang)}</span>
              <div class="level-dots">${[1, 2, 3, 4, 5].map((n) => `<span class="level-dot ${n <= l.level ? "filled" : ""}"></span>`).join("")}</div>
            </div>`).join("")}
        </div>
      </div>` : ""}
      <button class="btn btn-primary btn-block" id="attendeeDetailMessageBtn">${esc(t("common.message"))}</button>
    `;
    setActiveTab("attendee-detail");
    $("#attendeeDetailBookmarkBtn").addEventListener("click", () => {
      const i = state.bookmarks.indexOf(a.id);
      if (i === -1) { state.bookmarks.push(a.id); toast(t("toast.bookmarked")); }
      else { state.bookmarks.splice(i, 1); toast(t("toast.bookmarkRemoved")); }
      save(); renderAttendees(); openAttendeeDetail(id);
    });
    $("#attendeeDetailMessageBtn").addEventListener("click", () => openConversationWith(a.id));
  }
  $("#attendeeDetailBackBtn").addEventListener("click", () => setActiveTab(attendeeDetailReturnTab));

  function renderCategoryRow() {
    const row = $("#categoryFilterRow");
    if (attendeesSubtab !== "category") { row.style.display = "none"; return; }
    row.style.display = "flex";
    if (!categoryFilter) categoryFilter = CATEGORIES[0];
    row.innerHTML = CATEGORIES.map((c) => `<button class="chip on-accent ${c === categoryFilter ? "active" : ""}" data-category="${esc(c)}">${esc(trCategory(c))}</button>`).join("");
    $$("#categoryFilterRow [data-category]").forEach((b) => b.addEventListener("click", () => {
      categoryFilter = b.dataset.category;
      renderAttendees();
    }));
  }

  function renderAttendees() {
    $$("#attendeesSubnav .chip").forEach((c) => c.classList.toggle("active", c.dataset.attendeesTab === attendeesSubtab));
    renderCategoryRow();
    let list;
    let emptyMsg = t("attendees.emptyGeneric");
    if (attendeesSubtab === "all") list = ATTENDEES;
    else if (attendeesSubtab === "recommended") { list = computeRecommended(); emptyMsg = t("attendees.emptyRecommended"); }
    else if (attendeesSubtab === "bookmarked") { list = ATTENDEES.filter((a) => state.bookmarks.includes(a.id)); emptyMsg = t("attendees.emptyBookmarked"); }
    else { list = ATTENDEES.filter((a) => a.category === categoryFilter); }

    const grid = $("#attendeesGrid");
    grid.innerHTML = list.length
      ? list.map(attendeeCardHTML).join("")
      : `<div class="empty-state" style="grid-column:1/-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/></svg>
          <div>${esc(emptyMsg)}</div>
        </div>`;

    $$("[data-bookmark]").forEach((b) => b.addEventListener("click", () => {
      const id = b.dataset.bookmark;
      const i = state.bookmarks.indexOf(id);
      if (i === -1) { state.bookmarks.push(id); toast(t("toast.bookmarked")); } else { state.bookmarks.splice(i, 1); toast(t("toast.bookmarkRemoved")); }
      save(); renderAttendees();
    }));
    $$("[data-message-person]").forEach((b) => b.addEventListener("click", () => openConversationWith(b.dataset.messagePerson)));
    $$("[data-view-attendee]").forEach((el) => {
      el.addEventListener("click", () => openAttendeeDetail(el.dataset.viewAttendee));
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openAttendeeDetail(el.dataset.viewAttendee); }
      });
    });
  }
  $$("#attendeesSubnav [data-attendees-tab]").forEach((b) => b.addEventListener("click", () => { attendeesSubtab = b.dataset.attendeesTab; renderAttendees(); }));

  /* ---------------- MESSAGES ---------------- */

  let activeConversation = null;
  let translateOn = true;
  const conversationDrafts = {};

  function renderConvList() {
    const ids = Object.keys(state.conversations);
    const list = $("#convList");
    if (!ids.length) {
      list.innerHTML = `<div class="empty-state"><div>${esc(t("messages.emptyConvList"))}</div></div>`;
      return;
    }
    list.innerHTML = ids.map((id) => {
      const p = attendeeById(id);
      const msgs = state.conversations[id];
      const last = msgs[msgs.length - 1];
      return `<button class="conv-item ${id === activeConversation ? "active" : ""}" data-conv="${id}">
        ${avatarHTML(p.id, p.name, 38)}
        <div class="conv-meta">
          <div class="conv-name">${esc(p.name)}</div>
          <div class="conv-preview">${last ? esc(last.text) : esc(t("messages.sayHelloPreview"))}</div>
        </div>
        <div class="conv-time">${last ? esc(last.time) : ""}</div>
      </button>`;
    }).join("");
    $$("[data-conv]").forEach((b) => b.addEventListener("click", () => selectConversation(b.dataset.conv)));
  }

  function renderThread() {
    const pane = $("#threadPane");
    const shell = $("#messagesShell");
    if (!activeConversation) {
      shell.classList.remove("thread-open");
      pane.innerHTML = `<div class="thread-empty">${esc(t("messages.selectConv"))}</div>`;
      return;
    }
    shell.classList.add("thread-open");
    const p = attendeeById(activeConversation);
    const msgs = state.conversations[activeConversation] || [];
    pane.innerHTML = `
      <div class="thread-head">
        <button class="icon-btn thread-back" id="threadBackBtn" aria-label="Back to conversations">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        ${avatarHTML(p.id, p.name, 34)}
        <div>
          <div class="conv-name">${esc(p.name)}</div>
          <div class="attendee-aff">${esc(p.affiliation)}</div>
        </div>
        <button class="icon-btn ${translateOn ? "active" : ""}" id="translateToggleBtn" style="margin-left:auto;" aria-label="Toggle auto-translate" title="Auto-translate messages (JA ⇄ EN, demo)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 4 5.8 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.8-4-9s1.5-6.5 4-9z"/></svg>
        </button>
      </div>
      <div class="thread-body" id="threadBody">
        ${msgs.map((m, i) => {
          const guess = translateOn ? mockTranslate(m.text) : null;
          return `
          <div class="bubble ${m.from === "me" ? "me" : "them"}">
            ${esc(m.text)}
            ${guess ? `<div class="bubble-translated" id="bubbleTranslated-${i}"><span class="translated-tag">${esc(guess.lang)}</span>${esc(guess.text)}</div>` : ""}
            <span class="t">${esc(m.time)}</span>
          </div>`;
        }).join("") || `<div class="thread-empty">${esc(t("messages.sayHello"))}</div>`}
      </div>
      <form class="thread-input" id="threadForm">
        <input type="text" id="threadInput" placeholder="${esc(t("messages.inputPlaceholder"))}" autocomplete="off" value="${esc(conversationDrafts[activeConversation] || "")}">
        <button class="btn btn-primary" type="submit">${esc(t("messages.send"))}</button>
      </form>
    `;
    $("#threadBody").scrollTop = $("#threadBody").scrollHeight;
    $("#threadBackBtn")?.addEventListener("click", () => { activeConversation = null; renderConvList(); renderThread(); });
    $("#translateToggleBtn").addEventListener("click", () => { translateOn = !translateOn; renderThread(); });
    if (translateOn) {
      const conv = activeConversation;
      msgs.forEach((m, i) => {
        translateMessage(m.text, (result) => {
          if (activeConversation !== conv || !translateOn) return; // conversation/toggle changed since — stale
          const el = $(`#bubbleTranslated-${i}`);
          if (!el) return;
          el.innerHTML = `<span class="translated-tag">${esc(result.lang)}</span>${esc(result.text)}`;
        });
      });
    }
    $("#threadInput").addEventListener("input", (e) => { conversationDrafts[activeConversation] = e.target.value; });
    $("#threadForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const input = $("#threadInput");
      const text = input.value.trim();
      if (!text) return;
      state.conversations[activeConversation].push({ from: "me", text, time: "Just now" });
      conversationDrafts[activeConversation] = "";
      save(); input.value = ""; renderThread(); renderConvList();
    });
  }

  function selectConversation(id) {
    activeConversation = id;
    if (!(id in conversationDrafts)) {
      const msgs = state.conversations[id] || [];
      const person = attendeeById(id);
      conversationDrafts[id] = msgs.length === 0 && person ? icebreakerFor(person) : "";
    }
    renderConvList(); renderThread();
  }

  function openConversationWith(personId) {
    if (!state.conversations[personId]) { state.conversations[personId] = []; save(); }
    setActiveTab("messages");
    selectConversation(personId);
  }

  /* ---------------- COMMUNITY ---------------- */

  let communitySubtab = "all";

  function groupCardHTML(g) {
    return `<div class="card group-card" data-group-id="${g.id}">
      <div class="group-top">
        <div class="group-icon">${esc(initials(g.name))}</div>
        <button class="chip ${g.following ? "active on-accent" : ""}" data-follow="${g.id}">${g.following ? t("community.following") : t("community.join")}</button>
      </div>
      <div>
        <h3 style="font-size:15.5px;">${esc(g.name)}</h3>
        <div class="group-members">${esc(trFmt("community.membersCount", { n: g.members }))} · ${esc(trGroupCategory(g.category))}</div>
      </div>
      <p class="group-desc">${esc(trGroupDesc(g))}</p>
      <button class="btn btn-ghost btn-sm" style="align-self:flex-start;" data-open-group="${g.id}">${esc(t("community.openGroup"))}</button>
    </div>`;
  }

  function renderCommunity() {
    $$("#communitySubnav .chip").forEach((c) => c.classList.toggle("active", c.dataset.communityTab === communitySubtab));
    const list = communitySubtab === "all" ? state.groups : state.groups.filter((g) => g.following);
    const grid = $("#communityGrid");
    grid.innerHTML = list.length ? list.map(groupCardHTML).join("") : `<div class="empty-state" style="grid-column:1/-1"><div>${esc(t("community.emptyFollowing"))}</div></div>`;
    $$("[data-follow]").forEach((b) => b.addEventListener("click", (e) => {
      e.stopPropagation();
      const g = groupById(b.dataset.follow);
      g.following = !g.following;
      save(); renderCommunity();
      toast(g.following ? trFmt("toast.joinedGroup", { name: g.name }) : trFmt("toast.leftGroup", { name: g.name }));
    }));
    $$("[data-open-group]").forEach((b) => b.addEventListener("click", () => openGroupModal(b.dataset.openGroup)));
  }
  $$("#communitySubnav [data-community-tab]").forEach((b) => b.addEventListener("click", () => { communitySubtab = b.dataset.communityTab; renderCommunity(); }));

  function openGroupModal(id) {
    const g = groupById(id);
    $("#groupModalTitle").textContent = g.name;
    const posts = state.groupPosts[id] || [];
    $("#groupModalBody").innerHTML = `
      <div>
        <div class="group-members">${esc(trFmt("community.membersCount", { n: g.members }))} · ${esc(trGroupCategory(g.category))}</div>
        <p class="desc" style="margin-top:6px;">${esc(trGroupDesc(g))}</p>
        <button class="chip ${g.following ? "active on-accent" : ""}" style="margin-top:10px;" data-follow="${g.id}">${g.following ? t("community.following") : t("community.joinGroup")}</button>
      </div>
      <div>
        <div class="section-title" style="margin-bottom:8px;">${esc(t("community.discussion"))}</div>
        <div id="groupPosts" style="display:flex;flex-direction:column;gap:10px;max-height:260px;overflow-y:auto;">
          ${posts.length ? posts.map((p) => `<div class="bubble them" style="max-width:100%;"><strong>${esc(p.author)}</strong> — ${esc(p.text)}<span class="t">${esc(p.time)}</span></div>`).join("") : `<div class="hint">${esc(t("community.noPosts"))}</div>`}
        </div>
        <form class="thread-input" id="groupPostForm" style="padding:12px 0 0;border-top:none;">
          <input type="text" id="groupPostInput" placeholder="${esc(t("community.postPlaceholder"))}" autocomplete="off">
          <button class="btn btn-primary" type="submit">${esc(t("community.post"))}</button>
        </form>
      </div>
    `;
    openModal("groupModalBackdrop");
    $("#groupModalBody [data-follow]").addEventListener("click", () => { g.following = !g.following; save(); renderCommunity(); openGroupModal(id); });
    $("#groupPostForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const input = $("#groupPostInput");
      const text = input.value.trim();
      if (!text) return;
      if (!state.groupPosts[id]) state.groupPosts[id] = [];
      state.groupPosts[id].push({ author: state.profile.name || "You", text, time: "Just now" });
      save(); input.value = ""; openGroupModal(id);
    });
  }

  $("#newGroupBtn").addEventListener("click", () => { $("#newGroupFormWrap").style.display = "block"; });
  $("#ngCancel").addEventListener("click", () => { $("#newGroupFormWrap").style.display = "none"; });
  $("#ngCreate").addEventListener("click", () => {
    const name = $("#ngName").value.trim();
    if (!name) { toast(t("community.giveNameFirst")); return; }
    const g = { id: "g" + Date.now(), name, category: $("#ngCategory").value.trim() || "Topic", members: 1, desc: $("#ngDesc").value.trim() || "New group.", following: true };
    state.groups.unshift(g);
    save();
    $("#ngName").value = ""; $("#ngCategory").value = ""; $("#ngDesc").value = "";
    $("#newGroupFormWrap").style.display = "none";
    renderCommunity();
    toast(t("toast.groupCreated"));
  });

  /* ---------------- PROFILE ---------------- */

  function attachTagInput(container, tags, onChange) {
    function draw() {
      container.querySelectorAll(".tag-pill").forEach((el) => el.remove());
      const input = container.querySelector("input");
      tags.slice().forEach((t, idx) => {
        const pill = document.createElement("span");
        pill.className = "tag-pill";
        pill.innerHTML = `${esc(t)} <button type="button" aria-label="Remove ${esc(t)}">×</button>`;
        pill.querySelector("button").addEventListener("click", () => { tags.splice(idx, 1); draw(); onChange(); });
        container.insertBefore(pill, input);
      });
    }
    const input = container.querySelector("input");
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const v = input.value.trim();
        if (v) { tags.push(v); input.value = ""; draw(); onChange(); }
      } else if (e.key === "Backspace" && !input.value && tags.length) {
        tags.pop(); draw(); onChange();
      }
    });
    draw();
  }

  function renderLanguages() {
    const wrap = $("#pfLanguages");
    wrap.innerHTML = state.profile.languages.map((l, idx) => `
      <div class="lang-row" data-lang-idx="${idx}">
        <input type="text" value="${esc(l.lang)}" placeholder="${esc(t("profile.languagePlaceholder"))}">
        <div class="level-dots">${[1, 2, 3, 4, 5].map((n) => `<button type="button" class="level-dot ${n <= l.level ? "filled" : ""}" data-level="${n}" aria-label="Level ${n}"></button>`).join("")}</div>
        <button type="button" class="remove-row" aria-label="Remove language">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>`).join("");
    $$("#pfLanguages .lang-row").forEach((row) => {
      const idx = Number(row.dataset.langIdx);
      row.querySelector('input[type="text"]').addEventListener("input", (e) => { state.profile.languages[idx].lang = e.target.value; });
      row.querySelectorAll(".level-dot").forEach((dot) => dot.addEventListener("click", () => {
        state.profile.languages[idx].level = Number(dot.dataset.level);
        renderLanguages();
      }));
      row.querySelector(".remove-row").addEventListener("click", () => { state.profile.languages.splice(idx, 1); renderLanguages(); });
    });
  }
  $("#pfAddLang").addEventListener("click", () => { state.profile.languages.push({ lang: "", level: 3 }); renderLanguages(); });

  let profileReturnTab = "home";

  function readAndResizeImage(file, maxDim, callback) {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height) { if (width > maxDim) { height = Math.round(height * (maxDim / width)); width = maxDim; } }
        else { if (height > maxDim) { width = Math.round(width * (maxDim / height)); height = maxDim; } }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  let pendingPhoto = "";

  function renderPhotoPreview() {
    const el = $("#pfPhotoPreview");
    el.innerHTML = pendingPhoto
      ? `<img src="${pendingPhoto}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;">`
      : avatarHTML("me", state.profile.name || "You", 72);
    $("#pfRemovePhotoBtn").style.display = pendingPhoto ? "inline-flex" : "none";
  }

  $("#pfUploadPhotoBtn").addEventListener("click", () => $("#pfPhotoInput").click());
  $("#pfPhotoInput").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    readAndResizeImage(file, 300, (dataUrl) => { pendingPhoto = dataUrl; renderPhotoPreview(); });
  });
  $("#pfRemovePhotoBtn").addEventListener("click", () => {
    pendingPhoto = "";
    $("#pfPhotoInput").value = "";
    renderPhotoPreview();
  });

  function renderProfileView() {
    const p = state.profile;
    $("#profileViewAvatar").innerHTML = p.photo
      ? `<img src="${p.photo}" alt="" style="width:100%;height:100%;border-radius:50%;object-fit:cover;display:block;">`
      : avatarHTML("me", p.name || "You", 64);
    $("#pvName").textContent = p.name || "You";
    $("#pvAffiliation").textContent = p.affiliation || "";
    $("#pvCategory").textContent = trCategory(p.category);
    $("#pvBackground").textContent = p.background || "";

    $("#pvEmailRow").innerHTML = p.email
      ? `<a href="mailto:${esc(p.email)}" class="attendee-aff">${esc(p.email)}</a>` : "";

    $("#pvInterests").innerHTML = p.interests.map((tg) => `<span class="tag">${esc(tg)}</span>`).join("");
    $("#pvTopics").innerHTML = p.businessTopics.map((tg) => `<span class="tag">${esc(tg)}</span>`).join("");

    const links = [];
    if (p.linkedin) links.push(`<a href="${esc(p.linkedin)}" target="_blank" rel="noopener" class="btn btn-outline btn-sm">${esc(t("profile.linkedin"))}</a>`);
    if (p.website) links.push(`<a href="${esc(p.website)}" target="_blank" rel="noopener" class="btn btn-outline btn-sm">${esc(t("profile.website"))}</a>`);
    $("#pvLinksRow").innerHTML = links.join("");

    $("#pvLanguages").innerHTML = p.languages.map((l) => `
      <div class="lang-row">
        <span class="lang-row-name">${esc(l.lang || "—")}</span>
        <div class="level-dots">${[1, 2, 3, 4, 5].map((n) => `<span class="level-dot ${n <= l.level ? "filled" : ""}"></span>`).join("")}</div>
      </div>`).join("");
  }

  function showProfileView() {
    renderProfileView();
    $("#profileViewCard").style.display = "flex";
    $("#profileEditCard").style.display = "none";
  }

  function showProfileEdit() {
    const p = state.profile;
    $("#pfName").value = p.name;
    $("#pfAffiliation").value = p.affiliation;
    $("#pfEmail").value = p.email;
    $("#pfCategory").value = p.category;
    $("#pfBackground").value = p.background;
    $("#pfLinkedin").value = p.linkedin;
    $("#pfWebsite").value = p.website;
    attachTagInput($("#pfInterestsInput"), p.interests, () => {});
    attachTagInput($("#pfTopicsInput"), p.businessTopics, () => {});
    renderLanguages();
    pendingPhoto = p.photo || "";
    renderPhotoPreview();
    $("#profileViewCard").style.display = "none";
    $("#profileEditCard").style.display = "flex";
  }

  function isProfileEditing() { return $("#profileEditCard").style.display !== "none"; }

  function openProfilePage() {
    const current = $(".view.active")?.id.replace("view-", "") || "home";
    if (current !== "profile") profileReturnTab = current;
    showProfileView();
    setActiveTab("profile");
  }
  $("#openProfileBtn").addEventListener("click", openProfilePage);
  $("#profileBackBtn").addEventListener("click", () => setActiveTab(profileReturnTab));
  $("#profileEditBtn").addEventListener("click", showProfileEdit);
  $("#pfCancel").addEventListener("click", showProfileView);

  $("#pfSave").addEventListener("click", () => {
    const p = state.profile;
    p.name = $("#pfName").value.trim() || "You";
    p.affiliation = $("#pfAffiliation").value.trim();
    p.email = $("#pfEmail").value.trim();
    p.category = $("#pfCategory").value;
    p.background = $("#pfBackground").value.trim();
    p.linkedin = $("#pfLinkedin").value.trim();
    p.website = $("#pfWebsite").value.trim();
    p.photo = pendingPhoto;
    save();
    renderHeaderAvatar();
    renderAttendees();
    showProfileView();
    toast(t("toast.profileSaved"));
  });

  function renderHeaderAvatar() {
    const el = $("#headerAvatar");
    if (state.profile.photo) {
      el.style.background = "none";
      el.innerHTML = `<img src="${state.profile.photo}" alt="" style="width:100%;height:100%;border-radius:50%;object-fit:cover;display:block;">`;
    } else {
      const s = avatarStyleFor("me");
      el.style.background = s.bg;
      el.style.color = s.fg;
      el.textContent = initials(state.profile.name || "You");
    }
  }

  /* ---------------- theme toggle (light is the default look; dark is the override) ---------------- */

  $("#themeToggle").addEventListener("click", () => {
    const root = document.documentElement;
    const isDark = root.getAttribute("data-theme") === "dark";
    root.setAttribute("data-theme", isDark ? "light" : "dark");
  });

  /* ---------------- page language switch (top right, EN / JA) ---------------- */

  function applyStaticTranslations() {
    $$("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    $$("[data-i18n-placeholder]").forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    document.documentElement.lang = state.uiLang;
  }

  function setLanguage(lang) {
    state.uiLang = lang === "ja" ? "ja" : "en";
    save();
    $$("#langSwitch .lang-switch-btn").forEach((b) => b.classList.toggle("active", b.dataset.lang === state.uiLang));
    applyStaticTranslations();
    renderHeaderAvatar();
    renderHome();
    renderEvents();
    renderAttendees();
    renderConvList();
    renderThread();
    renderCommunity();
    const activeView = $(".view.active")?.id;
    if (activeView === "view-event-detail" && currentOpenEventId) openEventDetail(currentOpenEventId);
    if (activeView === "view-attendee-detail" && currentOpenAttendeeId) openAttendeeDetail(currentOpenAttendeeId);
    if (activeView === "view-profile") { if (isProfileEditing()) showProfileEdit(); else renderProfileView(); }
    translateWholePage(state.uiLang);
  }

  $$("#langSwitch .lang-switch-btn").forEach((b) => b.addEventListener("click", () => setLanguage(b.dataset.lang)));

  /* ---------------- Google Translate safety net ----------------
     UI_STRINGS and the per-item *Ja fields cover the app's curated bilingual
     content; this catches whatever slips through (freeform profile text,
     anything not in the dictionary) by asking Google's Translate Element
     widget — loaded in index.html — to auto-translate whatever's left on
     the page. It's a best-effort supplement, not a replacement: silently
     does nothing if translate.google.com is unreachable (ad blockers
     commonly block it) or the widget hasn't finished loading yet, so the
     app's own translations always work regardless. */
  function translateWholePage(lang, attempt) {
    const combo = document.querySelector("#google_translate_element select.goog-te-combo");
    if (!combo) {
      if ((attempt || 0) < 20) setTimeout(() => translateWholePage(lang, (attempt || 0) + 1), 250);
      return;
    }
    const targetValue = lang === "ja" ? "ja" : "";
    if (combo.value === targetValue) return;
    combo.value = targetValue;
    combo.dispatchEvent(new Event("change"));
  }

  /* ---------------- editorial chrome recede-on-scroll ---------------- */

  function wireRecedingChrome(scrollSource) {
    let lastY = scrollSource === window ? window.scrollY : scrollSource.scrollTop;
    scrollSource.addEventListener("scroll", () => {
      const y = scrollSource === window ? window.scrollY : scrollSource.scrollTop;
      const receded = y > lastY && y > 80;
      $("#tabnav").classList.toggle("is-receded", receded);
      $(".app-header").classList.toggle("is-receded", receded);
      lastY = y;
    }, { passive: true });
  }

  /* ---------------- Story pager: paced, non-scrolling slide transitions ----------------
     Shared by Home (vertical) and Events (horizontal). Instead of native scrolling
     (which reads as "scrolling"), each gesture advances exactly one slide. A single
     persistent element (.story-orb) glides and resizes between per-slide anchor
     points, so the change reads as one continuous scene carrying an element from
     the previous slide into the next, not a page scroll. Slides can be swapped out
     later via loadSlides() (e.g. when the Events list is filtered). */

  function createStoryPager({ root, axis, orbEl, orbStops, dotsParent, onSlideChange }) {
    let slides = [];
    let dots = [];
    let current = 0;
    let transitioning = false;

    const dotsWrap = document.createElement("div");
    dotsWrap.className = axis === "x" ? "story-dots story-dots-row" : "story-dots";
    dotsWrap.setAttribute("role", "tablist");
    dotsWrap.setAttribute("aria-label", "Story slides");
    (dotsParent || root).appendChild(dotsWrap);

    function setSlide(i) {
      current = i;
      slides.forEach((s, idx) => s.classList.toggle("is-active-slide", idx === i));
      dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
      if (orbEl && orbStops && orbStops.length) {
        const stop = orbStops[i % orbStops.length];
        orbEl.style.setProperty("--orb-x", stop.x);
        orbEl.style.setProperty("--orb-y", stop.y);
        orbEl.style.setProperty("--orb-scale", stop.scale);
      }
      if (onSlideChange) onSlideChange(i);
    }

    function goToSlide(i) {
      if (!slides.length) return;
      const clamped = Math.max(0, Math.min(slides.length - 1, i));
      if (clamped === current || transitioning) return;
      transitioning = true;
      setSlide(clamped);
      setTimeout(() => { transitioning = false; }, 700);
    }

    function loadSlides(newSlides, opts = {}) {
      slides = newSlides;
      dotsWrap.innerHTML = "";
      dotsWrap.style.display = slides.length > 1 ? "" : "none";
      dots = slides.map((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "story-dot";
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", `Slide ${i + 1}`);
        dot.addEventListener("click", () => goToSlide(i));
        dotsWrap.appendChild(dot);
        return dot;
      });
      transitioning = false;
      // Re-rendering the list (a filter switch, a registration toggle) shouldn't
      // silently bump the visible slide back to the start if the item that was
      // showing is still present — find where it landed instead.
      let idx = 0;
      if (opts.keepMatch) {
        const found = slides.findIndex(opts.keepMatch);
        if (found !== -1) idx = found;
      }
      setSlide(idx);
    }

    root.addEventListener("wheel", (e) => {
      if (!slides.length) return;
      e.preventDefault();
      const delta = axis === "x" ? (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) : e.deltaY;
      if (transitioning || Math.abs(delta) < 8) return;
      goToSlide(current + (delta > 0 ? 1 : -1));
    }, { passive: false });

    let touchStart = null;
    root.addEventListener("touchstart", (e) => {
      if (!slides.length) return;
      touchStart = axis === "x" ? e.touches[0].clientX : e.touches[0].clientY;
    }, { passive: true });
    root.addEventListener("touchend", (e) => {
      if (touchStart === null) return;
      const end = axis === "x" ? e.changedTouches[0].clientX : e.changedTouches[0].clientY;
      const d = touchStart - end;
      touchStart = null;
      if (Math.abs(d) < 40) return;
      goToSlide(current + (d > 0 ? 1 : -1));
    }, { passive: true });

    return {
      loadSlides,
      goToSlide,
      reset: () => setSlide(0),
      get current() { return current; },
    };
  }

  const HOME_ORB_STOPS = [
    { x: "80%", y: "26%", scale: 1 },
    { x: "20%", y: "72%", scale: 1.6 },
    { x: "78%", y: "80%", scale: 0.9 },
    { x: "50%", y: "50%", scale: 2.2 },
    { x: "16%", y: "22%", scale: 1.1 },
    { x: "84%", y: "62%", scale: 1.3 },
  ];

  // Per-slide anchor points for the 5 geo shapes (#geo1..#geo5) — each one
  // drifts from its slide's spot to a different spot on the next slide, same
  // idea as the orb. `wash` blooms up big and orange on the two "brand
  // moment" slides (the zoom/slogan and the logo reveal) and recedes to
  // near-nothing elsewhere, so those two transitions read as the geometry
  // itself washing the background from white to orange rather than a plain
  // color cut.
  const GEO_STOPS = [
    { // 0 — title
      shapes: [
        { x: "8%", y: "16%", scale: 1, rot: -10 },
        { x: "90%", y: "20%", scale: .8, rot: 0 },
        { x: "12%", y: "85%", scale: 1, rot: 15 },
        { x: "92%", y: "88%", scale: 1.2, rot: -15 },
        { x: "4%", y: "52%", scale: .6, rot: 0 },
      ],
      wash: { x: "50%", y: "50%", scale: .3, opacity: 0 },
    },
    { // 1 — zoom + slogan: wash blooms
      shapes: [
        { x: "85%", y: "15%", scale: 1.1, rot: 10 },
        { x: "10%", y: "22%", scale: .7, rot: -8 },
        { x: "88%", y: "80%", scale: 1.2, rot: 20 },
        { x: "8%", y: "90%", scale: 1, rot: 5 },
        { x: "94%", y: "50%", scale: .5, rot: 0 },
      ],
      wash: { x: "50%", y: "45%", scale: 3.4, opacity: .3 },
    },
    { // 2 — weekly evening detail
      shapes: [
        { x: "15%", y: "85%", scale: .9, rot: 5 },
        { x: "85%", y: "12%", scale: 1, rot: -10 },
        { x: "10%", y: "15%", scale: .8, rot: 0 },
        { x: "85%", y: "85%", scale: 1.3, rot: 15 },
        { x: "50%", y: "92%", scale: .6, rot: 0 },
      ],
      wash: { x: "20%", y: "80%", scale: .4, opacity: 0 },
    },
    { // 3 — logo reveal: wash blooms again
      shapes: [
        { x: "12%", y: "20%", scale: 1, rot: -15 },
        { x: "88%", y: "18%", scale: .8, rot: 10 },
        { x: "14%", y: "82%", scale: 1.1, rot: 0 },
        { x: "86%", y: "84%", scale: 1, rot: -20 },
        { x: "50%", y: "6%", scale: .5, rot: 0 },
      ],
      wash: { x: "50%", y: "50%", scale: 3.8, opacity: .28 },
    },
    { // 4 — upcoming events
      shapes: [
        { x: "6%", y: "40%", scale: .8, rot: 10 },
        { x: "94%", y: "35%", scale: 1, rot: -5 },
        { x: "20%", y: "90%", scale: 1, rot: 15 },
        { x: "80%", y: "8%", scale: 1.2, rot: 0 },
        { x: "50%", y: "95%", scale: .6, rot: -10 },
      ],
      wash: { x: "80%", y: "20%", scale: .3, opacity: 0 },
    },
    { // 5 — testimonial
      shapes: [
        { x: "90%", y: "60%", scale: 1, rot: 20 },
        { x: "8%", y: "70%", scale: .8, rot: 0 },
        { x: "50%", y: "8%", scale: .9, rot: -10 },
        { x: "15%", y: "12%", scale: 1.1, rot: 10 },
        { x: "85%", y: "92%", scale: .5, rot: 0 },
      ],
      wash: { x: "50%", y: "50%", scale: .3, opacity: 0 },
    },
  ];

  // Shared by both Home layouts: point the orb/geo shapes/wash/backgrounds at
  // whatever slide index i, wherever that index came from (a discrete pager
  // jump on desktop, or "whichever slide the IntersectionObserver says is in
  // view" on mobile).
  function applyHomeDecorFor(i) {
    const storyHome = $("#storyHome");
    const geoEls = [1, 2, 3, 4, 5].map((n) => $(`#geo${n}`));
    const washEl = $("#geoWash");
    const bgEls = $$(".slide-bg-global", storyHome);
    const stop = GEO_STOPS[i % GEO_STOPS.length];
    geoEls.forEach((el, idx) => {
      const s = stop.shapes[idx];
      if (!el || !s) return;
      el.style.setProperty("--gx", s.x);
      el.style.setProperty("--gy", s.y);
      el.style.setProperty("--gs", s.scale);
      el.style.setProperty("--gr", `${s.rot}deg`);
      el.style.setProperty("--go", 1);
    });
    if (washEl && stop.wash) {
      washEl.style.setProperty("--wx", stop.wash.x);
      washEl.style.setProperty("--wy", stop.wash.y);
      washEl.style.setProperty("--ws", stop.wash.scale);
      washEl.style.setProperty("--wo", stop.wash.opacity);
    }
    bgEls.forEach((el) => el.classList.toggle("is-active-bg", Number(el.dataset.bgFor) === i));
    const orbEl = $("#storyOrb");
    const orbStop = HOME_ORB_STOPS[i % HOME_ORB_STOPS.length];
    if (orbEl && orbStop) {
      orbEl.style.setProperty("--orb-x", orbStop.x);
      orbEl.style.setProperty("--orb-y", orbStop.y);
      orbEl.style.setProperty("--orb-scale", orbStop.scale);
    }
  }

  function isMobileHomeLayout() { return window.matchMedia("(max-width: 767px)").matches; }

  function initStorySlidesDesktop(storyHome) {
    const pager = createStoryPager({
      root: storyHome,
      axis: "y",
      orbEl: $("#storyOrb"),
      orbStops: HOME_ORB_STOPS,
      dotsParent: storyHome,
      onSlideChange: applyHomeDecorFor,
    });
    pager.loadSlides($$(".story-slide", storyHome));

    window.addEventListener("keydown", (e) => {
      if ($(".view.active")?.id !== "view-home") return;
      if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); pager.goToSlide(pager.current + 1); }
      else if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); pager.goToSlide(pager.current - 1); }
    });

    $("#scrollCueBtn").addEventListener("click", () => pager.goToSlide(1));

    storyHome._resetStory = () => pager.reset();
  }

  // Phone: a real scrollable, scroll-snapped story instead of the JS-paced
  // pager — wheel/swipe-driven discrete jumps don't map naturally onto touch
  // scrolling, so below the breakpoint each slide is just a normal-flow,
  // full-height, snap-aligned section and native scroll (with momentum,
  // rubber-banding, all of it) does the rest. An IntersectionObserver tracks
  // which slide is currently in view to drive the same orb/geo/background
  // decorations, dot pagination, and per-slide content reveal as before.
  function initStorySlidesMobile(storyHome) {
    const scroller = $("#storySlidesScroll") || storyHome;
    const slides = $$(".story-slide", scroller);
    if (!slides.length) return;
    let current = 0;

    const dotsWrap = document.createElement("div");
    dotsWrap.className = "story-dots";
    dotsWrap.setAttribute("role", "tablist");
    dotsWrap.setAttribute("aria-label", "Story slides");
    slides.forEach((s, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "story-dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Slide ${i + 1}`);
      dot.addEventListener("click", () => s.scrollIntoView({ behavior: "smooth", block: "start" }));
      dotsWrap.appendChild(dot);
    });
    storyHome.appendChild(dotsWrap);
    const dots = $$(".story-dot", dotsWrap);

    function setActive(i) {
      current = i;
      slides.forEach((s, idx) => s.classList.toggle("is-active-slide", idx === i));
      dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
      applyHomeDecorFor(i);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
          const idx = slides.indexOf(entry.target);
          if (idx !== -1 && idx !== current) setActive(idx);
        }
      });
    }, { root: scroller, threshold: [0.6] });
    slides.forEach((s) => observer.observe(s));

    $("#scrollCueBtn").addEventListener("click", () => slides[1]?.scrollIntoView({ behavior: "smooth", block: "start" }));

    setActive(0);
    storyHome._resetStory = () => {
      scroller.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
      setActive(0);
    };
  }

  function initStorySlides() {
    const storyHome = $("#storyHome");
    // Exclusive, decided once at load: both attach gesture handlers to the
    // same element, and createStoryPager's wheel/touch handling has no
    // knowledge of the mobile layout, so running both at once would fight
    // over the same swipe (native scroll-snap vs. a discrete pager jump).
    if (isMobileHomeLayout()) initStorySlidesMobile(storyHome);
    else initStorySlidesDesktop(storyHome);
  }

  const EVENTS_ORB_STOPS = [
    { x: "18%", y: "24%", scale: 1.2 },
    { x: "84%", y: "70%", scale: 1.6 },
    { x: "22%", y: "76%", scale: 1 },
    { x: "80%", y: "22%", scale: 1.4 },
  ];

  // Timeline: wheel/swipe/keys/dot-click all just call goToEvent(), which
  // re-renders the detail panel and slides the timeline track — see
  // goToEvent(), positionTimeline(), renderEventsTimelineNodes() above.
  // Below 767px the horizontal timeline is swapped out for the vertical list
  // (see the CSS media query), which relies on plain native scrolling — so
  // none of this pager's gesture handling should engage there.
  function isMobileEventsLayout() { return window.matchMedia("(max-width: 767px)").matches; }

  function initEventsTimeline() {
    const storyEvents = $("#storyEvents");

    storyEvents.addEventListener("wheel", (e) => {
      if (!eventsList.length || isMobileEventsLayout()) return;
      e.preventDefault();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (eventsTransitioning || Math.abs(delta) < 8) return;
      goToEvent(eventsCurrent + (delta > 0 ? 1 : -1));
    }, { passive: false });

    let touchStart = null;
    storyEvents.addEventListener("touchstart", (e) => {
      if (!eventsList.length || isMobileEventsLayout()) return;
      touchStart = e.touches[0].clientX;
    }, { passive: true });
    storyEvents.addEventListener("touchend", (e) => {
      if (touchStart === null || isMobileEventsLayout()) return;
      const d = touchStart - e.changedTouches[0].clientX;
      touchStart = null;
      if (Math.abs(d) < 40) return;
      goToEvent(eventsCurrent + (d > 0 ? 1 : -1));
    }, { passive: true });

    window.addEventListener("keydown", (e) => {
      if ($(".view.active")?.id !== "view-events" || isMobileEventsLayout()) return;
      if (e.key === "ArrowRight") { e.preventDefault(); goToEvent(eventsCurrent + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); goToEvent(eventsCurrent - 1); }
    });
  }

  /* ---------------- init ---------------- */

  setLanguage(state.uiLang);
  initStorySlides();
  initEventsTimeline();
  renderEvents();
  wireRecedingChrome(window);
})();
