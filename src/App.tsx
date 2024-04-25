import LanguageFilter from '@/components/language/LanguageFilter';
import { useAtom } from 'jotai';
import {
  isAddLanguageModalVisibleAtom,
  isAddPrefixModalVisibleAtom,
  isAddSnippetModalVisibleAtom,
} from '@/state';
import AddLanguageModal from '@/components/modals/AddLanguageModal';
import AddPrefixModal from '@/components/modals/AddPrefixModal';
import AddSnippetModal from '@/components/modals/AddSnippetModal';

interface Props {}

function App({}: Props) {
  const [isAddLanguageModalVisible, setIsAddLanguageModalVisible] = useAtom(
    isAddLanguageModalVisibleAtom,
  );

  const [isAddSnippetModalVisible] = useAtom(isAddSnippetModalVisibleAtom);

  const [isAddPrefixModalVisible] = useAtom(isAddPrefixModalVisibleAtom);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 50px',
      }}
    >
      <LanguageFilter />

      <button
        type='button'
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
        onClick={() => setIsAddLanguageModalVisible(true)}
      >
        +
      </button>

      {isAddLanguageModalVisible && <AddLanguageModal />}
      {isAddSnippetModalVisible && <AddSnippetModal />}
      {isAddPrefixModalVisible && <AddPrefixModal />}
    </div>
  );
}

export default App;
