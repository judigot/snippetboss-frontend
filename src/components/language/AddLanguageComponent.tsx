import { FormEvent, useState } from 'react';
import { language } from '@/types/types';
import { createLanguage } from '@/api/language/create-language';

export function AddLanguageComponent() {
  interface LanguageForm extends Omit<language, 'language_id'> {}

  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

  const [formData, setFormData] = useState<LanguageForm>({
    language_name: '',
    display_name: '',
  });

  const handleInputChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { language_name, display_name } = formData;

    if (language_name && display_name !== null) {
      createLanguage(formData)
        .then(() => {
          setFormData(formData);
          setIsFormVisible(false);
        })
        .catch(() => {});
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setIsFormVisible(!isFormVisible);
        }}
      >
        +
      </button>

      {isFormVisible && (
        <section>
          <form
            style={{ display: 'inline-block' }}
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <label htmlFor="language_name">Programming Language</label>
            <input
              required
              type="text"
              name="language_name"
              onChange={handleInputChange}
            />

            <label htmlFor="display_name">Display Name</label>
            <input
              // required
              type="text"
              name="display_name"
              onChange={handleInputChange}
            />

            <button type="submit">Submit</button>
          </form>
        </section>
      )}
    </>
  );
}
