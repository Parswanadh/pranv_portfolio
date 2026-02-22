import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Download, FileText, MapPin, Mail, Phone, GraduationCap } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Resume | Amara Pranav',
  description: 'Professional resume of Amara Pranav - AI & Data Science Engineer. Download my CV to explore my education, skills, and project experience.',
  keywords: [
    'resume', 'CV', 'curriculum vitae', 'Amara Pranav',
    'AI engineer', 'machine learning', 'deep learning',
    'data science', 'skills', 'education', 'experience'
  ],
  openGraph: {
    title: 'Resume | Amara Pranav',
    description: 'Professional resume of Amara Pranav - AI & Data Science Engineer',
    type: 'website',
    url: 'https://yourdomain.com/resume',
  },
  twitter: {
    title: 'Resume | Amara Pranav',
    description: 'Professional resume of Amara Pranav - AI & Data Science Engineer',
  },
  other: {
    'twitter:description': 'Professional resume of Amara Pranav - AI & Data Science Engineer'
  }
}

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <main className="relative z-10 pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-accent-primary" />
                <h1 className="font-mono text-4xl font-bold text-text-primary">
                  /resume
                </h1>
              </div>
              <p className="font-serif text-lg text-text-secondary">
                A summary of my education, projects, and skills.
              </p>
            </div>
            <Link
              href="/contact"
              className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-bg-primary font-mono text-sm rounded hover:opacity-90 transition-opacity"
            >
              <Mail className="w-4 h-4" />
              Contact for Resume
            </Link>
          </div>

          {/* Resume Content */}
          <div className="bg-bg-secondary border border-border-default rounded-lg p-8 md:p-12 font-serif">
            {/* Header */}
            <div className="text-center mb-12 border-b border-border-default pb-8">
              <h2 className="text-3xl font-bold text-text-primary mb-2">
                Amara Pranav
              </h2>
              <p className="text-lg text-accent-primary mb-4">
                B.Tech in AI and Data Science × Machine Learning × Deep Learning
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-sm text-text-secondary">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Bangalore, India
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" /> +91 83174 93825
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" /> prnvamara@gmail.com
                </span>
              </div>
            </div>

            {/* Summary */}
            <section className="mb-10">
              <h3 className="font-mono text-lg font-bold text-text-primary mb-4 pb-2 border-b border-border-default">
                PROFESSIONAL SUMMARY
              </h3>
              <p className="text-text-secondary leading-relaxed">
                Passionate B.Tech student in AI and Data Science with a strong foundation in Machine Learning
                and Deep Learning. Specialized in building intelligent systems and data-driven solutions that
                solve real-world problems. Experienced in developing ML models, neural networks, and
                data pipelines with a focus on practical applications. Committed to continuous learning and
                staying updated with the latest advancements in AI/ML technologies.
              </p>
            </section>

            {/* Education */}
            <section className="mb-10">
              <h3 className="font-mono text-lg font-bold text-text-primary mb-4 pb-2 border-b border-border-default">
                EDUCATION
              </h3>
              <div className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-bold text-text-primary">Bachelor of Technology (B.Tech)</h4>
                    <p className="text-accent-primary">AI and Data Science</p>
                    <p className="text-sm text-text-tertiary">Bangalore, India</p>
                    <p className="text-sm text-text-tertiary">CGPA: 8.69</p>
                  </div>
                  <span className="font-mono text-sm text-text-tertiary">2022 — Present</span>
                </div>
              </div>
            </section>

            {/* Projects */}
            <section className="mb-10">
              <h3 className="font-mono text-lg font-bold text-text-primary mb-4 pb-2 border-b border-border-default">
                PROJECTS
              </h3>

              <div className="mb-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-text-primary">Deep Learning Image Classification System</h4>
                    <p className="text-sm text-text-tertiary">2024</p>
                  </div>
                </div>
                <ul className="mt-3 space-y-1 text-text-secondary text-sm">
                  <li>• Developed a CNN-based image classification model using TensorFlow and Keras</li>
                  <li>• Achieved 95% accuracy on multi-class dataset with data augmentation techniques</li>
                  <li>• Implemented transfer learning using pre-trained models (ResNet, VGG16)</li>
                </ul>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-text-primary">Predictive Analytics Dashboard</h4>
                    <p className="text-sm text-text-tertiary">2024</p>
                  </div>
                </div>
                <ul className="mt-3 space-y-1 text-text-secondary text-sm">
                  <li>• Built an end-to-end predictive model using scikit-learn and pandas</li>
                  <li>• Created interactive visualizations using Plotly and Streamlit</li>
                  <li>• Deployed ML pipeline for real-time data analysis and forecasting</li>
                </ul>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-text-primary">Natural Language Processing Chatbot</h4>
                    <p className="text-sm text-text-tertiary">2023 – 2024</p>
                  </div>
                </div>
                <ul className="mt-3 space-y-1 text-text-secondary text-sm">
                  <li>• Developed an intelligent chatbot using NLP techniques and transformer models</li>
                  <li>• Implemented intent recognition and entity extraction using spaCy</li>
                  <li>• Integrated with messaging platforms for seamless user interaction</li>
                </ul>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-text-primary">Time Series Forecasting Model</h4>
                    <p className="text-sm text-text-tertiary">2023</p>
                  </div>
                </div>
                <ul className="mt-3 space-y-1 text-text-secondary text-sm">
                  <li>• Built ARIMA and LSTM models for time series prediction</li>
                  <li>• Analyzed historical data to forecast trends with 90% accuracy</li>
                  <li>• Automated data preprocessing and feature engineering pipeline</li>
                </ul>
              </div>

              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-text-primary">Recommendation Engine</h4>
                    <p className="text-sm text-text-tertiary">2023</p>
                  </div>
                </div>
                <ul className="mt-3 space-y-1 text-text-secondary text-sm">
                  <li>• Implemented collaborative filtering and content-based recommendation algorithms</li>
                  <li>• Built a hybrid model combining multiple recommendation strategies</li>
                  <li>• Optimized for scalability and real-time performance</li>
                </ul>
              </div>
            </section>

            {/* Skills */}
            <section className="mb-10">
              <h3 className="font-mono text-lg font-bold text-text-primary mb-4 pb-2 border-b border-border-default">
                TECHNICAL SKILLS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-text-secondary">
                <div>
                  <span className="font-bold text-text-primary">Programming Languages:</span> Python,
                  Java, C++, SQL
                </div>
                <div>
                  <span className="font-bold text-text-primary">Machine Learning:</span> scikit-learn,
                  TensorFlow, PyTorch, Keras
                </div>
                <div>
                  <span className="font-bold text-text-primary">Deep Learning:</span> CNNs, RNNs, LSTMs,
                  Transfer Learning, Neural Networks
                </div>
                <div>
                  <span className="font-bold text-text-primary">Data Science:</span> pandas, NumPy,
                  Matplotlib, Seaborn, Plotly
                </div>
                <div>
                  <span className="font-bold text-text-primary">NLP:</span> NLTK, spaCy, Transformers,
                  Text Processing, Sentiment Analysis
                </div>
                <div>
                  <span className="font-bold text-text-primary">Tools & Platforms:</span> Git, Docker,
                  Jupyter, Colab, VS Code
                </div>
                <div>
                  <span className="font-bold text-text-primary">Databases:</span> MySQL, MongoDB,
                  PostgreSQL
                </div>
                <div>
                  <span className="font-bold text-text-primary">Web Technologies:</span> HTML, CSS,
                  JavaScript, Flask, Streamlit
                </div>
                <div>
                  <span className="font-bold text-text-primary">Soft Skills:</span> Problem-solving,
                  Team Collaboration, Communication, Quick Learning
                </div>
              </div>
            </section>

            {/* Previous Education */}
            <section>
              <h3 className="font-mono text-lg font-bold text-text-primary mb-4 pb-2 border-b border-border-default">
                PREVIOUS EDUCATION
              </h3>
              <div className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-bold text-text-primary">Higher Secondary Education (Class XII)</h4>
                    <p className="text-accent-primary">Science Stream with Computer Science</p>
                    <p className="text-sm text-text-tertiary">Bangalore, India</p>
                  </div>
                  <span className="font-mono text-sm text-text-tertiary">2022</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-bold text-text-primary">Secondary Education (Class X)</h4>
                    <p className="text-accent-primary">Bangalore, India</p>
                  </div>
                  <span className="font-mono text-sm text-text-tertiary">2020</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
