import React from 'react'
import {VideoComponent} from './VideoComponent'

type MyCompositionProps = {
  durationInFrames?: number
}

export const MyComposition: React.FC<MyCompositionProps> = (props) => {
  return (
    <VideoComponent {...props}/>
  )
}