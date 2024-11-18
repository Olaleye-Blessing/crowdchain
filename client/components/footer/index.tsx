export default function Footer() {
  return (
    <footer className="py-4 mt-auto border-t border-border">
      <div className="flex items-center justify-center flex-col sm:flex-row">
        <p className="text-center sm:w-1/3">
          Built by{" "}
          <a
            href="https://www.blessingolaleye.xyz/#experience"
            target="_blank"
            className="font-bold text-primary hover:underline"
          >
            Olaleye Blessing
          </a>
        </p>
        <p className="text-center sm:w-1/3">
          <a
            href="https://github.com/Olaleye-Blessing"
            target="_blank"
            className="font-bold text-primary hover:underline"
          >
            Github
          </a>
        </p>
        <p className="text-center sm:w-1/3">
          <a
            href="mailto:olaleyedev@gmail.com"
            target="_blank"
            className="font-bold text-primary hover:underline"
          >
            olaleyedev@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
}
