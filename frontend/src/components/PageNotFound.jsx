// import { error404 } from "@/assets";

const PageNotFound = () => {
  return (
    <div className="flex my-10 flex-col justify-center items-center">
      {/* <img className="h-[22vh]" src={error404} alt="404" /> */}
      <p className="text-2xl">Whoops, that page is gone.</p>
      <p className="text-gray-600">Waiting for further updates</p>
    </div>
  );
};

export default PageNotFound;
