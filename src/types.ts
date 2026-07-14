export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface DiagnosticAnswers {
  itLiteracy: string;
  preferredArea: string;
  laborOfficeStatus: string;
  mindsetFeelings: string;
  isComplete: boolean;
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  category: 'bureaucracy' | 'basics' | 'portfolio' | 'jobs';
  status: 'pending' | 'current' | 'completed';
  czechLabel: string;
}

export interface JobAnalysis {
  title: string;
  company: string;
  location: string;
  techStack: string[];
  localDemandCzech: string;
  recommendations: string[];
  suggestedProjects: string[];
}

export interface Challenge {
  id: string;
  title: string;
  difficulty: 'Začátečník' | 'Mírně pokročilý';
  language: 'Python' | 'JavaScript' | 'Git';
  description: string;
  initialCode: string;
  socraticQuestions: string[];
}
