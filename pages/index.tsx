import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import styles from "./index.module.css";

type Props = {
  // 初期表示される画像URL
  initialImageUrl: string;
};

const IndexPage: NextPage<Props> = ({ initialImageUrl }: Props) => {
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [loading, setLoading] = useState(false);

  // 画像の切替処理の実装
  const handleClick = async () => {
    setLoading(true);
    const newImage = await fetchCatImage();
    console.log(newImage.height);
    setImageUrl(newImage.url);
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <button onClick={handleClick} className={styles.button}>
        One More Cat!!!
      </button>
      <div className={styles.frame}>
        {loading || <img src={imageUrl} className={styles.img} />}
      </div>
    </div>
  );
};

export default IndexPage;

// サーバサイドで実行する処理
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const image = await fetchCatImage();
  return {
    props: {
      initialImageUrl: image.url,
    },
  };
};

type CatImage = {
  url: string;
  height: number;
};

// 猫APIによる画像の取得処理
const fetchCatImage = async (): Promise<CatImage> => {
  const response = await fetch("https://api.thecatapi.com/v1/images/search");
  const images: unknown = await response.json();
  if (!Array.isArray(images)) {
    throw new Error("猫の画像を取得できませんでした");
  }
  const catImage: unknown = images[0];

  if (!isCatImage(catImage)) {
    throw new Error("猫の画像を取得できませんでした");
  }
  return catImage;
};

// 型ガード関数
const isCatImage = (value: unknown): value is CatImage => {
  if (!value || typeof value !== "object") {
    return false;
  }
  return (
    "url" in value &&
    typeof value.url === "string" &&
    "height" in value &&
    typeof value.height === "number"
  );
};
