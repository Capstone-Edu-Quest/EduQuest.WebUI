import { darkTheme } from './../themes/darkTheme';

export interface IBarChartDataSet {
  label: string; // LABEL.XXXX
  data: number[];
}

export interface ILineChartDataSet {
  label: string; // LABEL.XXXX
  data: number[];
}

export interface IPieChartDataSet {
  label: string; // LABEL.XXXX
  data: number[];
}

export interface IRadarChartDataSet {
  label: string; // LABEL.XXXX
  data: number[];
}
