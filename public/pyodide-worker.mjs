import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v314.0.6/full/pyodide.mjs';

const pyodideReady = loadPyodide();

self.onmessage = async (event) => {
  try {
    const pyodide = await pyodideReady;
    pyodide.globals.set('USER_CODE', event.data.code);
    const raw = await pyodide.runPythonAsync(`
import json

namespace = {}
checks = []

try:
    exec(USER_CODE, namespace)
    candidate = namespace.get("count_errors")
    if not callable(candidate):
        raise AssertionError("Define a function named count_errors(lines).")

    cases = [
        ("Counts mixed logs", ["INFO ready", "ERROR disk full", "ERROR timeout"], 2),
        ("Ignores non-errors", ["INFO ready", "WARN slow"], 0),
        ("Handles empty input", [], 0),
    ]

    for name, value, expected in cases:
        try:
            actual = candidate(value)
            checks.append({
                "name": name,
                "passed": actual == expected,
                "detail": None if actual == expected else f"Expected {expected}, received {actual!r}",
            })
        except Exception as error:
            checks.append({"name": name, "passed": False, "detail": f"{type(error).__name__}: {error}"})
except Exception as error:
    checks.append({"name": "Loads your solution", "passed": False, "detail": f"{type(error).__name__}: {error}"})

json.dumps({"checks": checks})
    `);
    self.postMessage(JSON.parse(raw));
  } catch (error) {
    self.postMessage({ error: error instanceof Error ? error.message : String(error) });
  }
};
