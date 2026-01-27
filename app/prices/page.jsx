import style from "./page.module.css";
import devilImg from "./devil.png";
import Image from "next/image";

function Prices() {
  return (
    <main className="main prices">
      <h1 className="sr-only">Shortly App Prices</h1>
      <section className={style.container}>
        <h2 className="title">We have many prices that suit everyone just pay and you will feel amazing</h2>
        <Image src={devilImg} alt="Devil" width={50} placeholder="blur" quality={75} />
      </section>
    </main>
  );
}

export default Prices;
