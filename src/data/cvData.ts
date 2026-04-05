export interface Project {
  name: string;
  tech: string[];
  platform: string;
  description: string;
  sourceCode?: string;
  liveDemo?: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  highlights: string[];
}

export interface CVData {
  name: string;
  title: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  website: string;
  summary: string;
  education: {
    institution: string;
    degree: string;
    cgpa: string;
    period: string;
  };
  skills: {
    languages: string[];
    databases: string[];
    frameworks: string[];
    tools: string[];
  };
  experience: Experience[];
  projects: Project[];
  achievements: string[];
  problemSolving: {
    total: number;
    codeforces: string;
    vjudge: string;
    leetcode: string;
  };
  trainings?: {
    name: string;
    institution: string;
    certificateLink?: string;
  }[];
}

export const cvData: CVData = {
  name: "Md. Mahmudul Hasan Rabbi",
  title: "Software Engineer",
  email: "mailto:mhr221official@gmail.com",
  phone: "+880 1640 863379",
  linkedin: "https://linkedin.com/in/rabbi221",
  github: "https://github.com/mh-rabbi",
  website: "https://rabbi-cse.vercel.app",
  summary: "Highly ambitious and results-driven Software Engineer with experience in backend frameworks (NestJS, Express.js) and cross-platform development (Flutter, Next.js, Native Android). Quick learner with strong problem-solving skills and a solid DSA foundation.",
  education: {
    institution: "International University of Business Agriculture and Technology",
    degree: "Bachelor of Science in Computer Science and Engineering",
    cgpa: "3.94/4.00",
    period: "January 2022 – January 2026",
  },
  skills: {
    languages: ["C", "C++", "Java", "Dart", "JavaScript", "Python"],
    databases: ["MySQL", "PostgreSQL", "SQLite", "MongoDB", "Firebase"],
    frameworks: ["Native Android (Java)", "Flutter", "NestJS", "Express.js", "Next.js"],
    tools: ["Linux (Ubuntu)", "Android Studio", "VS Code", "Git", "GitHub", "Jira", "Bitbucket"],
  },
  experience: [
    {
      role: "Software Engineer Intern",
      company: "Grameen HealthTech Limited",
      period: "October 2025 – February 2026",
      highlights: [
        "Built a cross-platform Alarm Service using NestJS and Flutter for the 'Shukhee' app.",
        "Developed a full-stack Admin Feedback Dashboard with Express.js and Next.js.",
        "Implemented a Shop-in-Shop Proof of Delivery (POD) system with secure code generation.",
        "Written Jest automated tests for backend APIs to ensure reliability.",
        "Collaborated in Agile sprints using Jira and Bitbucket for version control.",
      ],
    },
  ],
  projects: [
    {
      name: "WorkPulse API",
      tech: ["Node.js", "TypeScript", "Express.js", "PostgreSQL", "Knex", "Joi"],
      platform: "Backend",
      description: "Production-grade workforce management REST API with JWT, rate-limiting, and scalable architecture.",
      sourceCode: "https://github.com/mh-rabbi/HR-Management-Backend", // Placeholder for actual link if different
    },
    {
      name: "GaariHaat App",
      tech: ["Flutter", "GetX", "NestJS", "MySQL", "Socket.IO"],
      platform: "Android/iOS/Web",
      description: "Full-stack vehicle marketplace with real-time listings, secure authentication, and payment integration.",
      sourceCode: "https://github.com/mh-rabbi/eCommerce-solution-for-used-car-bike",
    },
    {
      name: "eCommerce-Solution-of-used-Car-bike",
      tech: ["TypeScript", "NestJS", "MySQL"],
      platform: "Backend",
      description: "Robust backend for used vehicle marketplace with real-time updates and secure entity relations.",
      sourceCode: "https://github.com/mh-rabbi/Backend-eCommerce-Solution-of-used-Car-bike",
    },
    {
      name: "eGuidance App",
      tech: ["Java", "Firebase", "XML"],
      platform: "Android",
      description: "Mobile app connecting users with doctors for mental health support with real-time chat.",
      sourceCode: "https://github.com/mh-rabbi/eGuidance-App",
      liveDemo: "https://youtu.be/q9ghzHS4LCw",
    },
  ],
  achievements: [
    "Ranked Top 15th: IUBAT Collaborative Programming Contest",
    "Ranked Top 16th: Dhaka Divisional Hackathon 2024",
    "Honourable Mention: ICPC Dhaka Regional Onsite Contest 2023",
    "7 times SGPA 4.0/4.0 and recognized as Scholar",
  ],
  problemSolving: {
    total: 950,
    codeforces: "MHR_ (Pupil, Max 1203)",
    vjudge: "rabbi0123",
    leetcode: "MHR_221",
  },
  trainings: [
    {
      name: "Mobile Application Development",
      institution: "Jagannath University, under EDGE Project – ICT Division (80 Hours)",
      certificateLink: "https://drive.google.com/file/d/1u6axLoSg9C6BWBrZwn_qp_xSRgTn9jDE/view?usp=sharing"
    }
  ]
};
