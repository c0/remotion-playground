import { useEffect, useRef, useState } from 'react'
import {
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from 'remotion'

const randomRange = (seed, min, max) => {
  return Math.round(random(seed) * (max - min) + min)
}

const LARGE_BLOB_DIAMETER = 20
const BLOB_COLOR = '#000'
const DECAY = 0.1
const VELOCITY = 2 // >= 1

// Start the animation sooner
const START_OFFSET = 60

const CANVAS_STYLE = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  filter: "url('#goo')",
}

const Ball = ({ ctx, seed, x, y, frame }) => {
  if (!ctx) {
    return <></>
  }

  let angle = Math.PI * 2 * random(seed)
  let vx = (VELOCITY + random(seed) * (1 - VELOCITY)) * Math.cos(angle)
  let vy = (VELOCITY + random(seed) * (1 - VELOCITY)) * Math.sin(angle)

  let r = randomRange(seed, 12, 15)
  r -= DECAY * frame

  var br = r >= 0 ? r : 0

  ctx.beginPath()
  ctx.arc(x + vx * frame, y + vy * frame, br, 0, Math.PI * 2, false)
  ctx.fill()

  return <></>
}

export const GooBall = () => {
  const frame = useCurrentFrame()
  const { width, height, durationInFrames } = useVideoConfig()
  const canvas = useRef(null)

  const rand = random(durationInFrames)

  const ballCount = Math.round(durationInFrames / 10) + Math.floor(rand * 5)
  const balls = []
  for (let i = 0; i < ballCount; i++) {
    balls.push({
      start: randomRange(
        i + rand,
        -START_OFFSET,
        durationInFrames - START_OFFSET / 2
      ),
    })
  }

  const centerX = width / 2 - LARGE_BLOB_DIAMETER / 2
  const centerY = height / 2 - LARGE_BLOB_DIAMETER / 2

  const ctx = canvas && canvas.current ? canvas.current.getContext('2d') : null
  if (ctx) {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = BLOB_COLOR

    // Draw the main ball
    ctx.beginPath()
    ctx.arc(centerX, centerY, LARGE_BLOB_DIAMETER, 0, Math.PI * 2, false)
    ctx.fill()
  }

  return (
    <div style={{ flex: 1, backgroundColor: 'white' }}>
      <canvas
        id="canvas"
        ref={canvas}
        width={width}
        height={height}
        style={CANVAS_STYLE}
      />
      {balls.map(({ start }, i) => (
        <Sequence
          key={i}
          name={`Ball ${i}`}
          from={start}
          durationInFrames={120}
        >
          <Ball
            ctx={ctx}
            frame={frame - start}
            seed={i * rand}
            x={centerX}
            y={centerY}
          />
        </Sequence>
      ))}
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <filter id="goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="12"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 60 -9"
            />
          </filter>
        </defs>
      </svg>
    </div>
  )
}
