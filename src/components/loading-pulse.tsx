import React from "react"

export const LoadingPulse = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex animate-pulse space-x-2">
        <div className="h-8 w-8 rounded-full bg-gray-500"></div>
        <div className="h-8 w-8 rounded-full bg-gray-500"></div>
        <div className="h-8 w-8 rounded-full bg-gray-500"></div>
      </div>
    </div>
  )
}
