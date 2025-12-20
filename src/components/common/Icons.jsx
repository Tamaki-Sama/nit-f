const Edit = <svg width="24" height="24"viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
const Add = <svg width="24" height="24"viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
const Delete = <svg width="24" height="24"viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
const Note = <svg width="24" height="24"viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
const Circle = <svg width="24" height="24"viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle></svg>
const Info = <svg width="24" height="24"viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
const Trophy = <svg width="24" height="24"viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5h15a2.5 2.5 0 0 1 0 5H18"></path><path d="M6 9v14h12V9"></path><path d="M12 21V9"></path></svg>
const Confirm = <svg width="24" height="24"viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
const Cancel = <svg width="24" height="24"viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
function PageCopy(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M75.272 7.482h-.005v-4.02a1.73 1.73 0 0 0-1.73-1.73h-32.87l-25.95 25.95v58.819c0 .956.774 1.73 1.73 1.73h57.089a1.73 1.73 0 0 0 1.73-1.73v-2.448h.005zM24.674 78.276V31.142h17.723a1.73 1.73 0 0 0 1.73-1.73V11.689h21.188v66.587z"
      ></path>
      <path
        fill="currentColor"
        d="M83.77 24.857h-3.475v66.911c0 .835-.677 1.513-1.513 1.513H29.306v3.475c0 .836.677 1.513 1.513 1.513H83.77c.836 0 1.513-.677 1.513-1.513V26.37c0-.836-.677-1.513-1.513-1.513"
      ></path>
    </svg>
  )
}
function Gymroutines(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.065 34.474h25.87m0 8.026V26.447M11.065 42.5V26.447m30.242 12.099V30.4M6.693 38.546V30.4m10.6-13.725l6.313 6.314L41.095 5.5m.394 17.489a17.4 17.4 0 0 0-2.167-8.439m-6.894-6.89A17.494 17.494 0 0 0 6.512 22.989"
      ></path>
    </svg>
  )
}
export function BaselineTimer(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M15 1H9v2h6zm-4 13h2V8h-2zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42A8.96 8.96 0 0 0 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9a8.994 8.994 0 0 0 7.03-14.61M12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7s7 3.13 7 7s-3.13 7-7 7"
      ></path>
    </svg>
  )
}
export function CheckmarkDoneSharp(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeMiterlimit="10"
        strokeWidth="44"
        d="M465 127L241 384l-92-92m-9 93l-93-93m316-165L236 273"
      ></path>
    </svg>
  )
}

export function CalculatorIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M472 40H40a24.03 24.03 0 0 0-24 24v384a24.03 24.03 0 0 0 24 24h432a24.03 24.03 0 0 0 24-24V64a24.03 24.03 0 0 0-24-24m-8 400H48V72h416Z"
      ></path>
      <path
        fill="currentColor"
        d="M152 240h32v-40h40v-32h-40v-40h-32v40h-40v32h40zm44.284 45.089L168 313.373l-28.284-28.284l-22.627 22.627L145.373 336l-28.284 28.284l22.627 22.627L168 358.627l28.284 28.284l22.627-22.627L190.627 336l28.284-28.284zM288 168h112v32H288zm0 120h112v32H288zm0 64h112v32H288z"
      ></path>
    </svg>
  )
}
export function CalculatorMultiply(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 2048 2048"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="m1805 205l-755 755l755 755l-90 90l-755-755l-755 755l-90-90l755-755l-755-755l90-90l755 755l755-755z"
      ></path>
    </svg>
  )
}
export function CalculatorEqualTo(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 2048 2048"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M0 1408v-128h1920v128zm0-896h1920v128H0z"
      ></path>
    </svg>
  )
}
export function CalculatorPercentage(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 2048 2048"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M768 384q0 80-30 149t-82 122t-123 83t-149 30q-80 0-149-30t-122-82t-83-122T0 384q0-79 30-149t82-122t122-83T384 0q79 0 149 30t122 82t83 123t30 149M384 640q53 0 99-20t82-55t55-81t20-100q0-53-20-99t-55-82t-81-55t-100-20q-53 0-99 20t-82 55t-55 81t-20 100q0 53 20 99t55 82t81 55t100 20m1152 512q79 0 149 30t122 82t83 123t30 149q0 80-30 149t-82 122t-123 83t-149 30q-80 0-149-30t-122-82t-83-122t-30-150q0-79 30-149t82-122t122-83t150-30m0 640q53 0 99-20t82-55t55-81t20-100q0-53-20-99t-55-82t-81-55t-100-20q-53 0-99 20t-82 55t-55 81t-20 100q0 53 20 99t55 82t81 55t100 20M1512 0L552 1920H408L1368 0z"
      ></path>
    </svg>
  )
}
export function CalculatorSubtract(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 2048 2048"
      width="1em"
      height="1em"
      {...props}
    >
      <path fill="currentColor" d="M0 896h1920v128H0z"></path>
    </svg>
  )
}
export function CalculatorAddition(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 2048 2048"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M1920 896v128h-896v896H896v-896H0V896h896V0h128v896z"
      ></path>
    </svg>
  )
}
export function CalculatorDivition(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 2048 2048"
      width="1em"
      height="1em"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeLinejoin="round">
        <path
          strokeWidth="2.25"
          d="M12 6.5h.01v.01H12zm0 11h.01v.01H12z"
        ></path>
        <path strokeLinecap="round" strokeWidth="1.5" d="M18 12H6"></path>
      </g>
    </svg>
  )
}
export function BodyIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <circle cx="12" cy="4" r="2" fill="currentColor"></circle>
      <path fill="currentColor" d="M15 22V9h5V7H4v2h5v13h2v-7h2v7z"></path>
    </svg>
  )
}
export function CommentIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M3 6v20h9.563l2.718 2.72l.72.686l.72-.687L19.437 26H29V6zm2 2h22v16h-8.406l-.313.28L16 26.563l-2.28-2.28l-.314-.282H5zm4 3v2h14v-2zm0 4v2h14v-2zm0 4v2h10v-2z"
      ></path>
    </svg>
  )
}
export function TrendIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="m106.667 64l-.173 343.395L448 405.333V448H64l.173-384zM448 128v128h-42.667v-56.633l-107.44 96.696l-52.56-52.543l-102.248 102.232l-30.17-30.17l132.418-132.419l54.102 54.085l74.003-66.582H320V128z"
      ></path>
    </svg>
  )
}
export function ShareIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186a2.25 2.25 0 0 0-3.935-2.186m0-12.814a2.25 2.25 0 1 0 3.933-2.185a2.25 2.25 0 0 0-3.933 2.185"
      ></path>
    </svg>
  )
}
export const CheckIcon = () => (
  <svg className="icon check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
export function SettingsIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M19.14 12.94c.04-.3.06-.61.06-.94c0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6s3.6 1.62 3.6 3.6s-1.62 3.6-3.6 3.6"
      ></path>
    </svg>
  )
}

export {Add, Delete, Edit, Note, Circle, Trophy, Info , Confirm, Cancel, PageCopy, Gymroutines}
