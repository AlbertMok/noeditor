import { ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  MessageSquarePlus,
  Text,
  TextQuote,
  Image as ImageIcon,
  Code,
  ListTodo
} from 'lucide-react';
import { Editor, Range } from '@tiptap/core';
import { startImageUpload } from '../../image-extention/UploadImage';
import { PopoverContent } from '@radix-ui/react-popover';

type selectMenuProps = { editor: Editor };

export function SelectMenu({ editor }: selectMenuProps) {
  const range = { from: editor.state.selection.from, to: editor.state.selection.to };
  return (
    <PopoverContent className="popover" side="left" align="start" alignOffset={0}>
      <CommandList items={getSuggestionItems({ editor: editor, range: range })} />{' '}
    </PopoverContent>
  );
}

interface CommandItemProps {
  title: string;
  description: string;
  icon: ReactNode;
  searchTerms: string[];
  command: any;
}

interface CommandProps {
  editor: Editor;
  range: Range;
}

const getSuggestionItems = ({ editor, range }: CommandProps) => {
  const items = [
    // {
    //   title: 'Continue writing',
    //   description: 'Use AI to expand your thoughts.',
    //   searchTerms: ['gpt'],
    //   icon: <Sparkles className="w-7 h-7" />
    // },
    {
      title: 'Send Feedback',
      description: 'Let us know how we can improve.',
      icon: <MessageSquarePlus />,
      command: () => {
        editor.chain().focus().enter().deleteRange(range).run();
        window.open('/feedback', '_blank');
      }
    },
    {
      title: 'Text',
      description: 'Just start typing with plain text.',
      searchTerms: ['p', 'paragraph'],
      icon: <Text size={18} />,
      command: () => {
        editor.chain().focus().toggleNode('paragraph', 'paragraph').run();
      }
    },
    {
      title: 'To-do List',
      description: 'Track tasks with a to-do list.',
      searchTerms: ['todo', 'task', 'list', 'check', 'checkbox'],
      icon: <ListTodo size={18} />,
      command: () => {
        editor.chain().focus().toggleTaskList().run();
      }
    },
    {
      title: 'Heading 1',
      description: 'Big section heading.',
      searchTerms: ['title', 'big', 'large'],
      icon: <Heading1 size={18} />,
      command: () => {
        editor.chain().focus().setNode('heading', { level: 1 }).run();
      }
    },
    {
      title: 'Heading 2',
      description: 'Medium section heading.',
      searchTerms: ['subtitle', 'medium'],
      icon: <Heading2 size={18} />,
      command: () => {
        editor.chain().focus().setNode('heading', { level: 2 }).run();
      }
    },
    {
      title: 'Heading 3',
      description: 'Small section heading.',
      searchTerms: ['subtitle', 'small'],
      icon: <Heading3 size={18} />,
      command: () => {
        editor.chain().focus().setNode('heading', { level: 3 }).run();
      }
    },
    {
      title: 'Bullet List',
      description: 'Create a simple bullet list.',
      searchTerms: ['unordered', 'point'],
      icon: <List size={18} />,
      command: () => {
        editor.chain().focus().toggleBulletList().run();
      }
    },
    {
      title: 'Numbered List',
      description: 'Create a list with numbering.',
      searchTerms: ['ordered'],
      icon: <ListOrdered size={18} />,
      command: () => {
        editor.chain().focus().toggleOrderedList().run();
      }
    },
    {
      title: 'Quote',
      description: 'Capture a quote.',
      searchTerms: ['blockquote'],
      icon: <TextQuote size={18} />,
      command: () => editor.chain().focus().toggleNode('paragraph', 'paragraph').toggleBlockquote().run()
    },
    {
      title: 'Code',
      description: 'Capture a code snippet.',
      searchTerms: ['codeblock'],
      icon: <Code size={18} />,
      command: () => editor.chain().focus().toggleCodeBlock().run()
    },
    {
      title: 'Image',
      description: 'Upload an image from your computer.',
      searchTerms: ['photo', 'picture', 'media'],
      icon: <ImageIcon size={18} />,

      command: () => {
        editor.chain().focus().run();
        // upload image
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async () => {
          if (input.files?.length) {
            const file = input.files[0];
            const pos = editor.view.state.selection.from;
            startImageUpload(file, editor.view, pos);
            console.log(file, pos);
          }
        };
        input.click();
      }
    }
  ];
  return items;
};

export const updateScrollView = (container: HTMLElement, item: HTMLElement) => {
  const containerHeight = container.offsetHeight;
  const itemHeight = item ? item.offsetHeight : 0;

  const top = item.offsetTop;
  const bottom = top + itemHeight;

  if (top < container.scrollTop) {
    container.scrollTop -= container.scrollTop - top + 5;
  } else if (bottom > containerHeight + container.scrollTop) {
    container.scrollTop += bottom - containerHeight - container.scrollTop + 5;
  }
};

const CommandList = ({ items }: { items: any[] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index];
      // va.track('Slash Command Used', {
      //   command: item.title
      // });
      if (item) {
        // 执行命令
        item.command();
      }
    },
    [items]
  );

  useEffect(() => {
    const navigationKeys = ['ArrowUp', 'ArrowDown', 'Enter'];
    const onKeyDown = (e: KeyboardEvent) => {
      if (navigationKeys.includes(e.key)) {
        e.preventDefault();
        if (e.key === 'ArrowUp') {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length);
          return true;
        }
        if (e.key === 'ArrowDown') {
          setSelectedIndex((selectedIndex + 1) % items.length);
          return true;
        }
        if (e.key === 'Enter') {
          selectItem(selectedIndex);
          return true;
        }
        return false;
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [items, selectedIndex, setSelectedIndex, selectItem]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  const commandListContainer_d = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = commandListContainer_d?.current;

    const item = container?.children[selectedIndex] as HTMLElement;

    if (item && container) updateScrollView(container, item);
  }, [selectedIndex]);

  return items.length > 0 ? (
    <div
      ref={commandListContainer_d}
      className=" h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-stone-200 bg-white px-1 py-2 shadow-md transition-all "
    >
      {items.map((item: CommandItemProps, index: number) => {
        return (
          <button
            className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm text-stone-900 hover:bg-stone-100 ${
              index === selectedIndex ? 'bg-stone-100 text-stone-900' : ''
            }`}
            key={index}
            onClick={() => selectItem(index)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-stone-200 bg-white">
              {item.icon}
            </div>
            <div>
              <div className="font-medium">{item.title}</div>
              <div className="text-xs text-stone-500">{item.description}</div>
            </div>
          </button>
        );
      })}
    </div>
  ) : null;
};
