import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DocumentData } from "firebase/firestore";
import { UserCircleIcon } from "@heroicons/react/24/solid";

type Props = {
  message: DocumentData;
};

function Message({ message }: Props) {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={`py-5 text-white ${isAssistant && "bg-[#434654] rounded-xl"}`}
    >
      <div className="flex px-10 mx-auto space-x-5">
        {/* user and chatgpt icons */}
        {isAssistant ? (
          <img
            src={
              "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
            }
            alt="avatar"
            className="w-8 h-8"
          />
        ) : (
          <UserCircleIcon className="w-8 h-8 text-gray-300" />
        )}

        {/* message container */}
        <div className="flex flex-col w-full">
          {/* message markdown */}
          <div className="flex flex-col flex-wrap items-center">
            <ReactMarkdown
              className="pt-2 w-full max-w-4xl text-white break-words prose flex-shrink-1"
              remarkPlugins={[remarkGfm]}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Message;
