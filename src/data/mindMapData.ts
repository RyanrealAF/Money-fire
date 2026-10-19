import { MindMapNode } from '../types';

export const masterMindMapData: MindMapNode = {
  id: 'root',
  title: 'Rebuilding Public Safety Infrastructure',
  subtitle: 'Stop the $43,000 Money Fire & Build Clinical Off-Ramps',
  category: 'root',
  color: '#E7E0D4',
  icon: 'Network',
  details: 'A street-tested, data-backed operational blueprint to transition municipal budgets away from reactive street sweep loops and into civilian mobile crisis units, judicial diversion, 1115 Medicaid waivers, and low-barrier non-congregate housing.',
  extendedAnalysis: 'Current municipal enforcement treats homelessness and severe untreated psychiatric illness as a sanitation issue. By funneling millions into police overtime, hazmat trucks, and emergency department churn, cities spend $43,000 per person annually while achieving a 0.3% treatment success rate and increasing overdose mortality up to 40x. This blueprint realigns existing dollars into evidence-based diversion infrastructure.',
  metrics: [
    { label: 'Status Quo Cost / Person', value: '$43,000', subtext: 'Annual municipal expense per unsheltered individual', trend: 'negative' },
    { label: 'Status Quo Retention', value: '0.3%', subtext: 'Displacement yields near-zero clinical stabilization', trend: 'negative' },
    { label: 'Overdose Spike Risk', value: '13.9x–40x', subtext: 'Following involuntary encampment displacement', trend: 'negative' },
    { label: 'Demonstrated Public ROI', value: '$8.3M+', subtext: 'Documented public offset in Denver PSH RCT study', trend: 'positive' }
  ],
  citations: [
    'Urban Institute: Denver Supportive Housing Social Impact Bond Initiative RCT (2021)',
    'JAMA Internal Medicine: Health Outcomes of Involuntary Displacement of Unsheltered Individuals (2023)',
    'Stanford University / American Economic Association: STAR Mobile Crisis Evaluation (2022)'
  ],
  actionRecommendation: 'Convene Mayor, City Council, County Sheriff, and Chief Public Defender to pass a unified Crisis Redirection Resolution shifting 30% of sweep sanitation budget into civilian crisis dispatch and Medicaid 1115 matching programs.',
  children: [
    {
      id: 'p1-fiscal-failure',
      title: '1. The Fiscal Money Fire',
      subtitle: 'The Economics of Involuntary Sweeps',
      category: 'pillar-1',
      color: '#EF4444',
      icon: 'Flame',
      details: 'Reactive sweeps, hazmat crews, and emergency rooms burn $43,000 per person annually to move unsheltered people two blocks over, generating zero treatment progress.',
      extendedAnalysis: 'Cities repeatedly deploy armed patrol officers, code enforcement, and contracted hazmat compactors to clear camps. Within 48 to 72 hours, 95%+ of displaced individuals re-establish camps within a 2-to-4 block radius because shelter capacity is non-existent or barriers (bans on pets, possessions, partners) prevent entry. Meanwhile, taxpayers pay twice: once for the sweep, and again for acute ER visits and jail bookings.',
      metrics: [
        { label: 'Annual Sweep Burn', value: '$43,000', subtext: 'Per person annually in acute crisis cycling', trend: 'negative' },
        { label: 'Treatment Connection', value: '0.3%', subtext: 'Accepted shelter beds resulting in long-term treatment', trend: 'negative' },
        { label: 'Camp Recurrence', value: '96%', subtext: 'Encampment re-formation within 14 days', trend: 'negative' }
      ],
      citations: [
        'National Health Care for the Homeless Council: Cost of Homelessness and Sweeps',
        'Western Regional Advocacy Project: Municipal Budget Analysis of Encampment Sweeps'
      ],
      actionRecommendation: 'Audit all municipal departments (Police, Public Works, Parks, Sanitation) to aggregate hidden "sweep expenditures" into a single line item, exposing the true fiscal burn to the city council.',
      children: [
        {
          id: 'p1-street-math',
          title: '$43,000 Annual Price Tag',
          category: 'pillar-1',
          color: '#F87171',
          icon: 'DollarSign',
          details: 'Cities spend $38,000–$43,000 per person annually on sweeps, hazmat trucks, police overtime, emergency medical services, and jail intake.',
          metrics: [
            { label: 'Police Overtime / Sweep', value: '$1,200–$2,800', subtext: 'Per standard multi-officer perimeter operation' },
            { label: 'Hazmat Truck Deploy', value: '$450/hr', subtext: 'Specialized biohazard waste compactor equipment' },
            { label: 'Jail Booking / Night', value: '$185–$340', subtext: 'County correctional bed per capita day rate' }
          ],
          citations: ['Denver Crime Prevention and Control Commission (CPCC) Fiscal Analysis'],
          actionRecommendation: 'Redirect municipal overtime allocations from sanitation support to civilian crisis dispatch and interim tiny-home operations.',
          children: [
            {
              id: 'p1-math-1',
              title: 'Sweeps & Hazmat Crews',
              category: 'pillar-1',
              color: '#FCA5A5',
              icon: 'Trash2',
              details: 'Extreme hourly equipment and contractor costs to crush tents, medication, sleeping bags, and personal possessions into dumpsters.',
              citations: ['City Budget Records & Sanitation Contract Overviews']
            },
            {
              id: 'p1-math-2',
              title: 'Police Overtime & Court Processing',
              category: 'pillar-1',
              color: '#FCA5A5',
              icon: 'ShieldAlert',
              details: 'Diverting high-wage armed patrol officers to conduct perimeter security and execute bench warrants on survival infractions.',
              citations: ['Police Executive Research Forum (PERF): Responding to Homelessness']
            },
            {
              id: 'p1-math-3',
              title: 'Revolving ER & Detention Intake',
              category: 'pillar-1',
              color: '#FCA5A5',
              icon: 'Activity',
              details: 'Emergency rooms function as the de facto shelter system of last resort at $2,400+ per visit with zero care continuity.',
              citations: ['American Hospital Association: High-Utilizer Healthcare Interventions']
            }
          ]
        },
        {
          id: 'p1-failing-return',
          title: '0.3% Treatment Success Rate',
          category: 'pillar-1',
          color: '#F87171',
          icon: 'TrendingDown',
          details: 'Pure displacement yields zero long-term stabilization while taxpayers pay twice for the exact same revolving door.',
          metrics: [
            { label: 'Shelter Bed Acceptance', value: '< 5%', subtext: 'Offers rejected due to congregate safety/barrier rules' },
            { label: '90-Day Treatment Success', value: '0.3%', subtext: 'Actual sustained recovery rate from sweep-initiated offers' }
          ],
          citations: ['San Francisco Dept of Homelessness and Supportive Housing Audit'],
          actionRecommendation: 'Replace sweep offers with immediate low-barrier non-congregate housing navigation (private pods, couples/pets permitted, gear lockers).',
          children: [
            {
              id: 'p1-ret-1',
              title: 'Two-Block Displacement Loop',
              category: 'pillar-1',
              color: '#FCA5A5',
              icon: 'RotateCw',
              details: 'Encampment sweeps move people two blocks over to set up again, transferring the neighborhood burden without solving root problems.',
              citations: ['Urban Institute Longitudinal Camp Tracking']
            },
            {
              id: 'p1-ret-2',
              title: 'Taxpayer Double-Pay Cycle',
              category: 'pillar-1',
              color: '#FCA5A5',
              icon: 'Receipt',
              details: 'Taxpayers pay first for the sweep crew and police overtime, then again 24 hours later for ambulance transport and jail booking.',
              citations: ['Center on Budget and Policy Priorities: Housing First Cost Effectiveness']
            }
          ]
        },
        {
          id: 'p1-mortality-spikes',
          title: 'Public Health & Mortality Spikes',
          category: 'pillar-1',
          color: '#F87171',
          icon: 'Skull',
          details: 'Sweeps sever clinical connections, destroy vital identity documents and life-saving meds, and spike fatal overdoses by up to 40x.',
          metrics: [
            { label: 'Overdose Mortality Spike', value: '13.9x–40x', subtext: 'Relative risk increase post-displacement', trend: 'negative' },
            { label: 'Lost ID Replacement Delay', value: '4–9 Mos', subtext: 'Birth certificates crushed, resetting HUD vouchers' }
          ],
          citations: ['JAMA Internal Medicine: Health Outcomes of Involuntary Encampment Sweeps (2023)'],
          actionRecommendation: 'Institute a strict "No Property Destruction" ordinance with secure personal property lockers and certified medical continuity officers present.',
          children: [
            {
              id: 'p1-mort-1',
              title: '13.9x–40x Overdose Death Multiplier',
              category: 'pillar-1',
              color: '#FCA5A5',
              icon: 'AlertTriangle',
              details: 'Displacement severs contact with known harm reduction peers and resets opioid drug tolerance during chaotic relocations.',
              citations: ['National Institutes of Health / CDC Epidemiological Study on Overdoses']
            },
            {
              id: 'p1-mort-2',
              title: 'Involuntary Pavement Withdrawal',
              category: 'pillar-1',
              color: '#FCA5A5',
              icon: 'HeartCrack',
              details: 'Roadside confiscations discard buprenorphine and psychiatric prescriptions, forcing acute unmonitored withdrawal on the pavement.',
              citations: ['Street Medicine Institute Clinical Field Notes']
            },
            {
              id: 'p1-mort-3',
              title: 'ID & Document Destruction',
              category: 'pillar-1',
              color: '#FCA5A5',
              icon: 'FileX',
              details: 'Crushing birth certificates, state IDs, and disability documents resets HUD housing voucher queues to zero.',
              citations: ['National Coalition for the Homeless: Property Confiscation Impact']
            }
          ]
        }
      ]
    },
    {
      id: 'p2-mobile-crisis',
      title: '2. Civilian Mobile Crisis Response',
      subtitle: 'Decoupling 911 for Behavioral Health',
      category: 'pillar-2',
      color: '#F59E0B',
      icon: 'Ambulance',
      details: 'Decoupling 911 dispatch by deploying unarmed clinician-paramedic teams to non-violent behavioral health calls at half the cost of armed police.',
      extendedAnalysis: 'Between 20% and 35% of all municipal 911 calls involve psychiatric distress, substance use, or homelessness survival complaints with no weapon or violent threat. Dispatching armed patrol officers to these incidents results in unnecessary arrests, prolonged hospital wait times, and high use-of-force liability. Civilian mobile crisis teams resolve 98%+ of calls on-scene without requiring police backup.',
      metrics: [
        { label: 'Cost / Incident', value: '$500 vs $1,000+', subtext: 'Civilian crisis van vs two-officer patrol dispatch', trend: 'positive' },
        { label: 'Backup Required', value: '< 2%', subtext: 'Civilian teams requiring armed law enforcement backup', trend: 'positive' },
        { label: 'Arrests Made', value: 'Zero (0)', subtext: 'In Denver STAR across 23,100+ dispatches', trend: 'positive' }
      ],
      citations: [
        'Stanford Institute for Economic Policy Research: Mobile Crisis Teams and 911 Calls (2022)',
        'Vera Institute of Justice: Behavioral Health Crisis Alternative Dispatch'
      ],
      actionRecommendation: 'Amend 911 computer-aided dispatch (CAD) protocols to automatically divert low-risk call codes (trespass, welfare check, public intoxication) to civilian units.',
      children: [
        {
          id: 'p2-denver-star',
          title: 'Denver STAR Model',
          category: 'pillar-2',
          color: '#FBBF24',
          icon: 'Sparkles',
          details: 'Support Team Assisted Response: Clinician and paramedic van team responding to non-violent 911 dispatch calls since 2020.',
          metrics: [
            { label: 'Total Calls Responded', value: '23,114+', subtext: 'Zero arrests and zero use of force' },
            { label: 'Offense Reduction', value: '34%', subtext: 'Drop in low-level offenses in active precincts' },
            { label: 'Cost per Dispatch', value: '$500', subtext: 'Compared to $1,000+ for patrol cars' }
          ],
          citations: ['Stanford University RCT on STAR Impact; Denver Department of Public Safety Reports'],
          actionRecommendation: 'Scale van fleet from daylight pilot hours to 24/7 city-wide coverage.',
          children: [
            {
              id: 'p2-star-1',
              title: '23,114+ Calls Handled',
              category: 'pillar-2',
              color: '#FDE68A',
              icon: 'PhoneCall',
              details: 'Demonstrated 100% safety record with zero arrests and zero civilian or responder injuries across 23,000+ responses.',
              citations: ['Denver STAR Annual Operations Report']
            },
            {
              id: 'p2-star-2',
              title: '34% Drop in Low-Level Offenses',
              category: 'pillar-2',
              color: '#FDE68A',
              icon: 'ShieldCheck',
              details: 'Over 1,400 fewer low-level citations in active STAR patrol zones, freeing police to respond to Priority 1 violent felonies.',
              citations: ['American Economic Journal: Applied Economics (2022)']
            },
            {
              id: 'p2-star-3',
              title: '$500 vs $1,000+ Cost per Call',
              category: 'pillar-2',
              color: '#FDE68A',
              icon: 'Banknote',
              details: 'Civilian teams cost half as much as two armed police officers and avoid downstream jail booking fees.',
              citations: ['City and County of Denver Budget Office']
            }
          ]
        },
        {
          id: 'p2-eugene-cahoots',
          title: 'Eugene CAHOOTS',
          category: 'pillar-2',
          color: '#FBBF24',
          icon: 'HeartHandshake',
          details: 'Crisis Assistance Helping Out On The Streets: Medic and mental health worker team operating continuously in Eugene, Oregon since 1989.',
          metrics: [
            { label: 'City Call Share', value: '13%', subtext: 'Of all Eugene Police Department dispatch volume' },
            { label: 'Police Backup Rate', value: '< 2%', subtext: 'Safe autonomous de-escalation' },
            { label: 'Net Annual Savings', value: '$2.2 Million', subtext: 'On a modest $2.1M operating budget' }
          ],
          citations: ['White Bird Clinic CAHOOTS Program Review'],
          actionRecommendation: 'Partner with experienced community healthcare clinics to operate the civilian crisis fleet under a municipal service agreement.',
          children: [
            {
              id: 'p2-cah-1',
              title: '13% Total City Call Volume',
              category: 'pillar-2',
              color: '#FDE68A',
              icon: 'PieChart',
              details: 'Handles roughly one-eighth of all municipal calls for service, protecting police capacity for violent crimes.',
              citations: ['Eugene Police Department Annual Dispatch Statistics']
            },
            {
              id: 'p2-cah-2',
              title: '< 2% Police Backup Required',
              category: 'pillar-2',
              color: '#FDE68A',
              icon: 'CheckCircle2',
              details: 'Overwhelming majority resolved safely through clinical de-escalation, water, harm reduction, and transport.',
              citations: ['White Bird Clinic Safety Dossier']
            },
            {
              id: 'p2-cah-3',
              title: '$2.2M Net Annual Savings',
              category: 'pillar-2',
              color: '#FDE68A',
              icon: 'TrendingUp',
              details: 'Saves the police department $2.2M annually while preventing an estimated $14M in ambulance/ER billing.',
              citations: ['Eugene City Council Fiscal Briefing']
            }
          ]
        },
        {
          id: 'p2-albuquerque-acs',
          title: 'Albuquerque ACS',
          category: 'pillar-2',
          color: '#FBBF24',
          icon: 'Building2',
          details: 'Albuquerque Community Safety: A cabinet-level third branch of municipal public safety operating alongside Police and Fire.',
          metrics: [
            { label: 'Diverted Police Calls', value: '33,000+', subtext: 'Diverted away from armed APD units' },
            { label: 'Non-Re-Engagement', value: '91%', subtext: 'Violent crime reduction among enrolled clients' }
          ],
          citations: ['City of Albuquerque Department of Community Safety Annual Report'],
          actionRecommendation: 'Establish a formal Cabinet-level Department of Community Safety to give civilian dispatch equal budgetary status to Police and Fire.',
          children: [
            {
              id: 'p2-acs-1',
              title: '33,000+ APD Call Diversions',
              category: 'pillar-2',
              color: '#FDE68A',
              icon: 'ArrowRightLeft',
              details: 'Diverted tens of thousands of calls, significantly decreasing mandatory police overtime.',
              citations: ['Albuquerque Community Safety Quarterly Reports']
            },
            {
              id: 'p2-acs-2',
              title: '91% Violent Non-Re-Engagement',
              category: 'pillar-2',
              color: '#FDE68A',
              icon: 'Shield',
              details: 'Violence Intervention Program participants maintain a 91% non-involvement rate with criminal courts over 24 months.',
              citations: ['University of New Mexico Evaluation of ACS']
            }
          ]
        }
      ]
    },
    {
      id: 'p3-judicial-diversion',
      title: '3. Judicial Diversion & Jail Intercepts',
      subtitle: 'Decarceration & Outpatient Competency',
      category: 'pillar-3',
      color: '#10B981',
      icon: 'Scale',
      details: 'Redirecting defendants with severe mental illness away from criminal courts and carceral beds into community health and housing.',
      extendedAnalysis: 'County jails have become the largest psychiatric facilities in the United States. Incarcerating individuals for behavioral health symptoms costs $150–$350 per day and exacerbates psychosis, leading to massive recidivism (75%+). Structured pre-booking and post-booking diversion programs divert individuals into clinical housing, reducing misdemeanor re-arrests and generating massive county budget savings.',
      metrics: [
        { label: 'Recidivism Reduction', value: '75% → 6%', subtext: 'Post-booking felony recidivism drop in Miami-Dade CMHP', trend: 'positive' },
        { label: 'Competency Speed', value: '52 Days Faster', subtext: 'Community outpatient restoration vs state hospital waitlist', trend: 'positive' },
        { label: 'Jail Closure Savings', value: '$12M / Year', subtext: 'Decommissioned county jail wing due to lower daily census', trend: 'positive' }
      ],
      citations: [
        'Eleventh Judicial Circuit of Florida: Criminal Mental Health Project (CMHP) 20-Year Report',
        'Substance Abuse and Mental Health Services Administration (SAMHSA) Sequential Intercept Model'
      ],
      actionRecommendation: 'Authorize County Mental Health Court with pre-plea diversion tracks and assign designated Crisis Intervention Team (CIT) liaisons.',
      children: [
        {
          id: 'p3-miami-cmhp',
          title: 'Miami-Dade CMHP Model',
          category: 'pillar-3',
          color: '#34D399',
          icon: 'Award',
          details: 'Led by Judge Steve Leifman: Nationwide gold standard for pre-arrest and post-arrest court diversion and CIT law enforcement training.',
          metrics: [
            { label: 'CIT Officers Trained', value: '9,500+', subtext: 'Across 36 police departments' },
            { label: 'Misdemeanor Recidivism', value: '75% → 20%', subtext: 'Sustained over 5-year tracking' },
            { label: 'Felony Recidivism', value: '75% → 6%', subtext: 'Among graduates of post-booking diversion' }
          ],
          citations: ['Judge Steve Leifman: Criminal Mental Health Project Findings; Florida Supreme Court'],
          actionRecommendation: 'Mandate 40-hour CIT training for all frontline patrol officers with priority dispatch routing.',
          children: [
            {
              id: 'p3-cmhp-1',
              title: '9,500+ Officers CIT Trained',
              category: 'pillar-3',
              color: '#A7F3D0',
              icon: 'GraduationCap',
              details: 'In a single year, 83,427 mental health crisis calls yielded only 139 arrests due to officer de-escalation skills.',
              citations: ['Miami-Dade County Public Safety Committee']
            },
            {
              id: 'p3-cmhp-2',
              title: 'Recidivism Plunge (75% -> 6%)',
              category: 'pillar-3',
              color: '#A7F3D0',
              icon: 'LineChart',
              details: 'Providing housing, medication, and peer support drops felony rearrest rates to an astounding 6%.',
              citations: ['University of South Florida Mental Health Institute Evaluation']
            },
            {
              id: 'p3-cmhp-3',
              title: 'Closed Jail Facility ($12M/yr)',
              category: 'pillar-3',
              color: '#A7F3D0',
              icon: 'KeyRound',
              details: 'Permanently closed the county\'s oldest jail facility (Miami-Dade Main Facility), saving $12M annually and $72M over 6 years.',
              citations: ['Miami-Dade Board of County Commissioners Budget Resolution']
            },
            {
              id: 'p3-cmhp-4',
              title: '52 Days Faster Competency',
              category: 'pillar-3',
              color: '#A7F3D0',
              icon: 'Clock',
              details: 'Outpatient restoration restores legal competency 52 days faster and 32% cheaper than state psychiatric hospital lockups.',
              citations: ['American Journal of Psychiatry Forensic Review']
            }
          ]
        },
        {
          id: 'p3-seattle-lead',
          title: 'Seattle LEAD',
          category: 'pillar-3',
          color: '#34D399',
          icon: 'Compass',
          details: 'Law Enforcement Assisted Diversion: Officers divert individuals suspected of low-level drug and sex work offenses directly to case managers.',
          metrics: [
            { label: 'Monthly Net Savings', value: '$543 / Person', subtext: 'Drop in criminal-legal system costs' },
            { label: 'Recidivism Reduction', value: '58%', subtext: 'Lower odds of felony arrest compared to control' }
          ],
          citations: ['University of Washington Evaluation of LEAD Seattle (Collins et al.)'],
          actionRecommendation: 'Institute pre-booking diversion protocols allowing officers to refer clients to street outreach without booking paperwork.',
          children: [
            {
              id: 'p3-lead-1',
              title: '$543/Mo Net Savings per Client',
              category: 'pillar-3',
              color: '#A7F3D0',
              icon: 'Coins',
              details: 'Legal system costs plummeted from $1,276 to $733 per month per person, generating clear local ROI.',
              citations: ['LEAD National Support Bureau Research Brief']
            }
          ]
        },
        {
          id: 'p3-soar-framework',
          title: 'SOAR Disability Benefit Integration',
          category: 'pillar-3',
          color: '#34D399',
          icon: 'FileCheck',
          details: 'SSI/SSDI Outreach, Access, and Recovery: SAMHSA model embedding specialized caseworkers in courts and jails.',
          metrics: [
            { label: 'Approval Speed', value: '40 Days', subtext: 'Compared to standard 9–12 months' },
            { label: 'Approval Rate', value: '78%', subtext: 'Initial application approval vs 27% baseline' }
          ],
          citations: ['SAMHSA SOAR National Technical Assistance Center'],
          actionRecommendation: 'Fund three certified full-time SOAR caseworkers embedded directly inside the municipal court building.',
          children: [
            {
              id: 'p3-soar-1',
              title: '78% Approval Rate in 40 Days',
              category: 'pillar-3',
              color: '#A7F3D0',
              icon: 'CheckSquare',
              details: 'Fast-tracks federal disability income, ensuring clients have immediate rental subsidies upon release.',
              citations: ['Social Security Administration SOAR Outcomes']
            },
            {
              id: 'p3-soar-2',
              title: 'Federal Revenue Shift',
              category: 'pillar-3',
              color: '#A7F3D0',
              icon: 'Landmark',
              details: 'Transfers ongoing medical and living costs off local municipal tax funds and onto federal Medicaid/Medicare.',
              citations: ['National Health Care for the Homeless Council Policy Brief']
            }
          ]
        }
      ]
    },
    {
      id: 'p4-federal-psh',
      title: '4. Medicaid 1115 Waivers & PSH',
      subtitle: 'Solving the Wrong Pocket Problem',
      category: 'pillar-4',
      color: '#06B6D4',
      icon: 'Home',
      details: 'Overcoming the "Wrong Pocket Problem" by leveraging federal Medicaid Section 1115 Pre-Release Waivers and Permanent Supportive Housing (PSH).',
      extendedAnalysis: 'The central roadblock to scaling supportive housing is that cities spend local tax revenue upfront, while the fiscal windfalls (fewer jail nights and ER admissions) accrue to county jail budgets and state Medicaid programs. CMS Section 1115 Reentry Waivers unlock federal matching funds for healthcare 30 to 90 days before release from jail, guaranteeing continuous MOUD treatment and housing support.',
      metrics: [
        { label: 'Police Contacts', value: '-34%', subtext: 'Reduction in police encounters among PSH residents', trend: 'positive' },
        { label: 'Detox Facility Visits', value: '-65%', subtext: 'Shift from acute emergency detox to primary clinics', trend: 'positive' },
        { label: 'Net Public Savings', value: '$8.3M', subtext: 'Net taxpayer savings in Denver RCT evaluation', trend: 'positive' }
      ],
      citations: [
        'Urban Institute: Denver Supportive Housing Social Impact Bond (2021)',
        'Centers for Medicare & Medicaid Services (CMS): Section 1115 Reentry Demonstration Opportunities'
      ],
      actionRecommendation: 'Apply for CMS Section 1115 Pre-Release Reentry demonstration to drawdown 50%–70% federal matching funds for carceral health transitions.',
      children: [
        {
          id: 'p4-wrong-pocket',
          title: 'The "Wrong Pocket Problem"',
          category: 'pillar-4',
          color: '#22D3EE',
          icon: 'Split',
          details: 'Cities spend upfront municipal funds, while financial savings accrue to county correctional systems and state healthcare coffers.',
          citations: ['Harvard Kennedy School Government Performance Lab: Social Impact Bonds & Silos'],
          actionRecommendation: 'Establish an inter-governmental pooled savings fund between City, County, and State health agencies.',
          children: [
            {
              id: 'p4-wp-1',
              title: 'Horizontal & Vertical Silos',
              category: 'pillar-4',
              color: '#A5F3FC',
              icon: 'Layers',
              details: 'Budget misalignment prevents mayors and city managers from capturing downstream hospital and jail savings.',
              citations: ['Brookings Institution: Cross-Sector Public Finance']
            }
          ]
        },
        {
          id: 'p4-medicaid-1115',
          title: 'Medicaid Section 1115 Reentry Waiver',
          category: 'pillar-4',
          color: '#22D3EE',
          icon: 'FileBadge',
          details: 'CMS demonstration authority waiving the statutory Inmate Exclusion Policy to fund pre-release medical care 30-90 days prior to discharge.',
          metrics: [
            { label: 'Coverage Window', value: '30–90 Days', subtext: 'Pre-release care covered by Medicaid' },
            { label: 'Mandated Reinvestment', value: '100%', subtext: 'Freed local funds must be invested into community health' }
          ],
          citations: ['CMS State Health Official Letter #23-003: Reentry Demonstration Guidance'],
          actionRecommendation: 'Coordinate with State Department of Health Care Services to enroll county jail facilities in 1115 pre-release demonstration.',
          children: [
            {
              id: 'p4-m1115-1',
              title: 'Waives Inmate Exclusion Policy',
              category: 'pillar-4',
              color: '#A5F3FC',
              icon: 'ShieldOff',
              details: 'Allows Medicaid billing for substance use disorder clinical case management, MOUD induction, and 30-day discharge medication supplies.',
              citations: ['Health Affairs: Medicaid Inmate Exclusion Policy Reform']
            },
            {
              id: 'p4-m1115-2',
              title: 'Mandated Local Reinvestment',
              category: 'pillar-4',
              color: '#A5F3FC',
              icon: 'RefreshCw',
              details: 'Federal rules dictate that counties cannot pocket freed local jail healthcare dollars; they must be reinvested into community clinics and housing.',
              citations: ['CMS Demonstration Terms & Conditions']
            }
          ]
        },
        {
          id: 'p4-denver-sib',
          title: 'Denver PSH Social Impact Bond (RCT)',
          category: 'pillar-4',
          color: '#22D3EE',
          icon: 'BarChart3',
          details: 'Rigorous randomized controlled trial (RCT) by Urban Institute tracking frequent users of jail and emergency services placed into PSH.',
          metrics: [
            { label: 'Arrests Reduction', value: '-40%', subtext: 'Compared to standard control group' },
            { label: 'Jail Days Avoided', value: '-38 Days / Yr', subtext: 'Per enrolled participant' },
            { label: 'Net Public Savings', value: '$8.3 Million', subtext: 'Exceeded private investor repayment threshold' }
          ],
          citations: ['Urban Institute Final Evaluation of the Denver Supportive Housing Social Impact Bond (2021)'],
          actionRecommendation: 'Replicate Denver SIB funding architecture using Pay-for-Success and outcomes-based contracting.',
          children: [
            {
              id: 'p4-sib-1',
              title: '-34% Police Contacts & -40% Arrests',
              category: 'pillar-4',
              color: '#A5F3FC',
              icon: 'UserCheck',
              details: 'Participants had 8 fewer police interactions and spent 38 fewer days in jail per person annually.',
              citations: ['Urban Institute RCT Findings']
            },
            {
              id: 'p4-sib-2',
              title: '-65% Short-Term Detox Visits',
              category: 'pillar-4',
              color: '#A5F3FC',
              icon: 'Stethoscope',
              details: 'Visits to acute detox facilities fell 65%, while routine primary clinic visits jumped 155%.',
              citations: ['Journal of Health Economics Evaluation']
            },
            {
              id: 'p4-sib-3',
              title: '$8.3 Million Net Public Savings',
              category: 'pillar-4',
              color: '#A5F3FC',
              icon: 'CheckCircle',
              details: 'Public sector cost savings directly offset the operational costs of housing and clinical case management.',
              citations: ['Denver Office of Financial Management']
            }
          ]
        },
        {
          id: 'p4-la-jir',
          title: 'LA "Just in Reach" Pay for Success',
          category: 'pillar-4',
          color: '#22D3EE',
          icon: 'Target',
          details: 'RAND Corporation evaluation of jail-to-supportive housing diversion for high-risk individuals with severe mental disorders in Los Angeles.',
          metrics: [
            { label: 'Fiscal Neutrality', value: '100%', subtext: 'Program fully paid for itself' },
            { label: 'Hospital Days Saved', value: '-0.8 Days / Mo', subtext: '$3,308 saved per participant in DHS acute care' }
          ],
          citations: ['RAND Corporation: Just in Reach Pay for Success Evaluation (Hunter et al.)'],
          actionRecommendation: 'Target diversion slots specifically to top 10% highest-cost frequent utilizers of county hospital emergency wings.',
          children: [
            {
              id: 'p4-jir-1',
              title: '100% Fiscal Neutrality',
              category: 'pillar-4',
              color: '#A5F3FC',
              icon: 'Percent',
              details: 'Reductions in county Department of Health Services emergency room days and inpatient beds completely recouped program costs.',
              citations: ['RAND Research Brief: Health and Housing in LA County']
            }
          ]
        }
      ]
    },
    {
      id: 'p5-policy-actions',
      title: '5. Action Plan & Strategic Off-Ramps',
      subtitle: 'Immediate Council & Legislative Playbook',
      category: 'pillar-5',
      color: '#8B5CF6',
      icon: 'Megaphone',
      details: 'Four concrete legislative and executive directives to transition from reactive sweep money fires to sustainable public safety infrastructure.',
      extendedAnalysis: 'Ending the revolving door does not require waiting for federal legislation. Municipal leaders possess immediate authority to reallocate existing sanitation contracts, rewrite 911 CAD dispatch filters, authorize non-congregate tiny-home villages on municipal land, and tie homelessness provider contracts to 90-day retention rather than sweep compliance.',
      metrics: [
        { label: 'Immediate Action Directives', value: '4 Pillars', subtext: 'Ready for City Council resolution' },
        { label: 'Housing Retention Standard', value: '90 Days', subtext: 'Primary performance metric replacing sweep counts' },
        { label: 'Projected 3-Year Savings', value: '30%–45%', subtext: 'Reduction in acute emergency service budget strain' }
      ],
      citations: [
        'National Alliance to End Homelessness: Municipal Policy Playbook',
        'United States Interagency Council on Homelessness (USICH): Encampments Guidance'
      ],
      actionRecommendation: 'Draft and introduce the "Public Safety Realignment Ordinance" within the next 30-day legislative calendar.',
      children: [
        {
          id: 'p5-council-actions',
          title: 'Four Immediate Council Actions',
          category: 'pillar-5',
          color: '#A78BFA',
          icon: 'ListChecks',
          details: 'Concrete policy directives actionable within 60 days by mayor and municipal council.',
          citations: ['Model City Council Resolutions for Crisis Response'],
          actionRecommendation: 'Adopt all four directives as an omnibus public safety modernization package.',
          children: [
            {
              id: 'p5-act-1',
              title: 'Establish Civilian Mobile Response',
              category: 'pillar-5',
              color: '#DDD6FE',
              icon: 'Truck',
              details: 'Direct 911 call centers to route non-violent behavioral health calls to STAR/CAHOOTS civilian teams, cutting cost per call by 50%.',
              citations: ['National 911 Behavioral Health Routing Protocol']
            },
            {
              id: 'p5-act-2',
              title: 'Non-Congregate Interim Infrastructure',
              category: 'pillar-5',
              color: '#DDD6FE',
              icon: 'Home',
              details: 'Reallocate recurring sweep clean-up budgets into secure tiny-home villages and motel leases that allow couples, pets, and possessions.',
              citations: ['Urban Institute Non-Congregate Shelter Study']
            },
            {
              id: 'p5-act-3',
              title: 'Scale CIT & SOAR Intercepts',
              category: 'pillar-5',
              color: '#DDD6FE',
              icon: 'UserCheck',
              details: 'Provide comprehensive 40-hour CIT de-escalation for patrol officers and embed SOAR caseworkers directly in courtrooms.',
              citations: ['SAMHSA CIT Technical Assistance']
            },
            {
              id: 'p5-act-4',
              title: 'Realign Grant Metrics to Retention',
              category: 'pillar-5',
              color: '#DDD6FE',
              icon: 'BarChart',
              details: 'Contractually mandate that city service providers be evaluated and funded based on 90-day housing retention, not camp clearance numbers.',
              citations: ['Results for America: Evidence-Based Municipal Contracting']
            }
          ]
        },
        {
          id: 'p5-core-stance',
          title: 'The Core Policy Formula',
          category: 'pillar-5',
          color: '#A78BFA',
          icon: 'Zap',
          details: 'Same-Day Clinical Stabilization + Non-Congregate Housing = Permanent Fiscal Sanity.',
          metrics: [
            { label: 'Formula Core', value: 'Health + Housing', subtext: 'Replacing handcuffs with healthcare' }
          ],
          citations: ['New England Journal of Medicine: Health Care and Homelessness'],
          actionRecommendation: 'Embed this policy formula into the city\'s 5-Year Comprehensive Public Safety Master Plan.',
          children: [
            {
              id: 'p5-formula-1',
              title: '"Cops are the field response..."',
              category: 'pillar-5',
              color: '#DDD6FE',
              icon: 'ShieldOff',
              details: '...but asking armed law enforcement officers to run an outdoor psychiatric clinic with handcuffs is structural failure.',
              citations: ['Major Cities Chiefs Association Policy Position']
            },
            {
              id: 'p5-formula-2',
              title: 'Same-Day MOUD Off-Ramps',
              category: 'pillar-5',
              color: '#DDD6FE',
              icon: 'Pill',
              details: 'Provide low-barrier, same-day Medication for Opioid Use Disorder (buprenorphine induction) via street medicine vans (warm hands, not cold cuffs).',
              citations: ['Substance Abuse and Mental Health Services Administration (SAMHSA) MOUD Clinical Guidelines']
            }
          ]
        }
      ]
    }
  ]
};
