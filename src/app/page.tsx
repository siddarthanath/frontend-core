export default function RootPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-8"
      style={{ background: "var(--color-background)" }}
    >
      <div className="text-center">
        <h1
          className="mb-2 text-2xl font-semibold"
          style={{ color: "var(--color-foreground)" }}
        >
          Welcome
        </h1>
        <p className="text-sm" style={{ color: "var(--color-muted)" }}>
          Replace this page in the product layer.
        </p>
      </div>
    </div>
  );
}
