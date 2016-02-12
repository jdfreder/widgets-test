import { NotebookBackend } from './backends/notebook';

export function load_ipython_extension () {
  if (!(typeof window !== 'undefined' && window.Jupyter)) {
    throw new Error('global Jupyter variable not found');
  }

  const backend = new NotebookBackend(window.Jupyter);
}
