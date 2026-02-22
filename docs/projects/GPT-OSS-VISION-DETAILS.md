# GPT-OSS Vision: Multimodal AI Pipeline with Q-Former

**Status:** Research Completed (Non-Production)
**Period:** January - February 2025
**Category:** Multimodal AI Research

---

## Project Overview

GPT-OSS Vision was an ambitious research experiment attempting to bridge text-based Large Language Models with visual understanding. The project aimed to enable a 20B parameter text-only LLM (GPT-OSS) to understand and analyze satellite imagery through a novel Q-Former adapter architecture.

While the project did not achieve production-ready results due to significant technical challenges, it represents valuable research in multimodal AI integration and adapter-based learning approaches.

---

## How It Works: The Q-Former Adapter Architecture

### Core Concept

The Q-Former (Query Transformer) serves as a bridge between vision encoders and language models. Instead of training a massive multimodal model from scratch, we use a lightweight adapter to translate visual features into a format the language model can understand.

### Pipeline Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌──────────────────┐
│  Satellite      │───▶│  Remote CLIP    │───▶│  Patch           │
│  Image          │    │  Vision Encoder │    │  Embeddings      │
└─────────────────┘    └─────────────────┘    └──────────────────┘
                                                      │
                                                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌──────────────────┐
│  Analysis       │◀───│  GPT-OSS 20B    │◀───│  Q-Former        │
│  Results        │    │  Language Model │    │  Adapter         │
└─────────────────┘    └─────────────────┘    └──────────────────┘
                                                       ▲
                                                       │
                                                ┌──────────────┐
                                                │ Query Tokens │
                                                │ (32 learned) │
                                                └──────────────┘
```

### Component Breakdown

#### 1. **Vision Encoder (Remote CLIP)**
- **Purpose:** Convert raw satellite images into feature representations
- **Specialization:** Remote sensing CLIP model trained on satellite/aerial imagery
- **Output:** 49 spatial patches with 768-dimensional embeddings each
- **Why Remote CLIP:** Standard vision encoders (like OpenCLIP) struggle with satellite imagery due to domain gap

#### 2. **Q-Former (Query Transformer)**
- **Purpose:** Intelligently compress visual features into a compact representation
- **Input:** 49 patches × 768 dimensions = 37,632 visual features
- **Output:** 32 query tokens × 768 dimensions = 24,576 compressed features
- **Compression Ratio:** ~35% reduction while preserving semantic information
- **Mechanism:** Cross-attention between learnable query tokens and visual patches

**Key Innovation:** Unlike naive pooling/averaging, Q-Former learns which visual features are important through attention mechanisms. Query tokens act as "information extractors" that pull relevant data from patches.

#### 3. **Adapter Layer**
- **Purpose:** Project Q-Former outputs to GPT-OSS's embedding space
- **Transformation:** 768 dimensions → 2048 dimensions (GPT-OSS embedding size)
- **Technique:** Linear projection with LoRA (Low-Rank Adaptation) for efficient fine-tuning
- **Why LoRA:** Freezing full adapter and only training low-rank matrices reduces parameters significantly

#### 4. **GPT-OSS 20B (Frozen)**
- **Purpose:** Generate natural language descriptions and analysis
- **State:** Completely frozen during training (no weight updates)
- **Input:** Projected query tokens as special "visual tokens" in the sequence
- **Limitation:** Cannot learn from visual feedback due to frozen weights

---

## Technical Specifications

### Model Architecture
```
Vision Path:
- Input: 224×224×3 satellite image
- CLIP Encoder: ViT-L/14 (remote sensing variant)
- Patch Features: 49 × 768 dimensions

Compression Path:
- Q-Former: 12-layer transformer with cross-attention
- Query Tokens: 32 learnable embeddings (768-d each)
- Output: 32 × 768 compressed visual tokens

Projection Path:
- Adapter: Linear(768 → 2048)
- LoRA Rank: 8
- LoRA Alpha: 16
- Trainable Params: ~4M (vs ~40M for full adapter)

Language Path:
- GPT-OSS: 20B parameter model (frozen)
- Context Window: 2048 tokens (including visual tokens)
- Output: Natural language captions, VQA answers, classifications
```

### Training Configuration
```python
# Key hyperparameters
learning_rate = 1e-4
batch_size = 4  # Limited by GPU memory
gradient_accumulation = 8
epochs = 100+  # Attempted but failed to converge

# Loss functions
primary_loss = CrossEntropyLoss()  # For caption generation
auxiliary_loss = MSE()  # For query-token alignment
total_loss = primary_loss + 0.1 * auxiliary_loss

