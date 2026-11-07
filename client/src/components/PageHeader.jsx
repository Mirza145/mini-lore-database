export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? <p className="eyebrow mb-2">{eyebrow}</p> : null}
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        {description ? (
          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-ink-soft">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
