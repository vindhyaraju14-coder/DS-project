import type { Experiment, ExperimentSection, StudentProfile } from '../types'

export const defaultProfile: StudentProfile = {
  name: 'N.Vindhya sree',
  rollNo: '24102A030082',
  section: 'DS-2',
  branch: 'Data Science',
  assistantProfessor: 'S.bosubabu',
  photo: `${import.meta.env.BASE_URL}student-photo.jpe`,
  github: 'https://github.com/',
  githubProfile: 'https://github.com/',
  linkedin: 'https://www.linkedin.com/',
  leetcode: 'https://leetcode.com/',
  attendance: '95%',
}

const pandasFormatProgram = (
  title: string,
  description: string,
  syntax: string,
  program: string,
): ExperimentSection => ({
  title,
  description,
  aim: description,
  syntax,
  program,
  output: '',
  youtubeUrl: '',
  githubUrl: '',
})

const dataFormatPrograms: ExperimentSection[] = [
  pandasFormatProgram(
    'Read a CSV File',
    'Load comma-separated data into a DataFrame with read_csv.',
    'pd.read_csv()',
    `import pandas as pd
from io import StringIO

csv_data = """name,score
Asha,86
Ravi,91"""
df = pd.read_csv(StringIO(csv_data))
print(df)`,
  ),
  pandasFormatProgram(
    'Write a CSV File',
    'Export a DataFrame to comma-separated text with to_csv.',
    'DataFrame.to_csv()',
    `import pandas as pd
from io import StringIO

df = pd.DataFrame({"name": ["Asha", "Ravi"], "score": [86, 91]})
csv_file = StringIO()
df.to_csv(csv_file, index=False)
print(csv_file.getvalue())`,
  ),
  pandasFormatProgram(
    'Read an Excel Workbook',
    'Load worksheet data from an Excel file with read_excel. Excel support requires an engine such as openpyxl.',
    'pd.read_excel()',
    `import pandas as pd

# Place students.xlsx in the working directory.
df = pd.read_excel("students.xlsx", sheet_name="Sheet1")
print(df.head())`,
  ),
  pandasFormatProgram(
    'Write an Excel Workbook',
    'Save DataFrame data to an Excel worksheet with to_excel. Excel support requires an engine such as openpyxl.',
    'DataFrame.to_excel()',
    `import pandas as pd

df = pd.DataFrame({"name": ["Asha", "Ravi"], "score": [86, 91]})
df.to_excel("students.xlsx", index=False, sheet_name="Scores")
print("Workbook saved")`,
  ),
  pandasFormatProgram(
    'Read JSON Records',
    'Parse JSON records into tabular data with read_json.',
    'pd.read_json()',
    `import pandas as pd
from io import StringIO

json_data = '[{"name":"Asha","score":86},{"name":"Ravi","score":91}]'
df = pd.read_json(StringIO(json_data))
print(df)`,
  ),
  pandasFormatProgram(
    'Write JSON Records',
    'Serialize a DataFrame as JSON records with to_json.',
    'DataFrame.to_json()',
    `import pandas as pd

df = pd.DataFrame({"name": ["Asha", "Ravi"], "score": [86, 91]})
json_text = df.to_json(orient="records", indent=2)
print(json_text)`,
  ),
  pandasFormatProgram(
    'Read an HTML Table',
    'Extract tables from HTML markup with read_html. This needs an HTML parser such as lxml.',
    'pd.read_html()',
    `import pandas as pd
from io import StringIO

html = """<table><tr><th>name</th><th>score</th></tr>
<tr><td>Asha</td><td>86</td></tr></table>"""
tables = pd.read_html(StringIO(html))
print(tables[0])`,
  ),
  pandasFormatProgram(
    'Read Data from SQLite',
    'Load query results from a SQLite database into a DataFrame.',
    'pd.read_sql_query()',
    `import pandas as pd
import sqlite3

connection = sqlite3.connect(":memory:")
connection.execute("CREATE TABLE scores (name TEXT, score INTEGER)")
connection.executemany("INSERT INTO scores VALUES (?, ?)", [("Asha", 86), ("Ravi", 91)])
df = pd.read_sql_query("SELECT * FROM scores", connection)
print(df)
connection.close()`,
  ),
  pandasFormatProgram(
    'Write Data to SQLite',
    'Store DataFrame rows in a SQLite table with to_sql.',
    'DataFrame.to_sql()',
    `import pandas as pd
import sqlite3

df = pd.DataFrame({"name": ["Asha", "Ravi"], "score": [86, 91]})
connection = sqlite3.connect(":memory:")
df.to_sql("scores", connection, index=False, if_exists="replace")
print(pd.read_sql_query("SELECT * FROM scores", connection))
connection.close()`,
  ),
  pandasFormatProgram(
    'Read JSON Lines',
    'Load newline-delimited JSON records using read_json with lines enabled.',
    'pd.read_json(lines=True)',
    `import pandas as pd
from io import StringIO

json_lines = '{"name":"Asha","score":86}\\n{"name":"Ravi","score":91}'
df = pd.read_json(StringIO(json_lines), lines=True)
print(df)`,
  ),
]

