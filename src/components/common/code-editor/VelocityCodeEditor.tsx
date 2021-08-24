import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { withPlaceholder } from '../form/withPlaceholder';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/velocity/velocity';
import 'codemirror/addon/display/placeholder';
import './VelocityCodeEditor.scss';

export const VelocityCodeEditor = ({ value, lineNumbers = false, placeholder, onChange }) => (
  <CodeMirror
    value={value}
    options={{
      mode: 'velocity',
      theme: 'default',
      lineNumbers,
      placeholder
    }}
    autoCursor={false}
    onChange={(editor, data, value) => onChange(value)}
  />
);

export const VelocityCodeEditorWithPlaceholder = withPlaceholder(VelocityCodeEditor);
