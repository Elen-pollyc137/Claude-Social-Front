import Link from "next/link";
import styles from "./styles.module.scss";

type ButtonOwnProps = {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  href?: string;
};

type ButtonAsLink = ButtonOwnProps &
  Omit<React.ComponentPropsWithoutRef<typeof Link>, "href"> & { href: string };

type ButtonAsButton = ButtonOwnProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

export type ButtonProps = ButtonAsLink | ButtonAsButton;

export default function Button({
  variant = "primary",
  className,
  href,
  ...props
}: ButtonProps) {
  const cls = `${styles.button} ${styles[variant]} ${className ?? ""}`;

  if (href) {
    return (
      <Link
        href={href}
        className={cls}
        {...(props as Omit<React.ComponentPropsWithoutRef<typeof Link>, "href">)}
      />
    );
  }

  return (
    <button
      type="button"
      className={cls}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  );
}
