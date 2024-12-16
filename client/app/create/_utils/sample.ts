import { ICampaignForm } from "../_interfaces/form";

const oneDay = 24 * 60 * 60 * 1000;

export const sampleCampaignsWithMilestones: ICampaignForm[] = [
  {
    title: "EcoScore: Blockchain-Based Product Sustainability Rating System",
    summary:
      "Creating the world's first decentralized sustainability scoring system for consumer products. Our platform combines blockchain technology with IoT sensors and AI to track and verify environmental impact across entire supply chains. We're partnering with 50+ major manufacturers to implement real-time monitoring systems, enabling consumers to make informed decisions through our mobile app while incentivizing companies to adopt sustainable practices. Initial rollout covers electronics, fashion, and food industries.",
    description: `# EcoScore: Transparent Sustainability Ratings

## 🌿 Mission
Empowering conscious consumption through transparent, verifiable sustainability data.

## 📊 Current Industry Impact Analysis

| Industry Sector | Annual Carbon Footprint (MT) | Water Usage (Billion L) | Waste Generated (MT) | Recycling Rate (%) | Energy Usage (TWh) | Supply Chain Length | Transparency Score | Current Eco Rating | Improvement Potential | Economic Impact ($B) |
|-----------------|----------------------------|----------------------|-------------------|------------------|-------------------|-------------------|-------------------|-------------------|---------------------|-------------------|
| Fast Fashion | 1,200 | 93 | 92 | 12 | 125 | Long | Low | D | High | 1,200 |
| Electronics | 1,800 | 45 | 50 | 20 | 280 | Complex | Medium | C | High | 2,500 |
| Food & Beverage | 3,500 | 820 | 130 | 30 | 330 | Medium | Medium | C | Medium | 3,800 |
| Automotive | 2,200 | 85 | 70 | 85 | 410 | Complex | High | B | Medium | 2,900 |
| Pharmaceuticals | 800 | 100 | 25 | 35 | 150 | Long | Low | D | High | 1,300 |
| Construction | 3,900 | 150 | 500 | 40 | 550 | Medium | Low | D | High | 4,200 |
| Agriculture | 4,800 | 2,500 | 180 | 25 | 280 | Short | Medium | C | High | 3,600 |
| Packaging | 1,100 | 80 | 160 | 45 | 190 | Short | High | B | Medium | 900 |
| Textiles | 1,600 | 230 | 85 | 15 | 175 | Long | Low | D | High | 1,800 |
| Chemical | 2,800 | 380 | 95 | 30 | 520 | Complex | Medium | C | High | 2,100 |
| Consumer Goods | 1,400 | 120 | 110 | 28 | 160 | Medium | Medium | C | High | 2,400 |
| Technology | 950 | 65 | 45 | 22 | 310 | Complex | High | B | Medium | 3,100 |

## 🛠️ Our Solution

### Platform Components
1. **Supply Chain Tracking**
  - IoT sensor network
  - Blockchain verification
  - Real-time monitoring
  - AI-powered analytics

2. **Scoring System**
  - Carbon footprint
  - Water usage
  - Waste generation
  - Energy efficiency
  - Material sustainability
  - Labor practices
  - Transportation impact

3. **Consumer Interface**
  - Mobile app with barcode scanning
  - Product history tracking
  - Alternative recommendations
  - Reward system for sustainable choices

## 💫 Implementation Strategy

### Phase 1: Infrastructure Development
- IoT sensor deployment
- Blockchain architecture
- AI model training
- Partner onboarding

### Phase 2: Industry Rollout
- Fashion industry pilot
- Electronics expansion
- Food sector integration
- Data validation system

### Phase 3: Consumer Launch
- Mobile app release
- Marketing campaign
- Reward system activation
- Community building

## 🎯 Impact Goals

1. **Environmental**
  - 30% reduction in industry carbon footprint
  - 25% decrease in water usage
  - 40% improvement in waste recycling

2. **Consumer**
  - 100 million app users
  - 1 million products tracked
  - 50,000 verified suppliers

3. **Market**
  - 500 major brands onboarded
  - 30% market share in product tracking
  - $1B in sustainable product sales influenced

## 👥 Partnership Network
- Major retailers
- Manufacturing facilities
- Environmental agencies
- Research institutions
- Consumer advocacy groups

## 🔬 Technology Stack
1. **Blockchain Layer**
  - Smart contracts for verification
  - Decentralized data storage
  - Automated compliance checking

2. **IoT Network**
  - Environmental sensors
  - Supply chain trackers
  - Quality monitors
  - Energy meters

3. **AI Components**
  - Predictive analytics
  - Pattern recognition
  - Anomaly detection
  - Impact forecasting

## 📱 Consumer Features
- Product scanning
- Impact visualization
- Alternative suggestions
- Carbon offset options
- Reward points
- Social sharing

Join us in revolutionizing sustainable consumption!

---

*Visit ecoscore.io for more information*`,
    goal: 25_000,
    deadline: new Date(Date.now() + 30 * oneDay),
    refundDeadline: new Date(Date.now() + 36 * oneDay),
    milestones: [
      {
        id: "milestone-1",
        targetAmount: 5_000,
        deadline: new Date(Date.now() + 10 * oneDay),
        description:
          "Complete platform architecture development, deploy initial IoT sensor network, and secure first round of industry partnerships.",
      },
      {
        id: "milestone-2",
        targetAmount: 10_000,
        deadline: new Date(Date.now() + 15 * oneDay),
        description:
          "Launch fashion industry pilot program, develop mobile app beta, and establish data validation system.",
      },
      {
        id: "milestone-3",
        targetAmount: 15_000,
        deadline: new Date(Date.now() + 20 * oneDay),
        description:
          "Expand to electronics and food sectors, release public mobile app, and implement reward system.",
      },
      {
        id: "milestone-4",
        targetAmount: 25_000,
        deadline: new Date(Date.now() + 30 * oneDay),
        description:
          "Complete full platform launch, scale to all planned industries, and initiate global marketing campaign.",
      },
    ],
    coverImage: null,
    categories: ["sustainability", "supply_chain", "technology", "consumer"],
  },
  {
    title: "Revolutionary Urban Vertical Farming Solution",
    summary:
      "We're developing an innovative vertical farming system that transforms unused urban spaces into sustainable, high-yield agricultural zones, addressing food security and reducing carbon footprint in metropolitan areas.",
    description: `# Urban Vertical Farming: Reimagining City Agriculture
    
    ## Our Vision
    In the heart of urban landscapes, we see untapped potential for sustainable food production. Our project aims to convert neglected urban spaces into thriving, efficient vertical farms that can feed communities, reduce transportation emissions, and create local employment.
    
    ## Key Innovations
    - **Modular Design**: Adaptable farming units that can be installed in:
      - Abandoned warehouses
      - Rooftops
      - Unused parking structures
    - **Advanced Hydroponics**: 90% less water usage compared to traditional farming
    - **AI-Powered Climate Control**: Optimize growing conditions in real-time
    
    ## Environmental Impact
    - Reduce food transportation emissions by up to 75%
    - Repurpose urban dead spaces
    - Create local, pesticide-free produce ecosystems
    
    ## Technical Specifications
    \`\`\`
    Growing Capacity: 500 sq meters
    Annual Produce Yield: ~10 tons of vegetables
    Water Efficiency: 90% recycled water system
    Energy Usage: Fully solar-powered infrastructure
    \`\`\`
    
    ## Community Benefits
    1. Local job creation
    2. Fresh, affordable produce
    3. Educational workshops on urban agriculture
    4. Carbon footprint reduction
    
    **Together, we can transform urban landscapes into sustainable food production hubs!**`,
    goal: 25_000,
    deadline: new Date(Date.now() + 30 * oneDay),
    refundDeadline: new Date(Date.now() + 36 * oneDay),
    milestones: [
      {
        id: "milestone-1",
        targetAmount: 5_000,
        description:
          "Complete prototype design and initial engineering blueprints",
        deadline: new Date(Date.now() + 10 * oneDay),
      },
      {
        id: "milestone-2",
        targetAmount: 10_000,
        description:
          "Construct first modular vertical farming prototype and conduct initial testing",
        deadline: new Date(Date.now() + 20 * oneDay),
      },
      {
        id: "milestone-3",
        targetAmount: 25_000,
        description:
          "Full-scale production of first urban vertical farming unit and community pilot program",
        deadline: new Date(Date.now() + 30 * oneDay),
      },
    ],
    coverImage: null,
    categories: [
      "sustainability",
      "tech",
      "environment",
      "community_development",
    ],
  },
  {
    title: "Community Solar Project for Rural Kenya",
    summary:
      "This project installs solar microgrids in rural Kenyan villages, bringing affordable electricity to 2500 people, reducing CO2 emissions, creating jobs, and empowering local economies with clean energy solutions.",
    description: `# Illuminating Futures: Solar Power for Rural Communities

## Project Overview
Our initiative aims to:
- Install solar microgrids in 5 rural Kenyan villages
- Create local jobs in solar technology
- Provide reliable electricity to 2500 people

\`\`\`
Expected Impact:
- 500 households electrified
- 75 local jobs created
- 300 tons of CO2 emissions prevented annually
\`\`\``,
    goal: 15_000,
    deadline: new Date(Date.now() + 3 * oneDay),
    refundDeadline: new Date(Date.now() + 10 * oneDay),
    milestones: [
      {
        id: "solar-milestone-1",
        targetAmount: 10_000,
        description: "Complete initial village infrastructure assessment",
        deadline: new Date(Date.now() + 1 * oneDay),
      },
      {
        id: "solar-milestone-1",
        targetAmount: 15_000,
        description: "Finalized solar project and commision it",
        deadline: new Date(Date.now() + 2 * oneDay),
      },
    ],
    coverImage: null,
    categories: ["infrastructure", "renewable_energy", "social_impact"],
  },
  {
    title: "Sustainable Seaweed Farming in Indonesia",
    summary:
      "This project aims to create an innovative seaweed farming ecosystem, providing coastal communities with sustainable economic opportunities while actively contributing to marine ecosystem restoration and biodiversity conservation.",
    description: `# Ocean Regeneration Through Sustainable Farming

## Holistic Approach to Marine Conservation
- Create economic opportunities for coastal communities
- Restore marine ecosystems
- Develop sustainable aquaculture practices

**Healing the ocean, empowering communities!**`,
    goal: 12_000,
    deadline: new Date(Date.now() + 12 * oneDay),
    refundDeadline: new Date(Date.now() + 18 * oneDay),
    milestones: [
      {
        id: "seaweed-milestone-1",
        targetAmount: 4_000,
        description: "Complete initial coastal ecosystem assessment",
        deadline: new Date(Date.now() + 5 * oneDay),
      },
      {
        id: "seaweed-milestone-2",
        targetAmount: 12_000,
        description: "Complete initial coastal ecosystem assessment",
        deadline: new Date(Date.now() + 11 * oneDay),
      },
    ],
    coverImage: null,
    categories: ["environment", "sustainability", "employment"],
  },
  {
    title: "Portable Water Purification for Remote Communities",
    summary:
      "Developing low-cost, sustainable water purification technology to provide clean drinking water in regions with limited access to safe water sources. Developing a low-cost, solar-powered water purification system to address the global water crisis by providing clean, safe drinking water to remote communities lacking access to reliable sources",
    description: `# Clean Water: A Human Right

## Innovative Solution for Global Water Crisis
- Design portable, solar-powered purification units
- Create affordable technology for remote areas
- Implement community training programs

**Bringing safe water to every community!**`,
    goal: 9_000,
    deadline: new Date(Date.now() + 2 * oneDay),
    refundDeadline: new Date(Date.now() + 8 * oneDay),
    milestones: [
      {
        id: "water-milestone-1",
        targetAmount: 3_000,
        description: "Complete prototype development and initial testing",
        deadline: new Date(Date.now() + 1 * oneDay),
      },
      {
        id: "water-milestone-2",
        targetAmount: 9_000,
        description: "Complete prototype development and initial testing",
        deadline: new Date(Date.now() + 2 * oneDay),
      },
    ],
    coverImage: null,
    categories: ["tech", "social_impact", "health_care"],
  },
  {
    title: "AI-Driven Coral Reef Restoration",
    summary:
      "Utilizing AI and robotics to accelerate coral reef restoration, this project focuses on monitoring marine health, deploying precision techniques, and ensuring long-term ecosystem recovery through innovation.",
    description: `# Healing Oceans with Technology

## Comprehensive Marine Restoration Strategy
- Deploy AI-powered underwater drones
- Create detailed marine ecosystem maps
- Implement precision coral regeneration techniques

**Technology meets conservation!**`,
    goal: 22_000,
    deadline: new Date(Date.now() + 7 * oneDay),
    refundDeadline: new Date(Date.now() + 15 * oneDay),
    milestones: [
      {
        id: "coral-milestone-1",
        targetAmount: 7_000,
        description: "Start AI mapping and initial drone deployment",
        deadline: new Date(Date.now() + 3 * oneDay),
      },
      {
        id: "coral-milestone-2",
        targetAmount: 22_000,
        description: "Complete AI mapping and initial drone deployment",
        deadline: new Date(Date.now() + 6 * oneDay),
      },
    ],
    coverImage: null,
    categories: ["science", "environment", "tech"],
  },
  {
    title: "Circular Economy Fashion Marketplace",
    summary:
      "Building a blockchain-powered platform to transform sustainable fashion by enabling transparent practices, traceable clothing life cycles, and circular economy principles in the global textile industry.",
    description: `# Redefining Fashion Sustainability

## Our Innovative Approach
- Create a decentralized fashion marketplace
- Enable clothing lifecycle tracking
- Promote circular economy principles

\`\`\`
Platform Features:
- Blockchain-verified material sourcing
- Resale and upcycling capabilities
- Transparent supply chain metrics
\`\`\``,
    goal: 13_500,
    deadline: new Date(Date.now() + 10 * oneDay),
    refundDeadline: new Date(Date.now() + 18 * oneDay),
    milestones: [
      {
        id: "fashion-milestone-1",
        targetAmount: 4_500,
        description:
          "Develop initial blockchain infrastructure and marketplace prototype",
        deadline: new Date(Date.now() + 6 * oneDay),
      },
      {
        id: "fashion-milestone-2",
        targetAmount: 13_500,
        description:
          "Develop initial blockchain infrastructure and marketplace prototype",
        deadline: new Date(Date.now() + 10 * oneDay),
      },
    ],
    coverImage: null,
    categories: ["tech", "sustainability", "consumer"],
  },
  {
    title: "AI-Powered Language Preservation for Endangered Dialects",
    summary:
      "This project leverages AI to document and preserve endangered languages, creating linguistic archives and tools to safeguard cultural heritage and promote global diversity in communication. Support this campaign to have more languages on our earth",
    description: `# Saving the Voice of Humanity

## Linguistic Conservation Technology
- Create AI-powered language documentation
- Develop advanced linguistic analysis tools
- Preserve endangered linguistic heritage

\`\`\`
Project Impact:
- Document 50 endangered languages
- Create comprehensive linguistic archives
- Develop machine learning language models
\`\`\``,
    goal: 1_450,
    deadline: new Date(Date.now() + 3 * oneDay),
    refundDeadline: new Date(Date.now() + 10 * oneDay),
    milestones: [
      {
        id: "language-milestone-1",
        targetAmount: 500,
        description: "Start AI linguistic mapping and data collection",
        deadline: new Date(Date.now() + 1 * oneDay),
      },
      {
        id: "language-milestone-2",
        targetAmount: 1_450,
        description:
          "Complete initial AI linguistic mapping and data collection",
        deadline: new Date(Date.now() + 2 * oneDay),
      },
    ],
    coverImage: null,
    categories: ["culture", "tech", "education"],
  },
];

