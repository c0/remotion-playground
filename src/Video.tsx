import { Composition } from 'remotion'
import { GooBall } from './GooBall'
import { GooBallCSS } from './GooBallCSS'

export const RemotionVideo: React.FC = () => {
  return (
    <>
      <Composition
        id="GooBall"
        component={GooBall}
        durationInFrames={300}
        fps={30}
        width={500}
        height={500}
      />
      <Composition
        id="GooBallCSS"
        component={GooBallCSS}
        durationInFrames={300}
        fps={30}
        width={500}
        height={500}
      />
    </>
  )
}
