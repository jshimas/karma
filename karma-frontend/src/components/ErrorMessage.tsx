interface ErrorMessageProps {
  message: string | undefined;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return message && <p className="text-destructive text-sm my-1">{message}</p>;
}
