import type { World } from '../types';

export const w2: World = {
  id: 'data',
  index: 1,
  title: 'Data',
  tagline: 'The fuel of every AI system',
  emoji: '📊',
  color: '#0891b2',
  lessons: [
    {
      id: 'data-fuel',
      title: 'Data, Features & Labels',
      summary: 'The vocabulary you need to talk about any dataset.',
      minutes: 6,
      blocks: [
        {
          type: 'text',
          md: 'A **dataset** is a collection of examples. Each example (a *row*) has **features** — the inputs the model looks at — and, for supervised learning, a **label** — the answer we want it to predict.',
        },
        {
          type: 'code',
          lang: 'text',
          code: '  size_m2 | bedrooms | city     | age_yrs || price ($)\n  --------+----------+----------+---------++----------\n     85   |    2     | Austin   |   12    || 410,000\n    140   |    4     | Denver   |    3    || 720,000\n     60   |    1     | Austin   |   40    || 255,000\n  \\_____________ features ______________/    \\_ label _/',
        },
        {
          type: 'keypoints',
          items: [
            '**Structured data** — tables (spreadsheets, databases). Great for classic ML.',
            '**Unstructured data** — images, audio, text, video. Deep learning shines here.',
            '**Numerical features** — numbers (age, price). **Categorical features** — categories (city, colour).',
            'Labels can come from humans (annotation), logs (did the user click?), or the data itself.',
          ],
        },
        { type: 'demo', id: 'data-labeler', caption: 'Be the human annotator: label fruit so a model can learn.' },
        {
          type: 'example',
          title: 'Labelling at scale',
          company: 'Tesla · Scale AI',
          md: 'Self-driving teams label millions of camera frames: every car, pedestrian, lane line and traffic light. Companies like Scale AI exist just to provide high-quality human labels.',
        },
      ],
      quiz: [
        {
          kind: 'mcq',
          q: 'In a dataset predicting house prices, “number of bedrooms” is a…',
          options: ['Label', 'Feature', 'Model', 'Algorithm'],
          answer: 1,
          explain: 'It is an input the model uses → a feature. The price is the label.',
        },
        {
          kind: 'mcq',
          q: 'Which of these is unstructured data?',
          options: ['A spreadsheet of sales', 'A SQL table of users', 'A folder of X-ray images', 'A CSV of temperatures'],
          answer: 2,
          explain: 'Images, audio and free text are unstructured.',
        },
        {
          kind: 'tf',
          q: '“City” is a categorical feature.',
          answer: true,
          explain: 'It takes values from a set of categories, not a numeric scale.',
        },
        {
          kind: 'mcq',
          q: 'In supervised learning, what is the label?',
          options: ['The name of the dataset file', 'The correct answer the model should learn to predict', 'Any column with text', 'The model’s accuracy'],
          answer: 1,
          explain: 'Labels are the target outputs.',
        },
      ],
    },
    {
      id: 'data-cleaning',
      title: 'Collecting & Cleaning Data',
      summary: 'Missing values, duplicates, outliers — and how pros fix them.',
      minutes: 7,
      blocks: [
        {
          type: 'text',
          md: 'Real data is messy. Data scientists often say they spend **60–80% of their time** cleaning data. Common problems:',
        },
        {
          type: 'keypoints',
          items: [
            '**Missing values** — empty cells. Fix: drop rows, or fill (*impute*) with the median / most common value.',
            '**Duplicates** — the same record twice biases the model. Fix: de-duplicate.',
            '**Outliers** — a house listed at $1 or 10,000 m². Fix: investigate; remove if it is an error.',
            '**Inconsistent formats** — “USA”, “U.S.”, “United States”. Fix: standardise.',
            '**Label noise** — wrong answers in the answer key. Fix: review samples, use multiple annotators.',
          ],
        },
        {
          type: 'text',
          md: 'Here is what this looks like in Python with **pandas**, the most popular data library:',
        },
        {
          type: 'code',
          lang: 'python',
          code: 'import pandas as pd\n\ndf = pd.read_csv("houses.csv")\n\ndf = df.drop_duplicates()                              # remove duplicate rows\ndf["size_m2"] = df["size_m2"].fillna(df["size_m2"].median())  # impute missing\ndf = df[(df["price"] > 10_000) & (df["price"] < 10_000_000)]  # drop outliers\ndf["country"] = df["country"].replace({"U.S.": "USA", "United States": "USA"})\n\nprint(df.describe())   # quick sanity check',
        },
        {
          type: 'callout',
          tone: 'warn',
          md: '**Representative data matters.** If a face-recognition dataset has mostly light-skinned faces, the model will be less accurate for darker-skinned people. Cleaning is not only about errors — it is about coverage.',
        },
      ],
      quiz: [
        {
          kind: 'mcq',
          q: 'What does “imputation” mean?',
          options: ['Deleting the dataset', 'Filling in missing values with an estimate', 'Adding more features', 'Training the model'],
          answer: 1,
          explain: 'Imputation replaces missing values, e.g. with the median.',
        },
        {
          kind: 'tf',
          q: 'Duplicate rows are harmless and can be ignored.',
          answer: false,
          explain: 'Duplicates over-weight some examples and can leak between train and test sets.',
        },
        {
          kind: 'mcq',
          q: 'A house price of $1 in your dataset is most likely…',
          options: ['A bargain', 'An outlier / data error to investigate', 'A new feature', 'The label for all rows'],
          answer: 1,
          explain: 'Extreme impossible values are typically errors.',
        },
        {
          kind: 'mcq',
          q: 'Which Python library is the standard for working with tables of data?',
          options: ['pandas', 'pygame', 'flask', 'requests'],
          answer: 0,
          explain: 'pandas provides DataFrames for loading, cleaning and analysing tabular data.',
        },
      ],
    },
    {
      id: 'train-test',
      title: 'Train, Validation & Test Sets',
      summary: 'Why we hide data from our own model — and what overfitting is.',
      minutes: 7,
      blocks: [
        {
          type: 'text',
          md: 'Imagine a student who memorises last year’s exam answers. They score 100% on that exam but fail a new one. Models can do the same — it is called **overfitting**.\n\nTo catch it, we split our data:',
        },
        {
          type: 'keypoints',
          items: [
            '**Training set (~70–80%)** — the model learns from these.',
            '**Validation set (~10–15%)** — used while building, to tune settings and pick the best model.',
            '**Test set (~10–15%)** — locked away until the very end. Your honest final score.',
          ],
        },
        { type: 'demo', id: 'train-test-split', caption: 'Drag the slider and watch how the split changes the scores.' },
        {
          type: 'callout',
          tone: 'warn',
          md: '**Data leakage** is when information from the test set sneaks into training (e.g. the same customer in both sets, or a feature computed using future data). It makes models look amazing in the lab and fail in production.',
        },
        {
          type: 'keypoints',
          items: [
            '**Overfitting** — great on training data, poor on new data (memorised noise).',
            '**Underfitting** — poor on both (model too simple).',
            '**Good fit** — similar, good performance on training and test data.',
          ],
        },
      ],
      quiz: [
        {
          kind: 'mcq',
          q: 'A model gets 99% on training data and 60% on test data. This is…',
          options: ['Underfitting', 'Overfitting', 'A perfect model', 'Data cleaning'],
          answer: 1,
          explain: 'A big gap between train and test performance signals overfitting.',
        },
        {
          kind: 'mcq',
          q: 'Which set should only be used once, at the very end?',
          options: ['Training set', 'Validation set', 'Test set', 'All of them'],
          answer: 2,
          explain: 'The test set gives your unbiased final estimate.',
        },
        {
          kind: 'tf',
          q: 'Data leakage usually makes a model look worse in testing than it really is.',
          answer: false,
          explain: 'Leakage makes it look *better* than reality — which is why it is dangerous.',
        },
        {
          kind: 'mcq',
          q: 'What is the validation set used for?',
          options: ['Final reporting only', 'Tuning settings and choosing between models', 'Storing labels', 'Nothing'],
          answer: 1,
          explain: 'Validation data guides decisions during development.',
        },
      ],
    },
    {
      id: 'features',
      title: 'Feature Engineering & Scaling',
      summary: 'Turning raw data into signals a model can use.',
      minutes: 6,
      blocks: [
        {
          type: 'text',
          md: 'Models only understand numbers. **Feature engineering** turns raw data into useful numeric signals. A good feature can matter more than a fancier algorithm.',
        },
        {
          type: 'keypoints',
          items: [
            '**One-hot encoding** — turn a category into 0/1 columns: city=Austin → `[1,0,0]`.',
            '**Scaling** — put numbers on similar ranges (e.g. 0–1) so “salary” (50,000) does not drown out “age” (35).',
            '**Date features** — from a timestamp extract day-of-week, hour, is_holiday.',
            '**Ratios & combos** — price per m², clicks per visit.',
            '**Text → numbers** — word counts, or embeddings (World 6).',
          ],
        },
        {
          type: 'code',
          lang: 'python',
          code: 'from sklearn.preprocessing import OneHotEncoder, StandardScaler\n\nscaler = StandardScaler()             # mean 0, std 1\nX_num = scaler.fit_transform(df[["size_m2", "age_yrs"]])\n\nenc = OneHotEncoder()\nX_city = enc.fit_transform(df[["city"]]).toarray()',
        },
        {
          type: 'example',
          title: 'A feature that beat the algorithm',
          company: 'Ride-hailing',
          md: 'Predicting ride demand: adding “is it raining?” and “is there a concert nearby?” improved forecasts far more than switching to a more complex model.',
        },
      ],
      quiz: [
        {
          kind: 'mcq',
          q: 'Converting colour = {red, green, blue} into three 0/1 columns is called…',
          options: ['Scaling', 'One-hot encoding', 'Clustering', 'Imputation'],
          answer: 1,
          explain: 'One-hot encoding creates a binary column per category.',
        },
        {
          kind: 'mcq',
          q: 'Why scale numeric features?',
          options: ['To make the file smaller', 'So large-valued features don’t dominate smaller ones', 'To remove labels', 'It is required by law'],
          answer: 1,
          explain: 'Many algorithms (k-NN, neural nets) are sensitive to feature magnitude.',
        },
        {
          kind: 'tf',
          q: 'A well-designed feature can improve results more than switching algorithms.',
          answer: true,
          explain: 'Domain knowledge encoded as features is very powerful.',
        },
        {
          kind: 'mcq',
          q: 'From a timestamp, which is a useful engineered feature?',
          options: ['The font it was written in', 'Day of the week', 'The file name', 'Number of characters'],
          answer: 1,
          explain: 'Day-of-week often explains behaviour (e.g. weekend shopping).',
        },
      ],
    },
    {
      id: 'metrics',
      title: 'Measuring Success: Metrics',
      summary: 'Accuracy, precision, recall and the confusion matrix.',
      minutes: 8,
      blocks: [
        {
          type: 'text',
          md: '**Accuracy** (correct predictions ÷ all predictions) sounds enough — but it can lie. If 1 in 100 transactions is fraud, a model that always says “not fraud” is **99% accurate** and completely useless.',
        },
        {
          type: 'code',
          lang: 'text',
          code: '                    Predicted: Fraud   Predicted: OK\n  Actually Fraud         TP = 40           FN = 10   ← missed fraud!\n  Actually OK            FP = 20           TN = 930  ← false alarms\n\n  Precision = TP / (TP + FP) = 40 / 60  = 67%   "when we flag, how often right?"\n  Recall    = TP / (TP + FN) = 40 / 50  = 80%   "of all fraud, how much did we catch?"\n  F1        = harmonic mean of the two  ≈ 73%',
        },
        {
          type: 'keypoints',
          items: [
            '**Precision** matters when false alarms are costly (spam filter hiding real email).',
            '**Recall** matters when misses are costly (cancer screening, fraud).',
            '**F1 score** balances both.',
            'For regression, use **MAE** (mean absolute error) or **RMSE** — how far off, on average.',
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          md: 'Always compare against a **baseline** — e.g. “always predict the most common class” or “predict the average”. If your model can’t beat it, it isn’t learning anything useful.',
        },
      ],
      quiz: [
        {
          kind: 'mcq',
          q: 'For cancer screening, which metric matters most?',
          options: ['Precision', 'Recall', 'File size', 'Training speed'],
          answer: 1,
          explain: 'Missing a real case (false negative) is very costly → maximise recall.',
        },
        {
          kind: 'mcq',
          q: 'Recall = …',
          options: ['TP / (TP + FP)', 'TP / (TP + FN)', '(TP+TN) / all', 'FP / TN'],
          answer: 1,
          explain: 'Recall: of all actual positives, the share we caught.',
        },
        {
          kind: 'tf',
          q: 'On a dataset with 99% negatives, 99% accuracy guarantees a useful model.',
          answer: false,
          explain: 'Always predicting “negative” already gets 99%. Check precision/recall.',
        },
        {
          kind: 'mcq',
          q: 'What is a baseline?',
          options: ['The final model', 'A simple reference prediction your model must beat', 'The test set', 'A type of neural network'],
          answer: 1,
          explain: 'Baselines tell you whether the model adds real value.',
        },
      ],
    },
  ],
};
