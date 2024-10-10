import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';

export const languageExtensions = {
    Python: python,
    Java: java,
    C: cpp,
    cpp: cpp,
    JavaScript: javascript,
    TypeScript: javascript,
};

export const defaultLanguage = python;