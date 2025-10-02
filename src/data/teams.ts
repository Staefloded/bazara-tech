import { Team } from "@/types/team.type";

const entities = [
  "Access Bank",
  "First Bank of Nigeria",
  "Guaranty Trust Bank",
  "Zenith Bank",
  "United Bank for Africa",
  "Fidelity Bank",
  "Stanbic IBTC Bank",
  "Union Bank of Nigeria",
  "Sterling Bank",
  "Wema Bank",
  "Polaris Bank",
  "Keystone Bank",
  "Heritage Bank",
  "Titan Trust Bank",
  "Providus Bank",
  "Jaiz Bank",
  "TAJBank",
  "Globus Bank",
  "Parallex Bank",
  "Suntrust Bank",
];

const managers = [
  "Sarah Johnson",
  "Michael Chen",
  "Emily Rodriguez",
  "David Kim",
  "Lisa Wang",
  "James Wilson",
  "Maria Garcia",
  "Robert Taylor",
  "Jennifer Brown",
  "Christopher Lee",
  "Amanda Davis",
  "Matthew Miller",
  "Jessica Martinez",
  "Daniel Anderson",
  "Ashley Thompson",
];

const statuses: Array<"Active" | "Inactive"> = ["Active", "Inactive"];

const teamNames = [
  "Frontend Development",
  "Backend Services",
  "Mobile Apps",
  "DevOps & Infrastructure",
  "Data Analytics",
  "Machine Learning",
  "Product Design",
  "User Experience",
  "Content Marketing",
  "Digital Marketing",
  "Sales Operations",
  "Customer Support",
  "Quality Assurance",
  "Security Engineering",
  "Platform Engineering",
  "API Development",
  "Cloud Infrastructure",
  "Database Administration",
  "Network Operations",
  "System Administration",
  "Business Intelligence",
  "Data Engineering",
  "Research & Development",
  "Innovation Lab",
  "Technical Writing",
  "Developer Relations",
  "Community Management",
  "Growth Marketing",
  "Revenue Operations",
  "Financial Planning",
  "Legal Operations",
  "Compliance",
  "Talent Acquisition",
  "Learning & Development",
  "Employee Experience",
  "Workplace Operations",
];

const descriptions = [
  "Responsible for building and maintaining user-facing applications",
  "Handles server-side logic, databases, and API development",
  "Develops and maintains mobile applications for iOS and Android",
  "Manages cloud infrastructure, CI/CD pipelines, and deployment processes",
  "Analyzes data to provide insights and support business decisions",
  "Builds and deploys machine learning models and AI solutions",
  "Creates user interfaces and visual designs for products",
  "Focuses on user research and improving user experience",
  "Develops and executes content marketing strategies",
  "Manages digital advertising and online marketing campaigns",
  "Optimizes sales processes and manages CRM systems",
  "Provides customer support and maintains customer relationships",
  "Ensures software quality through testing and validation",
  "Protects systems and data from security threats",
  "Builds and maintains core platform services",
  "Develops and maintains RESTful APIs and microservices",
  "Manages cloud computing resources and services",
  "Administers and optimizes database systems",
  "Maintains network infrastructure and connectivity",
  "Manages server systems and IT infrastructure",
  "Creates reports and dashboards for business intelligence",
  "Builds data pipelines and ETL processes",
  "Conducts research and develops new technologies",
  "Explores emerging technologies and innovation opportunities",
  "Creates technical documentation and guides",
  "Builds relationships with the developer community",
  "Manages online communities and user engagement",
  "Focuses on user acquisition and growth strategies",
  "Optimizes revenue processes and financial operations",
  "Handles financial planning and analysis",
  "Manages legal affairs and compliance requirements",
  "Ensures regulatory compliance and risk management",
  "Recruits and hires new talent for the organization",
  "Develops training programs and employee skills",
  "Improves employee satisfaction and workplace culture",
  "Manages office operations and workplace facilities",
];

// Generate unique team codes
export const generateTeamCode = (name: string, index: number): string => {
  const words = name.split(" ").map((word) => word.charAt(0).toUpperCase());
  const prefix = words.length > 1 ? words.join("") : name.substring(0, 3).toUpperCase();
  return `${prefix}${String(index).padStart(3, "0")}`;
};

// Generate email from team name
const generateEmail = (name: string): string => {
  const domain = "company.com";
  const emailName = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-");
  return `${emailName}@${domain}`;
};

// Simple deterministic "random" function for consistent data
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Generate 500+ teams
export const generateTeams = (): Team[] => {
  const teams: Team[] = [];
  const now = new Date();

  for (let i = 0; i < 520; i++) {
    const nameIndex = i % teamNames.length;
    const name = teamNames[nameIndex];
    const description = descriptions[nameIndex];

    // Use deterministic "random" selection based on index
    const entity = entities[Math.floor(seededRandom(i) * entities.length)];
    const manager = managers[Math.floor(seededRandom(i + 1000) * managers.length)];
    const status = statuses[Math.floor(seededRandom(i + 2000) * statuses.length)];

    const code = generateTeamCode(name, i + 1);
    const email = generateEmail(name);

    // Create deterministic dates
    const daysAgo = Math.floor(seededRandom(i + 3000) * 730); // 0-730 days ago
    const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const updatedAt = new Date(
      createdAt.getTime() + Math.floor(seededRandom(i + 4000) * 30 * 24 * 60 * 60 * 1000)
    );

    teams.push({
      id: `team-${String(i + 1).padStart(3, "0")}`,
      name,
      description,
      code,
      email,
      entity,
      manager,
      status,
      createdAt,
      updatedAt,
    });
  }

  return teams;
};

export const mockTeams: Team[] = generateTeams();
