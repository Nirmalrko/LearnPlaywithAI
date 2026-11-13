import { ScenarioGame } from './ScenarioGame';

export function BiasSpotter() {
  return (
    <ScenarioGame
      title="Audits passed"
      scenarios={[
        {
          prompt: 'A loan model never uses race — but heavily weights the applicant’s postcode.',
          options: ['Fine: race isn’t used', 'Risky: postcode can be a proxy for race'],
          answer: 1,
          explain: 'Residential segregation means postcode can encode race. This is **proxy discrimination**. Test outcomes by group.',
        },
        {
          prompt: 'A skin-cancer detector was trained on 92% light-skin images. Overall accuracy: 95%.',
          options: ['Ship it — 95% is great', 'Check accuracy per skin tone first'],
          answer: 1,
          explain: 'Averages hide gaps. Accuracy on darker skin may be much lower. **Disaggregate** your evaluation.',
        },
        {
          prompt: 'A CV-screening model trained on 10 years of past hires, mostly from one university.',
          options: ['Historical bias risk', 'No risk: it’s real data'],
          answer: 0,
          explain: 'Real data can encode past preferences. The model may learn “that university = good” instead of actual skill.',
        },
        {
          prompt: 'A predictive policing tool sends more patrols where more arrests were recorded… which records more arrests there.',
          options: ['Feedback loop', 'Working as intended'],
          answer: 0,
          explain: 'A **feedback loop**: the model’s decisions generate the data that confirms it.',
        },
        {
          prompt: 'A voice assistant works well for US accents but often fails for Scottish and Indian English speakers.',
          options: ['Representation bias in training data', 'Users should speak differently'],
          answer: 0,
          explain: 'The fix is more diverse training data and per-accent evaluation — not blaming users.',
        },
      ]}
    />
  );
}

export function Hallucination() {
  return (
    <ScenarioGame
      title="Correct calls"
      scenarios={[
        {
          prompt: '“The Eiffel Tower is in Paris and was completed in 1889.”',
          options: ['✅ Accurate', '🚩 Hallucination'],
          answer: 0,
          explain: 'Correct — completed for the 1889 World’s Fair.',
        },
        {
          prompt: '“See *Smith v. Digital Corp* (2019), 512 F.3d 1104, which held AI outputs are copyrightable.”',
          options: ['✅ Accurate', '🚩 Suspicious — verify'],
          answer: 1,
          explain: 'Precise-looking legal citations are a classic hallucination pattern. Always look them up in an official database.',
        },
        {
          prompt: '“To read a CSV in pandas, use `pd.read_csv(\'file.csv\')`.”',
          options: ['✅ Accurate', '🚩 Hallucination'],
          answer: 0,
          explain: 'Correct, and easy to verify by running it.',
        },
        {
          prompt: '“Use `pandas.auto_clean(df)` to automatically fix all data quality issues.”',
          options: ['✅ Accurate', '🚩 Hallucination'],
          answer: 1,
          explain: 'This function doesn’t exist. Models sometimes invent plausible-sounding APIs. Run the code or check the docs.',
        },
        {
          prompt: 'An AI says: “Based on the handbook you provided [Leave §1], you get 25 vacation days.”',
          options: ['✅ Grounded answer', '🚩 Hallucination'],
          answer: 0,
          explain: 'It cites a provided source you can check — that’s RAG done right.',
        },
      ]}
    />
  );
}

export function MvpBuilder() {
  return (
    <ScenarioGame
      title="Good decisions"
      scenarios={[
        {
          prompt: 'Step 1 · You want to launch an AI product. Which first idea is best?',
          options: ['“AI that helps businesses with everything”', '“Summarise long customer-support tickets into 3 bullet points for agents”'],
          answer: 1,
          explain: 'Narrow, painful, measurable problems make great MVPs.',
        },
        {
          prompt: 'Step 2 · How do you build version 1?',
          options: ['Train our own LLM from scratch', 'Use an existing model API with a well-tested prompt'],
          answer: 1,
          explain: 'APIs let you validate value in days, not months. Optimise later.',
        },
        {
          prompt: 'Step 3 · How do you know if prompt changes make things better?',
          options: ['Try a couple of examples and go with your gut', 'Build an eval set of ~50 real tickets with good summaries and score each change'],
          answer: 1,
          explain: 'Evals are your unit tests. Without them you’re guessing.',
        },
        {
          prompt: 'Step 4 · The summary is sometimes wrong. What does the UI do?',
          options: ['Hide that it’s AI and auto-send it to customers', 'Show it to agents as a draft, with a link to the original and a 👎 button'],
          answer: 1,
          explain: 'Design for failure: human review, transparency, and feedback loops.',
        },
        {
          prompt: 'Step 5 · You’ve launched to 20 agents. What do you monitor?',
          options: ['Only the number of sign-ups', 'Quality ratings, latency, cost per summary and failure cases'],
          answer: 1,
          explain: 'AI products need quality, speed and cost dashboards from day one.',
        },
      ]}
    />
  );
}
