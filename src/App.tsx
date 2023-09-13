import { useState } from 'react';
import './App.css';

import { Editor } from './tiptap';
import { createPortal } from 'react-dom';

function App() {
  const [saveStatus, setSaveStatus] = useState('Saved');

  createPortal(<p>asddwqd qwdqwdqwdjwqdojqwoijfowqijfoiqwjdoiwqjdoiqwjdoijwqoidj </p>, document.body);

  return (
    <div className=" dark:bg-black flex justify-center p-12">
      <div className="relative w-full max-w-screen-lg">
        {/* 状态栏 */}
        <div className="absolute right-5 top-5 z-10 mb-5 rounded-lg bg-stone-100 px-2 py-1 text-sm text-stone-400">
          {saveStatus}
        </div>
        {/* 编辑器 */}
        <Editor
          onUpdate={() => {
            setSaveStatus('Unsaved');
            console.log('unsave');
          }}
          onDebouncedUpdate={() => {
            setSaveStatus('Saving...');
            setTimeout(() => {
              setSaveStatus('Saved');
            }, 500);
          }}
        />
      </div>
    </div>
  );
}

export default App;
