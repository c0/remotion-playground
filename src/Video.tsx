import { Composition } from 'remotion'
import { GooBall } from './GooBall'
import { GooBallCSS } from './GooBallCSS'
import { GooBallDrip } from './GooBallDrip'
import { GooEclipse } from './GooEclipse'
import { GooLine } from './GooLine'
import { GooWoom } from './GooWoom'

const FPS = 30

export const RemotionVideo: React.FC = () => {
  return (
    <>
      <Composition
        id="GooBall"
        component={GooBall}
        durationInFrames={10 * FPS}
        fps={FPS}
        width={500}
        height={500}
      />
      <Composition
        id="GooBallCSS"
        component={GooBallCSS}
        durationInFrames={10 * FPS}
        fps={FPS}
        width={500}
        height={500}
      />
      <Composition
        id="GooBallDrip"
        component={GooBallDrip}
        durationInFrames={15 * FPS}
        fps={FPS}
        width={500}
        height={500}
      />
      <Composition
        id="GooEclipse"
        component={GooEclipse}
        durationInFrames={15 * FPS}
        fps={FPS}
        width={500}
        height={500}
      />
      <Composition
        id="GooLine"
        component={GooLine}
        durationInFrames={15 * FPS}
        fps={FPS}
        width={1000}
        height={1000}
      />
      <Composition
        id="GooWoom"
        component={GooWoom}
        durationInFrames={15 * FPS}
        fps={FPS}
        width={500}
        height={500}
      />
    </>
  )
}
