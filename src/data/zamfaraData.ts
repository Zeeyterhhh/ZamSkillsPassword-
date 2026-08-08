import { Assessment, SkillCategory, ZAMFARA_LGAS } from '../types';

export const ZAMFARA_INFO = {
  stateName: 'Zamfara State',
  capital: 'Gusau',
  slogan: 'Farming is Our Pride',
  region: 'North-West Nigeria',
  lgaCount: 14,
  lgas: ZAMFARA_LGAS,
};

export const SDG_ALIGNMENT = [
  {
    code: 'SDG 8',
    title: 'Decent Work and Economic Growth',
    description: 'Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for youth in Zamfara State.',
    iconName: 'Briefcase',
    color: 'from-amber-600 to-amber-800'
  },
  {
    code: 'SDG 4',
    title: 'Quality Education & Skills Training',
    description: 'Ensure inclusive and equitable quality education and promote lifelong learning opportunities for vocational and digital competencies.',
    iconName: 'GraduationCap',
    color: 'from-red-600 to-red-800'
  }
];

export const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 'asm-it-01',
    title: 'Information Technology & Digital Literacy Competency',
    category: 'Information Technology',
    description: 'Test your core understanding of computer systems, internet safety, MS Office / Google Workspace, and basic software troubleshooting.',
    timeLimitMinutes: 10,
    passingScorePercent: 70,
    questions: [
      {
        id: 'q-it-1',
        questionText: 'What is the primary function of an Operating System (OS)?',
        options: [
          'To run antivirus software only',
          'To manage computer hardware and software resources and provide common services',
          'To connect directly to satellite internet',
          'To format spreadsheets automatically'
        ],
        correctOptionIndex: 1,
        explanation: 'An Operating System acts as an intermediary between user applications and the computer hardware.'
      },
      {
        id: 'q-it-2',
        questionText: 'Which protocol is used for secure web browsing over the Internet?',
        options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'],
        correctOptionIndex: 2,
        explanation: 'HTTPS encrypts web traffic using TLS/SSL to protect data in transit.'
      },
      {
        id: 'q-it-3',
        questionText: 'Which spreadsheet formula calculates the sum of cells A1 through A10 in Microsoft Excel?',
        options: ['=TOTAL(A1:A10)', '=SUM(A1:A10)', '=ADD(A1..A10)', '=COUNT(A1:A10)'],
        correctOptionIndex: 1,
        explanation: '=SUM(A1:A10) adds up all numeric values in the specified cell range.'
      },
      {
        id: 'q-it-4',
        questionText: 'What is a strong practice to protect your digital accounts from unauthorized access?',
        options: [
          'Use "password123" for all accounts',
          'Share your credentials with coworkers',
          'Enable Two-Factor Authentication (2FA) and use unique passwords',
          'Never update software updates'
        ],
        correctOptionIndex: 2,
        explanation: '2FA adds an extra verification layer beyond just a password.'
      },
      {
        id: 'q-it-5',
        questionText: 'What does cloud computing refer to?',
        options: [
          'Storing files on a local USB drive',
          'Delivering computing services over the Internet including servers, storage, and databases',
          'Installing solar panels on server rooms',
          'Printing documents via Bluetooth'
        ],
        correctOptionIndex: 1,
        explanation: 'Cloud computing allows accessing computing resources on demand over the internet.'
      }
    ]
  },
  {
    id: 'asm-tailor-01',
    title: 'Tailoring & Garment Construction Proficiency',
    category: 'Tailoring/Fashion',
    description: 'Evaluate your knowledge of body measurements, fabric selection, sewing machine operation, and garment finishing techniques.',
    timeLimitMinutes: 10,
    passingScorePercent: 70,
    questions: [
      {
        id: 'q-tailor-1',
        questionText: 'What is the correct seam allowance standard commonly used for woven garment assembly?',
        options: ['1/8 inch (3mm)', '5/8 inch (1.5cm)', '2 inches (5cm)', 'No allowance needed'],
        correctOptionIndex: 1,
        explanation: '5/8 inch (approx 1.5 cm) is the standard commercial seam allowance for garment sewing.'
      },
      {
        id: 'q-tailor-2',
        questionText: 'Which stitch type is best suited for finishing raw fabric edges to prevent fraying?',
        options: ['Basting stitch', 'Overlock (Serger) stitch', 'Running stitch', 'Backstitch'],
        correctOptionIndex: 1,
        explanation: 'An overlock/serger stitch encloses raw edges cleanly.'
      },
      {
        id: 'q-tailor-3',
        questionText: 'When cutting traditional Kaftan or Agbada fabric, why is fabric grainline alignment essential?',
        options: [
          'To save thread',
          'To ensure the garment hangs straight and does not twist after washing',
          'To make the sewing machine run faster',
          'To change the fabric color'
        ],
        correctOptionIndex: 1,
        explanation: 'Cutting along the correct grainline ensures structural balance and comfortable drape.'
      },
      {
        id: 'q-tailor-4',
        questionText: 'Which tool is used to transfer pattern markings accurately onto fabric?',
        options: ['Tailor’s chalk or tracing wheel', 'Sandpaper', 'Pinking shears', 'Hot iron'],
        correctOptionIndex: 0,
        explanation: 'Tailor’s chalk allows clear, temporary markings that wash out easily.'
      },
      {
        id: 'q-tailor-5',
        questionText: 'What is pressing in tailoring, and why is it performed during construction?',
        options: [
          'Folding finished clothes for packing',
          'Ironing seams flat at each step of assembly to achieve crisp professional structure',
          'Soaking fabric in dye before cutting',
          'Stretching the fabric out of shape'
        ],
        correctOptionIndex: 1,
        explanation: 'Pressing seams flat as you build the garment gives it a crisp, tailored finish.'
      }
    ]
  },
  {
    id: 'asm-agric-01',
    title: 'Modern Agricultural Practices & Agribusiness',
    category: 'Agriculture',
    description: 'Assess competencies in soil management, crop rotation, livestock handling, irrigation efficiency, and agribusiness value chains in Zamfara State.',
    timeLimitMinutes: 10,
    passingScorePercent: 70,
    questions: [
      {
        id: 'q-agric-1',
        questionText: 'Which irrigation technique conserves the highest percentage of water in arid or semi-arid regions like Zamfara?',
        options: ['Flood irrigation', 'Drip irrigation', 'Furrow irrigation', 'Canal flooding'],
        correctOptionIndex: 1,
        explanation: 'Drip irrigation delivers water directly to the root zone, minimizing evaporation.'
      },
      {
        id: 'q-agric-2',
        questionText: 'What primary benefit does crop rotation offer to arable farmlands?',
        options: [
          'Reduces harvest labor by half',
          'Breaks pest/disease cycles and replenishes specific soil nutrients',
          'Eliminates the need for rainfall',
          'Increases soil acidity to maximum levels'
        ],
        correctOptionIndex: 1,
        explanation: 'Rotating leguminous crops like cowpea with cereals restores nitrogen and disrupts pest life cycles.'
      },
      {
        id: 'q-agric-3',
        questionText: 'In poultry production, what is the purpose of vaccination schedules during brooding?',
        options: [
          'To increase feed consumption rapidly',
          'To prevent viral outbreaks such as Newcastle and Gumboro diseases',
          'To change feather colors',
          'To replace clean drinking water'
        ],
        correctOptionIndex: 1,
        explanation: 'Vaccinations build immunity against prevalent infectious poultry diseases.'
      },
      {
        id: 'q-agric-4',
        questionText: 'Which post-harvest practice preserves harvested grains (maize, sorghum, rice) from weevil damage without toxic chemical residues?',
        options: [
          'Hermetic storage bags (e.g. PICS bags)',
          'Leaving grains outdoors in open heaps',
          'Washing grains with detergent',
          'Mixing grains with wet soil'
        ],
        correctOptionIndex: 0,
        explanation: 'Hermetic PICS bags deprive insect pests of oxygen, preserving grain quality safely.'
      },
      {
        id: 'q-agric-5',
        questionText: 'What is the main goal of Agricultural Value Chain Management?',
        options: [
          'Only selling raw produce at rural market days',
          'Connecting production, processing, storage, logistics, and markets to maximize profit',
          'Preventing farmers from using mobile phones',
          'Exporting topsoil abroad'
        ],
        correctOptionIndex: 1,
        explanation: 'Value chains add economic value at each step from farm gate to final consumer.'
      }
    ]
  },
  {
    id: 'asm-elec-01',
    title: 'Electrical Installation & Solar PV Technology',
    category: 'Electrical Installation',
    description: 'Test practical knowledge of domestic wiring, circuit safety, inverter setup, and solar PV panel installations.',
    timeLimitMinutes: 10,
    passingScorePercent: 70,
    questions: [
      {
        id: 'q-elec-1',
        questionText: 'What is the function of a Circuit Breaker in a domestic electrical distribution panel?',
        options: [
          'To increase voltage during power cuts',
          'To automatically trip and cut power when overcurrent or short circuit occurs',
          'To convert AC power into DC power',
          'To measure monthly electricity usage'
        ],
        correctOptionIndex: 1,
        explanation: 'Circuit breakers prevent electrical fires and equipment damage by tripping on overload.'
      },
      {
        id: 'q-elec-2',
        questionText: 'In a standalone Solar PV system, what component regulates charging to protect batteries from overcharging?',
        options: ['Solar Inverter', 'Charge Controller (MPPT/PWM)', 'AC Isolator Switch', 'Surge Protector'],
        correctOptionIndex: 1,
        explanation: 'The charge controller manages voltage and current from solar panels into the battery bank.'
      },
      {
        id: 'q-elec-3',
        questionText: 'What wire color standard is used for Earth grounding in modern Nigerian electrical codes?',
        options: ['Red', 'Black', 'Green/Yellow Stripe', 'Blue'],
        correctOptionIndex: 2,
        explanation: 'Green with Yellow stripe is the standard Earth protective conductor identification.'
      },
      {
        id: 'q-elec-4',
        questionText: 'According to Ohm’s Law, if Voltage is 220V and Resistance is 22 Ohms, what is the Current (I)?',
        options: ['5 Amperes', '10 Amperes', '22 Amperes', '4840 Amperes'],
        correctOptionIndex: 1,
        explanation: 'I = V / R = 220 / 22 = 10 Amperes.'
      },
      {
        id: 'q-elec-5',
        questionText: 'Before performing maintenance on a distribution board, what critical safety step must be conducted first?',
        options: [
          'Wear wet cotton gloves',
          'Perform lock-out / tag-out and test for voltage absence with a calibrated multimeter',
          'Turn on all light switches',
          'Connect live wires directly to ground'
        ],
        correctOptionIndex: 1,
        explanation: 'Verifying zero voltage isolation ensures the electrician will not suffer electric shock.'
      }
    ]
  },
  {
    id: 'asm-mktg-01',
    title: 'Digital Marketing & E-Commerce Readiness',
    category: 'Digital Marketing',
    description: 'Evaluate skills in social media marketing, local business branding, customer retention, and mobile analytics.',
    timeLimitMinutes: 10,
    passingScorePercent: 70,
    questions: [
      {
        id: 'q-mktg-1',
        questionText: 'What does "Target Audience" mean in a marketing strategy?',
        options: [
          'Everyone living in Nigeria',
          'The specific group of consumers most likely to want or need your product or service',
          'Only people who own computers',
          'Competitors in the same market'
        ],
        correctOptionIndex: 1,
        explanation: 'Defining a specific target audience ensures marketing budgets are spent efficiently.'
      },
      {
        id: 'q-mktg-2',
        questionText: 'Which metric measures the percentage of website or landing page visitors who take a desired action (e.g. buying or applying)?',
        options: ['Click-Through Rate (CTR)', 'Bounce Rate', 'Conversion Rate', 'Impression Count'],
        correctOptionIndex: 2,
        explanation: 'Conversion rate calculates how many visitors turn into paying customers or leads.'
      },
      {
        id: 'q-mktg-3',
        questionText: 'What key benefit does Google Business Profile provide to a local enterprise in Gusau?',
        options: [
          'Free television advertising',
          'Allows local customers to find your address, operating hours, and reviews on Google Maps',
          'Replaces the need for business registration',
          'Automatically pays local taxes'
        ],
        correctOptionIndex: 1,
        explanation: 'Google Business Profile increases local search visibility on Google Maps.'
      },
      {
        id: 'q-mktg-4',
        questionText: 'What is "SEO" in digital web channels?',
        options: [
          'Social Energy Optimization',
          'Search Engine Optimization - improving content so search engines rank your page higher',
          'Software Engineering Office',
          'System Electronic Operator'
        ],
        correctOptionIndex: 1,
        explanation: 'SEO improves organic visibility in search results like Google.'
      },
      {
        id: 'q-mktg-5',
        questionText: 'Why is WhatsApp Business particularly effective for youth entrepreneurs in Northern Nigeria?',
        options: [
          'It charges zero data for video calls',
          'It offers catalog management, automated quick replies, and direct customer trust communication',
          'It replaces bank accounts completely',
          'It broadcasts to 1 million strangers automatically'
        ],
        correctOptionIndex: 1,
        explanation: 'WhatsApp Business features like product catalogs and automated messaging build direct customer relationships.'
      }
    ]
  }
];
