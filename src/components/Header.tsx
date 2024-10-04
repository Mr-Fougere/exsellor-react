export default function Header() {
  return (
    <header
      id="head-banner"
      role="banner"
      className="justify-between border-b border-gray-300 py-1 px-3 bg-gray-100 select-none flex flex-row"
    >
      <div className="flex items-center">
        <img src="../96.png" alt="logo" className="h-6 w-max mr-1" />
        <span className="text-2l font-semibold text-gray-700 mr-1">
          Exsellor
        </span>
        <span className="text-gray-400 text-xs"> v2.2.1 </span>
      </div>
      <a
        className="text-sm opacity-50"
        href="https://github.com/Mr-Fougere/Exsellor"
      >
        <i className="fa-brands fa-github mr-1"></i>
        Mr-Fougere
      </a>
    </header>
  );
}