# Optimizer
optimizer = AdamW(adapter.parameters(), lr=1e-4, weight_decay=0.01)
scheduler = CosineAnnealingLR(optimizer, T_max=100)
```

### Hardware Requirements
- **GPU:** NVIDIA RTX 3090 (24GB VRAM minimum)
- **RAM:** 64GB+ system memory recommended
- **Storage:** ~100GB for models and datasets
- **Training Time:** ~48 hours for 100 epochs (never converged)

---

## Research Challenges and Failures

This project represents a "valuable failure" - while it didn't achieve production goals, the learnings contribute to understanding multimodal AI limitations.

### Challenge 1: Training Instability
**Problem:** Loss curves showed extreme oscillation, never converging
```
Epoch 1:  Loss = 3.45
Epoch 10: Loss = 3.12  (promising)
Epoch 20: Loss = 3.89  (diverged)
Epoch 30: Loss = 2.98  (unexpected drop)
Epoch 50: Loss = 4.21  (collapsed)
```

**Root Causes:**
- **Learning Rate Mismatch:** Q-Former (from LLaVA 7B) required much lower LR than adapter layer
- **Gradient Explosion:** Large dimensionality jump (768 → 2048) caused unstable gradients
- **Frozen LLM Bottleneck:** GPT-OSS couldn't adapt to visual tokens, creating "representation mismatch"

**Attempted Fixes:**
- Gradient clipping (max_norm=1.0)
- Layer normalization in adapter
- Separate learning rates for Q-Former vs adapter
- Warmup + cosine annealing schedule
- **Result:** None achieved stable convergence

### Challenge 2: Q-Former Convergence Issues
**Problem:** Q-Former weights didn't learn meaningful visual-linguistic alignment

**Diagnosis:**
```python
# Attention pattern analysis (Epoch 50)
# Query token 0 attended to patches: [1,2,3,4,5] (local)
# Query token 1 attended to patches: [2,3,4,5,6] (local)
# Query token 2 attended to patches: [3,4,5,6,7] (local)
# ... all query tokens focused on adjacent patches only
```

**Expected Behavior:** Query tokens should specialize (e.g., one for roads, one for buildings, one for vegetation)

**Actual Behavior:** Tokens learned spatial locality without semantic specialization

**Hypothesis:** Q-Former pretrained weights (from LLaVA) were too specialized for natural images, didn't transfer to satellite domain

### Challenge 3: Domain Overfitting
**Problem:** Model achieved 95% accuracy on training set but 22% on test set

**Analysis:**
- Training data: Diverse satellite imagery from multiple regions
- Test data: Same distribution, different geographic locations
- Overfitting pattern: Model memorized specific spatial patterns rather than learning general features

**Contributing Factors:**
- Small dataset size (~5K images for fine-tuning)
- High model capacity relative to data
- Lack of data augmentation (geometric, color, atmospheric)

### Challenge 4: Memory Leaks on Single GPU
**Problem:** Training crashed around epoch 60 with CUDA OOM errors

**Investigation:**
```python
# Memory profiling
Epoch 1:  GPU Memory = 18.2GB / 24GB
Epoch 30: GPU Memory = 19.1GB / 24GB
Epoch 50: GPU Memory = 21.3GB / 24GB
Epoch 60: GPU Memory = 24.8GB / 24GB  💥 OOM
```

**Root Cause:** Gradient checkpointing wasn't properly implemented for Q-Former cross-attention layers

**Impact:** Couldn't run extended training experiments or try larger batch sizes

### Challenge 5: Frozen LLM Bottleneck
**Problem:** GPT-OSS remained frozen, preventing end-to-end optimization

**Constraint:** 20B model too large to fine-tune (would require 8× A100 GPUs)

**Consequence:** Adapter had to learn perfect projection without LLM feedback

**Insight:** This is fundamental limitation of "adapter-only" approaches for massive LLMs

---

## Why This Research Matters (Despite Failures)

### 1. **Validated Q-Former Architecture**
While our implementation failed, the Q-Former concept itself is proven (used successfully in BLIP-2, InstructBLIP). Our failure highlights implementation complexity rather than architectural flaws.

### 2. **Identified Critical Bottlenecks**
Learnings inform future attempts:
- **Adapter-Only Fine-Tuning Limitations:** For models >10B, frozen LLM may be too restrictive
- **Domain Transfer Challenges:** Vision encoders pretrained on natural images don't transfer well to satellite imagery
- **Training Stability:** Multimodal models require careful LR balancing across components

### 3. **Satellite Imagery Specific Insights**
- Remote sensing CLIP outperforms OpenCLIP by 18% on satellite tasks
- Atmospheric effects (clouds, shadows) significantly impact encoder performance
- Spatial resolution matters more than spectral bands for semantic understanding

### 4. **Open Source Contribution**
All training logs, failure analyses, and intermediate checkpoints are documented for the research community to learn from these mistakes.

---

## Architecture Diagram

### 3D Visualization
The project includes an interactive 3D architecture viewer (`/architecture` page) showing the complete pipeline:

```
           Z (Depth)
           ↑
           │
           │  [Satellite Image]
           │       ↓
           │  [Remote CLIP]
           │       ↓
           │  [Patch Embeddings]
           │       ↓
   ────────┼─────→ [Q-Former] ←── [Query Tokens]
    Y      │        ↓
    └──────┼────→ [Adapter Layer]
           │        ↓
           │  [GPT-OSS 20B]
           │        ↓
           │  [Analysis Results]
           └───────────────→ X (Width)
