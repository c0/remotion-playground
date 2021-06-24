import { useEffect, useRef, useState } from 'react'
import {
  Easing,
  interpolate,
  random,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'

const randomRange = (seed, min, max) => {
  return Math.round(random(seed) * (max - min) + min)
}

const LARGE_BLOB_RADIUS = 150
const COLOR = '#000'

// Start the animation sooner
const START_OFFSET = 230

// More balls == "gooier"
const BALLS_PER_SECOND = 48
const BALL_DISTANCE = 300
const BALL_LIFE_SPAN_IN_SECONDS = 8 // Higher == slower
const BALL_MIN_DIAMETER = 200
const BALL_MAX_DIAMETER = 300

const LargeBlob = ({ x, y }) => {
  // Create a larger space to help Chrome not clip the effect
  const padding = BALL_DISTANCE * 1.1
  return (
    <div
      style={{
        padding: `${padding}px`,
        position: 'absolute',
        top: `${y}px`,
        left: `${x}px`,
        transform: `translateX(-${padding}px) translateY(-${padding}px)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translateX(-${LARGE_BLOB_RADIUS}px) translateY(-${LARGE_BLOB_RADIUS}px)`,
          width: `${LARGE_BLOB_RADIUS * 2}px`,
          height: `${LARGE_BLOB_RADIUS * 2}px`,
          borderRadius: `${LARGE_BLOB_RADIUS}px`,
          background: COLOR,
        }}
      />
    </div>
  )
}

const Ball = ({ seed, frame, x, y }) => {
  const diameter = randomRange(seed, BALL_MIN_DIAMETER, BALL_MAX_DIAMETER)
  const radius = diameter / 2

  const midX = randomRange(seed, x - radius * 5, x + radius * 5)
  const midY = y - radius

  const curX = interpolate(
    frame,
    [0, BALL_LIFE_SPAN_IN_SECONDS * 30],
    [0, randomRange(seed * 1.1, -(BALL_DISTANCE * 0.6), BALL_DISTANCE * 0.6)],
    {
      easing: Easing.bezier(0.8, 0.22, 0.4, 0.65),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  )

  const curY = interpolate(
    frame,
    [0, BALL_LIFE_SPAN_IN_SECONDS * 30],
    // Ensure the seed for x and y are different
    [0, randomRange(seed * 1.2, -BALL_DISTANCE, BALL_DISTANCE)],
    {
      easing: Easing.bezier(0.8, 0.22, 0.4, 0.65),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  )

  const scale = interpolate(
    frame,
    [0, BALL_LIFE_SPAN_IN_SECONDS * 30],
    [1, 0],
    {
      easing: Easing.bezier(0.8, 0.22, 0.4, 0.65),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  )

  return (
    <div
      style={{
        width: `${diameter}px`,
        height: `${diameter}px`,
        borderRadius: `${diameter}px`,
        background: COLOR,
        position: 'absolute',
        top: `${midY}px`,
        left: `${midX}px`,
        transform: `translate3d(${curX}px, ${curY}px, 0) scale(${scale})`,
      }}
    ></div>
  )
}

export const GooLine = () => {
  const frame = useCurrentFrame()
  const { width, height, durationInFrames } = useVideoConfig()

  const centerX = width / 2
  const quarterWidth = Math.round(width / 2.1)
  const centerY = height / 2

  const rand = random(durationInFrames)

  const ballCount =
    Math.round((durationInFrames / 30) * BALLS_PER_SECOND) +
    Math.floor(rand * 5)

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

  return (
    <div style={{ flex: 1, position: 'relative', backgroundColor: 'white' }}>
      <div
        style={{
          // This is where the magic happens
          filter: "url('#goo')",
        }}
      >
        <LargeBlob x={centerX - quarterWidth} y={centerY} />
        <LargeBlob x={centerX + quarterWidth} y={centerY} />
        {balls.map(({ start }, i) => (
          <Sequence
            key={i}
            name={`Ball ${i}`}
            from={start}
            durationInFrames={BALL_LIFE_SPAN_IN_SECONDS * 30}
          >
            <Ball
              key={i}
              seed={i * rand}
              frame={frame - start}
              x={centerX}
              y={centerY}
            />
          </Sequence>
        ))}
      </div>
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
