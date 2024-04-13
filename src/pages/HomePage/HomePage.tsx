import logo from "/spartandraw.svg";
import styles from "./HomePage.module.css"

const HomePage = () => {
  return (
    <>
    <div className={styles.body}>
      <div className={styles.bg}>
        <img src={logo} className="w-14 mx-2"></img>
        <h1 className={styles.title}>SpartanDraw</h1>
      </div>
      <div className="text-center m-8">
        <a href="/login" className={styles.link}>Go to Login</a>
      </div>
    </div>
    </>
  );
};

export default HomePage;
