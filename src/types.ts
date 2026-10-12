export type StudentProfile = {
  name: string
  rollNo: string
  section: string
  branch: string
  assistantProfessor: string
  photo: string
  github: string
  githubProfile?: string
  linkedin: string
  leetcode?: string
  attendance?: string
}

export type ExperimentSection = {
  title: string
  description: string
  aim: string
  syntax: string
  program: string
  output: string
  youtubeUrl: string
  githubUrl: string
}

export type Experiment = {
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
  experimentA: ExperimentSection
  experimentB: ExperimentSection
  createdAt: string
  updatedAt: string
}
