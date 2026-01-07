export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* Icon */}
      <div className="relative w-12 h-12 flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outer C shape */}
          <path
            d="M70 15 Q85 15 85 30 Q85 45 70 45"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            className="text-accent-500 dark:text-accent-400"
          />
          
          {/* Middle C shape */}
          <path
            d="M55 30 Q65 30 65 40 Q65 50 55 50"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            className="text-accent-500 dark:text-accent-400"
          />
          
          {/* Inner C shape */}
          <path
            d="M40 45 Q50 45 50 55 Q50 65 40 65"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            className="text-accent-500 dark:text-accent-400"
          />
          
          {/* Wave lines inside */}
          <path
            d="M30 35 Q40 40 50 35"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            className="text-accent-400 dark:text-accent-300"
          />
          
          <path
            d="M25 50 Q35 55 45 50"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            className="text-accent-400 dark:text-accent-300"
          />
          
          <path
            d="M30 65 Q40 70 50 65"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            className="text-accent-400 dark:text-accent-300"
          />
          
          {/* Lightbulb icon */}
          <g transform="translate(75, 10)">
            {/* Bulb */}
            <circle
              cx="8"
              cy="8"
              r="6"
              className="fill-accent-400 dark:fill-accent-300"
            />
            {/* Base */}
            <rect
              x="6"
              y="13"
              width="4"
              height="3"
              rx="1"
              className="fill-accent-500 dark:fill-accent-400"
            />
            {/* Shine */}
            <circle
              cx="6"
              cy="6"
              r="2"
              className="fill-white dark:fill-gray-100"
              opacity="0.7"
            />
          </g>
        </svg>
      </div>
      
      {/* Text */}
      <div className="flex flex-col leading-none">
        <span className="text-xl font-serif font-bold text-gray-900 dark:text-white">
          Creat<span className="text-accent-600 dark:text-accent-400">E</span>conomy
        </span>
      </div>
    </div>
  )
}

