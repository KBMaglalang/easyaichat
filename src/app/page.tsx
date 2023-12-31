import React from 'react';
import { getServerSession } from 'next-auth';

// components
import { BaseLayout } from '@/components/Layout';
import { Login } from '@/components/Common';

// context or store

// constants or functions
import { authOptions } from '@/config/auth/auth';
import {
  HOMEPAGE_CONVERSATION_TITLE,
  HOMEPAGE_CONVERSATION_DESCRIPTION,
  HOMEPAGE_PROMPT_TITLE,
  HOMEPAGE_PROMPT_DESCRIPTION,
} from '@/constants';

export default async function Home() {
  // get session
  const session = await getServerSession(authOptions);

  return (
    <BaseLayout>
      <div className="flex flex-col items-center justify-center px-2  lg:overflow-hidden">
        <div className="m-4 w-full rounded-xl p-4  md:w-1/2 ">
          <h2 className="mb-4 text-center font-brand-roboto text-3xl font-medium">
            {HOMEPAGE_CONVERSATION_TITLE}
          </h2>
          <p className="text-center font-brand-roboto">{HOMEPAGE_CONVERSATION_DESCRIPTION}</p>
        </div>

        <div className="m-4 w-full rounded-xl p-4  md:w-1/2 ">
          <h2 className="mb-4 text-center font-brand-roboto text-3xl font-medium">
            {HOMEPAGE_PROMPT_TITLE}
          </h2>
          <p className="text-center font-brand-roboto">{HOMEPAGE_PROMPT_DESCRIPTION}</p>
        </div>

        {!session && (
          <div className="m-4 w-full rounded-xl p-4  md:w-1/2 ">
            <h2 className="mb-4 text-center font-brand-roboto text-2xl font-medium">
              Login or Create an Account to Start
            </h2>

            <Login />
          </div>
        )}
      </div>
    </BaseLayout>
  );
}
