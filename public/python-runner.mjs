import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v314.0.6/full/pyodide.mjs';

const pyodideReady = loadPyodide();

self.onmessage = async (event) => {
  try {
    const pyodide = await pyodideReady;
    pyodide.globals.set('USER_CODE', event.data.code);
    const raw = await pyodide.runPythonAsync(`
import contextlib
import io
import json
import traceback

stream = io.StringIO()
error = None

try:
    with contextlib.redirect_stdout(stream):
        exec(USER_CODE, {})
except Exception:
    error = traceback.format_exc(limit=1).strip()

json.dumps({"output": stream.getvalue(), "error": error})
    `);
    self.postMessage(JSON.parse(raw));
  } catch (error) {
    self.postMessage({ output: '', error: error instanceof Error ? error.message : String(error) });
  }
};
