import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { User, MapPin, Mail, GraduationCap, Briefcase, Cpu, Phone } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <main className="relative z-10 pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-baseline gap-3 mb-4">
              <User className="w-8 h-8 text-accent-primary self-center" />
              <h1 className="font-mono text-4xl font-bold text-text-primary">
                /about-me
              </h1>
            </div>
            <p className="font-serif text-2xl text-text-secondary italic mb-4">
              "Passionate about building practical AI solutions that make a difference"
            </p>
            <p className="font-serif text-lg text-text-secondary max-w-2xl">
              B.Tech student in Electronics and Computer Engineering at Amrita Vishwa Vidyapeetham.
              Passionate about Generative AI, embedded systems, and hardware-software co-design.
            </p>
          </div>

          {/* Bio Section */}
          <div className="bg-bg-secondary border border-border-default rounded-lg p-8 mb-8">
            <h2 className="font-mono text-xl font-bold text-text-primary mb-6">
              About Me
            </h2>
            <div className="font-serif text-lg text-text-secondary leading-relaxed space-y-4">
              <p>
                I'm Amara Pranav, a B.Tech student in Electronics and Computer Engineering at Amrita Vishwa
                Vidyapeetham, Bengaluru, specializing in the intersection of Artificial Intelligence and Data Science.
                My focus lies in developing intelligent systems that bridge the gap between cutting-edge research and
                real-world applications, with particular expertise in machine learning, deep learning, and data-driven
                problem solving.
              </p>
              <p>
                My work ranges from locally deployed speech-to-text systems to experimental multimodal
                LLMs. As an active contributor and office bearer of VYOM, the college's space-tech club,
                I blend technical precision with fearless curiosity to transform ideas into working prototypes.
              </p>
              <p>
                I believe in the power of combining hardware and software to create truly intelligent systems
                that can solve real-world problems. Whether it's deploying YOLO on Raspberry Pi for emergency
                vehicle detection or building CLI-based AI assistants, I'm always exploring new ways to push
                the boundaries of what's possible.
              </p>
            </div>
          </div>

          {/* Quick Facts */}
          <div className="mb-8">
            <h2 className="font-mono text-xl font-bold text-text-primary mb-6">
              Quick Facts
            </h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-bg-secondary border border-border-default rounded-lg p-4">
                <dt className="font-mono text-xs text-text-tertiary mb-1">Location</dt>
                <dd className="flex items-center gap-2 text-text-primary">
                  <span className="mr-1">📍</span>
                  Bangalore, India
                </dd>
              </div>
              <div className="bg-bg-secondary border border-border-default rounded-lg p-4">
                <dt className="font-mono text-xs text-text-tertiary mb-1">Email</dt>
                <dd className="flex items-center gap-2 text-text-primary">
                  <span className="mr-1">📧</span>
                  prnvamara@gmail.com
                </dd>
              </div>
              <div className="bg-bg-secondary border border-border-default rounded-lg p-4">
                <dt className="font-mono text-xs text-text-tertiary mb-1">Phone</dt>
                <dd className="flex items-center gap-2 text-text-primary">
                  <span className="mr-1">📱</span>
                  +91 98765 43210
                </dd>
              </div>
              <div className="bg-bg-secondary border border-border-default rounded-lg p-4">
                <dt className="font-mono text-xs text-text-tertiary mb-1">Education</dt>
                <dd className="flex items-center gap-2 text-text-primary">
                  <GraduationCap className="w-4 h-4 text-accent-primary" />
                  B.Tech ECE, Amrita Vishwa Vidyapeetham
                </dd>
              </div>
            </dl>
          </div>

          {/* Skills */}
          <div className="mb-8">
            <h2 className="font-mono text-xl font-bold text-text-primary mb-6">
              Technical Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-mono text-sm text-text-tertiary mb-3">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {['Python', 'Java', 'C++', 'JavaScript'].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-bg-secondary border border-border-default rounded font-mono text-sm text-text-secondary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-mono text-sm text-text-tertiary mb-3">AI/ML Frameworks</h3>
                <div className="flex flex-wrap gap-2">
                  {['TensorFlow', 'Scikit-learn', 'PyTorch', 'Keras'].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-bg-secondary border border-border-default rounded font-mono text-sm text-text-secondary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-mono text-sm text-text-tertiary mb-3">Tools & Platforms</h3>
                <div className="flex flex-wrap gap-2">
                  {['Flask', 'ROS2', 'Docker', 'Git', 'AWS'].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-bg-secondary border border-border-default rounded font-mono text-sm text-text-secondary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-mono text-sm text-text-tertiary mb-3">Domains</h3>
                <div className="flex flex-wrap gap-2">
                  {['Computer Vision', 'NLP', 'Robotics', 'IoT'].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-bg-secondary border border-border-default rounded font-mono text-sm text-text-secondary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Philosophy */}
          <div className="bg-bg-secondary border border-border-default rounded-lg p-8">
            <h2 className="font-mono text-xl font-bold text-text-primary mb-6">
              Academic Background
            </h2>
            <div className="font-serif text-lg text-text-secondary leading-relaxed space-y-4">
              <p className="text-accent-primary italic">
                "Innovative and research-driven approach to building intelligent systems."
              </p>
              <p>
                I believe in combining technical precision with fearless curiosity. Whether it's
                experimenting with the latest LLMs or deploying AI models on edge devices, I'm
                always pushing the boundaries of what's possible.
              </p>
              <p className="text-accent-primary italic">
                "Transforming ideas into working prototypes."
              </p>
              <p>
                As an active member of VYOM space-tech club, I've learned that the best way to
                learn is by building. From satellite launch simulations to AI-controlled robotic
                arms, I bring ideas to life through hands-on experimentation.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
