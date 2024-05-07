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

function SideBar() {
  const [isAddLanguageModalVisible, setIsAddLanguageModalVisible] = useAtom(
    isAddLanguageModalVisibleAtom,
  );

  const [isAddSnippetModalVisible] = useAtom(isAddSnippetModalVisibleAtom);

  const [isAddPrefixModalVisible] = useAtom(isAddPrefixModalVisibleAtom);

  return (
    <aside>
      <div className="grid grid-cols-[1fr_50px] w-64 text-white p-4">
        <LanguageFilter />
        <button
          type="button"
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
          onClick={() => setIsAddLanguageModalVisible(true)}
        >
          +
        </button>
        {isAddLanguageModalVisible && <AddLanguageModal />}
        {isAddSnippetModalVisible && <AddSnippetModal />}
        {isAddPrefixModalVisible && <AddPrefixModal />}
      </div>
    </aside>
  );
}

export default SideBar;
