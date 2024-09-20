import { formatAddress } from "@/utils/format-address";

const _donors = Array.from(
  { length: 100 },
  (_v, i) => `0x${i}0F79bf6EB2c4f870365E785982E1f101E93b906`,
);

export default function Donators() {
  return (
    <section className="bg-gray-100 py-4 rounded-lg">
      <h2 className="px-4">Donors</h2>
      <ul className="px-4 overflow-y-auto max-h-[20rem] flex flex-col space-y-2">
        {_donors.map((d) => (
          <li key={d} className="flex items-center justify-between">
            <span title={d}>{formatAddress(d)}</span>
            <span>12</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
