'use client';

import React, { useRef, useEffect, FormEvent, KeyboardEvent } from 'react';
import { useSession } from 'next-auth/react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

// components
import ChatSettings from './ChatSettings';
import UserSendButton from './UserSendButton';
import UserStopButton from './UserStopButton';

// context or store
import { useStateContext } from '@/context/stateContext';

// constants or functions
import { db } from '@/config/firebase/firebase';

type Props = {
  chatId: string;
  llmStop: () => void;
  llmInput: string;
  llmSubmit: (e: FormEvent<HTMLFormElement>) => void;
  llmHandleInputChange: (
    e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>
  ) => void;
  llmIsLoading: boolean;
  llmSetInput: React.Dispatch<React.SetStateAction<string>>;
};

export function ChatInput({
  chatId,
  llmStop,
  llmInput,
  llmSubmit,
  llmHandleInputChange,
  llmIsLoading,
  llmSetInput,
}: Props) {
  const { userInput, setUserInput } = useStateContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { data: session } = useSession();

  /* The `useEffect` hook in the code snippet is used to dynamically adjust the height of a textarea
  element based on its content. */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit'; // Reset height first to get a "clean slate"
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + 'px';
    }
  }, [llmInput]);

  /* The `useEffect` hook is used to perform side effects in a functional component. In this case, the
  `useEffect` hook is used to synchronize the `userInput` state with the `llmInput` state. */
  useEffect(() => {
    if (llmInput != userInput) {
      llmSetInput(userInput);
    }
  }, [userInput, llmInput, llmSetInput]);

  /**
   * Sends a message, adds it to the "messages" collection within a specific chat in the "users" collection of Firebase,
   * and sends a question to the "/api/askQuestion" endpoint for ChatGPT to respond.
   *
   * @param {FormEvent<HTMLFormElement>} e - The form event.
   *
   * @returns {Promise<void>} - A promise that resolves when the message is sent and ChatGPT responds.
   */
  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!llmInput) return;

    const message: Message = {
      content: llmInput,
      createdAt: serverTimestamp(),
      role: 'user',
      id: uuidv4(),
    };

    setUserInput('');

    // Adds a new document to the "messages" collection within a specific chat in the "users" collection of firebase
    await addDoc(
      collection(db, 'users', session?.user?.email!, 'chats', chatId, 'messages'),
      message
    );

    llmSubmit(e);
  };

  /**
   * Handles the keydown event for the textarea element.
   * If the user presses the "Ctrl + Enter" keys, it triggers the sendMessage function.
   *
   * @param {KeyboardEvent<HTMLTextAreaElement>} e - The keydown event object.
   * @returns {void}
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === 'Enter') {
      sendMessage(e as any);
    }
  };

  return (
    <div className="mt-2 w-full text-sm">
      {/* input */}
      <form onSubmit={sendMessage} className="flex flex-row space-x-5">
        <div className="flex w-full flex-1 ">
          <textarea
            autoFocus
            ref={textareaRef}
            disabled={!session}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="textarea textarea-bordered flex-1 resize-none bg-transparent font-brand-roboto disabled:cursor-not-allowed disabled:text-gray-300"
            placeholder="Type your message here... (CTRL + ENTER to send)"
          />
        </div>

        {/* user control buttons */}
        <div className="flex flex-col space-y-2">
          {llmIsLoading ? (
            <UserStopButton session={session} llmIsLoading={llmIsLoading} llmStop={llmStop} />
          ) : (
            <UserSendButton session={session} llmInput={llmInput} />
          )}
          <ChatSettings />
        </div>
      </form>
    </div>
  );
}
