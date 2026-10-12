import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Check,
  Code2,
  Copy,
  Database,
  Download,
  Edit,
  ExternalLink,
  FlaskConical,
  GitBranch,
  MoreVertical,
  Pencil,
  Play,
  Plus,
  Search,
  Trash2,
  Upload,
  User,
  X,
} from 'lucide-react'
import { defaultExperiments, defaultProfile } from './data/defaults'
import moduleGuides from './data/module-guides.json'
import type { Experiment, StudentProfile } from './types'

type Toast = { id: number; message: string }

type ExperimentFormState = {
  number: string
  title: string
  description: string
  thumbnail: string
  youtubeUrl: string
  githubUrl: string
  aim: string
  objective: string
  topics: string
  syntax: string
  program: string
  experimentA: {
    title: string
    description: string
    aim: string
    syntax: string
    program: string
    output: string
    youtubeUrl: string
    githubUrl: string
  }
  experimentB: {
    title: string
    description: string
    aim: string
    syntax: string
    program: string
    output: string
    youtubeUrl: string
    githubUrl: string
  }
}

type IndividualExperiment = {
  experiment: Experiment
  type: 'a' | 'b'
  number: number
  section: Experiment['experimentA']
}

const listIndividualExperiments = (experiments: Experiment[]): IndividualExperiment[] =>
  [...experiments]
    .sort((a, b) => a.number - b.number)
    .flatMap((experiment, index) => [
      {
        experiment,
        type: 'a' as const,
        number: index * 2 + 1,
        section: experiment.experimentA,
      },
      {
        experiment,
        type: 'b' as const,
        number: index * 2 + 2,
        section: experiment.experimentB,
      },
    ])

const loadExperiments = (): Experiment[] => {
  const saved = readStorage<Experiment[] | null>(STORAGE_KEYS.experiments, null)
  if (!saved) {
    return defaultExperiments
  }

  const seedVersion = readStorage<number>(STORAGE_KEYS.experimentSeedVersion, 0)
  if (seedVersion >= 3) {
    return saved
  }

  const savedIds = new Set(saved.map((experiment) => experiment.id))
  const additions = defaultExperiments.filter((experiment) => !savedIds.has(experiment.id))
  const lastNumber = saved.reduce((max, experiment) => Math.max(max, experiment.number), 0)

  writeStorage(STORAGE_KEYS.experimentSeedVersion, 3)
  return [
    ...saved,
    ...additions.map((experiment, index) => ({
      ...experiment,
      number: lastNumber + index + 1,
    })),
  ]
}

const STORAGE_KEYS = {
  experiments: 'dsLab_experiments',
  experimentSeedVersion: 'dsLab_experimentSeedVersion',
  studentProfile: 'dsLab_studentProfile',
}

const DEFAULT_THUMBNAIL =
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'

const readStorage = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key)
    return saved ? (JSON.parse(saved) as T) : fallback
  } catch {
    return fallback
  }
}

const writeStorage = <T,>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore write failures in restricted browser contexts
  }
}

const makeId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `exp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

const normaliseUrl = (value: string) => {
  if (!value) {
    return ''
  }

  if (/^https?:\/\//i.test(value)) {
    return value
  }

  return `https://${value}`
}

const toEmbedUrl = (source: string) => {
  if (!source) {
    return ''
  }

  const clean = source.trim()
  const watchMatch = clean.match(/[?&]v=([A-Za-z0-9_-]{11})/)
  const shortMatch = clean.match(/youtu\.be\/([A-Za-z0-9_-]{11})/)
  const embedMatch = clean.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{11})/)

  const id = watchMatch?.[1] ?? shortMatch?.[1] ?? embedMatch?.[1]

  if (!id) {
    return ''
  }

  return `https://www.youtube.com/embed/${id}`
}

const defaultFormState = (experiment?: Experiment): ExperimentFormState => ({
  number: experiment ? String(experiment.number) : '1',
  title: experiment?.title ?? '',
  description: experiment?.description ?? '',
  thumbnail: experiment?.thumbnail ?? DEFAULT_THUMBNAIL,
  youtubeUrl: experiment?.youtubeUrl ?? '',
  githubUrl: experiment?.githubUrl ?? '',
  aim: experiment?.aim ?? '',
  objective: experiment?.objective ?? '',
  topics: experiment?.topics.join(', ') ?? '',
  syntax: experiment?.syntax ?? '',
  program: experiment?.program ?? '',
  experimentA: {
    title: experiment?.experimentA.title ?? '',
    description: experiment?.experimentA.description ?? '',
    aim: experiment?.experimentA.aim ?? '',
    syntax: experiment?.experimentA.syntax ?? '',
    program: experiment?.experimentA.program ?? '',
    output: experiment?.experimentA.output ?? '',
    youtubeUrl: experiment?.experimentA.youtubeUrl ?? '',
    githubUrl: experiment?.experimentA.githubUrl ?? '',
  },
  experimentB: {
    title: experiment?.experimentB.title ?? '',
    description: experiment?.experimentB.description ?? '',
    aim: experiment?.experimentB.aim ?? '',
    syntax: experiment?.experimentB.syntax ?? '',
    program: experiment?.experimentB.program ?? '',
    output: experiment?.experimentB.output ?? '',
    youtubeUrl: experiment?.experimentB.youtubeUrl ?? '',
    githubUrl: experiment?.experimentB.githubUrl ?? '',
  },
})

