export default function Footer() {
  return (
    <div className="h-10 bg-slate-700 text-slate-400 text-sm px-8 flex items-center justify-between">
      <p>&copy; 2023 Kaunas University of Technology</p>
      <p>
        Designed by{" "}
        <a
          href="https://github.com/jshimas"
          className="underline hover:text-slate-300"
        >
          jshimas
        </a>
      </p>
    </div>
  );
}
