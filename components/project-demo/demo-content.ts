import type { DemoContent } from './types'
import { Leaf, TrendingUp, Navigation, Eye, Cloud } from 'lucide-react'

export const DEMO_CONTENT: Record<string, DemoContent> = {
  'krishi-setu': {
    title: 'Krishi Setu',
    icon: Leaf,
    description: 'Farmers Service Platform with ML-based crop price prediction',
    codeSnippets: [
      {
        language: 'python',
        title: 'Price Prediction Model',
        code: `import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split

# Load historical crop price data
data = pd.read_csv('crop_prices.csv')

# Feature engineering
features = ['crop_type', 'season', 'rainfall', 'temperature', 'demand_index']
X = data[features]
y = data['price']

# Train prediction model
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model = RandomForestRegressor(n_estimators=100)
model.fit(X_train, y_train)

# Predict future prices
future_prices = model.predict(future_data)`
      }
    ]
  },

  'ipo-insights': {
    title: 'IPO Insights',
    icon: TrendingUp,
    description: 'Big Data Analytics Application for IPO analysis',
    codeSnippets: [
      {
        language: 'python',
        title: 'Spark Data Processing Pipeline',
        code: `from pyspark.sql import SparkSession
from pyspark.sql.functions import col, avg, when

# Initialize Spark session
spark = SparkSession.builder \\
    .appName("IPO Analytics") \\
    .getOrCreate()

# Load IPO data
ipo_data = spark.read.csv("s3://ipo-data/*.csv", header=True, inferSchema=True)

# Calculate sector-wise performance
sector_analysis = ipo_data.groupBy("sector") \\
    .agg(
        avg("listing_gain").alias("avg_gain"),
        avg("market_cap").alias("avg_market_cap")
    ) \\
    .orderBy(col("avg_gain").desc())

# Identify high-performing sectors
sector_analysis.show()`
      }
    ]
  },

  'assistive-navigation': {
    title: 'Assistive Navigation',
    icon: Navigation,
    description: 'Real-time obstacle detection for visually impaired',
    codeSnippets: [
      {
        language: 'python',
        title: 'YOLOv8 Object Detection',
        code: `from ultralytics import YOLO
import numpy as np

# Load YOLOv8 model
model = YOLO('yolov8n.pt')

# Real-time obstacle detection
def detect_obstacles(frame, depth_map):
    results = model(frame, verbose=False)

    obstacles = []
    for result in results:
        for box in result.boxes:
            # Get object class and confidence
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])

            # Calculate distance from depth map
            x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
            center_x, center_y = int((x1 + x2) / 2), int((y1 + y2) / 2)
            distance = depth_map[center_y, center_x]

            obstacles.append({
                'class': model.names[cls_id],
                'confidence': conf,
                'distance': distance
            })

    return obstacles`
      }
    ]
  },

  'distraction-monitoring': {
    title: 'Distraction Monitoring',
    icon: Eye,
    description: 'Vision-based monitoring system with head pose tracking',
    codeSnippets: [
      {
        language: 'python',
        title: 'Head Pose Estimation',
        code: `import cv2
import numpy as np

def estimate_head_pose(landmarks):
    """Estimate head pose from facial landmarks"""
    # 3D model points
    model_points = np.array([
        (0.0, 0.0, 0.0),             # Nose tip
        (0.0, -330.0, -65.0),        # Chin
        (-225.0, 170.0, -135.0),     # Left eye left corner
        (225.0, 170.0, -135.0)       # Right eye right corner
    ])

    # 2D image points from landmarks
    image_points = np.array([
        landmarks[30],    # Nose tip
        landmarks[8],     # Chin
        landmarks[36],    # Left eye
        landmarks[45]     # Right eye
    ], dtype="double")

    # Camera parameters
    focal_length = 1000
    center = (640 / 2, 480 / 2)
    camera_matrix = np.array([
        [focal_length, 0, center[0]],
        [0, focal_length, center[1]],
        [0, 0, 1]
    ], dtype="double")

    # Solve PnP to get rotation and translation vectors
    success, rotation_vector, translation_vector = cv2.solvePnP(
        model_points,
        image_points,
        camera_matrix,
        None
    )

    return rotation_vector, translation_vector`
      }
    ]
  },

  'llm-aws-deployment': {
    title: 'LLM AWS Deployment',
    icon: Cloud,
    description: 'Cloud deployment with hybrid parallelism',
    codeSnippets: [
      {
        language: 'python',
        title: 'Hybrid OpenMP+MPI Parallelism',
        code: `from mpi4py import MPI
import torch
import numpy as np

# Initialize MPI
comm = MPI.COMM_WORLD
rank = comm.Get_rank()
size = comm.Get_size()

# Configure OpenMP threads per process
import os
os.environ['OMP_NUM_THREADS'] = '4'

# Load model shard on each process
device = torch.device(f'cuda:{rank}' if torch.cuda.is_available() else 'cpu')
model_shard = load_model_shard(rank, total_shards=size).to(device)

# Distributed inference
def parallel_inference(input_tokens):
    # Split input across processes
    chunk_size = len(input_tokens) // size
    local_tokens = input_tokens[rank * chunk_size : (rank + 1) * chunk_size]

    # Local computation with OpenMP parallelism
    with torch.inference_mode():
        local_output = model_shard(local_tokens)

    # Gather results using MPI
    all_outputs = comm.allgather(local_output)
    return torch.cat(all_outputs, dim=0)`
      }
    ]
  },
}