const validateUrl = (value: string) => {
  if (!value) {
    return true
  }

  try {
    const url = new URL(normaliseUrl(value))
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

const buildExperiment = (form: ExperimentFormState, existing?: Experiment): Experiment => ({
  id: existing?.id ?? makeId(),
  number: Number(form.number) || 1,
  title: form.title.trim(),
  description: form.description.trim(),
  thumbnail: form.thumbnail || DEFAULT_THUMBNAIL,
  youtubeUrl: form.youtubeUrl.trim(),
  githubUrl: form.githubUrl.trim(),
  aim: form.aim.trim(),
  objective: form.objective.trim(),
  topics: form.topics
    .split(',')
    .map((topic) => topic.trim())
    .filter(Boolean),
  syntax: form.syntax.trim(),
  program: form.program.trim(),
  experimentA: {
    title: form.experimentA.title.trim(),
    description: form.experimentA.description.trim(),
    aim: form.experimentA.aim.trim(),
    syntax: form.experimentA.syntax.trim(),
    program: form.experimentA.program.trim(),
    output: form.experimentA.output.trim(),
    youtubeUrl: form.experimentA.youtubeUrl.trim(),
    githubUrl: form.experimentA.githubUrl.trim(),
  },
  experimentB: {
    title: form.experimentB.title.trim(),
    description: form.experimentB.description.trim(),
    aim: form.experimentB.aim.trim(),
    syntax: form.experimentB.syntax.trim(),
    program: form.experimentB.program.trim(),
    output: form.experimentB.output.trim(),
    youtubeUrl: form.experimentB.youtubeUrl.trim(),
    githubUrl: form.experimentB.githubUrl.trim(),
  },
  createdAt: existing?.createdAt ?? new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

function App() {
  const [experiments, setExperiments] = useState<Experiment[]>(() =>
    loadExperiments(),
  )
  const [profile, setProfile] = useState<StudentProfile>(() =>
    readStorage(STORAGE_KEYS.studentProfile, defaultProfile),
  )
  const [toasts, setToasts] = useState<Toast[]>([])
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isExperimentModalOpen, setIsExperimentModalOpen] = useState(false)
  const [editingExperiment, setEditingExperiment] = useState<Experiment | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsReady(true), 180)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    writeStorage(STORAGE_KEYS.experiments, experiments)
  }, [experiments])

  useEffect(() => {
    writeStorage(STORAGE_KEYS.studentProfile, profile)
  }, [profile])

  const showToast = (message: string) => {
    const id = Date.now() + Math.random()
    setToasts((current) => [...current, { id, message }])
  }

  useEffect(() => {
    if (!toasts.length) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setToasts((current) => current.slice(1))
    }, 2800)

    return () => window.clearTimeout(timer)
  }, [toasts])

  const handleCreateExperiment = (experiment: Experiment) => {
    setExperiments((current) =>
      [...current, experiment].sort((a, b) => a.number - b.number),
    )
    showToast('Experiment created successfully.')
  }

  const handleUpdateExperiment = (experiment: Experiment) => {
    setExperiments((current) =>
      current
        .map((item) => (item.id === experiment.id ? experiment : item))
        .sort((a, b) => a.number - b.number),
    )
    showToast('Experiment updated successfully.')
  }

  const handleSaveExperimentProgram = (id: string, type: 'a' | 'b', program: string) => {
    setExperiments((current) =>
      current.map((experiment) => {
        if (experiment.id !== id) {
          return experiment
        }

        const sectionKey = type === 'a' ? 'experimentA' : 'experimentB'
        return {
          ...experiment,
          [sectionKey]: { ...experiment[sectionKey], program },
          updatedAt: new Date().toISOString(),
        }
      }),
    )
    showToast('Experiment code saved.')
  }

  const handleDeleteExperiment = (id: string) => {
    setExperiments((current) => current.filter((experiment) => experiment.id !== id))
    setDeleteTargetId(null)
    showToast('Experiment deleted successfully.')
  }

  const handleProfileSave = (nextProfile: StudentProfile) => {
    setProfile(nextProfile)
    setIsProfileModalOpen(false)
    showToast('Profile updated successfully.')
  }

  const openAddExperiment = () => {
    setEditingExperiment(null)
    setIsExperimentModalOpen(true)
  }

  const openEditExperiment = (experiment: Experiment) => {
    setEditingExperiment(experiment)
    setIsExperimentModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#F5F8FA] text-slate-900">
      <Header />

      <main className="mx-auto max-w-[1320px] px-4 pb-8 pt-5 md:px-6 lg:px-8">
        <Routes>
          <Route
            path="/"
            element={
              <StartPage
                profile={profile}
                onEditProfile={() => setIsProfileModalOpen(true)}
              />
            }
          />
          <Route path="/experiments" element={
            <HomePage
              experiments={experiments}
              isReady={isReady}
              onAddExperiment={openAddExperiment}
              onEditExperiment={openEditExperiment}
              onDeleteExperiment={(id) => setDeleteTargetId(id)}
            />
          } />
          <Route path="/modules" element={<ModulesPage />} />
          <Route path="/code" element={<CodePage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/experiment/:id"
            element={
              <ExperimentDetailsPage
                experiments={experiments}
                onDeleteExperiment={(id) => setDeleteTargetId(id)}
                onEditExperiment={openEditExperiment}
              />
            }
          />
          <Route
            path="/experiment/:id/a"
            element={
              <SubExperimentPage
                experiments={experiments}
                type="a"
                onSaveProgram={handleSaveExperimentProgram}
              />
            }
          />
          <Route
            path="/experiment/:id/b"
            element={
              <SubExperimentPage
                experiments={experiments}
                type="b"
                onSaveProgram={handleSaveExperimentProgram}
              />
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />

      <ToastContainer toasts={toasts} />

      <ProfileModal
        open={isProfileModalOpen}
        profile={profile}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleProfileSave}
      />

      <ExperimentModal
        open={isExperimentModalOpen}
        experiment={editingExperiment ?? null}
        onClose={() => {
          setIsExperimentModalOpen(false)
          setEditingExperiment(null)
        }}
        onSubmit={(experiment) => {
          if (editingExperiment) {
            handleUpdateExperiment(experiment)
          } else {
            handleCreateExperiment(experiment)
          }
          setIsExperimentModalOpen(false)
          setEditingExperiment(null)
        }}
      />

      <DeleteConfirmModal
        open={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) {
            handleDeleteExperiment(deleteTargetId)
          }
        }}
      />
    </div>
  )
}

