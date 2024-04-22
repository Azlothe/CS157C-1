import logo from "/spartandraw.svg";
import styles from "./HomePage.module.css"

const Links = {
  Login: {
    link: "/login",
  },
  Canvas: {
    link: "/canvas",
    name: "View Canvas as Guest",
  },
}

const HomePage = () => {
  return (
    <>
    <div className={styles.body}>
      <div className={styles.bg}>
        <img src={logo} className="w-14 mx-2"></img>
        <h1 className={styles.title}>SpartanDraw</h1>
      </div>
      <div className="text-center m-4 flex flex-col">
        {
          Object.entries(Links).map( ([key, val]) => <a href={val.link} className={styles.link}>{val.name ?? `Go to ${key}`}</a>)
        }
      </div>
    </div>
    </>
  );
};

export default HomePage;
