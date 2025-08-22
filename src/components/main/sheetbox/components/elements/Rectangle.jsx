export default function Rectangle({data, dimensions}) {
  const {width, height} = {...dimensions}

  return (
    <svg 
      fill={data.fill}
      stroke={data.stroke}
      strokeWidth={data.strokeWidth} 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`}>
        <rect width={width} height={height} />
    </svg>
  )
}