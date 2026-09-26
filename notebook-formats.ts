/** Editorial format is independent of subject, publication state and evidence strength. */
export const notebookFormats = {
 lab: { label: 'Lab notebook', description: 'Questions, methods, observations and their limits.', closing: 'Conclusion', scope: 'Scope & open questions' },
 lookbook: { label: 'Lookbook', description: 'References, visual studies and the ideas they shape.', closing: 'Closing reflection', scope: 'Where the idea goes next' },
 thematic: { label: 'Thematic notebook', description: 'A thread of ideas, sources and connections.', closing: 'Closing thought', scope: 'Questions still open' },
 experimental: { label: 'Experimental notebook', description: 'Propositions and trials still taking shape.', closing: 'Where this leaves the experiment', scope: 'What remains to try' },
} as const;
export type NotebookFormat = keyof typeof notebookFormats;
