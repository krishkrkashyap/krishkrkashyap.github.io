// ============================================================
// PORTFOLIO DATA — Edit this file to update your portfolio
// All data sourced from Krish_Kumar_Resume.md
// ============================================================

const PORTFOLIO_DATA = {
  name: "Krish Kumar",
  displayName: "KrishKrKashyap",
  designation: "AI Engineer",
  tagline: "AI/LLM Integration | Algorithmic Trading | Quantitative Analysis",
  company: "Upper Crust",
  companyRole: "AI Engineer",
  location: "Dhanbad, Jharkhand, India",

  bio: `AI Engineer at Upper Crust, previously Research Analyst at Junomoneta Finsol Private Limited with 9+ months of experience specializing in algorithmic trading, quantitative analysis, and AI/LLM integration. Expert in developing and backtesting trading strategies across Nifty, Sensex, Bank Nifty, Finnifty, and MCX commodities markets. Proficient in Python (Pandas, NumPy, SciPy, TA-Lib, Scikit-learn), statistical modeling, time series analysis and machine learning. Skilled in integrating multiple LLMs (Claude, GPT-4, Gemini, Qwen, Ollama) using prompt engineering for automated research and sentiment analysis. Developed 6+ proprietary algorithmic trading strategies, created trading dashboard replacing TradingView subscriptions, and built AI automation solutions across 28 industry verticals.`,

  // Professional Experience
  experience: [
    {
      title: "AI Engineer",
      company: "Upper Crust",
      period: "July 2026 - Present",
      responsibilities: [
        "Leading AI/LLM integration across company products and internal tools",
        "Building intelligent automation systems using Claude, GPT-4, Gemini, and local Ollama models",
        "Developing AI-powered applications for enterprise solutions",
        "Architecting ERP and E-Commerce systems with AI capabilities",
      ],
    },
    {
      title: "Research Analyst",
      company: "Junomoneta Finsol Private Limited",
      period: "January 2026 - June 2026",
      responsibilities: [
        "Designed and deployed algorithmic trading strategies for Nifty 50, Bank Nifty, Finnifty, Sensex, and MCX commodities (gold, silver, crude oil) using Python with documented entry/exit rules and position sizing algorithms",
        "Developed quantitative research framework using statistical analysis, time series analysis, and regression models to identify statistically significant trading patterns",
        "Performed comprehensive options analysis including Greeks calculations (Delta, Gamma, Theta, Vega, Rho) for position sizing, hedge ratio calculation, and probability of profit estimation",
        "Conducted implied volatility analysis and volatility smile/skew evaluation to identify mispriced options using Black-Scholes model",
        "Built backtesting engine processing 5+ years of historical data, measuring strategy performance using Sharpe Ratio, Sortino Ratio, Maximum Drawdown, Win Rate, Profit Factor, and expectancy",
        "Implemented risk management frameworks including Kelly Criterion position sizing, fixed fractional sizing, maximum drawdown limits, and correlation-based portfolio allocation",
        "Integrated multiple LLM APIs (Claude, GPT-4, Gemini, Qwen) using prompt engineering, function calling, and RAG architecture for automated market research and sentiment analysis",
        "Developed proprietary trading dashboard using PyQt for desktop and Streamlit for web, integrated with XTS terminal APIs",
        "Created 8+ automated dashboards using Streamlit and Plotly for tracking positions, margins, Greeks exposure, and profitability metrics",
      ],
    },
    {
      title: "Associate Research Analyst",
      company: "Junomoneta Finsol Private Limited",
      period: "July 2025 - December 2025",
      responsibilities: [
        "Processed and analyzed 100,000+ daily market data points using Python, SQL, and Pandas, maintaining 99.9% data accuracy through automated validation pipelines with anomaly detection",
        "Conducted exploratory data analysis on historical price data spanning 3+ years to identify recurring market patterns, volatility clustering, mean reversion tendencies, and seasonal trends",
        "Developed AI-driven automation tools integrating Claude and GPT-4 APIs using function calling, custom tools, and RAG for market research automation",
        "Built automated data pipelines using Python for real-time market data ingestion via WebSocket connections and API integration with NSE/BSE/MCX",
        "Created visualization dashboards using Matplotlib, Seaborn, and Plotly presenting candlestick charts, volume profiles, volatility surfaces, and correlation matrices",
      ],
    },
  ],

  // Internships
  internships: [
    {
      title: "Python Developer Intern",
      company: "Prodigy Infotech",
      period: "2024",
      highlights: [
        "Developed 4 production-ready Python projects including data processing utilities, automation scripts, and interactive applications",
        "Built ETL pipeline using Python libraries for extracting, transforming, and loading financial data",
        "Optimized algorithmic performance through code refactoring, reducing execution time by 20% and improving memory efficiency by 15%",
        "Applied Git version control with branching strategies, PEP 8 style guidelines, and modular design patterns",
      ],
    },
    {
      title: "Web Development Trainee",
      company: "Eshuzo Global Technologies Pvt. Ltd.",
      period: "September 2021 (60 Hours)",
      highlights: [
        "Completed intensive 60-hour training in HTML5, CSS3, JavaScript, Django framework, and MySQL database",
        "Built responsive web pages using HTML5, CSS3 Flexbox/Grid layouts, and Bootstrap framework",
        "Implemented frontend interactivity using JavaScript including DOM manipulation, event handling, and AJAX requests",
        "Developed backend functionality using Django with MySQL integration, implementing CRUD operations and user authentication",
      ],
    },
  ],

  roles: [
    "AI/ML Model Development & Deployment",
    "Large Language Model (LLM) Integration & Fine-tuning",
    "Prompt Engineering & Agent Architecture Design",
    "RAG Architecture & Vector Database Implementation",
    "AI-Powered Automation & Intelligent Systems",
    "Full-Stack AI Application Development",
    "Algorithmic Trading Strategy Development",
    "Quantitative Research & Statistical Modeling",
    "Options Analytics & Greeks Calculations (Delta, Gamma, Theta, Vega, Rho)",
    "Real-time Data Pipeline Engineering (WebSocket, APIs)",
    "Trading Dashboard Development (PyQt6 & Streamlit)",
    "Risk Management & Portfolio Optimization",
  ],

  skills: [
    { category: "AI & LLM Engineering", items: ["Claude API", "GPT-4", "Gemini", "Qwen", "Ollama", "Hugging Face", "LangChain", "Prompt Engineering", "Function Calling", "AI Agents", "Multi-Model Routing", "Instruction Tuning", "RAG Architecture", "ChromaDB", "Vector Databases", "Embeddings", "Semantic Search"] },
    { category: "Machine Learning & Deep Learning", items: ["Scikit-learn", "TensorFlow", "PyTorch", "NLP", "Sentiment Analysis", "Computer Vision", "OpenCV", "Time Series Forecasting", "Regression Models", "Classification", "Clustering", "Neural Networks", "Transfer Learning", "Model Evaluation"] },
    { category: "AI Infrastructure", items: ["Model Deployment", "API Development", "Redis Caching", "Intelligent Caching", "Cost Optimization", "Latency Reduction", "ETL Pipelines", "Data Ingestion", "WebSocket Streaming", "Real-time Processing", "Batch Processing"] },
    { category: "Programming Languages", items: ["Python", "R", "SQL", "C/C++", "JavaScript", "TypeScript", "HTML", "CSS"] },
    { category: "Python Libraries", items: ["Pandas", "NumPy", "SciPy", "Matplotlib", "Plotly", "TA-Lib", "statsmodels", "BeautifulSoup", "Selenium", "Streamlit", "PyQt", "Django", "Flask", "FastAPI"] },
    { category: "Trading & Quantitative", items: ["Algorithmic Trading", "Quantitative Analysis", "Options Trading", "Derivatives", "Technical Analysis", "Backtesting", "Risk Management", "Portfolio Optimization", "Greeks Analysis", "Black-Scholes", "Volatility Analysis", "Option Chain Analysis"] },
    { category: "Financial Platforms", items: ["Bloomberg Terminal", "TradingView", "Amibroker (AFL)", "Zerodha Kite API", "NSE/BSE/MCX APIs", "WebSocket Streaming", "XTS Terminal"] },
    { category: "Databases", items: ["MySQL", "SQLite", "MongoDB", "ChromaDB", "Redis"] },
    { category: "DevOps & Tools", items: ["Git", "Docker", "AWS", "Linux", "Jupyter", "VS Code", "REST APIs", "WebSocket", "Web Scraping", "CI/CD"] },
  ],

  certifications: [
    { name: "NISM – VIII (Equity & Derivatives)", issuer: "NISM", year: "2025" },
    { name: "NSE Academy Certified Financial Markets", issuer: "NSE Academy", year: "2025" },
    { name: "Bloomberg Market Concepts (BMC)", issuer: "Bloomberg", year: "2024" },
    { name: "Python Programming for Data Science", issuer: "Udemy", year: "2024" },
    { name: "The Complete MySQL Bootcamp", issuer: "Udemy", year: "2024" },
    { name: "The Complete C & C++ Programming Course", issuer: "Udemy", year: "2024" },
    { name: "R Programming for Statistical Analysis", issuer: "Udemy", year: "2024" },
  ],

  hobbies: [
    { name: "Algorithmic Trading", icon: "📈" },
    { name: "AI Research", icon: "🤖" },
    { name: "Open Source", icon: "💻" },
    { name: "Data Visualization", icon: "📊" },
    { name: "Finance & Markets", icon: "💹" },
    { name: "Problem Solving", icon: "🧩" },
  ],

  achievements: [
    "Developed 6+ algorithmic trading strategies with documented backtesting and walk-forward validation across 3+ market regimes",
    "Processed and analyzed 100,000+ daily market data points using Python (Pandas, NumPy, TA-Lib) with 99.9% accuracy",
    "Created proprietary trading dashboard using PyQt and Streamlit, replacing premium TradingView subscriptions, integrated with XTS terminal",
    "Built real-time market monitoring system processing WebSocket streams for Nifty, Bank Nifty, Finnifty, Sensex, and MCX commodities",
    "Implemented option chain analysis framework with Greeks calculations and implied volatility surface analysis",
    "Reduced manual research time by 60% through AI-driven automation using LLM integration with RAG architecture",
    "Developed data pipelines for historical price data spanning 5+ years for backtesting across multiple market conditions",
    "Built AI marketplace with 50+ bots across 28 industry verticals with 92% retrieval relevance using ChromaDB RAG",
    "Reduced API costs by 35-40% through intelligent caching layer and model routing system",
  ],

  education: [
    {
      degree: "B.Tech in Computer Science (Data Science)",
      school: "Brainware University",
      year: "2025",
      coursework: "Data Structures, Machine Learning, AI, Database Management, Statistics, Python Programming, Data Mining, Data Visualization, Big Data Analytics, Statistical Analysis",
    },
    {
      degree: "Diploma in Computer Science",
      school: "Govt. Polytechnic Bhaga",
      year: "2019 - 2022",
      coursework: "C/C++ Programming, Data Structures, Database Management, Web Technology, Computer Networks, Operating Systems, Software Engineering",
    },
  ],

  contact: {
    email: "krishkrkashyap@gmail.com",
    phone: "+91 620-274-0250",
    instagram: "https://instagram.com/krishkrkashyap",
    linkedin: "https://linkedin.com/in/krishkrkashyap",
    github: "https://github.com/krishkrkashyap",
    twitter: "https://twitter.com/krishkrkashyap",
  },

  projects: [
    {
      name: "WhatsApp Agent",
      description: "AI-powered WhatsApp automation agent for intelligent messaging, automated responses, and conversation management using Python.",
      techStack: ["Python", "WhatsApp API", "AI/LLM", "Automation"],
      github: "https://github.com/krishkrkashyap/Whatsapp-AGENT",
      demo: null,
    },
    {
      name: "Corporate Attendance Application",
      description: "Enterprise-grade corporate attendance tracking system with employee management, check-in/check-out, and reporting capabilities.",
      techStack: ["Python", "Django", "Database", "REST API"],
      github: "https://github.com/krishkrkashyap/CORPRATE-ATTENDANCE-APPLICATION",
      demo: null,
    },
    {
      name: "Shagun Catering",
      description: "Full-featured catering business website with menu showcase, online booking, and service management portal.",
      techStack: ["HTML", "CSS", "JavaScript", "Responsive Design"],
      github: "https://github.com/krishkrkashyap/shagun-catering",
      demo: null,
    },
    {
      name: "Home Organizer",
      description: "Smart home organization and task management application to streamline household activities and inventory tracking.",
      techStack: ["Python", "Automation", "Database"],
      github: "https://github.com/krishkrkashyap/Home-Organizer",
      demo: null,
    },
    {
      name: "Lithosphere Website",
      description: "Modern, responsive company website built with JavaScript for Lithosphere brand with dynamic content and interactive UI.",
      techStack: ["JavaScript", "HTML", "CSS", "Responsive"],
      github: "https://github.com/krishkrkashyap/Lithosphere-Website",
      demo: null,
    },
    {
      name: "E-Commerce Upper Crust",
      description: "Full-stack e-commerce platform with product catalog, shopping cart, payment integration, and admin dashboard built with TypeScript.",
      techStack: ["TypeScript", "React", "Node.js", "E-Commerce"],
      github: "https://github.com/krishkrkashyap/E-com-Upper-Crust",
      demo: null,
    },
    {
      name: "Facial Recognition Attendance",
      description: "Real-time facial recognition system achieving 92% accuracy using OpenCV with 128-dimensional face embeddings, cosine similarity matching, and Django web app processing 500+ daily attendance logs.",
      techStack: ["Python", "OpenCV", "Django", "Haar Cascades", "Scikit-learn"],
      github: "https://github.com/krishkrkashyap/facial-recognition-attendance-system",
      demo: null,
    },
    {
      name: "ERP System — Upper Crust",
      description: "Enterprise Resource Planning system with modular architecture covering HR, inventory, operations, and business process management.",
      techStack: ["React", "TypeScript", "Node.js", "MongoDB"],
      github: "https://github.com/krishkrkashyap/ERP-MODEL-UPPER-CRUST",
      demo: null,
    },
    {
      name: "Upper Crust Website",
      description: "Professional business website for Upper Crust brand with modern design, service showcases, and responsive layouts.",
      techStack: ["HTML", "CSS", "JavaScript", "Bootstrap"],
      github: "https://github.com/krishkrkashyap/Upper-Crust-Website",
      demo: null,
    },
    {
      name: "Library Management System",
      description: "Full-featured library system with book cataloging, member management, automated fine calculation, role-based access control, and sub-second search across 10,000+ records using Django ORM optimization.",
      techStack: ["Django", "MySQL", "JavaScript", "Bootstrap"],
      github: "https://github.com/krishkrkashyap/Library-Managment-System",
      demo: null,
    },
    {
      name: "Charting Engine",
      description: "Custom financial charting engine with candlestick charts (OHLC, Heikin-Ashi), 20+ technical indicators (RSI, MACD, Bollinger Bands, VWAP), and interactive drawing tools.",
      techStack: ["Python", "Plotly", "Matplotlib", "TA-Lib"],
      github: "https://github.com/krishkrkashyap/charting",
      demo: null,
    },
    {
      name: "Trading Strategies",
      description: "Collection of 6+ algorithmic trading strategies with backtesting engine, walk-forward validation, and performance metrics (Sharpe Ratio, Max Drawdown, Win Rate) across multiple market regimes.",
      techStack: ["Python", "Pandas", "NumPy", "TA-Lib", "Backtesting"],
      github: "https://github.com/krishkrkashyap/strategies",
      demo: null,
    },
    {
      name: "XTS Market API Dashboard",
      description: "Real-time market monitoring dashboard with XTS API integration, WebSocket streaming with sub-second latency, and live OHLCV data visualization for Nifty 50, Bank Nifty, and all option chain data.",
      techStack: ["Python", "Streamlit", "WebSocket", "XTS API", "Plotly"],
      github: "https://github.com/krishkrkashyap/xts-market-api-dasboard",
      demo: null,
    },
    {
      name: "Tradesheet Analysis Dashboard",
      description: "Interactive dashboard for analyzing trading performance from tradesheets with P&L tracking, win rate, profit factor, and risk metrics visualization.",
      techStack: ["Python", "Streamlit", "Pandas", "Plotly"],
      github: "https://github.com/krishkrkashyap/Tradesheet-Analysis-Dasboard",
      demo: null,
    },
    {
      name: "Tradesheet Analysis",
      description: "Python-based tradesheet analysis tool for processing trade logs, calculating performance metrics, and generating detailed strategy reports.",
      techStack: ["Python", "Pandas", "NumPy", "Data Analysis"],
      github: "https://github.com/krishkrkashyap/tradesheet-analysis",
      demo: null,
    },
    {
      name: "Finance Course Site",
      description: "Educational website for financial markets courses with structured curriculum, interactive content, and student management.",
      techStack: ["HTML", "CSS", "JavaScript", "Web Development"],
      github: "https://github.com/krishkrkashyap/finance-course-site",
      demo: null,
    },
    {
      name: "XTS Live Dashboard + Risk Management",
      description: "Advanced live trading dashboard with XTS terminal integration, real-time risk management with Kelly Criterion sizing, position monitoring, and margin tracking with automated alerts.",
      techStack: ["Python", "Streamlit", "WebSocket", "XTS API", "Risk Management"],
      github: "https://github.com/krishkrkashyap/xts-live-dasboard-with-risk-managment",
      demo: null,
    },
    {
      name: "AI Automation Marketplace",
      description: "AI-powered marketplace with 50+ specialized bots across 28 industry verticals, RAG with ChromaDB achieving 92% retrieval relevance, Redis caching reducing API costs by 35%, and multi-model LLM routing.",
      techStack: ["Python", "Django", "Claude API", "GPT-4", "Gemini", "RAG", "ChromaDB"],
      github: "https://github.com/krishkrkashyap/ai-automation-marketplace",
      demo: null,
    },
    {
      name: "Prodigy Infotech Projects",
      description: "Production-ready Python projects from internship including ETL pipelines, data processing utilities, automation scripts — reduced execution time by 20% and improved memory efficiency by 15%.",
      techStack: ["Python", "Pandas", "NumPy", "JSON", "CSV", "Git"],
      github: "https://github.com/krishkrkashyap/Prodigy-Infotech_SD",
      demo: null,
    },
  ],
};
