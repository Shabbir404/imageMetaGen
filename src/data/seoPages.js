// Each page is data, not markup — the template in GuidePage.jsx renders
// this structure. To add a new page later, just add a new object here.

export const seoPages = [
  {
    slug: "what-is-a-csv-metadata-generator",
    navLabel: "What is a CSV Metadata Generator?",
    metaTitle: "What Is a CSV Metadata Generator for Stock Photos?",
    metaDescription:
      "Learn what a CSV metadata generator does, why metadata determines whether your stock photos sell, and how AI-generated titles, descriptions, and keywords save hours of manual work.",
    title: "What Is a CSV Metadata Generator for Stock Photos?",
    subtitle:
      "Before a single image can sell on any microstock platform, it needs metadata. Here's what that actually means.",
    sections: [
      {
        type: "p",
        content:
          "A CSV metadata generator is a tool that produces a structured spreadsheet — a Title, Description, and set of Keywords for every photo, illustration, or video clip you upload. Instead of typing that information by hand for each file, you drop your batch into the tool, and it analyzes each item and writes the metadata for you.",
      },
      {
        type: "p",
        content:
          "The output file is built to be imported directly into a stock agency's bulk-upload tool, which removes the single most time-consuming part of contributing to microstock. Writing accurate metadata for a hundred images by hand can eat up most of a working day; an automated pass over the same batch typically takes minutes.",
      },
      { type: "h2", content: "Why metadata decides whether you make a sale" },
      {
        type: "p",
        content:
          "Every major stock platform is search-first. Buyers type a query, and the platform's ranking algorithm decides which files show up. A technically excellent photo with weak or missing metadata is functionally invisible — it never surfaces in a relevant search, so it never gets seen, and it never sells. Metadata isn't a formality you fill in after the real work is done; for a stock contributor, it is the real work.",
      },
      {
        type: "ul",
        heading: "The three fields every platform relies on",
        items: [
          "Title — a natural-language sentence, not a keyword dump, that leads with the main subject. This is usually the single most heavily weighted field in a platform\u2019s search ranking.",
          "Description — a short narrative giving context a title can\u2019t: setting, mood, likely use case, and secondary detail a buyer might search for.",
          "Keywords — a list of individual search terms a real buyer would type, ordered roughly by relevance, with no repeats.",
        ],
      },
      { type: "h2", content: "Why CSV specifically" },
      {
        type: "p",
        content:
          "CSV (comma-separated values) is the format nearly every agency's bulk uploader accepts, because it's simple, universal, and editable in Excel or Google Sheets before you submit it. One CSV file can carry metadata for an entire batch — hundreds of files — mapped by filename, so you never touch each image's metadata screen individually.",
      },
      {
        type: "ul",
        heading: "Why agencies standardized on it",
        items: [
          "Universal — accepted across Adobe Stock, Shutterstock, Freepik, Pond5, Vecteezy, and most others without conversion.",
          "Editable — open it in any spreadsheet tool and adjust anything before you submit.",
          "Scalable — one file, any batch size.",
          "Consistent — batch-generated metadata avoids the gaps and inconsistency that creep in when you're doing it manually, one file at a time, for hours.",
        ],
      },
    ],
  },

  {
    slug: "platform-metadata-guide",
    navLabel: "Platform-by-Platform Metadata Guide",
    metaTitle: "Complete Platform-by-Platform Stock Metadata Guide",
    metaDescription:
      "Title limits, keyword rules, and submission requirements for Adobe Stock, Shutterstock, iStock, Getty, Pond5, Vecteezy, and Freepik — and how to avoid common rejection reasons.",
    title: "Complete Platform-by-Platform Metadata Guide",
    subtitle:
      "Every agency has its own rules for titles, keyword counts, and formatting. Getting them wrong is one of the most common reasons files get rejected or buried in search.",
    sections: [
      {
        type: "p",
        content:
          "The guidance below reflects each platform's general submission norms. Agencies do update their specifications periodically, so it's worth a quick check against the platform's current contributor documentation before a large batch — but the shape of what each one cares about doesn't change often.",
      },
      {
        type: "specs",
        platform: "Adobe Stock",
        color: "#e0687a",
        note: "Adobe's Sensei-powered search leans heavily on title quality and the order of your first few keywords.",
        titleRules: [
          "Natural-language sentence, not a keyword string",
          "Lead with subject, then action, then setting",
          "Keep it descriptive rather than stuffed",
        ],
        keywordRules: [
          "Up to 49 keywords",
          "Order matters — put the most relevant terms first",
          "No duplicates — flagged files get rejected",
        ],
      },
      {
        type: "specs",
        platform: "Shutterstock",
        color: "#e0a458",
        note: "Shutterstock runs one of the stricter quality filters in the industry — spammy or thin metadata risks more than just poor ranking.",
        titleRules: [
          "Full descriptive sentence, not a keyword list",
          "Avoid repeating a keyword verbatim inside the title",
        ],
        keywordRules: [
          "Around 50 keywords max",
          "A handful of keywords minimum is generally expected for approval",
          "Lowercase, comma-separated, no near-duplicates",
        ],
      },
      {
        type: "specs",
        platform: "iStock / Getty Images",
        color: "#5b7fff",
        note: "iStock and Getty share editorial review standards — accuracy and relevance matter more here than keyword volume.",
        titleRules: [
          "Concise and literal — describe exactly what\u2019s in frame",
          "Avoid speculative or interpretive language",
        ],
        keywordRules: [
          "Moderate keyword counts, prioritizing precision over volume",
          'Include both broad and specific terms (e.g. "fruit" and "sliced orange")',
        ],
      },
      {
        type: "specs",
        platform: "Pond5",
        color: "#c88bfa",
        note: "Pond5 places significant weight on keyword breadth for video content specifically.",
        titleRules: [
          "Clear, literal description of the clip or image",
          "Include format context for video (e.g. slow motion, aerial)",
        ],
        keywordRules: [
          "Higher keyword ceilings than photo-only platforms",
          "Include technical terms (shot type, motion, resolution) alongside subject terms",
        ],
      },
      {
        type: "specs",
        platform: "Vecteezy",
        color: "#5fd48a",
        note: "Vecteezy skews toward vector and illustration content, so style-descriptive keywords matter more than they do on photo-first platforms.",
        titleRules: [
          "Describe subject plus style (flat, isometric, line art, etc.)",
        ],
        keywordRules: [
          "Include style and use-case terms, not just subject terms",
        ],
      },
      {
        type: "specs",
        platform: "Freepik",
        color: "#4fc3e0",
        note: "Freepik\u2019s search mixes free and premium content, so specific, unambiguous keywords help your file surface against a very large catalog.",
        titleRules: [
          "Descriptive and specific — avoid generic one-word titles",
        ],
        keywordRules: [
          "Favor specific multi-word phrases over single broad terms where possible",
        ],
      },
    ],
  },

  {
    slug: "how-to-write-stock-photo-titles",
    navLabel: "How to Write Stock Photo Titles",
    metaTitle: "How to Write Stock Photo Titles That Actually Rank",
    metaDescription:
      "A practical framework for writing stock photo titles that read naturally to buyers and rank well in platform search algorithms.",
    title: "How to Write Stock Photo Titles That Actually Rank",
    subtitle:
      "The title is usually the single highest-weighted metadata field. Most contributors get it wrong in the same few ways.",
    sections: [
      { type: "h2", content: "The formula that works across platforms" },
      {
        type: "p",
        content:
          'Subject, then action or state, then setting or context. "Young woman hiking on a mountain trail at sunrise" tells both a buyer and a search algorithm exactly what they\u2019re looking at, in an order that mirrors how people actually search.',
      },
      { type: "h2", content: "The three mistakes that hurt ranking most" },
      {
        type: "ul",
        items: [
          "Keyword stuffing — cramming search terms into the title instead of writing a real sentence. Most platforms actively penalize this.",
          'Being too generic — "woman outside" describes almost nothing. Specificity is what lets a buyer\u2019s exact search match your file.',
          "Repeating your own keywords verbatim in the title — several platforms flag this as a quality signal against you rather than for you.",
        ],
      },
      {
        type: "p",
        content:
          "A good test: read the title out loud. If it sounds like something a person would write to describe a photo to a friend, it will usually perform well. If it sounds like a list of search terms with spaces between them, it needs a rewrite.",
      },
    ],
  },

  {
    slug: "keyword-research-for-stock-photographers",
    navLabel: "Keyword Research for Stock Photographers",
    metaTitle: "Keyword Research for Stock Photographers: A Practical Guide",
    metaDescription:
      "How to choose stock photo keywords buyers actually search for, avoid keyword spam penalties, and structure a keyword list that ranks.",
    title: "Keyword Research for Stock Photographers",
    subtitle:
      "Most contributors either under-keyword or spam-keyword. Both cost sales.",
    sections: [
      {
        type: "p",
        content:
          "Good stock keywords aren\u2019t a brainstorm of every word loosely related to the image — they\u2019re a list of terms a buyer would realistically type into a search bar while looking for exactly this image.",
      },
      { type: "h2", content: "A simple structure that works" },
      {
        type: "ul",
        items: [
          "Primary subject terms first — the literal thing in the photo.",
          'Contextual terms next — setting, season, mood, use case (e.g. "corporate", "wellness", "background").',
          'Conceptual terms last — abstract ideas the image represents (e.g. "freedom", "teamwork") — useful, but shouldn\u2019t dominate the list.',
        ],
      },
      {
        type: "h2",
        content: "Why duplicate and near-duplicate keywords hurt you",
      },
      {
        type: "p",
        content:
          'Platforms treat repeated or near-identical keywords ("run", "running", "runner" all present without distinct value) as a quality red flag, not a way to cover more search terms. A tighter, non-redundant list consistently outperforms a padded one.',
      },
    ],
  },

  {
    slug: "ai-vs-manual-metadata",
    navLabel: "AI vs Manual Metadata",
    metaTitle: "AI-Generated vs Manual Metadata: What Actually Changes",
    metaDescription:
      "A practical comparison of AI-generated stock photo metadata versus writing titles, descriptions, and keywords by hand.",
    title: "AI-Generated vs Manual Metadata",
    subtitle: "The honest tradeoffs, not the marketing version.",
    sections: [
      {
        type: "p",
        content:
          "Manual metadata gives you full control and, for anyone who knows a platform\u2019s quirks well, can be extremely precise. It\u2019s also slow — writing accurate titles, descriptions, and 30+ keywords per image, consistently, across a large batch, is genuinely tedious work, and tedium is where quality slips.",
      },
      {
        type: "p",
        content:
          "AI-generated metadata trades a small amount of precision for a large amount of speed and consistency. A model looking at an image doesn\u2019t get tired on file 80 of 100 the way a person does — the keyword quality on the last file tends to match the first.",
      },
      { type: "h2", content: "Where manual review still matters" },
      {
        type: "p",
        content:
          "AI-generated metadata is a strong first draft, not necessarily a final answer for every image. Anything with brand elements, recognizable people, or context the AI can\u2019t see in a single frame (like the story behind a shot) benefits from a quick manual pass before submission.",
      },
    ],
  },

  {
    slug: "youtube-video-metadata-generator",
    navLabel: "YouTube Video Metadata Generator",
    metaTitle: "Using an AI Metadata Generator for YouTube Video Titles & Tags",
    metaDescription:
      "How AI-generated titles, descriptions, and tags work for YouTube video SEO, and how it differs from stock footage metadata.",
    title: "AI Metadata for YouTube Video Titles and Tags",
    subtitle:
      "Same underlying idea as stock metadata, different goal: watch time, not license sales.",
    sections: [
      {
        type: "p",
        content:
          "YouTube\u2019s algorithm and a stock agency\u2019s search engine both rely on metadata to understand content — but they optimize for different outcomes. A stock buyer wants to find a specific literal image fast. A YouTube viewer is being persuaded to click and then to keep watching.",
      },
      { type: "h2", content: "What carries over from stock metadata practice" },
      {
        type: "p",
        content:
          "The instinct to be specific rather than generic, and to avoid keyword stuffing, applies directly. A title that clearly states the video\u2019s actual content and hook, plus a handful of precise tags, tends to outperform a title crammed with trending but irrelevant keywords.",
      },
      { type: "h2", content: "What\u2019s different" },
      {
        type: "p",
        content:
          "YouTube titles benefit from a curiosity or benefit angle a stock title never would — stock titles are purely descriptive, YouTube titles are also persuasive. Tags matter less for YouTube ranking today than they once did; the description and the first seconds of watch retention matter more.",
      },
    ],
  },

  {
    slug: "bulk-image-keyword-generator",
    navLabel: "Bulk Image Keyword Generator",
    metaTitle:
      "Bulk Image Keyword Generator: Processing Large Batches Efficiently",
    metaDescription:
      "How to keyword hundreds of images at once without sacrificing quality or consistency across the batch.",
    title: "Bulk Image Keyword Generation",
    subtitle:
      "The real challenge with a large batch isn\u2019t generating keywords once — it\u2019s keeping quality consistent across hundreds of files.",
    sections: [
      {
        type: "p",
        content:
          "Keywording ten images by hand is manageable. Keywording four hundred is a different problem entirely — not because any single image is hard, but because consistency degrades over volume when it\u2019s done manually.",
      },
      { type: "h2", content: "What actually matters at scale" },
      {
        type: "ul",
        items: [
          "Consistent formatting across the whole batch (lowercase, no stray punctuation, consistent keyword count range).",
          "No duplicate keyword sets between visually similar images — near-identical files with identical metadata can read as spam to a platform.",
          "A workflow that doesn\u2019t silently drop files when something in the batch fails — you want to know what needs a second pass, not guess.",
        ],
      },
    ],
  },

  {
    slug: "stock-photo-seo-guide",
    navLabel: "Stock Photo SEO Guide",
    metaTitle: "Stock Photo SEO: How Search Ranking Actually Works",
    metaDescription:
      "A breakdown of how stock platform search algorithms rank files, and what contributors can actually control.",
    title: "How Stock Photo Search Ranking Actually Works",
    subtitle: "Metadata is the input. Here\u2019s what platforms do with it.",
    sections: [
      {
        type: "p",
        content:
          "Every major stock platform ranks search results using some combination of relevance signals (does the metadata match the query) and performance signals (has this file historically converted for similar searches). Contributors only control the first half — but that first half is what determines whether a file gets a chance to build the second half at all.",
      },
      { type: "h2", content: "What contributors can actually influence" },
      {
        type: "ul",
        items: [
          "Relevance — accurate, specific, non-redundant metadata that matches real buyer search terms.",
          "Technical quality — resolution, focus, noise — files that get rejected or heavily downranked at review never reach the ranking stage.",
          "Freshness signals on some platforms — newer, well-keyworded uploads can get a temporary visibility boost.",
        ],
      },
      {
        type: "h2",
        content: "What contributors can\u2019t influence directly",
      },
      {
        type: "p",
        content:
          "Historical conversion rate, platform-side demand trends for a given subject, and algorithm weighting changes are all outside a contributor\u2019s control. The only lever available is making sure metadata never becomes the reason a good file underperforms.",
      },
    ],
  },

  {
    slug: "faq-metadata-generator",
    navLabel: "FAQ",
    metaTitle: "Metadata Generator FAQ",
    metaDescription:
      "Answers to common questions about AI-generated stock metadata, CSV formatting, and platform compatibility.",
    title: "Frequently Asked Questions",
    subtitle: "",
    sections: [
      {
        type: "faq",
        items: [
          {
            q: "Will AI-generated metadata get my files rejected?",
            a: "Not inherently — rejection usually comes from inaccurate, generic, or spammy metadata, which can happen whether it\u2019s written by a person or a model. Reviewing a sample of the output before a large batch submission is good practice either way.",
          },
          {
            q: "Do I need different metadata for each platform?",
            a: "The core content can stay similar, but formatting requirements (title length, keyword count, capitalization) differ enough between platforms that a generator tailored per platform performs better than one generic export used everywhere.",
          },
          {
            q: "What image formats work with an AI metadata generator?",
            a: "Most tools handle standard raster formats (JPG, PNG) directly. Video is typically handled by extracting a representative frame and treating it as an image for analysis, rather than processing the full video.",
          },
          {
            q: "Can I edit the generated metadata before submitting?",
            a: "Yes — the CSV output is a standard spreadsheet, so anything can be adjusted in Excel, Google Sheets, or similar before it\u2019s imported into a platform\u2019s bulk uploader.",
          },
        ],
      },
    ],
  },
];
