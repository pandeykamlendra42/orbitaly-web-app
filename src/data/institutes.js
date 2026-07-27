// Mock catalogue for the Orbitaly MVP.
// Fees are annual, in INR. Add-on availability varies per institute.

export const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Hyderabad', 'Chennai']

export const CATEGORIES = [
  { id: 'engineering', label: 'Engineering' },
  { id: 'management', label: 'Management' },
  { id: 'medical', label: 'Medical & Allied' },
  { id: 'design', label: 'Design & Creative' },
  { id: 'coaching', label: 'Test-Prep Coaching' },
  { id: 'school', label: 'K-12 Schools' },
]

export const FEE_RANGES = [
  { id: 'all', label: 'Any budget', min: 0, max: Infinity },
  { id: 'lt1', label: 'Under ₹1L', min: 0, max: 100000 },
  { id: '1to3', label: '₹1L – ₹3L', min: 100000, max: 300000 },
  { id: '3to6', label: '₹3L – ₹6L', min: 300000, max: 600000 },
  { id: 'gt6', label: 'Above ₹6L', min: 600000, max: Infinity },
]

const ADDONS = {
  hostel: { id: 'hostel', name: 'Hostel & Accommodation', icon: 'BedDouble', desc: 'On-campus or partner residence, per academic year' },
  transport: { id: 'transport', name: 'Transport Pass', icon: 'Bus', desc: 'Daily campus commute, annual pass' },
  books: { id: 'books', name: 'Books & Study Material', icon: 'BookOpen', desc: 'Prescribed texts, kits and courseware' },
  mess: { id: 'mess', name: 'Mess & Meal Plan', icon: 'UtensilsCrossed', desc: 'Full-board meal plan, per academic year' },
  laptop: { id: 'laptop', name: 'Device / Laptop', icon: 'Laptop', desc: 'Institute-spec laptop bundled with the programme' },
  exam: { id: 'exam', name: 'Exam & University Fees', icon: 'FileCheck2', desc: 'University registration and examination charges' },
  allowance: { id: 'allowance', name: 'Student Allowance', icon: 'Wallet', desc: 'Capped monthly allowance managed via Orbitaly' },
  uniform: { id: 'uniform', name: 'Uniform & Kit', icon: 'Shirt', desc: 'Uniforms, lab coats and activity kits' },
}

const addon = (key, amount) => ({ ...ADDONS[key], amount })

