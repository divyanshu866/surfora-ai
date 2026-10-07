import MarkdownCodeBlock from "./MarkdownCodeBlock";

const linkPattern = /^(https?:\/\/|mailto:|tel:|#)/i;

const getSafeHref = (href) => {
  if (typeof href !== "string") return null;
  return linkPattern.test(href) ? href : null;
};

const headingBase =
  "scroll-mt-6 font-semibold text-white [&_a]:text-violet-300 [&_a]:no-underline";

const markdownComponents = {
  h1: ({ children }) => (
    <h1
      className={`${headingBase} mb-3.5 mt-1 text-[21px] leading-[1.25] tracking-[-0.03em] sm:mb-5 sm:text-[28px]`}
    >
      {children}
    </h1>
  ),

  h2: ({ children }) => (
    <h2
      className={`${headingBase} mb-2.5 mt-6 text-[18px] leading-[1.3] tracking-[-0.02em] sm:mb-3 sm:mt-10 sm:text-[22px]`}
    >
      {children}
    </h2>
  ),

  h3: ({ children }) => (
    <h3
      className={`${headingBase} mb-2 mt-5 text-[16px] leading-[1.35] tracking-[-0.01em] sm:mt-6 sm:text-[18px]`}
    >
      {children}
    </h3>
  ),

  h4: ({ children }) => (
    <h4
      className={`${headingBase} mb-1.5 mt-4 text-[14px] leading-[1.4] sm:mb-2 sm:mt-5 sm:text-[15px] sm:leading-[1.45]`}
    >
      {children}
    </h4>
  ),

  h5: ({ children }) => (
    <h5
      className={`${headingBase} mb-1.5 mt-3.5 text-[13px] leading-[1.45] text-white/85 sm:mt-4 sm:text-[14px] sm:leading-[1.5]`}
    >
      {children}
    </h5>
  ),

  h6: ({ children }) => (
    <h6
      className={`${headingBase} mb-1.5 mt-3.5 text-[11px] uppercase leading-[1.45] tracking-[0.08em] text-white/65 sm:mt-4 sm:text-[12px] sm:leading-[1.5]`}
    >
      {children}
    </h6>
  ),

  p: ({ children, node }) => {
    const nodeChildren = node?.children ?? [];

    const hasImage = nodeChildren.some(
      (child) => child.type === "element" && child.tagName === "img",
    );

    const isImageOnly =
      hasImage &&
      nodeChildren.every(
        (child) => child.type === "element" && child.tagName === "img",
      );

    const className =
      "mb-3 break-words whitespace-pre-wrap text-[14px] leading-6 font-normal text-neutral-200 last:mb-0 sm:mb-4 sm:text-[15px] sm:leading-7 [&+ul]:mt-0 [&+ol]:mt-0";

    if (isImageOnly) return <>{children}</>;

    if (hasImage) {
      return <div className={className}>{children}</div>;
    }

    return <p className={className}>{children}</p>;
  },

  strong: ({ children }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),

  em: ({ children }) => <em className="text-neutral-100 italic">{children}</em>,

  del: ({ children }) => (
    <del className="text-white/55 decoration-red-400/55">{children}</del>
  ),

  u: ({ children }) => (
    <u className="decoration-white/50 decoration-[1px] underline-offset-[3px]">
      {children}
    </u>
  ),

  kbd: ({ children }) => (
    <kbd className="inline-flex items-center rounded-md border border-white/[0.14] bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] font-medium leading-none text-neutral-200 sm:text-[11px]">
      {children}
    </kbd>
  ),

  mark: ({ children }) => (
    <mark className="rounded bg-violet-400/[0.18] px-1 text-violet-100">
      {children}
    </mark>
  ),

  ul: ({ children, className }) => (
    <ul
      className={`
        my-3
        list-disc
        space-y-1.5
        pl-[0.95rem]
        text-[14px]
        leading-6
        text-neutral-200
        marker:text-neutral-400
        sm:my-4
        sm:space-y-2
        sm:pl-6
        sm:text-[15px]
        sm:leading-7
        [&>li>ul]:my-1.5
        [&>li>ol]:my-1.5
        [&>li>p]:mb-1.5
        [&>li>p:last-child]:mb-0
        [&.contains-task-list]:list-none
        [&.contains-task-list]:pl-0
        ${className ?? ""}
      `}
    >
      {children}
    </ul>
  ),

  ol: ({ children, className, start }) => (
    <ol
      start={start}
      className={`
        my-3
        list-decimal
        space-y-1.5
         pl-[0.95rem]
        text-[14px]
        leading-6
        text-neutral-200
        marker:font-medium
        marker:text-neutral-400
        sm:my-4
        sm:space-y-2
        sm:pl-6
        sm:text-[15px]
        sm:leading-7
        [&>li>ul]:my-1.5
        [&>li>ol]:my-1.5
        [&>li>p]:mb-1.5
        [&>li>p:last-child]:mb-0
        ${className ?? ""}
      `}
    >
      {children}
    </ol>
  ),

  li: ({ children, className }) => (
    <li
      className={`
        pl-0.5
        sm:pl-1
        [&>p]:mb-1.5
        [&>p:last-child]:mb-0
        [&.task-list-item]:list-none
        [&.task-list-item]:pl-0
        [&.task-list-item:has(input:checked)]:text-emerald-300
        [&.task-list-item:has(input:not(:checked))]:text-amber-200
        ${className ?? ""}
      `}
    >
      {children}
    </li>
  ),

  input: ({ type, checked }) => {
    if (type !== "checkbox") return null;

    const isChecked = checked === true;

    return (
      <input
        type="checkbox"
        checked={isChecked}
        readOnly
        disabled
        aria-label={isChecked ? "Completed" : "Not completed"}
        style={
          isChecked
            ? {
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg xmlns=%27http%3A//www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3E%3Cpath fill=%27none%27 stroke=%27white%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272.5%27 d=%27m3 8 3.2 3.2L13 4.5%27/%3E%3C/svg%3E")',
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "10px 10px",
              }
            : undefined
        }
        className={`
          mr-1.5
          inline-block
          h-3.5
          w-3.5
          translate-y-[1px]
          appearance-none
          rounded-[3px]
          border-2
          disabled:cursor-default
          disabled:opacity-100
          sm:mr-2
          ${
            isChecked
              ? "border-emerald-400 bg-emerald-500"
              : "border-amber-400 bg-amber-400/20"
          }
        `}
      />
    );
  },

  blockquote: ({ children }) => (
    <blockquote
      className="
        my-4
        rounded-r-lg
        border-l-2
        border-violet-400/65
        bg-violet-400/[0.045]
        px-3
        py-2.5
        text-[14px]
        leading-6
        text-neutral-300
        sm:my-5
        sm:px-4
        sm:py-3
        sm:text-[15px]
        sm:leading-7
        [&>p]:mb-1.5
        [&>p:last-child]:mb-0
        [&_strong]:text-white
      "
    >
      {children}
    </blockquote>
  ),

  details: ({ children }) => (
    <details className="my-4 overflow-hidden rounded-lg border border-white/[0.1] bg-white/[0.018] sm:my-5 sm:rounded-xl sm:border-white/[0.12] sm:bg-white/[0.025]">
      {children}
    </details>
  ),

  summary: ({ children }) => (
    <summary
      className="
        cursor-pointer
        select-none
        px-3
        py-2.5
        text-[13px]
        font-medium
        leading-5
        text-neutral-100
        marker:text-violet-300
        hover:bg-white/[0.035]
        focus-visible:outline
        focus-visible:outline-2
        focus-visible:outline-offset-[-2px]
        focus-visible:outline-violet-400
        sm:px-4
        sm:py-3
        sm:text-[14px]
        sm:leading-6
        sm:hover:bg-white/[0.04]
      "
    >
      {children}
    </summary>
  ),

  dl: ({ children }) => (
    <dl className="my-4 space-y-2.5 text-[14px] leading-6 sm:my-5 sm:space-y-3 sm:text-[15px] sm:leading-7">
      {children}
    </dl>
  ),

  dt: ({ children }) => (
    <dt className="font-semibold text-white">{children}</dt>
  ),

  dd: ({ children }) => (
    <dd className="mt-0.5 pl-3.5 text-neutral-300 sm:mt-1 sm:pl-4">
      {children}
    </dd>
  ),

  hr: () => (
    <hr className="my-5 border-0 border-t border-white/[0.1] sm:my-8 sm:border-white/[0.12]" />
  ),

  br: () => <br />,

  pre: ({ children }) => <MarkdownCodeBlock>{children}</MarkdownCodeBlock>,

  code({ className, children, ...props }) {
    const isBlock =
      typeof className === "string" &&
      /(^|\s)(language-|lang-)/i.test(className);

    if (!isBlock) {
      return (
        <code
          className="
            break-words
            rounded
            bg-white/[0.085]
            px-1.5
            py-0.5
            font-mono
            text-[11px]
            font-medium
            leading-[1.45]
            text-violet-300/85
            sm:text-[12.5px]
            sm:leading-[1.5]
          "
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <code
        className={`
          ${className ?? ""}
          font-mono
          text-[11px]
          font-normal
          leading-[1.65]
          text-neutral-100
          sm:text-[13px]
          sm:leading-[1.7]
        `}
        {...props}
      >
        {children}
      </code>
    );
  },

  a: ({ href, title, children }) => {
    const safeHref = getSafeHref(href);

    if (!safeHref) {
      return <span className="text-neutral-300">{children}</span>;
    }

    const isExternal = /^(https?:\/\/)/i.test(safeHref);

    return (
      <a
        href={safeHref}
        title={title}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="
          font-medium
          text-violet-300
          underline
          decoration-violet-300/50
          underline-offset-[3px]
          transition-colors
          hover:text-violet-200
          hover:decoration-violet-200
          focus-visible:rounded-sm
          focus-visible:outline
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-violet-400
        "
      >
        {children}
      </a>
    );
  },

  table: ({ children }) => (
    <div className="my-4 max-w-full overflow-x-auto rounded-lg border border-white/[0.1] bg-white/[0.018] sm:my-5 sm:rounded-xl sm:border-white/[0.12] sm:bg-white/[0.02]">
      <table className="w-full min-w-[440px] border-collapse text-left text-[12px] leading-5 sm:min-w-[480px] sm:text-[13px] sm:leading-[1.6] [&_tr:last-child_td]:border-b-0">
        {children}
      </table>
    </div>
  ),

  thead: ({ children }) => (
    <thead className="bg-white/[0.045] text-white">{children}</thead>
  ),

  tbody: ({ children }) => (
    <tbody className="divide-y divide-white/[0.06]">{children}</tbody>
  ),

  tfoot: ({ children }) => (
    <tfoot className="border-t border-white/[0.08] bg-white/[0.03]">
      {children}
    </tfoot>
  ),

  tr: ({ children }) => (
    <tr className="transition-colors hover:bg-white/[0.025]">{children}</tr>
  ),

  th: ({ children, align }) => (
    <th
      style={{ textAlign: align ?? undefined }}
      className="border-b border-white/[0.09] px-2.5 py-2 text-left text-[12px] font-semibold leading-5 text-white sm:px-4 sm:py-3 sm:text-[13px] sm:leading-[1.6]"
    >
      {children}
    </th>
  ),

  td: ({ children, align }) => (
    <td
      style={{ textAlign: align ?? undefined }}
      className="border-b border-white/[0.06] px-2.5 py-2 align-top text-[12px] leading-5 text-neutral-300 sm:px-4 sm:py-3 sm:text-[13px] sm:leading-[1.6]"
    >
      {children}
    </td>
  ),

  img: ({ src, alt, title }) => {
    if (!src) return null;

    return (
      <figure className="mb-3 block w-full max-w-full whitespace-normal align-top sm:mb-4 sm:mr-4 sm:inline-block sm:w-[30%] sm:min-w-[180px] sm:last:mr-0">
        <div className="flex w-full justify-center overflow-hidden rounded-lg border border-white/[0.1] bg-white/[0.02] sm:rounded-xl sm:border-white/[0.12] sm:bg-white/[0.025]">
          <img
            src={src}
            alt={alt ?? ""}
            title={title}
            loading="lazy"
            className="block h-auto max-h-[360px] w-full max-w-full object-contain sm:max-h-[520px]"
          />
        </div>

        {alt ? (
          <figcaption className="mt-1.5 px-1 text-[11px] leading-4 text-neutral-400 sm:mt-2 sm:text-xs sm:leading-5">
            {alt}
          </figcaption>
        ) : null}
      </figure>
    );
  },

  sup: ({ children }) => (
    <sup className="text-[9px] font-medium text-violet-300 sm:text-[10px]">
      {children}
    </sup>
  ),

  sub: ({ children }) => (
    <sub className="text-[9px] font-medium text-fuchsia-300 sm:text-[10px]">
      {children}
    </sub>
  ),
};

export default markdownComponents;
