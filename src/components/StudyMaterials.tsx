import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Search, FileText, BookOpen, Video, Download, Star, Clock, Filter, X } from 'lucide-react';

const STORAGE_KEY = 'studentconnect_study_materials_v1'; // localStorage key for persistence

type Material = {
  id: number;
  title: string;
  type: 'PDF' | 'Video' | 'Document';
  category: string;
  rating: number;
  downloads: number;
  uploadDate: string;
  description: string;
  tags: string[];
  url: string; // user-provided link
};

// Permissive href builder:
// - Blocks only dangerous schemes (javascript:, data:, vbscript:) and plain "#" placeholder
// - Allows "#section" anchors, relative (/ ./ ../), protocol-relative (//), absolute (http/https)
// - Coerces domain-like inputs (example.com, www.site.com/path) to https://
const toHref = (raw: string | null | undefined): string | null => {
  const s = (raw ?? '').trim();
  if (!s) return null;

  const lower = s.toLowerCase();

  // Block dangerous schemes
  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('vbscript:')) {
    return null;
  }

  // Block plain "#" (would just open current app)
  if (s === '#') return null;

  // Allow hash fragments like "#section-1"
  if (s.startsWith('#')) return s;

  // Allow relative paths
  if (/^(\/|\.\/|\.\.\/)/.test(s)) return s;

  // Protocol-relative -> force https for safety
  if (s.startsWith('//')) return `https:${s}`;

  // Absolute with scheme
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(s)) return s;

  // Domain-like -> prefix https
  if (/^www\./i.test(s) || s.includes('.')) return `https://${s}`;

  // Fallback: treat as relative
  return s;
};