```

**Color-Coded Components:**
- 🟡 Yellow: Input/Output
- 🟣 Purple: Vision Encoder
- 🔵 Cyan: Feature Extraction
- 🩷 Pink: Compression Layer
- 🔵 Indigo: Learnable Tokens
- 🟠 Orange: Adaptation Layer
- 🟢 Green: Language Model
- 🔴 Red: Training Components

---

## Key Learnings for Future Attempts

### What I Would Do Differently

1. **Start Smaller**
   - Use 7B LLM instead of 20B for end-to-end fine-tuning
   - Prove architecture works at scale before moving to massive models

2. **Domain-Specific Pretraining**
   - Collect larger satellite dataset (50K+ images)
   - Pretrain CLIP encoder from scratch on remote sensing data
   - Use progressive resizing (start with 128×128, scale to 224×224)

3. **Better Training Strategy**
   - Two-stage training: Train Q-Former first, then adapter
   - Use contrastive learning loss alongside generative loss
   - Implement proper gradient checkpointing from day one

4. **Evaluation-Driven Development**
   - Define clear success metrics upfront (e.g., >70% VQA accuracy)
   - Set up automated evaluation pipeline
   - Compare against strong baselines (e.g., separate CLIP + GPT pipeline)

### When to Use This Architecture

**Good Candidates:**
- Small-to-medium LLMs (<7B parameters) that can be unfrozen
- Domains with abundant pretraining data (natural images, medical scans)
- Applications where captioning quality is critical

**Poor Candidates:**
- Massive frozen LLMs (>10B)
- Highly specialized domains with limited data
- Real-time applications (Q-Former adds significant latency)

---

## Technical Stack

### Core Technologies
- **Python 3.11**: Primary programming language
- **PyTorch 2.1**: Deep learning framework
- **Transformers 4.35**: Hugging Face model library
- **Flash Attention 2**: Efficient attention mechanism

### Model Components
- **LLaVA 7B**: Source of Q-Former architecture
- **GPT-OSS 20B**: Open-source language model (frozen)
- **Remote CLIP**: Vision encoder for satellite imagery
- **LoRA**: Efficient adapter fine-tuning

### Training Infrastructure
- **NVIDIA RTX 3090**: Primary training GPU (24GB)
- **Weights & Biases**: Experiment tracking
- **PyTorch Lightning**: Training framework

### Evaluation Tools
- **BLEU/METEOR**: Caption quality metrics
- **VQA Accuracy**: Visual question answering benchmark
- **Custom Satellite Dataset**: ISRO-derived imagery

---

## Project Status and Next Steps

### Current Status: **Archived**
- All code and models preserved for reference
- Documentation complete (this document)
- No active development planned

### Potential Future Directions
If revisiting this research, I would:

1. **Explore Mixture of Experts (MoE)**: Instead of single adapter, use specialized experts for different satellite imagery types

2. **Investigate Cross-Attention Priors**: Add geometric constraints to Q-Former attention (e.g., query tokens for "horizontal features" attend to horizontally-adjacent patches)

3. **Try Projection-Based Approaches**: Instead of Q-Former, use simpler projection layers with contrastive learning

4. **Multi-Modal Pretraining**: Jointly train vision encoder and adapter from scratch on satellite image-text pairs

---

## References and Related Work

### Papers That Inspired This Approach
1. **BLIP-2** (Salesforce Research): Original Q-Former paper
2. **LLaVA** (Wisconsin-Madison): Visual instruction tuning
3. **Flamingo** (DeepMind): Few-shot visual learning

### Open Source Implementations
- [BLIP-2 GitHub](https://github.com/salesforce/BLIP2)
- [LLaVA GitHub](https://github.com/haotian-liu/LLaVA)
- [Remote Sensing CLIP](https://github.com/ Chen0ding/RemoteCLIP)

### Similar Projects
- **GeoChat**: Satellite imagery VQA (successful, uses different approach)
- **SatCLIP**: Contrastive learning for remote sensing
- **Roboflow Satellite Models**: Practical satellite image understanding

---

## Conclusion

GPT-OSS Vision represents an honest research attempt that didn't achieve its goals. The failures are well-documented, analyzed, and shared openly with the AI community. While the project didn't produce a production-ready system, it contributed valuable insights into:

1. The challenges of adapter-based multimodal integration
2. Domain transfer difficulties for satellite imagery
3. Training stability issues in vision-language models
4. Practical limitations of frozen LLM approaches

These learnings directly inform my current work (AUTO-GIT, PRO_CODE) where I prioritize:
- ✅ Smaller, trainable models over massive frozen ones
- ✅ End-to-end optimization over adapter-only approaches
- ✅ Extensive evaluation over theoretical appeal
- ✅ Iterative prototyping over big-bang experiments

**Status:** Research Complete, Lessons Learned, Moving Forward

---

*Document Version: 1.0*
*Last Updated: January 29, 2026*
*Project Lead: Balcha*
*Institution: Amrita Vishwa Vidyapeetham, Bangalore*
