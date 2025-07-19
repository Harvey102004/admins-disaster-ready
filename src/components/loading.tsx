"use client";

export default function Loader() {
  return (
    <div className="full flex w-full flex-col items-center justify-center gap-4">
      <div className="border-dark-blue border-t-background h-10 w-10 animate-spin rounded-full border-4" />
      <p className="text-sm">Loading, please wait...</p>
    </div>
  );
}
