export function UploadNotice({ failed }: { failed: boolean }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:bg-gray-900">
      <p className="text-sm text-gray-900 dark:text-gray-100">Contract.pdf</p>
      <p className="text-xs text-gray-500">Uploaded 2 minutes ago</p>
      {failed ? <p className="mt-2 rounded bg-red-50 p-2 text-red-700">Upload failed</p> : null}
      <button className="mt-3 rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 focus:ring-blue-500">
        Retry
      </button>
      <span className="bg-indigo-500 text-white">New</span>
    </div>
  );
}
