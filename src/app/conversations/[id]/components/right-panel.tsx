export default function RightPanel() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-white">
      <div className="flex flex-col items-center text-center max-w-md px-10">
        <div className="p-4 rounded-xl bg-linear-to-br from-blue-400 to-blue-600 text-white text-3xl">
          ✨
        </div>

        <h2 className="text-2xl font-semibold mt-6">Start a conversation</h2>
        <p className="text-gray-500 mt-2">
          Ask me anything and I&apos;ll help you out!
        </p>
      </div>
    </div>
  );
}
