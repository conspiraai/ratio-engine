const renderInline = (text: string) => {
  const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return tokens.map((token, index) => {
    if (token.startsWith("**") && token.endsWith("**")) {
      return (
        <strong key={`${token}-${index}`} className="font-semibold text-[var(--fg)]">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith("`") && token.endsWith("`")) {
      return (
        <code
          key={`${token}-${index}`}
          className="rounded bg-white/10 px-1 py-0.5 font-mono text-xs text-[var(--fg)]"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    return <span key={`${token}-${index}`}>{token}</span>;
  });
};

const isListBlock = (lines: string[]) =>
  lines.every((line) => /^[-*]\s+/.test(line));

export default function MarkdownContent({ content }: { content: string }) {
  const blocks = content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4 text-sm leading-7 text-[var(--muted)]">
      {blocks.map((block) => {
        const lines = block.split("\n").map((line) => line.trim());
        if (lines.length > 1 && isListBlock(lines)) {
          return (
            <ul key={block} className="space-y-2 pl-4">
              {lines.map((line) => (
                <li key={line} className="list-disc">
                  {renderInline(line.replace(/^[-*]\s+/, ""))}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={block} className="text-sm leading-7 text-[var(--muted)]">
            {renderInline(block)}
          </p>
        );
      })}
    </div>
  );
}
