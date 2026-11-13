import type { World } from '../types';

export const w5: World = {
  id: 'vision',
  index: 4,
  title: 'Computer Vision',
  tagline: 'Teaching machines to see',
  emoji: '👁️',
  color: '#ea580c',
  lessons: [
    {
      id: 'pixels',
      title: 'How Computers See: Pixels',
      summary: 'To a computer, every image is just a grid of numbers.',
      minutes: 5,
      blocks: [
        {
          type: 'text',
          md: 'A digital image is a grid of **pixels**. In a greyscale image each pixel is one number from **0 (black)** to **255 (white)**. A colour image has three numbers per pixel — **Red, Green, Blue** — so a 1080p photo is about **6 million numbers**.',
        },
        { type: 'demo', id: 'pixels', caption: 'Draw something — then reveal what the computer actually “sees”.' },
        {
          type: 'callout',
          tone: 'info',
          md: 'The challenge of vision: a cat photographed in sunlight vs. shade, close up vs. far away, gives *completely different numbers*. The model must learn what stays the same — “cat-ness” — despite all that variation.',
        },
      ],
      quiz: [
        {
          kind: 'mcq',
          q: 'In an 8-bit greyscale image, a white pixel has value…',
          options: ['0', '1', '128', '255'],
          answer: 3,
          explain: '0 = black, 255 = white.',
        },
        {
          kind: 'mcq',
          q: 'A colour pixel is usually stored as…',
          options: ['One number', 'Three numbers (R, G, B)', 'A word', 'A vector of 1000 numbers'],
          answer: 1,
          explain: 'Red, Green and Blue channels.',
        },
        {
          kind: 'tf',
          q: 'The same object under different lighting produces very different pixel values.',
          answer: true,
          explain: 'That variability is exactly what makes vision hard.',
        },
        {
          kind: 'mcq',
          q: 'A 100×100 RGB image contains how many numbers?',
          options: ['100', '10,000', '30,000', '300'],
          answer: 2,
          explain: '100 × 100 pixels × 3 channels = 30,000.',
        },
      ],
    },
    {
      id: 'convolution',
      title: 'Convolutions & Filters',
      summary: 'Sliding small windows over an image to detect edges and patterns.',
      minutes: 7,
      blocks: [
        {
          type: 'text',
          md: 'A **convolution** slides a small grid of numbers (a **filter** or **kernel**, e.g. 3×3) across the image. At each spot it multiplies and sums, producing a new image called a **feature map**. Different filters detect different things — edges, corners, textures.',
        },
        { type: 'demo', id: 'convolution', caption: 'Apply real filters. These are exactly the operations inside a CNN.' },
        {
          type: 'callout',
          tone: 'tip',
          md: 'The magic of CNNs: we don’t hand-design these filters. The network **learns** the filter numbers through training — and it discovers edge detectors on its own!',
        },
      ],
      quiz: [
        {
          kind: 'mcq',
          q: 'A convolution filter is…',
          options: ['A small grid of numbers slid across the image', 'A colour setting', 'A type of loss', 'A camera lens'],
          answer: 0,
          explain: 'Kernels are small weight matrices applied at every position.',
        },
        {
          kind: 'mcq',
          q: 'The output of applying a filter is called…',
          options: ['A label', 'A feature map', 'A token', 'A batch'],
          answer: 1,
          explain: 'Each filter produces a feature map highlighting where its pattern appears.',
        },
        {
          kind: 'tf',
          q: 'In a CNN, engineers must manually design every filter.',
          answer: false,
          explain: 'Filter values are learned during training.',
        },
        {
          kind: 'mcq',
          q: 'Early layers of a CNN typically detect…',
          options: ['Whole faces', 'Edges and simple textures', 'Text captions', 'Sounds'],
          answer: 1,
          explain: 'Simple patterns first, complex objects in deeper layers.',
        },
      ],
    },
    {
      id: 'cnn',
      title: 'Convolutional Neural Networks',
      summary: 'Stacking filters: from edges to eyes to faces.',
      minutes: 7,
      blocks: [
        {
          type: 'text',
          md: 'A **CNN** stacks many convolution layers, with **pooling** layers in between that shrink the image (keeping the strongest signals). Each layer builds on the last:',
        },
        { type: 'diagram', id: 'cnn' },
        {
          type: 'keypoints',
          items: [
            'Layer 1: edges and colour blobs',
            'Layer 2–3: textures, corners, simple shapes',
            'Deeper layers: object parts (eyes, wheels, petals)',
            'Final layers: whole objects → **softmax** over classes',
          ],
        },
        {
          type: 'example',
          title: 'ImageNet 2012: the moment everything changed',
          company: 'AlexNet',
          md: 'AlexNet, a CNN trained on two gaming GPUs, cut the ImageNet error rate from ~26% to ~15%. Within a few years CNNs beat human-level accuracy on that benchmark — and the deep learning boom began.',
        },
        {
          type: 'callout',
          tone: 'info',
          md: 'Today **Vision Transformers (ViT)** — the same architecture as LLMs, applied to image patches — compete with or beat CNNs on many tasks. Many modern systems mix both ideas.',
        },
      ],
      quiz: [
        {
          kind: 'mcq',
          q: 'What does a pooling layer do?',
          options: ['Shrinks the feature map, keeping the strongest signals', 'Adds colour', 'Generates text', 'Labels data'],
          answer: 0,
          explain: 'Pooling downsamples, making the network faster and more robust to small shifts.',
        },
        {
          kind: 'order',
          q: 'Order what CNN layers detect, from early to deep:',
          items: ['Edges', 'Textures & shapes', 'Object parts', 'Whole objects'],
          explain: 'Features become more abstract with depth.',
        },
        {
          kind: 'tf',
          q: 'AlexNet (2012) helped launch the deep learning revolution.',
          answer: true,
          explain: 'Its ImageNet win showed deep CNNs on GPUs were a huge leap.',
        },
        {
          kind: 'mcq',
          q: 'Vision Transformers process images as…',
          options: ['A sequence of patches', 'Audio waves', 'A single pixel', 'Decision trees'],
          answer: 0,
          explain: 'ViTs split images into patches and treat them like tokens.',
        },
      ],
    },
    {
      id: 'vision-apps',
      title: 'Vision in the Real World',
      summary: 'Detection, segmentation, OCR — and transfer learning.',
      minutes: 7,
      blocks: [
        {
          type: 'keypoints',
          items: [
            '**Classification** — what is in the image? (“dog”)',
            '**Object detection** — what and *where*? Boxes around every car and person. (YOLO, used in self-driving and retail.)',
            '**Segmentation** — which exact pixels belong to each object? (medical scans, photo background removal)',
            '**OCR** — reading text in images (receipts, licence plates, Google Lens).',
            '**Face recognition** — matching face embeddings (phone unlock, airport gates).',
          ],
        },
        {
          type: 'example',
          title: 'Medical imaging',
          company: 'Radiology',
          md: 'Vision models flag possible tumours in X-rays and scans, helping radiologists prioritise urgent cases. They assist — final diagnosis stays with doctors.',
        },
        {
          type: 'text',
          md: '**Transfer learning** is the secret to building vision products fast: start from a model pre-trained on millions of images, and fine-tune only the last layer on *your* few hundred images.',
        },
        {
          type: 'code',
          lang: 'python',
          code: 'import torchvision, torch.nn as nn\n\nmodel = torchvision.models.resnet18(weights="DEFAULT")  # pre-trained on ImageNet\nfor p in model.parameters():\n    p.requires_grad = False                             # freeze what it already knows\nmodel.fc = nn.Linear(model.fc.in_features, 3)            # new head: e.g. 3 product types\n# ...train only model.fc on your small dataset',
        },
      ],
      quiz: [
        {
          kind: 'mcq',
          q: 'Drawing boxes around every pedestrian in a frame is…',
          options: ['Classification', 'Object detection', 'Clustering', 'Tokenization'],
          answer: 1,
          explain: 'Detection = what + where (bounding boxes).',
        },
        {
          kind: 'mcq',
          q: 'Removing a photo background pixel-by-pixel uses…',
          options: ['Segmentation', 'Regression', 'OCR', 'RLHF'],
          answer: 0,
          explain: 'Segmentation labels each pixel.',
        },
        {
          kind: 'tf',
          q: 'Transfer learning lets you build a good image model with a small dataset.',
          answer: true,
          explain: 'You reuse features learned from millions of images.',
        },
        {
          kind: 'mcq',
          q: 'Reading text from a photo of a receipt is…',
          options: ['OCR', 'Clustering', 'Diffusion', 'Recommendation'],
          answer: 0,
          explain: 'Optical Character Recognition.',
        },
      ],
    },
  ],
};
