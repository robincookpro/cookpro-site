import { useEffect, useRef } from 'react';
import styles from './Card.module.css'

type CardProps = {
  thumbnail: string;
  title: string;
  sku: string;
}

export default function Card({ thumbnail, title, sku }: CardProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const getColor = () => {
      if (!img.naturalWidth) return;

      if (ctx) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);

        const [r1, g1, b1] = ctx.getImageData(0, 0, 1, 1).data;
        const [r2, g2, b2] = ctx.getImageData(img.naturalWidth - 1, img.naturalHeight - 1, 1, 1).data
        img.style.backgroundColor = `rgb(${(r1! + r2!) / 2}, ${(g1! + g2!) / 2}, ${(b1! + b2!) / 2})`
      }
    }

    img.addEventListener("load", getColor);

    if (img.complete) {
      getColor();
    }

    return () => img.removeEventListener("load", getColor);
  }, [thumbnail])

  return (
    <article className={styles.product}>
      <img src={thumbnail} ref={imgRef} crossOrigin='anonymous' />

      <div>
        <h3>{title}</h3>
        <p>{sku}</p>
      </div>
    </article>
  )
}
