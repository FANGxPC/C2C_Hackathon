import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Upload, FileText, CheckCircle, AlertCircle, TrendingUp, MessageCircle, Building, Calendar } from 'lucide-react';

const ResumePlacement: React.FC = () => {
  const [uploadedResume, setUploadedResume] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const mockInterviewQuestions = [
    "Tell me about yourself and your background.",
    "What are your greatest strengths and weaknesses?",
    "Why are you interested in this position?",
    "Describe a challenging project you've worked on.",
    "Where do you see yourself in 5 years?"
  ];

  const placementInsights = [
    {
      company: 'Google',
      position: 'Software Engineer',
      difficulty: 'Hard',
      tips: 'Focus on system design and coding problems',
      recent: '2 days ago',
      trend: 'up'
    },
    {
      company: 'Microsoft',
      position: 'Product Manager',
      difficulty: 'Medium',
      tips: 'Emphasize leadership and analytical skills',
      recent: '1 week ago',
      trend: 'up'
    },
    {
      company: 'Amazon',
      position: 'Data Scientist',
      difficulty: 'Hard',
      tips: 'Prepare for statistical modeling questions',
      recent: '3 days ago',
      trend: 'stable'
    }
  ];

  const resumeAnalysis = {
    strengths: [
      'Strong technical skills in Python and JavaScript',
      'Relevant project experience',
      'Good academic performance',
      'Leadership experience in student organizations'
    ],
    weaknesses: [
      'Limited industry experience',
      'Could improve technical depth in specific areas',
      'Resume formatting could be more professional'
    ],
    score: 78
  };

  const handleResumeUpload = () => {
    setUploadedResume(true);
    setShowResults(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < mockInterviewQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-semibold text-slate-900 mb-2">Resume & Placement Prep</h1>
        <p className="text-slate-600">Enhance your resume and prepare for placements with AI-powered insights</p>
      </motion.div>

      <Tabs defaultValue="resume" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="resume">Resume Reviewer</TabsTrigger>
          <TabsTrigger value="interview">Mock Interview</TabsTrigger>
          <TabsTrigger value="insights">Placement Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="resume" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Upload Your Resume</CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                      uploadedResume ? 'border-green-300 bg-green-50' : 'border-slate-300 hover:border-slate-400'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {uploadedResume ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="space-y-4"
                      >
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                        <div>
                          <p className="font-medium text-green-700">Resume uploaded successfully!</p>
                          <p className="text-sm text-green-600">resume.pdf (245 KB)</p>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="h-12 w-12 text-slate-400 mx-auto" />
                        <div>
                          <p className="font-medium text-slate-700">Drop your resume here</p>
                          <p className="text-sm text-slate-500">or click to browse (PDF, DOC, DOCX)</p>
                        </div>
                        <Button onClick={handleResumeUpload} className="mt-4">
                          Upload Resume
                        </Button>
                      </div>
                    )}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Analysis Results */}
            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Analysis Results
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Score: {resumeAnalysis.score}/100
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Overall Score</span>
                          <span className="text-sm text-slate-600">{resumeAnalysis.score}%</span>
                        </div>
                        <Progress value={resumeAnalysis.score} className="h-2" />
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4"
                      >
                        <div>
                          <h4 className="font-medium text-green-700 mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Strengths
                          </h4>
                          <ul className="space-y-1">
                            {resumeAnalysis.strengths.map((strength, index) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                                className="text-sm text-slate-600 flex items-start"
                              >
                                <span className="w-1 h-1 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                                {strength}
                              </motion.li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-orange-700 mb-2 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Areas for Improvement
                          </h4>
                          <ul className="space-y-1">
                            {resumeAnalysis.weaknesses.map((weakness, index) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                                className="text-sm text-slate-600 flex items-start"
                              >
                                <span className="w-1 h-1 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                                {weakness}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="interview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Mock Interview</CardTitle>
              <p className="text-slate-600">Practice with AI-generated questions based on your profile</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  Question {currentQuestion + 1} of {mockInterviewQuestions.length}
                </span>
                <Badge variant="outline">Technical Interview</Badge>
              </div>

              <Progress value={((currentQuestion + 1) / mockInterviewQuestions.length) * 100} className="h-2" />

              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6 bg-slate-50 rounded-lg border"
              >
                <div className="flex items-start space-x-3 mb-4">
                  <MessageCircle className="h-5 w-5 text-slate-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-slate-900">AI Interviewer</h4>
                    <p className="text-sm text-slate-600">Technical Interview Bot</p>
                  </div>
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-slate-800"
                >
                  {mockInterviewQuestions[currentQuestion]}
                </motion.p>
              </motion.div>

              <div className="flex justify-between">
                <Button variant="outline" disabled={currentQuestion === 0}>
                  Previous Question
                </Button>
                <Button onClick={nextQuestion} disabled={currentQuestion === mockInterviewQuestions.length - 1}>
                  Next Question
                </Button>
              </div>

              <div className="text-center text-sm text-slate-600">
                <p>Take your time to answer. The AI will provide feedback after each response.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Latest Placement Insights</CardTitle>
                <p className="text-slate-600">Real-time updates from recent placement activities</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {placementInsights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Building className="h-5 w-5 text-slate-500 mt-1" />
                          <div className="space-y-2">
                            <div>
                              <h4 className="font-medium text-slate-900">{insight.company}</h4>
                              <p className="text-sm text-slate-600">{insight.position}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant={insight.difficulty === 'Hard' ? 'destructive' : insight.difficulty === 'Medium' ? 'default' : 'secondary'}
                              >
                                {insight.difficulty}
                              </Badge>
                              <span className="text-xs text-slate-500">{insight.recent}</span>
                            </div>
                            <p className="text-sm text-slate-700">{insight.tips}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className={`h-4 w-4 ${
                            insight.trend === 'up' ? 'text-green-500' : 'text-slate-400'
                          }`} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumePlacement;