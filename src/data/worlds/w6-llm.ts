import type { World } from '../types';

export const w6: World = {
  id: 'llms',
  index: 5,
  title: 'Language & LLMs',
  tagline: 'How ChatGPT, Claude & co. actually work',
  emoji: '💬',
  color: '#2563eb',
  lessons: [
    {
      id: 'tokens',
      title: 'Tokens: How AI Reads Text',
      summary: 'Models don’t see words — they see tokens.',
      minutes: 6,
      blocks: [
        {
          type: 'text',
          md: 'Before a language model can read text, it’s chopped into **tokens** — common words, word pieces, or punctuation. Each token maps to an ID number. Roughly, **1 token ≈ ¾ of an English word**.',
        },
        { type: 'demo', id: 'tokenizer', caption: 'Type anything and see it split into tokens (a simplified tokenizer).' },
        {
          type: 'keypoints',
          items: [
            'Common words (“the”, “cat”) are one token; rare words split into pieces (“un” + “believ” + “able”).',
            'AI APIs **charge per token** and have a **context window** limit measured in tokens.',
            'Tokenization is why LLMs historically struggled to count letters in a word — they never “see” the individual letters!',
          ],
        },
      ],
      quiz: [
        {
          kind: 'mcq',
          q: 'Roughly how many English words is 1,000 tokens?',
          options: ['About 75', 'About 750', 'About 7,500', 'Exactly 1,000'],
          answer: 1,
          explain: '1 token ≈ 0.75 words on average.',
        },
        {
          kind: 'tf',
          q: 'LLM APIs typically bill by number of tokens.',
          answer: true,
          explain: 'Input and output tokens are both counted.',
        },
        {
          kind: 'mcq',
          q: 'Why might a model miscount the letters in “strawberry”?',
          options: ['It sees tokens, not individual letters', 'It cannot read English', 'Memory is full', 'Strawberry is a banned word'],
          answer: 0,
          explain: 'The word is processed as one or a few tokens, hiding letter-level detail.',
        },
        {
          kind: 'mcq',
          q: 'A rare word is usually…',
          options: ['Ignored', 'Split into several sub-word tokens', 'Turned into an image', 'Translated'],
          answer: 1,
          explain: 'Sub-word tokenization handles any word with a fixed vocabulary.',
        },
      ],
    },
    {
      id: 'embeddings',
      title: 'Embeddings: Meaning as Numbers',
      summary: 'Similar meanings → nearby points in space.',
      minutes: 7,
      blocks: [
        {
          type: 'text',
          md: 'An **embedding** turns a token, sentence, image — anything — into a list of numbers (a **vector**) so that **similar meanings are close together**. Real embeddings have hundreds or thousands of dimensions; we’ll squash them to 2D to visualise.',
        },
        { type: 'demo', id: 'embeddings', caption: 'Click two words to measure their similarity. Try king − man + woman!' },
        {
          type: 'keypoints',
          items: [
            '**Cosine similarity** measures how aligned two vectors are: 1 = same direction, 0 = unrelated.',
            'Embeddings power **semantic search** (“cheap flights” finds “budget airfare”).',
            'They’re the backbone of **recommendations** and **RAG** (World 7).',
          ],
        },
      ],
      quiz: [
        {
          kind: 'mcq',
          q: 'An embedding is…',
          options: ['A vector of numbers representing meaning', 'A compressed zip file', 'A type of image', 'A database table'],
          answer: 0,
          explain: 'Embeddings map items to vectors where distance reflects similarity.',
        },
        {
          kind: 'tf',
          q: 'In a good embedding space, “dog” is closer to “puppy” than to “carburetor”.',
          answer: true,
          explain: 'Semantically similar items cluster together.',
        },
        {
          kind: 'mcq',
          q: 'Cosine similarity of 1 means two vectors…',
          options: ['Are unrelated', 'Point in the same direction (very similar)', 'Are opposite', 'Have errors'],
          answer: 1,
          explain: '1 = identical direction.',
        },
        {
          kind: 'mcq',
          q: 'Search that finds “budget airfare” for the query “cheap flights” is…',
          options: ['Keyword search', 'Semantic (embedding) search', 'Alphabetical search', 'Random search'],
          answer: 1,
          explain: 'Embeddings capture meaning, not just exact words.',
        },
      ],
    },
    {
      id: 'language-models',
      title: 'Language Models: Predict the Next Word',
      summary: 'The surprisingly simple objective behind LLMs.',
      minutes: 7,
      blocks: [
        {
          type: 'text',
          md: 'At its core, a language model does one thing: **given some text, predict the next token**. Repeat that, feeding each prediction back in, and you get paragraphs, code, poems.\n\nThe simplest language model counts which word follows which (a *bigram* model). Modern LLMs use a deep Transformer with billions of parameters, but the objective is the same.',
        },
        { type: 'demo', id: 'next-word', caption: 'A tiny real language model trained on a few sentences. Generate text and play with temperature.' },
        {
          type: 'keypoints',
          items: [
            '**Temperature** — randomness. Low (0–0.3) = focused & repeatable. High (0.8–1.2) = creative & varied.',
            '**Top-p / top-k** — only sample from the most likely tokens.',
            '**Context window** — how many tokens the model can see at once (from a few thousand to over a million in modern models).',
          ],
        },
      ],
      quiz: [
        {
          kind: 'mcq',
          q: 'The core training objective of an LLM is…',
          options: ['Predict the next token', 'Classify images', 'Sort lists', 'Cluster users'],
          answer: 0,
          explain: 'Next-token prediction on huge text corpora.',
        },
        {
          kind: 'mcq',
          q: 'For consistent, factual answers you should use…',
          options: ['High temperature', 'Low temperature', 'Temperature doesn’t matter', 'Negative temperature'],
          answer: 1,
          explain: 'Lower temperature makes outputs more deterministic.',
        },
        {
          kind: 'tf',
          q: 'The context window is the amount of text the model can consider at once.',
          answer: true,
          explain: 'It’s measured in tokens.',
        },
        {
          kind: 'mcq',
          q: 'A bigram model predicts the next word using…',
          options: ['Only the previous word', 'The whole internet live', 'Images', 'A random number'],
          answer: 0,
          explain: 'Bigram = pairs of words; it looks at one previous word.',
        },
      ],
    },
    {
      id: 'transformers',
      title: 'Attention & Transformers',
      summary: 'The 2017 idea that powers every modern LLM.',
      minutes: 9,
      blocks: [
        {
          type: 'text',
          md: 'Read: “The **animal** didn’t cross the street because **it** was too tired.” What does *it* refer to? You instantly know: the animal. **Attention** lets a model do the same — every token looks at every other token and decides which ones matter for understanding it.',
        },
        { type: 'demo', id: 'attention', caption: 'Click a word to see what it “pays attention” to.' },
        { type: 'diagram', id: 'transformer' },
        {
          type: 'keypoints',
          items: [
            '**Self-attention** — each token gathers information from relevant tokens anywhere in the text.',
            '**Multi-head** — many attention “heads” run in parallel, each focusing on different relationships (grammar, meaning, references).',
            '**Layers** — a Transformer stacks dozens of attention + feed-forward blocks.',
            '**Parallel** — unlike older RNNs, it processes all tokens at once, making it fast to train on GPUs. That’s why it scaled.',
          ],
        },
      ],
      quiz: [
        {
          kind: 'mcq',
          q: 'What does self-attention let a token do?',
          options: ['Look at other tokens to understand context', 'Delete other tokens', 'Generate images', 'Speed up the internet'],
          answer: 0,
          explain: 'Each token weighs the relevance of all others.',
        },
        {
          kind: 'tf',
          q: 'Transformers process tokens one at a time strictly in sequence during training, like RNNs.',
          answer: false,
          explain: 'They process tokens in parallel — a key reason they scale.',
        },
        {
          kind: 'mcq',
          q: 'Multi-head attention means…',
          options: ['Several attention mechanisms run in parallel, each learning different relationships', 'Multiple GPUs', 'Several users chatting', 'Two output layers'],
          answer: 0,
          explain: 'Different heads capture different patterns.',
        },
        {
          kind: 'mcq',
          q: 'The Transformer was introduced in the paper…',
          options: ['“Attention Is All You Need”', '“Deep Blue”', '“ImageNet Classification”', '“The Turing Test”'],
          answer: 0,
          explain: 'Vaswani et al., 2017.',
        },
      ],
    },
    {
      id: 'llm-training',
      title: 'How LLMs Are Built',
      summary: 'Pre-training, fine-tuning and RLHF.',
      minutes: 7,
      blocks: [
        {
          type: 'keypoints',
          items: [
            '**1. Pre-training** — predict the next token on trillions of tokens of text and code. Takes thousands of GPUs for weeks–months. Result: a *base model* that knows a lot but just continues text.',
            '**2. Supervised fine-tuning (SFT)** — train on high-quality examples of helpful conversations, so it behaves like an assistant.',
            '**3. Preference training (RLHF / RLAIF)** — humans (or AI guided by principles) rank answers; the model is optimised toward the preferred ones: helpful, honest, harmless.',
            '**4. Evaluation & red-teaming** — test for capabilities, safety and misuse before release.',
          ],
        },
        {
          type: 'callout',
          tone: 'info',
          md: '**Scaling laws:** performance has improved predictably with more data, parameters and compute. That insight drove the race to build ever larger models — and now a focus on efficiency and reasoning.',
        },
        {
          type: 'example',
          title: 'Different flavours of the same recipe',
          company: 'OpenAI · Anthropic · Google · Meta',
          md: 'GPT, Claude, Gemini and Llama all follow this broad recipe. They differ in data, size, fine-tuning approach and safety methods — for example Anthropic’s *Constitutional AI* uses a written set of principles to guide AI feedback.',
        },
      ],
      quiz: [
        {
          kind: 'order',
          q: 'Order the stages of building an assistant LLM:',
          items: ['Pre-training on huge text', 'Supervised fine-tuning', 'Preference training (RLHF)', 'Evaluation & red-teaming'],
          explain: 'Pre-train → SFT → RLHF → evaluate.',
        },
        {
          kind: 'mcq',
          q: 'What does RLHF stand for?',
          options: ['Reinforcement Learning from Human Feedback', 'Really Large Hidden Filters', 'Recurrent Layer High Frequency', 'Random Labels, Hard Fine-tuning'],
          answer: 0,
          explain: 'Humans rank outputs; the model learns their preferences.',
        },
        {
          kind: 'tf',
          q: 'A pre-trained base model is already a polite, instruction-following assistant.',
          answer: false,
          explain: 'Base models just continue text; fine-tuning makes them assistants.',
        },
        {
          kind: 'mcq',
          q: 'Pre-training is the most expensive stage because…',
          options: ['It uses huge data and massive GPU compute', 'It needs lawyers', 'It runs on phones', 'It requires labelled images'],
          answer: 0,
          explain: 'Trillions of tokens × billions of parameters = enormous compute.',
        },
      ],
    },
  ],
};
