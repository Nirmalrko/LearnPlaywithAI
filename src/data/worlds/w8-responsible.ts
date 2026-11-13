import type { World } from '../types';

export const w8: World = {
  id: 'responsible',
  index: 7,
  title: 'Responsible AI & Shipping',
  tagline: 'Build AI that is safe, fair — and actually ships',
  emoji: '⚖️',
  color: '#ca8a04',
  lessons: [
    {
      id: 'bias',
      title: 'Bias & Fairness',
      summary: 'How AI can discriminate — and how to catch it.',
      minutes: 8,
      blocks: [
        {
          type: 'text',
          md: 'AI learns from historical data — including historical **bias**. If the past was unfair, a model trained on it can repeat or amplify that unfairness, at scale.',
        },
        {
          type: 'example',
          title: 'The hiring model that learned bias',
          company: 'Amazon (reported 2018)',
          md: 'An experimental recruiting tool trained on 10 years of mostly male CVs reportedly learned to downgrade CVs containing the word “women’s” (as in “women’s chess club”). It was scrapped.',
        },
        {
          type: 'keypoints',
          items: [
            '**Sources of bias:** unrepresentative data, biased labels, proxy features (postcode can act as a proxy for ethnicity), and feedback loops.',
            '**Test by group:** measure accuracy, false positive and false negative rates separately for each demographic group.',
            '**Mitigate:** better data coverage, remove proxies, rebalance, adjust thresholds, human review of high-stakes decisions.',
            '**Document:** model cards & datasheets explain intended use and known limits.',
          ],
        },
        { type: 'demo', id: 'bias-spotter', caption: 'You are the AI auditor. Spot the bias in each scenario.' },
      ],
      quiz: [
        {
          kind: 'mcq',
          q: 'A proxy feature is…',
          options: ['A feature that indirectly encodes a sensitive attribute', 'A network server', 'A backup dataset', 'A type of activation'],
          answer: 0,
          explain: 'E.g. postcode correlating with ethnicity.',
        },
        {
          kind: 'tf',
          q: 'Removing the “gender” column always guarantees a model is unbiased by gender.',
          answer: false,
          explain: 'Proxies (hobbies, word choices) can still leak gender.',
        },
        {
          kind: 'mcq',
          q: 'The best way to detect bias is to…',
          options: ['Measure performance separately for each group', 'Only check overall accuracy', 'Ask the model if it is biased', 'Use a bigger GPU'],
          answer: 0,
          explain: 'Disaggregated evaluation reveals gaps hidden by averages.',
        },
        {
          kind: 'mcq',
          q: 'A model card is…',
          options: ['Documentation of a model’s intended use, performance and limits', 'A GPU card', 'A business card for AI', 'A credit card'],
          answer: 0,
          explain: 'Model cards promote transparency.',
        },
      ],
    },
    {
      id: 'hallucinations',
      title: 'Hallucinations & Reliability',
      summary: 'Why AI confidently makes things up — and how to defend against it.',
      minutes: 6,
      blocks: [
        {
          type: 'text',
          md: 'LLMs generate *plausible* text, not *verified* text. When they don’t know, they can produce confident, fluent, **wrong** answers — invented facts, fake citations, non-existent APIs. This is called **hallucination**.',
        },
        {
          type: 'example',
          title: 'Fake cases in court',
          company: 'Legal (2023)',
          md: 'Lawyers in New York submitted a brief citing court cases invented by a chatbot. The judge sanctioned them. Lesson: always verify.',
        },
        { type: 'demo', id: 'hallucination', caption: 'Fact or fabrication? Judge these AI answers.' },
        {
          type: 'keypoints',
          items: [
            'Ground answers with **RAG** and require **citations**.',
            'Let the model say **“I don’t know”** — tell it so in the prompt.',
            'Use **low temperature** for factual tasks.',
            'Add **verification**: check code by running tests, check facts against sources.',
            'Keep a **human in the loop** for high-stakes outputs.',
          ],
        },
      ],
      quiz: [
        {
          kind: 'mcq',
          q: 'An AI hallucination is…',
          options: ['A confident but false or invented output', 'A visual glitch on screen', 'A dream of the GPU', 'A type of image filter'],
          answer: 0,
          explain: 'Fluent text that isn’t grounded in fact.',
        },
        {
          kind: 'tf',
          q: 'If an LLM answer sounds confident and detailed, it must be correct.',
          answer: false,
          explain: 'Confidence and fluency are not evidence of truth.',
        },
        {
          kind: 'mcq',
          q: 'Which technique most directly reduces hallucinations about your company’s policies?',
          options: ['RAG with citations', 'Higher temperature', 'Longer prompts with emojis', 'Fewer GPUs'],
          answer: 0,
          explain: 'Grounding in retrieved sources keeps answers factual.',
        },
        {
          kind: 'mcq',
          q: 'For AI-generated code, a good verification step is…',
          options: ['Run the tests', 'Trust it blindly', 'Read only the comments', 'Ask it twice'],
          answer: 0,
          explain: 'Executing tests checks real behaviour.',
        },
      ],
    },
    {
      id: 'safety-privacy',
      title: 'Privacy, Safety & Regulation',
      summary: 'Protecting users, and the laws you need to know.',
      minutes: 7,
      blocks: [
        {
          type: 'keypoints',
          items: [
            '**Privacy:** don’t send personal data to AI services without consent; minimise and anonymise; check data-retention terms.',
            '**Security:** guard against prompt injection, data leakage, and model abuse; rate-limit and log.',
            '**Safety:** content filters, refusal of harmful requests, abuse monitoring.',
            '**Transparency:** tell users when they’re talking to AI and when content is AI-generated.',
            '**Accountability:** a named human owner for each AI system and an appeal path for affected people.',
          ],
        },
        {
          type: 'example',
          title: 'The EU AI Act',
          company: 'European Union',
          md: 'The world’s first broad AI law sorts AI by **risk**: *unacceptable* (banned, e.g. social scoring), *high-risk* (hiring, credit, medical — strict requirements), *limited* (transparency duties, e.g. chatbots must disclose they’re AI), and *minimal* (most apps). Many countries are following with their own rules.',
        },
        {
          type: 'callout',
          tone: 'info',
          md: 'Frameworks to know: **NIST AI Risk Management Framework** (US), **ISO/IEC 42001** (AI management systems), and **GDPR** for personal data in Europe.',
        },
      ],
      quiz: [
        {
          kind: 'mcq',
          q: 'Under the EU AI Act, an AI used to screen job applicants is…',
          options: ['Minimal risk', 'High risk', 'Unregulated', 'Banned'],
          answer: 1,
          explain: 'Employment decisions are listed as high-risk.',
        },
        {
          kind: 'tf',
          q: 'Users should be told when they are interacting with an AI chatbot.',
          answer: true,
          explain: 'Transparency is a core principle and a legal requirement in many places.',
        },
        {
          kind: 'mcq',
          q: 'Which is good privacy practice?',
          options: ['Minimise and anonymise personal data before sending it to AI', 'Upload the entire customer database', 'Store passwords in prompts', 'Ignore retention policies'],
          answer: 0,
          explain: 'Data minimisation reduces risk.',
        },
        {
          kind: 'mcq',
          q: 'Social scoring by governments is classified in the EU AI Act as…',
          options: ['Unacceptable (banned)', 'Minimal risk', 'Limited risk', 'Encouraged'],
          answer: 0,
          explain: 'It’s among the prohibited practices.',
        },
      ],
    },
    {
      id: 'ship-mvp',
      title: 'Shipping an AI MVP',
      summary: 'From idea to a real product users love.',
      minutes: 9,
      blocks: [
        {
          type: 'text',
          md: 'An **MVP** (Minimum Viable Product) is the smallest version that delivers real value and lets you learn from real users. For AI products, the playbook looks like this:',
        },
        { type: 'diagram', id: 'deploy' },
        {
          type: 'keypoints',
          items: [
            '**1. Pick a painful, narrow problem** — “summarise support tickets”, not “AI for everything”.',
            '**2. Start with an API model + good prompts** — no training needed. Add RAG if it needs your data.',
            '**3. Build an eval set** — 30–100 real examples with expected outputs. Measure every change.',
            '**4. Design for failure** — show sources, allow edits, easy “thumbs down”, human fallback.',
            '**5. Ship to a few users, then monitor** — quality, latency, cost per request, user feedback.',
            '**6. Iterate** — fix top failure modes; consider fine-tuning or smaller models only when you have data.',
          ],
        },
        { type: 'demo', id: 'mvp-builder', caption: 'Plan your own AI MVP. Make the right call at each step.' },
        {
          type: 'callout',
          tone: 'tip',
          md: '**Cost check:** cost per request ≈ (input tokens × input price) + (output tokens × output price). Cache repeated context, keep prompts lean, and route easy tasks to cheaper models.',
        },
      ],
      quiz: [
        {
          kind: 'mcq',
          q: 'The best first version of an AI feature usually…',
          options: ['Trains a giant model from scratch', 'Uses an existing model API with good prompts', 'Waits until the perfect dataset exists', 'Solves every problem at once'],
          answer: 1,
          explain: 'Start simple, validate value, then optimise.',
        },
        {
          kind: 'mcq',
          q: 'An “eval set” is…',
          options: ['A collection of test examples to measure quality after every change', 'The marketing plan', 'A GPU benchmark', 'User passwords'],
          answer: 0,
          explain: 'Evals are the unit tests of AI products.',
        },
        {
          kind: 'tf',
          q: 'You should monitor cost per request and latency after launch.',
          answer: true,
          explain: 'AI costs scale with usage — track them from day one.',
        },
        {
          kind: 'order',
          q: 'Order the AI MVP playbook:',
          items: ['Pick a narrow problem', 'Prototype with an API + prompts', 'Build an eval set', 'Ship to a few users', 'Monitor & iterate'],
          explain: 'Problem → prototype → evals → ship → iterate.',
        },
      ],
    },
    {
      id: 'career',
      title: 'Your AI Career Roadmap',
      summary: 'Roles, skills and a 90-day plan to keep going.',
      minutes: 6,
      blocks: [
        {
          type: 'keypoints',
          items: [
            '**AI / ML Engineer** — builds and deploys models and AI features. Python, PyTorch, APIs, cloud.',
            '**AI Product Engineer** — builds apps on top of LLMs: prompting, RAG, agents, evals, web dev.',
            '**Data Scientist** — analyses data, builds models, communicates insights. Stats, SQL, pandas.',
            '**Data Engineer** — builds data pipelines and infrastructure.',
            '**ML Researcher** — invents new methods. Usually maths-heavy, often PhD.',
            '**AI Product Manager** — decides what to build and how to measure it.',
            '**AI Governance / Safety** — policy, risk, audits, red-teaming.',
          ],
        },
        {
          type: 'text',
          md: '**Your 90-day plan after this course:**\n\n- **Days 1–30:** Python + pandas basics. Do a Kaggle beginner competition (Titanic).\n- **Days 31–60:** scikit-learn and PyTorch tutorials. Re-build the neural net from World 4 in code.\n- **Days 61–90:** Ship a small LLM app with an API + RAG on documents you care about. Put it on GitHub with a README and a demo video.',
        },
        {
          type: 'callout',
          tone: 'tip',
          md: 'Portfolio > certificates. One finished, deployed project that solves a real problem beats ten unfinished tutorials.',
        },
      ],
      quiz: [
        {
          kind: 'mcq',
          q: 'Which role mostly builds applications on top of LLM APIs?',
          options: ['AI Product Engineer', 'Hardware engineer', 'Accountant', 'ML Researcher'],
          answer: 0,
          explain: 'They combine prompting, RAG, agents and software engineering.',
        },
        {
          kind: 'mcq',
          q: 'The most widely used programming language in AI is…',
          options: ['Python', 'COBOL', 'Assembly', 'PHP'],
          answer: 0,
          explain: 'Python dominates thanks to its libraries (PyTorch, pandas, scikit-learn).',
        },
        {
          kind: 'tf',
          q: 'A deployed portfolio project is often more convincing to employers than certificates alone.',
          answer: true,
          explain: 'It proves you can build and ship.',
        },
        {
          kind: 'mcq',
          q: 'A great beginner competition platform for practice is…',
          options: ['Kaggle', 'Netflix', 'Spotify', 'Uber'],
          answer: 0,
          explain: 'Kaggle hosts datasets and beginner-friendly competitions.',
        },
      ],
    },
  ],
};
