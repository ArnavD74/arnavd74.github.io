import type { Experience } from '../types';

export const experiences: Experience[] = [
  {
    id: 'amtrust',
    title: 'Data Scientist',
    company: 'AmTrust Financial Services, Inc.',
    location: 'Princeton, NJ',
    period: 'Jan 2026 - Present',
    tagline:
      'Building machine learning models for commercial insurance products (pricing and classification)',
    points: [],
    technologies: ['Python', 'Machine Learning', 'Predictive Modeling', 'SQL', 'Scikit-learn', 'SHAP'],
    links: [{ label: 'Homepage', url: 'https://amtrustfinancial.com/' }],
  },
  {
    id: 'codeninjas-bridgewater',
    company: 'Code Ninjas Bridgewater',
    location: 'Bridgewater, NJ',
    period: 'Aug 2022 - Present',
    points: [],
    technologies: ['Lua', 'C#', 'CRM', 'React', 'Unity'],
    links: [{ label: 'Website', url: 'https://www.codeninjas.com/nj-bridgewater' }],
    subSections: [
      {
        title: 'Sr Instructor',
        period: 'Aug 2025 - Present',
        tagline:
          'Run private tutoring for advanced topics in computer science, game design, 3D modeling, and math. Still occasionally work on the CRM side.',
        points: [],
      },
      {
        title: 'Center Director',
        period: 'Aug 2022 - Aug 2025',
        tagline: 'Directed business operations while supporting youth coding education programs',
        points: [
          'Recruited, interviewed, and trained 75+ employees and interns',
          'Led staff workshops to strengthen individual teaching skills',
          'Designed coding curricula for 500+ students over 36 week-long camps (across 3 centers), driving a sharp increase in customer registrations',
          'Implemented SEO strategies to grow discrete web traffic by 40%',
        ],
      },
    ],
  },
  {
    id: 'medem',
    title: 'Lead Software Engineer',
    company: 'medem.ai',
    location: 'Remote',
    period: 'Mar 2025 - Apr 2026',
    tagline:
      'First engineering hire at a health-tech startup focused on building an agentic-first platform transforming payer operations. Founded by ex-Cigna & Walgreens execs.',
    points: [
      'Shipped prototypes showcased to leading healthcare payer execs, accelerating product buy-in and securing pilot commitments',
      'Led final-round SWE interviews; evaluated 20+ engineers and held final hiring authority for our core platform development team',
      'Built automations for data ingestion, synthetic resource generation, and database synchronization',
    ],
    technologies: ['FHIR', 'AWS', 'React', 'Python', 'Streamlit', 'Figma', 'Docker', 'DevOps', 'Git'],
    links: [{ label: 'Website', url: 'https://medem.ai/' }],
  },
  {
    id: 'gotusers',
    title: 'AI/ML Engineer',
    company: 'Got Users',
    location: 'San Rafael, CA',
    period: 'Sep 2025 - Mar 2026',
    tagline: 'Developed ML-based NLP platform for market research analysis',
    points: [
      'Applied unsupervised learning models to translate data features into natural language patterns',
      'Designed a semantic retrieval pipeline using faiss.ai and RAG workflows to refine drafted content',
      'Deployed web interface with SQLite backend for re-indexing embeddings',
    ],
    technologies: ['Python', 'RAG', 'Exploratory Data Analysis', 'Git', 'SQLite', 'Streamlit'],
    links: [{ label: 'Website', url: 'https://gotusers.com/' }],
  },
  {
    id: 'phillipvn',
    title: 'Solutions Architect',
    company: 'Phillipvn Photography LLC',
    location: 'New York, NY',
    period: 'Apr 2025 - Dec 2025',
    tagline:
      'Delivered a cloud-agnostic microSaaS platform complete with user auth, payments, and AI-powered content workflows',
    points: [
      'Shipped a custom AWS solution involving REST APIs and large-scale scheduled automation (React/Amplify, Cognito, End User Messaging, API Gateway, Lambda, EventBridge, DynamoDB)',
      'Integrated Stripe Checkout and Billing Portal with webhook-driven subscription management',
      'Configured CloudWatch and CI/CD for low-maintenance operation',
      'Built the entire platform on CloudFormation',
    ],
    technologies: ['AWS', 'Python', 'React', 'Docker', 'Cloudflare', 'Stripe', 'Git'],
    links: [{ label: 'Website', url: 'https://phillipvn.com/' }],
  },
  {
    id: 'rutgers-oit',
    title: 'Technology Labs Consultant',
    company: 'Rutgers New Brunswick Computing Services',
    location: 'New Brunswick, NJ',
    period: 'May 2022 - Dec 2024',
    tagline:
      'Provided frontline technical support for faculty, students, and guests across Rutgers computing labs; collaborated with management on process improvements and automation',
    points: [],
    technologies: ['IAM', 'Microsoft MDM', 'Microsoft Intune', 'ServiceNow'],
  },
  {
    id: 'rutgers-edu',
    title: 'B.S. Computer Science',
    company: 'Rutgers University',
    location: 'New Brunswick, NJ',
    period: 'Sep 2021 - Dec 2024',
    tagline: "Bachelor's in Computer Science with Minor in Data Science; Dean's List",
    points: [
      'Coursework: Data Structures, Algorithms, Machine Learning, Statistical Inference, Computer Architecture',
      'Activities: Sigma Phi Epsilon, Rutgers Makerspace Club, HackRU, Rutgers Mobile App Development (RUMAD)',
    ],
  },
  {
    id: 'sigep',
    title: 'NJ Beta — VP of Communications',
    company: 'Sigma Phi Epsilon',
    location: 'New Brunswick, NJ',
    period: 'Oct 2023 - Nov 2024',
    tagline:
      'Led chapter communications and digital marketing, earning national recognition for excellence in communication and recruitment',
    points: [
      'Earned the Benjamin Hobson-Frayser Award for Excellence in Communication (2025)',
      'Managed official social media channels highlighting outreach and community impact',
      'Handled full production of chapter composite boards including photography, editing, and assembly',
    ],
    links: [{ label: 'Chapter Website', url: 'https://www.sigepnjbeta.org/' }],
  },
  {
    id: 'tangerine',
    title: 'Project Lead Developer',
    company: 'Tangerine for Discord',
    location: 'Remote',
    period: 'Jun 2021 - Oct 2023',
    tagline:
      'Built and maintained an open-source project, developing my full-stack and live-service application skills',
    points: [
      'Developed a Discord API service in Node.js providing moderation and community growth tools for Discord server administrators',
      'Scaled cloud infrastructure (Heroku Dynos) to support 300K+ daily users across 1,000+ Discord servers at peak',
      'Designed product landing page in Bootstrap and collaborated with graphic designers for branding assets',
    ],
    technologies: ['Node.js', 'Discord.js', 'Cloudflare', 'Photoshop', 'Git'],
    links: [{ label: 'Website', url: 'https://tangerinebot.com/' }],
  },
  {
    id: 'codeninjas-other',
    company: 'Code Ninjas Hillsborough-Montgomery & Green Brook',
    location: 'Hillsborough / Green Brook, NJ',
    period: 'Oct 2020 - Nov 2022',
    points: [],
    subSections: [
      {
        title: 'Asst Center Director — Green Brook',
        period: 'Feb 2022 - Nov 2022',
        points: [],
      },
      {
        title: 'Asst Center Director — Hillsborough-Montgomery',
        period: 'May 2021 - Nov 2022',
        points: [],
      },
      {
        title: 'Tech Lead — Hillsborough-Montgomery',
        period: 'Oct 2020 - May 2021',
        points: [],
      },
    ],
  },
  {
    id: 'cougar-robotics',
    company: 'FRC Team 1403 Cougar Robotics',
    location: 'Skillman, NJ',
    period: 'Sep 2017 - Jun 2021',
    points: [],
    technologies: ['PHP', 'WordPress', 'Photoshop'],
    links: [
      { label: 'Team Website', url: 'https://cougarrobotics.com/' },
      { label: 'The Blue Alliance', url: 'https://www.thebluealliance.com/team/1403/history' },
    ],
    subSections: [
      {
        title: 'Logistics Manager',
        period: 'Jun 2020 - Jun 2021',
        tagline: 'Management role overseeing cross-functional teams totaling over 100 members',
        points: [
          "Ignited a multi-year winning streak of FIRST Mid-Atlantic's Impact Award and District Championship Regional Impact Award (2019–2021) — the most prestigious award at FIRST, honoring the team that best models the organization's mission for others to emulate",
          "Served as lead editor for Chairman's Essay and Executive Summaries, through which the team qualified for international competition eligibility",
          'Administered and maintained team website (cougarrobotics.com)',
        ],
      },
      {
        title: 'Business Captain',
        period: 'Jun 2019 - Jun 2020',
        points: [],
      },
      {
        title: 'Mechanical Designer',
        period: 'Sep 2017 - Jun 2019',
        points: [],
      },
    ],
  },
  {
    id: 'techsters',
    title: 'Education Mentor',
    company: 'Techsters',
    location: 'Skillman, NJ',
    period: 'Dec 2016 - Jun 2017',
    tagline:
      'Guided students through various STEAM topics through interactive, hands-on learning experiences',
    points: [
      'Facilitated "unplugged" activities and projects designed to build foundational skills and interest in STEAM fields',
      'Co-authored successful application for the "Women at NASA" speaking panel; coordinated event logistics for the program held at Montgomery High School, Skillman, NJ',
    ],
    links: [{ label: 'Website', url: 'https://thetechsters.wordpress.com/' }],
  },
];
