import { ImageResponse } from "next/og"

import { source } from "@/lib/source"

export const runtime = "edge"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> }
): Promise<Response> {
  const slug = (await params).slug

  const page = source.getPage(slug)
  const title = page?.data.title
  const description = page?.data.description

  if (!title) {
    return new ImageResponse(
      (
        <div
          style={{
            fontFamily: "Okine",
            display: "flex",
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            background: "#fdfdfd",
            flexDirection: "column"
          }}
        >
          <svg width="300" height="300" viewBox="0 0 851.38 851.38" style={{ marginBottom: 20 }}>
            <g>
              <circle
                style={{
                  fill: "#242420"
                }}
                cx="425.69"
                cy="425.69"
                r="425.69"
              />
              <circle
                style={{
                  stroke: "#e1ddd7",
                  fill: "none"
                }}
                strokeWidth="12"
                cx="425.69"
                cy="425.69"
                r="390.01"
              />

              <g>
                <rect
                  style={{
                    fill: "#e1ddd7"
                  }}
                  x="411.91"
                  y="285.1"
                  width="33.1"
                  height="56.2"
                />
                <rect
                  style={{
                    fill: "#e1ddd7"
                  }}
                  x="413.62"
                  y="363.66"
                  width="33.1"
                  height="46.48"
                />
              </g>
              <g>
                <path
                  style={{
                    fill: "#e1ddd7"
                  }}
                  d="M397.43,250.45c-18.6,0-33.74,15.14-33.74,33.74s15.14,33.74,33.74,33.74,33.74-15.14,33.74-33.74-15.14-33.74-33.74-33.74Z"
                />
                <path
                  style={{
                    fill: "#e1ddd7"
                  }}
                  d="M458.28,250.45c-18.6,0-33.74,15.14-33.74,33.74s15.14,33.74,33.74,33.74,33.74-15.14,33.74-33.74-15.14-33.74-33.74-33.74Z"
                />
                <path
                  style={{
                    fill: "#e1ddd7"
                  }}
                  d="M681.13,268.74c-1.86-1.77-44.41-41.4-117.16-45.1l37.3-13.93c-3.96-5.83-9.49-9.9-15.03-14.21-.54-.42-.08-1.37.56-1.34,8.18.4,16.17,4.13,23.97,6.34,2.5.71,4.96,1.71,7.29,2.94l46.07-17.2c1.27-.47,2.12-1.67,2.15-3.03.03-1.35-.77-2.59-2.02-3.12-2.47-1.05-61.49-25.48-135.86,2.28-2.81,1.05-5.61,2.17-8.39,3.35l32.01-31.1c-5.17-1.58-10.43-2.26-15.7-3.41-.91-.2-.98-1.77,0-1.91,7.39-1.05,15.5-2.31,23.39-2.15l21.62-21.01c.97-.94,1.27-2.38.75-3.63-.52-1.25-1.9-1.88-3.1-2.05-2.27.03-56.14,1.17-104.15,47.82,0,0,0,0-.01.01l-47.54,46.81-46.4-46.82c-48.01-46.65-101.88-47.79-104.15-47.82-1.33.12-2.58.8-3.1,2.05-.52,1.25-.22,2.69.75,3.63l13.44,13.06c12.09.52,24.01,1.69,34.18,9.46.99.76.48,2.66-.92,2.19-6.11-2.04-14.25-2.06-22.24-.95l36.86,35.82c-2.78-1.18-5.58-2.3-8.39-3.35-74.38-27.77-133.37-3.34-135.86-2.28-1.24.53-2.04,1.77-2.01,3.12.03,1.35.89,2.55,2.15,3.03l26.21,9.79c10.56-3.52,20.61-5.66,24.69-6.04,1.34-.12,1.33,1.74.29,2.15-4.42,1.76-8.55,5.43-12.49,8.55l61.44,22.94c-72.75,3.7-115.3,43.33-117.16,45.1-.98.93-1.29,2.37-.8,3.63.5,1.26,1.73,2.08,3.08,2.08h32.93c.36-.22.73-.45,1.07-.66,13.73-8.48,28.29-14.67,43.06-21.02,1.62-.7,3.03,1.5,1.42,2.43-8.39,4.8-15.5,12.08-22.48,19.25h34.56c10.12-7.37,20.89-13.52,31.17-20.62,1.4-.97,2.89,1.15,1.77,2.29-5.56,5.63-10.53,11.99-15.47,18.33h276.76c-2.36-7.57-4.79-15.05-9.78-21.42-.77-.99.43-2.28,1.4-1.4,7.96,7.14,17.45,14.58,26.11,22.82h36.33c-3.26-8.34-7.23-16.17-13.53-20.53-1.28-.88-.19-2.73,1.21-2.07,10.42,4.92,19.59,13.89,27.6,22.6h47.85c1.35,0,2.57-.82,3.08-2.08.5-1.26.19-2.7-.8-3.63Z"
                />
                <rect
                  style={{
                    fill: "#e1ddd7"
                  }}
                  x="413.36"
                  y="431.49"
                  width="35.62"
                  height="50.01"
                />
                <g>
                  <path
                    style={{
                      fill: "#e1ddd7"
                    }}
                    d="M204.3,511.84c9.47-.08,18.94-.16,28.41-.23-11.35,33.92-22.7,68.84-34.05,104.77-11.04.92-22.08,2.06-33.12,3.45,12.92-35.97,25.84-71.97,38.76-107.99Z"
                  />
                  <path
                    style={{
                      fill: "#e1ddd7"
                    }}
                    d="M216.42,583.31c9.86-1.43,19.69-2.69,29.49-3.8-1.34,5.37.82,8.85,7.41,8.65,5.24-.15,8.9-2.32,9.74-5.75,1.05-4.16-2.19-5.04-14.41-9.18-15.7-5.1-21.78-13.06-15.94-31.43,6.7-20.76,24.94-32.1,41.08-32.1,17.88-.05,27.21,10.77,25.27,26.2-9.04,1.06-18.12,2.17-27.24,3.35.72-3.28-.63-5.94-4.07-5.88-3.02.05-5.93,2.09-6.77,5.09-1.08,3.87.61,5.68,7.55,7.97,18.74,6.42,29.98,12.43,25.84,32.73-4.66,23.6-23.66,35.59-48.32,36.24-25.93.81-35.62-13.34-29.63-32.1Z"
                  />
                  <path
                    style={{
                      fill: "#e1ddd7"
                    }}
                    d="M316.86,511.17c9.47-.03,18.94-.07,28.41-.09-3.69,23.51-7.38,47.9-11.07,73.17,12.38.38,24.77.89,37.15,1.48-.92,9.93-1.84,19.95-2.76,30.07-23.94-1.23-47.87-2.16-71.81-2.46,6.7-35.98,13.39-70.03,20.09-102.17Z"
                  />
                  <path
                    style={{
                      fill: "#e1ddd7"
                    }}
                    d="M416.68,510.91c10.53-.02,21.06-.04,31.59-.06,11.99,36.84,25.87,75.03,41.65,112.26-11.76-.67-23.52-1.39-35.28-2.13-2.04-5.94-4.03-11.89-5.98-17.84-11.29-.7-22.58-1.41-33.88-2.1-2.04,5.67-4.13,11.34-6.27,17.02-11.76-.72-23.52-1.42-35.29-2.04,16.38-35.45,30.86-69.74,43.45-105.13ZM440.1,576.28c-2.75-9.04-5.4-18.04-7.95-26.98-2.7,8.74-5.49,17.43-8.39,26.1,5.45.29,10.89.59,16.34.88Z"
                  />
                  <path
                    style={{
                      fill: "#e1ddd7"
                    }}
                    d="M487.82,510.78c10.4-.02,20.8-.05,31.19-.07,12.01,20.93,24.86,41.87,38.56,62.29-3.21-20.27-6.42-41.06-9.62-62.38,9.42-.03,18.85-.07,28.27-.11,7.65,40.66,15.3,79.36,22.95,116.07-12.07.04-24.14-.1-36.21-.38-14.37-19.58-27.9-39.8-40.59-60.26,2.28,20.14,4.57,39.86,6.85,59.14-11.04-.47-22.08-1.02-33.12-1.62-2.76-36.5-5.52-74.06-8.28-112.68Z"
                  />
                  <path
                    style={{
                      fill: "#e1ddd7"
                    }}
                    d="M586.84,510.47c10.84-.05,21.68-.11,32.52-.17,31.72.34,59.7,22.61,71.55,54.6,11.79,32.16-3.58,58.42-41.44,60.37-12.64.65-25.28,1.04-37.92,1.22-8.24-36.73-16.47-75.41-24.71-116.02ZM641.04,594.02c16.42-.86,23.21-11.13,18.53-26.46-4.73-15.5-16.57-24.56-31.78-24.13-1.43.04-2.87.09-4.31.13,4.32,17.21,8.63,34.1,12.95,50.68,1.54-.07,3.07-.14,4.61-.22Z"
                  />
                  <g>
                    <path
                      style={{
                        fill: "#e1ddd7"
                      }}
                      d="M369.97,643.2c12.46.73,24.92,1.51,37.38,2.29,13.23,37.19,28.35,74.42,45.36,109.49-13.61-.06-27.22-.11-40.83-.17-2.2-5.82-4.36-11.68-6.47-17.57-13.11-.25-26.22-.5-39.32-.74-2.48,5.98-5.01,12.01-7.57,18.09-13.61-.06-27.22-.11-40.83-.17,19.32-39.13,36.75-75.65,52.28-111.21ZM396.12,710.43c-3-9.08-5.89-18.19-8.69-27.31-3.36,8.8-6.82,17.65-10.38,26.59,6.36.23,12.71.47,19.07.71Z"
                    />
                    <path
                      style={{
                        fill: "#e1ddd7"
                      }}
                      d="M461.74,648.39c11.2.66,22.41,1.28,33.61,1.84,3.48,36.27,6.96,71.26,10.44,104.95-12.77-.05-25.55-.11-38.32-.16-1.91-34.78-3.82-70.32-5.73-106.62Z"
                    />
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </div>
      )
    )
  }

  const Mono = fetch(new URL("./FantasqueSansMono-Regular.ttf", import.meta.url)).then(res =>
    res.arrayBuffer()
  )

  const Okine = fetch(new URL("./made-okine-sans-medium.woff", import.meta.url)).then(res =>
    res.arrayBuffer()
  )

  return new ImageResponse(
    (
      <div
        style={{
          fontFamily: "Okine",
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          letterSpacing: "-.02em",
          fontWeight: 700,
          background: "#fdfdfd",
          flexDirection: "column"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            padding: "0 50px",
            color: "#21201c",
            textAlign: "center",
            height: 630 - 50 - 50,
            maxWidth: 1000
          }}
        >
          <svg width="100" height="100" viewBox="0 0 851.38 851.38" style={{ marginBottom: 20 }}>
            <g>
              <circle
                style={{
                  fill: "#242420"
                }}
                cx="425.69"
                cy="425.69"
                r="425.69"
              />
              <circle
                style={{
                  stroke: "#e1ddd7",
                  fill: "none"
                }}
                strokeWidth="12"
                cx="425.69"
                cy="425.69"
                r="390.01"
              />

              <g>
                <rect
                  style={{
                    fill: "#e1ddd7"
                  }}
                  x="411.91"
                  y="285.1"
                  width="33.1"
                  height="56.2"
                />
                <rect
                  style={{
                    fill: "#e1ddd7"
                  }}
                  x="413.62"
                  y="363.66"
                  width="33.1"
                  height="46.48"
                />
              </g>
              <g>
                <path
                  style={{
                    fill: "#e1ddd7"
                  }}
                  d="M397.43,250.45c-18.6,0-33.74,15.14-33.74,33.74s15.14,33.74,33.74,33.74,33.74-15.14,33.74-33.74-15.14-33.74-33.74-33.74Z"
                />
                <path
                  style={{
                    fill: "#e1ddd7"
                  }}
                  d="M458.28,250.45c-18.6,0-33.74,15.14-33.74,33.74s15.14,33.74,33.74,33.74,33.74-15.14,33.74-33.74-15.14-33.74-33.74-33.74Z"
                />
                <path
                  style={{
                    fill: "#e1ddd7"
                  }}
                  d="M681.13,268.74c-1.86-1.77-44.41-41.4-117.16-45.1l37.3-13.93c-3.96-5.83-9.49-9.9-15.03-14.21-.54-.42-.08-1.37.56-1.34,8.18.4,16.17,4.13,23.97,6.34,2.5.71,4.96,1.71,7.29,2.94l46.07-17.2c1.27-.47,2.12-1.67,2.15-3.03.03-1.35-.77-2.59-2.02-3.12-2.47-1.05-61.49-25.48-135.86,2.28-2.81,1.05-5.61,2.17-8.39,3.35l32.01-31.1c-5.17-1.58-10.43-2.26-15.7-3.41-.91-.2-.98-1.77,0-1.91,7.39-1.05,15.5-2.31,23.39-2.15l21.62-21.01c.97-.94,1.27-2.38.75-3.63-.52-1.25-1.9-1.88-3.1-2.05-2.27.03-56.14,1.17-104.15,47.82,0,0,0,0-.01.01l-47.54,46.81-46.4-46.82c-48.01-46.65-101.88-47.79-104.15-47.82-1.33.12-2.58.8-3.1,2.05-.52,1.25-.22,2.69.75,3.63l13.44,13.06c12.09.52,24.01,1.69,34.18,9.46.99.76.48,2.66-.92,2.19-6.11-2.04-14.25-2.06-22.24-.95l36.86,35.82c-2.78-1.18-5.58-2.3-8.39-3.35-74.38-27.77-133.37-3.34-135.86-2.28-1.24.53-2.04,1.77-2.01,3.12.03,1.35.89,2.55,2.15,3.03l26.21,9.79c10.56-3.52,20.61-5.66,24.69-6.04,1.34-.12,1.33,1.74.29,2.15-4.42,1.76-8.55,5.43-12.49,8.55l61.44,22.94c-72.75,3.7-115.3,43.33-117.16,45.1-.98.93-1.29,2.37-.8,3.63.5,1.26,1.73,2.08,3.08,2.08h32.93c.36-.22.73-.45,1.07-.66,13.73-8.48,28.29-14.67,43.06-21.02,1.62-.7,3.03,1.5,1.42,2.43-8.39,4.8-15.5,12.08-22.48,19.25h34.56c10.12-7.37,20.89-13.52,31.17-20.62,1.4-.97,2.89,1.15,1.77,2.29-5.56,5.63-10.53,11.99-15.47,18.33h276.76c-2.36-7.57-4.79-15.05-9.78-21.42-.77-.99.43-2.28,1.4-1.4,7.96,7.14,17.45,14.58,26.11,22.82h36.33c-3.26-8.34-7.23-16.17-13.53-20.53-1.28-.88-.19-2.73,1.21-2.07,10.42,4.92,19.59,13.89,27.6,22.6h47.85c1.35,0,2.57-.82,3.08-2.08.5-1.26.19-2.7-.8-3.63Z"
                />
                <rect
                  style={{
                    fill: "#e1ddd7"
                  }}
                  x="413.36"
                  y="431.49"
                  width="35.62"
                  height="50.01"
                />
                <g>
                  <path
                    style={{
                      fill: "#e1ddd7"
                    }}
                    d="M204.3,511.84c9.47-.08,18.94-.16,28.41-.23-11.35,33.92-22.7,68.84-34.05,104.77-11.04.92-22.08,2.06-33.12,3.45,12.92-35.97,25.84-71.97,38.76-107.99Z"
                  />
                  <path
                    style={{
                      fill: "#e1ddd7"
                    }}
                    d="M216.42,583.31c9.86-1.43,19.69-2.69,29.49-3.8-1.34,5.37.82,8.85,7.41,8.65,5.24-.15,8.9-2.32,9.74-5.75,1.05-4.16-2.19-5.04-14.41-9.18-15.7-5.1-21.78-13.06-15.94-31.43,6.7-20.76,24.94-32.1,41.08-32.1,17.88-.05,27.21,10.77,25.27,26.2-9.04,1.06-18.12,2.17-27.24,3.35.72-3.28-.63-5.94-4.07-5.88-3.02.05-5.93,2.09-6.77,5.09-1.08,3.87.61,5.68,7.55,7.97,18.74,6.42,29.98,12.43,25.84,32.73-4.66,23.6-23.66,35.59-48.32,36.24-25.93.81-35.62-13.34-29.63-32.1Z"
                  />
                  <path
                    style={{
                      fill: "#e1ddd7"
                    }}
                    d="M316.86,511.17c9.47-.03,18.94-.07,28.41-.09-3.69,23.51-7.38,47.9-11.07,73.17,12.38.38,24.77.89,37.15,1.48-.92,9.93-1.84,19.95-2.76,30.07-23.94-1.23-47.87-2.16-71.81-2.46,6.7-35.98,13.39-70.03,20.09-102.17Z"
                  />
                  <path
                    style={{
                      fill: "#e1ddd7"
                    }}
                    d="M416.68,510.91c10.53-.02,21.06-.04,31.59-.06,11.99,36.84,25.87,75.03,41.65,112.26-11.76-.67-23.52-1.39-35.28-2.13-2.04-5.94-4.03-11.89-5.98-17.84-11.29-.7-22.58-1.41-33.88-2.1-2.04,5.67-4.13,11.34-6.27,17.02-11.76-.72-23.52-1.42-35.29-2.04,16.38-35.45,30.86-69.74,43.45-105.13ZM440.1,576.28c-2.75-9.04-5.4-18.04-7.95-26.98-2.7,8.74-5.49,17.43-8.39,26.1,5.45.29,10.89.59,16.34.88Z"
                  />
                  <path
                    style={{
                      fill: "#e1ddd7"
                    }}
                    d="M487.82,510.78c10.4-.02,20.8-.05,31.19-.07,12.01,20.93,24.86,41.87,38.56,62.29-3.21-20.27-6.42-41.06-9.62-62.38,9.42-.03,18.85-.07,28.27-.11,7.65,40.66,15.3,79.36,22.95,116.07-12.07.04-24.14-.1-36.21-.38-14.37-19.58-27.9-39.8-40.59-60.26,2.28,20.14,4.57,39.86,6.85,59.14-11.04-.47-22.08-1.02-33.12-1.62-2.76-36.5-5.52-74.06-8.28-112.68Z"
                  />
                  <path
                    style={{
                      fill: "#e1ddd7"
                    }}
                    d="M586.84,510.47c10.84-.05,21.68-.11,32.52-.17,31.72.34,59.7,22.61,71.55,54.6,11.79,32.16-3.58,58.42-41.44,60.37-12.64.65-25.28,1.04-37.92,1.22-8.24-36.73-16.47-75.41-24.71-116.02ZM641.04,594.02c16.42-.86,23.21-11.13,18.53-26.46-4.73-15.5-16.57-24.56-31.78-24.13-1.43.04-2.87.09-4.31.13,4.32,17.21,8.63,34.1,12.95,50.68,1.54-.07,3.07-.14,4.61-.22Z"
                  />
                  <g>
                    <path
                      style={{
                        fill: "#e1ddd7"
                      }}
                      d="M369.97,643.2c12.46.73,24.92,1.51,37.38,2.29,13.23,37.19,28.35,74.42,45.36,109.49-13.61-.06-27.22-.11-40.83-.17-2.2-5.82-4.36-11.68-6.47-17.57-13.11-.25-26.22-.5-39.32-.74-2.48,5.98-5.01,12.01-7.57,18.09-13.61-.06-27.22-.11-40.83-.17,19.32-39.13,36.75-75.65,52.28-111.21ZM396.12,710.43c-3-9.08-5.89-18.19-8.69-27.31-3.36,8.8-6.82,17.65-10.38,26.59,6.36.23,12.71.47,19.07.71Z"
                    />
                    <path
                      style={{
                        fill: "#e1ddd7"
                      }}
                      d="M461.74,648.39c11.2.66,22.41,1.28,33.61,1.84,3.48,36.27,6.96,71.26,10.44,104.95-12.77-.05-25.55-.11-38.32-.16-1.91-34.78-3.82-70.32-5.73-106.62Z"
                    />
                  </g>
                </g>
              </g>
            </g>
          </svg>
          {title && (
            <div
              style={{
                fontSize: 54,
                fontWeight: 900,
                marginBottom: 12,
                lineHeight: 1.1,
                fontFamily: "Okine",
                textTransform: "uppercase"
              }}
            >
              {title}
            </div>
          )}
          {description && (
            <div
              style={{
                fontFamily: "Mono",
                fontSize: 26,
                fontWeight: 400,
                marginBottom: 0
              }}
            >
              {description}
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: "12px"
          }}
        >
          <span></span>
          <span
            style={{
              fontSize: 25,
              fontWeight: 700,
              background: "#21201c",
              color: "#fdfdfd",
              padding: "4px 10px",
              textTransform: "uppercase"
            }}
          >
            ISLAND.HACK.DANCE/DOCS/{slug?.join("/")}
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Mono",
          data: await Mono,
          style: "normal",
          weight: 400
        },
        {
          name: "Okine",
          data: await Okine,
          style: "normal",
          weight: 400
        }
      ]
    }
  )
}