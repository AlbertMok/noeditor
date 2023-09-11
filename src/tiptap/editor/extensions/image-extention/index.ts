import Image from '@tiptap/extension-image';
import UploadImagesPlugin from './UploadImage';

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null
      },
      height: {
        default: null
      }
    };
  },
  addProseMirrorPlugins() {
    return [UploadImagesPlugin()];
  }
});

export default CustomImage;
