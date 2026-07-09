export type SizeUnit = "inches" | "cm";

export interface SizeChartColumn {
  heelToe: string;
  uk: string;
  us: string;
  eu: string;
}

export interface SizeChartSectionData {
  id: "babiesToddlers" | "children" | "youthTeens";
  columns: Record<SizeUnit, SizeChartColumn[]>;
}

export const kidsShoesSizeChart: SizeChartSectionData[] = [
  {
    id: "babiesToddlers",
    columns: {
      inches: [
        { heelToe: '3.2"', uk: "0k", us: "1k", eu: "16" },
        { heelToe: '3.5"', uk: "1k", us: "2k", eu: "17" },
        { heelToe: '3.9"', uk: "2k", us: "3k", eu: "18" },
        { heelToe: '4.2"', uk: "3k", us: "4k", eu: "19" },
        { heelToe: '4.5"', uk: "4k", us: "5k", eu: "20" },
        { heelToe: '4.8"', uk: "5k", us: "5.5k", eu: "21" },
        { heelToe: '5.0"', uk: "5.5k", us: "6k", eu: "22" },
        { heelToe: '5.2"', uk: "6k", us: "6.5k", eu: "23" },
        { heelToe: '5.4"', uk: "6.5k", us: "7k", eu: "23.5" },
        { heelToe: '5.5"', uk: "7k", us: "7.5k", eu: "24" },
        { heelToe: '5.7"', uk: "7.5k", us: "8k", eu: "25" },
        { heelToe: '5.9"', uk: "8k", us: "8.5k", eu: "25.5" },
        { heelToe: '6.0"', uk: "8.5k", us: "9k", eu: "26" },
        { heelToe: '6.2"', uk: "9k", us: "9.5k", eu: "26.5" },
        { heelToe: '6.3"', uk: "9.5k", us: "10k", eu: "27" },
      ],
      cm: [
        { heelToe: "8.1 cm", uk: "0k", us: "1k", eu: "16" },
        { heelToe: "9 cm", uk: "1k", us: "2k", eu: "17" },
        { heelToe: "9.9 cm", uk: "2k", us: "3k", eu: "18" },
        { heelToe: "10.7 cm", uk: "3k", us: "4k", eu: "19" },
        { heelToe: "11.4 cm", uk: "4k", us: "5k", eu: "20" },
        { heelToe: "12.2 cm", uk: "5k", us: "5.5k", eu: "21" },
        { heelToe: "12.7 cm", uk: "5.5k", us: "6k", eu: "22" },
        { heelToe: "13.2 cm", uk: "6k", us: "6.5k", eu: "23" },
        { heelToe: "13.7 cm", uk: "6.5k", us: "7k", eu: "23.5" },
        { heelToe: "14 cm", uk: "7k", us: "7.5k", eu: "24" },
        { heelToe: "14.5 cm", uk: "7.5k", us: "8k", eu: "25" },
        { heelToe: "15 cm", uk: "8k", us: "8.5k", eu: "25.5" },
        { heelToe: "15.2 cm", uk: "8.5k", us: "9k", eu: "26" },
        { heelToe: "15.7 cm", uk: "9k", us: "9.5k", eu: "26.5" },
        { heelToe: "16 cm", uk: "9.5k", us: "10k", eu: "27" },
      ],
    },
  },
  {
    id: "children",
    columns: {
      inches: [
        { heelToe: '6.5"', uk: "10k", us: "10.5k", eu: "28" },
        { heelToe: '6.7"', uk: "10.5k", us: "11k", eu: "28.5" },
        { heelToe: '6.9"', uk: "11k", us: "11.5k", eu: "29" },
        { heelToe: '7.1"', uk: "11.5k", us: "12k", eu: "30" },
        { heelToe: '7.3"', uk: "12k", us: "12.5k", eu: "30.5" },
        { heelToe: '7.5"', uk: "12.5k", us: "13k", eu: "31" },
        { heelToe: '7.7"', uk: "13k", us: "13.5k", eu: "31.5" },
        { heelToe: '7.9"', uk: "13.5k", us: "1", eu: "32" },
        { heelToe: '8.1"', uk: "1", us: "1.5", eu: "33" },
        { heelToe: '8.3"', uk: "1.5", us: "2", eu: "33.5" },
      ],
      cm: [
        { heelToe: "16.5 cm", uk: "10k", us: "10.5k", eu: "28" },
        { heelToe: "17 cm", uk: "10.5k", us: "11k", eu: "28.5" },
        { heelToe: "17.5 cm", uk: "11k", us: "11.5k", eu: "29" },
        { heelToe: "18 cm", uk: "11.5k", us: "12k", eu: "30" },
        { heelToe: "18.5 cm", uk: "12k", us: "12.5k", eu: "30.5" },
        { heelToe: "19 cm", uk: "12.5k", us: "13k", eu: "31" },
        { heelToe: "19.5 cm", uk: "13k", us: "13.5k", eu: "31.5" },
        { heelToe: "20 cm", uk: "13.5k", us: "1", eu: "32" },
        { heelToe: "20.5 cm", uk: "1", us: "1.5", eu: "33" },
        { heelToe: "21 cm", uk: "1.5", us: "2", eu: "33.5" },
      ],
    },
  },
  {
    id: "youthTeens",
    columns: {
      inches: [
        { heelToe: '8.5"', uk: "2", us: "2.5", eu: "34" },
        { heelToe: '8.7"', uk: "2.5", us: "3", eu: "35" },
        { heelToe: '8.9"', uk: "3", us: "3.5", eu: "35.5" },
        { heelToe: '9.1"', uk: "3.5", us: "4", eu: "36" },
        { heelToe: '9.3"', uk: "4", us: "4.5", eu: "36.5" },
        { heelToe: '9.5"', uk: "4.5", us: "5", eu: "37" },
        { heelToe: '9.7"', uk: "5", us: "5.5", eu: "38" },
        { heelToe: '9.9"', uk: "5.5", us: "6", eu: "38.5" },
        { heelToe: '10.1"', uk: "6", us: "6.5", eu: "39" },
        { heelToe: '10.3"', uk: "6.5", us: "7", eu: "40" },
      ],
      cm: [
        { heelToe: "16.6 cm", uk: "10k", us: "10.5k", eu: "28" },
        { heelToe: "17 cm", uk: "10.5k", us: "11k", eu: "28.5" },
        { heelToe: "21.6 cm", uk: "3", us: "3.5", eu: "35.5" },
        { heelToe: "22.1 cm", uk: "3.5", us: "4", eu: "36" },
        { heelToe: "22.5 cm", uk: "4", us: "4.5", eu: "36.5" },
        { heelToe: "23 cm", uk: "4.5", us: "5", eu: "37" },
        { heelToe: "23.5 cm", uk: "5", us: "5.5", eu: "38" },
        { heelToe: "24 cm", uk: "5.5", us: "6", eu: "38.5" },
        { heelToe: "24.5 cm", uk: "6", us: "6.5", eu: "39" },
        { heelToe: "25 cm", uk: "6.5", us: "7", eu: "40" },
      ],
    },
  },
];