export const INSTITUTES = [
  {
    id: 'nexus-tech',
    name: 'Nexus Institute of Technology',
    category: 'engineering',
    tagline: 'NAAC A+ engineering campus with industry-embedded labs',
    cities: ['Mumbai', 'Pune', 'Bengaluru'],
    rating: 4.7,
    reviews: 2140,
    students: '12,000+',
    established: 1998,
    accreditation: 'NAAC A+ · AICTE Approved',
    gradient: ['#4f46e5', '#7c3aed'],
    highlights: ['94% placement rate', 'Avg. package ₹8.2 LPA', '120+ recruiting partners'],
    about:
      'Nexus Tech runs outcome-first B.Tech and M.Tech programmes across three metro campuses, with maker labs, industry co-taught electives and a dedicated placement cell.',
    courses: [
      { id: 'btech-cse', name: 'B.Tech Computer Science', degree: 'B.Tech', duration: '4 years', fee: 285000 },
      { id: 'btech-mech', name: 'B.Tech Mechanical', degree: 'B.Tech', duration: '4 years', fee: 210000 },
      { id: 'mtech-ai', name: 'M.Tech AI & Data Science', degree: 'M.Tech', duration: '2 years', fee: 320000 },
    ],
    addons: [addon('hostel', 95000), addon('mess', 48000), addon('transport', 22000), addon('books', 18000), addon('laptop', 68000), addon('allowance', 60000)],
  },
  {
    id: 'meridian-b-school',
    name: 'Meridian Business School',
    category: 'management',
    tagline: 'Top-30 ranked MBA with global immersion term',
    cities: ['Mumbai', 'Delhi', 'Hyderabad'],
    rating: 4.8,
    reviews: 1620,
    students: '4,500+',
    established: 2004,
    accreditation: 'AACSB · AICTE Approved',
    gradient: ['#0ea5e9', '#4f46e5'],
    highlights: ['Global immersion in Singapore', 'Avg. package ₹14.6 LPA', '200+ corporate partners'],
    about:
      'Meridian offers a two-year PGDM/MBA with a compulsory international immersion term, live consulting projects and one of the strongest alumni networks in Indian business education.',
    courses: [
      { id: 'mba-core', name: 'MBA / PGDM Core', degree: 'MBA', duration: '2 years', fee: 650000 },
      { id: 'mba-fintech', name: 'MBA FinTech', degree: 'MBA', duration: '2 years', fee: 720000 },
      { id: 'bba', name: 'BBA (Hons.)', degree: 'BBA', duration: '3 years', fee: 240000 },
    ],
    addons: [addon('hostel', 120000), addon('mess', 60000), addon('books', 25000), addon('laptop', 85000), addon('exam', 15000), addon('allowance', 96000)],
  },
  {
    id: 'lumina-design',
    name: 'Lumina School of Design',
    category: 'design',
    tagline: 'Studio-led UX, fashion and communication design',
    cities: ['Bengaluru', 'Pune'],
    rating: 4.6,
    reviews: 890,
    students: '2,200+',
    established: 2011,
    accreditation: 'UGC Recognised',
    gradient: ['#ec4899', '#8b5cf6'],
    highlights: ['1:12 mentor ratio', 'Adobe & Figma partner campus', 'Paris exchange programme'],
    about:
      'Lumina teaches design the studio way — small cohorts, working portfolios from semester one, and mentors drawn from leading product and fashion houses.',
    courses: [
      { id: 'bdes-ux', name: 'B.Des UX & Interaction', degree: 'B.Des', duration: '4 years', fee: 380000 },
      { id: 'bdes-fashion', name: 'B.Des Fashion', degree: 'B.Des', duration: '4 years', fee: 340000 },
      { id: 'mdes', name: 'M.Des Communication', degree: 'M.Des', duration: '2 years', fee: 410000 },
    ],
    addons: [addon('hostel', 110000), addon('books', 32000), addon('laptop', 125000), addon('transport', 20000), addon('allowance', 72000)],
  },
  {
    id: 'aster-medical',
    name: 'Aster College of Health Sciences',
    category: 'medical',
    tagline: 'Hospital-attached nursing, pharmacy and allied health',
    cities: ['Chennai', 'Hyderabad'],
    rating: 4.5,
    reviews: 1310,
    students: '5,800+',
    established: 1992,
    accreditation: 'NMC · PCI Approved',
    gradient: ['#10b981', '#0ea5e9'],
    highlights: ['1,200-bed teaching hospital', '100% clinical rotation', 'NEET counselling support'],
    about:
      'Aster pairs classroom learning with rotations in its attached multi-speciality hospital, producing clinically ready nursing, pharmacy and physiotherapy graduates.',
    courses: [
      { id: 'bsc-nursing', name: 'B.Sc Nursing', degree: 'B.Sc', duration: '4 years', fee: 175000 },
      { id: 'bpharm', name: 'B.Pharm', degree: 'B.Pharm', duration: '4 years', fee: 195000 },
      { id: 'bpt', name: 'Bachelor of Physiotherapy', degree: 'BPT', duration: '4.5 years', fee: 165000 },
    ],
    addons: [addon('hostel', 78000), addon('mess', 42000), addon('uniform', 12000), addon('books', 20000), addon('exam', 10000), addon('allowance', 48000)],
  },
  {
    id: 'vertex-coaching',
    name: 'Vertex JEE & NEET Academy',
    category: 'coaching',
    tagline: 'Result-ranked JEE/NEET coaching with integrated schooling',
    cities: ['Delhi', 'Mumbai', 'Hyderabad', 'Chennai'],
    rating: 4.4,
    reviews: 3480,
    students: '18,000+',
    established: 2008,
    accreditation: 'ISO 9001 Certified',
    gradient: ['#f59e0b', '#ef4444'],
    highlights: ['412 IIT selections in 2025', 'AI-driven test analytics', 'Weekly parent reports'],
    about:
      'Vertex runs two-year integrated JEE and NEET programmes with daily practice, AI-scored mock tests and structured parent visibility on progress.',
    courses: [
      { id: 'jee-2yr', name: 'JEE Advanced 2-Year Integrated', degree: 'Class 11–12', duration: '2 years', fee: 145000 },
      { id: 'neet-2yr', name: 'NEET 2-Year Integrated', degree: 'Class 11–12', duration: '2 years', fee: 135000 },
      { id: 'crash', name: 'JEE/NEET Crash Course', degree: 'Dropper batch', duration: '1 year', fee: 95000 },
    ],
    addons: [addon('hostel', 88000), addon('mess', 45000), addon('books', 15000), addon('transport', 18000), addon('allowance', 36000)],
  },
  {
    id: 'orbit-international',
    name: 'Orbit International School',
    category: 'school',
    tagline: 'IB & Cambridge K-12 with future-skills curriculum',
    cities: ['Mumbai', 'Bengaluru', 'Pune'],
    rating: 4.7,
    reviews: 1050,
    students: '3,600+',
    established: 2010,
    accreditation: 'IB World School · Cambridge',
    gradient: ['#14b8a6', '#6366f1'],
    highlights: ['IB Diploma avg. score 36', 'Robotics & AI labs from Grade 3', '40+ student clubs'],
    about:
      'Orbit International delivers IB and Cambridge pathways from kindergarten to Grade 12, with a strong emphasis on computational thinking, sport and the arts.',
    courses: [
      { id: 'primary', name: 'Primary Years (Grades 1–5)', degree: 'IB PYP', duration: 'Per year', fee: 180000 },
      { id: 'middle', name: 'Middle Years (Grades 6–10)', degree: 'IB MYP / IGCSE', duration: 'Per year', fee: 240000 },
      { id: 'diploma', name: 'IB Diploma (Grades 11–12)', degree: 'IBDP', duration: 'Per year', fee: 320000 },
    ],
    addons: [addon('transport', 35000), addon('mess', 38000), addon('uniform', 14000), addon('books', 16000), addon('laptop', 55000)],
  },
  {
    id: 'sapphire-law',
    name: 'Sapphire School of Law & Policy',
    category: 'management',
    tagline: 'Five-year integrated law with moot-court excellence',
    cities: ['Delhi', 'Pune'],
    rating: 4.5,
    reviews: 760,
    students: '2,900+',
    established: 2006,
    accreditation: 'BCI Approved · UGC',
    gradient: ['#6366f1', '#0f766e'],
    highlights: ['National moot champions 2024', 'Judicial clerkship pipeline', 'Legal-aid clinic on campus'],
    about:
      'Sapphire offers BA LL.B and LL.M programmes built around advocacy practice, policy labs and internships with top litigation chambers and firms.',
    courses: [
      { id: 'ballb', name: 'BA LL.B (Hons.)', degree: 'BA LL.B', duration: '5 years', fee: 295000 },
      { id: 'llm', name: 'LL.M Corporate Law', degree: 'LL.M', duration: '1 year', fee: 260000 },
    ],
    addons: [addon('hostel', 105000), addon('mess', 52000), addon('books', 28000), addon('exam', 12000), addon('allowance', 66000)],
  },
  {
    id: 'quantum-skills',
    name: 'Quantum Skills University',
    category: 'engineering',
    tagline: 'Work-integrated degrees in cloud, data and cybersecurity',
    cities: ['Bengaluru', 'Hyderabad', 'Chennai'],
    rating: 4.3,
    reviews: 1180,
    students: '7,400+',
    established: 2015,
    accreditation: 'UGC Recognised · NSDC Partner',
    gradient: ['#8b5cf6', '#06b6d4'],
    highlights: ['Earn-while-you-learn track', 'AWS & Microsoft certified labs', 'Stipended industry year'],
    about:
      'Quantum blends university degrees with paid industry apprenticeships — students spend their final year embedded in partner companies with a stipend.',
    courses: [
      { id: 'bca-cloud', name: 'BCA Cloud & DevOps', degree: 'BCA', duration: '3 years', fee: 155000 },
      { id: 'bsc-data', name: 'B.Sc Data Science', degree: 'B.Sc', duration: '3 years', fee: 168000 },
      { id: 'btech-cyber', name: 'B.Tech Cybersecurity', degree: 'B.Tech', duration: '4 years', fee: 230000 },
    ],
    addons: [addon('hostel', 82000), addon('mess', 40000), addon('laptop', 72000), addon('books', 14000), addon('transport', 16000), addon('allowance', 54000)],
  },
]

export const getInstitute = (id) => INSTITUTES.find((i) => i.id === id)

export const minFee = (inst) => Math.min(...inst.courses.map((c) => c.fee))

export const formatINR = (n) =>
  '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })

// Compact Indian notation: 1.5L, 95K, 1.2Cr
export const compactINR = (n) => {
  if (n >= 10000000) return '₹' + (n / 10000000).toFixed(n % 10000000 ? 1 : 0) + ' Cr'
  if (n >= 100000) return '₹' + (n / 100000).toFixed(n % 100000 ? 1 : 0) + 'L'
  if (n >= 1000) return '₹' + Math.round(n / 1000) + 'K'
  return '₹' + n
}
