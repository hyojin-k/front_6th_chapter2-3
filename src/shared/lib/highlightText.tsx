export const highlightText = (text: string, query: string) => {
  if (!text) return null;
  if (!query.trim()) {
    return <span>{text}</span>;
  }
  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
    </span>
  );
};
