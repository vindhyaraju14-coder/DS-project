export interface SubExperiment {
  title: string
  description: string
  aim: string
  syntax: string
  program: string
  output: string
  youtubeUrl: string
  githubUrl: string
}

export interface Experiment {
  id: string
  number: number
  title: string
  description: string
  thumbnail: string
  youtubeUrl: string
  githubUrl: string
  aim: string
  objective: string
  topics: string[]
  syntax: string
  program: string
  experimentA: SubExperiment
  experimentB: SubExperiment
  createdAt: string
  updatedAt: string
}

export interface StudentProfile {
  name: string
  rollNo: string
  section: string
  branch: string
  assistantProfessor: string
  photo: string
  github: string
}
