import { useEffect, useState } from "react";

const Progressebar = () => {
    const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {  
      if (progress < 100) {
        setProgress((prevProgress) => prevProgress + 1);
      } else {
        clearInterval(interval);
        setCompleted(true);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [progress]);
  return (
    <div className="h-screen flex justify-center items-center flex-col gap-4">
    <h1 className=" text-center text-2xl font-extrabold">Progressive bar </h1>
    <div className="w-96 bg-gray-300 rounded-full relative">
      <div
        className="h-10 bg-green-500 rounded-full absolute top-0 left-0 text-center text-xl font-bold p-1 pl-2"
        style={{ width: `${progress}%`, transition: "width 0.5s ease" }}
      >
        {" "}
        {completed ? "Completed !" : ` Loading....${progress}% `}
      </div>
      <div
        className="h-10 bg-gray-300 rounded-full text-center text-black z-10"
        style={{ zIndex: "10" }}
      ></div>
    </div>
  </div>
  )
}

export default Progressebar
