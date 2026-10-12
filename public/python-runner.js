const pyodideBaseUrl = 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/'

self.onmessage = async (event) => {
  try {
    importScripts(`${pyodideBaseUrl}pyodide.js`)
    const pyodide = await self.loadPyodide({ indexURL: pyodideBaseUrl })
    self.postMessage({ type: 'status' })

    pyodide.runPython('import io, sys\n_ds_lab_output = io.StringIO()\nsys.stdout = _ds_lab_output\nsys.stderr = _ds_lab_output')

    let error = ''
    try {
      await pyodide.runPythonAsync(event.data)
    } catch (executionError) {
      error = String(executionError)
    }

    const output = pyodide.runPython('_ds_lab_output.getvalue()')
    self.postMessage({ type: 'result', output, error })
  } catch (runtimeError) {
    self.postMessage({
      type: 'result',
      output: '',
      error: `Unable to load Python runtime: ${String(runtimeError)}. Check your internet connection and try again.`,
    })
  }
}
