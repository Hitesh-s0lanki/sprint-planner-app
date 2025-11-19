/* eslint-disable @typescript-eslint/no-explicit-any */

import ConversationPage from "./components/client-component";

export default async function Page(props: { param:Promise<any>,searchParams: Promise<any> }) {
  const searchParams = await props.searchParams;
  const param=await props.param;
  const initialPrompt = searchParams?.q ?? "";

  return (
    <ConversationPage initialPrompt={initialPrompt} param={param} />
  );
}
