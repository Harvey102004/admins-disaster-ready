import Image from "next/image";
import { SubContact } from "../../../../types";

import { FaPhone } from "react-icons/fa6";

export default function SuperAdminBarangayContact() {
  const sampleData: SubContact[] = [
    {
      id: 1,
      barangay: "anos",
      captain: "Juan Anos",
      secretary: "Maria Anos",
      landline: "0491234001",
      contact: "09171230001",
      lat: 14.172,
      long: 121.242,
      email: "anos.brgy.superlongemailaddress@example.com",
      facebook:
        "https://www.facebook.com/anosbrgywithaverylongurlthatiswaytoolong",
    },
    {
      id: 2,
      barangay: "bambang",
      captain: "Juan Bambang",
      secretary: "Maria Bambang",
      landline: "0491234002",
      contact: "09171230002",
      lat: 14.173,
      long: 121.243,
      email: "bambang.brgy.superduperlongemailaddress@example.com",
      facebook:
        "https://www.facebook.com/bambangbarangayofficialpagethathasalongname",
    },
    {
      id: 3,
      barangay: "batong-malake",
      captain: "Juan Batong",
      secretary: "Maria Malake",
      landline: "0491234003",
      contact: "09171230003",
      lat: 14.174,
      long: 121.244,
      email: "batongmalake.veryveryverylongemailaddress@example.com",
      facebook:
        "https://www.facebook.com/batongmalakebarangayofficalpagethatkeepsgoing",
    },
    {
      id: 4,
      barangay: "baybayin",
      captain: "Juan Baybayin",
      secretary: "Maria Baybayin",
      landline: "0491234004",
      contact: "09171230004",
      lat: 14.175,
      long: 121.245,
      email: "baybayin.brgy@example.com",
      facebook: "https://www.facebook.com/baybayinbrgy",
    },
    {
      id: 5,
      barangay: "bagong-silang",
      captain: "Juan Silang",
      secretary: "Maria Silang",
      landline: "0491234005",
      contact: "09171230005",
      lat: 14.176,
      long: 121.246,
      email: "bagongsilang.brgy@example.com",
      facebook: "https://www.facebook.com/bagongsilangbrgy",
    },
    {
      id: 6,
      barangay: "bayog",
      captain: "Juan Bayog",
      secretary: "Maria Bayog",
      landline: "0491234006",
      contact: "09171230006",
      lat: 14.177,
      long: 121.247,
      email: "bayog.brgy@example.com",
      facebook: "https://www.facebook.com/bayogbrgy",
    },
    {
      id: 7,
      barangay: "lalakay",
      captain: "Juan Lalakay",
      secretary: "Maria Lalakay",
      landline: "0491234007",
      contact: "09171230007",
      lat: 14.178,
      long: 121.248,
      email: "lalakay.brgy@example.com",
      facebook: "https://www.facebook.com/lalakaybrgy",
    },
    {
      id: 8,
      barangay: "maahas",
      captain: "Juan Maahas",
      secretary: "Maria Maahas",
      landline: "0491234008",
      contact: "09171230008",
      lat: 14.179,
      long: 121.249,
      email: "maahas.brgy@example.com",
      facebook: "https://www.facebook.com/maahasbrgy",
    },
    {
      id: 9,
      barangay: "malinta",
      captain: "Juan Malinta",
      secretary: "Maria Malinta",
      landline: "0491234009",
      contact: "09171230009",
      lat: 14.18,
      long: 121.25,
      email: "malinta.brgy@example.com",
      facebook: "https://www.facebook.com/malintabrgy",
    },
    {
      id: 10,
      barangay: "mayondon",
      captain: "Juan Mayondon",
      secretary: "Maria Mayondon",
      landline: "0491234010",
      contact: "09171230010",
      lat: 14.181,
      long: 121.251,
      email: "mayondon.brgy@example.com",
      facebook: "https://www.facebook.com/mayondonbrgy",
    },
    {
      id: 11,
      barangay: "san-antonio",
      captain: "Juan Antonio",
      secretary: "Maria Antonio",
      landline: "0491234011",
      contact: "09171230011",
      lat: 14.182,
      long: 121.252,
      email: "sanantonio.brgy@example.com",
      facebook: "https://www.facebook.com/sanantoniobrg",
    },
    {
      id: 12,
      barangay: "tadlac",
      captain: "Juan Tadlac",
      secretary: "Maria Tadlac",
      landline: "0491234012",
      contact: "09171230012",
      lat: 14.183,
      long: 121.253,
      email: "tadlac.brgy@example.com",
      facebook: "https://www.facebook.com/tadlacbrgy",
    },
    {
      id: 13,
      barangay: "tuntungin-putho",
      captain: "Juan Tuntungin",
      secretary: "Maria Putho",
      landline: "0491234013",
      contact: "09171230013",
      lat: 14.184,
      long: 121.254,
      email: "tuntunginputho.brgy@example.com",
      facebook: "https://www.facebook.com/tuntunginbrgy",
    },
    {
      id: 14,
      barangay: "timugan",
      captain: "Juan Timugan",
      secretary: "Maria Timugan",
      landline: "0491234014",
      contact: "09171230014",
      lat: 14.185,
      long: 121.255,
      email: "timugan.brgy@example.com",
      facebook: "https://www.facebook.com/timuganbrgy",
    },
  ];

  return (
    <div className="relative h-screen w-full overflow-hidden pl-8 transition-all duration-300">
      <div className="p-6">
        <h2 className="text-dark-blue mb-7 flex items-center gap-3 text-xl font-bold">
          <FaPhone />
          Barangay Contact Information
        </h2>
        <div className="scrollBar relative max-h-[85vh] overflow-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-background sticky top-0 z-50">
              <tr>
                <th className="p-2 text-left font-semibold">Barangay</th>
                <th className="p-2 text-left font-semibold">Captain</th>
                <th className="p-2 text-left font-semibold">Secretary</th>
                <th className="p-2 text-left font-semibold">Contact no. </th>
                <th className="p-2 text-left font-semibold">Landline</th>
                <th className="p-2 text-left font-semibold">Email</th>
                <th className="p-2 text-left font-semibold">Facebook</th>
              </tr>
            </thead>
            <tbody>
              {sampleData.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="flex items-center gap-4 p-2 capitalize">
                    <Image
                      src={`/logos/${item.barangay.toLowerCase()}-logo.png`}
                      height={30}
                      width={30}
                      alt={item.barangay}
                    />
                    {item.barangay}
                  </td>
                  <td className="p-2">{item.captain}</td>
                  <td className="p-2">{item.secretary}</td>
                  <td className="p-2">{item.contact}</td>
                  <td className="p-2">{item.landline}</td>
                  <td className="max-w-[150px] truncate p-2">
                    <a href={`mailto:${item.email}`} className="">
                      {item.email}
                    </a>
                  </td>
                  <td className="max-w-[150px] truncate p-2">
                    <a
                      href={item.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {item.facebook}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
