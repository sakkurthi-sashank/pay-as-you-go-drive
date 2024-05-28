export function LoadingSpinner() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div
        className="h-32 w-32 animate-spin rounded-full
                    border border-solid border-primary border-t-transparent"
      ></div>
    </div>
  )
}
