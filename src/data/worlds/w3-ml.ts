import type { World } from '../types';

export const w3: World = {
  id: 'classic-ml',
  index: 2,
  title: 'Classic Machine Learning',
  tagline: 'The algorithms that still run most of the world',
  emoji: '📈',
  color: '#059669',
  lessons: [
    {
      id: 'linear-regression',
      title: 'Linear Regression',
      summary: 'Fit the best straight line — the “hello world” of ML.',
      minutes: 8,
      blocks: [
        {
          type: 'text',
          md: 'Linear regression predicts a number by drawing the best straight line through the data:\n\n`prediction = w × input + b`\n\n`w` (the **weight** or slope) and `b` (the **bias** or intercept) are the model’s **parameters**. “Training” means finding the `w` and `b` that make the line as close to all points as possible.',
        },
        {
          type: 'text',
          md: 'How do we measure “close”? With a **loss function**. The most common is **Mean Squared Error (MSE)**: for every point, take the vertical distance to the line, square it, then average.',
        },
        { type: 'demo', id: 'regression', caption: 'Click to add points. Then try to beat the computer at fitting the line!' },
        {
          type: 'code',
          lang: 'python',
          code: 'from sklearn.linear_model import LinearRegression\n\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)          # learn w and b\nprint(model.coef_, model.intercept_)\npreds = model.predict(X_test)',
        },
        {
          type: 'example',
          title: 'Still everywhere',
          company: 'Finance · Retail',
          md: 'Linear models are fast, cheap and *explainable* (“each extra m² adds $3,100”). Banks and retailers still use them for forecasting and pricing — sometimes regulators require explainable models.',
        },
      ],
      quiz: [
        {
          kind: 'mcq',
          q: 'In `y = w × x + b`, what does training find?',
          options: ['x and y', 'w and b', 'Only the loss', 'The dataset'],
          answer: 1,
          explain: 'The parameters w (weight) and b (bias) are learned.',
        },
        {
          kind: 'mcq',
          q: 'MSE (Mean Squared Error) measures…',
          options: ['How fast training runs', 'The average squared distance between predictions and true values', 'The number of features', 'Accuracy for classification'],
          answer: 1,
          explain: 'Lower MSE = predictions closer to reality.',
        },
        {
          kind: 'tf',
          q: 'Linear regression is used to predict categories like cat vs. dog.',
          answer: false,
          explain: 'Linear regression predicts continuous numbers. For categories use classification.',
        },
        {
          kind: 'mcq',
          q: 'A key business advantage of linear models is…',
          options: ['They are explainable', 'They generate images', 'They need GPUs', 'They never make errors'],
          answer: 0,
          explain: 'Each weight has a clear meaning, which helps trust and regulation.',
        },
      ],
    },
    {
      id: 'classification',
      title: 'Classification & Logistic Regression',
      summary: 'Predicting categories and probabilities.',
      minutes: 7,
      blocks: [
        {
          type: 'text',
          md: '**Classification** predicts a category: spam/not spam, cat/dog/bird, approve/decline. **Logistic regression** — despite the name — is a classification algorithm. It squashes a linear score through the **sigmoid** function into a probability between 0 and 1.',
        },
        {
          type: 'code',
          lang: 'text',
          code: 'score       = w1·x1 + w2·x2 + b\nprobability = sigmoid(score) = 1 / (1 + e^-score)\n\nscore = -4  →  0.02   (very unlikely spam)\nscore =  0  →  0.50   (unsure)\nscore = +4  →  0.98   (very likely spam)',
        },
        {
          type: 'text',
          md: 'We then pick a **threshold** (often 0.5): above it → positive class. Moving the threshold trades **precision** for **recall** — remember World 2!\n\nThe line where the model switches its answer is called the **decision boundary**.',
        },
        {
          type: 'example',
          title: 'Credit decisions',
          company: 'Banks',
          md: 'A logistic model scores loan applicants. Raising the threshold approves fewer, safer loans (higher precision); lowering it approves more people but with more defaults.',
        },
      ],
      quiz: [
        {
          kind: 'mcq',
          q: 'Logistic regression is mainly used for…',
          options: ['Classification', 'Image generation', 'Clustering', 'Predicting exact prices'],
          answer: 0,
          explain: 'It outputs class probabilities.',
        },
        {
          kind: 'mcq',
          q: 'The sigmoid function outputs values between…',
          options: ['-1 and 1', '0 and 1', '0 and 100', '-∞ and +∞'],
          answer: 1,
          explain: 'Sigmoid maps any number to (0, 1) — a probability.',
        },
        {
          kind: 'tf',
          q: 'Lowering the classification threshold usually increases recall.',
          answer: true,
          explain: 'More cases get flagged positive, so fewer positives are missed.',
        },
        {
          kind: 'mcq',
          q: 'What is a decision boundary?',
          options: ['The edge of the dataset', 'Where the model switches from one predicted class to another', 'The maximum training time', 'A type of loss'],
          answer: 1,
          explain: 'It separates the regions assigned to each class.',
        },
      ],
    },
    {
      id: 'knn',
      title: 'k-Nearest Neighbours',
      summary: '“Tell me who your neighbours are and I’ll tell you who you are.”',
      minutes: 6,
      blocks: [
        {
          type: 'text',
          md: '**k-NN** is the simplest classifier to understand. To classify a new point, look at the **k closest** training points and take a vote. No real “training” — it just remembers the data.',
        },
        { type: 'demo', id: 'knn', caption: 'Move your mouse (or tap) over the plane. Change k and see the vote change.' },
        {
          type: 'keypoints',
          items: [
            '**Small k (e.g. 1)** — very wiggly boundary, sensitive to noise → overfitting.',
            '**Large k** — smoother boundary, may miss detail → underfitting.',
            'Needs **scaled features** because it uses distances.',
            'Slow on huge datasets: every prediction compares against all points. (Vector databases solve this — World 7!)',
          ],
        },
      ],
      quiz: [
        {
          kind: 'mcq',
          q: 'How does k-NN classify a new point?',
          options: ['Majority vote of the k closest training points', 'Draws a straight line', 'Asks a human', 'Uses a neural network'],
          answer: 0,
          explain: 'It finds the k nearest neighbours and votes.',
        },
        {
          kind: 'tf',
          q: 'k = 1 tends to overfit more than k = 15.',
          answer: true,
          explain: 'With k=1 every single noisy point shapes the boundary.',
        },
        {
          kind: 'mcq',
          q: 'Why must features be scaled for k-NN?',
          options: ['Distances would be dominated by large-range features', 'To save disk space', 'k-NN only accepts integers', 'It doesn’t matter'],
          answer: 0,
          explain: 'Distance calculations are affected by each feature’s scale.',
        },
        {
          kind: 'mcq',
          q: 'A downside of k-NN is…',
          options: ['It cannot do classification', 'Prediction is slow on very large datasets', 'It needs labelled images only', 'It is impossible to explain'],
          answer: 1,
          explain: 'Every prediction searches the whole training set (unless indexed).',
        },
      ],
    },
    {
      id: 'trees',
      title: 'Decision Trees & Random Forests',
      summary: 'Models that ask a series of yes/no questions.',
      minutes: 7,
      blocks: [
        {
          type: 'text',
          md: 'A **decision tree** is like the game *20 Questions*. It learns the best yes/no questions to split the data: “Is income > $50k?” → “Has missed a payment?” → **Approve / Decline**.',
        },
        { type: 'demo', id: 'decision-tree', caption: 'Walk down a real tree that decides whether to play tennis.' },
        {
          type: 'keypoints',
          items: [
            'Trees are **easy to explain** — you can literally draw them.',
            'Deep trees overfit. We limit **max depth**.',
            '**Random Forest** — train hundreds of trees on random subsets and average their votes. Much more accurate and robust.',
            '**Gradient Boosting** (XGBoost, LightGBM) — trees built one after another, each fixing the previous errors. The champion on tabular data competitions.',
          ],
        },
        {
          type: 'example',
          title: 'The workhorse of tabular data',
          company: 'Airbnb · Kaggle',
          md: 'For spreadsheets-style data (prices, churn, risk), gradient-boosted trees often beat deep learning. Airbnb has used them for pricing and search ranking; they win most Kaggle tabular competitions.',
        },
      ],
      quiz: [
        {
          kind: 'mcq',
          q: 'A random forest is…',
          options: ['One very deep tree', 'Many trees whose predictions are combined', 'A neural network', 'A clustering method'],
          answer: 1,
          explain: 'An ensemble of trees voting together.',
        },
        {
          kind: 'tf',
          q: 'Decision trees are generally easy to explain to non-experts.',
          answer: true,
          explain: 'You can follow the yes/no path to any decision.',
        },
        {
          kind: 'mcq',
          q: 'How do you reduce overfitting in a single decision tree?',
          options: ['Make it deeper', 'Limit max depth', 'Remove the test set', 'Add duplicate rows'],
          answer: 1,
          explain: 'Shallower trees capture general patterns rather than noise.',
        },
        {
          kind: 'mcq',
          q: 'Which family usually wins on tabular (spreadsheet) data?',
          options: ['Gradient-boosted trees', 'Image CNNs', 'Diffusion models', 'Chatbots'],
          answer: 0,
          explain: 'XGBoost/LightGBM-style models dominate tabular tasks.',
        },
      ],
    },
    {
      id: 'kmeans',
      title: 'Clustering with k-Means',
      summary: 'Finding groups in data with no labels at all.',
      minutes: 6,
      blocks: [
        {
          type: 'text',
          md: '**k-means** is the go-to unsupervised algorithm. You choose *k* (how many groups). Then it repeats two steps until nothing changes:\n\n1. **Assign** every point to its nearest centre (centroid).\n2. **Update** each centroid to the average of its points.',
        },
        { type: 'demo', id: 'kmeans', caption: 'Step through k-means and watch the centroids move.' },
        {
          type: 'example',
          title: 'Customer segmentation',
          company: 'Retail · Marketing',
          md: 'Retailers cluster customers by spend, frequency and category to find groups like “bargain hunters”, “loyal premium” or “seasonal shoppers” — then tailor offers to each.',
        },
        {
          type: 'callout',
          tone: 'tip',
          md: 'Choosing k: try several values and plot the total distance-to-centroid. The point where improvement slows down sharply (“the **elbow**”) is a good choice.',
        },
      ],
      quiz: [
        {
          kind: 'order',
          q: 'Order the k-means loop:',
          items: ['Pick k random starting centroids', 'Assign each point to its nearest centroid', 'Move each centroid to the mean of its points', 'Repeat until assignments stop changing'],
          explain: 'Initialise → assign → update → repeat.',
        },
        {
          kind: 'tf',
          q: 'k-means requires labelled data.',
          answer: false,
          explain: 'It is unsupervised — no labels needed.',
        },
        {
          kind: 'mcq',
          q: 'The “elbow method” helps you choose…',
          options: ['The learning rate', 'The number of clusters k', 'The test set size', 'The activation function'],
          answer: 1,
          explain: 'It finds the k where adding clusters stops helping much.',
        },
        {
          kind: 'mcq',
          q: 'A typical business use of clustering is…',
          options: ['Customer segmentation', 'Translating text', 'Predicting exact house prices', 'Generating images'],
          answer: 0,
          explain: 'Grouping similar customers is a classic clustering task.',
        },
      ],
    },
  ],
};
