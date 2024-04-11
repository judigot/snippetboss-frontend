import LanguageFilter from '@/components/language/LanguageFilter';
import { useAtom } from 'jotai';
import { isAddLanguageModalVisibleAtom } from '@/state';
import AddLanguageModal from '@/components/modals/AddLanguageModal';
import AddPrefixModal from '@/components/modals/AddPrefixModal';
import AddSnippetModal from '@/components/modals/AddSnippetModal';

interface Props {}

function App({}: Props) {
  const [, setIsAddLanguageModalVisible] = useAtom(
    isAddLanguageModalVisibleAtom,
  );

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 50px',
      }}
    >
      <LanguageFilter />

      <button
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
        onClick={() => setIsAddLanguageModalVisible(true)}
      >
        +
      </button>
      <AddLanguageModal />
      <AddSnippetModal />
      <AddPrefixModal />
    </div>
  );
}

export default App;