const webApiPrograms: ExperimentSection[] = [
  pandasFormatProgram(
    'Send a GET Request',
    'Request JSON data from a public web API and inspect the HTTP response.',
    'urllib.request.urlopen()',
    `import json
from urllib.request import urlopen

url = "https://jsonplaceholder.typicode.com/users/1"
with urlopen(url) as response:
    user = json.load(response)

print("Name:", user["name"])
print("Email:", user["email"])`,
  ),
  pandasFormatProgram(
    'Request API Data with Query Parameters',
    'Build a URL with query parameters and retrieve a filtered API response.',
    'urllib.parse.urlencode()',
    `import json
from urllib.parse import urlencode
from urllib.request import urlopen

params = urlencode({"userId": 1})
url = f"https://jsonplaceholder.typicode.com/posts?{params}"
with urlopen(url) as response:
    posts = json.load(response)

print("Posts returned:", len(posts))
print("First title:", posts[0]["title"])`,
  ),
  pandasFormatProgram(
    'Convert API JSON to a DataFrame',
    'Normalize a list of JSON objects returned by an API into a Pandas DataFrame.',
    'pd.json_normalize()',
    `import json
import pandas as pd
from urllib.request import urlopen

url = "https://jsonplaceholder.typicode.com/users"
with urlopen(url) as response:
    users = json.load(response)

users_df = pd.json_normalize(users)
print(users_df[["id", "name", "email"]].head())`,
  ),
]

const dataCleaningPrograms: ExperimentSection[] = [
  pandasFormatProgram(
    'Inspect and Select Data',
    'Inspect a DataFrame and select the rows and columns needed for analysis.',
    'DataFrame.head()\nDataFrame.info()\nDataFrame.loc[]',
    `import pandas as pd

df = pd.DataFrame({
    "name": ["Asha", "Ravi", "Mina"],
    "score": [86, None, 92],
    "city": ["North", "South", "North"],
})
print(df.head())
print("Missing values:")
print(df.isna().sum())
print(df[["name", "score"]])`,
  ),
  pandasFormatProgram(
    'Handle Missing Values',
    'Fill missing numeric values and remove rows that still have incomplete fields.',
    'DataFrame.fillna()\nDataFrame.dropna()',
    `import pandas as pd

df = pd.DataFrame({"score": [86, None, 92, 78]})
df["score"] = df["score"].fillna(df["score"].mean())
print(df)
print("Missing values remaining:", int(df.isna().sum().sum()))`,
  ),
  pandasFormatProgram(
    'Remove Duplicates and Normalize Text',
    'Remove duplicate records and standardize text values before analysis.',
    'DataFrame.drop_duplicates()\nSeries.str.strip()',
    `import pandas as pd

df = pd.DataFrame({
    "name": [" Asha ", "Ravi", " Asha "],
    "score": [86, 91, 86],
})
df["name"] = df["name"].str.strip().str.title()
cleaned = df.drop_duplicates().reset_index(drop=True)
print(cleaned)`,
  ),
]

export const defaultExperiment: Experiment = {
  id: 'time-series-analysis',
  number: 1,
  title: 'Different Data Formats Using Pandas',
  description:
    'Practice reading and writing common data formats with Pandas, including CSV, Excel, JSON, HTML, SQL, Parquet, and fixed-width text.',
  thumbnail:
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  youtubeUrl: 'https://www.youtube.com/watch?v=E5W4Lvl0Ar0',
  githubUrl: 'https://github.com/',
  aim: 'To understand how Pandas imports and exports data across common file and database formats.',
  objective:
    'Use Pandas readers and writers to move data between DataFrames, text formats, workbooks, HTML tables, and SQLite.',
  topics: ['Pandas', 'CSV', 'Excel', 'JSON', 'HTML', 'SQL', 'Parquet', 'Data Formats'],
  syntax: 'pd.read_csv()\npd.read_json()\npd.read_excel()\nDataFrame.to_csv()\nDataFrame.to_json()',
  program: `import pandas as pd
from io import StringIO

csv_data = """name,score
Asha,86
Ravi,91"""
df = pd.read_csv(StringIO(csv_data))
print(df)
print(df.to_json(orient="records"))`,
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
  subPrograms: dataFormatPrograms,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const additionalExperiments: Experiment[] = [
  {
    id: 'web-api-interaction',
    number: 2,
    title: 'Interacting with Web APIs',
    description:
      'Retrieve structured data from web APIs, work with request parameters, and convert JSON responses into analysis-ready tables.',
    thumbnail:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    youtubeUrl: '',
    githubUrl: '',
    aim: 'To learn how to request data from web APIs and prepare JSON responses for analysis.',
    objective:
      'Send GET requests, pass query parameters, inspect JSON responses, and normalize API records into a Pandas DataFrame.',
    topics: ['Web APIs', 'HTTP GET', 'JSON', 'urllib', 'Pandas'],
    syntax: 'urlopen()\njson.load()\nurlencode()\npd.json_normalize()',
    program: webApiPrograms[0].program,
    experimentA: webApiPrograms[0],
    experimentB: webApiPrograms[1],
    subPrograms: webApiPrograms,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'data-cleaning-missing-values',
    number: 3,
    title: 'Data Cleaning and Preparation',
    description:
      'Prepare a dataset for analysis by inspecting its structure, handling missing values, standardizing fields, and removing duplicate records.',
    thumbnail:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    youtubeUrl: '',
    githubUrl: '',
    aim: 'To prepare raw data for reliable analysis with Pandas data-quality and cleaning operations.',
    objective:
      'Inspect a DataFrame, handle missing values, standardize text, and remove duplicate records.',
    topics: ['Data Cleaning', 'Data Preparation', 'Missing Values', 'Duplicates', 'Pandas'],
    syntax: 'DataFrame.isna()\nDataFrame.fillna()\nDataFrame.drop_duplicates()',
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
    subPrograms: dataCleaningPrograms,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'descriptive-statistics',
    number: 4,
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
    number: 5,
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
    number: 6,
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
    number: 7,
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
