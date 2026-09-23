import styles from './Card.module.css'

type CardProps = {
  thumbnail: string;
  title: string;
  sku: string;
}

export default function Card({ thumbnail, title, sku }: CardProps) {
  return (
    <article className={styles.product}>
      <img src={thumbnail} />

      <div>
        <h3>{title}</h3>
        <p>{sku}</p>
      </div>
    </article>
  )
}
