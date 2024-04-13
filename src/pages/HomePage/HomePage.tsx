import logo from "/spartandraw.svg";
import "./HomePage.css"

const HomePage = () => {
  return (
    <>
      <div className="w-screen flex flex-row justify-center">
        <img src={logo} className="w-14 mx-2"></img>
        <h1 className="text-gray-100">SpartanDraw</h1>
      </div>
      <div className="text-center m-8">
        <a href="/login" className="bg-gray-100 p-3 rounded-lg">Go to Login</a>
      </div>
    </>
  );
};

export default HomePage;