export const StudyMaterials: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Upload dialog state
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({
    title: '',
    type: 'PDF',
    category: 'Computer Science',
    rating: '4.5',
    downloads: '0',
    uploadDate: 'today',
    description: '',
    tags: '',
    url: '', // keep raw; rendering handles normalization
  });

  // Default 22 detailed entries
  const defaults: Material[] = [
    { id: 1, title: 'Data Structures and Algorithms: Complete Guide', type: 'PDF', category: 'Computer Science', rating: 4.8, downloads: 1250, uploadDate: '2 days ago', description: 'Comprehensive notes on arrays, linked lists, stacks, queues, trees, heaps, hashing, and graphs with worked examples and complexity analysis.', tags: ['DSA','Algorithms','Interview Prep'], url: 'https://www.mta.ca/~rrosebru/oldcourse/263114/Dsa.pdf' },
    { id: 2, title: 'Operating Systems Concepts — Video Series', type: 'Video', category: 'Computer Science', rating: 4.6, downloads: 890, uploadDate: '1 week ago', description: 'Processes, threads, CPU scheduling, synchronization, deadlocks, memory management, and file systems explained with demos.', tags: ['OS','Scheduling','Memory'], url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p' },
    { id: 3, title: 'Machine Learning Fundamentals Handbook', type: 'PDF', category: 'AI/ML', rating: 4.9, downloads: 2100, uploadDate: '3 days ago', description: 'Supervised vs unsupervised learning, evaluation metrics, overfitting/regularization, and common algorithms with examples.', tags: ['ML','Python','Statistics'], url: 'https://www.cs.huji.ac.il/~shais/UnderstandingMachineLearning/understanding-machine-learning-theory-algorithms.pdf' },
    { id: 4, title: 'Database Design Patterns and Normalization', type: 'PDF', category: 'Database', rating: 4.5, downloads: 670, uploadDate: '5 days ago', description: 'Keys, constraints, ER modeling, normalization (1NF–BCNF), joins, and anti‑patterns with practical schema tips.', tags: ['Database','SQL','Design'], url: 'https://www.db-book.com/slides-dir/PDF-dir/ch7.pdf' },
    { id: 5, title: 'Software Engineering Principles (Notes)', type: 'PDF', category: 'Software Engineering', rating: 4.7, downloads: 1580, uploadDate: '1 week ago', description: 'Requirements, design, version control, testing strategies, CI/CD pipelines, and maintainability best practices.', tags: ['SE','Testing','CI/CD'], url: 'https://mrcet.com/downloads/digital_notes/CSE/III%20Year/Software%20Engineering.pdf' },
    { id: 6, title: 'Network Security Essentials — Video Course', type: 'Video', category: 'Cybersecurity', rating: 4.6, downloads: 445, uploadDate: '2 weeks ago', description: 'Symmetric/asymmetric crypto, TLS/PKI, firewalls, and threat modeling for modern networks.', tags: ['Security','TLS','Crypto'], url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFZzG04mGLa6CO6bxx-pW8v' },
    { id: 7, title: 'Discrete Mathematics Quick Reference', type: 'PDF', category: 'Computer Science', rating: 4.5, downloads: 980, uploadDate: '4 days ago', description: 'Logic, sets, functions, relations, combinatorics, graphs, and proof techniques summarized.', tags: ['Discrete','Graphs','Logic'], url: 'https://mu.ac.in/wp-content/uploads/2021/05/Data-Structure-Final-.pdf' },
    { id: 8, title: 'Compiler Design Overview', type: 'PDF', category: 'Computer Science', rating: 4.4, downloads: 640, uploadDate: '6 days ago', description: 'Lexical analysis, parsing, semantic analysis, intermediate representation, optimization, and code generation.', tags: ['Compilers','Parsing','IR'], url: 'https://users.dcc.uchile.cl/~voyanede/cc4102/dS&A%20Book%20By%20Alfred%20-Aho.pdf' },
    { id: 9, title: 'Computer Networks Crash Course — Video', type: 'Video', category: 'Computer Science', rating: 4.6, downloads: 770, uploadDate: '1 week ago', description: 'OSI/TCP‑IP models, routing, congestion control, DNS, and HTTP/HTTPS with troubleshooting demos.', tags: ['Networks','TCP/IP','Routing'], url: 'https://www.youtube.com/watch?v=vBURTt97EkA&list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p' },
    { id: 10, title: 'Deep Learning Primer (Notes)', type: 'PDF', category: 'AI/ML', rating: 4.7, downloads: 1420, uploadDate: '2 weeks ago', description: 'Neural nets, activations, initialization, regularization, CNN/RNN basics, and transfer learning overview.', tags: ['DL','CNN','Optimization'], url: 'https://www.hlevkin.com/hlevkin/45MachineDeepLearning/ML/Foundations_of_Machine_Learning.pdf' },
    { id: 11, title: 'Probability & Statistics for Data Science', type: 'PDF', category: 'AI/ML', rating: 4.6, downloads: 1120, uploadDate: '5 days ago', description: 'Distributions, expectation/variance, hypothesis testing, confidence intervals, and regression assumptions.', tags: ['Stats','Probability','Data'], url: 'https://mrcet.com/downloads/digital_notes/CSE/IV%20Year/MACHINE%20LEARNING(R17A0534).pdf' },
    { id: 12, title: 'System Design for Beginners — Video Series', type: 'Video', category: 'Software Engineering', rating: 4.8, downloads: 1960, uploadDate: '3 days ago', description: 'Latency vs throughput, caching, load balancing, database choices, sharding/replication, and consistency trade‑offs.', tags: ['System Design','Scaling','Cache'], url: 'https://www.youtube.com/playlist?list=PLtQWXpf5JNG9Zk90r6zQJ0o4kLlwM651S' },
    { id: 13, title: 'OS Scheduling Cheatsheet', type: 'PDF', category: 'Computer Science', rating: 4.3, downloads: 520, uploadDate: '2 days ago', description: 'FCFS, SJF, SRTF, Round Robin, and priority scheduling summarized with timelines and pros/cons.', tags: ['OS','Scheduling','Cheatsheet'], url: 'https://www.vidyalankar.org/infinite/assets/docs/study-material/cse-module-3.pdf' },
    { id: 14, title: 'Trees & Graphs Workshop — Video', type: 'Video', category: 'Computer Science', rating: 4.7, downloads: 880, uploadDate: '1 week ago', description: 'BST, heap, trie implementations and BFS/DFS, shortest‑path walkthroughs for interviews.', tags: ['Trees','Graphs','Heaps'], url: 'https://www.youtube.com/playlist?list=PLtQWXpf5JNG_f7hYkq9o7g1j3r5gWnUoR' },
    { id: 15, title: 'SQL Query Patterns Cookbook', type: 'PDF', category: 'Database', rating: 4.6, downloads: 1320, uploadDate: '1 week ago', description: 'Joins, window functions, CTEs, pagination, and indexing strategies with examples.', tags: ['SQL','CTE','Indexes'], url: 'https://www.javier8a.com/itc/bd1/articulo.pdf' },
    { id: 16, title: 'OWASP Top 10 Explained — Video', type: 'Video', category: 'Cybersecurity', rating: 4.5, downloads: 610, uploadDate: '2 weeks ago', description: 'XSS, CSRF, injection, auth issues, and secure coding mitigations demonstrated.', tags: ['OWASP','WebSec','Mitigation'], url: 'https://www.youtube.com/playlist?list=PLtQWXpf5JNG9wQGQw3k2w6QeJc2bV3qV8' },
    { id: 17, title: 'Design Patterns in TypeScript', type: 'PDF', category: 'Software Engineering', rating: 4.6, downloads: 930, uploadDate: '4 days ago', description: 'Creational, structural, and behavioral patterns with compact TypeScript examples and use cases.', tags: ['Patterns','TypeScript','OOP'], url: 'https://jecrcfoundation.com/wp-content/uploads/notes/btech/Computer%20Science%20Engineering/3rd%20Semester/Software%20Engineering/SE%20Notes%20Complete.pdf' },
    { id: 18, title: 'Reinforcement Learning Intuition — Video', type: 'Video', category: 'AI/ML', rating: 4.7, downloads: 720, uploadDate: '6 days ago', description: 'Agents, rewards, value vs policy methods, exploration strategies, and simple gridworld demos.', tags: ['RL','Policy','Value'], url: 'https://www.youtube.com/playlist?list=PLtQWXpf5JNG9kVQe3-6m7m2jv4aHj0V6w' },
    { id: 19, title: 'Cloud Basics for Developers (Notes)', type: 'PDF', category: 'Software Engineering', rating: 4.4, downloads: 680, uploadDate: '2 weeks ago', description: 'Compute, storage, networking, managed services, and infrastructure as code with cost‑awareness tips.', tags: ['Cloud','IaC','DevOps'], url: 'https://nystudio107.com/docs/vite/v4/' },
    { id: 20, title: 'Numerical Methods Cheatsheet', type: 'PDF', category: 'Computer Science', rating: 4.3, downloads: 450, uploadDate: '1 day ago', description: 'Quick references for root finding, interpolation, numerical differentiation/integration, and ODE basics.', tags: ['Numerical','Math','ODE'], url: 'https://www.uoitc.edu.iq/images/documents/informatics-institute/Competitive_exam/DataStructures.pdf' },
    { id: 21, title: 'Computer Architecture Essentials — Video', type: 'Video', category: 'Computer Science', rating: 4.5, downloads: 560, uploadDate: '1 week ago', description: 'Pipelines, caches, memory hierarchy, instruction‑level parallelism, and performance metrics explained.', tags: ['COA','Pipelines','Caches'], url: 'https://www.youtube.com/playlist?list=PLtQWXpf5JNG8m5W3wM3VQKpHn2m4f5S3E' },
    { id: 22, title: 'Linear Algebra for ML (Notes)', type: 'PDF', category: 'AI/ML', rating: 4.8, downloads: 1500, uploadDate: '5 days ago', description: 'Vectors, matrix operations, rank, eigenvalues, SVD, and geometric intuition tailored for ML practice.', tags: ['Linear Algebra','Matrix','SVD'], url: 'https://hlevkin.com/hlevkin/45MachineDeepLearning/ML/Foundations_of_Machine_Learning.pdf' },
  ];

  // Load from localStorage once; fallback to defaults
  const [materials, setMaterials] = useState<Material[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Material[];
        return Array.isArray(parsed) && parsed.length ? parsed : defaults;
      }
      return defaults;
    } catch {
      return defaults;
    }
  });

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
    } catch {
      // ignore storage failures for hackathon use
    }
  }, [materials]);

  // Derived: unique categories from data
  const categories = useMemo(() => {
    const base = new Set<string>(['all']);
    materials.forEach((m) => base.add(m.category));
    return Array.from(base);
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return materials.filter((m) => {
      const matchesSearch =
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q));
      const matchesFilter = activeFilter === 'all' || m.category === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [materials, searchQuery, activeFilter]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PDF':
      case 'Document':
        return <FileText className="h-4 w-4" />;
      case 'Video':
        return <Video className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PDF':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Video':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Document':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Upload handlers
  const openUpload = () => {
    setForm({
      title: '',
      type: 'PDF',
      category: 'Computer Science',
      rating: '4.5',
      downloads: '100',
      uploadDate: 'today',
      description: '',
      tags: '',
      url: '', // leave empty; user pastes raw value
    });
    setShowUpload(true);
  };

  const submitUpload = () => {
    const next: Material = {
      id: (materials.at(-1)?.id ?? 0) + 1,
      title: form.title.trim() || 'Untitled Material',
      type: (form.type as Material['type']) || 'PDF',
      category: form.category.trim() || 'Computer Science',
      rating: Math.max(0, Math.min(5, parseFloat(form.rating) || 4.5)),
      downloads: Math.max(0, parseInt(form.downloads) || 0),
      uploadDate: form.uploadDate.trim() || 'today',
      description: form.description.trim() || 'No description provided.',
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 8),
      url: form.url.trim() || '#', // keep user's provided link (or '#' placeholder)
    };
    setMaterials((prev) => [next, ...prev]);
    setShowUpload(false);
  };

  return (
    <div className="p-6 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-3xl font-semibold text-slate-900 mb-2">Study Materials</h1>
        <p className="text-slate-600">Access comprehensive study resources with AI-powered search and filters</p>
      </motion.div>

      {/* Search and Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-4 gap-4"
      >
        <div className="lg:col-span-3 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search materials (title, description, tags)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchActive(true)}
              onBlur={() => setIsSearchActive(false)}
              className={`pl-10 transition-all duration-300 ${
                isSearchActive ? 'ring-2 ring-amber-500 ring-opacity-50 shadow-lg' : ''
              }`}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button className="flex items-center space-x-2" onClick={openUpload}>
            <FileText className="h-4 w-4" />
            <span>Upload Material</span>
          </Button>
        </div>
      </motion.div>

      {/* Category Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeFilter === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter(category)}
            className="transition-all duration-200"
          >
            <Filter className="h-3 w-3 mr-2" />
            {category === 'all' ? 'All Categories' : category}
          </Button>
        ))}
      </motion.div>

      {/* Materials Grid */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredMaterials.map((material, index) => {
            const href = toHref(material.url);

            const CardInner = (
              <Card className="h-full shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${getTypeColor(material.type)}`}>
                        {getTypeIcon(material.type)}
                      </div>
                      <Badge variant="outline" className={getTypeColor(material.type)}>
                        {material.type}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-slate-600">{material.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium text-slate-900 line-clamp-2 group-hover:text-amber-600 transition-colors">
                      {material.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-3">{material.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {material.tags.slice(0, 4).map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{material.uploadDate}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Download className="h-3 w-3" />
                      <span>{material.downloads} downloads</span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            );

            return (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group"
              >
                {href ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="block">
                    {CardInner}
                  </a>
                ) : (
                  <div
                    role="button"
                    aria-disabled="true"
                    className="block pointer-events-none opacity-60"
                    title="No valid link provided"
                  >
                    {CardInner}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Upload Dialog */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-900">Upload Material</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowUpload(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    className="border border-slate-200 rounded-md px-3 py-2 text-sm"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="PDF">PDF</option>
                    <option value="Video">Video</option>
                    <option value="Document">Document</option>
                  </select>
                  <select
                    className="border border-slate-200 rounded-md px-3 py-2 text-sm"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option>Computer Science</option>
                    <option>AI/ML</option>
                    <option>Database</option>
                    <option>Software Engineering</option>
                    <option>Cybersecurity</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Input placeholder="Rating 0-5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
                  <Input placeholder="Downloads" value={form.downloads} onChange={(e) => setForm({ ...form, downloads: e.target.value })} />
                  <Input placeholder="Upload date" value={form.uploadDate} onChange={(e) => setForm({ ...form, uploadDate: e.target.value })} />
                </div>

                <Input placeholder="URL (https://..., //cdn..., /path, #section, or domain.com)" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
                <Input placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                <textarea
                  className="border border-slate-200 rounded-md px-3 py-2 text-sm min-h-[90px]"
                  placeholder="Short description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />

                <div className="flex justify-end gap-2 mt-2">
                  <Button variant="outline" onClick={() => setShowUpload(false)}>Cancel</Button>
                  <Button onClick={submitUpload}>Add Material</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {filteredMaterials.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="text-center py-12">
          <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No materials found</h3>
          <p className="text-slate-600 max-w-md mx-auto">Try adjusting search terms or category filters.</p>
        </motion.div>
      )}
    </div>
  );
};

export default StudyMaterials;