function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/90 shadow-[0_4px_20px_rgba(15,23,42,0.02)] backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B1F3A] text-white shadow-sm">
            <FlaskConical className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-[#0B1F3A] lg:text-[2rem]">Data Science Subject Laboratory</div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-slate-500 md:text-[0.78rem]">
              Experiments & Projects
            </p>
          </div>
        </Link>
        <img
          src="/mbu-logo.png"
          alt="Mohan Babu University"
          className="h-12 w-[4.8rem] shrink-0 rounded-lg border border-slate-200 bg-white object-contain p-1 shadow-sm sm:h-14 sm:w-[5.6rem]"
        />
        <nav aria-label="Main navigation" className="order-3 flex w-full flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 pt-3 text-sm font-medium text-slate-600">
          <Link to="/" className="transition hover:text-[#0B1F3A]">
            Start
          </Link>
          <Link to="/modules" className="transition hover:text-[#0B1F3A]">
            Modules
          </Link>
          <Link to="/experiments" className="transition hover:text-[#0B1F3A]">
            Experiments
          </Link>
          <Link to="/code" className="transition hover:text-[#0B1F3A]">
            Code
          </Link>
          <Link to="/tools" className="transition hover:text-[#0B1F3A]">
            Tools
          </Link>
          <Link to="/resources" className="transition hover:text-[#0B1F3A]">
            Resources
          </Link>
          <Link to="/about" className="transition hover:text-[#0B1F3A]">
            About
          </Link>
        </nav>
      </div>
    </header>
  )
}

