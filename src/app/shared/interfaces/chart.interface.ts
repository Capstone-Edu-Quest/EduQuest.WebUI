import { darkTheme } from './../themes/darkTheme';

export interface IBarChartDataSet {
  label: string; // LABEL.XXXX
  backgroundColor: keyof typeof darkTheme; // color code
  hoverBackgroundColor: keyof typeof darkTheme; // color code
  borderColor: keyof typeof darkTheme; // color code
  hoverBorderColor: keyof typeof darkTheme; // color code
  data: number[];
}

export interface ILineChartDataSet {
  label: string; // LABEL.XXXX
  backgroundColor: keyof typeof darkTheme; // color code
  borderColor: keyof typeof darkTheme; // color code
  pointBackgroundColor: keyof typeof darkTheme; // color code
  pointBorderColor: keyof typeof darkTheme; // color code
  data: number[];
}

export interface IPieChartDataSet {
  label: string; // LABEL.XXXX
  data: number[];
  backgroundColor: (keyof typeof darkTheme)[];
  hoverBackgroundColor: (keyof typeof darkTheme)[];
  borderColor: keyof typeof darkTheme;
}

export interface IRadarChartDataSet {
  label: string; // LABEL.XXXX
  data: number[];
  backgroundColor: string; // Fill color
  borderColor: string; // Border color
  pointBackgroundColor: string; // Points color
  pointBorderColor: string; // Point border color
  pointHoverBackgroundColor: string; // Hover background color
  pointHoverBorderColor: string; // Hover border color
  isUseThemeColor?: boolean;
}