export const sampleCampaignsWithoutMilestones: ICampaignForm[] = [
  {
    title: "Save the Endangered Red Wolf Sanctuary",
    summary:
      "Red wolves are critically endangered, with fewer than 20 left in the wild. This sanctuary protects habitats, initiates breeding programs, and educates communities, ensuring the survival of this iconic species.",
    description: `# Protecting North America's Most Endangered Canid

## Our Mission
The red wolf population has dwindled to fewer than 20 individuals in the wild. We're launching a comprehensive conservation program to:
- Preserve remaining habitat
- Implement breeding programs
- Educate local communities about wolf conservation

**Every contribution helps save a species from extinction!**`,
    goal: 750,
    deadline: new Date(Date.now() + oneDay),
    refundDeadline: new Date(Date.now() + 7 * oneDay),
    milestones: [],
    coverImage: null,
    categories: ["animals", "conservation", "environment"],
  },

  {
    title: "Revolutionary AI-Powered Mental Health App",
    summary:
      "An innovative mental health app combining advanced AI with affordability, providing 24/7 personalized resources and interventions to address global mental health challenges inclusively and effectively.",
    description: `# Breaking Barriers in Mental Health Support

## Why This Matters
Mental health is a global challenge. Our app aims to:
- Provide 24/7 personalized support
- Make mental health resources affordable
- Use AI to create tailored intervention strategies

**Technology meets compassion to transform mental health care!**`,
    goal: 100,
    deadline: new Date(Date.now() + oneDay),
    refundDeadline: new Date(Date.now() + 7 * oneDay),
    milestones: [],
    coverImage: null,
    categories: ["health_care", "tech", "social_impact"],
  },
  {
    title: "Urban Bee Corridor Project",
    summary:
      "This initiative develops green spaces for urban bee habitats, enhancing biodiversity, educating communities about pollinators, and creating sustainable environments to support urban ecosystems and biodiversity.",
    description: `# Saving Bees, Saving Cities

## Our Comprehensive Approach
- Plant native bee-friendly flora across urban spaces
- Create educational programs about pollinator importance
- Develop bee-friendly urban design guidelines

\`\`\`
Project Goals:
- 50 new urban bee habitats
- 10,000 sq meters of pollinator-friendly spaces
- Engage 5 city governments
\`\`\``,
    goal: 6_500,
    deadline: new Date(Date.now() + 48 * 60 * 60 * 1000),
    refundDeadline: new Date(Date.now() + 8 * oneDay),
    milestones: [],
    categories: ["environment", "conservation", "community_development"],
    coverImage: null,
  },
  {
    title: "Blockchain Education for Rural Entrepreneurs",
    summary:
      "Introduce blockchain to rural entrepreneurs with free training, startup support, and resources, unlocking economic potential and bridging the digital divide with opportunities in decentralized technologies.",
    description: `# Democratizing Tech Education

## Empowering Future Innovators
Our program will:
- Provide free blockchain training
- Support startup development
- Create global economic opportunities

**Technology knows no boundaries!**`,
    goal: 400,
    deadline: new Date(Date.now() + oneDay),
    refundDeadline: new Date(Date.now() + 7 * oneDay),
    milestones: [],
    coverImage: null,
    categories: ["education", "tech", "defi"],
  },
  {
    title: "Save the Endangered Red Wolf Sanctuary",
    summary:
      "Red wolves are critically endangered, with fewer than 20 left in the wild. This sanctuary protects habitats, initiates breeding programs, and educates communities, ensuring the survival of this iconic species.",
    description: `# Protecting North America's Most Endangered Canid

## Our Mission
The red wolf population has dwindled to fewer than 20 individuals in the wild. We're launching a comprehensive conservation program to:
- Preserve remaining habitat
- Implement breeding programs
- Educate local communities about wolf conservation

**Every contribution helps save a species from extinction!**`,
    goal: 7_500,
    deadline: new Date(Date.now() + oneDay),
    refundDeadline: new Date(Date.now() + 7 * oneDay),
    milestones: [],
    coverImage: null,
    categories: ["animals", "conservation", "environment"],
  },

  {
    title: "Revolutionary AI-Powered Mental Health App",
    summary:
      "Developing an inclusive, accessible mental health support platform that uses advanced AI to provide personalized, affordable mental health resources and support.",
    description: `# Breaking Barriers in Mental Health Support

## Why This Matters
Mental health is a global challenge. Our app aims to:
- Provide 24/7 personalized support
- Make mental health resources affordable
- Use AI to create tailored intervention strategies

**Technology meets compassion to transform mental health care!**`,
    goal: 10_000,
    deadline: new Date(Date.now() + oneDay),
    refundDeadline: new Date(Date.now() + 7 * oneDay),
    milestones: [],
    coverImage: null,
    categories: ["health_care", "tech", "social_impact"],
  },
  {
    title: "Urban Bee Corridor Project",
    summary:
      "Creating interconnected green spaces in urban environments to support bee populations, enhance biodiversity, and raise awareness about the critical role of pollinators in our ecosystem.",
    description: `# Saving Bees, Saving Cities

## Our Comprehensive Approach
- Plant native bee-friendly flora across urban spaces
- Create educational programs about pollinator importance
- Develop bee-friendly urban design guidelines

\`\`\`
Project Goals:
- 50 new urban bee habitats
- 10,000 sq meters of pollinator-friendly spaces
- Engage 5 city governments
\`\`\``,
    goal: 6_500,
    deadline: new Date(Date.now() + 48 * 60 * 60 * 1000),
    refundDeadline: new Date(Date.now() + 8 * oneDay),
    milestones: [],
    coverImage: null,
    categories: ["environment", "conservation", "community_development"],
  },
  {
    title: "Blockchain Education for Rural Entrepreneurs",
    summary:
      "Introduce blockchain to rural entrepreneurs with free training, startup support, and resources, unlocking economic potential and bridging the digital divide with opportunities in decentralized technologies.",
    description: `# Democratizing Tech Education

## Empowering Future Innovators
Our program will:
- Provide free blockchain training
- Support startup development
- Create global economic opportunities

**Technology knows no boundaries!**`,
    goal: 4_500,
    deadline: new Date(Date.now() + oneDay),
    refundDeadline: new Date(Date.now() + 7 * oneDay),
    milestones: [],
    coverImage: null,
    categories: ["education", "tech", "defi"],
  },

  {
    title: "Indigenous Language Preservation App",
    summary:
      "A state-of-the-art mobile application to preserve endangered indigenous languages, combining interactive learning modules, community-driven content, and AI-assisted translation for cultural revitalization.",
    description: `# Saving Languages, Preserving Culture

## Our Technology-Driven Approach
- Create interactive language learning modules
- Build community-driven content platforms
- Develop AI-assisted translation tools

\`\`\`
Project Impact:
- Support 10 endangered languages
- Engage 5000 native speakers
- Create digital language archives
\`\`\``,
    goal: 8_500,
    deadline: new Date(Date.now() + oneDay),
    refundDeadline: new Date(Date.now() + 7 * oneDay),
    milestones: [],
    coverImage: null,
    categories: ["culture", "education", "tech"],
  },

  {
    title: "Community-Driven Renewable Energy Microgrid",
    summary:
      "Implementing a decentralized, community-owned renewable energy system that empowers rural communities with sustainable, affordable electricity while promoting energy independence and reducing carbon emissions.",
    description: `# Power to the People: Renewable Energy Revolution

## Democratizing Energy Production
- Install solar and wind energy infrastructure
- Create local energy cooperatives
- Reduce carbon footprint and energy costs

\`\`\`
Project Objectives:
- 500 households powered
- 80% renewable energy penetration
- Create 50 local green jobs
\`\`\``,
    goal: 17_500,
    deadline: new Date(Date.now() + oneDay),
    refundDeadline: new Date(Date.now() + 7 * oneDay),
    milestones: [],
    coverImage: null,
    categories: ["renewable_energy", "infrastructure", "community_development"],
  },

  {
    title: "Global Women in STEM Scholarship Program",
    summary:
      "A transformative scholarship initiative supporting women in underrepresented regions by providing funding, mentorship, and research opportunities to promote advanced STEM education and break gender barriers.",
    description: `# Breaking Barriers, Building Futures

## Empowering the Next Generation of Women Scientists
- Provide full scholarships for STEM education
- Create global mentorship networks
- Support groundbreaking research initiatives

\`\`\`
Program Impact:
- 100 scholarships awarded
- 5 countries represented
- Continuous mentorship support
\`\`\``,
    goal: 5_000,
    deadline: new Date(Date.now() + oneDay),
    refundDeadline: new Date(Date.now() + 7 * oneDay),
    milestones: [],
    coverImage: null,
    categories: ["education", "gender_equality", "research"],
  },

  {
    title: "Augmented Reality Educational Toolkit for Special Needs",
    summary:
      "Developing an innovative AR-powered learning platform specifically designed to support and enhance educational experiences for children with diverse learning needs. This promote inclusion and breake barriers in education.",
    description: `# Inclusive Learning Through Technology

## Empowering Diverse Learners
- Create personalized AR learning experiences
- Support multiple learning disabilities
- Provide adaptive educational tools

**Technology breaking barriers in education!**`,
    goal: 9_500,
    deadline: new Date(Date.now() + oneDay),
    refundDeadline: new Date(Date.now() + 7 * oneDay),
    milestones: [],
    coverImage: null,
    categories: ["education", "tech", "social_impact"],
  },

  //
  {
    title: "Global Indigenous Agricultural Knowledge Repository",
    summary:
      "This project creates a digital platform to document and share indigenous agricultural practices, promoting food sovereignty and preserving traditional ecological knowledge for global sustainability...",
    description: `# Preserving Agricultural Heritage

## Protecting Traditional Wisdom
- Document indigenous farming techniques
- Create multilingual knowledge base
- Support global agricultural diversity

**Honoring traditional knowledge, securing future food systems!**`,
    goal: 8_500,
    deadline: new Date(Date.now() + oneDay),
    refundDeadline: new Date(Date.now() + 7 * oneDay),
    milestones: [],
    coverImage: null,
    categories: ["culture", "agriculture", "research"],
  },

  {
    title: "Community-Driven Medical Device for Rural Areas",
    summary:
      "A project to design an affordable, portable diagnostic device tailored for remote regions, empowering local healthcare providers to improve access and deliver critical care effectively. Support this global outreach for people to stay healty with low cost",
    description: `# Healthcare Without Boundaries

## Innovative Medical Technology
- Create low-cost diagnostic tools
- Support remote medical diagnostics
- Empower local healthcare providers

**Bringing advanced healthcare to every community!**`,
    goal: 105,
    deadline: new Date(Date.now() + oneDay),
    refundDeadline: new Date(Date.now() + 7 * oneDay),
    milestones: [],
    coverImage: null,
    categories: ["health_care", "tech", "social_impact"],
  },
  {
    title: "Ocean Plastic to Building Material Conversion",
    summary:
      "Transforming ocean plastic into eco-friendly construction materials, this project supports sustainable infrastructure development while addressing marine pollution and environmental restoration. Support our cause.",
    description: `# Turning Pollution into Solution

## Revolutionary Recycling Approach
- Convert ocean plastic into construction materials
- Create sustainable building solutions
- Clean marine ecosystems

**Healing the planet, one brick at a time!**`,
    goal: 1_750,
    deadline: new Date(Date.now() + oneDay),
    refundDeadline: new Date(Date.now() + 7 * oneDay),
    milestones: [],
    coverImage: null,
    categories: ["environment", "sustainability", "tech"],
  },

  {
    title: "Regenerative Agriculture Training Program",
    summary:
      "This initiative trains farmers in regenerative agriculture techniques, focusing on soil health, biodiversity, and sustainable practices to empower communities and ensure food security....................",
    description: `# Farming the Future

## Sustainable Agricultural Transformation
- Provide hands-on regenerative farming training
- Support ecological farming practices
- Empower global farming communities

**Nurturing the earth, feeding the world!**`,
    goal: 9_500,
    deadline: new Date(Date.now() + oneDay),
    refundDeadline: new Date(Date.now() + 7 * oneDay),
    milestones: [],
    coverImage: null,
    categories: ["education", "environment", "sustainability"],
  },
];
