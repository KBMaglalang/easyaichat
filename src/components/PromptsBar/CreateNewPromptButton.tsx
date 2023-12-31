import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

// components
import PromptModal from './PromptEditModal';

// context or store

// constants or functions
import { db } from '@/config/firebase/firebase';

function CreateNewPromptButton() {
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useState(false);

  /**
   * Creates a new prompt template.
   *
   * @param {string} title - The title of the prompt template.
   * @param {string} prompt - The content of the prompt template.
   * @returns {void}
   */
  const createNewPromptTemplate = async (title: string, prompt: string) => {
    const doc = await addDoc(collection(db, 'users', session?.user?.email!, 'prompt'), {
      userId: session?.user?.email!,
      createdAt: serverTimestamp(), // ! don't use local timestamp use server timestamp
      title: title || 'New Prompt',
      prompt: prompt || '',
    });
  };

  return (
    <>
      {/* new prompt button */}
      <div onClick={() => setModalOpen(true)} className="btn btn-primary w-full font-brand-roboto">
        <PlusIcon className="h-4 w-4" />
        <span>New Prompt</span>
      </div>

      {/* prompt modal */}
      {modalOpen && (
        <PromptModal
          setModalOpen={setModalOpen}
          callback={createNewPromptTemplate}
          title={''}
          prompt={''}
        />
      )}
    </>
  );
}

export default CreateNewPromptButton;
