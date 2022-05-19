import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from "@codemirror/view"
import { javascript } from '@codemirror/lang-javascript';


const jBeautify = require('js-beautify').js;

const WebRTCServerEntryForm = (props) => {
  const {
    newRequestBody: { bodyContent },
    newRequestBody: { bodyIsNew },

    warningMessage,
  } = props;

  const [cmValue, setValue] = useState('');

  const isDark = useSelector((state) => state.ui.isDark);

  useEffect(() => {
    if (!bodyIsNew)
      setValue(
        jBeautify(JSON.stringify(bodyContent.iceConfiguration.iceServers))
      );
  }, [bodyContent, bodyIsNew]);

  return (
    <div className="mt-3">
      {warningMessage ? <div>{warningMessage.body}</div> : null}
      <div className="composer-section-title">TURN or STUN Servers</div>
      <div className={`is-neutral-200-box p-3 ${isDark ? 'is-dark-400' : ''}`}>
        <CodeMirror
          value={cmValue}
          extensions={[
            javascript(),
            EditorView.lineWrapping,
          ]}
          theme = "dark"
          height="100%"
          width = "100%"
        />
      </div>
    </div>
  );
};

export default WebRTCServerEntryForm;
