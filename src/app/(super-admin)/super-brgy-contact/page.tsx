import { SubContact } from "../../../../types";

export default function SuperAdminBarangayContact() {
  const sampleData: SubContact[] = [
    {
      id: 1,
      barangay: "anos",
      email: "anos.brgy@example.com",
      captain: "Juan Anos",
      secretary: "Maria Anos",
      facebook: "https://www.facebook.com/anosbrgy",
      landline: "0491234001",
      contact: "09171230001",
      lat: 14.172,
      long: 121.242,
    },
    {
      id: 2,
      barangay: "bambang",
      email: "bambang.brgy@example.com",
      captain: "Juan Bambang",
      secretary: "Maria Bambang",
      facebook: "https://www.facebook.com/bambangbrgy",
      landline: "0491234002",
      contact: "09171230002",
      lat: 14.173,
      long: 121.243,
    },
    {
      id: 3,
      barangay: "batong-malake",
      email: "batongmalake.brgy@example.com",
      captain: "Juan Batong",
      secretary: "Maria Malake",
      facebook: "https://www.facebook.com/batongmalake",
      landline: "0491234003",
      contact: "09171230003",
      lat: 14.174,
      long: 121.244,
    },
    {
      id: 4,
      barangay: "baybayin",
      email: "baybayin.brgy@example.com",
      captain: "Juan Baybayin",
      secretary: "Maria Baybayin",
      facebook: "https://www.facebook.com/baybayinbrgy",
      landline: "0491234004",
      contact: "09171230004",
      lat: 14.175,
      long: 121.245,
    },
    {
      id: 5,
      barangay: "bagong-silang",
      email: "bagongsilang.brgy@example.com",
      captain: "Juan Silang",
      secretary: "Maria Silang",
      facebook: "https://www.facebook.com/bagongsilangbrgy",
      landline: "0491234005",
      contact: "09171230005",
      lat: 14.176,
      long: 121.246,
    },
    {
      id: 6,
      barangay: "bayog",
      email: "bayog.brgy@example.com",
      captain: "Juan Bayog",
      secretary: "Maria Bayog",
      facebook: "https://www.facebook.com/bayogbrgy",
      landline: "0491234006",
      contact: "09171230006",
      lat: 14.177,
      long: 121.247,
    },
    {
      id: 7,
      barangay: "lalakay",
      email: "lalakay.brgy@example.com",
      captain: "Juan Lalakay",
      secretary: "Maria Lalakay",
      facebook: "https://www.facebook.com/lalakaybrgy",
      landline: "0491234007",
      contact: "09171230007",
      lat: 14.178,
      long: 121.248,
    },
    {
      id: 8,
      barangay: "maahas",
      email: "maahas.brgy@example.com",
      captain: "Juan Maahas",
      secretary: "Maria Maahas",
      facebook: "https://www.facebook.com/maahasbrgy",
      landline: "0491234008",
      contact: "09171230008",
      lat: 14.179,
      long: 121.249,
    },
    {
      id: 9,
      barangay: "malinta",
      email: "malinta.brgy@example.com",
      captain: "Juan Malinta",
      secretary: "Maria Malinta",
      facebook: "https://www.facebook.com/malintabrgy",
      landline: "0491234009",
      contact: "09171230009",
      lat: 14.18,
      long: 121.25,
    },
    {
      id: 10,
      barangay: "mayondon",
      email: "mayondon.brgy@example.com",
      captain: "Juan Mayondon",
      secretary: "Maria Mayondon",
      facebook: "https://www.facebook.com/mayondonbrgy",
      landline: "0491234010",
      contact: "09171230010",
      lat: 14.181,
      long: 121.251,
    },
    {
      id: 11,
      barangay: "san-antonio",
      email: "sanantonio.brgy@example.com",
      captain: "Juan Antonio",
      secretary: "Maria Antonio",
      facebook: "https://www.facebook.com/sanantoniobrg",
      landline: "0491234011",
      contact: "09171230011",
      lat: 14.182,
      long: 121.252,
    },
    {
      id: 12,
      barangay: "tadlac",
      email: "tadlac.brgy@example.com",
      captain: "Juan Tadlac",
      secretary: "Maria Tadlac",
      facebook: "https://www.facebook.com/tadlacbrgy",
      landline: "0491234012",
      contact: "09171230012",
      lat: 14.183,
      long: 121.253,
    },
    {
      id: 13,
      barangay: "tuntungin-putho",
      email: "tuntunginputho.brgy@example.com",
      captain: "Juan Tuntungin",
      secretary: "Maria Putho",
      facebook: "https://www.facebook.com/tuntunginbrgy",
      landline: "0491234013",
      contact: "09171230013",
      lat: 14.184,
      long: 121.254,
    },
    {
      id: 14,
      barangay: "timugan",
      email: "timugan.brgy@example.com",
      captain: "Juan Timugan",
      secretary: "Maria Timugan",
      facebook: "https://www.facebook.com/timuganbrgy",
      landline: "0491234014",
      contact: "09171230014",
      lat: 14.185,
      long: 121.255,
    },
  ];

  const tdClass =
    "py-4 px-4 text-sm max-w-[150px] truncate   border-b border-gray-500/50 dark:text-gray-300";
  const thClass = " py-6 text-xs border-b border-gray-500/50 text-nowrap";

  return (
    <div className="relative h-screen w-full overflow-auto px-8 pt-10 transition-all duration-300">
      <div className="bg-dark-blue absolute -top-28 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full blur-[130px]"></div>

      <div className="flex items-center justify-center gap-3 border-b pb-6">
        <h1 className="text-dark-blue text-xl font-bold">
          Barangay Contact Information
        </h1>
      </div>

      <div className="scrollBar h-[85vh] w-full overflow-auto p-4">
        <table className="h-full max-h-[80vh] w-full overflow-hidden">
          <thead className="">
            <tr>
              <th className={thClass}>Barangay Name</th>
              <th className={thClass}>Captain</th>
              <th className={thClass}>Secretary</th>
              <th className={thClass}>Email</th>
              <th className={thClass}>Contact Number</th>
              <th className={thClass}>Landline</th>
              <th className={thClass}>Facebook Page</th>
            </tr>
          </thead>
          <tbody>
            {sampleData.map((data) => (
              <tr
                key={data.id}
                className="hover:bg-dark-blue/20 transition-colors duration-300"
              >
                <td className={tdClass}>{data.barangay}</td>
                <td className={tdClass}>{data.captain}</td>
                <td className={tdClass}>{data.secretary}</td>
                <td className={tdClass}>{data.email}</td>
                <td className={tdClass}>{data.contact}</td>
                <td className={tdClass}>{data.landline}</td>
                <td className={tdClass}>
                  <a
                    href={data.facebook}
                    target="_blank"
                    className="text-dark-blue text-sm hover:underline hover:underline-offset-8 hover:opacity-90"
                  >
                    Facebook
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
