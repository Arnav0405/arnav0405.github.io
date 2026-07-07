export type Project = {
  title: string;
  summary: string;
  tech: string[];
  link?: string;
  note?: string;
};

// Official site per tech; chips without an entry render unlinked.
export const techLinks: Record<string, string> = {
  Rust: "https://www.rust-lang.org",
  reqwest: "https://docs.rs/reqwest",
  ratatui: "https://ratatui.rs",
  serde: "https://serde.rs",
  Prophet: "https://facebook.github.io/prophet/",
  LSTM: "https://en.wikipedia.org/wiki/Long_short-term_memory",
  MLflow: "https://mlflow.org",
  "Apache Airflow": "https://airflow.apache.org",
  Express: "https://expressjs.com",
  "Google ADK": "https://google.github.io/adk-docs/",
  "Gemini API": "https://ai.google.dev",
  LangChain: "https://www.langchain.com",
  Chroma: "https://www.trychroma.com",
  HuggingFace: "https://huggingface.co",
  PyTorch: "https://pytorch.org",
  CLIP: "https://github.com/openai/CLIP",
  FAISS: "https://github.com/facebookresearch/faiss",
  HDF5: "https://www.hdfgroup.org/solutions/hdf5/",
  OpenCV: "https://opencv.org",
  MediaPipe: "https://developers.google.com/mediapipe",
  Optuna: "https://optuna.org",
  ONNX: "https://onnx.ai",
  Kotlin: "https://kotlinlang.org",
  XGBoost: "https://xgboost.readthedocs.io",
  "scikit-learn": "https://scikit-learn.org",
  Flask: "https://flask.palletsprojects.com",
  Seaborn: "https://seaborn.pydata.org",
  Pandas: "https://pandas.pydata.org",
  NumPy: "https://numpy.org",
  GraphQL: "https://graphql.org",
  BeautifulSoup: "https://www.crummy.com/software/BeautifulSoup/",
  FastAPI: "https://fastapi.tiangolo.com",
  JavaScript: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  HTML: "https://developer.mozilla.org/en-US/docs/Web/HTML",
};

export type Paper = {
  title: string;
  venue: string;
  link?: string;
};

// Newest first.
export const projects: Project[] = [
  {
    title: "Gmail in the Terminal",
    summary:
      "An email client that lives in the terminal — read, send, thread through conversations, and wrangle labels, all over the Gmail API. Built in Rust for the oldest reason there is: I wanted to learn the language, and nothing teaches like shipping something you'll actually use.",
    tech: ["reqwest", "ratatui", "serde"],
    link: "https://github.com/Arnav0405/ratatui-email-client",
    note: "Gmail, but in Terminal.",
  },
  {
    title: "Arthya — Financial Coaching for Gig Workers",
    summary:
      "A financial coach for people whose income refuses to sit still. A Node/Express back end and React Native app sit on top of an MLOps pipeline — MLflow and Airflow retraining Prophet to forecast each worker's income — with a feature-extraction layer reading spending patterns out of PostgreSQL.",
    tech: ["Prophet", "LSTM", "MLflow", "Apache Airflow", "Express"],
    link: "https://github.com/Arnav0405/Arthya",
    note: "Built for Mumbai Hacks 2026.",
  },
  {
    title: "Multi-Agent Urban Assistant",
    summary:
      "A team of agents for navigating a city: one query gets decomposed into tasks for events, navigation, and local news, each handled by a specialized utility-based sub-agent built on Google ADK and Gemini flash models. A RAG pipeline over LangChain, Chroma, and HuggingFace embeddings handles the most important question of all — where to eat.",
    tech: ["Google ADK", "Gemini API", "LangChain", "Chroma", "HuggingFace"],
    link: "https://github.com/Arnav0405/tsec-mas-adk",
    note: "agents arguing about routes, Built in TSEC Hacks.",
  },
  {
    title: "Multimodal Price Prediction (Amazon ML Challenge)",
    summary:
      "Guessing prices from pictures and words. CLIP extracts image–text features, KNN over FAISS indices augments each embedding with similarity-based meta-features, and a self-attention fusion layer stitches the modalities together for log-price prediction — each piece measurably better than the last.",
    tech: ["PyTorch", "CLIP", "FAISS", "HDF5"],
    link: "https://github.com/Arnav0405/amazon-ml-2025",
    note: "Gave 79% accuracy; ranked ~2000 against 10000 teams.",
  },
  {
    title: "Gesture Scrolling on Android",
    summary:
      "Scroll reels without touching the screen. I trained a Temporal Convolutional Network on a dataset I recorded myself, tuned it with Optuna from 91.7% to 95.8% accuracy, converted it to ONNX for an 8.23× faster inference, and shipped it inside a Kotlin + Jetpack Compose app.",
    tech: ["PyTorch", "OpenCV", "MediaPipe", "Optuna", "ONNX", "Kotlin"],
    link: "https://github.com/Arnav0405/Android_Gesture_Swiper",
    note: "Hands Free Brainrot",
  },
  {
    title: "Malware Detection & Classification",
    summary:
      "Malware, viewed as pictures. A hybrid CNN + XGBoost pipeline reads bytecode rendered as images and reaches 99.6% accuracy on detection, 92.3% on multi-class classification — wrapped in a Flask app so it works in real time, not just in a notebook.",
    tech: ["PyTorch", "XGBoost", "scikit-learn", "Flask"],
    link: "https://github.com/Arnav0405/GAJSHIELD_KJSCE_S",
    note: "Placed my team top 5, built at Gajshield Hack 2025.",
  },
  {
    title: "Knowledge-Based Chatbot",
    summary:
      "My first swing at retrieval-augmented generation: a FastAPI + LangChain chatbot running Gemma 2B on Ollama, with large PDFs chunked into a vector database so answers come back grounded — and in under a second.",
    tech: ["FastAPI", "LangChain", "JavaScript", "HTML"],
    link: "https://github.com/Arnav0405/ChatBot.Ai",
    note: "Original Agentic Systems.",
  },
  {
    title: "CIFAR-10 Object Recognition",
    summary:
      "The classic rite of passage: a CNN in PyTorch on CIFAR-10, landing at 69.6%. I cut training time 70% with CUDA and pushed 50,000 images through random crops and flips to teach the model to generalize. Not the strongest number on this page — but the one that taught me the most.",
    tech: ["PyTorch", "scikit-learn", "Seaborn", "Pandas", "NumPy"],
    link: "https://github.com/Arnav0405/Ciphar10-PyTorch",
    note: "everyone's first ten classes.",
  },
  {
    title: "Anime Recommender",
    summary:
      "A content-based recommender that answers ‘what should I watch next?’ with ten shows in under thirty seconds. BeautifulSoup and Pandas scraped and shaped the metadata, CountVectorizer turned it into a term-frequency matrix, and K-Nearest Neighbors measures which shows really belong side by side.",
    tech: ["GraphQL", "scikit-learn", "Pandas", "BeautifulSoup"],
    link: "https://github.com/Arnav0405/anime-reccomender",
    note: "Starting my journey into ML.",
  },
];

export const papers: Paper[] = [
  {
    title:
      "Smart Farming Innovations for Maharashtra Using ML with Dual-Node LoRaWAN Connectivity",
    venue: "IEEE",
    link: "https://ieeexplore.ieee.org/document/11507500",
  },
  {
    title:
      "Gesture-Based Assistive Tool for Children with Speech and Hearing Impairments",
    venue:
      "Springer — presented at the 6th International Conference on Computer Vision and Robotics (CVR 2026)",
  },
];
