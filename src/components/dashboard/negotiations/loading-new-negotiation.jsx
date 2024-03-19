"use client"

import { Progress } from "@/components/ui/progress"
import * as React from "react"


export function LoadingProgress() {
  const [progress, setProgress] = React.useState(10)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10))
    }, 240)

    return () => clearInterval(timer)
  }, [])

  return <Progress value={progress} className="w-[60%]" />
}
