export interface Project {
  slug: string
  title: string
  description: string
  longDescription?: string
  howItWorks?: string
  keyFeatures?: string[]
  category: string
  status: string
  techStack: string[]
  year: string
  period: string
}

export const projects: Project[] = [
  {
    slug: 'krishi-setu',
    title: 'Krishi Setu – Farmers Service Platform',
    description: 'Flask + MongoDB platform with ML-based crop price prediction for farmers.',
    longDescription: 'Krishi Setu (Farmers Bridge) is a comprehensive platform designed to empower farmers with data-driven insights and market intelligence. The system combines machine learning-based crop price prediction with a user-friendly interface to help farmers make informed decisions about planting, harvesting, and selling their crops.\n\nThe ML models analyze historical price data, weather patterns, seasonal trends, and market demand to predict future crop prices with accuracy. Farmers can access price forecasts, market trends, and connect directly with buyers through the platform.\n\nBuilt with Flask for the backend and MongoDB for data storage, the platform provides real-time recommendations and personalized insights based on crop type, location, and season. The TensorFlow and Scikit-learn models power the prediction engine, processing thousands of data points to generate actionable forecasts.',
    howItWorks: '1. Data Collection: Historical crop prices, weather data, and market trends collected from various sources.\n\n2. Feature Engineering: Extract relevant features including seasonal patterns, weather variables, and market indicators.\n\n3. Model Training: TensorFlow and Scikit-learn models trained on historical data to learn price patterns.\n\n4. Price Prediction: Models generate forecasts for different crops based on current market conditions.\n\n5. User Interface: Farmers access predictions and recommendations through Flask web interface.\n\n6. Database: MongoDB stores user profiles, historical data, and prediction results.\n\n7. Buyer Connection: Platform connects farmers with potential buyers for direct transactions.',
    keyFeatures: [
      'ML Price Prediction: Advanced models predict future crop prices using historical data',
      'Market Insights: Real-time market trends and demand analysis',
      'Weather Integration: Weather patterns factored into price predictions',
      'Direct Buyer Connection: Farmers can connect directly with buyers',
      'User Profiles: Personalized recommendations based on crop type and location',
      'Responsive Design: Mobile-friendly interface accessible in rural areas'
    ],
    category: 'Web Development',
    status: 'Completed',
    techStack: ['Flask', 'MongoDB', 'TensorFlow', 'Scikit-learn'],
    year: '2024',
    period: '2024',
  },
  {
    slug: 'ipo-insights',
    title: 'IPO Insights – Big Data Analytics Application',
    description: 'Apache Spark + MongoDB + Streamlit platform for comprehensive IPO analysis.',
    longDescription: 'IPO Insights is a big data analytics application designed to analyze Initial Public Offering (IPO) data at scale. The platform processes massive datasets containing historical IPO performance, company financials, market conditions, and post-IPO stock trends to generate actionable insights for investors.\n\nLeveraging Apache Spark for distributed data processing, the system can analyze thousands of IPO records and millions of related data points efficiently. MongoDB provides flexible storage for structured and unstructured IPO data, while Streamlit creates an interactive interface for visualizing complex trends and patterns.\n\nInvestors can explore IPO performance by sector, market conditions, company size, and timing. The platform identifies patterns in underpricing, long-term performance, and market sentiment to help make data-driven investment decisions.',
    howItWorks: '1. Data Ingestion: IPO data collected from multiple sources including SEC filings and market data providers.\n\n2. Spark Processing: Apache Spark clusters process massive datasets in parallel for analysis.\n\n3. Feature Extraction: Extract key features like company size, sector, market conditions, and financial metrics.\n\n4. Analytics Pipeline: Spark jobs calculate aggregations, correlations, and statistical patterns.\n\n5. Data Storage: Processed data and results stored in MongoDB for fast retrieval.\n\n6. Visualization: Streamlit dashboard presents insights through interactive charts and graphs.\n\n7. Query Interface: Users can filter, explore, and analyze IPO data based on various criteria.',
    keyFeatures: [
      'Big Data Processing: Apache Spark handles massive IPO datasets efficiently',
      'Interactive Dashboard: Streamlit provides intuitive visualization of complex data',
      'Historical Analysis: Analyze IPO performance trends over years',
      'Sector Comparison: Compare IPO performance across different industry sectors',
      'Market Insights: Identify patterns in IPO pricing and long-term performance',
      'Scalable Architecture: Distributed processing enables handling growing datasets'
    ],
    category: 'Data Science',
    status: 'Completed',
    techStack: ['Apache Spark', 'MongoDB', 'Streamlit'],
    year: '2024',
    period: '2024',
  },
  {
    slug: 'assistive-navigation',
    title: 'Assistive Navigation System using RealSense, YOLOv8, and ROS2',
    description: 'Real-time obstacle detection system for visually impaired using depth sensing and AI.',
    longDescription: 'The Assistive Navigation System is a robotics project designed to help visually impaired individuals navigate safely through indoor and outdoor environments. The system combines Intel RealSense depth cameras with YOLOv8 object detection and ROS2 (Robot Operating System 2) to create a comprehensive navigation assistant.\n\nUsing RTAB (Real-Time Appearance-Based) mapping and SLAM (Simultaneous Localization and Mapping), the system builds 3D maps of the environment while tracking the user position in real-time. YOLOv8 identifies obstacles, hazards, and objects of interest, while the RealSense camera provides accurate depth measurements for distance estimation.\n\nThe system provides audio feedback through bone conduction headphones, warning users of obstacles and guiding them along safe paths. ROS2 enables modular architecture, making it easy to integrate additional sensors and functionality.',
    howItWorks: '1. Depth Sensing: Intel RealSense camera captures RGB-D data (color + depth information).\n\n2. Object Detection: YOLOv8 processes camera feed in real-time to detect obstacles, hazards, and objects.\n\n3. Distance Estimation: Depth data provides accurate distance measurements to detected objects.\n\n4. SLAM: RTAB-SLAM builds 3D map of environment and tracks user position.\n\n5. Path Planning: ROS2 navigation stack plans safe paths around detected obstacles.\n\n6. Audio Feedback: Bone conduction headphones provide spatial audio warnings and guidance.\n\n7. Localization: System maintains user position within mapped environment.\n\n8. Obstacle Avoidance: Real-time alerts for immediate hazards in navigation path.',
    keyFeatures: [
      'Real-Time Detection: YOLOv8 identifies obstacles at 30+ FPS for immediate response',
      'Depth Sensing: RealSense provides accurate distance measurements for spatial awareness',
      '3D Mapping: RTAB-SLAM builds and updates environment maps in real-time',
      'Audio Guidance: Spatial audio feedback for intuitive navigation assistance',
      'Modular Architecture: ROS2 enables easy integration of additional sensors',
      'Indoor/Outdoor: Works in various environments with automatic mode switching'
    ],
    category: 'Robotics',
    status: 'Completed',
    techStack: ['RealSense', 'YOLOv8', 'ROS2', 'RTAB-SLAM'],
    year: '2024',
    period: '2024',
  },
  {
    slug: 'distraction-monitoring',
    title: 'Vision-Based Distraction Monitoring System',
    description: 'Edge-based monitoring system with head pose and eye-state tracking for safety.',
    longDescription: 'The Vision-Based Distraction Monitoring System is a computer vision application designed to detect and alert users of distraction or fatigue in real-time. Using edge-based processing, the system tracks head pose, eye state, and facial landmarks to determine attention levels without requiring cloud connectivity.\n\nThe system uses advanced computer vision algorithms to estimate head orientation, detect eye openness/closure, track gaze direction, and identify signs of drowsiness or distraction. Multithreading ensures smooth performance even when running on resource-constrained edge devices.\n\nPotential applications include driver safety systems, workplace monitoring, educational settings, and fatigue detection for heavy machinery operators. The lightweight architecture enables deployment on various edge devices without requiring powerful hardware.',
    howItWorks: '1. Video Capture: Camera feed captured in real-time from webcam or video source.\n\n2. Face Detection: OpenCV detects face and extracts facial landmarks (68 points).\n\n3. Head Pose Estimation: Calculate head rotation (pitch, yaw, roll) from landmark positions.\n\n4. Eye State Analysis: Detect eye openness, closure, and blink frequency.\n\n5. Gaze Tracking: Estimate direction of gaze based on eye and head orientation.\n\n6. Distraction Detection: Analyze patterns to determine if user is distracted or drowsy.\n\n7. Alert Generation: Trigger visual/audible alerts when distraction thresholds exceeded.\n\n8. Logging: Record events and metrics for analysis and improvement.',
    keyFeatures: [
      'Real-Time Tracking: Monitors head pose and eye state at 30+ FPS',
      'Edge-Based Processing: Runs locally without cloud dependency for privacy',
      'Multithreaded Architecture: Efficient use of CPU resources for smooth performance',
      'Lightweight: Optimized to run on resource-constrained edge devices',
      'Multiple Metrics: Tracks head pose, eye state, blink rate, and gaze direction',
      'Configurable Alerts: Customizable thresholds for distraction and fatigue detection'
    ],
    category: 'Computer Vision',
    status: 'Completed',
    techStack: ['OpenCV', 'Python', 'Multithreading'],
    year: '2024',
    period: '2024',
  },
  {
    slug: 'llm-aws-deployment',
    title: 'LLM Deployment on AWS EC2',
    description: 'Deployed Large Language Model using OpenMP+MPI parallelism for distributed inference.',
    longDescription: 'This project involved deploying a Large Language Model (LLM) on AWS EC2 instances using advanced parallelization techniques. The deployment leverages OpenMP (Open Multi-Processing) for shared-memory parallelism within a single instance and MPI (Message Passing Interface) for distributed computing across multiple EC2 instances.\n\nThe system demonstrates high-performance computing techniques applied to AI inference, enabling efficient scaling of LLMs across cloud infrastructure. By combining both parallelism approaches, the deployment achieves optimal resource utilization and reduced inference latency compared to single-threaded or single-node approaches.\n\nThe deployment pipeline includes model optimization, environment configuration, distributed setup, and monitoring. This hands-on experience with cloud infrastructure and parallel computing provided valuable insights into production LLM deployment at scale.',
    howItWorks: '1. EC2 Provisioning: Launch multiple EC2 instances with appropriate compute and memory configurations.\n\n2. Environment Setup: Install required dependencies (Python, MPI libraries, deep learning frameworks).\n\n3. Model Optimization: Optimize LLM for distributed inference (model sharding, quantization).\n\n4. OpenMP Configuration: Configure thread-based parallelism within each instance for multi-core utilization.\n\n5. MPI Setup: Configure MPI for inter-node communication and distributed processing.\n\n6. Load Distribution: Distribute model layers and workload across available instances.\n\n7. Inference Pipeline: Coordinate parallel execution for efficient inference.\n\n8. Monitoring: Track resource utilization, latency, and throughput metrics.',
    keyFeatures: [
      'Hybrid Parallelism: Combines OpenMP (shared memory) and MPI (distributed) for optimal performance',
      'Cloud Infrastructure: Hands-on experience with AWS EC2 deployment and configuration',
      'Scalable Architecture: Can scale across multiple instances for larger models',
      'Resource Optimization: Efficient use of compute resources through parallel processing',
      'Production Deployment: Real-world experience deploying LLMs in cloud environment',
      'Performance Monitoring: Tools for tracking inference latency and resource utilization'
    ],
    category: 'Cloud',
    status: 'Completed',
    techStack: ['AWS EC2', 'Python', 'OpenMP', 'MPI'],
    year: '2024',
    period: '2024',
  },
]
