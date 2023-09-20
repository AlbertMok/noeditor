export const defaultEditorContent = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Introducing Novel' }]
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'editor'
        },
        {
          type: 'text',
          text: '这是一个编辑器'
        },
        { type: 'text', text: '.' }
      ]
    }
  ]
};
