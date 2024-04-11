import LanguageFilter from '@/components/language/LanguageFilter';
import AddLanguageModal from '@/components/modals/AddLanguageModal';

interface Props {}

function App({}: Props) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 50px',
      }}
    >
      <LanguageFilter />
      <AddLanguageModal />
    </div>
  );
}

export default App;
