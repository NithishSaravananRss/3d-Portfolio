export interface Project {
  id: string;
  name: string;
  titlePrefix: string;
  titleItalic: string;
  titleSuffix: string;
  category: string;
  description: string;
  impact: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  githubUrl?: string;
  liveUrl?: string;
  image: string;
}

export interface Service {
  id: string;
  num: string;
  titlePrefix: string;
  titleItalic: string;
  titleSuffix: string;
  description: string;
  capabilities: string[];
}

export const PORTFOLIO_DATA = {
  profile: {
    name: "Nithish Saravanan",
    wordmark: "NITHISH",
    role: {
      bold: "Software Engineer",
      light: "",
    },
    tagline: "JAVA • SPRING BOOT • REACT • POSTGRESQL • THREE.JS",
    email: "nithishsaravanan2801@gmail.com",
    phone: "+91 94447 26699",
    location: "Chennai, Tamil Nadu, India (Open to relocation)",
    status: "Available to join immediately • Full-Stack & Backend",
    stats: [
      { num: "50+", label: "REST Endpoints Built" },
      { num: "03+", label: "Client CRMs Shipped" },
      { num: "30+", label: "Unit & Mock Tests" },
      { num: "100%", label: "Production Reliability" },
    ],
    socials: {
      github: "https://github.com/NithishSaravananRss",
      linkedin: "https://linkedin.com/in/nithish-saravanan-s",
      leetcode: "https://leetcode.com/u/Nithish_Saravanan_28",
      email: "mailto:nithishsaravanan2801@gmail.com",
    },
  },

  about: {
    headline: "Architecting resilient backend systems with modern interactive frontends.",
    p1: "I am a Java Full-Stack Developer and Software Engineer (B.Tech CSE, 2026) specializing in enterprise architectures: Spring Boot, Spring Security, PostgreSQL, React, and TypeScript. I bridge robust distributed server logic with fluid, cinematic digital experiences.",
    p2: "From engineering RecruitTrack's 50+ REST endpoints and TOTP multi-factor authentication to building real-time multiplayer 3D avatar worlds with Three.js and WebSockets, I focus on clean code, secure RBAC protocols, and frictionless user experiences.",
    technicalSkills: {
      languages: ["Java", "JavaScript", "TypeScript", "SQL", "C++"],
      backend: ["Spring Boot", "Spring Security", "REST APIs", "JWT", "RBAC", "Node.js (NestJS)", "PostgreSQL", "MySQL", "JPA/Hibernate"],
      frontend: ["React.js", "TypeScript", "Tailwind CSS", "Vite", "Three.js", "Framer Motion"],
      tools: ["Docker", "Git", "GitHub", "Postman", "Vercel", "Render", "Linux (Arch)", "JUnit 5", "Mockito"],
      core: ["Data Structures & Algorithms", "OOP", "DBMS", "REST API Design", "WebSocket (STOMP)"]
    }
  },

  services: [
    {
      id: "exp-1",
      num: "01",
      titlePrefix: "CNC WORKFLOW ",
      titleItalic: "automation",
      titleSuffix: " CRM",
      description: "Custom enterprise CRM replacing handwritten factory registers and Excel spreadsheets. Manages daily production logs, automated dispatch routing, quality inspection gates, and administrative auditing in one unified platform.",
      capabilities: [
        "Replaced Excel sheets & handwritten logs",
        "Daily production & dispatch modules",
        "Automated quality checklist auditing",
        "Role-based administrative control",
        "Tailwind CSS & high-speed REST APIs"
      ]
    },
    {
      id: "exp-2",
      num: "02",
      titlePrefix: "FLEET & LOGISTICS ",
      titleItalic: "reconciliation",
      titleSuffix: " SYSTEM",
      description: "Logistics and travel business application tracking vehicle fleet mileage, invoices, outstanding receivables, and trip revenues. Features automated diesel consumption calculations and monthly bank statement Excel reconciliation.",
      capabilities: [
        "Vehicle kilometer & trip tracking",
        "Per-vehicle diesel consumption math",
        "Bank statement Excel import & reconciliation",
        "Invoices, credit notes & payment tracking",
        "Optimized PostgreSQL data queries"
      ]
    },
    {
      id: "exp-3",
      num: "03",
      titlePrefix: "PHYSIOTHERAPY ",
      titleItalic: "portal",
      titleSuffix: " & BOOKING",
      description: "Production web platform for a rehabilitation clinic featuring instant online appointment scheduling (EmailJS), interactive Google Maps facility integration, responsive layout, and Framer Motion micro-interactions.",
      capabilities: [
        "Online patient appointment booking",
        "EmailJS automated notifications",
        "Interactive Google Maps integration",
        "Framer Motion fluid micro-interactions",
        "Secure environment variables setup"
      ]
    },
    {
      id: "exp-4",
      num: "04",
      titlePrefix: "ENTERPRISE ",
      titleItalic: "backend",
      titleSuffix: " ARCHITECTURE",
      description: "High-throughput Java & Spring Boot microservices, Spring Security JWT authentication, role-based access control (Admin, Recruiter, Manager), Dockerized containerization, and comprehensive JUnit 5/Mockito test suites.",
      capabilities: [
        "Spring Boot & Spring Security JWT",
        "Role-Based Access Control (RBAC)",
        "Database Sharding & JPA/Hibernate",
        "Docker containerization & deployment",
        "30+ JUnit 5 & Mockito automated tests"
      ]
    }
  ] as Service[],

  projects: [
    {
      id: "recruit-track",
      name: "RecruitTrack",
      titlePrefix: "RECRUIT",
      titleItalic: "track",
      titleSuffix: " ENTERPRISE ATS",
      category: "Full-Stack / Spring Boot & React",
      description: "A production full-stack Applicant Tracking System with 50+ REST endpoints covering job requisitions, candidate pipelines, resume management, interview scheduling, and a hiring-funnel analytics dashboard.",
      impact: "Secured with JWT and role-based access for Admin, Recruiter, and Hiring Manager. Includes a drag-and-drop Kanban pipeline and 30+ unit tests.",
      tags: ["Java", "Spring Boot", "Spring Security", "React", "TypeScript", "PostgreSQL", "Docker", "JUnit 5", "Vercel"],
      metrics: [
        { label: "REST Endpoints", value: "50+ Built" },
        { label: "Automated Tests", value: "30+ Tests" },
        { label: "Kanban Pipeline", value: "Drag & Drop" },
        { label: "Live Deployment", value: "Vercel + Render" }
      ],
      githubUrl: "https://github.com/NithishSaravananRss/RecruitTrack",
      liveUrl: "https://recruit-track-black.vercel.app",
      image: "/assets/projects/recruittrack_dashboard.png"
    },
    {
      id: "vms",
      name: "Voter Management System",
      titlePrefix: "VOTER",
      titleItalic: "secure",
      titleSuffix: " MANAGEMENT PLATFORM",
      category: "Security & Full-Stack / NestJS",
      description: "A high-security election and voter dataset platform featuring refresh-token rotation, session revocation, admin/sub-user roles, and TOTP multi-factor authentication with recovery codes and trusted devices.",
      impact: "Engineered CSV bulk import with schema validation and zone-based filtering. Hardened with HttpOnly cookies, CORS, input sanitization, and audit logging.",
      tags: ["React", "TypeScript", "NestJS", "Prisma", "PostgreSQL", "TOTP MFA", "Tailwind CSS"],
      metrics: [
        { label: "Auth Protocol", value: "TOTP + JWT" },
        { label: "Bulk Processing", value: "CSV Import" },
        { label: "Security", value: "HttpOnly + Helmet" },
        { label: "Database", value: "Prisma & Postgres" }
      ],
      githubUrl: "https://github.com/NithishSaravananRss/vms",
      image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=1200&auto=format&fit=crop"
    },
    {
      id: "immersive-3d-learning",
      name: "Immersive 3D Learning Platform",
      titlePrefix: "IMMERSIVE",
      titleItalic: "3D",
      titleSuffix: " LEARNING ENVIRONMENT",
      category: "Creative Tech & WebSockets / Three.js",
      description: "An open-source multiplayer 3D educational environment where learners move as 3D avatars through curriculum nodes in WebGL, powered by a Spring Boot backend and real-time STOMP WebSockets.",
      impact: "Broadcasts connected sessions and avatar coordinates in real-time with sub-50ms latency, validating JWT auth on connect.",
      tags: ["TypeScript", "Three.js", "React", "Spring Boot", "WebSocket", "STOMP/SockJS", "WebGL"],
      metrics: [
        { label: "3D Engine", value: "Three.js WebGL" },
        { label: "Presence", value: "Real-time STOMP" },
        { label: "Multiplayer", value: "Avatar Sync" },
        { label: "Architecture", value: "Open Source" }
      ],
      githubUrl: "https://github.com/NithishSaravananRss/immersive-3d-learning",
      image: "/assets/projects/immersive_3d_learning.png"
    }
  ] as Project[]
};