function StudentProfileCard({
  profile,
  onEdit,
  compact = false,
}: {
  profile: StudentProfile
  onEdit: () => void
  compact?: boolean
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)] ${compact ? 'w-full max-w-[420px]' : 'w-full'}`}>
      <div className="flex items-center gap-4 p-4">
        <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          {profile.photo ? (
            <img src={profile.photo} alt={profile.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-500">
              <User className="h-8 w-8" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[0.64rem] font-semibold uppercase tracking-[0.25em] text-slate-500">Student</p>
          <h3 className="mt-1 truncate text-lg font-semibold text-[#102033]">{profile.name || 'Student Name'}</h3>
          <p className="text-xs text-slate-500">{profile.section || 'Section'}</p>
        </div>

        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit student profile"
          className="absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-[#0B1F3A]"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-slate-200 bg-slate-50/80 px-4 py-3 text-xs text-slate-600">
        <div>
          <p className="text-slate-500">Roll No</p>
          <p className="mt-1 font-medium text-[#102033]">{profile.rollNo || 'XXXXXXXX'}</p>
        </div>
        <div>
          <p className="text-slate-500">Branch</p>
          <p className="mt-1 font-medium text-[#102033]">{profile.branch || 'Data Science'}</p>
        </div>
        <div>
          <p className="text-slate-500">Attendance</p>
          <p className="mt-1 font-medium text-[#102033]">{profile.attendance || '95%'}</p>
        </div>
        <div>
          <p className="text-slate-500">Assistant Professor</p>
          <p className="mt-1 font-medium text-[#102033]">{profile.assistantProfessor || 'Professor Name'}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3">
        {profile.githubProfile && (
          <a
            href={profile.githubProfile}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#163B63] transition hover:text-[#0B1F3A]"
          >
            <GitBranch className="h-4 w-4" />
            GitHub Profile
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
        {profile.github && (
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#163B63] transition hover:text-[#0B1F3A]"
          >
            <GitBranch className="h-4 w-4" />
            View Repository
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
        {profile.linkedin && (
          <a
            href={normaliseUrl(profile.linkedin)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#163B63] transition hover:text-[#0B1F3A]"
          >
            <User className="h-4 w-4" />
            SPOT LinkedIn
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
        {profile.leetcode && (
          <a
            href={profile.leetcode}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#163B63] transition hover:text-[#0B1F3A]"
          >
            <Code2 className="h-4 w-4" />
            LeetCode
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  )
}

function StartPage({
  profile,
  onEditProfile,
}: {
  profile: StudentProfile
  onEditProfile: () => void
}) {
  return (
    <section className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
      <div className="space-y-4">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)] md:p-8">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.25em] text-[#0EA5A8]">Academic Year 2026–2027 · Data Science Subject Laboratory</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-[#102033] md:text-4xl">
            Experiments, Analysis & Learning
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Build practical data science skills through guided experiments and project work: prepare real-world data,
            write Python programs, apply analytical methods, and communicate insights clearly.
          </p>
          <div className="mt-4 flex flex-wrap gap-2" aria-label="Data Science Laboratory learning areas">
            {['Python', 'Data Preparation', 'Analysis', 'Visualization', 'Projects'].map((area) => (
              <span key={area} className="rounded-full border border-[#0EA5A8]/20 bg-[#0EA5A8]/5 px-3 py-1.5 text-xs font-medium text-[#163B63]">
                {area}
              </span>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/experiments" className="inline-flex items-center gap-2 rounded-xl bg-[#0EA5A8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B8F92]">
              <BookOpen className="h-4 w-4" /> Explore Experiments
            </Link>
            <Link to="/modules" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0B1F3A] transition hover:bg-slate-50">
              View Modules <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </div>
        <section aria-label="Data Science Lab visuals" className="grid grid-cols-2 gap-3">
          <div className="flex h-36 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            <img src="/data-science-lab.png" alt="Data Science Subject Laboratory" className="h-full w-full object-contain" />
          </div>
          <div className="flex h-36 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            <img src="/lab-applications.png" alt="Diagram of data science subject laboratory applications" className="h-full w-full object-contain" />
          </div>
        </section>
      </div>
      <StudentProfileCard profile={profile} onEdit={onEditProfile} />
    </section>
  )
}

function ModulesPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#0EA5A8]">Course Outline · 2026–2027</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#102033] md:text-4xl">Data Science Subject Laboratory Modules</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Each module now includes six presentation pages of study matter and a matching six-page PDF guide.
        </p>
      </div>

      {moduleGuides.map((module) => (
        <section key={module.slug} id={module.slug} className="scroll-mt-5 space-y-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0EA5A8]">
                Module {String(module.number).padStart(2, '0')} · {module.pages.length} presentation pages
              </p>
              <h2 className="mt-1 text-xl font-bold text-[#102033]">{module.title}</h2>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">{module.overview}</p>
            </div>
            <a
              href={`/module-guides/module-${module.number}-${module.slug}.pdf`}
              download
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl bg-[#0B1F3A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#163B63] sm:self-center"
            >
              <Download className="h-4 w-4" /> Download 6-page PDF
            </a>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {module.pages.map((page, pageIndex) => (
              <article
                key={page.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0EA5A8]">
                  Page {pageIndex + 1} of {module.pages.length}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-[#102033]">{page.title}</h3>
                {page.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-3 text-sm leading-6 text-slate-600">{paragraph}</p>
                ))}
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                  {page.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#0EA5A8]" aria-hidden="true" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      ))}
    </section>
  )
}

function CodePage() {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#0EA5A8]">Data Science Subject Laboratory</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#102033] md:text-4xl">Python Code Editor</h1>
        <p className="mt-2 text-sm text-slate-500">Write Python and run it safely in your browser. The first run downloads the Python runtime.</p>
      </div>
      <PythonCodeEditor
        initialCode={'values = [12, 15, 18, 20]\naverage = sum(values) / len(values)\nprint(f"Average: {average:.2f}")'}
      />
    </section>
  )
}

function PythonCodeEditor({
  initialCode,
  onSave,
  editorLabel = 'editor.py',
}: {
  initialCode: string
  onSave?: (code: string) => void
  editorLabel?: string
}) {
  const [code, setCode] = useState(initialCode)
  const [savedCode, setSavedCode] = useState(initialCode)
  const [output, setOutput] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const [runState, setRunState] = useState<'idle' | 'loading' | 'running'>('idle')
  const workerRef = useRef<Worker | null>(null)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => () => {
    workerRef.current?.terminate()
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
    }
  }, [])

  const runCode = () => {
    workerRef.current?.terminate()
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
    }

    const worker = new Worker('/python-runner.js')
    workerRef.current = worker
    setOutput('Starting Python runtime… The first run needs an internet connection to load Python.')
    setRunState('loading')

    worker.onmessage = (event: MessageEvent<{ type: 'status' | 'result'; output?: string; error?: string }>) => {
      if (event.data.type === 'status') {
        setRunState('running')
        setOutput('Python is ready. Running your code…')
        return
      }
      worker.terminate()
      workerRef.current = null
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      setOutput([event.data.output, event.data.error].filter(Boolean).join('\n') || '(No output)')
      setRunState('idle')
    }

    worker.onerror = (event) => {
      worker.terminate()
      workerRef.current = null
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      setOutput(`Python could not run: ${event.message}`)
      setRunState('idle')
    }

    timeoutRef.current = window.setTimeout(() => {
      worker.terminate()
      workerRef.current = null
      timeoutRef.current = null
      setOutput('Execution stopped: the code exceeded the 60-second time limit.')
      setRunState('idle')
    }, 60_000)
    worker.postMessage(code)
  }

  const saveCode = () => {
    onSave?.(code)
    setSavedCode(code)
    setSaveMessage('Saved to this experiment.')
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#102033]">
          <Code2 className="h-4 w-4 text-[#0EA5A8]" />
          {editorLabel}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {onSave && (
            <button
              type="button"
              onClick={saveCode}
              disabled={code === savedCode}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              Save changes
            </button>
          )}
          <button
            type="button"
            onClick={runCode}
            disabled={runState !== 'idle'}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0EA5A8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B8F92] disabled:cursor-wait disabled:opacity-60"
          >
            <Play className="h-4 w-4" />
            {runState === 'loading' ? 'Loading Python…' : runState === 'running' ? 'Running…' : 'Run Code'}
          </button>
        </div>
      </div>

      <label className="sr-only" htmlFor={`python-editor-${editorLabel.replace(/\W/g, '-')}`}>Python code editor</label>
      <textarea
        id={`python-editor-${editorLabel.replace(/\W/g, '-')}`}
        value={code}
        onChange={(event) => {
          setCode(event.target.value)
          setSaveMessage('')
        }}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        className="min-h-[360px] w-full resize-y border-0 bg-white p-5 font-mono text-sm leading-6 text-slate-800 outline-none focus:ring-2 focus:ring-inset focus:ring-[#0EA5A8]"
      />
      {saveMessage && <p className="border-t border-slate-200 px-4 py-2 text-sm text-green-700">{saveMessage}</p>}
      <div className="border-t border-slate-200 bg-slate-50 p-4">
        <h2 className="text-sm font-semibold text-[#102033]">Results</h2>
        <pre aria-live="polite" className="mt-3 min-h-28 whitespace-pre-wrap break-words rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono text-sm leading-6 text-slate-700">
          {output || 'Run your Python code to see the results here.'}
        </pre>
      </div>
    </div>
  )
}

const TOOL_LINKS = [
  { name: 'Google Colab', description: 'Run Python notebooks in your browser and share experiments.', url: 'https://colab.research.google.com/' },
  { name: 'Kaggle', description: 'Explore datasets, notebooks, and beginner-friendly data challenges.', url: 'https://www.kaggle.com/' },
  { name: 'Jupyter', description: 'Create interactive notebooks for code, notes, and visual analysis.', url: 'https://jupyter.org/' },
  { name: 'Visual Studio Code', description: 'Edit Python projects with extensions for data science workflows.', url: 'https://code.visualstudio.com/' },
]

const RESOURCE_LINKS = [
  { name: 'Python Documentation', description: 'Language tutorial and reference for Python.', url: 'https://docs.python.org/3/tutorial/' },
  { name: 'Pandas User Guide', description: 'Guides for working with tabular data and time series.', url: 'https://pandas.pydata.org/docs/user_guide/' },
  { name: 'NumPy Learn', description: 'Learning materials for numerical computing with NumPy.', url: 'https://numpy.org/learn/' },
  { name: 'Matplotlib Tutorials', description: 'Examples and tutorials for creating data visualizations.', url: 'https://matplotlib.org/stable/tutorials/' },
  { name: 'Kaggle Learn', description: 'Short courses on Python, data visualization, and machine learning.', url: 'https://www.kaggle.com/learn' },
]

function LinkLibraryPage({
  title,
  eyebrow,
  description,
  links,
}: {
  title: string
  eyebrow: string
  description: string
  links: typeof TOOL_LINKS
}) {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#0EA5A8]">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#102033] md:text-4xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">{description}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <article key={link.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
            <h2 className="text-lg font-semibold text-[#102033]">{link.name}</h2>
            <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{link.description}</p>
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0B8F92] transition hover:text-[#0B1F3A]"
            >
              Open resource <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}

function ToolsPage() {
  return (
    <LinkLibraryPage
      title="Data Science Tools"
      eyebrow="Toolbox"
      description="Useful platforms for writing Python, exploring datasets, building notebooks, and sharing your work."
      links={TOOL_LINKS}
    />
  )
}

function ResourcesPage() {
  return (
    <LinkLibraryPage
      title="Learning Resources"
      eyebrow="Study resources"
      description="Official documentation and guided learning links to support the laboratory modules and experiments."
      links={RESOURCE_LINKS}
    />
  )
}

function AboutPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#0EA5A8]">About the laboratory</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#102033] md:text-4xl">Learn Data Science by Doing</h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          The Data Science Subject Laboratory supports hands-on learning through structured modules, practical experiments,
          Python programming, and clear communication of analytical results.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: 'Explore', text: 'Understand data, ask useful questions, and select suitable methods.' },
          { title: 'Experiment', text: 'Practice data preparation, analysis, and visualization through guided work.' },
          { title: 'Explain', text: 'Present findings clearly and interpret results with care.' },
        ].map((item) => (
          <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
            <h2 className="text-lg font-semibold text-[#102033]">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function HomePage({
  experiments,
  isReady,
  onAddExperiment,
  onEditExperiment,
  onDeleteExperiment,
}: {
  experiments: Experiment[]
  isReady: boolean
  onAddExperiment: () => void
  onEditExperiment: (experiment: Experiment) => void
  onDeleteExperiment: (id: string) => void
}) {
  const [search, setSearch] = useState('')

  const individualExperiments = useMemo(() => listIndividualExperiments(experiments), [experiments])
  const filteredExperiments = useMemo(() => {
    const searchTerm = search.trim().toLowerCase()

    if (!searchTerm) {
      return individualExperiments
    }

    return individualExperiments
      .filter(({ experiment, section, number }) => {
        const haystack = `${number} ${section.title} ${section.description} ${section.aim} ${section.syntax} ${experiment.title} ${experiment.topics.join(' ')}`.toLowerCase()
        return haystack.includes(searchTerm)
      })
  }, [individualExperiments, search])

  const totalIndividualExperiments = individualExperiments.length

  return (
    <div className="space-y-5">
      <section id="experiment-library" className="space-y-5">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#0EA5A8]">Experiment Library</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#102033] md:text-4xl">
            Practical Data Science Experiments
          </h2>
          <p className="mt-2 max-w-2xl text-base text-slate-500">
            Browse each practical individually, with its own number, title, description, and study material.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {[{ value: String(totalIndividualExperiments).padStart(2, '0'), label: 'Individual Experiments' }, { value: String(experiments.length).padStart(2, '0'), label: 'Experiment Groups' }].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
              <div className="text-2xl font-bold tracking-tight text-[#0B1F3A]">{stat.value}</div>
              <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.03)] md:flex-row md:items-center md:justify-between">
          <label className="relative block w-full md:max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search experiments..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-[#0EA5A8] focus:ring-2 focus:ring-[#0EA5A8]/20"
            />
          </label>

          <button
            type="button"
            onClick={onAddExperiment}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0EA5A8] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(14,165,168,0.25)] transition hover:bg-[#0B8F92]"
          >
            <Plus className="h-4 w-4" />
            Add Experiment
          </button>
        </div>

        {!isReady ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="h-44 w-full animate-pulse rounded-2xl bg-slate-200 md:w-[34%]" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                    <div className="h-7 w-2/3 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
                    <div className="h-10 w-28 animate-pulse rounded bg-slate-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredExperiments.length === 0 ? (
          <EmptyState onAddExperiment={onAddExperiment} message="No experiments found" description="Try a different keyword." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredExperiments.map(({ experiment, section, type, number }) => (
              <IndividualExperimentCard
                key={`${experiment.id}-${type}`}
                experiment={experiment}
                section={section}
                type={type}
                number={number}
                onEdit={onEditExperiment}
                onDelete={onDeleteExperiment}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function EmptyState({
  onAddExperiment,
  message,
  description,
}: {
  onAddExperiment: () => void
  message: string
  description: string
}) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#0EA5A8]/10 text-[#0EA5A8]">
        <BookOpen className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-[#102033]">{message}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
      <button
        type="button"
        onClick={onAddExperiment}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0EA5A8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B8F92]"
      >
        <Plus className="h-4 w-4" />
        Add Experiment
      </button>
    </div>
  )
}

function IndividualExperimentCard({
  experiment,
  section,
  type,
  number,
  onEdit,
  onDelete,
}: {
  experiment: Experiment
  section: Experiment['experimentA']
  type: 'a' | 'b'
  number: number
  onEdit: (experiment: Experiment) => void
  onDelete: (id: string) => void
}) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <article className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#0EA5A8]">
            Experiment {String(number).padStart(2, '0')}
          </p>
          <h3 className="mt-1 text-xl font-semibold text-[#102033]">{section.title}</h3>
          <p className="mt-1 text-xs font-medium text-slate-500">Part of: {experiment.title}</p>
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            aria-label={`Open actions for experiment ${number}`}
            onClick={() => setMenuOpen((value) => !value)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-[#0B1F3A]"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-12 z-10 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  onEdit(experiment)
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
              >
                <Edit className="h-4 w-4" /> Edit group
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  onDelete(experiment.id)
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" /> Delete group
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-600">{section.description}</p>
      {section.aim && (
        <div className="mt-4 rounded-xl bg-slate-50 p-3">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-500">Aim</p>
          <p className="mt-1 text-sm leading-5 text-slate-700">{section.aim}</p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {experiment.topics.slice(0, 3).map((topic) => (
          <span key={topic} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            {topic}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => navigate(`/experiment/${experiment.id}/${type}`)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0B1F3A] px-3.5 py-2.5 text-sm font-medium text-white transition hover:bg-[#102033]"
        >
          Open Experiment {String(number).padStart(2, '0')}
        </button>
        <button
          type="button"
          onClick={() => navigate(`/experiment/${experiment.id}`)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Group overview
        </button>
          </div>
    </article>
  )
}

function ExperimentDetailsPage({
  experiments,
  onEditExperiment,
  onDeleteExperiment,
}: {
  experiments: Experiment[]
  onEditExperiment: (experiment: Experiment) => void
  onDeleteExperiment: (id: string) => void
}) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const experiment = experiments.find((item) => item.id === id)

  useEffect(() => {
    if (!copied) {
      return undefined
    }

    const timer = window.setTimeout(() => setCopied(false), 1500)
    return () => window.clearTimeout(timer)
  }, [copied])

  if (!experiment) {
    return <NotFoundPage />
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(experiment.program)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="space-y-8 pb-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#163B63] transition hover:text-[#0B1F3A]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Experiments
      </button>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] md:p-7">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Experiment {String(experiment.number).padStart(2, '0')}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#102033] md:text-5xl">{experiment.title}</h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onEditExperiment(experiment)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <Edit className="h-4 w-4" /> Edit
            </button>
            <button
              type="button"
              onClick={() => onDeleteExperiment(experiment.id)}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{experiment.description}</p>

        <div className="mt-7 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-slate-50 p-3">
            {experiment.youtubeUrl ? (
              <div className="overflow-hidden rounded-[18px] border border-slate-200 bg-black">
                <iframe
                  className="aspect-video w-full"
                  src={toEmbedUrl(experiment.youtubeUrl)}
                  title={experiment.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-[18px] border border-dashed border-slate-300 bg-white text-center">
                <img src={experiment.thumbnail || DEFAULT_THUMBNAIL} alt={experiment.title} className="h-full w-full object-cover" />
                <div className="absolute hidden">Video unavailable</div>
              </div>
            )}
          </div>

          <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
            <div className="mb-4 flex items-center gap-2 text-[#0EA5A8]">
              <BarChart3 className="h-4 w-4" />
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.22em]">About this experiment</span>
            </div>

            <div className="space-y-4 text-sm text-slate-600">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Aim</p>
                <p className="mt-1 leading-6 text-slate-700">{experiment.aim}</p>
              </div>

              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Objective</p>
                <p className="mt-1 leading-6 text-slate-700">{experiment.objective}</p>
              </div>

              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Topics</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {experiment.topics.map((topic) => (
                    <span key={topic} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {experiment.githubUrl && (
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">GitHub Repository</p>
                  <a
                    href={normaliseUrl(experiment.githubUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-[#163B63] transition hover:text-[#0B1F3A]"
                  >
                    <GitBranch className="h-4 w-4" /> View on GitHub <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] md:p-7">
        <div className="mb-5 flex items-center gap-2 text-[#0EA5A8]">
          <Database className="h-4 w-4" />
          <h2 className="text-2xl font-bold text-[#102033]">Sub-Experiments</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <SubExperimentMiniCard title={experiment.experimentA.title} description={experiment.experimentA.description} to={`/experiment/${experiment.id}/a`} />
          <SubExperimentMiniCard title={experiment.experimentB.title} description={experiment.experimentB.description} to={`/experiment/${experiment.id}/b`} />
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] md:p-7">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[#0EA5A8]">
            <Code2 className="h-4 w-4" />
            <h2 className="text-2xl font-bold text-[#102033]">Main To Do & Program</h2>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy code'}
          </button>
        </div>

        <div className="space-y-5">
          <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Aim</p>
            <p className="mt-2 text-slate-700">{experiment.aim}</p>
          </div>

          <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Syntax</p>
            <pre className="mt-2 whitespace-pre-wrap font-mono text-sm leading-6 text-slate-700">{experiment.syntax}</pre>
          </div>

          <div className="rounded-[20px] border border-slate-200 bg-[#0B1F3A] p-4 text-slate-100">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-300">Program</p>
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-sm leading-6 text-slate-100">{experiment.program}</pre>
          </div>

          <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Output</p>
            <p className="mt-2 text-slate-700">{experiment.experimentA.output || 'Results will be summarized here in the workflow.'}</p>
          </div>
        </div>
      </section>
    </div>
  )
}

function SubExperimentMiniCard({ title, description, to }: { title: string; description: string; to: string }) {
  const navigate = useNavigate()

  return (
    <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4 shadow-sm">
      <h3 className="text-xl font-semibold text-[#102033]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <button
        type="button"
        onClick={() => navigate(to)}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0EA5A8] px-3.5 py-2.5 text-sm font-medium text-white transition hover:bg-[#0B8F92]"
      >
        Open
      </button>
    </div>
  )
}

function SubExperimentPage({
  experiments,
  type,
  onSaveProgram,
}: {
  experiments: Experiment[]
  type: 'a' | 'b'
  onSaveProgram: (id: string, type: 'a' | 'b', program: string) => void
}) {
  const { id } = useParams()
  const navigate = useNavigate()
  const individualExperiment = listIndividualExperiments(experiments).find(
    (item) => item.experiment.id === id && item.type === type,
  )

  if (!individualExperiment) {
    return <NotFoundPage />
  }

  const { experiment, section: subExperiment, number } = individualExperiment

  return (
    <div className="space-y-6 pb-10">
      <button
        type="button"
        onClick={() => navigate('/experiments')}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#163B63] transition hover:text-[#0B1F3A]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to all experiments
      </button>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] md:p-7">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Experiment {String(number).padStart(2, '0')}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#102033] md:text-5xl">{subExperiment.title}</h1>
        <p className="mt-2 text-sm font-medium text-slate-500">Part of: {experiment.title}</p>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{subExperiment.description}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <InfoCard title="Aim" content={subExperiment.aim} />
        <InfoCard title="Syntax" content={subExperiment.syntax} />
        <InfoCard title="Output" content={subExperiment.output} />
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-2xl font-bold text-[#102033]">Code editor</h2>
          <p className="mt-1 text-sm text-slate-500">
            Edit, run, and save this experiment&apos;s Python program here.
          </p>
        </div>
        <PythonCodeEditor
          key={`${experiment.id}-${type}`}
          initialCode={subExperiment.program}
          editorLabel={`experiment-${String(number).padStart(2, '0')}.py`}
          onSave={(program) => onSaveProgram(experiment.id, type, program)}
        />
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] md:p-7">
        <div className="flex flex-wrap gap-3">
          {subExperiment.githubUrl && (
            <a href={normaliseUrl(subExperiment.githubUrl)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#0B1F3A] px-3.5 py-2.5 text-sm font-medium text-white transition hover:bg-[#102033]">
              <GitBranch className="h-4 w-4" /> GitHub
            </a>
          )}
          {subExperiment.youtubeUrl && (
            <a href={normaliseUrl(subExperiment.youtubeUrl)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
              <Play className="h-4 w-4" /> YouTube
            </a>
          )}
        </div>
      </section>
    </div>
  )
}

function InfoCard({ title, content, code = false }: { title: string; content: string; code?: boolean }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</p>
      {code ? (
        <pre className="mt-3 whitespace-pre-wrap break-words font-mono text-sm leading-6 text-slate-700">{content}</pre>
      ) : (
        <p className="mt-3 text-base leading-7 text-slate-700">{content}</p>
      )}
    </div>
  )
}

function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-lg rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
        <div className="text-6xl font-bold tracking-tight text-[#0B1F3A]">404</div>
        <h1 className="mt-4 text-3xl font-bold text-[#102033]">Page Not Found</h1>
        <p className="mt-3 text-base text-slate-600">The laboratory page you are looking for doesn't exist.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0EA5A8] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0B8F92]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Laboratory
        </Link>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/80">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-3 px-4 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
        <div>
          <div className="text-lg font-bold text-[#0B1F3A]">Data Science Subject Laboratory</div>
          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Data Science Subject Laboratory – Experiments & Projects
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-slate-500">
          <span>Practical Learning • Data • Research</span>
          <span>•</span>
          <a href="https://github.com/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#163B63] hover:text-[#0B1F3A]">
            GitHub Repository <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </footer>
  )
}

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(92vw,360px)] flex-col gap-2 md:bottom-6 md:right-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.12)]"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0EA5A8]/10 text-[#0EA5A8]">
            <Check className="h-4 w-4" />
          </div>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  )
}

function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  useEffect(() => {
    if (!open) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 px-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.18)]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 md:px-6">
          <h2 className="text-xl font-semibold text-[#102033]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-[#0B1F3A]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto px-5 py-5 md:px-6">{children}</div>
      </div>
    </div>
  )
}

function ProfileModal({
  open,
  profile,
  onClose,
  onSave,
}: {
  open: boolean
  profile: StudentProfile
  onClose: () => void
  onSave: (nextProfile: StudentProfile) => void
}) {
  const [draft, setDraft] = useState<StudentProfile>(profile)

  useEffect(() => {
    setDraft(profile)
  }, [profile, open])

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const accepted = ['image/jpeg', 'image/png', 'image/webp']
    if (!accepted.includes(file.type)) {
      return
    }

    if (file.size > 3 * 1024 * 1024) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setDraft((current) => ({ ...current, photo: String(reader.result ?? '') }))
    }
    reader.readAsDataURL(file)
  }

  return (
    <Modal open={open} title="Edit Student Profile" onClose={onClose}>
      <div className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            {draft.photo ? (
              <img src={draft.photo} alt="Student profile preview" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-500">
                <User className="h-8 w-8" />
              </div>
            )}
          </div>

          <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
            <Upload className="h-4 w-4" /> Choose Photo
            <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleUpload} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" value={draft.name} onChange={(value) => setDraft((current) => ({ ...current, name: value }))} />
          <Field label="Roll No" value={draft.rollNo} onChange={(value) => setDraft((current) => ({ ...current, rollNo: value }))} />
          <Field label="Section" value={draft.section} onChange={(value) => setDraft((current) => ({ ...current, section: value }))} />
          <Field label="Branch" value={draft.branch} onChange={(value) => setDraft((current) => ({ ...current, branch: value }))} />
          <Field label="Attendance (%)" value={draft.attendance ?? ''} onChange={(value) => setDraft((current) => ({ ...current, attendance: value }))} />
          <Field label="Assistant Professor" value={draft.assistantProfessor} onChange={(value) => setDraft((current) => ({ ...current, assistantProfessor: value }))} className="sm:col-span-2" />
          <Field label="GitHub Repository" value={draft.github} onChange={(value) => setDraft((current) => ({ ...current, github: value }))} className="sm:col-span-2" />
          <Field label="LinkedIn / SPOT" value={draft.linkedin} onChange={(value) => setDraft((current) => ({ ...current, linkedin: value }))} className="sm:col-span-2" />
          <Field label="LeetCode Profile" value={draft.leetcode ?? ''} onChange={(value) => setDraft((current) => ({ ...current, leetcode: value }))} className="sm:col-span-2" />
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
            Cancel
          </button>
          <button type="button" onClick={() => onSave(draft)} className="rounded-xl bg-[#0EA5A8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B8F92]">
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  )
}

function Field({
  label,
  value,
  onChange,
  className = '',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0EA5A8] focus:ring-2 focus:ring-[#0EA5A8]/20"
      />
    </label>
  )
}

function ExperimentModal({
  open,
  experiment,
  onClose,
  onSubmit,
}: {
  open: boolean
  experiment: Experiment | null
  onClose: () => void
  onSubmit: (experiment: Experiment) => void
}) {
  const [form, setForm] = useState<ExperimentFormState>(defaultFormState())
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setForm(defaultFormState(experiment ?? undefined))
    setErrors({})
  }, [experiment, open])

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>, field: 'thumbnail') => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const accepted = ['image/jpeg', 'image/png', 'image/webp']
    if (!accepted.includes(file.type)) {
      return
    }

    if (file.size > 3 * 1024 * 1024) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setForm((current) => ({ ...current, [field]: String(reader.result ?? DEFAULT_THUMBNAIL) }))
    }
    reader.readAsDataURL(file)
  }

  const validate = () => {
    const nextErrors: Record<string, string> = {}

    if (!form.title.trim()) nextErrors.title = 'Title is required'
    if (!form.description.trim()) nextErrors.description = 'Description is required'
    if (!form.number || Number(form.number) <= 0) nextErrors.number = 'Experiment number is required'
    if (form.githubUrl && !validateUrl(form.githubUrl)) nextErrors.githubUrl = 'GitHub URL is invalid'
    if (form.youtubeUrl && !validateUrl(form.youtubeUrl)) nextErrors.youtubeUrl = 'YouTube URL is invalid'
    if (form.experimentA.githubUrl && !validateUrl(form.experimentA.githubUrl)) nextErrors.experimentAgithubUrl = 'A GitHub URL is invalid'
    if (form.experimentB.githubUrl && !validateUrl(form.experimentB.githubUrl)) nextErrors.experimentBgithubUrl = 'B GitHub URL is invalid'

    return nextErrors
  }

  const handleSubmit = () => {
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const normalizedExperiment = buildExperiment(form, experiment ?? undefined)
    onSubmit(normalizedExperiment)
  }

  return (
    <Modal open={open} title={experiment ? 'Edit Experiment' : 'Add New Experiment'} onClose={onClose}>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Experiment Number" value={form.number} onChange={(value) => setForm((current) => ({ ...current, number: value }))} />
          <Field label="Title" value={form.title} onChange={(value) => setForm((current) => ({ ...current, title: value }))} />
        </div>

        {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
        {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
        {errors.number && <p className="text-sm text-red-600">{errors.number}</p>}

        <Field label="Description" value={form.description} onChange={(value) => setForm((current) => ({ ...current, description: value }))} />
        <Field label="Aim" value={form.aim} onChange={(value) => setForm((current) => ({ ...current, aim: value }))} />
        <Field label="Objective" value={form.objective} onChange={(value) => setForm((current) => ({ ...current, objective: value }))} />
        <Field label="Topics (comma separated)" value={form.topics} onChange={(value) => setForm((current) => ({ ...current, topics: value }))} />

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="YouTube URL" value={form.youtubeUrl} onChange={(value) => setForm((current) => ({ ...current, youtubeUrl: value }))} />
          <Field label="GitHub URL" value={form.githubUrl} onChange={(value) => setForm((current) => ({ ...current, githubUrl: value }))} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-[#102033]">Media</h3>
            <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
              <Upload className="h-4 w-4" /> Thumbnail
              <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => handleUpload(event, 'thumbnail')} />
            </label>
          </div>

          <img src={form.thumbnail} alt="Experiment preview" className="h-44 w-full rounded-2xl object-cover" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Syntax" value={form.syntax} onChange={(value) => setForm((current) => ({ ...current, syntax: value }))} className="md:col-span-2" />
          <Field label="Program" value={form.program} onChange={(value) => setForm((current) => ({ ...current, program: value }))} className="md:col-span-2" />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <SectionCard title="Experiment A" form={form.experimentA} onChange={(value) => setForm((current) => ({ ...current, experimentA: value }))} />
          <SectionCard title="Experiment B" form={form.experimentB} onChange={(value) => setForm((current) => ({ ...current, experimentB: value }))} />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} className="rounded-xl bg-[#0EA5A8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B8F92]">
            {experiment ? 'Save changes' : 'Create Experiment'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

function SectionCard({
  title,
  form,
  onChange,
}: {
  title: string
  form: {
    title: string
    description: string
    aim: string
    syntax: string
    program: string
    output: string
    youtubeUrl: string
    githubUrl: string
  }
  onChange: (next: typeof form) => void
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="mb-4 text-base font-semibold text-[#102033]">{title}</h3>
      <div className="space-y-3">
        <Field label="Title" value={form.title} onChange={(value) => onChange({ ...form, title: value })} />
        <Field label="Description" value={form.description} onChange={(value) => onChange({ ...form, description: value })} />
        <Field label="Aim" value={form.aim} onChange={(value) => onChange({ ...form, aim: value })} />
        <Field label="Syntax" value={form.syntax} onChange={(value) => onChange({ ...form, syntax: value })} />
        <Field label="Program" value={form.program} onChange={(value) => onChange({ ...form, program: value })} />
        <Field label="Output" value={form.output} onChange={(value) => onChange({ ...form, output: value })} />
        <Field label="YouTube URL" value={form.youtubeUrl} onChange={(value) => onChange({ ...form, youtubeUrl: value })} />
        <Field label="GitHub URL" value={form.githubUrl} onChange={(value) => onChange({ ...form, githubUrl: value })} />
      </div>
    </div>
  )
}

function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <Modal open={open} title="Delete Experiment?" onClose={onClose}>
      <div className="space-y-5">
        <p className="text-base text-slate-600">Are you sure you want to permanently delete this experiment?</p>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500">
            Delete Experiment
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default App
