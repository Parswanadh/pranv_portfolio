/**
 * Demo Content Data
 *
 * Centralized data for all project demos.
 * Extracted from ProjectDemo component for better maintainability and reduced bundle size.
 */

import type { ProjectId, DemoType, CodeSnippet } from '@/components/ProjectDemo'

export interface DemoContent {
  title: string
  icon: string
  description: string
  codeSnippets: CodeSnippet[]
}

export const DEMO_CONTENT: Record<ProjectId, DemoContent> = {
  'whisper-stt': {
    title: 'WhisperSTT',
    icon: 'Mic',
    description: 'Real-time speech-to-text with OpenAI Whisper',
    codeSnippets: [
      {
        language: 'python',
        title: 'Audio Processing Pipeline',
        code: `import whisper
import torch

model = whisper.load_model("base")
audio = whisper.load_audio("input.wav")

# Transcribe with timestamps
result = model.transcribe(
    audio,
    language="en",
    word_timestamps=True
)

# Output: {"text": "...", "segments": [...]}`
      }
    ]
  },

  'cli-tour': {
    title: 'CLI-Tour',
    icon: 'Terminal',
    description: 'Interactive command-line tutorial system',
    codeSnippets: [
      {
        language: 'typescript',
        title: 'Command Parser',
        code: `class CommandParser {
  private commands: Map<string, Command>

  register(cmd: Command) {
    this.commands.set(cmd.name, cmd)
  }

  async execute(input: string) {
    const [name, ...args] = input.split(' ')
    const cmd = this.commands.get(name)
    return cmd?.execute(args)
  }
}`
      }
    ]
  },

  'pro-code': {
    title: 'PRO_CODE',
    icon: 'Terminal',
    description: 'Local AI coding assistant with persistent memory',
    codeSnippets: [
      {
        language: 'python',
        title: 'Ollama Integration',
        code: `import ollama
from rich.console import Console
from rich.markdown import Markdown

# Stream responses from local LLM
console = Console()

def chat_with_codebase(prompt: str, context: list):
    response = ollama.chat(
        model='codellama:13b',
        messages=[
            {'role': 'system', 'content': 'You are a helpful coding assistant.'},
            *context,
            {'role': 'user', 'content': prompt}
        ],
        stream=True
    )

    for chunk in response:
        if chunk['message']['content']:
            console.print(Markdown(chunk['message']['content']), end='')`
      },
      {
        language: 'python',
        title: 'ChromaDB Vector Search',
        code: `import chromadb
from sentence_transformers import SentenceTransformer

# Initialize local vector database
client = chromadb.PersistentClient(path="./memory")
collection = client.get_or_create_collection("code_context")

# Semantic search with embeddings
embedder = SentenceTransformer('all-MiniLM-L6-v2')

def search_context(query: str, n_results: int = 3):
    query_embedding = embedder.encode(query).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results
    )

    return results['documents'][0]`
      }
    ]
  },

  'auto-git-publisher': {
    title: 'AUTO-GIT Publisher',
    icon: 'Rocket',
    description: '12-agent system transforming research papers into code',
    codeSnippets: [
      {
        language: 'python',
        title: 'LangGraph Agent Pipeline',
        code: `from langgraph.graph import StateGraph
from typing import TypedDict

class PaperState(TypedDict):
    arxiv_id: str
    pdf_content: str
    architecture: dict
    generated_code: str
    repo_url: str

# Build 4-tier agent pipeline
workflow = StateGraph(PaperState)

# TIER 1: Discovery Agents
workflow.add_node("paper_scout", discover_paper)
workflow.add_node("novelty_classifier", check_novelty)
workflow.add_node("priority_router", route_to_tier2)

# TIER 2: Analysis Agents
workflow.add_node("pdf_extractor", extract_pdf)
workflow.add_node("architecture_parser", parse_architecture)
workflow.add_node("dependency_analyzer", analyze_deps)

# Compile and execute
app = workflow.compile()
result = app.invoke({"arxiv_id": "2301.07041"})`
      }
    ]
  },

  'multimodal-adapter': {
    title: 'Multimodal Adapter Research',
    icon: 'Image',
    description: 'LLM + Vision integration research with adapter layers',
    codeSnippets: [
      {
        language: 'python',
        title: 'Vision Adapter Architecture',
        code: `class VisionLanguageAdapter(nn.Module):
    """Connects vision encoder to language model"""
    def __init__(self, vision_dim: int = 768, llm_dim: int = 2048):
        super().__init__()
        self.projection = nn.Sequential(
            nn.Linear(vision_dim, llm_dim * 2),
            nn.GELU(),
            nn.Dropout(0.1),
            nn.Linear(llm_dim * 2, llm_dim),
            nn.LayerNorm(llm_dim)
        )

    def forward(self, vision_features):
        # Project to LLM embedding space
        return self.projection(vision_features)`
      }
    ]
  },

  'raspberry-pi-vision': {
    title: 'Raspberry Pi Vision',
    icon: 'Box',
    description: 'Edge-based object detection',
    codeSnippets: [
      {
        language: 'python',
        title: 'YOLO Inference',
        code: `import cv2
import numpy as np

net = cv2.dnn.readNet("yolo.weights")
blob = cv2.dnn.blobFromImage(frame, 1/255, (416, 416))
net.setInput(blob)

outs = net.forward()
# Parse detections & draw boxes`
      }
    ]
  },

  'ai-robotic-arm': {
    title: 'AI Robotic Hand',
    icon: 'Hand',
    description: 'ML-powered robotic classification',
    codeSnippets: [
      {
        language: 'python',
        title: 'Hand Controller',
        code: `class RoboticHand:
  def classify(self, sensor_data):
    features = self.extract_features(sensor_data)
    prediction = self.model.predict(features)
    return {
      'class': prediction,
      'confidence': self.model.score
    }`
      }
    ]
  },

  'spinlaunch-prototype': {
    title: 'SpinLaunch',
    icon: 'Rocket',
    description: 'Kinetic launch simulation',
    codeSnippets: [
      {
        language: 'python',
        title: 'Physics Engine',
        code: `class Projectile:
  def __init__(self, velocity, angle):
    self.vx = velocity * cos(angle)
    self.vy = velocity * sin(angle)

  def update(self, dt):
    # Apply gravity & air resistance
    self.vy -= 9.81 * dt
    self.vy *= 0.99  # Drag
    return self.position`
      }
    ]
  },

  'gpt-oss-vision': {
    title: 'GPT-OSS Vision',
    icon: 'Eye',
    description: 'First Q-Former integration with GPT-OSS for satellite imagery analysis',
    codeSnippets: [
      {
        language: 'python',
        title: 'Q-Former Architecture',
        code: `class QFormerLayer(nn.Module):
    """Compress visual features into query embeddings for GPT-OSS"""
    def __init__(self, num_queries: int = 32, hidden_dim: int = 768):
        super().__init__()
        self.query_embed = nn.Embedding(num_queries, hidden_dim)
        self.cross_attention = nn.MultiheadAttention(hidden_dim, num_heads=8)
        self.output_norm = nn.LayerNorm(hidden_dim)

    def forward(self, visual_features):
        # Learnable query embeddings
        batch_size = visual_features.size(0)
        queries = self.query_embed.weight.unsqueeze(0).repeat(batch_size, 1, 1)

        # Cross-attention: queries attend to visual features
        attn_output, _ = self.cross_attention(
            queries.transpose(0, 1),
            visual_features.transpose(0, 1),
            visual_features.transpose(0, 1)
        )

        return self.output_norm(attn_output.transpose(0, 1))`
      }
    ]
  },

  'parshu-stt': {
    title: 'Parshu-STT',
    icon: 'Mic',
    description: 'Real-time voice transcription with global hotkey and auto-paste',
    codeSnippets: [
      {
        language: 'python',
        title: 'Audio Capture with FFmpeg',
        code: `import subprocess
import numpy as np

class AudioRecorder:
    def record(self, duration: int = 5) -> np.ndarray:
        cmd = [
            'ffmpeg',
            '-f', 'dshow',
            '-i', 'audio=Microphone',
            '-t', str(duration),
            '-f', 's16le',
            '-acodec', 'pcm_s16le',
            '-ar', '16000',
            '-ac', '1',
            'pipe:1'
        ]

        result = subprocess.run(cmd, capture_output=True)
        audio_data = np.frombuffer(result.stdout, dtype=np.int16)
        return audio_data.astype(np.float32) / 32768.0`
      }
    ]
  }
}

export const DEMO_TYPE_ICONS: Record<string, string> = {
  Mic: 'lucide://mic',
  Terminal: 'lucide://terminal',
  Image: 'lucide://image',
  Box: 'lucide://box',
  Hand: 'lucide://hand',
  Rocket: 'lucide://rocket',
  Eye: 'lucide://eye',
}
