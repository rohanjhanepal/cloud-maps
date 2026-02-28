export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b1b1f]/95">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full border-2 border-[#3c3c3c] border-t-[#0078d4] animate-spin" />
        <p className="text-sm text-[#8a8886]">Loading CloudGraph...</p>
      </div>
    </div>
  )
}
