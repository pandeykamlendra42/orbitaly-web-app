/**
 * The privacy policy, transcribed from the approved "Orbitaly Privacy Policy"
 * PDF. Keep the wording identical to the signed-off document — change it there
 * first, then here, and bump the dates.
 *
 * Each section is a list of blocks: `p` (paragraph), `h3` (sub-heading) or
 * `list` (bullets; an item is a string or `[label, text]` for a bold lead-in).
 * Emails and orbitaly.in URLs in the text are linked when rendered.
 */

export const PRIVACY_EFFECTIVE_DATE = '1st October 2026'
export const PRIVACY_LAST_UPDATED = '1st October 2026'

export const PRIVACY_SECTIONS = [
  {
    id: 'introduction',
    title: 'Introduction',
    blocks: [
      { p: 'Orbitaly (“Orbitaly”, “we”, “us” or “our”) is a personalised growth platform for students and young adults. Our journey is Learn, Earn, Grow: we help you understand what fits you, plan and fund your education, find expert guidance and opportunities, and build financial confidence.' },
      { p: 'To do this, Orbitaly builds one profile for you (your “Growth ID”) and uses it to suggest your next step. We connect you to independent third parties, such as counsellors, institutions, employers, lenders and benefit partners, only when it is relevant to you and, where the law requires, only with your consent.' },
      { p: 'This Privacy Policy explains what personal data we collect, why we collect it, how we use, share and protect it, and the choices you have. It applies to https://orbitaly.in and our related pages, apps, assessments, planners, forms, tools and communications (together, the “Services”). If you do not agree with it, please do not use the Services.' },
      { p: 'Orbitaly is not a bank, NBFC, university, employer or counselling firm. Our partners are independent. They make their own decisions, such as loan approvals, admissions, hiring and advice, and they handle the data they collect under their own privacy policies.' },
      { p: 'We process personal data in accordance with applicable Indian law, including the Digital Personal Data Protection Act, 2023 (“DPDP Act”), the Information Technology Act, 2000, and the rules made under them.' },
    ],
  },
  {
    id: 'who-we-are',
    title: 'Who We Are',
    blocks: [
      { p: 'For the purposes of this policy, Orbitaly is the “Data Fiduciary” responsible for deciding how and why your personal data is processed.' },
      {
        list: [
          ['Legal entity name:', 'ORBITALYOS LABS PRIVATE LIMITED'],
          ['Registered address:', 'Off-914 Gold Crest Business Centre, L T Road, Borivali West, Mumbai- 400092, Maharashtra'],
          ['Contact email:', 'ContactUs@orbitaly.in'],
          ['Grievance Officer / Data Protection contact:', 'Mohammed Asif Ansari (mansari@orbitaly.in)'],
        ],
      },
    ],
  },
  {
    id: 'data-we-collect',
    title: 'Personal Data We Collect',
    blocks: [
      { h3: '3.1 Information you give us' },
      {
        list: [
          ['Identity and contact details:', 'name, email address, phone number, city or state, language and age or age band.'],
          ['Education profile:', 'current class or stage, school or college, stream or course of interest, marks or grades, entrance exams, India or overseas preferences, destination countries and study goals.'],
          ['Future Fit and assessment data:', 'your answers to interest, strength, aptitude and psychometric questions, and the results we generate from them, such as career clusters, skill gaps and suggested next steps.'],
          ['Skills and work profile:', 'skills, CV, portfolio, projects, certificates, internships, role preferences, applications and progress.'],
          ['Financial planning details:', 'estimated education costs, budget, family contribution, funding gap, scholarship or loan interest, money goals and answers to financial fitness checks. We never ask for bank passwords, card numbers, PINs or OTPs.'],
          ['Financing application details:', 'if you choose to apply with a lending partner, the information that partner requires, which may include identity and address documents, income details, co-applicant or guardian details, and course and institution details.'],
          ['Messages and requests:', 'enquiries, chats, counsellor booking requests, feedback and survey responses.'],
          ['Account and preferences:', 'login credentials (stored in protected form), consent choices, contact and notification preferences, and rewards activity.'],
        ],
      },
      { h3: '3.2 Information about parents and guardians' },
      { p: 'If a parent or guardian uses Parent View, gives consent for a student under 18, or acts as a co-applicant, we collect their name, contact details, relationship to the student and any details needed for that purpose. If you give us another person’s information, please do so only if you are authorised to. Student and parent views are not identical, and we tell you what each can see.' },
      { h3: '3.3 Information collected automatically' },
      {
        list: [
          ['Device and technical data:', 'IP address, browser type and version, operating system, device identifiers, language and screen settings.'],
          ['Usage data:', 'pages viewed, links clicked, time spent, referring website, which recommendations and next steps you viewed or completed, and actions taken within the Services.'],
          ['Consent records:', 'what you agreed to, when, for which purpose and which partner.'],
          ['Cookies and similar technologies:', 'see Section 13.'],
        ],
      },
      { h3: '3.4 Information from third parties' },
      { p: 'We may receive limited information from partners you choose to interact with, such as status updates from a lender (applied, sanctioned, rejected, disbursed), appointment details from a counsellor, application status from an opportunity partner, or course completion signals from a learning partner where you have permitted it. We may also receive information from sign-in providers and from analytics platforms.' },
    ],
  },
  {
    id: 'children',
    title: 'Children and Students Under 18',
    blocks: [
      { p: 'Many of our users are students under 18. Under the DPDP Act, we must obtain verifiable consent from a parent or lawful guardian before processing the personal data of a child (a person under 18 years of age).' },
      {
        list: [
          'Where required, we ask for a parent’s or guardian’s verifiable consent before collecting or using a child’s personal data.',
          'We do not track or monitor the behaviour of children, show them targeted advertising, or process their data in ways likely to harm them.',
          'Perks and rewards shown to users under 18 are limited to age-appropriate offers.',
          'Financing and loan applications are completed by an adult applicant or co-applicant, under the lending partner’s rules.',
          'Any future payment or card features will need separate consent, including parent or guardian consent for a child.',
          'If you believe a child has given us personal data without proper consent, please contact us and we will delete it.',
        ],
      },
    ],
  },
  {
    id: 'how-we-use',
    title: 'How We Use Your Information',
    blocks: [
      { p: 'We use personal data only for specified, lawful purposes, including to:' },
      {
        list: [
          'Build and maintain your Growth ID and show you a personalised view of your next steps.',
          'Provide career, course and college guidance, skill-gap insights and learning content.',
          'Plan the full cost of your education journey and identify any funding gap.',
          'Match you with counsellors, opportunities, funding partners or benefits, when you ask or consent to it.',
          'Respond to your questions, requests and feedback, and manage your account.',
          'Send service messages, reminders and, where you have agreed, newsletters and offers.',
          'Understand how the Services are used, test changes and improve features, content and performance.',
          'Run research with students to improve what we build (see Section 18).',
          'Keep the Services secure and prevent fraud, abuse and misuse.',
          'Comply with legal obligations and respond to lawful requests from authorities.',
        ],
      },
    ],
  },
  {
    id: 'personalisation',
    title: 'Personalisation and Recommendations',
    blocks: [
      { p: 'We use your profile and activity to rank and explain recommendations, such as careers, courses, experts, opportunities and perks. Where we can, we show why something is recommended for you.' },
      { p: 'Our recommendations are guidance, not guarantees. Orbitaly does not promise admissions, jobs, loan approvals or investment outcomes. If you think a recommendation is based on wrong information, you can correct your data or ask us to explain it (see Section 16).' },
    ],
  },
  {
    id: 'legal-basis',
    title: 'Legal Basis and Consent',
    blocks: [
      { p: 'We process your personal data on the basis of:' },
      {
        list: [
          ['Your consent,', 'which we ask for in clear, plain language before collecting your data for a specific purpose. We ask separately for separate purposes, for example sharing your profile with a counsellor, sharing details with a lender, or receiving marketing. We keep a record of what you agreed to, when, and for which partner. You can withdraw consent at any time (see Section 16). Withdrawal does not affect processing done before it, and it may mean we can no longer provide certain features.'],
          ['Legitimate uses', 'permitted by law, such as responding to a request you made, complying with a legal obligation, or protecting security and preventing fraud.'],
        ],
      },
    ],
  },
  {
    id: 'financing',
    title: 'Financing and Funding Journeys',
    blocks: [
      { p: 'Our planner helps you understand the complete cost of your education, covering items such as tuition, accommodation, travel, equipment, visa-related costs and living expenses, and shows any gap after your family’s contribution. You can use the planner without applying for funding.' },
      {
        list: [
          ['Before data goes to a lender:', 'if you choose to explore funding, we tell you which partner will receive your data, what data it is and why, and we ask for your consent first. We do not pass your cost plan to a lender until you do.'],
          ['Lenders decide, not Orbitaly:', 'banks and NBFCs make their own decisions on eligibility, sanction, pricing and terms. They are independent data fiduciaries for the data they collect, and may carry out their own checks, such as credit bureau checks, under their own consent process. Their privacy policies apply to that data.'],
          ['Status updates:', 'we receive application status updates so we can show your progress and help you with next steps.'],
          ['Documents:', 'share documents only through the secure steps in the Services. Orbitaly will never ask for your OTP, PIN or password.'],
          ['Partners:', 'our current lending partners are listed at https://orbitaly.in/Lending_Partners.'],
        ],
      },
    ],
  },
  {
    id: 'expert-network',
    title: 'Expert Network',
    blocks: [
      { p: 'When you ask for a counsellor match, we use your profile, such as your goal, course or country interest, budget and career objective, to suggest experts and explain why each one is suggested. You can compare experts and choose.' },
      {
        list: [
          'A counsellor sees your profile or contact details only after you choose to book or connect, and only the information you agree to share.',
          'Counsellors are independent. We require them to use your data only for your engagement with them and to protect it.',
          'We keep appointment, response, rating and complaint records to maintain the quality of the network. If you leave a review, we may show it with your first name or initials.',
        ],
      },
    ],
  },
  {
    id: 'opportunities-perks',
    title: 'Opportunities, Perks and Rewards',
    blocks: [
      {
        list: [
          ['Opportunities:', 'we share your profile, CV or portfolio with an employer or opportunity platform only when you apply or consent. Where a partner permits, we may record completion and outcome signals, such as a finished project or course, to build your progress record.'],
          ['Perks:', 'we personalise perks using your age, location, interests and journey stage. Merchants and brands receive only what they need to deliver a benefit, such as a redemption code, and not your profile unless you consent.'],
          ['Rewards:', 'we record milestones and rewards you earn in a rewards ledger. We do not reward unnecessary borrowing.'],
        ],
      },
    ],
  },
  {
    id: 'sharing',
    title: 'How We Share Your Information',
    blocks: [
      { p: 'We do not sell your personal data, and we do not share it with advertisers so they can target you. We share it only as described below:' },
      {
        list: [
          ['With your consent:', 'when you ask to be connected to an institution, counsellor, scholarship body, lender, employer or other partner, we share the details needed for that purpose. Those partners handle your data under their own privacy policies, so please review them.'],
          ['Service providers:', 'trusted vendors who help us run the Services, such as hosting, cloud storage, analytics, email and messaging, customer support and payment processing. They may use your data only to perform services for us and are bound by confidentiality and security obligations.'],
          ['Legal and safety reasons:', 'where required by law, court order or government authority, or to protect the rights, property or safety of Orbitaly, our users or others.'],
          ['Business changes:', 'if Orbitaly is involved in a merger, acquisition or restructuring, personal data may be transferred to the successor entity, which must honour this policy.'],
          ['Aggregated or anonymised data:', 'information that cannot identify you may be shared for research, reporting or product improvement.'],
        ],
      },
    ],
  },
  {
    id: 'commercial',
    title: 'Commercial Relationships and Disclosures',
    blocks: [
      { p: 'Orbitaly earns revenue from partners such as lenders, counsellors, institutions, employers and merchants, and may earn it from paid memberships. Where a commercial relationship, sponsorship or commission may affect what you see, we disclose it where applicable. Our matching logic is separate from any partner’s own advice, and we aim to keep paid relationships from deciding what is recommended to you. Regulated product disclosures are shown at the stage where they apply.' },
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies and Similar Technologies',
    blocks: [
      { p: 'We use cookies and similar technologies to keep the Services working, remember your preferences, understand usage and measure performance.' },
      {
        list: [
          ['Essential cookies:', 'needed for the site to function and stay secure.'],
          ['Preference cookies:', 'remember your settings and choices.'],
          ['Analytics cookies:', 'help us understand how visitors use the Services.'],
          ['Marketing cookies:', 'used only where you have agreed, and never to target children.'],
        ],
      },
      { p: 'You can manage or delete cookies through your browser settings. Blocking some cookies may affect how the Services work.' },
    ],
  },
  {
    id: 'retention',
    title: 'Data Retention',
    blocks: [
      { p: 'We keep personal data only for as long as needed for the purposes described in this policy, or as required by law. When data is no longer needed, we delete it or anonymise it. As a general guide:' },
      {
        list: [
          'Account, Growth ID and assessment data are kept while your account is active and for up to 36 months after it is closed or you stop using the Services.',
          'Financing application and consent records are kept for the period required by law and by our lending partners, which is currently minimum of 5 years.',
          'Enquiry and support records are kept for up to 24 months.',
          'Survey responses are kept for 24 months and then deleted or anonymised.',
          'Records we must keep for tax, accounting or legal reasons are kept for the period the law requires.',
        ],
      },
    ],
  },
  {
    id: 'security',
    title: 'Data Security',
    blocks: [
      { p: 'We use reasonable technical and organisational safeguards to protect your personal data, including encryption in transit, access controls limited to staff who need the data, secure hosting, vendor checks and regular reviews of our practices. We take extra care with financial details and documents. No method of transmission or storage is completely secure, so we cannot guarantee absolute security. If a personal data breach occurs, we will notify the Data Protection Board of India and affected users as required by law.' },
      { p: 'Please protect your account by using a strong password and not sharing your login details.' },
    ],
  },
  {
    id: 'your-rights',
    title: 'Your Rights and Privacy Controls',
    blocks: [
      { p: 'Under the DPDP Act, you have the right to:' },
      {
        list: [
          ['Access', 'a summary of the personal data we process about you and the identities of those we have shared it with.'],
          ['Correct or update', 'inaccurate or incomplete data.'],
          ['Erase', 'your personal data, unless we need to keep it by law.'],
          ['Withdraw consent', 'at any time, as easily as it was given.'],
          ['Grievance redressal:', 'have your concerns about how we handle your data addressed.'],
          ['Nominate', 'another person to exercise your rights on your behalf in the event of your death or incapacity.'],
        ],
      },
      { p: 'You can review and change your consent choices, partner sharing and contact preferences in privacy settings in your account, or by emailing ContactUS@orbitaly.in. We may need to verify your identity first, and for children, a parent or guardian may make the request. We aim to respond within 30 days. If you are not satisfied with our response, you may approach the Data Protection Board of India.' },
    ],
  },
  {
    id: 'marketing',
    title: 'Marketing Communications and Calls',
    blocks: [
      { p: 'We send promotional emails, messages or calls only if you have agreed to receive them. Partners will not contact you about their products unless you asked to be connected to them or consented to their contact. You can opt out at any time by using the unsubscribe link in our messages or by contacting us, and we will pass your opt-out on to partners. We will still send you essential service messages, such as account or security notices.' },
    ],
  },
  {
    id: 'research',
    title: 'Research and Surveys',
    blocks: [
      { p: 'From time to time we invite students to take part in research surveys and interviews to help us build better services. Taking part is voluntary and sometime(s) a monetary or equivalent incentive may also provided for taking part in surveys. We use your answers to improve our products and report results in summarised or anonymised form. If you give an email address or mobile number in a survey, we use it only to contact you about the research you agreed to, such as a follow-up interview. You can withdraw at any time.' },
    ],
  },
  {
    id: 'third-party-links',
    title: 'Third-Party Links and Services',
    blocks: [
      { p: 'The Services may contain links to websites, institutions, scholarship portals, lenders or other partners that Orbitaly does not own or control. We are not responsible for their privacy practices or content. We encourage you to read the privacy policy of any third-party site before you share personal data with it.' },
    ],
  },
  {
    id: 'storage-transfer',
    title: 'Storage and Transfer of Data',
    blocks: [
      { p: 'Your personal data is primarily stored and processed in India. Where our service providers process data outside India, we do so only in accordance with the DPDP Act and any restrictions notified by the Government of India, and we require such providers to protect your data appropriately.' },
    ],
  },
  {
    id: 'future-services',
    title: 'Future Services',
    blocks: [
      { p: 'We may add new services over time, such as partner-issued student payment, card or account features with parent-set controls. These would be offered through regulated partners. Before any such service launches, we will update this policy and ask for separate consent, including parent or guardian consent for a child where required. Until then, we do not collect payment card or account data for such services.' },
    ],
  },
  {
    id: 'changes',
    title: 'Changes to This Policy',
    blocks: [
      { p: 'We may update this Privacy Policy from time to time to reflect changes in our practices, the Services or the law. When we make material changes, we will update the “Last updated” date above and, where appropriate, notify you by email or a notice on the website. We encourage you to review this page periodically.' },
    ],
  },
  {
    id: 'contact',
    title: 'Contact and Grievance Redressal',
    blocks: [
      { p: 'If you have questions, concerns or complaints about this policy or your personal data, please contact:' },
      {
        list: [
          ['Grievance Officer:', 'Mohammed Asif Ansari'],
          ['Email:', 'mansari@orbitaly.in'],
          ['Address:', 'Off-914 Gold Crest Business Centre, L T Road, Borivali West, Mumbai- 400092, Maharashtra'],
          ['Response time:', 'We will acknowledge your complaint within 48-72 hours and aim to resolve it within 30 days.'],
        ],
      },
    ],
  },
]
