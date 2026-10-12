import type { Experiment, StudentProfile } from '../types'

export const defaultProfile: StudentProfile = {
  name: 'N.Vindhya sree',
  rollNo: 'DS-2024-017',
  section: 'DS-2',
  branch: 'Data Science',
  assistantProfessor: 'S.bosubabu',
  photo:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  github: 'https://github.com/',
  githubProfile: 'https://github.com/',
  linkedin: 'https://www.linkedin.com/',
  leetcode: 'https://leetcode.com/',
  attendance: '95%',
}

export const defaultExperiment: Experiment = {
  id: 'time-series-analysis',
  number: 1,
  title: 'Time Series Analysis',
  description:
    'Time Series Analysis in Pandas deals with organizing, manipulating and analyzing data based on time.',
  thumbnail:
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  youtubeUrl: 'https://www.youtube.com/watch?v=E5W4Lvl0Ar0',
  githubUrl: 'https://github.com/',
  aim: 'To understand and implement time-series data analysis using Python and Pandas.',
  objective:
    'To explore date parsing, timestamp indexing, and frequency-based time-series operations for analytical research workflows.',
  topics: ['Datetime', 'Timestamp', 'Date Range', 'Time Series', 'Periods', 'Time Zones', 'Resampling'],
  syntax: 'pd.to_datetime()\npd.Series()\npd.date_range()',
  program: `import pandas as pd

# Create time-indexed data
series_dates = pd.to_datetime([
    "2024-01-01 00:00:00",
    "2024-01-01 01:00:00",
    "2024-01-01 02:00:00",
    "2024-01-01 03:00:00",
    "2024-01-01 04:00:00",
])

values = [10, 15, 12, 18, 20]
series = pd.Series(values, index=series_dates)
print(series)
print(series.resample('2H').mean())`,
  experimentA: {
    title: 'Create Time Series Using Datetime',
    description: 'Create a timestamp-indexed time series using Python datetime objects and Pandas.',
    aim: 'To create a time series in Pandas using datetime objects and use timestamps as the index.',
    syntax: 'pd.to_datetime()\npd.Series()',
    program: `import pandas as pd

dates = pd.to_datetime([
    "2024-01-01 00:00:00",
    "2024-01-01 01:00:00",
    "2024-01-01 02:00:00",
    "2024-01-01 03:00:00",
    "2024-01-01 04:00:00",
])

values = [10, 15, 12, 18, 20]
series = pd.Series(values, index=dates)

print(series)`,
    output: 'A series object indexed by datetime values for time-based analytics.',
    youtubeUrl: '',
    githubUrl: '',
  },
  experimentB: {
    title: 'Generate DateTimeIndex Using date_range',
    description: 'Generate a sequence of evenly spaced timestamps using Pandas date_range.',
    aim: 'To create a DatetimeIndex with a specified number of timestamps and frequency.',
    syntax: 'pd.date_range()',
    program: `import pandas as pd

dates = pd.date_range(
    start="2024-01-01",
    periods=10,
    freq="D"
)

print(dates)`,
    output: 'A DatetimeIndex spanning multiple daily timestamps for time-series analysis.',
    youtubeUrl: '',
    githubUrl: '',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const additionalExperiments: Experiment[] = [
  {
    id: 'data-cleaning-missing-values',
    number: 2,
    title: 'Data Cleaning and Missing Values',
    description:
      'Prepare a small dataset for analysis by identifying missing values, filling them with suitable values, and removing duplicate records.',
    thumbnail:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    youtubeUrl: '',
    githubUrl: '',
    aim: 'To learn basic data-quality checks and cleaning techniques using Python.',
    objective:
      'Inspect a dataset for incomplete and duplicate records, apply a consistent cleaning strategy, and compare the dataset before and after cleaning.',
    topics: ['Data Cleaning', 'Missing Values', 'Duplicates', 'Data Quality'],
    syntax: 'row.get()\nlist comprehension\nset()',
    program: `students = [
    {"name": "Asha", "score": 86},
    {"name": "Ravi", "score": None},
    {"name": "Mina", "score": 92},
    {"name": "Ravi", "score": None},
]

# Remove duplicate records
unique_students = []
seen = set()
for student in students:
    record = (student["name"], student["score"])
    if record not in seen:
        seen.add(record)
        unique_students.append(student)

# Replace missing scores with the mean of available scores
scores = [row["score"] for row in unique_students if row["score"] is not None]
mean_score = sum(scores) / len(scores)
for student in unique_students:
    if student["score"] is None:
        student["score"] = mean_score

print("Cleaned data:", unique_students)
print("Mean score:", round(mean_score, 2))`,
    experimentA: {
      title: 'Identify Missing Values',
      description: 'Find records with missing scores and calculate the proportion of incomplete records.',
      aim: 'To detect missing values before choosing a cleaning method.',
      syntax: 'value is None\nsum()\nlen()',
      program: `scores = [86, None, 92, 78, None]
missing_count = sum(score is None for score in scores)
missing_percent = missing_count / len(scores) * 100

print("Missing values:", missing_count)
print("Missing percentage:", round(missing_percent, 1), "%")`,
      output: 'The missing-value count and percentage are displayed.',
      youtubeUrl: '',
      githubUrl: '',
    },
    experimentB: {
      title: 'Fill Missing Values with the Mean',
      description: 'Replace missing numeric values with the mean of the available observations.',
      aim: 'To demonstrate a simple imputation method for a numeric feature.',
      syntax: 'sum()\nlist comprehension',
      program: `scores = [86, None, 92, 78, None]
available = [score for score in scores if score is not None]
mean_score = sum(available) / len(available)
cleaned = [mean_score if score is None else score for score in scores]

print("Mean:", round(mean_score, 2))
print("Cleaned scores:", [round(score, 2) for score in cleaned])`,
      output: 'Missing scores are replaced with the mean of the observed scores.',
      youtubeUrl: '',
      githubUrl: '',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'descriptive-statistics',
    number: 3,
    title: 'Descriptive Statistics',
    description:
      'Summarize a dataset using measures of central tendency and spread, including mean, median, range, and standard deviation.',
    thumbnail:
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80',
    youtubeUrl: '',
    githubUrl: '',
    aim: 'To describe the important characteristics of a numerical dataset with summary statistics.',
    objective:
      'Calculate and interpret the mean, median, range, and population standard deviation for a set of observations.',
    topics: ['Statistics', 'Mean', 'Median', 'Range', 'Standard Deviation'],
    syntax: 'sum()\nsorted()\nstatistics.mean()\nstatistics.median()',
    program: `from statistics import mean, median, pstdev

marks = [72, 85, 91, 68, 79, 95, 80]

print("Count:", len(marks))
print("Mean:", round(mean(marks), 2))
print("Median:", median(marks))
print("Range:", max(marks) - min(marks))
print("Population standard deviation:", round(pstdev(marks), 2))`,
    experimentA: {
      title: 'Calculate Mean and Median',
      description: 'Compare the arithmetic mean and median of a small dataset.',
      aim: 'To calculate and distinguish two common measures of central tendency.',
      syntax: 'statistics.mean()\nstatistics.median()',
      program: `from statistics import mean, median

values = [12, 15, 18, 20, 100]
print("Mean:", mean(values))
print("Median:", median(values))`,
      output: 'The mean and median are printed for comparison; the outlier affects the mean more strongly.',
      youtubeUrl: '',
      githubUrl: '',
    },
    experimentB: {
      title: 'Measure Data Spread',
      description: 'Find the range and standard deviation to understand how widely observations vary.',
      aim: 'To quantify variability in a numeric dataset.',
      syntax: 'max() - min()\nstatistics.pstdev()',
      program: `from statistics import pstdev

values = [12, 15, 18, 20, 25]
data_range = max(values) - min(values)
spread = pstdev(values)

print("Range:", data_range)
print("Population standard deviation:", round(spread, 2))`,
      output: 'The range and population standard deviation summarize the spread of the values.',
      youtubeUrl: '',
      githubUrl: '',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'correlation-analysis',
    number: 4,
    title: 'Correlation Analysis',
    description:
      'Measure the direction and strength of the relationship between two numerical variables using Pearson correlation.',
    thumbnail:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    youtubeUrl: '',
    githubUrl: '',
    aim: 'To study the linear relationship between two variables using the Pearson correlation coefficient.',
    objective:
      'Calculate a correlation coefficient from paired observations and interpret its sign and magnitude without assuming that correlation proves causation.',
    topics: ['Correlation', 'Pearson Coefficient', 'Variables', 'Data Interpretation'],
    syntax: 'sum()\nzip()\nmath.sqrt()',
    program: `from math import sqrt

study_hours = [1, 2, 3, 4, 5]
marks = [52, 58, 67, 73, 85]

mean_x = sum(study_hours) / len(study_hours)
mean_y = sum(marks) / len(marks)
numerator = sum((x - mean_x) * (y - mean_y) for x, y in zip(study_hours, marks))
sum_x = sum((x - mean_x) ** 2 for x in study_hours)
sum_y = sum((y - mean_y) ** 2 for y in marks)
correlation = numerator / sqrt(sum_x * sum_y)

print("Pearson correlation:", round(correlation, 3))`,
    experimentA: {
      title: 'Compare Two Variables',
      description: 'Create paired observations and inspect whether both variables move in the same direction.',
      aim: 'To organize paired measurements before computing their relationship.',
      syntax: 'zip()\nlist()',
      program: `hours = [1, 2, 3, 4, 5]
marks = [52, 58, 67, 73, 85]
pairs = list(zip(hours, marks))

for hour, mark in pairs:
    print(f"Study hours: {hour}, marks: {mark}")`,
      output: 'The paired observations are printed for inspection.',
      youtubeUrl: '',
      githubUrl: '',
    },
    experimentB: {
      title: 'Interpret Correlation',
      description: 'Calculate a Pearson correlation coefficient and interpret its direction.',
      aim: 'To quantify the direction and strength of a linear association.',
      syntax: 'sum()\nzip()\nmath.sqrt()',
      program: `from math import sqrt

x = [1, 2, 3, 4, 5]
y = [52, 58, 67, 73, 85]
mx, my = sum(x) / len(x), sum(y) / len(y)
numerator = sum((a - mx) * (b - my) for a, b in zip(x, y))
denominator = sqrt(sum((a - mx) ** 2 for a in x) * sum((b - my) ** 2 for b in y))
r = numerator / denominator

print("r =", round(r, 3))
print("Positive association" if r > 0 else "Negative association")`,
      output: 'A positive coefficient indicates that the variables tend to increase together; it does not establish causation.',
      youtubeUrl: '',
      githubUrl: '',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'exploratory-data-analysis',
    number: 5,
    title: 'Exploratory Data Analysis',
    description:
      'Explore a small dataset by checking its structure, summarizing numeric values, counting categories, and identifying data-quality issues before modeling.',
    thumbnail:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    youtubeUrl: '',
    githubUrl: '',
    aim: 'To practice a repeatable first-pass workflow for understanding a new dataset.',
    objective:
      'Inspect a dataset, calculate descriptive summaries, identify missing values and category counts, and record questions for further analysis.',
    topics: ['Exploratory Analysis', 'Data Profiling', 'Summary Statistics', 'Data Quality'],
    syntax: 'len()\nset()\nsum()\nmin()\nmax()',
    program: `records = [
    {"city": "North", "temperature": 28, "rain": 2},
    {"city": "South", "temperature": 32, "rain": 0},
    {"city": "North", "temperature": 25, "rain": 5},
    {"city": "East", "temperature": 30, "rain": 1},
]

temperatures = [row["temperature"] for row in records]
city_counts = {}
for row in records:
    city_counts[row["city"]] = city_counts.get(row["city"], 0) + 1

print("Rows:", len(records))
print("Cities:", city_counts)
print("Temperature range:", min(temperatures), "to", max(temperatures))
print("Mean temperature:", round(sum(temperatures) / len(temperatures), 1))`,
    experimentA: {
      title: 'Profile Numeric Columns',
      description: 'Calculate count, minimum, maximum, and mean for a numeric field.',
      aim: 'To create a compact numerical profile before selecting further analysis methods.',
      syntax: 'len()\nmin()\nmax()\nsum()',
      program: `values = [28, 32, 25, 30, 27]
print("Count:", len(values))
print("Minimum:", min(values))
print("Maximum:", max(values))
print("Mean:", round(sum(values) / len(values), 2))`,
      output: 'The count and basic range and center of the values are shown.',
      youtubeUrl: '',
      githubUrl: '',
    },
    experimentB: {
      title: 'Count Categories and Check Missing Values',
      description: 'Count category frequencies and locate missing values in a field.',
      aim: 'To identify category imbalance and incomplete records.',
      syntax: 'dict.get()\nvalue is None',
      program: `cities = ["North", "South", "North", None, "East", "North"]
counts = {}
for city in cities:
    if city is not None:
        counts[city] = counts.get(city, 0) + 1

missing = sum(city is None for city in cities)
print("Category counts:", counts)
print("Missing values:", missing)`,
      output: 'Category frequencies and the missing-value count are displayed.',
      youtubeUrl: '',
      githubUrl: '',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'simple-linear-regression',
    number: 6,
    title: 'Simple Linear Regression',
    description:
      'Fit a simple least-squares line to paired observations and use it to make a basic prediction while discussing residuals and limitations.',
    thumbnail:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    youtubeUrl: '',
    githubUrl: '',
    aim: 'To understand how a linear model describes the relationship between one input variable and a numeric outcome.',
    objective:
      'Calculate the slope and intercept from paired values, predict an outcome within the observed range, and discuss residuals and the difference between association and causation.',
    topics: ['Regression', 'Least Squares', 'Prediction', 'Residuals', 'Model Limitations'],
    syntax: 'zip()\nsum()\nmin()\nmax()',
    program: `study_hours = [1, 2, 3, 4, 5]
marks = [52, 58, 67, 73, 85]
n = len(study_hours)
mean_x = sum(study_hours) / n
mean_y = sum(marks) / n

slope = sum((x - mean_x) * (y - mean_y)
            for x, y in zip(study_hours, marks)) / sum((x - mean_x) ** 2 for x in study_hours)
intercept = mean_y - slope * mean_x
prediction = intercept + slope * 4.5

print("Slope:", round(slope, 2))
print("Intercept:", round(intercept, 2))
print("Predicted marks at 4.5 hours:", round(prediction, 1))`,
    experimentA: {
      title: 'Estimate the Regression Line',
      description: 'Calculate the least-squares slope and intercept from paired numeric data.',
      aim: 'To fit a straight line that summarizes the relationship between an input and outcome.',
      syntax: 'zip()\nsum()',
      program: `x = [1, 2, 3, 4, 5]
y = [52, 58, 67, 73, 85]
mx, my = sum(x) / len(x), sum(y) / len(y)
slope = sum((a - mx) * (b - my) for a, b in zip(x, y)) / sum((a - mx) ** 2 for a in x)
intercept = my - slope * mx

print("y =", round(intercept, 2), "+", round(slope, 2), "* x")`,
      output: 'The fitted line is represented by its intercept and slope.',
      youtubeUrl: '',
      githubUrl: '',
    },
    experimentB: {
      title: 'Predict and Inspect Residuals',
      description: 'Generate predictions and calculate residuals to inspect model errors.',
      aim: 'To compare observed outcomes with values predicted by a fitted line.',
      syntax: 'zip()\nlist comprehension',
      program: `x = [1, 2, 3, 4, 5]
y = [52, 58, 67, 73, 85]
slope, intercept = 8.1, 43.0
predictions = [intercept + slope * value for value in x]
residuals = [actual - predicted for actual, predicted in zip(y, predictions)]

print("Predictions:", [round(value, 1) for value in predictions])
print("Residuals:", [round(value, 1) for value in residuals])`,
      output: 'Residuals show the difference between observed and predicted values; patterns may indicate that a line is not a good fit.',
      youtubeUrl: '',
      githubUrl: '',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const defaultExperiments = [defaultExperiment, ...additionalExperiments]
