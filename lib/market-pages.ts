export interface MarketPageFaq {
  question: string
  answer: string
}

export interface MarketPage {
  slug: string
  title: string
  shortTitle: string
  description: string
  definition: string
  faqs: MarketPageFaq[]
  relatedDiscipline: string
}

export const MARKET_PAGES: MarketPage[] = [
  {
    slug: 'plm-software',
    title: 'PLM Software: Product Lifecycle Management Explained',
    shortTitle: 'PLM Software',
    description:
      'What is PLM software? Learn how product lifecycle management platforms manage engineering data, BOM structures, change processes, and compliance across industries.',
    definition:
      'Product Lifecycle Management (PLM) software manages the entire lifecycle of a product — from concept and design through manufacturing, service, and end-of-life. Modern PLM systems integrate CAD data, Bills of Materials (BOMs), change management, requirements traceability, and supplier collaboration into a single data backbone. The market has evolved from monolithic on-premise suites toward modular, cloud-native architectures, with AI-driven startups now challenging incumbent vendors like Siemens, PTC, and Dassault Systèmes.',
    faqs: [
      {
        question: 'What is PLM software used for?',
        answer:
          'PLM software is used to manage product data (CAD files, BOMs, specifications), coordinate engineering change orders, track compliance and regulatory requirements, and connect design teams with manufacturing and supply chain partners. It acts as the single source of truth for a product from initial concept through end-of-life.',
      },
      {
        question: 'What are the leading PLM software vendors?',
        answer:
          'Established PLM vendors include Siemens Teamcenter, PTC Windchill, Dassault Systèmes 3DEXPERIENCE, and Oracle Agile PLM. A growing cohort of AI-native startups is entering the space with modular approaches, better UX, and cloud-first architectures targeting mid-market manufacturers.',
      },
      {
        question: 'How is AI changing PLM software?',
        answer:
          'AI is being applied to PLM to automate BOM generation from CAD models, predict design failures before prototyping, accelerate regulatory document processing, and surface relevant historical design data through semantic search. Startups in ThreadMoat\'s database are introducing generative design, AI change impact analysis, and natural-language BOM queries.',
      },
      {
        question: 'What industries use PLM software?',
        answer:
          'PLM software is used across aerospace, automotive, electronics, industrial machinery, medical devices, and consumer goods. Any industry that manages complex engineered products with multi-tier supply chains and regulatory requirements benefits from PLM.',
      },
    ],
    relatedDiscipline: 'PLM / PDM',
  },
  {
    slug: 'cad-cae-software',
    title: 'CAD and CAE Software: Computer-Aided Design and Engineering',
    shortTitle: 'CAD / CAE Software',
    description:
      'What is CAD and CAE software? Explore computer-aided design and engineering tools, their use in product development, and the AI startups transforming the space.',
    definition:
      'Computer-Aided Design (CAD) software creates digital 2D drawings and 3D models of physical products. Computer-Aided Engineering (CAE) software validates those designs through simulation — structural FEA, fluid dynamics CFD, thermal analysis, and multi-physics modeling. Together they form the digital foundation of modern product development. The market spans parametric modelers (SolidWorks, CATIA), direct modelers, cloud-native CAD tools, and specialized simulation platforms.',
    faqs: [
      {
        question: 'What is the difference between CAD and CAE?',
        answer:
          'CAD (Computer-Aided Design) is used to create geometric models of products. CAE (Computer-Aided Engineering) uses those models to simulate physical behavior — stress, heat, fluid flow — to validate designs before physical prototyping. CAD creates the geometry; CAE tests it virtually.',
      },
      {
        question: 'What are examples of CAD software?',
        answer:
          'Major CAD platforms include SolidWorks (Dassault Systèmes), CATIA, PTC Creo, Siemens NX, Autodesk Fusion, and Onshape. AI-native startups are introducing generative design, AI-assisted modeling, and browser-based collaborative CAD tools.',
      },
      {
        question: 'How is AI being used in CAD and CAE?',
        answer:
          'AI is accelerating CAD and CAE through generative design (automatically generating optimized geometry given constraints), AI mesh generation for faster FEA setup, surrogate models that replace expensive simulations with fast approximations, and natural-language interfaces for model manipulation.',
      },
      {
        question: 'What is cloud-native CAD?',
        answer:
          'Cloud-native CAD tools run entirely in the browser or on cloud infrastructure rather than local workstations. This enables real-time collaboration, easier version management, and access from any device. Platforms like Onshape pioneered this approach, and AI-native startups are building on cloud architecture from day one.',
      },
    ],
    relatedDiscipline: 'CAD / CAE',
  },
  {
    slug: 'industrial-iot',
    title: 'Industrial IoT Platforms: Connecting Factory Floors to the Cloud',
    shortTitle: 'Industrial IoT',
    description:
      'What is Industrial IoT? Discover IIoT platforms, their role in connecting machines and sensors to analytics systems, and the startup landscape shaping this market.',
    definition:
      'Industrial Internet of Things (IIoT) platforms connect machines, sensors, and control systems on factory floors and in the field to cloud infrastructure for monitoring, analytics, and control. They bridge OT (operational technology) — PLCs, SCADA, DCS — with IT systems like ERP and MES. Core capabilities include device management, protocol translation (OPC-UA, MQTT, Modbus), time-series data ingestion, and edge processing. The market is highly fragmented, with hyperscaler platforms (AWS IoT, Azure IoT) competing with specialized OT-native vendors and AI-first startups.',
    faqs: [
      {
        question: 'What is the difference between IoT and Industrial IoT?',
        answer:
          'Consumer IoT connects everyday devices (smart speakers, wearables) to the internet for convenience. Industrial IoT (IIoT) connects industrial equipment — CNC machines, compressors, robots, sensors — to analytics and control systems for operational efficiency, predictive maintenance, and quality monitoring. IIoT operates in harsh environments with strict latency, reliability, and security requirements.',
      },
      {
        question: 'What protocols do IIoT platforms support?',
        answer:
          'IIoT platforms typically support OPC-UA (the dominant industrial standard), MQTT, Modbus, PROFINET, EtherNet/IP, and MQTT Sparkplug. Protocol translation is a key capability since factory floors run dozens of legacy protocols simultaneously.',
      },
      {
        question: 'What are the main use cases for Industrial IoT?',
        answer:
          'Key IIoT use cases include predictive maintenance (detecting equipment failure before it occurs), energy monitoring and optimization, OEE (Overall Equipment Effectiveness) tracking, quality control through in-process sensing, remote monitoring of distributed assets, and digital twin synchronization.',
      },
      {
        question: 'What startups are building Industrial IoT platforms?',
        answer:
          'ThreadMoat tracks 600+ industrial AI and engineering software startups including numerous IIoT platform builders. The space includes companies focused on edge AI, OT/IT convergence, industrial data infrastructure, and vertical-specific connectivity solutions for sectors like energy, automotive, and aerospace.',
      },
    ],
    relatedDiscipline: 'IoT / Connectivity',
  },
  {
    slug: 'ai-manufacturing',
    title: 'AI in Manufacturing: Applications, Benefits and Market Leaders',
    shortTitle: 'AI in Manufacturing',
    description:
      'How is AI used in manufacturing? Explore machine learning applications in quality control, predictive maintenance, process optimization, and the startups driving adoption.',
    definition:
      'Artificial intelligence in manufacturing applies machine learning, computer vision, and optimization algorithms to production processes. Applications span the full manufacturing value chain: from AI-assisted product design and process planning, to real-time quality inspection using computer vision, predictive maintenance of equipment, production scheduling optimization, and supply chain demand forecasting. The convergence of affordable sensing, edge computing, and foundation models is accelerating AI adoption across both discrete and process manufacturing.',
    faqs: [
      {
        question: 'What are the most common AI applications in manufacturing?',
        answer:
          'The most widely deployed AI applications in manufacturing are: visual quality inspection (computer vision detecting defects), predictive maintenance (ML models predicting equipment failures), production scheduling optimization, demand forecasting, and process parameter optimization to reduce waste and energy use.',
      },
      {
        question: 'What is the difference between AI and traditional automation in manufacturing?',
        answer:
          'Traditional automation follows rigid programmed rules — a robot repeats exactly the same motion. AI-driven automation learns from data and adapts: a computer vision system trained on defect images can generalize to new defect types, and a predictive maintenance model improves as more equipment data accumulates. AI enables flexible automation that handles variability.',
      },
      {
        question: 'How much investment is flowing into AI manufacturing startups?',
        answer:
          'ThreadMoat tracks over $15B in venture funding across 600+ industrial AI and engineering software startups as of Q1 2026. AI-in-manufacturing represents one of the largest verticals in this space, attracting investment from both generalist VCs and deep industrial-focused funds.',
      },
      {
        question: 'What challenges do manufacturers face when adopting AI?',
        answer:
          'Key challenges include: lack of labeled training data (especially for rare defects), integration with legacy OT systems, change management and workforce retraining, ROI justification for long industrial payback periods, and data governance concerns across multi-site operations.',
      },
    ],
    relatedDiscipline: 'AI / ML Applications',
  },
  {
    slug: 'digital-twin',
    title: 'Digital Twin Technology: What It Is and How Companies Use It',
    shortTitle: 'Digital Twin',
    description:
      'What is a digital twin? Learn how digital twin technology creates virtual replicas of physical assets, products, and processes — and which startups are leading the market.',
    definition:
      'A digital twin is a virtual representation of a physical object, process, or system that is synchronized with its real-world counterpart through sensor data and simulation. Industrial digital twins span product twins (CAD/simulation models linked to as-built state), production twins (simulations of factory lines), and performance twins (live analytics on operating assets). The technology draws on IoT connectivity, physics-based simulation, and increasingly AI to enable what-if analysis, predictive maintenance, and optimization without physical intervention.',
    faqs: [
      {
        question: 'What is a digital twin in simple terms?',
        answer:
          'A digital twin is a virtual copy of a physical thing — a machine, a product, a factory, or even a supply chain — that stays synchronized with its real-world counterpart through data. You can run simulations, test changes, and predict failures on the virtual copy without touching the physical one.',
      },
      {
        question: 'What is the difference between a digital twin and simulation?',
        answer:
          'Traditional simulation is a static model run at a point in time. A digital twin is continuously updated with live operational data, so it reflects the current state of the real asset. A simulation might model how a turbine behaves at design conditions; a digital twin models how that specific turbine behaves right now, given its wear history and current operating conditions.',
      },
      {
        question: 'What industries use digital twins most?',
        answer:
          'Digital twins are most mature in aerospace (aircraft maintenance), energy (wind turbines, grid management), automotive (vehicle development and fleet monitoring), industrial machinery (predictive maintenance), and smart buildings. Adoption is accelerating in life sciences (clinical trials, drug manufacturing) and infrastructure.',
      },
      {
        question: 'Which companies are building digital twin software?',
        answer:
          'Major platform vendors include Siemens (Xcelerator), PTC (ThingWorx/Vuforia), ANSYS (Twin Builder), and GE Vernova (Predix). ThreadMoat tracks dozens of AI-native startups building domain-specific digital twin capabilities for manufacturing, energy, and infrastructure markets.',
      },
    ],
    relatedDiscipline: 'Digital Twin',
  },
  {
    slug: 'engineering-simulation',
    title: 'Engineering Simulation Software: FEA, CFD and Beyond',
    shortTitle: 'Engineering Simulation',
    description:
      'What is engineering simulation software? Explore FEA, CFD, and multi-physics simulation tools, their role in product development, and AI-driven advances in the space.',
    definition:
      'Engineering simulation software uses mathematical models to predict the physical behavior of designs before prototypes are built. Finite Element Analysis (FEA) models structural stress and deformation; Computational Fluid Dynamics (CFD) simulates fluid flow and heat transfer; multi-physics tools combine both. Simulation reduces prototype cycles, enables design exploration, and supports regulatory certification. The market is dominated by ANSYS, Siemens STAR-CCM+, and Dassault Abaqus — but AI is enabling surrogate models that run simulations 1000x faster than traditional solvers.',
    faqs: [
      {
        question: 'What is FEA (Finite Element Analysis)?',
        answer:
          'Finite Element Analysis (FEA) is a computational method that divides a structure into thousands of small elements, then solves the governing equations of structural mechanics across each element to predict stress, strain, deformation, and fatigue under applied loads. It is used to validate product designs before physical testing.',
      },
      {
        question: 'What is CFD (Computational Fluid Dynamics)?',
        answer:
          'CFD (Computational Fluid Dynamics) simulates how fluids — gases and liquids — flow around and through objects. It is used to optimize aerodynamic shapes, design cooling systems, analyze combustion, and model HVAC performance. CFD simulations are computationally expensive, which is why AI-based surrogate models are an active area of startup activity.',
      },
      {
        question: 'How is AI being applied to engineering simulation?',
        answer:
          'AI is transforming simulation in three ways: (1) AI surrogate models that learn from large simulation datasets to predict results in milliseconds rather than hours; (2) AI-assisted mesh generation that reduces pre-processing time; (3) neural operators like FNOs that solve PDEs directly without traditional discretization. Startups in this space are reducing simulation costs by orders of magnitude.',
      },
      {
        question: 'What is multi-physics simulation?',
        answer:
          'Multi-physics simulation couples different physical phenomena — structural mechanics, thermal effects, fluid flow, electromagnetics — in a single model. For example, simulating how a battery cell heats up during charging (electrochemistry + thermal + structural) requires multi-physics coupling. Tools like ANSYS Multiphysics and COMSOL Multiphysics specialize in this.',
      },
    ],
    relatedDiscipline: 'Simulation / CAE',
  },
  {
    slug: 'manufacturing-execution-systems',
    title: 'Manufacturing Execution Systems (MES): Definition and Key Features',
    shortTitle: 'Manufacturing Execution Systems',
    description:
      'What is a Manufacturing Execution System (MES)? Learn how MES software manages production operations, tracks WIP, and connects shop floor to enterprise systems.',
    definition:
      'A Manufacturing Execution System (MES) is software that manages, monitors, and tracks production processes on the shop floor in real time. It sits between ERP systems (which plan and schedule production) and the physical machines (controlled by PLCs and SCADA). Core MES functions include work order management, labor and machine tracking, quality management, genealogy and traceability, and OEE monitoring. Modern MES platforms are evolving toward cloud deployment and AI-driven scheduling, with startups targeting mid-market manufacturers who previously relied on spreadsheets.',
    faqs: [
      {
        question: 'What is the difference between MES and ERP?',
        answer:
          'ERP (Enterprise Resource Planning) manages business planning — orders, inventory, finance, HR — at the enterprise level. MES (Manufacturing Execution System) manages actual production execution on the shop floor in real time. ERP tells the factory what to make and when; MES tracks exactly how it gets made, step by step, machine by machine.',
      },
      {
        question: 'What are the core functions of an MES?',
        answer:
          'Core MES functions include: production scheduling and dispatching, work order management, real-time machine and labor monitoring, quality data collection and SPC, material and lot traceability, OEE calculation, and integration with ERP systems for order and inventory synchronization.',
      },
      {
        question: 'What industries use MES software?',
        answer:
          'MES is used in electronics and semiconductor manufacturing, automotive assembly, medical device production, food and beverage, pharmaceuticals (where 21 CFR Part 11 compliance requires full traceability), and aerospace. Any industry with complex multi-step production processes benefits from MES.',
      },
      {
        question: 'How is AI changing MES?',
        answer:
          'AI is being applied to MES for dynamic production scheduling (reacting to machine breakdowns in real time), predictive quality (detecting defect patterns before rejects occur), AI-assisted operator guidance, and autonomous process parameter optimization. Startups are building AI-native MES platforms that go beyond tracking to actively optimizing production.',
      },
    ],
    relatedDiscipline: 'MES / Operations',
  },
  {
    slug: 'supply-chain-intelligence',
    title: 'Supply Chain Intelligence: AI-Driven Visibility and Risk Management',
    shortTitle: 'Supply Chain Intelligence',
    description:
      'What is supply chain intelligence? Explore AI-driven tools for supply chain visibility, demand forecasting, supplier risk, and disruption prediction.',
    definition:
      'Supply chain intelligence applies data analytics and AI to improve visibility, resilience, and efficiency across the end-to-end supply chain. It goes beyond traditional supply chain management (ERP-driven planning) to incorporate real-time external signals — geopolitical events, weather, shipping delays, supplier financial health — and use machine learning to predict disruptions before they hit. Key capabilities include multi-tier supplier visibility, demand sensing, logistics optimization, and risk scoring. The COVID-19 disruptions accelerated investment in this category, with dozens of AI-native startups building on alternative data sources.',
    faqs: [
      {
        question: 'What is supply chain visibility?',
        answer:
          'Supply chain visibility means knowing the real-time location, status, and condition of inventory, components, and shipments across your entire supply network — from Tier 1 through Tier N suppliers. AI-driven visibility tools aggregate data from ERPs, logistics APIs, carrier tracking, and IoT sensors to create a unified view.',
      },
      {
        question: 'How does AI improve supply chain forecasting?',
        answer:
          'Traditional demand forecasting uses historical sales data and seasonal patterns. AI-augmented forecasting layers in external signals — social media trends, POS data, weather forecasts, economic indicators — and uses ML models (gradient boosting, LSTM neural networks) to capture non-linear demand patterns and detect early demand signals.',
      },
      {
        question: 'What is supply chain risk management?',
        answer:
          'Supply chain risk management identifies and mitigates risks that can disrupt supply — single-source dependencies, financially stressed suppliers, geopolitical exposure, natural disaster probability, and logistics bottlenecks. AI tools score supplier risk using financial data, news signals, satellite imagery, and shipping data to give procurement teams early warning.',
      },
      {
        question: 'What is the difference between supply chain management and supply chain intelligence?',
        answer:
          'Supply chain management (SCM) coordinates the planning, execution, and monitoring of supply chain operations — typically within an ERP or dedicated SCM platform. Supply chain intelligence adds a data and analytics layer on top: it ingests multi-source external data, applies AI to surface insights and predictions, and provides decision support that traditional SCM tools cannot offer.',
      },
    ],
    relatedDiscipline: 'Supply Chain / Logistics',
  },
  {
    slug: 'quality-management-systems',
    title: 'Quality Management Systems (QMS): Software for Compliance and Control',
    shortTitle: 'Quality Management Systems',
    description:
      'What is a Quality Management System (QMS)? Learn how QMS software supports ISO 9001, FDA compliance, CAPA, nonconformance tracking, and AI-driven quality intelligence.',
    definition:
      'A Quality Management System (QMS) is a set of processes, policies, and tools that organizations use to ensure products and services consistently meet customer requirements and regulatory standards. QMS software manages document control, corrective and preventive actions (CAPA), nonconformance tracking, audit management, supplier quality, and training records. In regulated industries (medical devices, pharmaceuticals, aerospace), QMS platforms must meet specific compliance frameworks — ISO 9001, ISO 13485, AS9100, FDA 21 CFR Part 820. AI is being applied to predict quality escapes, auto-classify defects, and generate CAPA documentation.',
    faqs: [
      {
        question: 'What is ISO 9001 and how does QMS software support it?',
        answer:
          'ISO 9001 is the international standard for quality management systems, requiring organizations to demonstrate process control, customer focus, risk-based thinking, and continual improvement. QMS software supports ISO 9001 compliance through document control (versioning, approval workflows), audit management, nonconformance tracking, and CAPA processes.',
      },
      {
        question: 'What is a CAPA in quality management?',
        answer:
          'CAPA stands for Corrective and Preventive Action. A corrective action addresses a nonconformance that has already occurred — identifying root cause and fixing it. A preventive action addresses a potential nonconformance before it happens. CAPA management is a core QMS function, especially critical in regulated industries like medical devices and pharma.',
      },
      {
        question: 'How is AI being applied to quality management?',
        answer:
          'AI applications in quality include: computer vision for automated defect detection, ML models that predict quality failures from process parameters (Statistical Process Control augmented by ML), NLP for auto-classifying customer complaints and nonconformance reports, and generative AI for drafting CAPA documentation from structured inputs.',
      },
      {
        question: 'What is the difference between QMS and MES quality modules?',
        answer:
          'QMS software manages the quality system — documents, procedures, CAPA, audits, training — as a system of record. MES quality modules capture in-process measurement data and enforce inspection steps during production. They are complementary: MES feeds quality events into the QMS, where root cause analysis and corrective actions are managed.',
      },
    ],
    relatedDiscipline: 'Quality / Compliance',
  },
  {
    slug: 'industrial-robotics-software',
    title: 'Industrial Robotics Software: Programming, AI, and the Future of Automation',
    shortTitle: 'Industrial Robotics Software',
    description:
      'What is industrial robotics software? Explore robot programming, AI-driven flexible automation, and the startups building the next generation of robotics intelligence.',
    definition:
      'Industrial robotics software encompasses the tools used to program, deploy, monitor, and optimize industrial robots — from traditional teach-pendant programming to modern AI-driven autonomous operation. The market includes offline robot programming (OLP) tools, simulation environments for robot cell validation, vision systems for bin-picking and inspection, motion planning software, and increasingly AI layers that enable robots to adapt to variability without reprogramming. The convergence of AI, affordable compute, and advances in robot hardware is enabling a new generation of flexible automation startups disrupting the traditional robotics integrator model.',
    faqs: [
      {
        question: 'What software is used to program industrial robots?',
        answer:
          'Industrial robots are programmed using vendor-specific languages (RAPID for ABB, KRL for KUKA, Karel for FANUC) or increasingly through offline programming (OLP) tools like Robotmaster and RoboDK that allow programming in simulation. AI-native startups are introducing no-code interfaces and demonstration-based programming that reduce the need for specialized robot programmers.',
      },
      {
        question: 'What is offline robot programming (OLP)?',
        answer:
          'Offline programming (OLP) allows robots to be programmed in a virtual simulation environment rather than on the physical robot in the factory. This reduces production downtime during programming, enables complex path planning, and allows validation of robot cells before installation. OLP tools import CAD models of the workpiece and robot cell to generate collision-free paths.',
      },
      {
        question: 'How is AI changing industrial robotics?',
        answer:
          'AI is making robots more flexible and easier to deploy. Key advances include: AI-powered vision for bin-picking (grasping randomly oriented parts), reinforcement learning for robot motion planning, large language model interfaces for programming robots through natural language, force-feedback AI for assembly tasks, and anomaly detection for robot predictive maintenance.',
      },
      {
        question: 'What is the difference between industrial robots and collaborative robots (cobots)?',
        answer:
          'Traditional industrial robots operate in caged environments at high speeds, optimized for throughput. Collaborative robots (cobots) are designed to work safely alongside humans without physical barriers, with built-in force-sensing and speed limits. Cobots like Universal Robots and FANUC CRX are easier to deploy and reprogram, making them popular for flexible manufacturing cells. AI is accelerating cobot deployment by enabling easier vision-guided programming.',
      },
    ],
    relatedDiscipline: 'Robotics / Automation',
  },
]

export function getMarketPage(slug: string): MarketPage | undefined {
  return MARKET_PAGES.find((p) => p.slug === slug)
}

export function getAllMarketSlugs(): string[] {
  return MARKET_PAGES.map((p) => p.slug)
}
