import React from 'react'
import {Composition} from 'remotion'
import {MyComposition} from './Composition'

type CompositionProps = {
  durationInFrames?: number
}

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MyVideo"
      component={MyComposition}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{durationInFrames: 300}}
      calculateMetadata={({props}: {props: CompositionProps}) => {
        return {
          durationInFrames:
            typeof props.durationInFrames === 'number'
              ? props.durationInFrames
              : 300,
        }
      }}
    />
  )
}
