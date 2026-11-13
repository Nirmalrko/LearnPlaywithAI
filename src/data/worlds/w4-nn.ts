import type { World } from '../types';

export const w4: World = {
  id: 'neural-networks',
  index: 3,
  title: 'Neural Networks',
  tagline: 'The engine behind deep learning',
  emoji: '🧠',
  color: '#db2777',
  lessons: [
    {
      id: 'neuron',
      title: 'The Artificial Neuron',
      summary: 'Inputs × weights + bias → activation. That’s it!',
      minutes: 7,
      blocks: [
        {
          type: 'text',
          md: 'A neural network is built from tiny units called **neurons**, loosely inspired by brain cells. Each neuron does three simple things:\n\n1. Multiply each input by a **weight** (how important is it?)\n2. Add them up, plus a **bias**\n3. Pass the sum through an **activation function** to decide how strongly to “fire”.',
        },
        { type: 'diagram', id: 'neuron' },
        { type: 'demo', id: 'neuron', caption: 'Tune the weights yourself: should we go to the beach today?' },
        {
          type: 'callout',
          tone: 'info',
          md: 'A single neuron can only draw a straight decision line. Stack thousands of them in **layers** and the network can learn almost any shape — that’s the *universal approximation* idea.',
        },
      ],
      quiz: [
        {
          kind: 'order',
          q: 'Order the steps inside a neuron:',
          items: ['Multiply inputs by weights', 'Sum them and add the bias', 'Apply the activation function'],
          explain: 'Weighted sum + bias → activation.',
        },
        {
          kind: 'mcq',
          q: 'What does a weight represent?',
          options: ['The size of the dataset', 'How much an input influences the output', 'The number of layers', 'The model’s file size'],
          answer: 1,
          explain: 'Larger weight magnitude = more influence.',
        },
        {
          kind: 'tf',
          q: 'A single neuron can learn any complex curved decision boundary.',
          answer: false,
          explain: 'One neuron gives a linear boundary; layers of neurons are needed for complex shapes.',
        },
        {
          kind: 'mcq',
          q: 'Neural networks are loosely inspired by…',
          options: ['Spreadsheets', 'The brain', 'Decision trees', 'Databases'],
          answer: 1,
          explain: 'They take loose inspiration from biological neurons.',
        },
      ],
    },
    {
      id: 'activations',
      title: 'Activation Functions',
      summary: 'ReLU, sigmoid, softmax — the non-linear magic.',
      minutes: 5,
      blocks: [
        {
          type: 'text',
          md: 'Without activation functions, stacking layers would just give another straight line — no matter how deep. Activations add **non-linearity**, letting networks bend and curve.',
        },
        {
          type: 'code',
          lang: 'text',
          code: 'ReLU(x)    = max(0, x)          → most popular in hidden layers. Fast & simple.\nSigmoid(x) = 1 / (1 + e^-x)     → squashes to 0..1. Used for yes/no outputs.\nTanh(x)                         → squashes to -1..1.\nSoftmax                         → turns a list of scores into probabilities that sum to 1.\n                                  Used for multi-class outputs (cat 70%, dog 25%, bird 5%).',
        },
        {
          type: 'keypoints',
          items: [
            'Hidden layers: usually **ReLU** (or variants like GELU in Transformers).',
            'Binary output: **sigmoid**. Multi-class output: **softmax**.',
            'Regression output: **no activation** (linear) — just output the number.',
          ],
        },
      ],
      quiz: [
        {
          kind: 'mcq',
          q: 'ReLU(-3) equals…',
          options: ['-3', '0', '3', '1'],
          answer: 1,
          explain: 'ReLU outputs max(0, x) → 0 for negatives.',
        },
        {
          kind: 'mcq',
          q: 'For classifying an image into 10 categories, the output layer uses…',
          options: ['ReLU', 'Softmax', 'No activation', 'Sigmoid on one neuron'],
          answer: 1,
          explain: 'Softmax produces a probability distribution over classes.',
        },
        {
          kind: 'tf',
          q: 'Without non-linear activations, a deep network is equivalent to a single linear model.',
          answer: true,
          explain: 'Composing linear functions gives another linear function.',
        },
        {
          kind: 'mcq',
          q: 'Which activation is most common in hidden layers today?',
          options: ['ReLU (and variants)', 'Step function', 'Softmax', 'Square root'],
          answer: 0,
          explain: 'ReLU is cheap and trains well.',
        },
      ],
    },
    {
      id: 'gradient-descent',
      title: 'Loss & Gradient Descent',
      summary: 'How models learn: walking downhill on the error landscape.',
      minutes: 8,
      blocks: [
        {
          type: 'text',
          md: 'Training = minimising the **loss** (error). Picture the loss as a hilly landscape, and you are blindfolded on it. To get to the valley, feel which way is downhill (**the gradient**) and take a step. Repeat.\n\n`new_weight = old_weight − learning_rate × gradient`',
        },
        { type: 'demo', id: 'gradient-descent', caption: 'Change the learning rate. Too small = slow; too big = it bounces out!' },
        {
          type: 'keypoints',
          items: [
            '**Learning rate** — step size. The most important setting (hyperparameter) to tune.',
            '**Epoch** — one full pass through the training data.',
            '**Batch** — a small chunk of examples used for one update (*mini-batch* / *stochastic* gradient descent).',
            '**Optimizers** like **Adam** adapt the step size automatically and are the default today.',
          ],
        },
      ],
      quiz: [
        {
          kind: 'mcq',
          q: 'The gradient tells you…',
          options: ['The final accuracy', 'Which direction increases the loss fastest (so you step the opposite way)', 'How many layers to use', 'The size of the dataset'],
          answer: 1,
          explain: 'We move against the gradient to reduce the loss.',
        },
        {
          kind: 'mcq',
          q: 'If the learning rate is far too high, training will likely…',
          options: ['Converge perfectly', 'Bounce around or diverge', 'Stop immediately', 'Use less memory'],
          answer: 1,
          explain: 'Huge steps overshoot the minimum.',
        },
        {
          kind: 'tf',
          q: 'An epoch is one full pass through the training dataset.',
          answer: true,
          explain: 'Training typically runs for several epochs.',
        },
        {
          kind: 'mcq',
          q: 'Which is a popular adaptive optimizer?',
          options: ['Adam', 'Excel', 'ReLU', 'k-means'],
          answer: 0,
          explain: 'Adam is the default optimizer for most deep learning.',
        },
      ],
    },
    {
      id: 'backprop',
      title: 'Training a Real Network',
      summary: 'Forward pass, backpropagation — and train one live in your browser.',
      minutes: 10,
      blocks: [
        {
          type: 'text',
          md: 'A **deep** network has an input layer, one or more **hidden layers**, and an output layer. Training loops over four steps thousands of times:',
        },
        { type: 'diagram', id: 'network' },
        {
          type: 'keypoints',
          items: [
            '**1. Forward pass** — data flows through the layers to make a prediction.',
            '**2. Compute loss** — how wrong was it?',
            '**3. Backpropagation** — use calculus (the chain rule) to work out how much each weight contributed to the error.',
            '**4. Update** — nudge every weight a little in the direction that reduces the error (gradient descent).',
          ],
        },
        {
          type: 'demo',
          id: 'neural-net',
          caption: 'This is a real neural network training in your browser. Pick a dataset, press Train, watch it learn the boundary.',
        },
        {
          type: 'code',
          lang: 'python',
          code: 'import torch, torch.nn as nn\n\nmodel = nn.Sequential(nn.Linear(2, 8), nn.ReLU(), nn.Linear(8, 8), nn.ReLU(), nn.Linear(8, 1))\nopt = torch.optim.Adam(model.parameters(), lr=0.03)\nloss_fn = nn.BCEWithLogitsLoss()\n\nfor epoch in range(500):\n    pred = model(X)            # 1. forward\n    loss = loss_fn(pred, y)    # 2. loss\n    opt.zero_grad()\n    loss.backward()            # 3. backprop\n    opt.step()                 # 4. update',
        },
      ],
      quiz: [
        {
          kind: 'order',
          q: 'Order one training step:',
          items: ['Forward pass', 'Compute loss', 'Backpropagation', 'Update weights'],
          explain: 'Predict → measure error → compute gradients → update.',
        },
        {
          kind: 'mcq',
          q: 'Backpropagation computes…',
          options: ['The prediction', 'How much each weight contributed to the error (gradients)', 'The dataset split', 'The final accuracy'],
          answer: 1,
          explain: 'It applies the chain rule backwards through the layers.',
        },
        {
          kind: 'tf',
          q: 'Hidden layers are the layers between the input and output layers.',
          answer: true,
          explain: 'They are “hidden” because we don’t observe them directly.',
        },
        {
          kind: 'mcq',
          q: 'Which Python library is widely used for deep learning?',
          options: ['PyTorch', 'pandas', 'matplotlib', 'Django'],
          answer: 0,
          explain: 'PyTorch (and TensorFlow/JAX) are the main deep learning frameworks.',
        },
      ],
    },
    {
      id: 'regularization',
      title: 'Overfitting, Regularization & Hyperparameters',
      summary: 'Keeping big networks honest.',
      minutes: 6,
      blocks: [
        {
          type: 'text',
          md: 'Big networks can memorise anything — including noise. Tools to keep them generalising:',
        },
        {
          type: 'keypoints',
          items: [
            '**More data** — the best regularizer. **Data augmentation** creates more (flip, crop, rotate images).',
            '**Dropout** — randomly switch off neurons during training so the network can’t rely on any single one.',
            '**Weight decay (L2)** — penalise very large weights.',
            '**Early stopping** — stop when validation loss starts going up.',
          ],
        },
        {
          type: 'text',
          md: '**Hyperparameters** are settings *you* choose (not learned): learning rate, number of layers, neurons per layer, batch size, dropout rate, epochs. Tune them on the **validation set**.',
        },
        {
          type: 'callout',
          tone: 'tip',
          md: 'Rule of thumb from practitioners: first get a model that *overfits* (proves it can learn), then add regularization until validation performance is best.',
        },
      ],
      quiz: [
        {
          kind: 'mcq',
          q: 'Dropout works by…',
          options: ['Deleting training data', 'Randomly disabling neurons during training', 'Removing the output layer', 'Lowering the learning rate to zero'],
          answer: 1,
          explain: 'It forces the network to learn redundant, robust features.',
        },
        {
          kind: 'mcq',
          q: 'Which of these is a hyperparameter?',
          options: ['A weight learned by the network', 'The learning rate', 'A training label', 'The test accuracy'],
          answer: 1,
          explain: 'Hyperparameters are set before training; weights are learned.',
        },
        {
          kind: 'tf',
          q: 'Early stopping halts training when validation loss starts rising.',
          answer: true,
          explain: 'That’s the point where the model begins to overfit.',
        },
        {
          kind: 'mcq',
          q: 'Flipping and rotating training images is called…',
          options: ['Data augmentation', 'Backpropagation', 'Tokenization', 'Clustering'],
          answer: 0,
          explain: 'Augmentation creates new varied examples from existing ones.',
        },
      ],
    },
  ],
};
