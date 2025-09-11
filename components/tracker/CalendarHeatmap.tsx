'use client'

import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'

interface HeatmapValue {
  date: string
  count: number
  level?: number
}

interface CalendarHeatmapProps {
  values: HeatmapValue[]
  startDate?: Date
  endDate?: Date
  className?: string
  onClick?: (value: HeatmapValue | null) => void
}

export default function CalendarHeatmapComponent({
  values,
  startDate,
  endDate,
  className = '',
  onClick
}: CalendarHeatmapProps) {
  const today = new Date()
  const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())

  const classForValue = (value: HeatmapValue | null) => {
    if (!value || value.count === 0) {
      return 'color-empty'
    }
    
    const level = value.level || 0
    return `color-scale-${Math.min(level, 4)}`
  }

  const titleForValue = (value: HeatmapValue | null) => {
    if (!value) return 'No data'
    
    const date = new Date(value.date).toLocaleDateString()
    if (value.count === 0) {
      return `${date}: No tasks completed`
    }
    
    return `${date}: ${value.count} task${value.count > 1 ? 's' : ''} completed`
  }

  return (
    <div className={`calendar-heatmap-container ${className}`}>
      <CalendarHeatmap
        startDate={startDate || oneYearAgo}
        endDate={endDate || today}
        values={values}
        classForValue={classForValue}
        titleForValue={titleForValue}
        onClick={onClick}
        showWeekdayLabels
        showMonthLabels
      />
      
      <style jsx global>{`
        .calendar-heatmap-container .react-calendar-heatmap {
          font-size: 12px;
        }
        
        .calendar-heatmap-container .react-calendar-heatmap .color-empty {
          fill: #ebedf0;
        }
        
        .calendar-heatmap-container .react-calendar-heatmap .color-scale-0 {
          fill: #ebedf0;
        }
        
        .calendar-heatmap-container .react-calendar-heatmap .color-scale-1 {
          fill: #9be9a8;
        }
        
        .calendar-heatmap-container .react-calendar-heatmap .color-scale-2 {
          fill: #40c463;
        }
        
        .calendar-heatmap-container .react-calendar-heatmap .color-scale-3 {
          fill: #30a14e;
        }
        
        .calendar-heatmap-container .react-calendar-heatmap .color-scale-4 {
          fill: #216e39;
        }
        
        .calendar-heatmap-container .react-calendar-heatmap rect:hover {
          stroke: #000;
          stroke-width: 1px;
        }
        
        .calendar-heatmap-container .react-calendar-heatmap .month-label {
          font-size: 10px;
          fill: #767676;
        }
        
        .calendar-heatmap-container .react-calendar-heatmap .wday-label {
          font-size: 9px;
          fill: #767676;
        }
      `}</style>
    </div>
  )
}