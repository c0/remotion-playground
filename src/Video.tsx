import { Composition } from 'remotion'
import { One } from './One'

export const RemotionVideo: React.FC = () => {
  return (
    <>
      <Composition
        id="One"
        component={One}
        durationInFrames={300}
        fps={30}
        width={500}
        height={500}
      />
    </>
  )
}
