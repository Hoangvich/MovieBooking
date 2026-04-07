export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-dark-200 dark:border-dark-700" />
        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-t-primary-500 animate-spin" />
      </div>
    </div>
  );
}
