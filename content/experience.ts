export type Internship = {
  company: string;
  role: string;
  period: string;
  story: string[];
  note?: string;
};

export const internships: Internship[] = [
  {
    company: "Datafuel",
    role: "Full Stack Developer",
    period: "May – August 2026",
    story: [
      "Worked on web scraping at serious scale — up to 15 million products collected in 4 hours.",
      "Built the full-stack platform around it: a React front end over an async FastAPI back end with Celery task queues. The platform helped improve the business by 80%.",
    ],
    note: "fifteen million products in four hours.",
  },
  {
    company: "Evoastra Ventures",
    role: "Data Scientist Intern",
    period: "July – August 2026",
    story: [
      "Led my team to build and deploy a web scraper for dynamic sites, handling large-scale data collection with Selenium and BeautifulSoup, and assembled a comprehensive database of car information and pricing.",
      "Developed a CNN+LSTM image-captioning model in TensorFlow, reaching a BLEU score of 0.56.",
    ],
    note: "a model that describes what it sees.",
  },
];

export const skills: Record<string, string[]> = {
  Languages: [
    "Python",
    "C++",
    "TypeScript",
    "JavaScript",
    "Go",
    "Rust",
    "Java",
    "Kotlin",
    "PHP",
    "Bash",
    "Shell",
    "HTML",
    "CSS",
  ],
  Web: ["ReactJS", "TailwindCSS", "PostgreSQL", "AJAX"],
  "Machine Learning & AI": [
    "PyTorch",
    "Lightning",
    "TensorFlow",
    "LangChain",
    "NumPy",
    "Pandas",
    "Scikit-learn",
    "Google-ADK",
    "Ollama",
    "OpenRouter",
  ],
};
