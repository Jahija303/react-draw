export const Circle = ({data, dimensions}) => {
  const {width, height} = {...dimensions}
  const radius = width / 2

  return (
    <svg 
      fill={data.fill}
      stroke={data.stroke}
      strokeWidth={data.strokeWidth} 
      width={width} 
      height={height} 
      viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
        <circle cx={radius} cy={radius} r={radius-data.strokeWidth} />
    </svg>
  )
}